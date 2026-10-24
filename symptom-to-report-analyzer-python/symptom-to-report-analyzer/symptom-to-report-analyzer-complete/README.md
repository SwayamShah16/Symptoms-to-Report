# Symptom-to-Report Analyzer
**AIML in Healthcare coursework mini project | Python + Flask + scikit-learn + PDF**

## What the project does
- Provides a responsive Flask form for selecting symptoms and entering symptom duration, self-reported severity, and optional notes.
- Trains a Random Forest classifier on the supplied disease-symptom dataset.
- Removes exact duplicate symptom patterns before the train/test split to reduce evaluation leakage.
- Runs an independent, conservative warning-sign checklist; it is not controlled by the model.
- Uses the dataset's description CSV as reference text only.
- Generates a downloadable PDF symptom summary.
- Provides a Model & Dataset page with dataset counts and a clearly qualified held-out benchmark.
- Includes automated tests and a dataset inspection script.

## Safety and intended use
This is a student demonstration, not a diagnostic tool or medical device. A model label is a dataset classification, not a diagnosis, probability, or treatment recommendation. The source dataset is not a set of independently collected and clinically validated patient encounters. The warning checklist is incomplete; absence of a warning does not mean a person is safe. Seek qualified care when needed and urgent help for severe, sudden, or worsening symptoms.

Do not enter names, phone numbers, addresses, government IDs, or other identifying details. The app does not intentionally store submitted forms. A PDF may contain sensitive information and should be kept private. The app does not display the dataset's generic precautions as personalized treatment advice.

## Dataset included
The `data/` folder contains the four CSV files from the user's uploaded archive:
- `dataset.csv` — 4,920 rows, disease label and 17 symptom columns.
- `Symptom-severity.csv` — 133 symptom weight rows.
- `symptom_Description.csv` — 41 disease description rows.
- `symptom_precaution.csv` — 41 rows of generic precaution text.

Initial inspection of the uploaded archive found 4,920 raw rows, 41 labels and 131 distinct symptom keys. Exact repeated disease/symptom patterns reduce the main dataset to 304 unique patterns. This is a major limitation: the model is for coursework workflow demonstration, not clinical performance. The source dataset may be constructed or simplified, and this app has not clinically validated it.

## Setup (Windows / VS Code)
Recommended: Python 3.10 or newer.

1. Extract the project ZIP.
2. Open the extracted `symptom-to-report-analyzer-complete` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Create and activate a virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt:
```bat
.venv\Scripts\activate.bat
```

5. Install dependencies:
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

6. Inspect the dataset:
```powershell
python inspect_dataset.py
```

7. Evaluate the baseline and write `reports/metrics.json`:
```powershell
python train_model.py
```

8. Start Flask:
```powershell
python app.py
```
Open http://127.0.0.1:5000. Keep the terminal open while using the app; stop it with Ctrl+C.

9. Run tests:
```powershell
pytest -q
```

## Project structure
```text
symptom-to-report-analyzer-complete/
├── app.py
├── train_model.py
├── inspect_dataset.py
├── requirements.txt
├── README.md
├── data/
│   ├── dataset.csv
│   ├── Symptom-severity.csv
│   ├── symptom_Description.csv
│   └── symptom_precaution.csv
├── modules/
│   ├── data_pipeline.py
│   ├── model.py
│   ├── safety_screening.py
│   └── report_generator.py
├── templates/
│   ├── index.html
│   ├── result.html
│   └── model_info.html
├── static/style.css
├── tests/test_app.py
└── reports/
```

## How the ML pipeline works
1. Read the source CSV and normalize symptom names.
2. Convert each row's symptom columns to a sorted set.
3. Remove repeated rows with identical disease labels and symptom sets.
4. Encode symptom sets using `MultiLabelBinarizer` (multi-hot features).
5. Use a stratified train/test split and train a Random Forest classifier for an educational benchmark.
6. Train the serving model on all deduplicated patterns.
7. Show the selected dataset label with an explicit non-diagnostic disclaimer.

The project does not present `predict_proba` as medical confidence. Evaluation scores are unstable because there are only about seven unique patterns per label on average. Never use accuracy as evidence of clinical validity.

## Why not automatically use a different dataset?
For the exact multi-select symptom form, this dataset's format is convenient and the archive also includes descriptions and severity metadata. The biggest issue is repeated patterns and limited independent examples. Other public symptom-to-disease datasets often have similar provenance limitations or focus on free-text descriptions instead of multi-select symptom checkboxes. Replacing this with a larger synthetic dataset would not establish clinical validity. For this mini project, the transparent approach is to use this dataset, deduplicate it before evaluation, document limitations, and avoid clinical claims.

## Security and privacy
- The local development secret key is only for local testing. Before deployment set a strong `FLASK_SECRET_KEY` environment variable.
- Use HTTPS and set `SESSION_COOKIE_SECURE=True` for HTTPS deployments.
- Do not deploy Flask's development server or enable debug mode in production.
- The current app has no user accounts or database and does not intentionally save submitted data.
- Do not add analytics or external AI APIs without a clear privacy review and informed consent.
- This prototype is not appropriate for real-world medical triage.
