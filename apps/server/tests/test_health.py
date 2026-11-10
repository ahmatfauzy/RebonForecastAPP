from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_typed_status() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_is_in_openapi_schema() -> None:
    schema = client.get("/api/openapi.json").json()

    assert "/api/health" in schema["paths"]
    assert "HealthResponse" in schema["components"]["schemas"]
