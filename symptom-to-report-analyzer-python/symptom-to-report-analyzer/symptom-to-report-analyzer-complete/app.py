import os
import json
import sqlite3
import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from collections import Counter
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import Flask, render_template, request, send_file, redirect, url_for, flash, session, g, abort
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from modules.data_pipeline import get_all_symptoms
from modules.model import get_model
from modules.safety_screening import check_warning_signs
from modules.report_generator import build_pdf

BASE_DIR = Path(__file__).resolve().parent


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)
    app.config.update(
        SECRET_KEY=os.environ.get("FLASK_SECRET_KEY", "local-development-key-change-before-deployment"),
        DATABASE=os.environ.get("SYMPTOM_APP_DATABASE", str(Path(app.instance_path) / "users.sqlite3")),
        MAX_CONTENT_LENGTH=32 * 1024,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,  # Set True behind HTTPS in production.
        PERMANENT_SESSION_LIFETIME=60 * 60 * 8,
        RESET_TOKEN_MAX_AGE=1800,
        MAIL_HOST=os.environ.get("MAIL_HOST", ""),
        MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME", ""),
        MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD", ""),
        MAIL_FROM=os.environ.get("MAIL_FROM", ""),
        MAIL_USE_TLS=True,
    )
    if test_config:
        app.config.update(test_config)
    CSRFProtect(app)

    def connect_db():
        connection = sqlite3.connect(app.config["DATABASE"])
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def init_db():
        with connect_db() as db:
            db.execute("""CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )""")
            db.execute("""CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL DEFAULT 'Symptom summary',
                report_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )""")

    init_db()

    @app.before_request
    def load_user():
        g.user = None
        user_id = session.get("user_id")
        if user_id:
            with connect_db() as db:
                g.user = db.execute("SELECT id, email, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
            if g.user is None:
                session.clear()

    @app.context_processor
    def inject_user():
        return {"current_user": g.get("user")}

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
            row = db.execute("SELECT * FROM reports WHERE id = ? AND user_id = ?", (report_id, g.user["id"])).fetchone()
        if row is None:
            abort(404)
        report = json.loads(row["report_json"])
        report["id"] = row["id"]
        report["title"] = row["title"]
        report["created_at"] = row["created_at"]
        report["updated_at"] = row["updated_at"]
        return report

    def save_report(user_id, report, report_id=None, title=None):
        now = datetime.now(timezone.utc).isoformat()
        title = (title or (" / ".join(report.get("symptoms", [])[:2]) or "Symptom summary"))[:100]
        payload = json.dumps(report, ensure_ascii=False)
        with connect_db() as db:
            if report_id is None:
                cur = db.execute("INSERT INTO reports(user_id,title,report_json,created_at,updated_at) VALUES(?,?,?,?,?)",
                                 (user_id, title, payload, now, now))
                return cur.lastrowid
            cur = db.execute("UPDATE reports SET title=?, report_json=?, updated_at=? WHERE id=? AND user_id=?",
                             (title, payload, now, report_id, user_id))
            if cur.rowcount == 0:
                abort(404)
            return report_id

    @app.get("/")
    def landing():
        return render_template("landing.html")

    @app.route("/register", methods=["GET", "POST"])
    def register():
        if g.user:
            return redirect(url_for("dashboard"))
        if request.method == "POST":
            email = request.form.get("email", "").strip().lower()[:254]
            password = request.form.get("password", "")
            confirm = request.form.get("confirm_password", "")
            if "@" not in email or len(email) < 5 or any(c.isspace() for c in email):
                flash("Enter a valid email address.", "danger")
            elif len(password) < 10:
                flash("Use a password with at least 10 characters.", "danger")
            elif password != confirm:
                flash("The passwords do not match.", "danger")
            else:
                try:
                    with connect_db() as db:
                        cursor = db.execute("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
                            (email, generate_password_hash(password), datetime.now(timezone.utc).isoformat()))
                        user_id = cursor.lastrowid
                    session.clear(); session["user_id"] = user_id; session.permanent = True
                    return redirect(url_for("dashboard"))
                except sqlite3.IntegrityError:
                    flash("An account with that email already exists. Try signing in.", "warning")
        return render_template("auth.html", mode="register")

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if g.user:
            return redirect(url_for("dashboard"))
        if request.method == "POST":
            email = request.form.get("email", "").strip().lower()[:254]
            password = request.form.get("password", "")
            with connect_db() as db:
                user = db.execute("SELECT id, email, password_hash FROM users WHERE email = ?", (email,)).fetchone()
            if user and check_password_hash(user["password_hash"], password):
                session.clear(); session["user_id"] = user["id"]; session.permanent = True
                destination = request.args.get("next", "")
                if not destination.startswith("/") or destination.startswith("//"):
                    destination = url_for("dashboard")
                return redirect(destination)
            flash("Email or password was not recognized.", "danger")
        return render_template("auth.html", mode="login")

    @app.route("/forgot-password", methods=["GET", "POST"])
    def forgot_password():
        if request.method == "POST":
            email = request.form.get("email", "").strip().lower()[:254]
            # Same public response whether an account exists or not.
            with connect_db() as db:
                user = db.execute("SELECT id, email FROM users WHERE email = ?", (email,)).fetchone()
            if user and app.config.get("MAIL_HOST") and app.config.get("MAIL_FROM"):
                serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
                token = serializer.dumps({"uid": user["id"], "email": user["email"]}, salt="password-reset")
                reset_url = url_for("reset_password", token=token, _external=True)
                message = EmailMessage()
                message["Subject"] = "CareNote password reset"
                message["From"] = app.config["MAIL_FROM"]
                message["To"] = user["email"]
                message.set_content(f"Use this password reset link within 30 minutes:\n\n{reset_url}\n\nIf you did not request this, ignore this email.")
                try:
                    with smtplib.SMTP(app.config["MAIL_HOST"], app.config["MAIL_PORT"], timeout=10) as smtp:
                        smtp.starttls();
                        if app.config.get("MAIL_USERNAME"):
                            smtp.login(app.config["MAIL_USERNAME"], app.config.get("MAIL_PASSWORD", ""))
                        smtp.send_message(message)
                except (OSError, smtplib.SMTPException):
                    app.logger.exception("Password reset email could not be sent")
            flash("If that account exists and email delivery is configured, a reset link will be sent.", "info")
            return redirect(url_for("login"))
        return render_template("auth.html", mode="forgot")

    @app.route("/reset-password/<token>", methods=["GET", "POST"])
    def reset_password(token):
        serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
        try:
            data = serializer.loads(token, salt="password-reset", max_age=app.config["RESET_TOKEN_MAX_AGE"])
        except (BadSignature, SignatureExpired):
            flash("That reset link is invalid or has expired. Request a new one.", "danger")
            return redirect(url_for("forgot_password"))
        if request.method == "POST":
            password = request.form.get("password", "")
            confirm = request.form.get("confirm_password", "")
            if len(password) < 10:
                flash("Use a password with at least 10 characters.", "danger")
            elif password != confirm:
                flash("The passwords do not match.", "danger")
            else:
                with connect_db() as db:
                    db.execute("UPDATE users SET password_hash=? WHERE id=? AND email=?",
                               (generate_password_hash(password), data["uid"], data["email"]))
                flash("Password updated. Sign in with your new password.", "success")
                return redirect(url_for("login"))
        return render_template("auth.html", mode="reset")

    @app.post("/logout")
    def logout():
        session.clear()
        flash("You have been signed out.", "success")
        return redirect(url_for("landing"))

    @app.get("/dashboard")
    @login_required
    def dashboard():
        with connect_db() as db:
            rows = db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? ORDER BY created_at DESC", (g.user["id"],)).fetchall()
        reports = []
        severity_counts = Counter()
        symptom_counts = Counter()
        for row in rows:
            data = json.loads(row["report_json"])
            reports.append({"id": row["id"], "title": row["title"], "created_at": row["created_at"],
                            "updated_at": row["updated_at"], "symptoms": data.get("symptoms", []),
                            "severity": data.get("severity", "Unsure")})
            severity_counts[data.get("severity", "Unsure")] += 1
            symptom_counts.update(data.get("symptoms", []))
        recent = reports[:5]
        chart_labels = list(severity_counts.keys())
        chart_values = [severity_counts[k] for k in chart_labels]
        frequent_labels = [x[0] for x in symptom_counts.most_common(5)]
        frequent_values = [x[1] for x in symptom_counts.most_common(5)]
        return render_template("dashboard.html", reports=recent, total=len(reports),
            severity_labels=json.dumps(chart_labels), severity_values=json.dumps(chart_values),
            symptom_labels=json.dumps(frequent_labels), symptom_values=json.dumps(frequent_values))

    @app.get("/reports")
    @login_required
    def report_history():
        q = request.args.get("q", "").strip()[:100]
        with connect_db() as db:
            if q:
                rows = db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? AND (title LIKE ? OR report_json LIKE ?) ORDER BY created_at DESC",
                                  (g.user["id"], f"%{q}%", f"%{q}%")).fetchall()
            else:
                rows = db.execute("SELECT id,title,report_json,created_at,updated_at FROM reports WHERE user_id=? ORDER BY created_at DESC", (g.user["id"],)).fetchall()
        reports = []
        for row in rows:
            data = json.loads(row["report_json"])
            reports.append({"id": row["id"], "title": row["title"], "created_at": row["created_at"],
                            "updated_at": row["updated_at"], "symptoms": data.get("symptoms", []), "severity": data.get("severity", "Unsure")})
        return render_template("history.html", reports=reports, q=q)

    @app.get("/reports/<int:report_id>")
    @login_required
    def report_detail(report_id):
        return render_template("result.html", report=get_owned_report(report_id), saved=True)

    def prepare_report(form):
        all_options = {x["key"]: x["label"] for x in get_all_symptoms()}
        selected = sorted(set(x for x in form.getlist("symptoms") if x in all_options))
        if not selected:
            return None, "Select at least one symptom to create a report."
        severity = form.get("severity", "unsure").strip().lower()
        if severity not in {"mild", "moderate", "severe", "unsure"}:
            severity = "unsure"
        analysis = get_model().predict(selected)
        warning = check_warning_signs(selected)
        return {"generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "selected_keys": selected, "symptoms": [all_options[s] for s in selected],
            "duration": form.get("duration", "").strip()[:100] or "Not provided",
            "severity": severity.title(), "notes": form.get("notes", "").strip()[:1200] or "None provided",
            "analysis": analysis, "warning": warning}, None

    @app.get("/new-report")
    @login_required
    def new_report():
        return render_template("index.html", symptoms=get_all_symptoms(), selected_keys=[], report_form=None)

    @app.post("/analyze")
    @login_required
    def analyze():
        report, error = prepare_report(request.form)
        if error:
            return render_template("index.html", symptoms=get_all_symptoms(), error=error, selected_keys=request.form.getlist("symptoms")), 400
        report_id = save_report(g.user["id"], report)
        return redirect(url_for("report_detail", report_id=report_id))

    @app.route("/reports/<int:report_id>/edit", methods=["GET", "POST"])
    @login_required
    def edit_report(report_id):
        saved = get_owned_report(report_id)
        if request.method == "POST":
            report, error = prepare_report(request.form)
            if error:
                return render_template("index.html", symptoms=get_all_symptoms(), error=error, selected_keys=request.form.getlist("symptoms"), edit_id=report_id), 400
            save_report(g.user["id"], report, report_id=report_id, title=request.form.get("title", "").strip() or None)
            flash("Report updated.", "success")
            return redirect(url_for("report_detail", report_id=report_id))
        return render_template("index.html", symptoms=get_all_symptoms(), selected_keys=saved["selected_keys"], report_form=saved, edit_id=report_id)

    @app.post("/reports/<int:report_id>/delete")
    @login_required
    def delete_report(report_id):
        with connect_db() as db:
            cur = db.execute("DELETE FROM reports WHERE id=? AND user_id=?", (report_id, g.user["id"]))
        if not cur.rowcount:
            abort(404)
        flash("Report deleted.", "success")
        return redirect(url_for("report_history"))

    @app.post("/report.pdf")
    @login_required
    def report_pdf():
        # Backwards-compatible direct PDF export for older form links.
        report, error = prepare_report(request.form)
        if error:
            return error, 400
        return send_file(build_pdf(report), mimetype="application/pdf", as_attachment=True,
                         download_name="symptom_summary_report.pdf")

    @app.get("/reports/<int:report_id>/export.pdf")
    @login_required
    def export_saved_report(report_id):
        report = get_owned_report(report_id)
        return send_file(build_pdf(report), mimetype="application/pdf", as_attachment=True,
                         download_name=f"carenote_report_{report_id}.pdf")

    @app.route("/profile", methods=["GET", "POST"])
    @login_required
    def profile():
        if request.method == "POST":
            current_password = request.form.get("current_password", "")
            new_password = request.form.get("new_password", "")
            confirm = request.form.get("confirm_password", "")
            with connect_db() as db:
                row = db.execute("SELECT password_hash FROM users WHERE id=?", (g.user["id"],)).fetchone()
                if not row or not check_password_hash(row["password_hash"], current_password):
                    flash("Your current password was not recognized.", "danger")
                elif len(new_password) < 10:
                    flash("Use a new password with at least 10 characters.", "danger")
                elif new_password != confirm:
                    flash("The new passwords do not match.", "danger")
                else:
                    db.execute("UPDATE users SET password_hash=? WHERE id=?", (generate_password_hash(new_password), g.user["id"]))
                    session.clear()
                    flash("Password changed. Please sign in again.", "success")
                    return redirect(url_for("login"))
        return render_template("profile.html", user=g.user)

    @app.get("/about-model")
    def about_model():
        model = get_model(); metrics = model.evaluation
        return render_template("model_info.html", stats=model.dataset_stats,
            accuracy=metrics["accuracy"], train_rows=metrics["train_rows"],
            test_rows=metrics["test_rows"], class_count=len(metrics["labels"]))

    return app

app = create_app()
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
