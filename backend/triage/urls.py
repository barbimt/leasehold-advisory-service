from django.urls import path

from triage.views import TriageView

urlpatterns = [
    path("", TriageView.as_view(), name="triage"),
]
