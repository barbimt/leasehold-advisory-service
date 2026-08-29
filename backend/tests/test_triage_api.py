import pytest
from rest_framework.test import APIClient

from triage.serializers import DESCRIPTION_MAX_LENGTH

TRIAGE_URL = "/api/triage/"


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


def test_known_scenario_returns_expected_topic(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": "major_works"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["topic"]["slug"] == "major-works"


def test_free_text_returns_expected_topic(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"description": "We received a Section 20 notice"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["topic"]["slug"] == "major-works"


def test_unclear_description_returns_unknown(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"description": "I have a question about my home"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["topic"]["slug"] == "unknown"


def test_known_scenario_takes_precedence_over_description(
    api_client: APIClient,
) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {
            "scenario": "major_works",
            "description": "The roof needs repair",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.data["topic"]["slug"] == "major-works"


def test_missing_both_fields_returns_400(api_client: APIClient) -> None:
    response = api_client.post(TRIAGE_URL, {}, format="json")
    assert response.status_code == 400


def test_whitespace_only_input_returns_400(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": "   ", "description": "   "},
        format="json",
    )
    assert response.status_code == 400


def test_description_over_maximum_length_returns_400(
    api_client: APIClient,
) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"description": "a" * (DESCRIPTION_MAX_LENGTH + 1)},
        format="json",
    )
    assert response.status_code == 400


def test_response_does_not_echo_enquiry_text(api_client: APIClient) -> None:
    marker = "UNIQUE_ENQUIRY_MARKER_9f3c2a"
    response = api_client.post(
        TRIAGE_URL,
        {"description": f"I have a question about my home {marker}"},
        format="json",
    )
    assert response.status_code == 200
    assert marker not in response.content.decode()


def test_response_contains_only_public_topic_fields(
    api_client: APIClient,
) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": "major_works"},
        format="json",
    )
    assert response.status_code == 200
    assert set(response.data.keys()) == {"topic"}
    assert set(response.data["topic"].keys()) == {
        "slug",
        "label",
        "summary",
        "nextStep",
    }


def test_unsupported_scenario_returns_unknown(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": "park_homes"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["topic"]["slug"] == "unknown"


def test_unexpected_fields_are_rejected(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": "major_works", "email": "not-collected@example.test"},
        format="json",
    )
    assert response.status_code == 400
    assert "email" in response.data
