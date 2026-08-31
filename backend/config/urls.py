from django.urls import include, path

urlpatterns = [
    path("api/triage/", include("triage.urls")),
]
