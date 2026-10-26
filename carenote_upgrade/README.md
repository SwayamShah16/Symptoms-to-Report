# CareNote — Symptom-to-Report Analyzer

CareNote is a local-first Flask educational prototype for organizing self-reported symptoms, saving personal notes, exporting PDF summaries, and inspecting a local scikit-learn classifier. It is **not** a diagnostic, triage, or treatment tool.

## Included

- Flask authentication: registration, login/logout, password reset email flow (SMTP configuration required), password changes, and account deletion.
- SQLite report storage, report ownership checks, report history/search, editing/deletion, JSON export, and PDF export.
- Dedicated **Health records hub** linked in navigation and dashboard. Each of the seven trackers opens its own page: BMI, blood pressure, temperature, pulse, symptom timeline, medication list, and appointment preparation.
- Saved health-log entries are included in the next symptom report snapshot and its PDF; users can review and delete individual health-log entries.
- Responsive dashboard and three-step symptom intake wizard with symptom search/category filters, duration, self-reported severity, and progression.
- Local scikit-learn Random Forest trained from `data/dataset.csv`; no external AI API.
- Independent, deliberately incomplete warning-sign checklist.
- Model transparency page with dataset status and held-out accuracy/macro-F1.
- English/Hindi/Marathi interface localization for common page copy, navigation, forms, health-record labels, safety text, and the bundled symptom labels. User-entered notes remain in the language entered; review medical terminology with qualified translators before real-world healthcare use.
- CSRF protection, password hashing, security headers, and a configurable secure session cookie.
- Supplied symptom description, precaution, and severity CSVs retained in `data/` for future reviewed extensions.

## Project structure

```text
CareNote_Upgrade/
├── app.py
├── modules/
│   ├── data_pipeline.py
│   ├── model.py
│   ├── report_generator.py
│   └── safety_screening.py
├── templates/          # Jinja templates
├── static/             # CSS and JavaScript
├── data/               # Source CSV datasets
├── instance/            # Local SQLite database
├── reports/             # Generated evaluation output
├── tests/
├── inspect_dataset.py
└── train_model.py
```

## Run on Windows

Use Python 3.10 or newer. From this folder, open PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
python app.py
```

Open `http://127.0.0.1:5000`. Create a new account to begin. The app creates its SQLite database automatically under `instance/` on first run. Keep `instance/users.sqlite3` private; it may contain account and symptom-report data.

Run checks after installing requirements:

```powershell
pytest -q
python inspect_dataset.py
python train_model.py
```

`train_model.py` writes a metrics snapshot to `reports/metrics.json`. Restart the Flask process after changing the CSV because the dataset/model are cached in-process.

## Dataset behavior

The supplied source CSV has a `Disease` target and `Symptom_1` through `Symptom_17` columns. The pipeline normalizes underscore/spacing variants, drops unusable rows, and removes exact duplicate disease/symptom patterns before evaluation. The supplied file currently contains 4,920 source rows, 41 target labels, 131 normalized symptoms, and 304 unique disease-pattern rows after exact-pattern deduplication.

The reported metrics are a small educational benchmark only. Exact deduplication does not make this dataset representative of real clinical encounters; the model may still exploit dataset-specific patterns. A dataset label is not a diagnosis, calibrated probability, or treatment recommendation.

## Security and deployment checklist

Before any deployment beyond a private local demo:

1. Set a high-entropy `FLASK_SECRET_KEY` via a secret manager; do not use the development fallback.
2. Serve through HTTPS and a production WSGI server (Waitress on Windows or Gunicorn on Linux). Set `COOKIE_SECURE=1` only when HTTPS is correctly configured.
3. Replace SQLite with a managed production database and migrations for multi-user deployment; implement encrypted backups and restore tests.
4. Add rate limiting, account lockout controls, security monitoring, audit events, retention/deletion policies, dependency scanning, and a privacy impact assessment.
5. Have qualified clinicians review all warning rules and wording. The current rules are incomplete and are not safe for real triage.
6. Conduct independent clinical validation, fairness testing, accessibility review, threat modelling, and applicable legal/regulatory review before any real healthcare use.

Do not enter unnecessary identifiers or use this application to make medical decisions. Severe, sudden, worsening, or concerning symptoms require prompt professional assessment; a negative checklist result does not mean a person is safe.

## Patient report and health records

Open **Health records** from the signed-in navigation or dashboard, then open any of the seven individual tracker pages. Each tracker maintains its own dated history; numeric trackers show a trend graph, symptom history shows severity and activity graphs, and medication/appointment pages show entry-frequency graphs. The profile includes the latest saved value and entry count for each tracker. Entries remain in the user's account and the latest saved entries are copied into the next report snapshot and PDF. The report wizard also supports optional self-reported health details:

- BMI calculated from height (cm) and weight (kg), with an adult category label.
- Blood pressure (systolic/diastolic) with a reading date.
- Temperature log with Celsius/Fahrenheit live conversion and a reading date.
- Pulse rate in BPM with a reading date.
- Medication list using one line per item in `name | dosage as prescribed | schedule` format.
- Appointment-preparation questions for a clinician.

The details entered directly in the report wizard are saved in that report. Saved health-record entries are included in the next report snapshot and PDF export. The interface uses a readable sans-serif font stack with larger body and descriptive text, including offline system fallbacks. PDF typography uses ReportLab built-in fonts for dependable output.

These are patient-entered notes, not clinical interpretation. BMI is a screening measure; the app does not diagnose, triage, interpret vital signs, or recommend medication doses.
