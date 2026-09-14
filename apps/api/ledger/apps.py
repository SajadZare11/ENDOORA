from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class LedgerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ledger"
    verbose_name = _("دفتر کل مالی و عملیات تسویه")
