from django.apps import AppConfig


class AuditConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "audit"
    verbose_name = "Audit"

    def ready(self):
        # Imports are deliberately deferred until Django has loaded all apps/models.
        from . import signals  # noqa: F401
        from .admin_policy import install_admin_policy

        install_admin_policy()
