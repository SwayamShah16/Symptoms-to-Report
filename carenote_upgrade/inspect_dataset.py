"""Inspect the source dataset if present; fail gracefully when the optional data file is absent."""
from modules.data_pipeline import load_raw_dataset, load_clean_dataset, DATA_PATH
import pandas as pd

if not DATA_PATH.exists():
    print(f"Dataset not found: {DATA_PATH}")
    print("Copy the original dataset to data/dataset.csv to inspect the local ML pipeline.")
    raise SystemExit(0)

raw = load_raw_dataset()
clean, stats = load_clean_dataset()
print("Raw parsed rows:", len(raw))
print("After exact disease/symptom-pattern deduplication:", len(clean))
print("Dataset stats:", stats)
print("\nDisease class counts after deduplication:")
print(clean["disease"].value_counts().sort_index().to_string())
print("\nMost common symptom labels:")
counts = {}
for row in clean["symptoms"]:
    for symptom in row:
        counts[symptom] = counts.get(symptom, 0) + 1
print(pd.Series(counts).sort_values(ascending=False).head(20).to_string())
