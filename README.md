# Symptoms to Report

A mini project for AI in Healthcare designed to help a person organize their symptoms into a clear, structured report for a healthcare professional while also providing general guidance on how urgently they should seek care.

This repository contains a Flask-based prototype application for symptom intake, health tracking, and report generation. It combines a guided symptom wizard, local health data logging, PDF report export, and a lightweight machine learning model trained on a sample dataset to provide non-clinical educational triage guidance.

## Project overview

The application is intended as a learning-focused healthcare support prototype rather than a medical decision tool. It helps users:

- record symptoms in a guided and structured way
- add contextual health information such as temperature, pulse, BMI, blood pressure, and medications
- save and review past symptom reports
- export generated reports to PDF
- review a basic safety checklist and urgency guidance
- use a local machine learning model to understand possible disease patterns in the dataset

The result is a practical prototype that demonstrates how a patient-facing interface can help prepare a clear summary for medical professionals.

## Why this project matters

Many patients struggle to communicate symptoms clearly during medical consultations. Often, symptom information is fragmented across notes, conversations, and memory. This project addresses that problem by giving users a tool to:

- collect symptoms in a consistent format
- track them over time
- include relevant lifestyle and health details
- generate a readable summary document
- understand when a condition might warrant more urgent attention

This makes the tool useful for education, research exploration, and building a foundation for future clinical support systems.

## Features

### Symptom intake workflow
- guided, multi-step symptom entry form
- symptom search and category-based filtering
- duration-based symptom tracking
- severity and progression assessment
- user-entered notes and contextual descriptions

### Health records and history
- BMI tracking
- blood pressure logging
- temperature tracking
- pulse rate monitoring
- medication records
- appointment-prep questions for clinician visit
- historical logs grouped by date

### Report generation
- structured symptom report generation
- PDF export for easier sharing with healthcare providers
- saved report history and previous summaries
- ability to manage and review existing reports

### Safety and guidance layer
- warning-sign checklist
- educational guidance on urgency of care
- non-clinical general advice to encourage early attention when needed
- clear emphasis that the app is not a substitute for medical diagnosis

### Local AI / ML component
- local scikit-learn model (Random Forest)
- dataset-driven training flow
- evaluation metrics and transparency page
- no external AI API dependency

### User experience
- Flask web application
- local SQLite database
- responsive dashboard and interface
- multiple language support for common UI text (including English/Hindi/Marathi in the upgraded app)

## Tech stack

- Python
- Flask
- SQLite
- Pandas
- NumPy
- scikit-learn
- ReportLab
- Matplotlib
- Flask-WTF
- pytest
- Jinja templates
- HTML/CSS/JavaScript

## Repository structure

```text
Symptoms-to-Report/
├── README.md
├── Symptom_to_Report_Analyzer_Project_Report (1).pdf
└── carenote_upgrade/
    ├── app.py
    ├── requirements.txt
    ├── INSTALL.md
    ├── IMPLEMENTATION_PLAN.md
    ├── README.md
    ├── inspect_dataset.py
    ├── train_model.py
    ├── data/
    │   └── dataset.csv
    ├── modules/
    │   ├── data_pipeline.py
    │   ├── model.py
    │   ├── report_generator.py
    │   └── safety_screening.py
    ├── static/
    ├── templates/
    ├── tests/
    ├── reports/
    ├── instance/
    └── .gitignore
```

The core application logic and source code live in `carenote_upgrade/`.

## Getting started

### Prerequisites

- Python 3.10 or newer
- pip
- a terminal or command prompt

### Installation

From the project root:

