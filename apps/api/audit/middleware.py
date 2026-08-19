from __future__ import annotations

import os

from .context import audit_context


_ALLOWED_OPERATOR_ROLES = {"administrator", "support", "editor"}
_ALLOWED_OPERATOR_GROUPS = {
    "Endoora Support",
    "Endoora Content Editor",
    "Endoora Finance",
    "Endoora Moderator",
}


def _is_privileged_request(user) -> bool:
    if not getattr(user, "is_authenticated", False):
        return False
    if not getattr(user, "is_active", False):
        return False
    if not getattr(user, "is_staff", False):
        return False
    if getattr(user, "is_superuser", False):
        return True

    if getattr(user, "role", "") in _ALLOWED_OPERATOR_ROLES:
        return True

    if getattr(user, "pk", None):
        return user.groups.filter(name__in=_ALLOWED_OPERATOR_GROUPS).exists()
    return False


class AuditContextMiddleware:
    """Attach a request-scoped actor/context to privileged mutations.

    The middleware does not itself write an audit record. Model signals create
    events only when a tracked model actually changes.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)
        enabled = (
            request.method.upper() in {"POST", "PUT", "PATCH", "DELETE"}
            and _is_privileged_request(user)
        )

        reason = request.headers.get("X-Endoora-Audit-Reason", "").strip()
        environment = os.getenv("ENDOORA_ENVIRONMENT", "development")

        with audit_context(
            actor=user if enabled else None,
            reason=reason,
            request_method=request.method,
            request_path=request.path,
            environment=environment,
            enabled=enabled,
        ):
            return self.get_response(request)
