import pytest
from app import create_app
from modules.safety_screening import check_warning_signs
from modules.data_pipeline import load_clean_dataset

@pytest.fixture()
def client(tmp_path):
    app = create_app({"TESTING": True, "WTF_CSRF_ENABLED": False, "DATABASE": str(tmp_path / "test-users.sqlite3"), "SECRET_KEY": "test-secret"})
    return app.test_client()

def register(client, email="student@example.com", password="A-strong-password-123"):
    return client.post("/register", data={"email": email, "password": password, "confirm_password": password}, follow_redirects=True)

def test_dataset_deduplicates_patterns():
    df, stats = load_clean_dataset()
    assert stats["raw_rows"] == 4920
    assert stats["unique_patterns"] < stats["raw_rows"]
    assert df["disease"].nunique() == 41

def test_landing_page(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"CareNote" in response.data
    assert b"does not diagnose" in response.data

def test_register_and_sign_in(client):
    response = register(client)
    assert response.status_code == 200
    assert b"YOUR OVERVIEW" in response.data
    client.post("/logout", follow_redirects=True)
    response = client.post("/login", data={"email": "student@example.com", "password": "A-strong-password-123"}, follow_redirects=True)
    assert response.status_code == 200
    assert b"YOUR OVERVIEW" in response.data

def test_workspace_requires_login(client):
    response = client.get("/dashboard")
    assert response.status_code == 302
    assert "/login" in response.location

def test_empty_submission_rejected(client):
    register(client)
    response = client.post("/analyze", data={})
    assert response.status_code == 400
    assert b"Select at least one symptom" in response.data

def test_urgent_warning_is_independent():
    result = check_warning_signs(["headache", "breathing_difficulty"])
    assert result["urgent"] is True

def test_no_warning_is_not_reassurance():
    result = check_warning_signs(["headache"])
    assert result["urgent"] is False
    assert "does not rule out an emergency" in result["message"]

def test_pdf_response(client):
    register(client)
    response = client.post("/report.pdf", data={"symptoms": ["itching", "skin_rash"], "duration": "today", "severity": "mild", "notes": "sample test"})
    assert response.status_code == 200
    assert response.mimetype == "application/pdf"
    assert response.data.startswith(b"%PDF")
