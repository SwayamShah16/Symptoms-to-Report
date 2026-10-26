# Installation

1. Install Python 3.10 or newer.
2. Open PowerShell in the `CareNote_Upgrade` folder.
3. Create and activate a virtual environment, install requirements, set a secret key, and run Flask:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
python app.py
```

4. Browse to `http://127.0.0.1:5000`.
5. Run `pytest -q` to execute the automated checks.

The source classifier CSV is already placed at `data/dataset.csv`. The pipeline expects the `Disease` target column and `Symptom_1`...`Symptom_N` symptom columns found in the supplied dataset. To change the dataset, replace that file and restart the app.

For password-reset emails, configure `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM`. Never use the development secret key or Flask's development server for production. Keep `instance/users.sqlite3` private because it may contain user accounts and saved symptom notes.
