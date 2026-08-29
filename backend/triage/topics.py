from dataclasses import dataclass


@dataclass(frozen=True)
class Topic:
    slug: str
    label: str
    summary: str
    next_step: str


SERVICE_CHARGES = Topic(
    slug="service-charges",
    label="Service charges",
    summary=(
        "This topic may be relevant to questions about charges for "
        "maintaining or managing your building."
    ),
    next_step=(
        "Look at LEASE information on service charges, or contact LEASE "
        "if you still need help understanding your situation. This is "
        "navigation, not legal advice."
    ),
)

MAJOR_WORKS = Topic(
    slug="major-works",
    label="Major works / Section 20",
    summary=(
        "This topic may be relevant to questions about large building "
        "works and consultation about those works."
    ),
    next_step=(
        "Look at LEASE information on major works and Section 20, or "
        "contact LEASE if you still need help understanding your "
        "situation. This is navigation, not legal advice."
    ),
)

REPAIRS = Topic(
    slug="repairs",
    label="Repairs",
    summary=(
        "This topic may be relevant to questions about the condition of "
        "your home or building and who may be responsible for repairs."
    ),
    next_step=(
        "Look at LEASE information on repairs, or contact LEASE if you "
        "still need help understanding your situation. This is "
        "navigation, not legal advice."
    ),
)

LEASE_EXTENSION = Topic(
    slug="lease-extension",
    label="Lease extension",
    summary=(
        "This topic may be relevant to questions about extending the length of a lease."
    ),
    next_step=(
        "Look at LEASE information on lease extension, or contact LEASE "
        "if you still need help understanding your situation. This is "
        "navigation, not legal advice."
    ),
)

DISPUTES = Topic(
    slug="disputes",
    label="Disputes",
    summary=(
        "This topic may be relevant to questions about a disagreement "
        "with a landlord, managing agent, or other leaseholders."
    ),
    next_step=(
        "Look at LEASE information on leasehold disputes, or contact "
        "LEASE if you still need help understanding your situation. "
        "This is navigation, not legal advice."
    ),
)

UNKNOWN = Topic(
    slug="unknown",
    label="Unknown / not sure",
    summary="We could not match this to one of the supported topics.",
    next_step=(
        "Try choosing a common situation, or contact LEASE for help. "
        "This tool does not give legal advice."
    ),
)

TOPICS_BY_SLUG = {
    topic.slug: topic
    for topic in (
        SERVICE_CHARGES,
        MAJOR_WORKS,
        REPAIRS,
        LEASE_EXTENSION,
        DISPUTES,
        UNKNOWN,
    )
}
