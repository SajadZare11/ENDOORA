from __future__ import annotations

from rest_framework.permissions import BasePermission


class IsContentEditorOrAdministrator(BasePermission):
    """Server-side editor boundary for Content CMS. Generic authenticated user is insufficient."""

    message = "Content editor or administrator permission is required."

    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if user.is_superuser or getattr(user, "is_staff", False):
            return True
        return getattr(user, "role", None) in {"editor", "administrator"}
