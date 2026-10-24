"""Run dataset checks, evaluate a deduplicated baseline, and save a metrics summary."""
import json
from pathlib import Path
from modules.model import get_model

ROOT = Path(__file__).resolve().parent
REPORTS = ROOT / "reports"
REPORTS.mkdir(exist_ok=True)
model = get_model()
payload = {
    "dataset_stats": model.dataset_stats,
    "evaluation": {
        "accuracy": model.evaluation["accuracy"],
        "train_rows": model.evaluation["train_rows"],
        "test_rows": model.evaluation["test_rows"],
        "labels": model.evaluation["labels"],
        "classification_report": model.evaluation["report"],
    },
    "important_note": (
        "This is a small educational benchmark after exact duplicate removal, not clinical validation."
    ),
}
path = REPORTS / "metrics.json"
path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
print("Dataset checks:")
print(json.dumps(model.dataset_stats, indent=2))
print(f"\nHeld-out accuracy (educational only): {model.evaluation['accuracy']:.3f}")
print(f"Train rows: {model.evaluation['train_rows']} | Test rows: {model.evaluation['test_rows']}")
print(f"Metrics saved to: {path}")
