from __future__ import annotations
from django.urls import path
from .views import (
    AdminPrivacyTelemetryView,
    AdminTriggerPurgeView,
    DataExportDownloadView,
    DataExportTriggerView,
    PrivacyPolicyManifestView,
    PrivacyPreferencesView,
)

urlpatterns = [
    path("preferences/", PrivacyPreferencesView.as_view(), name="privacy-preferences"),
    path("policy/", PrivacyPolicyManifestView.as_view(), name="privacy-policy-manifest"),
    path("export/", DataExportTriggerView.as_view(), name="privacy-export-trigger"),
    path("export/<uuid:export_id>/download/", DataExportDownloadView.as_view(), name="privacy-export-download"),
    path("ops/telemetry/", AdminPrivacyTelemetryView.as_view(), name="privacy-ops-telemetry"),
    path("ops/trigger-purge/", AdminTriggerPurgeView.as_view(), name="privacy-ops-trigger-purge"),
]
