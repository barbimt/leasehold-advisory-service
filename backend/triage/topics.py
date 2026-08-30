from dataclasses import dataclass


@dataclass(frozen=True)
class GuidanceResource:
    title: str
    summary: str
    url: str
    link_text: str


@dataclass(frozen=True)
class Topic:
    slug: str
    label: str
    summary: str
    next_step: str
    primary_resource: GuidanceResource | None = None
    related_resources: tuple[GuidanceResource, ...] = ()


ABOUT_SERVICE_CHARGES = GuidanceResource(
    title="About service charges",
    summary=(
        "An introduction to service charges, including what they can "
        "cover and your rights as a leaseholder."
    ),
    url="https://www.lease-advice.org/costs-and-charges/service-charges/about-service-charges/",
    link_text="Read about service charges",
)

RIGHTS_TO_SERVICE_CHARGE_INFORMATION = GuidanceResource(
    title="Rights to see information about service charges",
    summary=(
        "How to ask for a summary of costs and inspect supporting "
        "accounts and receipts."
    ),
    url="https://www.lease-advice.org/costs-and-charges/service-charges/about-service-charges/rights-information/",
    link_text="Read about rights to see service charge information",
)

CHALLENGING_SERVICE_CHARGES = GuidanceResource(
    title="Challenging service charges",
    summary="Reasons you may be able to query a service charge, and where to start.",
    url="https://www.lease-advice.org/costs-and-charges/service-charges/challenging-service-charges/",
    link_text="Read about challenging service charges",
)

SECTION_20_CONSULTATION = GuidanceResource(
    title="Responding to Section 20 consultation",
    summary=(
        "Your consultation rights for major works or long-term "
        "agreements, and how to respond."
    ),
    url="https://www.lease-advice.org/costs-and-charges/section-20-consultation/responding-to-section-20-consultation/",
    link_text="Read about responding to Section 20 consultation",
)

LANDLORD_DOES_NOT_CONSULT = GuidanceResource(
    title="What happens if your landlord does not consult",
    summary="What to consider if the Section 20 consultation process was not followed.",
    url="https://www.lease-advice.org/costs-and-charges/section-20-consultation/if-your-landlord-does-not-consult/",
    link_text="Read about what happens if your landlord does not consult",
)

REPAIRS_AND_MAINTENANCE = GuidanceResource(
    title="Repairs and maintenance in leasehold properties",
    summary="Who is usually responsible for repairs, and how to request work.",
    url="https://www.lease-advice.org/building-management/repairs/repairs-and-maintenance-in-leasehold-properties/",
    link_text="Read about repairs and maintenance",
)

WATER_LEAKS = GuidanceResource(
    title="Water leaks in leasehold flats",
    summary="Who may be responsible for leaks, and what to check in your lease.",
    url="https://www.lease-advice.org/building-management/repairs/water-leaks/",
    link_text="Read about water leaks in leasehold flats",
)

REPAIRS_TEMPLATE_LETTER = GuidanceResource(
    title="Template letter to landlord: asking for repairs",
    summary="A template you can use to write to your landlord about repairs.",
    url="https://www.lease-advice.org/template-letters/template-letter-repairs/",
    link_text="Read the template letter for asking for repairs",
)

LEASE_EXTENSION_GETTING_STARTED = GuidanceResource(
    title="Lease extension: getting started",
    summary="The main routes to extending a lease, and what to consider first.",
    url="https://www.lease-advice.org/lease-extension/flats/getting-started/",
    link_text="Read about getting started with a lease extension",
)

LEASE_EXTENSION_FORMAL_ROUTE = GuidanceResource(
    title="Lease extension: the formal route",
    summary="How the statutory lease extension process works if you qualify.",
    url="https://www.lease-advice.org/lease-extension/flats/formal-route/",
    link_text="Read about the formal lease extension route",
)

