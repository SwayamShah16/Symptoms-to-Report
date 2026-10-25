"""Load and normalize the optional symptom dataset; never fabricate disease data."""
from pathlib import Path
import re
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "dataset.csv"

FALLBACK_SYMPTOMS = [
    ("fever", "Fever", "General"), ("cough", "Cough", "Respiratory"),
    ("headache", "Headache", "General"), ("fatigue", "Fatigue", "General"),
    ("nausea", "Nausea", "Digestive"), ("vomiting", "Vomiting", "Digestive"),
    ("diarrhoea", "Diarrhoea", "Digestive"), ("sore_throat", "Sore throat", "Respiratory"),
    ("shortness_of_breath", "Shortness of breath", "Respiratory"),
    ("chest_pain", "Chest pain", "General"), ("dizziness", "Dizziness", "General"),
    ("abdominal_pain", "Abdominal pain", "Digestive"), ("rash", "Skin rash", "Skin"),
    ("joint_pain", "Joint pain", "Musculoskeletal"), ("muscle_pain", "Muscle pain", "Musculoskeletal"),
    ("back_pain", "Back pain", "Musculoskeletal"), ("runny_nose", "Runny nose", "Respiratory"),
    ("sneezing", "Sneezing", "Respiratory"), ("itching", "Itching", "Skin"),
    ("sweating", "Unusual sweating", "General"), ("loss_of_appetite", "Loss of appetite", "Digestive"),
    ("blurred_vision", "Blurred vision", "General"), ("confusion", "Confusion", "General"),
]

def normalize_key(value):
    value = re.sub(r"^\s*\d+_", "", str(value).strip().lower())
    value = re.sub(r"[^a-z0-9]+", "_", value).strip("_")
    return value

def _target_column(frame):
    return next((c for c in frame.columns if c.lower().strip() in {"disease", "label", "target"}), None)

def _extract_row_symptoms(row, symptom_cols):
    result = []
    for col in symptom_cols:
        value = row[col]
        if pd.isna(value):
            continue
        text = str(value).strip()
        if not text or text.lower() in {"nan", "none", "null", "0", "0.0", "no", "false"}:
            continue
        # Support both one-hot/binary columns and datasets with Symptom_1..Symptom_N text columns.
        if text.lower() in {"1", "1.0", "yes", "true"}:
            result.append(normalize_key(col))
        elif text.lower() not in {"0", "0.0", "no", "false"}:
            result.append(normalize_key(text))
    return sorted(set(result))

def get_all_symptoms():
    """Return normalized symptom labels from the provided dataset or a fallback intake catalogue."""
    if DATA_PATH.exists():
        try:
            frame = pd.read_csv(DATA_PATH)
            target = _target_column(frame)
            symptom_cols = [c for c in frame.columns if c != target]
            found = {}
            for _, row in frame.iterrows():
                for key in _extract_row_symptoms(row, symptom_cols):
                    # For binary feature columns, retain a readable title from the column name.
                    raw_value = None
                    for col in symptom_cols:
                        if normalize_key(col) == key and str(row[col]).strip().lower() in {"1", "1.0", "yes", "true"}:
                            raw_value = re.sub(r"^\d+_", "", col).replace("_", " ").strip().title()
                            break
                    label = raw_value or key.replace("_", " ").title()
                    found[key] = {"key": key, "label": label, "category": "Other"}
            if found:
                return sorted(found.values(), key=lambda x: x["label"].lower())
        except Exception:
            pass
    return [{"key": k, "label": label, "category": category} for k, label, category in FALLBACK_SYMPTOMS]

def load_raw_dataset():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")
    return pd.read_csv(DATA_PATH)

def load_clean_dataset():
    frame = load_raw_dataset()
    target = _target_column(frame)
    if target is None:
        raise ValueError("Dataset must contain a disease/label/target column")
    symptom_cols = [c for c in frame.columns if c != target]
    rows = []
    for _, row in frame.iterrows():
        symptoms = tuple(_extract_row_symptoms(row, symptom_cols))
        if symptoms:
            rows.append({"disease": str(row[target]).strip(), "symptoms": symptoms})
    clean = pd.DataFrame(rows).drop_duplicates(subset=["disease", "symptoms"]).reset_index(drop=True)
    stats = {"raw_rows": len(frame), "unique_patterns": len(clean), "class_count": int(clean["disease"].nunique()) if not clean.empty else 0,
             "symptom_count": len(set(s for row in clean.get("symptoms", []) for s in row)), "dataset_available": True}
    return clean, stats
