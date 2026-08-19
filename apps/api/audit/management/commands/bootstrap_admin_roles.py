from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from audit.admin_policy import (
    EDITOR_PREFIXES,
    FINANCE_PREFIXES,
    GROUP_EDITOR,
    GROUP_FINANCE,
    GROUP_MODERATOR,
    GROUP_SUPPORT,
    MODERATOR_PREFIXES,
    SUPPORT_VIEW,
)


def permissions_for(*, labels: set[str] | None = None, prefixes: tuple[str, ...] = (), actions: set[str]):
    queryset = Permission.objects.select_related("content_type")
    result = []
    for permission in queryset:
        label = f"{permission.content_type.app_label}.{permission.content_type.model}"
        action = permission.codename.split("_", 1)[0]
        if action not in actions:
            continue
        if labels is not None and label in labels:
            result.append(permission)
            continue
        if prefixes and any(label.startswith(prefix) for prefix in prefixes):
            result.append(permission)
    return result


class Command(BaseCommand):
    help = "Create conservative Endoora operational groups and permissions."

    def handle(self, *args, **options):
        support, _ = Group.objects.get_or_create(name=GROUP_SUPPORT)
        editor, _ = Group.objects.get_or_create(name=GROUP_EDITOR)
        finance, _ = Group.objects.get_or_create(name=GROUP_FINANCE)
        moderator, _ = Group.objects.get_or_create(name=GROUP_MODERATOR)

        support.permissions.set(
            permissions_for(labels=SUPPORT_VIEW, actions={"view"})
        )
        editor.permissions.set(
            permissions_for(prefixes=EDITOR_PREFIXES, actions={"view", "add", "change"})
        )
        finance.permissions.set(
            permissions_for(prefixes=FINANCE_PREFIXES, actions={"view", "add"})
        )
        moderator.permissions.set(
            permissions_for(prefixes=MODERATOR_PREFIXES, actions={"view", "add", "change"})
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Endoora operational groups created/updated with least-privilege permissions."
            )
        )
