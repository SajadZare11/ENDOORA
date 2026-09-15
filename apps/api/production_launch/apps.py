from __future__ import annotations

from django.apps import AppConfig


class ProductionLaunchConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "production_launch"
    verbose_name = "Production Launch & Golden Flows"
