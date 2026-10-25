import json
import pytest
from app import create_app

@pytest.fixture()
def app(tmp_path):
    app = create_app({"TESTING": True, "WTF_CSRF_ENABLED": False, "SECRET_KEY": "test-secret-key", "DATABASE": str(tmp_path / "test.sqlite3")})
    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

def register(client, email="test@example.com", password="StrongPassword123!"):
    return client.post('/register', data={"email": email, "password": password, "confirm_password": password}, follow_redirects=True)

def test_landing_and_health(client):
    assert client.get('/').status_code == 200
    payload = client.get('/healthz').get_json()
    assert payload['status'] == 'ok'

def test_register_dashboard_and_logout(client):
    response = register(client)
    assert response.status_code == 200
    assert b'Dashboard' in response.data or b'Good to see you' in response.data
    assert client.post('/logout').status_code == 302

def test_auth_required_for_reports(client):
    response = client.get('/new-report')
    assert response.status_code == 302
    assert '/login' in response.location

def test_report_flow_and_pdf_export(client):
    register(client)
    # chest_pain is in the local fallback symptom catalogue; screening must run independently of ML availability.
    response = client.post('/analyze', data={"symptoms": ["chest_pain", "headache"], "duration": "Started today", "severity": "moderate", "progression": "worsening", "notes": "Test note"}, follow_redirects=True)
    assert response.status_code == 200
    assert b'Warning-sign screening' in response.data or b'Warning-sign' in response.data
    assert b'Chest pain' in response.data
    pdf = client.get('/reports/1/export.pdf')
    assert pdf.status_code == 200
    assert pdf.mimetype == 'application/pdf'
    assert pdf.data.startswith(b'%PDF')

def test_report_owner_isolation(client, app):
    register(client, 'one@example.com')
    client.post('/analyze', data={"symptoms": ["headache"], "severity": "mild"})
    client.post('/logout')
    register(client, 'two@example.com')
    assert client.get('/reports/1').status_code == 404

def test_data_export_and_account_delete(client):
    register(client)
    client.post('/analyze', data={"symptoms": ["headache"], "severity": "mild"})
    export = client.get('/reports/export.json')
    assert export.status_code == 200
    assert json.loads(export.data)['reports']
    deleted = client.post('/account/delete', data={"confirm": "DELETE"})
    assert deleted.status_code == 302
    assert client.get('/dashboard').status_code == 302

def test_model_page_loads_without_dataset(client):
    response = client.get('/about-model')
    assert response.status_code == 200
    assert b'Not a diagnostic tool' in response.data