```bash
cd carenote_upgrade
python -m venv .venv
source .venv/bin/activate      # Linux/macOS
# or .venv\Scripts\activate    # Windows PowerShell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Set a secure secret key before running the app:

### Linux/macOS

```bash
export FLASK_SECRET_KEY="replace-with-a-long-random-secret"
```

### Windows PowerShell

```powershell
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
```

Then run:

```bash
python app.py
```

Open the app in a browser:

```text
http://127.0.0.1:5000
```

## First-time usage

1. Create a new account or log in.
2. Navigate to the symptom intake form.
3. Enter symptoms, duration, severity, and notes.
4. Add relevant health records such as blood pressure, pulse rate, medications, or BMI data.
5. Generate a report summary.
6. Export or review the report as a PDF.
7. Check the urgency guidance section for general recommendations.

## How the project works

The project uses a Flask application to manage the web experience and persist user data in SQLite. Users interact with a guided interface that collects symptom details and general health information. That data is assembled into a structured report and exported as a PDF.

The app also includes a small educational model pipeline:

- the dataset is loaded from `data/dataset.csv`
- preprocessing is applied to clean symptom values and normalize data
- a model is trained using scikit-learn
- evaluation metrics are generated for transparency
- safety checks are layered on top to provide guidance and cautionary messaging

This model is not intended for real clinical triage or medical diagnosis.

## Dataset and model notes

The project includes a sample dataset with symptom columns and disease labels. The training pipeline:

- normalizes symptom names and variations
- drops unusable records
- deduplicates repeated rows where appropriate
- trains a local classification model for educational demonstration

The app provides access to evaluation details and dataset status. These metrics are intended to showcase a prototype workflow rather than provide validated clinical performance.

## Safety and limitations

This project is designed for educational and exploratory use. It should not be used as a real-world medical recommendation system.

Important limitations:

- it is not a certified medical diagnostic tool
- it cannot replace professional medical assessment
- warning rules and guidance are simplified and may not be comprehensive
- the dataset is not representative of real clinical practice
- model predictions are not clinically validated

Severe, sudden, worsening, or concerning symptoms should be assessed by a qualified healthcare professional immediately.

## Security considerations

The app includes basic security protections such as:

- password hashing
- CSRF protection
- secure session configuration
- user authentication flow
- data ownership checks for personal reports

For anything beyond a local personal demo, it is recommended to use HTTPS, a stronger secret management approach, and a production-ready deployment architecture.

## Testing

The project includes pytest-based tests and a set of diagnostic scripts.

Run:

```bash
pytest -q
python inspect_dataset.py
python train_model.py
```

This helps validate the application logic and review dataset/model status.

## Project goals

This project demonstrates how AI and software engineering can be applied in healthcare by creating a user-friendly system that:

- organizes patient-reported symptoms
- creates a more complete clinical summary
- supports informed conversation with providers
- encourages timely action for concerning symptom patterns
- showcases an end-to-end workflow from data collection to report generation

## Future enhancements

Possible next steps for this project include:

- improved clinical validation and rule review
- better model performance with a larger and more representative dataset
- support for multilingual fully localized patient experience
- stronger privacy safeguards and secure deployment design
- integration with external healthcare workflows or patient portals
- medication safety checks and clinician-oriented summaries
- more advanced symptom taxonomy and severity scoring

## Contributing

Contributions are welcome if they improve the user experience, model quality, code quality, documentation, or system safety. The project is especially suitable for improvements in:

- healthcare UX and accessibility
- report generation
- data preprocessing
- model transparency
- testing coverage
- security hardening

## Conclusion

Symptoms to Report is a practical healthcare-focused prototype that combines symptom tracking, health record management, report generation, and local AI to create a useful educational application. It is designed to help users structure their symptoms and prepare for meaningful healthcare conversations while reinforcing the importance of professional clinical review for serious or urgent medical concerns.

This repository contains the implementation and supporting materials for the project, with the main application code living under `carenote_upgrade/`.

---

For additional installation details and project-specific notes, see:

- `carenote_upgrade/README.md`
- `carenote_upgrade/INSTALL.md`
- `carenote_upgrade/IMPLEMENTATION_PLAN.md`
