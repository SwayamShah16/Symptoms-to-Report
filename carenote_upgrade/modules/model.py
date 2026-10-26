"""Local, educational multi-label symptom-pattern classifier wrapper.

The returned class is a dataset label only. It is not a diagnosis or calibrated risk.
"""
from __future__ import annotations

from functools import lru_cache

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer

from .data_pipeline import load_clean_dataset, normalize_symptom


class LocalSymptomModel:
    def __init__(self):
        self.available = False
        self.reason = ""
        self.dataset_stats = {}
        self.evaluation = {}
        self._classifier = None
        self._binarizer = None
        self._features = []
        self._load()

    def _load(self):
        frame, stats = load_clean_dataset()
        self.dataset_stats = dict(stats)
        if frame.empty or frame["disease"].nunique() < 2:
            self.reason = stats.get("reason") or "The dataset needs at least two target classes."
            return
        try:
            labels = frame["disease"].astype(str).to_numpy()
            patterns = frame["symptoms"].tolist()
            mlb = MultiLabelBinarizer()
            X = mlb.fit_transform(patterns)
            self._features = list(mlb.classes_)
            # Deduplication happens before splitting, avoiding exact-row leakage.
            counts = {label: int((labels == label).sum()) for label in set(labels)}
            can_stratify = min(counts.values()) >= 2
            X_train, X_test, y_train, y_test = train_test_split(
                X, labels, test_size=0.2, random_state=42,
                stratify=labels if can_stratify else None,
            )
            eval_model = RandomForestClassifier(
                n_estimators=180, random_state=42, class_weight="balanced_subsample",
                min_samples_leaf=1, n_jobs=-1,
            )
            eval_model.fit(X_train, y_train)
            predicted = eval_model.predict(X_test)
            self.evaluation = {
                "accuracy": float(accuracy_score(y_test, predicted)),
                "macro_f1": float(f1_score(y_test, predicted, average="macro", zero_division=0)),
                "train_rows": int(len(y_train)), "test_rows": int(len(y_test)),
                "labels": sorted(set(labels)),
                "report": classification_report(y_test, predicted, output_dict=True, zero_division=0),
                "confusion_matrix": confusion_matrix(y_test, predicted, labels=sorted(set(labels))).tolist(),
            }
            # Refit a final classifier on all deduplicated patterns for local inference.
            self._classifier = RandomForestClassifier(
                n_estimators=220, random_state=42, class_weight="balanced_subsample", n_jobs=-1,
            )
            self._classifier.fit(X, labels)
            self._binarizer = mlb
            self.available = True
            self.reason = ""
            self.dataset_stats["class_counts"] = {str(k): int(v) for k, v in sorted(counts.items())}
        except (ValueError, TypeError, MemoryError) as exc:
            self.reason = f"The local dataset could not be used: {exc}"
            self.available = False

    def predict(self, selected_symptoms):
        if not self.available:
            return {"available": False, "label": None, "message": self.reason or "Dataset not found or model could not be loaded."}
        selected = sorted({normalize_symptom(s) for s in selected_symptoms if normalize_symptom(s)})
        if not selected:
            return {"available": False, "label": None, "message": "Select one or more symptoms before requesting a model label."}
        known = sorted(set(selected).intersection(self._features))
        if not known:
            return {"available": False, "label": None, "message": "The selected symptoms are not represented in the local model's training dataset, so no model label is available."}
        try:
            row = self._binarizer.transform([known])
            label = str(self._classifier.predict(row)[0])
            note = "This is the model's closest learned dataset label for the selected symptom pattern. It is not a diagnosis, medical probability, or treatment recommendation."
            if len(known) < len(selected):
                note += " Some selected symptoms are not represented in the training dataset and were not used for this label."
            return {"available": True, "label": label, "message": note}
        except (ValueError, TypeError) as exc:
            return {"available": False, "label": None, "message": f"Model prediction could not be completed: {exc}"}


@lru_cache(maxsize=1)
def get_model() -> LocalSymptomModel:
    return LocalSymptomModel()
