"""Load and normalize the local symptom datasets used by CareNote."""
from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DATA_PATH = DATA_DIR / "dataset.csv"
SEVERITY_PATH = DATA_DIR / "Symptom-severity.csv"


def normalize_symptom(value: object) -> str:
    """Return a stable human-readable symptom name from common CSV variants."""
    if value is None or pd.isna(value):
        return ""
    value = str(value).strip().lower().replace("_", " ")
    return re.sub(r"\s+", " ", value).strip()


def symptom_key(value: object) -> str:
    """Stable form value for a normalized symptom label."""
    return normalize_symptom(value).replace(" ", "_")


def _category(label: str) -> str:
    s = label.lower()
    groups = {
        "Skin & hair": ("skin", "rash", "itch", "pimple", "blackhead", "nail", "blister", "patch", "peel", "scur", "eruption", "pigment", "acne", "hair"),
        "Breathing & senses": ("cough", "sputum", "breath", "nose", "sneez", "throat", "congestion", "sinus", "smell", "eye", "vision", "hearing", "phlegm"),
        "Digestive": ("abdominal", "belly", "stomach", "nausea", "vomit", "diarr", "constipat", "bowel", "anal", "appetite", "indigest", "gas", "stool", "urine", "micturition", "bladder", "polyuria", "liver", "yellowish", "jaundice"),
        "Pain & movement": ("pain", "joint", "muscle", "cramp", "stiff", "walk", "knee", "back", "neck", "hip", "balance", "weakness"),
        "General": ("fever", "fatigue", "chill", "shiver", "malaise", "lethargy", "dehydrat", "weight", "sweat", "thirst", "obesity", "hunger", "cold hands", "fast heart", "palpitation", "chest pain", "breathlessness"),
        "Mood & cognition": ("anxiety", "depress", "mood", "irritab", "concentration", "sensorium", "dizziness", "headache", "restlessness", "coma"),
    }
    for category, terms in groups.items():
        if any(term in s for term in terms):
            return category
    return "Other"


@lru_cache(maxsize=1)
def load_clean_dataset() -> tuple[pd.DataFrame, dict]:
    """Load the source CSV, remove malformed rows and exact duplicate patterns."""
    if not DATA_PATH.exists():
        return pd.DataFrame(columns=["disease", "symptoms"]), {
            "dataset_available": False, "raw_rows": 0, "unique_patterns": 0,
            "class_count": 0, "symptom_count": 0, "reason": f"Dataset not found: {DATA_PATH}",
        }

    raw = pd.read_csv(DATA_PATH)
    disease_col = next((c for c in raw.columns if str(c).strip().lower() in {"disease", "label", "target"}), None)
    if disease_col is None:
        return pd.DataFrame(columns=["disease", "symptoms"]), {
            "dataset_available": False, "raw_rows": len(raw), "unique_patterns": 0,
            "class_count": 0, "symptom_count": 0, "reason": "No Disease, label, or target column was found.",
        }
    symptom_cols = [c for c in raw.columns if re.match(r"(?i)^symptom(?:[_ ]?\d+)?$", str(c).strip())]
    if not symptom_cols:
        symptom_cols = [c for c in raw.columns if c != disease_col]
    rows = []
    for _, row in raw.iterrows():
        disease = str(row.get(disease_col, "")).strip()
        if not disease or disease.lower() == "nan":
            continue
        symptoms = sorted({normalize_symptom(row.get(c)) for c in symptom_cols if normalize_symptom(row.get(c))})
        if symptoms:
            rows.append({"disease": disease, "symptoms": symptoms})
    clean = pd.DataFrame(rows, columns=["disease", "symptoms"])
    if not clean.empty:
        clean["_pattern"] = clean["symptoms"].map(lambda xs: "|".join(xs))
        clean = clean.drop_duplicates(subset=["disease", "_pattern"]).drop(columns="_pattern").reset_index(drop=True)
    all_symptoms = sorted({s for row in clean.get("symptoms", []) for s in row})
    stats = {
        "dataset_available": bool(not clean.empty), "raw_rows": int(len(raw)),
        "unique_patterns": int(len(clean)), "class_count": int(clean["disease"].nunique()) if not clean.empty else 0,
        "symptom_count": len(all_symptoms), "reason": "" if not clean.empty else "No usable symptom rows were found.",
    }
    return clean, stats


def load_raw_dataset() -> pd.DataFrame:
    """Compatibility helper used by the dataset inspection script."""
    if not DATA_PATH.exists():
        return pd.DataFrame()
    return pd.read_csv(DATA_PATH)


@lru_cache(maxsize=1)
def get_all_symptoms() -> list[dict[str, str]]:
    """Return stable symptom keys and readable labels for the intake wizard."""
    clean, _ = load_clean_dataset()
    labels = {s for symptoms in clean.get("symptoms", []) for s in symptoms}
    if SEVERITY_PATH.exists():
        try:
            severity = pd.read_csv(SEVERITY_PATH)
            col = next((c for c in severity.columns if str(c).strip().lower() == "symptom"), None)
            if col:
                labels.update(normalize_symptom(s) for s in severity[col].dropna() if normalize_symptom(s))
        except (OSError, ValueError, pd.errors.ParserError):
            pass
    return [
        {"key": symptom_key(label), "label": label.replace("_", " ").title(), "category": _category(label)}
        for label in sorted(labels)
    ]
