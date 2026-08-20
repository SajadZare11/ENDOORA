from rest_framework.permissions import BasePermission


class IsQuestionEditorOrAdministrator(BasePermission):
    """Server-side editor boundary. Generic `is_staff` is intentionally insufficient."""

    message = "Question-bank editor or administrator permission is required."

    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if user.is_superuser:
            return True
        return getattr(user, "role", None) in {"editor", "administrator"}
