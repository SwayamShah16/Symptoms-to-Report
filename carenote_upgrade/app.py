"""CareNote — local-first symptom summary application.

Educational prototype only. Do not use as a medical device or real-world triage service.
"""
import os, json, sqlite3, smtplib, secrets
from email.message import EmailMessage
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from collections import Counter
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import Flask, render_template, request, send_file, redirect, url_for, flash, session, g, abort, jsonify, make_response
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from modules.data_pipeline import get_all_symptoms
from modules.model import get_model
from modules.safety_screening import check_warning_signs
from modules.report_generator import build_pdf

BASE_DIR = Path(__file__).resolve().parent
ALLOWED_LANGUAGES = {"en", "hi", "mr"}

def utc_now():
    return datetime.now(timezone.utc).isoformat()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    app.config.update(
        SECRET_KEY=os.environ.get("FLASK_SECRET_KEY") or "dev-only-change-this-key-before-deployment",
        DATABASE=os.environ.get("SYMPTOM_APP_DATABASE", str(Path(app.instance_path) / "users.sqlite3")),
        MAX_CONTENT_LENGTH=64 * 1024, SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "0") == "1",
        PERMANENT_SESSION_LIFETIME=60 * 60 * 8, RESET_TOKEN_MAX_AGE=1800,
        MAIL_HOST=os.environ.get("MAIL_HOST", ""), MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME", ""), MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD", ""),
        MAIL_FROM=os.environ.get("MAIL_FROM", ""),
    )
    if test_config: app.config.update(test_config)
    if os.environ.get("APP_ENV", "development").lower() == "production" and not os.environ.get("FLASK_SECRET_KEY"):
        raise RuntimeError("FLASK_SECRET_KEY must be configured when APP_ENV=production")
    if not app.config.get("TESTING") and app.config["SECRET_KEY"] == "dev-only-change-this-key-before-deployment":
        app.logger.warning("Using development SECRET_KEY. Set FLASK_SECRET_KEY before deployment.")
    CSRFProtect(app)

    def connect_db():
        conn = sqlite3.connect(app.config["DATABASE"])
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    def init_db():
        with connect_db() as db:
            db.execute("PRAGMA journal_mode = WAL")
            db.execute("""CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL, created_at TEXT NOT NULL, preferred_language TEXT NOT NULL DEFAULT 'en')""")
            # Add language to older databases without destroying existing accounts.
            cols = {r[1] for r in db.execute("PRAGMA table_info(users)").fetchall()}
            if "preferred_language" not in cols:
                db.execute("ALTER TABLE users ADD COLUMN preferred_language TEXT NOT NULL DEFAULT 'en'")
            db.execute("""CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
                title TEXT NOT NULL DEFAULT 'Symptom summary', report_json TEXT NOT NULL,
                created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)""")
            db.execute("CREATE INDEX IF NOT EXISTS idx_reports_user_created ON reports(user_id, created_at DESC)")
    init_db()

    @app.before_request
    def load_user():
        g.user = None
        uid = session.get("user_id")
        if uid:
            with connect_db() as db: g.user = db.execute("SELECT id,email,created_at,preferred_language FROM users WHERE id=?", (uid,)).fetchone()
            if g.user is None: session.clear()
        g.language = session.get("language") or (g.user["preferred_language"] if g.user else "en")
        if g.language not in ALLOWED_LANGUAGES: g.language = "en"

    @app.context_processor
    def inject_context():
        return {"current_user": g.get("user"), "language": g.get("language", "en")}

    @app.after_request
    def security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Cache-Control", "no-store")
        response.headers.setdefault("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self'")
        return response

    def login_required(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if g.user is None:
                flash("Sign in to continue.", "info")
                return redirect(url_for("login", next=request.path))
            return view(*args, **kwargs)
        return wrapped

    def get_owned_report(report_id):
        with connect_db() as db:
            row = db.execute("SELECT * FROM reports WHERE id=? AND user_id=?", (report_id, g.user["id"])).fetchone()
        if row is None: abort(404)
        report = json.loads(row["report_json"])
        report.update(id=row["id"], title=row["title"], created_at=row["created_at"], updated_at=row["updated_at"])
        return report

    def save_report(user_id, report, report_id=None, title=None):
        now = utc_now()
        title = (title or (" / ".join(report.get("symptoms", [])[:2]) or "Symptom summary"))[:100]
        payload = json.dumps(report, ensure_ascii=False)
        with connect_db() as db:
            if report_id is None:
                cur = db.execute("INSERT INTO reports(user_id,title,report_json,created_at,updated_at) VALUES(?,?,?,?,?)", (user_id,title,payload,now,now))
                return cur.lastrowid
            cur = db.execute("UPDATE reports SET title=?,report_json=?,updated_at=? WHERE id=? AND user_id=?", (title,payload,now,report_id,user_id))
            if not cur.rowcount: abort(404)
            return report_id

    def prepare_report(form):
        options = {x["key"]: x["label"] for x in get_all_symptoms()}
        selected = sorted(set(k for k in form.getlist("symptoms") if k in options))
        if not selected: return None, "Select at least one symptom to create a summary."
        severity = form.get("severity", "unsure").strip().lower()
        if severity not in {"mild", "moderate", "severe", "unsure"}: severity = "unsure"
        duration = form.get("duration", "").strip()[:100] or "Not provided"
        progression = form.get("progression", "").strip().lower()
        if progression not in {"improving", "unchanged", "worsening", "comes_goes", "unsure"}: progression = "unsure"
        analysis = get_model().predict(selected)
        warning = check_warning_signs(selected)

        # Optional self-reported measurements are stored inside this report snapshot.
        def number_field(name, minimum, maximum):
            raw = form.get(name, "").strip()
            if not raw:
                return None
            try:
                value = float(raw)
            except (TypeError, ValueError):
                return None
            return value if minimum <= value <= maximum else None

        height_cm = number_field("height_cm", 50, 250)
        weight_kg = number_field("weight_kg", 2, 500)
        bmi = round(weight_kg / ((height_cm / 100) ** 2), 1) if height_cm and weight_kg else None
        bp_sys = number_field("bp_systolic", 40, 300)
        bp_dia = number_field("bp_diastolic", 20, 200)
        temp_value = number_field("temperature_value", 25, 115)
        temp_unit = form.get("temperature_unit", "C").upper()
        if temp_unit not in {"C", "F"}: temp_unit = "C"
        if temp_value is not None and temp_unit == "C" and temp_value > 50: temp_value = None
        if temp_value is not None and temp_unit == "F" and temp_value > 122: temp_value = None
        pulse = number_field("pulse_bpm", 20, 300)
        today = datetime.now(timezone.utc).date().isoformat()
        health_records = {
            "height_cm": height_cm, "weight_kg": weight_kg, "bmi": bmi,
            "bmi_category": ("Underweight" if bmi < 18.5 else "Healthy weight range" if bmi < 25 else "Overweight range" if bmi < 30 else "Obesity range") if bmi is not None else None,
            "blood_pressure": {"systolic": bp_sys, "diastolic": bp_dia, "date": (form.get("bp_date", "").strip()[:10] or today)} if bp_sys is not None and bp_dia is not None else None,
            "temperature": {"value": temp_value, "unit": temp_unit, "date": (form.get("temperature_date", "").strip()[:10] or today)} if temp_value is not None else None,
            "pulse": {"bpm": pulse, "date": (form.get("pulse_date", "").strip()[:10] or today)} if pulse is not None else None,
            "medications": [{"name": parts[0][:120], "dosage": parts[1][:120] if len(parts) > 1 else "", "schedule": parts[2][:160] if len(parts) > 2 else ""} for line in form.get("medication_list", "").splitlines() if line.strip() for parts in [[part.strip() for part in line.split("|")]]],
        }
        health_records = {key: value for key, value in health_records.items() if value is not None and value != []}
        appointment_questions = form.get("appointment_questions", "").strip()[:1200]
        return {"generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                "selected_keys": selected, "symptoms": [options[k] for k in selected], "duration": duration,
                "severity": severity.title(), "progression": progression.replace("_", " ").title(),
                "notes": form.get("notes", "").strip()[:1200] or "None provided", "analysis": analysis, "warning": warning,
                "health_records": health_records, "appointment_questions": appointment_questions,
                "language": g.language}, None

    @app.get("/")
    def landing(): return render_template("landing.html", title="CareNote")

    @app.post("/language")
    def set_language():
        lang = request.form.get("language", "en")
        if lang not in ALLOWED_LANGUAGES: lang = "en"
        session["language"] = lang
        if g.user:
            with connect_db() as db: db.execute("UPDATE users SET preferred_language=? WHERE id=?", (lang,g.user["id"]))
        flash("Language preference updated.", "success")
        return redirect(request.referrer if request.referrer and request.referrer.startswith("/") and not request.referrer.startswith("//") else url_for("landing"))

    @app.route("/register", methods=["GET","POST"])
    def register():
        if g.user: return redirect(url_for("dashboard"))
        if request.method == "POST":
            email = request.form.get("email", "").strip().lower()[:254]
            password, confirm = request.form.get("password", ""), request.form.get("confirm_password", "")
            if "@" not in email or len(email)<5 or any(c.isspace() for c in email): flash("Enter a valid email address.", "danger")
            elif len(password)<12: flash("Use a password with at least 12 characters.", "danger")
            elif password != confirm: flash("The passwords do not match.", "danger")
            else:
                try:
                    with connect_db() as db:
                        cur = db.execute("INSERT INTO users(email,password_hash,created_at,preferred_language) VALUES(?,?,?,?)", (email,generate_password_hash(password),utc_now(),g.language))
                        uid=cur.lastrowid
                    session.clear(); session["user_id"]=uid; session["language"]=g.language; session.permanent=True
                    return redirect(url_for("dashboard"))
                except sqlite3.IntegrityError: flash("An account with that email already exists.", "warning")
        return render_template("auth.html", mode="register", title="Create account")

    @app.route("/login", methods=["GET","POST"])
    def login():
        if g.user: return redirect(url_for("dashboard"))
        if request.method == "POST":
            email=request.form.get("email","").strip().lower()[:254]; password=request.form.get("password","")
            with connect_db() as db: user=db.execute("SELECT id,email,password_hash,preferred_language FROM users WHERE email=?",(email,)).fetchone()
            if user and check_password_hash(user["password_hash"],password):
                session.clear(); session["user_id"]=user["id"]; session["language"]=user["preferred_language"]; session.permanent=True
                dest=request.args.get("next","")
                return redirect(dest if dest.startswith("/") and not dest.startswith("//") else url_for("dashboard"))
            flash("Email or password was not recognized.","danger")
        return render_template("auth.html",mode="login",title="Sign in")

    @app.post("/logout")
    def logout(): session.clear(); flash("You have been signed out.","success"); return redirect(url_for("landing"))

    @app.route("/forgot-password", methods=["GET","POST"])
    def forgot_password():
        if request.method=="POST":
            email=request.form.get("email","").strip().lower()[:254]
            with connect_db() as db: user=db.execute("SELECT id,email FROM users WHERE email=?",(email,)).fetchone()
            if user and app.config.get("MAIL_HOST") and app.config.get("MAIL_FROM"):
                token=URLSafeTimedSerializer(app.config["SECRET_KEY"]).dumps({"uid":user["id"],"email":user["email"]},salt="password-reset")
                msg=EmailMessage(); msg["Subject"]="CareNote password reset"; msg["From"]=app.config["MAIL_FROM"]; msg["To"]=user["email"]
                msg.set_content(f"Use this link within 30 minutes:\n{url_for('reset_password',token=token,_external=True)}\nIf you did not request this, ignore this email.")
                try:
                    with smtplib.SMTP(app.config["MAIL_HOST"],app.config["MAIL_PORT"],timeout=10) as smtp:
                        smtp.starttls()
                        if app.config.get("MAIL_USERNAME"): smtp.login(app.config["MAIL_USERNAME"],app.config.get("MAIL_PASSWORD",""))
                        smtp.send_message(msg)
                except (OSError,smtplib.SMTPException): app.logger.exception("Password reset email failed")
            flash("If that account exists and email delivery is configured, a reset link will be sent.","info"); return redirect(url_for("login"))
        return render_template("auth.html",mode="forgot",title="Reset password")

    @app.route("/reset-password/<token>", methods=["GET","POST"])
    def reset_password(token):
        try: data=URLSafeTimedSerializer(app.config["SECRET_KEY"]).loads(token,salt="password-reset",max_age=app.config["RESET_TOKEN_MAX_AGE"])
        except (BadSignature,SignatureExpired): flash("That reset link is invalid or expired.","danger"); return redirect(url_for("forgot_password"))
        if request.method=="POST":
            password=request.form.get("password",""); confirm=request.form.get("confirm_password","")
            if len(password)<12: flash("Use a password with at least 12 characters.","danger")
            elif password!=confirm: flash("The passwords do not match.","danger")
            else:
                with connect_db() as db: db.execute("UPDATE users SET password_hash=? WHERE id=? AND email=?",(generate_password_hash(password),data["uid"],data["email"]))
                flash("Password updated. Sign in again.","success"); return redirect(url_for("login"))
        return render_template("auth.html",mode="reset",title="Choose a new password")

    @app.get("/dashboard")
    @login_required
    def dashboard():
        with connect_db() as db: rows=db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? ORDER BY created_at DESC",(g.user["id"],)).fetchall()
        reports=[]; severity=Counter(); symptom_counts=Counter()
        for row in rows:
            data=json.loads(row["report_json"]); reports.append({"id":row["id"],"title":row["title"],"created_at":row["created_at"],"symptoms":data.get("symptoms",[]),"severity":data.get("severity","Unsure")})
            severity[data.get("severity","Unsure")]+=1; symptom_counts.update(data.get("symptoms",[]))
        severity_rows=[{"label": label, "count": count, "percent": round(count / max(1, sum(severity.values())) * 100)} for label, count in severity.most_common()]
        top_symptoms=[{"label": label, "count": count, "percent": round(count / max(1, symptom_counts.most_common(1)[0][1]) * 100)} for label, count in symptom_counts.most_common(6)]
        return render_template("dashboard.html",title="Dashboard",reports=reports[:5],total=len(reports),severity_rows=severity_rows,top_symptoms=top_symptoms,model_available=get_model().available)

    @app.get("/new-report")
    @login_required
    def new_report(): return render_template("wizard.html",title="New symptom summary",symptoms=get_all_symptoms(),selected_keys=[],report_form=None)

    @app.post("/analyze")
    @login_required
    def analyze():
        report,error=prepare_report(request.form)
        if error: return render_template("wizard.html",title="New symptom summary",symptoms=get_all_symptoms(),error=error,selected_keys=request.form.getlist("symptoms"),report_form=request.form),400
        rid=save_report(g.user["id"],report)
        return redirect(url_for("report_detail",report_id=rid))

    @app.get("/reports")
    @login_required
    def report_history():
        q=request.args.get("q","").strip()[:100]
        with connect_db() as db:
            if q: rows=db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? AND (title LIKE ? OR report_json LIKE ?) ORDER BY created_at DESC",(g.user["id"],f"%{q}%",f"%{q}%")).fetchall()
            else: rows=db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? ORDER BY created_at DESC",(g.user["id"],)).fetchall()
        reports=[]
        for row in rows:
            data=json.loads(row["report_json"]); reports.append({"id":row["id"],"title":row["title"],"created_at":row["created_at"],"updated_at":row["updated_at"],"symptoms":data.get("symptoms",[]),"severity":data.get("severity","Unsure")})
        return render_template("history.html",title="Report history",reports=reports,q=q)

    @app.get("/reports/<int:report_id>")
    @login_required
    def report_detail(report_id): return render_template("result.html",title="Symptom summary",report=get_owned_report(report_id),saved=True)

    @app.route("/reports/<int:report_id>/edit",methods=["GET","POST"])
    @login_required
    def edit_report(report_id):
        saved=get_owned_report(report_id)
        if request.method=="POST":
            report,error=prepare_report(request.form)
            if error: return render_template("wizard.html",title="Edit summary",symptoms=get_all_symptoms(),error=error,selected_keys=request.form.getlist("symptoms"),report_form=request.form,edit_id=report_id),400
            save_report(g.user["id"],report,report_id=report_id,title=request.form.get("title","").strip() or None); flash("Report updated.","success"); return redirect(url_for("report_detail",report_id=report_id))
        return render_template("wizard.html",title="Edit summary",symptoms=get_all_symptoms(),selected_keys=saved.get("selected_keys",[]),report_form=saved,edit_id=report_id)

    @app.post("/reports/<int:report_id>/delete")
    @login_required
    def delete_report(report_id):
        with connect_db() as db: cur=db.execute("DELETE FROM reports WHERE id=? AND user_id=?",(report_id,g.user["id"]))
        if not cur.rowcount: abort(404)
        flash("Report deleted.","success"); return redirect(url_for("report_history"))

    @app.post("/report.pdf")
    @login_required
    def report_pdf():
        report,error=prepare_report(request.form)
        if error: return error,400
        return send_file(build_pdf(report),mimetype="application/pdf",as_attachment=True,download_name="carenote_symptom_summary.pdf")

    @app.get("/reports/<int:report_id>/export.pdf")
    @login_required
    def export_saved_report(report_id): return send_file(build_pdf(get_owned_report(report_id)),mimetype="application/pdf",as_attachment=True,download_name=f"carenote_report_{report_id}.pdf")

    @app.get("/reports/export.json")
    @login_required
    def export_data():
        with connect_db() as db: rows=db.execute("SELECT title,report_json,created_at,updated_at FROM reports WHERE user_id=? ORDER BY created_at DESC",(g.user["id"],)).fetchall()
        payload={"exported_at":utc_now(),"format_version":1,"reports":[{"title":r["title"],"report":json.loads(r["report_json"]),"created_at":r["created_at"],"updated_at":r["updated_at"]} for r in rows]}
        response=make_response(json.dumps(payload,ensure_ascii=False,indent=2)); response.headers["Content-Type"]="application/json; charset=utf-8"; response.headers["Content-Disposition"]="attachment; filename=carenote-data-export.json"; return response

    @app.post("/account/delete")
    @login_required
    def delete_account():
        if request.form.get("confirm") != "DELETE": flash("Type DELETE to confirm account removal.","danger"); return redirect(url_for("profile"))
        with connect_db() as db: db.execute("DELETE FROM users WHERE id=?",(g.user["id"],))
        session.clear(); flash("Your local account and saved reports were deleted.","success"); return redirect(url_for("landing"))

    @app.route("/profile",methods=["GET","POST"])
    @login_required
    def profile():
        if request.method=="POST":
            current=request.form.get("current_password",""); new=request.form.get("new_password",""); confirm=request.form.get("confirm_password","")
            with connect_db() as db: row=db.execute("SELECT password_hash FROM users WHERE id=?",(g.user["id"],)).fetchone()
            if not row or not check_password_hash(row["password_hash"],current): flash("Current password was not recognized.","danger")
            elif len(new)<12: flash("Use a password with at least 12 characters.","danger")
            elif new!=confirm: flash("The passwords do not match.","danger")
            else:
                with connect_db() as db: db.execute("UPDATE users SET password_hash=? WHERE id=?",(generate_password_hash(new),g.user["id"]))
                session.clear(); flash("Password changed. Sign in again.","success"); return redirect(url_for("login"))
        return render_template("profile.html",title="Profile",user=g.user)

    @app.get("/about-model")
    def about_model():
        model=get_model(); return render_template("model_info.html",title="Model transparency",model=model,stats=model.dataset_stats,metrics=model.evaluation)

    @app.get("/healthz")
    def healthz(): return jsonify({"status":"ok","application":"CareNote","model_available":get_model().available,"dataset_available":get_model().dataset_stats.get("dataset_available",False)})

    return app

app=create_app()
if __name__=="__main__":
    # Local development only. Use a production WSGI server for deployment.
    app.run(host="127.0.0.1",port=int(os.environ.get("PORT","5000")),debug=False)
