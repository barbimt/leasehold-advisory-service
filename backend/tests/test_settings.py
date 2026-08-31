from django.conf import settings

from config.settings import split_csv


def test_django_settings_load() -> None:
    assert settings.configured
    assert settings.DATABASES["default"]["ENGINE"] == "django.db.backends.sqlite3"


def test_split_csv_empty_and_whitespace() -> None:
    assert split_csv("") == []
    assert split_csv("   ") == []
    assert split_csv(" , , ") == []


def test_split_csv_comma_separated_origins() -> None:
    assert split_csv("https://app.vercel.app") == ["https://app.vercel.app"]
    assert split_csv(" https://a.example ,https://b.example, ") == [
        "https://a.example",
        "https://b.example",
    ]


def test_cors_middleware_is_before_common() -> None:
    assert "corsheaders" in settings.INSTALLED_APPS
    cors = "corsheaders.middleware.CorsMiddleware"
    common = "django.middleware.common.CommonMiddleware"
    assert settings.MIDDLEWARE[0] == cors
    assert settings.MIDDLEWARE.index(cors) < settings.MIDDLEWARE.index(common)
