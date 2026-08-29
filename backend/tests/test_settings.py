from django.conf import settings


def test_django_settings_load() -> None:
    assert settings.configured
    assert settings.DATABASES["default"]["ENGINE"] == "django.db.backends.postgresql"
