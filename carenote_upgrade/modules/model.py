"""Local-only ML wrapper. Explicitly unavailable when the source dataset is absent."""
from functools import lru_cache
from pathlib import Path
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from .data_pipeline import load_clean_dataset

class SymptomModel:
    def __init__(self):
        self.available = False
        self.reason = "The project dataset is missing. Add data/dataset.csv to enable the local classifier."
        self.dataset_stats = {"dataset_available": False, "raw_rows": 0, "unique_patterns": 0, "class_count": 0, "symptom_count": 0}
        self.evaluation = {"accuracy": None, "macro_f1": None, "train_rows": 0, "test_rows": 0, "labels": [], "report": {}, "confusion_matrix": []}
        self.model = None
        self.encoder = MultiLabelBinarizer()
        self.labels = []
        try:
            frame, stats = load_clean_dataset()
            self.dataset_stats = stats
            if len(frame) < 10 or frame["disease"].nunique() < 2:
                self.reason = "The dataset has too few unique examples or classes for a meaningful demonstration."
                return
            X_lists = [list(x) for x in frame["symptoms"]]
            y = frame["disease"].astype(str).to_numpy()
            self.encoder.fit(X_lists)
            X = self.encoder.transform(X_lists)
            counts = frame["disease"].value_counts()
            can_stratify = bool((counts >= 2).all())
            try:
                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y if can_stratify else None)
            except ValueError:
                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
            evaluator = RandomForestClassifier(n_estimators=250, class_weight="balanced", random_state=42, n_jobs=-1)
            evaluator.fit(X_train, y_train)
            pred = evaluator.predict(X_test)
            labels = sorted(set(y_test) | set(pred))
            self.evaluation = {"accuracy": float(accuracy_score(y_test, pred)), "macro_f1": float(f1_score(y_test, pred, average="macro", zero_division=0)),
                "train_rows": len(y_train), "test_rows": len(y_test), "labels": labels,
                "report": classification_report(y_test, pred, output_dict=True, zero_division=0, labels=labels),
                "confusion_matrix": confusion_matrix(y_test, pred, labels=labels).tolist()}
            self.model = RandomForestClassifier(n_estimators=250, class_weight="balanced", random_state=42, n_jobs=-1)
            self.model.fit(X, y)
            self.labels = list(self.model.classes_)
            self.available = True
            self.reason = ""
        except (FileNotFoundError, ValueError, OSError) as exc:
            self.reason = str(exc)

    def predict(self, symptoms):
        if not self.available:
            return {"available": False, "message": self.reason, "label": None, "top_features": []}
        keys = [s for s in symptoms if s in set(self.encoder.classes_)]
        if not keys:
            return {"available": False, "message": "The selected symptoms do not match the model's dataset vocabulary.", "label": None, "top_features": []}
        row = self.encoder.transform([keys])
        label = str(self.model.predict(row)[0])
        importances = getattr(self.model, "feature_importances_", np.array([]))
        top = sorted(zip(self.encoder.classes_, importances), key=lambda x: float(x[1]), reverse=True)[:8]
        return {"available": True, "label": label, "message": "Dataset classification for educational reference only; not a diagnosis.",
                "top_features": [{"feature": str(k), "importance": float(v)} for k, v in top if v > 0]}

@lru_cache(maxsize=1)
def get_model():
    return SymptomModel()
