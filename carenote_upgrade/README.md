# CareNote — Symptom-to-Report Analyzer (upgrade scaffold)

A local-first Flask application for organizing self-reported symptoms, keeping a private report history, exporting PDF summaries, and inspecting a local scikit-learn model's limitations. It does **not** diagnose disease or provide medical triage.

## What is included

- Flask application with registration, sign-in/out, password reset email flow (SMTP configuration required), password change, and account deletion.
- SQLite report storage with user ownership checks, report history/search, editing/deletion, JSON data export, and PDF export.
- Responsive dashboard and a 3-step symptom intake wizard with category filters, symptom search, severity, duration, and progression.
- Independent rule-based warning-sign screen that is not controlled by model output.
- Local-only Random Forest wrapper and a model-transparency page with held-out accuracy, macro-F1, class counts, and dataset status when the source dataset is present.
- Basic English/Hindi/Marathi navigation labels and language preference storage. This is partial UI localization, not a complete translation of every medical label.
- Security headers, CSRF protection, password hashing, session cookie settings, and tests.

## Important: original project files were missing from the supplied upload

The upload supplied `app.py`, `train_model.py`, `inspect_dataset.py`, `requirements.txt`, `README.md`, and `INSTALL.md`. It did not include the original `modules/`, `templates/`, `static/`, `data/`, or `tests/` folders. This package supplies new replacements for those components. Copy your original source dataset CSV into `data/dataset.csv` to enable the classifier. The intake and report generation can run without it, but the model will show as unavailable. The original four CSV files and their exact schema were not available to validate against; check the dataset target column and symptom encoding before use.

## Run on Windows

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
python app.py
```

Open `http://127.0.0.1:5000`. Create an account; use a password with at least 12 characters.

Run tests:

```powershell
pytest -q
```

Optional dataset evaluation:

```powershell
python inspect_dataset.py
python train_model.py
```

The original `train_model.py` assumes the local `modules.model` wrapper. It can only evaluate if `data/dataset.csv` exists and has a target column named `disease`, `label`, or `target`, plus binary-like symptom columns. If your source CSV has a different layout, adapt `modules/data_pipeline.py` before running it.

## Production configuration checklist

1. Set `FLASK_SECRET_KEY` to a high-entropy secret stored in a secret manager; never use the development fallback.
2. Serve behind HTTPS with a production WSGI server, such as Waitress on Windows or Gunicorn on Linux. Set `COOKIE_SECURE=1` only when HTTPS is correctly configured.
3. Use managed PostgreSQL and encrypted backups for multi-instance production; this scaffold uses SQLite by default.
4. Add rate limiting, security monitoring, retention policies, audit trails, backup/restore tests, dependency scanning, and a formal privacy impact assessment before public deployment.
5. Have a qualified clinical team review the warning rules and all user-facing wording. The current rules are deliberately incomplete and are not safe for real triage.
6. Conduct independent clinical validation, fairness testing, accessibility review, threat modelling, and legal/regulatory review before any real healthcare use.

## Clinical and data limitations

- The application is not a medical device and must not be used for diagnosis, triage, or treatment decisions.
- A classifier label is a label in the training dataset, not a diagnosis or calibrated probability.
- Evaluation on a small or synthetic dataset does not establish generalization to real patients.
- The emergency warning list is incomplete. No warning triggered does **not** mean a user is safe. Severe, sudden, worsening, or concerning symptoms warrant prompt medical assessment.
- Do not enter names, addresses, phone numbers, government IDs, or other unnecessary identifiers. Saved symptom notes are sensitive personal data.
- English/Hindi/Marathi support currently translates selected navigation labels only. Full translation requires reviewed medical translations.
- Do not deploy the Flask development server as the production server.
