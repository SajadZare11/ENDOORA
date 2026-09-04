import uuid
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class PlacementSession(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUBMITTED = "submitted", "Submitted"
        EXPIRED = "expired", "Expired"

    STATUS_CHOICES = Status.choices
    DEFAULT_EXPIRATION_HOURS = 2

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="placement_sessions",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=Status.ACTIVE)
    current_section = models.CharField(max_length=50, default="grammar")
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.user_id} - {self.status} ({self.id})"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def is_active(self) -> bool:
        return self.status == self.Status.ACTIVE and not self.is_expired

    def check_expiration(self) -> bool:
        """If currently marked active but past expires_at, transition to expired."""
        if self.status == self.Status.ACTIVE and self.is_expired:
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status", "updated_at"])
            return True
        return False

    @property
    def answers_count(self) -> int:
        return self.answers.count()

    @classmethod
    def get_or_create_active_session(cls, user, expiration_hours: int = DEFAULT_EXPIRATION_HOURS) -> tuple["PlacementSession", bool]:
        """
        Retrieves the current active unexpired session for a user, or creates a new one.
        Guarantees that a user can resume their in-progress placement test.
        """
        now = timezone.now()
        active_sessions = cls.objects.filter(user=user, status=cls.Status.ACTIVE).order_by("-started_at")
        for sess in active_sessions:
            if sess.is_expired:
                sess.status = cls.Status.EXPIRED
                sess.save(update_fields=["status", "updated_at"])
            else:
                return sess, False

        new_session = cls.objects.create(
            user=user,
            status=cls.Status.ACTIVE,
            current_section="grammar",
            expires_at=now + timedelta(hours=expiration_hours),
        )
        return new_session, True


class PlacementAnswer(models.Model):
    idempotency_key = models.UUIDField(default=uuid.uuid4, unique=True)
    session = models.ForeignKey(
        PlacementSession,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    question_key = models.CharField(max_length=100)
    question_version = models.ForeignKey(
        "questions.QuestionVersion",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="placement_answers",
    )
    answer_value = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("session", "question_key")
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.session_id} - {self.question_key}"
