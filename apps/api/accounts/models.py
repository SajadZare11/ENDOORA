from __future__ import annotations

import uuid

from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from .managers import UserManager
from .phone import normalize_iranian_mobile


class User(AbstractUser):
    class Role(models.TextChoices):
        LEARNER = "learner", "Learner"
        TEACHER = "teacher", "Teacher"
        EDITOR = "editor", "Content editor"
        SUPPORT = "support", "Support"
        ADMINISTRATOR = "administrator", "Administrator"

    class Locale(models.TextChoices):
        PERSIAN = "fa", "Persian"
        ENGLISH = "en", "English"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=13, unique=True, null=True, blank=True)
    phone_verified_at = models.DateTimeField(null=True, blank=True)
    role = models.CharField(max_length=24, choices=Role.choices, default=Role.LEARNER)
    preferred_locale = models.CharField(
        max_length=2, choices=Locale.choices, default=Locale.PERSIAN
    )

    # Capabilities are intentionally separate from the teacher role.
    is_teacher_verified = models.BooleanField(default=False)
    marketplace_eligible = models.BooleanField(default=False)
    paid_class_eligible = models.BooleanField(default=False)

    deactivated_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        ordering = ("email",)

    def save(self, *args, **kwargs):
        self.email = self.email.strip().lower()
        self.phone = normalize_iranian_mobile(self.phone)
        if not self.is_active and self.deactivated_at is None:
            self.deactivated_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def phone_verified(self) -> bool:
        return self.phone_verified_at is not None

    @property
    def email_verified(self) -> bool:
        return self.email_verified_at is not None

    @property
    def capabilities(self) -> dict[str, bool]:
        return {
            "teacher_verified": bool(self.is_teacher_verified),
            "marketplace_eligible": bool(
                self.is_teacher_verified and self.marketplace_eligible
            ),
            "paid_class_eligible": bool(
                self.is_teacher_verified and self.paid_class_eligible
            ),
        }


class ConsentRecord(models.Model):
    class ConsentType(models.TextChoices):
        TERMS = "terms", "Terms"
        PRIVACY = "privacy", "Privacy"
        MARKETING = "marketing", "Marketing"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="consent_records",
    )
    consent_type = models.CharField(max_length=24, choices=ConsentType.choices)
    version = models.CharField(max_length=32)
    locale = models.CharField(max_length=2, choices=User.Locale.choices, default=User.Locale.PERSIAN)
    source = models.CharField(max_length=64, default="account")
    accepted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-accepted_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("user", "consent_type", "version"),
                name="accounts_unique_consent_version",
            )
        ]

    def __str__(self) -> str:
        return f"{self.user_id}:{self.consent_type}:{self.version}"


class OneTimeCode(models.Model):
    class Purpose(models.TextChoices):
        PHONE_VERIFY = "phone_verify", "Phone verification"
        EMAIL_VERIFY = "email_verify", "Email verification"
        PASSWORD_RESET = "password_reset", "Password reset"
        LOGIN = "login", "Login"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    identifier = models.CharField(max_length=254, db_index=True)
    purpose = models.CharField(max_length=32, choices=Purpose.choices)
    code_hash = models.CharField(max_length=256)
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="requested_otps",
    )
    expires_at = models.DateTimeField()
    consumed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    max_attempts = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(
                fields=("identifier", "purpose", "created_at"),
                name="accounts_otp_lookup_idx",
            )
        ]

    @property
    def expired(self) -> bool:
        return timezone.now() >= self.expires_at

    def verify(self, raw_code: str) -> bool:
        if self.consumed_at is not None or self.expired or self.attempts >= self.max_attempts:
            return False

        if not check_password(raw_code, self.code_hash):
            self.attempts += 1
            self.save(update_fields=["attempts"])
            return False

        self.consumed_at = timezone.now()
        self.save(update_fields=["consumed_at"])
        return True


class AccountDeletionRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="deletion_requests",
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    reason_code = models.CharField(max_length=64, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField()
    cancelled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-requested_at",)

    def __str__(self) -> str:
        return f"{self.user_id}:{self.status}"
