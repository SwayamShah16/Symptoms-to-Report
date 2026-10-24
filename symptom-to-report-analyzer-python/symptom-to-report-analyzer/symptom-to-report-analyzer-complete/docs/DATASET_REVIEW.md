# Dataset review and selection rationale

## Dataset supplied by the student
The uploaded ZIP was inspected directly. It includes `dataset.csv`, `Symptom-severity.csv`, `symptom_Description.csv`, and `symptom_precaution.csv`.

Measured structure:
- 4,920 rows in `dataset.csv`
- 41 target labels
- 131 distinct normalized symptom names
- 4,616 rows removed as exact repeated disease/symptom patterns
- 304 unique patterns remain after deduplication

This is convenient for a checkbox-based classroom prototype because each example already has a disease label and a set of symptoms. However, the repeated rows make a naive random train/test split misleading, and the deduplicated sample is small.

## Alternatives considered
### DDXPlus
DDXPlus is a richer synthetic diagnostic dataset that includes patient-like profiles, symptoms/antecedents, and differential diagnosis information. Its schema is more complex than this project’s checkbox input, and it is also synthetic rather than a collection of independently verified real patient encounters. It may be useful for a future advanced version, but it does not automatically provide clinical validity. Dataset description: https://huggingface.co/datasets/aai530-group6/ddxplus

### Symptom2Disease text dataset
A published study describes a Symptom2Disease dataset of about 1,200 natural-language symptom descriptions across 24 disease labels. This is better aligned with a future free-text/NLP feature than with the current multi-select form, but it is small and should not be assumed to be clinically validated. Study: https://www.nature.com/articles/s41598-024-51615-5

## Decision
For the runnable project delivered here, keep the student's uploaded four-file dataset and make its limitations explicit. It is already available locally, matches the current multi-select interface, and supports an end-to-end demo. Do not combine datasets with different label sets or feature definitions without a careful schema and evaluation plan.

A genuinely better dataset for clinical use would require transparent provenance, appropriate licensing, well-defined labels, representative patient encounters, and clinical validation. More rows or a higher benchmark score alone do not make a healthcare dataset better.
