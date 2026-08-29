from rest_framework import serializers

DESCRIPTION_MAX_LENGTH = 2000
ALLOWED_REQUEST_FIELDS = frozenset({"scenario", "description"})


class TriageRequestSerializer(serializers.Serializer):
    scenario = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=DESCRIPTION_MAX_LENGTH,
    )

    def to_internal_value(self, data):
        if isinstance(data, dict):
            unexpected = sorted(set(data) - ALLOWED_REQUEST_FIELDS)
            if unexpected:
                raise serializers.ValidationError(
                    {field: "This field is not accepted." for field in unexpected}
                )
        return super().to_internal_value(data)

    def validate(self, attrs):
        scenario = (attrs.get("scenario") or "").strip()
        description = (attrs.get("description") or "").strip()
        if not scenario and not description:
            raise serializers.ValidationError(
                "Choose a situation or describe what is happening."
            )
        return attrs


class TopicResponseSerializer(serializers.Serializer):
    slug = serializers.CharField()
    label = serializers.CharField()
    summary = serializers.CharField()
    nextStep = serializers.CharField(source="next_step")
