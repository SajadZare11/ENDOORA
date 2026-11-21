from django.conf import settings
from rest_framework.exceptions import APIException


class SimulationDisabled(APIException):
    status_code = 503
    default_detail = "Simulated operations are disabled. Use the verified PostgreSQL backup and restore procedure."


def require_demo_operations():
    if not getattr(settings, "ENDOORA_DEMO_OPERATIONS", False):
        raise SimulationDisabled()
