from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from accounts.models import User


class Command(BaseCommand):
    help = "Explicit development and testing command to create or update local development users."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True, help="User email address")
        parser.add_argument("--password", required=True, help="User password")
        parser.add_argument(
            "--role",
            default=User.Role.LEARNER,
            choices=[User.Role.LEARNER, User.Role.TEACHER, User.Role.ADMINISTRATOR],
            help="Account role (learner, teacher, administrator)",
        )
        parser.add_argument("--phone", default="", help="Optional phone number")

    def handle(self, *args, **options):
        email = options["email"].strip().lower()
        password = options["password"]
        role = options["role"]
        phone = options["phone"].strip()

        with transaction.atomic():
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "role": role,
                    "phone": phone,
                    "preferred_locale": User.Locale.PERSIAN,
                    "is_staff": role == User.Role.ADMINISTRATOR,
                    "is_superuser": role == User.Role.ADMINISTRATOR,
                },
            )
            user.set_password(password)
            if not created:
                user.role = role
                if phone:
                    user.phone = phone
                if role == User.Role.ADMINISTRATOR:
                    user.is_staff = True
                    user.is_superuser = True
            user.save()

        action = "Created" if created else "Updated password for"
        self.stdout.write(self.style.SUCCESS(f"{action} dev user: {email} (role: {role})"))
