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
        "primaryResource",
        "relatedResources",
    }
    assert "phrases" not in response.data
    assert "score" not in response.data


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


RESOURCE_KEYS = {"title", "summary", "url", "linkText"}

KNOWN_SCENARIO_RESOURCES = {
    "service_charges": (
        "https://www.lease-advice.org/costs-and-charges/service-charges/about-service-charges/",
        (
            "https://www.lease-advice.org/costs-and-charges/service-charges/about-service-charges/rights-information/",
            "https://www.lease-advice.org/costs-and-charges/service-charges/challenging-service-charges/",
        ),
    ),
    "major_works": (
        "https://www.lease-advice.org/costs-and-charges/section-20-consultation/responding-to-section-20-consultation/",
        (
            "https://www.lease-advice.org/costs-and-charges/service-charges/about-service-charges/",
            "https://www.lease-advice.org/costs-and-charges/section-20-consultation/if-your-landlord-does-not-consult/",
        ),
    ),
    "repairs": (
        "https://www.lease-advice.org/building-management/repairs/repairs-and-maintenance-in-leasehold-properties/",
        (
            "https://www.lease-advice.org/building-management/repairs/water-leaks/",
            "https://www.lease-advice.org/template-letters/template-letter-repairs/",
        ),
    ),
    "lease_extension": (
        "https://www.lease-advice.org/lease-extension/flats/getting-started/",
        (
            "https://www.lease-advice.org/lease-extension/flats/formal-route/",
            "https://www.lease-advice.org/lease-extension-calculator/",
        ),
    ),
    "disputes": (
        "https://www.lease-advice.org/disputes/resolving-leasehold-disputes/landlord-managing-agent-disputes/",
        (
            "https://www.lease-advice.org/disputes/alternative-dispute-resolution/",
            "https://www.lease-advice.org/disputes/redress-schemes/",
        ),
    ),
}


@pytest.mark.parametrize("scenario", KNOWN_SCENARIO_RESOURCES)
def test_known_topic_includes_expected_guidance_resources(
    api_client: APIClient,
    scenario: str,
) -> None:
    primary_url, related_urls = KNOWN_SCENARIO_RESOURCES[scenario]
    response = api_client.post(
        TRIAGE_URL,
        {"scenario": scenario},
        format="json",
    )
    assert response.status_code == 200
    topic = response.data["topic"]
    assert topic["primaryResource"] is not None
    assert set(topic["primaryResource"].keys()) == RESOURCE_KEYS
    assert topic["primaryResource"]["url"] == primary_url
    assert [item["url"] for item in topic["relatedResources"]] == list(related_urls)
    for item in topic["relatedResources"]:
        assert set(item.keys()) == RESOURCE_KEYS


def test_unknown_topic_has_no_guidance_resources(api_client: APIClient) -> None:
    response = api_client.post(
        TRIAGE_URL,
        {"description": "I have a question about my home"},
        format="json",
    )
    assert response.status_code == 200
    topic = response.data["topic"]
    assert topic["slug"] == "unknown"
    assert topic["primaryResource"] is None
    assert topic["relatedResources"] == []
    assert "TOPIC_PHRASES" not in response.content.decode()
    assert "SCENARIO_TO_TOPIC_SLUG" not in response.content.decode()