LEASE_EXTENSION_CALCULATOR = GuidanceResource(
    title="Lease extension calculator",
    summary="A tool to check lease length and estimate the cost of an extension.",
    url="https://www.lease-advice.org/lease-extension-calculator/",
    link_text="Use the lease extension calculator",
)

RESOLVING_LANDLORD_DISPUTES = GuidanceResource(
    title="How to resolve disputes with landlords or managing agents",
    summary="Practical first steps if you have a disagreement about your building.",
    url="https://www.lease-advice.org/disputes/resolving-leasehold-disputes/landlord-managing-agent-disputes/",
    link_text="Read about resolving disputes with landlords or managing agents",
)

ALTERNATIVE_DISPUTE_RESOLUTION = GuidanceResource(
    title="Alternative dispute resolution",
    summary="Options such as mediation that do not start with a tribunal application.",
    url="https://www.lease-advice.org/disputes/alternative-dispute-resolution/",
    link_text="Read about alternative dispute resolution",
)

REDRESS_SCHEMES = GuidanceResource(
    title="Redress schemes for complaints about property managers",
    summary="How to complain about a property manager through an approved redress scheme.",
    url="https://www.lease-advice.org/disputes/redress-schemes/",
    link_text="Read about redress schemes for property managers",
)


SERVICE_CHARGES = Topic(
    slug="service-charges",
    label="Service charges",
    summary=(
        "This topic may be relevant to questions about charges for "
        "maintaining or managing your building."
    ),
    next_step=(
        "Read any demand or bill you have received and look at LEASE "
        "guidance on service charges. Contact LEASE if you still need "
        "help finding the right information. This is navigation, not "
        "legal advice."
    ),
    primary_resource=ABOUT_SERVICE_CHARGES,
    related_resources=(
        RIGHTS_TO_SERVICE_CHARGE_INFORMATION,
        CHALLENGING_SERVICE_CHARGES,
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
        "Check whether you were sent a consultation notice, keep any "
        "letters or bills, and look at LEASE guidance on Section 20. "
        "Contact LEASE if you still need help finding the right "
        "information. This is navigation, not legal advice."
    ),
    primary_resource=SECTION_20_CONSULTATION,
    related_resources=(
        ABOUT_SERVICE_CHARGES,
        LANDLORD_DOES_NOT_CONSULT,
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
        "Check your lease if you have it, keep a record of the problem, "
        "and look at LEASE guidance on repairs. Contact LEASE if you "
        "still need help finding the right information. This is "
        "navigation, not legal advice."
    ),
    primary_resource=REPAIRS_AND_MAINTENANCE,
    related_resources=(
        WATER_LEAKS,
        REPAIRS_TEMPLATE_LETTER,
    ),
)

LEASE_EXTENSION = Topic(
    slug="lease-extension",
    label="Lease extension",
    summary=(
        "This topic may be relevant to questions about extending the length of a lease."
    ),
    next_step=(
        "Look at LEASE guidance on getting started with a lease "
        "extension, including the main routes and the calculator. "
        "Contact LEASE if you still need help finding the right "
        "information. This is navigation, not legal advice."
    ),
    primary_resource=LEASE_EXTENSION_GETTING_STARTED,
    related_resources=(
        LEASE_EXTENSION_FORMAL_ROUTE,
        LEASE_EXTENSION_CALCULATOR,
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
        "Look at LEASE guidance on first steps for disagreements with a "
        "landlord or managing agent. Contact LEASE if you still need "
        "help finding the right information. This is navigation, not "
        "legal advice."
    ),
    primary_resource=RESOLVING_LANDLORD_DISPUTES,
    related_resources=(
        ALTERNATIVE_DISPUTE_RESOLUTION,
        REDRESS_SCHEMES,
    ),
)

UNKNOWN = Topic(
    slug="unknown",
    label="Unknown / not sure",
    summary="We could not match this to one of the supported topics.",
    next_step=(
        "Try choosing a common situation or describing what is happening "
        "in a different way. You can also browse LEASE guidance or "
        "contact LEASE. This tool does not give legal advice."
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
