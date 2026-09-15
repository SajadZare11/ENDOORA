from __future__ import annotations

from rest_framework.permissions import BasePermission


class IsAdministratorOrStaff(BasePermission):
    """
    Enforces least-privilege boundary for executive operational console.
    Only active superusers, staff members, or users with the 'administrator' role are granted access.
    """

    message = "Administrator or executive staff authorization is required for operational control."

    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if user.is_superuser or getattr(user, "is_staff", False):
            return True
        return getattr(user, "role", None) == "administrator"
