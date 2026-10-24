from modules.data_pipeline import load_raw_dataset, load_clean_dataset
import pandas as pd

raw = load_raw_dataset()
clean, stats = load_clean_dataset()
print("Raw parsed rows:", len(raw))
print("After exact symptom-pattern deduplication:", len(clean))
print("Dataset stats:", stats)
print("\nDisease class counts after deduplication:")
print(clean["disease"].value_counts().sort_index().to_string())
print("\nMost common symptom labels:")
counts = {}
for row in clean["symptoms"]:
    for symptom in row:
        counts[symptom] = counts.get(symptom, 0) + 1
print(pd.Series(counts).sort_values(ascending=False).head(20).to_string())
