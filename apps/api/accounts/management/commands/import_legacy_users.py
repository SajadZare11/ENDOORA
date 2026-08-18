from __future__ import annotations

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils.dateparse import parse_datetime

from accounts.models import User


class Command(BaseCommand):
    help = "Import users exported from Django's legacy auth.User model before the Day 07 database rebuild."

    def add_arguments(self, parser):
        parser.add_argument("json_path")

    def handle(self, *args, **options):
        path = Path(options["json_path"])
        if not path.exists():
            raise CommandError(f"File does not exist: {path}")

        payload = json.loads(path.read_text(encoding="utf-8"))
        imported = 0
        skipped = 0

        for item in payload:
            if item.get("model") != "auth.user":
                continue

            legacy_pk = item.get("pk")
            fields = item.get("fields", {})
            email = (fields.get("email") or "").strip().lower()
            if not email:
                email = f"legacy-user-{legacy_pk}@invalid.endoora.local"

            if User.objects.filter(email=email).exists():
                skipped += 1
                continue

            user = User(
                email=email,
                first_name=fields.get("first_name", ""),
                last_name=fields.get("last_name", ""),
                is_staff=bool(fields.get("is_staff")),
                is_active=bool(fields.get("is_active", True)),
                is_superuser=bool(fields.get("is_superuser")),
                role=(
                    User.Role.ADMINISTRATOR
                    if fields.get("is_superuser")
                    else User.Role.SUPPORT
                    if fields.get("is_staff")
                    else User.Role.LEARNER
                ),
            )
            user.password = fields.get("password", "")
            user.last_login = parse_datetime(fields["last_login"]) if fields.get("last_login") else None
            if fields.get("date_joined"):
                parsed = parse_datetime(fields["date_joined"])
                if parsed is not None:
                    user.date_joined = parsed
            user.save()
            user.groups.set(fields.get("groups", []))
            user.user_permissions.set(fields.get("user_permissions", []))
            imported += 1

        self.stdout.write(
            self.style.SUCCESS(f"Imported {imported} legacy user(s); skipped {skipped}.")
        )
