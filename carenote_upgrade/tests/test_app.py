import json

from app import create_app


def make_client(tmp_path):
    app = create_app({
        "TESTING": True,
        "WTF_CSRF_ENABLED": False,
        "SECRET_KEY": "test-secret-key-not-for-production",
        "DATABASE": str(tmp_path / "test.sqlite3"),
    })
    return app.test_client()


def register(client):
    return client.post("/register", data={
        "email": "student@example.com",
        "password": "a-strong-test-password-123",
        "confirm_password": "a-strong-test-password-123",
    }, follow_redirects=True)


def test_auth_and_report_workflow(tmp_path):
    client = make_client(tmp_path)
    response = register(client)
    assert response.status_code == 200
    assert b"Dashboard" in response.data

    response = client.get("/new-report")
    assert response.status_code == 200
    assert b"Choose your symptoms" in response.data

    response = client.post("/analyze", data={
        "symptoms": ["itching", "skin_rash"],
        "duration": "1-3 days", "severity": "mild", "progression": "unchanged",
        "notes": "Test-only note",
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"What you reported" in response.data

    response = client.get("/reports")
    assert response.status_code == 200
    assert b"Test-only note" not in response.data

    response = client.get("/reports/export.json")
    assert response.status_code == 200
    exported = json.loads(response.data)
    assert len(exported["reports"]) == 1
    assert exported["reports"][0]["report"]["notes"] == "Test-only note"

    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json["dataset_available"] is True


def test_private_report_requires_login(tmp_path):
    client = make_client(tmp_path)
    response = client.get("/dashboard")
    assert response.status_code == 302
    assert "/login" in response.headers["Location"]
