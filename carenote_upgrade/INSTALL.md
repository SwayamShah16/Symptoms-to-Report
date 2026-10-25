# Installation

See `README.md` for the full setup and production checklist.

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
python app.py
```

Browse to `http://127.0.0.1:5000`. Run `pytest -q` to execute the automated smoke and workflow tests.

To enable the local classifier, place the original dataset at `data/dataset.csv`. The supplied upload did not contain the dataset or original modules, so verify the CSV schema and encoding before use. Without it, report intake, saved history, warning checklist, and PDF export still work, while model prediction remains unavailable.

For password reset emails, configure `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM`. Never use the development secret key or Flask's development server for production.
