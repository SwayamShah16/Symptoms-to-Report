# Symptom-to-Report Analyzer
## AIML in Healthcare — Mini Project Report

### Abstract
The Symptom-to-Report Analyzer is a Python web application that organizes user-selected symptoms into a structured summary and creates a downloadable PDF. It demonstrates a machine-learning workflow using a Random Forest classifier trained on a public disease–symptom dataset, plus a separate rule-based warning-sign checklist. The system is intended for academic demonstration only and is not a medical diagnostic or triage device.

### Problem statement
People may find it difficult to organize symptom details before a healthcare appointment. This project demonstrates a way to collect symptom selections, duration, self-reported severity, and notes in one place and export them as a readable report.

### Objectives
1. Build a responsive interface using Flask.
2. Clean and normalize symptom labels from CSV data.
3. Encode multi-symptom records as binary feature vectors.
4. Train a baseline Random Forest classifier.
5. identify and remove exact repeated symptom patterns before evaluation.
6. Add a rule-based warning-sign checklist independent of the classifier.
7. Generate PDF reports with ReportLab.
8. Demonstrate testing, data privacy, and limitations in healthcare AI.

### Dataset
The supplied archive contains:
- `dataset.csv`: 4,920 source rows, a disease label, and 17 symptom columns.
- `Symptom-severity.csv`: 133 symptom weight entries.
- `symptom_Description.csv`: 41 description entries.
- `symptom_precaution.csv`: 41 generic precaution entries.

The main file contains many repeated or reordered versions of symptom patterns. After normalization and exact deduplication, the project has 304 unique disease/symptom patterns across 41 labels and 131 distinct symptom keys. The deduplicated dataset is very small for 41 classes. It is not known to be a collection of independently sampled, clinically validated patient encounters.

### Methodology
1. Load CSV files with Pandas.
2. Normalize symptom names to lowercase underscore keys.
3. Collect each row's symptoms into a sorted set.
4. Remove rows with identical symptom sets and the same label.
5. Multi-hot encode symptoms with `MultiLabelBinarizer`.
6. Split the deduplicated records into stratified training and testing sets.
7. Evaluate a Random Forest baseline with accuracy and per-class precision/recall/F1.
8. Train a serving classifier on the full deduplicated dataset.
9. Process form submissions in Flask and independently check selected warning signs.
10. Generate a PDF summary containing user-provided context, the dataset label, and limitations.

### System architecture
- Presentation: HTML templates, CSS, and a small client-side symptom filter.
- Web backend: Flask routes and input validation.
- Data pipeline: Pandas-based normalization and deduplication.
- ML component: scikit-learn Random Forest and MultiLabelBinarizer.
- Safety component: explicit warning-sign rules, not controlled by ML output.
- Reporting: ReportLab-generated PDF.
- Tests: pytest route, data, warning and PDF checks.

### Evaluation
The included `train_model.py` script reports a stratified holdout score after deduplication. In the current environment, the baseline obtained 100% accuracy on 76 held-out unique patterns. This is not evidence of clinical performance. The source labels are highly structured and the data has only about seven unique patterns per class on average, so the result may reflect dataset construction and limited pattern diversity. It must not be presented as a validated medical accuracy figure.

Recommended evaluation improvements:
- Compare Random Forest with Logistic Regression and Multinomial/Bernoulli Naive Bayes.
- Report macro and weighted F1, class-wise recall, and a confusion matrix.
- Repeat with multiple random seeds or cross-validation, while keeping duplicate patterns grouped together.
- Evaluate against a separate independently sourced dataset if licensing and schema allow.
- Seek clinical expertise and validation before making any clinical claim.

### Privacy and safety
- No account or database is required.
- Submitted details are not intentionally persisted by the application.
- Notes are length-limited and should not include identifiers.
- Downloaded PDFs may contain sensitive information.
- The warning checklist is incomplete and cannot rule out an emergency.
- The application must not be used to diagnose, exclude, or treat disease.
- The generic precaution file is not shown as personalized medical advice.

### Limitations
- Source data provenance and clinical validity are not established by this project.
- Deduplication leaves only 304 unique patterns for 41 labels.
- A closed-set classifier always chooses among labels it has seen; it cannot reliably detect unknown conditions.
- Symptom presence alone omits age, history, onset, duration patterns, exam findings, tests, and clinical context.
- The warning checklist is incomplete.
- Model scores do not establish real-world generalizability.

### Conclusion
The project demonstrates an end-to-end AIML coursework workflow: dataset inspection, preprocessing, feature encoding, classification, evaluation, a Flask interface, independent safety rules, PDF reporting, and automated tests. Its outputs are educational dataset matches, not medical advice or diagnosis.
