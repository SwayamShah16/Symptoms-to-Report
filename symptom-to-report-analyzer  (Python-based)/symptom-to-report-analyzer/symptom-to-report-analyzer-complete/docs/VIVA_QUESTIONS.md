# Viva Questions and Short Answers

**1. What is the Symptom-to-Report Analyzer?**  
A Flask-based educational app that collects symptoms, runs a baseline ML classifier, performs a separate warning-sign check, and generates a PDF summary.

**2. Why use Flask?**  
Flask is a lightweight Python web framework suitable for building routes, handling forms, and rendering HTML templates.

**3. Why use Pandas?**  
Pandas reads the CSV files and supports data cleaning, missing-value handling, deduplication, and summary statistics.

**4. What is the target variable?**  
`Disease` is the target label in the supplied `dataset.csv`.

**5. What is a feature in this project?**  
A normalized symptom key such as `itching` or `skin_rash`, represented as present or absent.

**6. What is multi-hot encoding?**  
It represents multiple selected symptoms with a binary vector in which each position indicates whether a symptom is present.

**7. Why use Random Forest?**  
It is a simple ensemble baseline that can model non-linear feature relationships and is available in scikit-learn.

**8. Why deduplicate before splitting?**  
Repeated symptom patterns in both training and test sets can inflate evaluation scores. Deduplication reduces this leakage.

**9. Why did 4,920 rows become 304 patterns?**  
The source contains many repeated/reordered symptom combinations. After normalization, exact symptom sets with the same label are kept once.

**10. Does 100% holdout accuracy mean the app is medically accurate?**  
No. It is only a small, structured dataset benchmark and does not establish performance on real patients.

**11. Why include rule-based safety checks?**  
To make a limited set of warning signs trigger an alert independently of the model output. The checklist is incomplete and cannot rule out emergencies.

**12. Why not show model probabilities?**  
A classifier's probability is not a calibrated estimate of a person's medical risk. The app avoids presenting it as medical confidence.

**13. How is a PDF created?**  
ReportLab builds a PDF in memory, and Flask returns it as a downloadable response.

**14. How is privacy supported?**  
The prototype has no user account or database and does not intentionally save form submissions. The user is advised not to enter identifying details.

**15. What are the main limitations?**  
Small deduplicated data, uncertain clinical provenance, a closed set of labels, incomplete safety rules, and no clinical validation.

**16. What could be improved?**  
Add cross-validation, compare multiple baseline models, include confusion matrix and macro F1, improve accessibility, and seek a better documented dataset and clinical review.
