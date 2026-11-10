from app.core.config import Settings


def test_settings_parse_environment(monkeypatch) -> None:
    monkeypatch.setenv("APP_NAME", "Forecast Test API")
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.setenv("CORS_ORIGINS", '["http://localhost:5173"]')
    monkeypatch.setenv("API_HOST", "0.0.0.0")
    monkeypatch.setenv("API_PORT", "8100")

    settings = Settings(_env_file=None)

    assert settings.app_name == "Forecast Test API"
    assert settings.environment == "test"
    assert settings.cors_origins == ["http://localhost:5173"]
    assert settings.api_host == "0.0.0.0"
    assert settings.api_port == 8100
