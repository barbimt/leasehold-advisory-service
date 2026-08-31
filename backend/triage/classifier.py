import re

from triage.topics import TOPICS_BY_SLUG, UNKNOWN, Topic

_NON_WORD = re.compile(r"[^\w\s]+", re.UNICODE)

SCENARIO_TO_TOPIC_SLUG = {
    "service_charges": "service-charges",
    "major_works": "major-works",
    "repairs": "repairs",
    "lease_extension": "lease-extension",
    "disputes": "disputes",
    "not_sure": "unknown",
}

TOPIC_PHRASES = {
    "service-charges": (
        "service charge",
        "service charges",
        "ground rent",
    ),
    "major-works": (
        "section 20",
        "major work",
        "major works",
    ),
    "repairs": (
        "repair",
        "repairs",
        "repairing",
        "damp",
        "leak",
        "leaks",
        "leaking",
        "maintenance",
    ),
    "lease-extension": (
        "lease extension",
        "lease extensions",
    ),
    "disputes": (
        "dispute",
        "disputes",
    ),
}


def _normalise(value: str | None) -> str:
    if value is None:
        return ""
    return " ".join(value.split()).casefold()


def _normalise_description(value: str | None) -> str:
    return " ".join(_NON_WORD.sub(" ", _normalise(value)).split())


def _contains_phrase(normalised_text: str, phrase: str) -> bool:
    haystack = normalised_text.split()
    needle = phrase.split()
    if not needle or len(needle) > len(haystack):
        return False

    return any(
        haystack[index : index + len(needle)] == needle
        for index in range(len(haystack) - len(needle) + 1)
    )


def classify(
    *,
    scenario: str | None = None,
    description: str | None = None,
) -> Topic:
    scenario_slug = SCENARIO_TO_TOPIC_SLUG.get(_normalise(scenario))
    if scenario_slug is not None:
        return TOPICS_BY_SLUG[scenario_slug]

    normalised_description = _normalise_description(description)
    if not normalised_description:
        return UNKNOWN

    matched_slugs = [
        slug
        for slug, phrases in TOPIC_PHRASES.items()
        if any(_contains_phrase(normalised_description, phrase) for phrase in phrases)
    ]
    if len(matched_slugs) != 1:
        return UNKNOWN

    return TOPICS_BY_SLUG[matched_slugs[0]]
