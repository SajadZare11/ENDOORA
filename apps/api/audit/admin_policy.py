from __future__ import annotations

from django.contrib import admin


_INSTALLED = False

SUPPORT_VIEW = {
    "accounts.user",
    "accounts.accountdeletionrequest",
}

EDITOR_PREFIXES = (
    "content.",
    "courses.",
    "questions.",
    "taxonomy.",
)

FINANCE_PREFIXES = (
    "orders.",
    "payments.",
    "subscriptions.",
)

MODERATOR_PREFIXES = (
    "community.",
    "moderation.",
    "support.",
)

GROUP_SUPPORT = "Endoora Support"
GROUP_EDITOR = "Endoora Content Editor"
GROUP_FINANCE = "Endoora Finance"
GROUP_MODERATOR = "Endoora Moderator"

_OPERATOR_GROUPS = {
    GROUP_SUPPORT,
    GROUP_EDITOR,
    GROUP_FINANCE,
    GROUP_MODERATOR,
}


def _group_names(user) -> set[str]:
    if not getattr(user, "pk", None):
        return set()
    return set(
        user.groups.filter(name__in=_OPERATOR_GROUPS).values_list("name", flat=True)
    )


def _matches_prefix(label: str, prefixes: tuple[str, ...]) -> bool:
    return any(label.startswith(prefix) for prefix in prefixes)


def is_action_allowed(user, label: str, action: str) -> bool:
    if not getattr(user, "is_authenticated", False):
        return False
    if not getattr(user, "is_active", False):
        return False
    if not getattr(user, "is_staff", False):
        return False
    if getattr(user, "is_superuser", False):
        return True

    role = getattr(user, "role", "")
    groups = _group_names(user)

    # Administrator remains subject to Django's normal model permission check
    # after this role gate returns True.
    if role == "administrator":
        return True

    if role == "support" or GROUP_SUPPORT in groups:
        return action == "view" and label in SUPPORT_VIEW

    if role == "editor" or GROUP_EDITOR in groups:
        if not _matches_prefix(label, EDITOR_PREFIXES):
            return False
        return action in {"view", "add", "change"}

    if GROUP_FINANCE in groups:
        if not _matches_prefix(label, FINANCE_PREFIXES):
            return False
        # Financial status is deliberately not freely deletable.
        return action in {"view", "add"}

    if GROUP_MODERATOR in groups:
        if not _matches_prefix(label, MODERATOR_PREFIXES):
            return False
        return action in {"view", "add", "change"}

    return False


def _site_operator_allowed(user) -> bool:
    if not getattr(user, "is_authenticated", False):
        return False
    if not getattr(user, "is_active", False):
        return False
    if not getattr(user, "is_staff", False):
        return False
    if getattr(user, "is_superuser", False):
        return True
    if getattr(user, "role", "") in {"administrator", "support", "editor"}:
        return True
    return bool(_group_names(user))


def _install_modeladmin_guard(
    *,
    method_name: str,
    action: str,
    accepts_obj: bool,
) -> None:
    original = getattr(admin.ModelAdmin, method_name)

    if accepts_obj:

        def guarded(
            self,
            request,
            obj=None,
            _original=original,
            _action=action,
        ):
            label = self.model._meta.label_lower
            if not is_action_allowed(request.user, label, _action):
                return False
            return _original(self, request, obj)

    else:

        def guarded(
            self,
            request,
            _original=original,
            _action=action,
        ):
            label = self.model._meta.label_lower
            if not is_action_allowed(request.user, label, _action):
                return False
            # Django ModelAdmin.has_add_permission() accepts only
            # (self, request). Passing obj here raises TypeError.
            return _original(self, request)

    setattr(admin.ModelAdmin, method_name, guarded)


def install_admin_policy() -> None:
    global _INSTALLED
    if _INSTALLED:
        return

    original_site_has_permission = admin.AdminSite.has_permission

    def site_has_permission(self, request):
        return (
            original_site_has_permission(self, request)
            and _site_operator_allowed(request.user)
        )

    admin.AdminSite.has_permission = site_has_permission

    _install_modeladmin_guard(
        method_name="has_view_permission",
        action="view",
        accepts_obj=True,
    )
    _install_modeladmin_guard(
        method_name="has_add_permission",
        action="add",
        accepts_obj=False,
    )
    _install_modeladmin_guard(
        method_name="has_change_permission",
        action="change",
        accepts_obj=True,
    )
    _install_modeladmin_guard(
        method_name="has_delete_permission",
        action="delete",
        accepts_obj=True,
    )

    _INSTALLED = True
