# CareNote implementation plan and status

## Current scope

Keep Flask + local scikit-learn + SQLite + ReportLab, preserve account/report workflows and the supplied dashboard templates, and do not call an external AI API.

## Completed in this package

- [x] Organized templates under `templates/` and frontend assets under `static/`.
- [x] Added the missing `modules/` package: dataset pipeline, local classifier wrapper, independent warning-sign screen, and PDF generator.
- [x] Connected the supplied `dataset.csv` to `data/dataset.csv` using its actual `Disease` and `Symptom_1...Symptom_17` schema.
- [x] Normalized symptom labels and exact disease/symptom patterns; exposed 133 intake choices including labels from the severity file.
- [x] Preserved the supplied SQLite database in `instance/users.sqlite3` and retained user-owned report checks in Flask routes.
- [x] Fixed the symptom-category click selector so symptom labels do not accidentally act as category buttons.
- [x] Fixed progression values to preselect correctly when editing an existing report.
- [x] Added tests for data loading, local prediction, warning-screen limitations, PDF generation, and core Flask workflows.
- [x] Updated installation and deployment documentation.

## Local checks completed

- [x] Python syntax compilation passed for the Flask app, support modules, and utility scripts.
- [x] Dataset loaded successfully: 4,920 raw rows, 304 exact-deduplicated disease-pattern rows, 41 target labels, 131 normalized symptoms.
- [x] Local classifier loaded and produced a dataset label for a sample input.
- [x] Warning-screen behavior and PDF generation smoke checks passed.
- [x] JavaScript syntax check passed.
- [ ] Full pytest run remains pending because Flask and Flask-WTF are not installed in the current execution environment. Install `requirements.txt`, then run `pytest -q` locally.

## Not production-ready

- [ ] Clinical review and independent validation of the classifier and warning-sign wording.
- [ ] Rate limiting, account lockout, audit events, security monitoring, retention policies, encrypted backups, and restore tests.
- [ ] Production database and migration workflow for multi-instance deployment.
- [ ] Complete reviewed Hindi/Marathi localization, accessibility audit, and applicable legal/regulatory review.

CareNote remains an educational note-organizing prototype, not a medical device or real-world triage service.
