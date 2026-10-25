# CareNote implementation plan and status

## Scope selected

Goal: production-oriented healthcare application; keep Flask + local scikit-learn + SQLite + ReportLab; no external AI API. Preserve existing account/report workflows where their routes and schema were visible in the supplied `app.py`.

## Implemented in this upgrade scaffold

- [x] Keep account registration, sign-in/out, password reset via configured SMTP, password change, report CRUD, history search, PDF export, model page, and profile.
- [x] SQLite migration adds preferred language without dropping existing user rows; report queries enforce owner IDs.
- [x] New 3-step intake wizard with symptom search/category filters, duration, self-reported severity, progression, and review step.
- [x] Responsive premium dashboard and report pages.
- [x] Independent warning-sign checklist and explicit non-diagnostic language.
- [x] Report PDF with symptoms, context, warning screening, model status, and limitations.
- [x] Model page includes dataset status, held-out accuracy, macro-F1, row counts, and class count when dataset is available.
- [x] Local-only model wrapper supports binary symptom columns and text values in `Symptom_1...Symptom_N`-style datasets.
- [x] English/Hindi/Marathi preference and navigation-label translations.
- [x] JSON export and account/report deletion controls.
- [x] Security headers, CSRF protection, password hashing, secure cookie configuration toggle, and production secret-key guard.
- [x] Smoke/workflow tests authored; Python compile, Jinja template parsing, PDF generation smoke test passed in this environment.

## Not verified / not complete

- [ ] Flask route tests could not execute here because Flask and Flask-WTF are not installed in the runtime and package download access is unavailable. Run `pytest -q` after installing requirements locally.
- [ ] Original data files and original module/template/test folders were not included in the upload. The local classifier is intentionally unavailable until `data/dataset.csv` is supplied and checked against the schema.
- [ ] Original dataset columns/encoding have not been verified against the replacement data pipeline. It supports common text symptom columns and binary feature columns, but must be tested with the real CSV.
- [ ] Hindi/Marathi translation covers only selected navigation labels, not all content or medical terminology.
- [ ] Warning-sign rules are incomplete and not clinically reviewed.
- [ ] No rate limiting, production database, observability, encrypted backups, formal audit log, or clinical governance has been implemented. These are required before any public production deployment.

## Next implementation stages

1. Install dependencies and run the included tests; fix any environment-specific issues.
2. Add the original dataset and verify label/symptom extraction, class counts, deduplication, and evaluation splits.
3. Review existing database backups and test the schema migration with a copy of the original database.
4. Add rate limiting, account lockout protections, production database migrations, backup/restore, monitoring, audit events, and data retention controls.
5. Commission clinical review of warning rules and wording; conduct privacy/security and accessibility reviews.
6. Only consider real healthcare use after independent validation and applicable regulatory/legal review. This scaffold itself is not validated for clinical use.
