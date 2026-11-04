"""Health-profile onboarding: validation and summary helpers (no Flask dependency).

Everything here is patient-entered context for organizing notes. Nothing in this module
interprets values clinically; BMI is shown as a screening measure only.
"""
from __future__ import annotations

from datetime import date

CONDITIONS = ["Asthma", "Diabetes", "High blood pressure", "Heart condition", "Thyroid condition",
              "Arthritis", "Migraine", "Anxiety or depression", "Kidney condition", "Liver condition",
              "Epilepsy", "Skin condition"]
FAMILY_HISTORY = ["Diabetes", "Heart disease", "High blood pressure", "Cancer", "Stroke", "Asthma", "Thyroid condition"]
BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Not sure"]
SEX_OPTIONS = ["Female", "Male", "Intersex", "Prefer not to say"]
SMOKING = ["Never", "Former", "Occasionally", "Daily"]
ALCOHOL = ["None", "Occasionally", "Weekly", "Daily"]
ACTIVITY = ["Mostly sitting", "Light", "Moderate", "Very active"]
PHONE_OK = set("0123456789 +-()")


def _num(raw, lo, hi):
    try:
        value = float(str(raw).strip())
    except (TypeError, ValueError):
        return None
    return value if lo <= value <= hi else None


def _pick(raw, allowed):
    raw = (raw or "").strip()
    return raw if raw in allowed else ""


def calc_age(dob_iso, today=None):
    today = today or date.today()
    try:
        dob = date.fromisoformat(str(dob_iso)[:10])
    except ValueError:
        return None
    if dob > today:
        return None
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age if 0 <= age <= 120 else None


def bmi_info(height_cm, weight_kg):
    if not height_cm or not weight_kg:
        return None, None
    bmi = round(weight_kg / ((height_cm / 100) ** 2), 1)
    cat = ("Underweight" if bmi < 18.5 else "Healthy weight range" if bmi < 25
           else "Overweight range" if bmi < 30 else "Obesity range")
    return bmi, cat


def parse_meds(text, limit=12):
    meds = []
    for line in (text or "").splitlines():
        if not line.strip():
            continue
        parts = [p.strip() for p in line.split("|")]
        meds.append({"name": parts[0][:120], "dosage": parts[1][:120] if len(parts) > 1 else "",
                     "schedule": parts[2][:160] if len(parts) > 2 else ""})
    return meds[:limit]


def parse_profile(form, today=None):
    """Return (profile_dict, errors). The dict is always usable to re-fill the form."""
    errors = []
    name = (form.get("preferred_name") or "").strip()[:80]
    dob_raw = (form.get("dob") or "").strip()[:10]
    age = calc_age(dob_raw, today)
    if not name:
        errors.append("Tell us what to call you.")
    if age is None:
        errors.append("Enter a valid date of birth.")
    if not form.get("consent"):
        errors.append("Please confirm the privacy note to save your Care Passport.")
    phone = (form.get("emergency_phone") or "").strip()[:20]
    if phone and not set(phone) <= PHONE_OK:
        errors.append("Emergency phone may contain only digits, spaces and + - ( ).")
        phone = ""
    no_conditions = bool(form.get("no_conditions"))
    profile = {
        "preferred_name": name,
        "dob": dob_raw if age is not None else "",
        "sex": _pick(form.get("sex"), SEX_OPTIONS),
        "height_cm": _num(form.get("height_cm"), 50, 250),
        "weight_kg": _num(form.get("weight_kg"), 2, 500),
        "blood_group": _pick(form.get("blood_group"), BLOOD_GROUPS),
        "conditions": [] if no_conditions else [c for c in form.getlist("conditions") if c in CONDITIONS],
        "no_conditions": no_conditions,
        "other_conditions": "" if no_conditions else (form.get("other_conditions") or "").strip()[:200],
        "family_history": [c for c in form.getlist("family_history") if c in FAMILY_HISTORY],
        "no_allergies": bool(form.get("no_allergies")),
        "allergies": "" if form.get("no_allergies") else (form.get("allergies") or "").strip()[:300],
        "no_medications": bool(form.get("no_medications")),
        "medications": [] if form.get("no_medications") else parse_meds(form.get("medication_list")),
        "smoking": _pick(form.get("smoking"), SMOKING),
        "alcohol": _pick(form.get("alcohol"), ALCOHOL),
        "activity": _pick(form.get("activity"), ACTIVITY),
        "sleep_hours": _num(form.get("sleep_hours"), 2, 16),
        "emergency_name": (form.get("emergency_name") or "").strip()[:80],
        "emergency_phone": phone,
        "consent": bool(form.get("consent")),
    }
    return profile, errors


def summarize(profile, today=None):
    """Display/report-ready view of a stored profile, with derived age, BMI and completeness."""
    p = dict(profile or {})
    p.setdefault("conditions", []); p.setdefault("family_history", []); p.setdefault("medications", [])
    bmi, cat = bmi_info(p.get("height_cm"), p.get("weight_kg"))
    p["age"] = calc_age(p.get("dob", ""), today)
    p["bmi"], p["bmi_category"] = bmi, cat
    p["conditions_all"] = p["conditions"] + ([p["other_conditions"]] if p.get("other_conditions") else [])
    answered = [
        bool(p.get("preferred_name")), p["age"] is not None, bool(p.get("sex")),
        bool(p.get("height_cm") and p.get("weight_kg")), bool(p.get("blood_group")),
        bool(p["conditions_all"] or p.get("no_conditions")),
        bool(p.get("allergies") or p.get("no_allergies")),
        bool(p["medications"] or p.get("no_medications")),
        bool(p.get("smoking") or p.get("activity")),
        bool(p.get("emergency_name") and p.get("emergency_phone")),
    ]
    p["completeness"] = round(100 * sum(answered) / len(answered))
    return p


def report_snapshot(summary):
    """Compact subset copied into each saved report (no date of birth)."""
    keys = ["preferred_name", "age", "sex", "blood_group", "height_cm", "weight_kg", "bmi", "bmi_category",
            "conditions_all", "family_history", "allergies", "smoking", "alcohol",
            "activity", "sleep_hours", "emergency_name", "emergency_phone"]
    snap = {k: summary.get(k) for k in keys if summary.get(k) not in (None, "", [])}
    if summary.get("no_allergies"):
        snap["allergies"] = "None reported"
    if summary.get("no_conditions") and not snap.get("conditions_all"):
        snap["conditions_all"] = ["None reported"]
    return snap
