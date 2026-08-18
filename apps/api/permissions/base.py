from rest_framework.permissions import BasePermission

from accounts.models import User


class IsSelfOrAdministrator(BasePermission):
    message = "You do not have permission to access this account."

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_superuser
                or request.user.role == User.Role.ADMINISTRATOR
                or getattr(obj, "pk", None) == request.user.pk
            )
        )


class HasAllowedRole(BasePermission):
    message = "Your role does not have permission to use this operation."

    def has_permission(self, request, view):
        allowed_roles = set(getattr(view, "allowed_roles", ()))
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in allowed_roles
        )


class IsVerifiedTeacher(BasePermission):
    message = "Teacher verification is required."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == User.Role.TEACHER
            and user.is_teacher_verified
        )
