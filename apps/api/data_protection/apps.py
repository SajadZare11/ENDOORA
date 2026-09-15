from __future__ import annotations
from django.apps import AppConfig

class DataProtectionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "data_protection"
    verbose_name = "Data Protection & Privacy"
