from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from triage.classifier import classify
from triage.serializers import TopicResponseSerializer, TriageRequestSerializer


class TriageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TriageRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        topic = classify(
            scenario=serializer.validated_data.get("scenario"),
            description=serializer.validated_data.get("description"),
        )
        return Response({"topic": TopicResponseSerializer(topic).data})
