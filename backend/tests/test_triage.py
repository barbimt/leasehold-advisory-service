from triage.classifier import classify


def test_service_charges_scenario_maps_correctly() -> None:
    topic = classify(scenario="service_charges")
    assert topic.slug == "service-charges"


def test_major_works_scenario_maps_correctly() -> None:
    topic = classify(scenario="major_works")
    assert topic.slug == "major-works"


def test_repairs_scenario_maps_correctly() -> None:
    topic = classify(scenario="repairs")
    assert topic.slug == "repairs"


def test_lease_extension_scenario_maps_correctly() -> None:
    topic = classify(scenario="lease_extension")
    assert topic.slug == "lease-extension"


def test_disputes_scenario_maps_correctly() -> None:
    topic = classify(scenario="disputes")
    assert topic.slug == "disputes"


def test_not_sure_scenario_maps_to_unknown() -> None:
    topic = classify(scenario="not_sure")
    assert topic.slug == "unknown"


def test_unsupported_scenario_maps_to_unknown() -> None:
    topic = classify(scenario="park_homes")
    assert topic.slug == "unknown"


def test_empty_input_maps_to_unknown() -> None:
    topic = classify(scenario="  ", description="")
    assert topic.slug == "unknown"


def test_unclear_free_text_maps_to_unknown() -> None:
    topic = classify(description="I have a question about my home")
    assert topic.slug == "unknown"


def test_service_charges_free_text_maps_correctly() -> None:
    topic = classify(description="My service charges have gone up")
    assert topic.slug == "service-charges"


def test_major_works_free_text_maps_correctly() -> None:
    topic = classify(description="We received a Section 20 notice")
    assert topic.slug == "major-works"


def test_repairs_free_text_maps_correctly() -> None:
    topic = classify(description="The roof needs repair")
    assert topic.slug == "repairs"


def test_lease_extension_free_text_maps_correctly() -> None:
    topic = classify(description="I want a lease extension")
    assert topic.slug == "lease-extension"


def test_disputes_free_text_maps_correctly() -> None:
    topic = classify(description="I have a dispute with the managing agent")
    assert topic.slug == "disputes"


def test_multiple_topics_in_free_text_map_to_unknown() -> None:
    topic = classify(
        description="I have a dispute about my service charges",
    )
    assert topic.slug == "unknown"


def test_known_scenario_is_used_even_if_description_differs() -> None:
    topic = classify(
        scenario="repairs",
        description="I want a lease extension",
    )
    assert topic.slug == "repairs"
