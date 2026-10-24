from pathlib import Path
import re
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
MAIN_DATA = DATA_DIR / "dataset.csv"
DESC_DATA = DATA_DIR / "symptom_Description.csv"
PRECAUTION_DATA = DATA_DIR / "symptom_precaution.csv"
SEVERITY_DATA = DATA_DIR / "Symptom-severity.csv"

TARGET_CANDIDATES = {"disease", "condition", "label", "prognosis"}

def normalize_symptom(value):
    """Normalize a symptom label to a stable lowercase underscore key."""
    if pd.isna(value):
        return ""
    value = str(value).strip().lower()
    if value in {"", "nan", "none", "null", "na"}:
        return ""
    value = re.sub(r"[\s\-]+", "_", value)
    value = re.sub(r"[^a-z0-9_]", "", value)
    value = re.sub(r"_+", "_", value)
    return value.strip("_")

def display_symptom(key):
    return key.replace("_", " ").capitalize()

def load_raw_dataset():
    if not MAIN_DATA.exists():
        raise FileNotFoundError(
            f"Missing {MAIN_DATA}. Put the Kaggle dataset.csv in the project's data folder."
        )
    df = pd.read_csv(MAIN_DATA)
    df.columns = [str(c).strip() for c in df.columns]
    target_cols = [c for c in df.columns if c.lower() in TARGET_CANDIDATES]
    if not target_cols:
        raise ValueError("No target column found. Expected Disease, Condition, Label, or Prognosis.")
    target = target_cols[0]
    symptom_cols = [
        c for c in df.columns
        if c != target and (c.lower().startswith("symptom") or c.lower() == "symptoms")
    ]
    if not symptom_cols:
        raise ValueError("No symptom columns found in dataset.csv.")
    records = []
    for _, row in df.iterrows():
        symptoms = sorted({
            normalize_symptom(row[c])
            for c in symptom_cols
            if normalize_symptom(row[c])
        })
        label = str(row[target]).strip()
        if symptoms and label and label.lower() not in {"nan", "none"}:
            records.append({"symptoms": tuple(symptoms), "disease": label})
    return pd.DataFrame(records)

def load_clean_dataset(deduplicate=True):
    """Deduplicate identical symptom sets before splitting to prevent leakage."""
    df = load_raw_dataset()
    before = len(df)
    if deduplicate:
        df = df.drop_duplicates(subset=["symptoms", "disease"]).reset_index(drop=True)
    stats = {
        "raw_rows": before,
        "unique_patterns": int(len(df)),
        "removed_duplicate_rows": int(before - len(df)),
        "disease_classes": int(df["disease"].nunique()),
        "unique_symptoms": int(len({s for row in df["symptoms"] for s in row})),
    }
    return df, stats

def load_metadata():
    descriptions = {}
    precautions = {}
    severity = {}
    if DESC_DATA.exists():
        ddf = pd.read_csv(DESC_DATA).fillna("")
        for _, row in ddf.iterrows():
            descriptions[str(row["Disease"]).strip()] = str(row["Description"]).strip()
    if PRECAUTION_DATA.exists():
        pdf = pd.read_csv(PRECAUTION_DATA).fillna("")
        for _, row in pdf.iterrows():
            disease = str(row["Disease"]).strip()
            precautions[disease] = [
                str(row[c]).strip() for c in pdf.columns
                if c.lower().startswith("precaution") and str(row[c]).strip()
            ]
    if SEVERITY_DATA.exists():
        sdf = pd.read_csv(SEVERITY_DATA).fillna("")
        for _, row in sdf.iterrows():
            key = normalize_symptom(row["Symptom"])
            try:
                severity[key] = int(row["weight"])
            except (ValueError, TypeError):
                continue
    return descriptions, precautions, severity

def get_all_symptoms():
    df, _ = load_clean_dataset()
    keys = sorted({s for row in df["symptoms"] for s in row})
    # Keep emergency warning options available even if absent from the training data.
    extra = [
        "chest_pain", "breathing_difficulty", "sudden_weakness",
        "confusion", "severe_bleeding", "severe_allergic_reaction", "fainting"
    ]
    keys = sorted(set(keys).union(extra))
    return [{"key": key, "label": display_symptom(key)} for key in keys]
