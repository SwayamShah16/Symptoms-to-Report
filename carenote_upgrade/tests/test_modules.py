from modules.data_pipeline import DATA_PATH, get_all_symptoms, load_clean_dataset
from modules.model import get_model
from modules.report_generator import build_pdf
from modules.safety_screening import check_warning_signs


def test_dataset_is_found_and_normalized():
    assert DATA_PATH.exists()
    frame, stats = load_clean_dataset()
    assert stats["dataset_available"] is True
    assert stats["raw_rows"] > stats["unique_patterns"] > 0
    assert stats["class_count"] == 41
    assert len(get_all_symptoms()) >= stats["symptom_count"]
    assert "itching" in set(frame.iloc[0]["symptoms"]) or any("itching" in x for x in frame["symptoms"])


def test_model_returns_qualified_local_label():
    model = get_model()
    assert model.available, model.reason
    result = model.predict(["itching", "skin_rash"])
    assert result["available"] is True
    assert result["label"]
    assert "not a diagnosis" in result["message"].lower()


def test_warning_screen_is_independent_and_qualified():
    warning = check_warning_signs(["chest_pain"])
    assert warning["triggered"] is True
    assert warning["signs"]
    no_match = check_warning_signs(["headache"])
    assert no_match["triggered"] is False
    assert "incomplete" in no_match["message"].lower()


def test_pdf_generation():
    report = {
        "symptoms": ["Headache", "Fatigue"], "duration": "1–3 days",
        "severity": "Moderate", "progression": "Worsening", "notes": "Sample note",
        "warning": check_warning_signs(["headache"]),
        "analysis": get_model().predict(["headache"]), "generated_at": "2026-10-26 12:00 UTC",
    }
    pdf = build_pdf(report).getvalue()
    assert pdf.startswith(b"%PDF-")
    assert len(pdf) > 1000
