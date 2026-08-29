from triage.topics import TOPICS_BY_SLUG, UNKNOWN, Topic

SCENARIO_TO_TOPIC_SLUG = {
    "service_charges": "service-charges",
    "major_works": "major-works",
    "repairs": "repairs",
    "lease_extension": "lease-extension",
    "disputes": "disputes",
    "not_sure": "unknown",
}

TOPIC_PHRASES = {
    "service-charges": ("service charge",),
    "major-works": ("section 20", "major works"),
    "repairs": ("repair",),
    "lease-extension": ("lease extension",),
    "disputes": ("dispute",),
}


def _normalise(value: str | None) -> str:
    if value is None:
        return ""
    return " ".join(value.split()).casefold()


def classify(
    *,
    scenario: str | None = None,
    description: str | None = None,
) -> Topic:
    scenario_slug = SCENARIO_TO_TOPIC_SLUG.get(_normalise(scenario))
    if scenario_slug is not None:
        return TOPICS_BY_SLUG[scenario_slug]

    normalised_description = _normalise(description)
    if not normalised_description:
        return UNKNOWN

    matched_slugs = [
        slug
        for slug, phrases in TOPIC_PHRASES.items()
        if any(phrase in normalised_description for phrase in phrases)
    ]
    if len(matched_slugs) != 1:
        return UNKNOWN

    return TOPICS_BY_SLUG[matched_slugs[0]]
