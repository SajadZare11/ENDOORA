from __future__ import annotations

from django.apps import AppConfig


class IncidentResponseConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "incident_response"
    verbose_name = "Incident Response & Production Launch Gate"
