"""Evaluate the local model wrapper and write an explicitly qualified metrics file."""
import json
from pathlib import Path
from modules.model import get_model

ROOT = Path(__file__).resolve().parent
REPORTS = ROOT / "reports"
REPORTS.mkdir(exist_ok=True)
model = get_model()
payload = {
    "dataset_stats": model.dataset_stats,
    "model_available": model.available,
    "reason": model.reason,
    "evaluation": {
        "accuracy": model.evaluation.get("accuracy"),
        "macro_f1": model.evaluation.get("macro_f1"),
        "train_rows": model.evaluation.get("train_rows", 0),
        "test_rows": model.evaluation.get("test_rows", 0),
        "labels": model.evaluation.get("labels", []),
        "classification_report": model.evaluation.get("report", {}),
        "confusion_matrix": model.evaluation.get("confusion_matrix", []),
    },
    "important_note": "This is a small educational benchmark, not clinical validation. Never use it for diagnosis or triage."
}
path = REPORTS / "metrics.json"
path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
print("Dataset checks:")
print(json.dumps(model.dataset_stats, indent=2))
if model.available:
    print(f"Held-out accuracy (educational only): {model.evaluation['accuracy']:.3f}")
    print(f"Macro F1 (educational only): {model.evaluation['macro_f1']:.3f}")
    print(f"Train rows: {model.evaluation['train_rows']} | Test rows: {model.evaluation['test_rows']}")
else:
    print(f"Model not evaluated: {model.reason}")
print(f"Metrics saved to: {path}")
