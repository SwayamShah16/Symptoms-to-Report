from functools import lru_cache
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from modules.data_pipeline import load_clean_dataset

DISCLAIMER = (
    "This reference pattern is generated from the selected symptoms and is not a diagnosis or an estimate of disease risk. "
    "Please discuss your symptoms with a qualified healthcare professional."
)

class SymptomPatternModel:
    def __init__(self):
        self.df, self.dataset_stats = load_clean_dataset(deduplicate=True)
        self.features = sorted({s for row in self.df["symptoms"] for s in row})
        self.mlb = MultiLabelBinarizer(classes=self.features)
        self.X = self.mlb.fit_transform(self.df["symptoms"])
        self.y = self.df["disease"].to_numpy()
        # Fit the serving model on all unique patterns after the evaluation split is assessed.
        self.model = RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            class_weight="balanced_subsample",
            min_samples_leaf=1,
            n_jobs=-1,
        )
        self.evaluation = self._evaluate()
        self.model.fit(self.X, self.y)
        self.descriptions = {}
        self.precautions = {}
        self.severity_weights = {}
        from modules.data_pipeline import load_metadata
        self.descriptions, self.precautions, self.severity_weights = load_metadata()

    def _new_classifier(self):
        return RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced_subsample",
            n_jobs=-1,
        )

    def _evaluate(self):
        # Deduplication happens before split so duplicate symptom permutations cannot leak
        # across train/test. This small benchmark remains unsuitable for clinical validation.
        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y, test_size=0.25, random_state=42, stratify=self.y
        )
        evaluator = self._new_classifier()
        evaluator.fit(X_train, y_train)
        pred = evaluator.predict(X_test)
        return {
            "accuracy": float(accuracy_score(y_test, pred)),
            "report": classification_report(y_test, pred, output_dict=True, zero_division=0),
            "confusion_matrix": confusion_matrix(y_test, pred, labels=sorted(set(self.y))).tolist(),
            "test_rows": int(len(y_test)),
            "train_rows": int(len(y_train)),
            "labels": sorted(set(self.y)),
        }

    def predict(self, selected):
        known = sorted(set(selected).intersection(self.features))
        if not known:
            return {
                "pattern": "No matching training features",
                "description": "",
                "matched_features": [],
                "data_source": "Kaggle disease-symptom dataset",
                "disclaimer": DISCLAIMER + " None of the selected items matched the model's training features.",
            }
        vec = self.mlb.transform([known])
        label = str(self.model.predict(vec)[0])
        # Do not display predict_proba as a medical confidence score.
        return {
            "pattern": label,
            "description": self.descriptions.get(label, ""),
            "matched_features": known,
            "data_source": "Kaggle disease-symptom dataset (deduplicated unique patterns)",
            "disclaimer": DISCLAIMER,
        }

@lru_cache(maxsize=1)
def get_model():
    return SymptomPatternModel()
