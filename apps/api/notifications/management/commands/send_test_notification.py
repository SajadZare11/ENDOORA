from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from notifications.models import Notification
from notifications.services.dispatcher import NotificationDispatcher

User = get_user_model()


class Command(BaseCommand):
    help = "Dispatch test in-app and SMS notifications to a user (OPS-006)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--email",
            type=str,
            help="Target user email. If omitted, targets first available user.",
        )
        parser.add_argument(
            "--title",
            type=str,
            default="اعلان آزمایشی سیستم",
            help="Notification title.",
        )
        parser.add_argument(
            "--message",
            type=str,
            default="این یک اعلان آزمایشی جهت تایید عملکرد زیرسیستم اعلان‌ها و پیامک است.",
            help="Notification body.",
        )
        parser.add_argument(
            "--sms",
            action="store_true",
            help="Also trigger simulated SMS dispatch.",
        )

    def handle(self, *args, **options) -> None:
        email = options.get("email")
        if email:
            user = User.objects.filter(email=email).first()
        else:
            user = User.objects.first()

        if not user:
            self.stdout.write(self.style.ERROR("No user found in database."))
            return

        channels = [Notification.Channel.IN_APP]
        if options.get("sms"):
            channels.append(Notification.Channel.SMS)

        res = NotificationDispatcher.send_notification(
            user=user,
            title=options["title"],
            message=options["message"],
            category=Notification.Category.SYSTEM,
            channels=channels,
        )

        if res["success"]:
            self.stdout.write(self.style.SUCCESS(f"Notification successfully dispatched to {user.email} (SMS: {res.get('sms_dispatched')})"))
        else:
            self.stdout.write(self.style.WARNING(f"Dispatch failed: {res.get('reason')}"))
