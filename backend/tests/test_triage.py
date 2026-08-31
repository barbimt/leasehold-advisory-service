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


def test_disputes_plural_free_text_maps_correctly() -> None:
    topic = classify(description="I have disputes with the managing agent")
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


def test_major_work_singular_free_text_maps_to_major_works() -> None:
    topic = classify(description="We need major work on the roof")
    assert topic.slug == "major-works"


def test_ground_rent_free_text_maps_to_service_charges() -> None:
    topic = classify(description="My ground rent has gone up")
    assert topic.slug == "service-charges"


def test_damp_free_text_maps_to_repairs() -> None:
    topic = classify(description="There is damp in the hallway")
    assert topic.slug == "repairs"


def test_leak_free_text_maps_to_repairs() -> None:
    topic = classify(description="There is a leak in the roof")
    assert topic.slug == "repairs"


def test_leaking_free_text_maps_to_repairs() -> None:
    topic = classify(description="The roof is leaking")
    assert topic.slug == "repairs"


def test_leaks_free_text_maps_to_repairs() -> None:
    topic = classify(description="There are leaks in the communal area")
    assert topic.slug == "repairs"


def test_maintenance_free_text_maps_to_repairs() -> None:
    topic = classify(description="Communal maintenance has stopped")
    assert topic.slug == "repairs"


def test_repairing_free_text_maps_to_repairs() -> None:
    topic = classify(description="Nobody is repairing the stairs")
    assert topic.slug == "repairs"


def test_repair_does_not_match_inside_another_word() -> None:
    topic = classify(description="The damage looks irreparable")
    assert topic.slug == "unknown"


def test_repairs_free_text_with_trailing_punctuation_maps_correctly() -> None:
    topic = classify(description="I need repairs.")
    assert topic.slug == "repairs"


def test_section_20_free_text_with_trailing_punctuation_maps_correctly() -> None:
    topic = classify(description="We received a Section 20.")
    assert topic.slug == "major-works"


def test_not_sure_scenario_is_used_even_if_description_would_match() -> None:
    topic = classify(
        scenario="not_sure",
        description="My service charges have gone up",
    )
    assert topic.slug == "unknown"
