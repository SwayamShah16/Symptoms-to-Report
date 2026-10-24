# CareNote feature patch

Copy `app.py` and `requirements.txt` over the existing files. Copy the six HTML files into your existing `templates/` folder, replacing `index.html`, `auth.html`, and `result.html`, and adding `dashboard.html`, `history.html`, and `profile.html`. Keep your existing `static/style.css`, `modules/`, and `data/` folders.

Install the added dependency and restart the app:

```powershell
pip install -r requirements.txt
python app.py
```

Routes added: `/dashboard`, `/new-report`, `/reports`, `/reports/<id>`, report edit/delete/PDF routes, `/profile`, `/forgot-password`, and `/reset-password/<token>`.

Password-reset emails require SMTP environment variables (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`). Without SMTP, reset email delivery is not available; users who can sign in can change their password from Profile.

The database schema creates a `reports` table automatically in the configured SQLite database. Back up any existing database before replacing application files. Existing accounts remain in place; report history starts empty for older accounts.
