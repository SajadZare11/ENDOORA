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

    # Section duration configuration in seconds (Grammar: 15m, Vocab: 15m, Reading: 12m, Listening: 10m, Speaking: 10m, Writing: 10m)
    SECTION_DURATIONS = {
        "grammar": 900,
        "vocabulary": 900,
        "reading": 720,
        "listening": 600,
        "speaking": 600,
        "writing": 600,
    }

    SECTION_SEQUENCE = [
        "grammar",
        "vocabulary",
        "reading",
        "listening",
        "speaking",
        "writing",
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="placement_sessions",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=Status.ACTIVE)
    current_section = models.CharField(max_length=32, default="grammar")
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when placement session was submitted and finalized",
    )
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()

    # Dynamic CAT item history tracking to forbid question repetition within and across sessions
    assigned_item_ids = models.JSONField(
        default=list,
        blank=True,
        help_text="List of item IDs assigned to the learner in this session",
    )

    # Section countdown timer and duration tracking
    section_started_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when the current active section was started",
    )
    section_time_remaining_sec = models.IntegerField(
        default=900,
        help_text="Remaining time in seconds for the current active section",
    )

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "status", "-started_at"]),
            models.Index(fields=["user", "-completed_at"]),
        ]

    def __str__(self):
        return f"{self.user_id} - {self.status} ({self.id})"

    @property
    def created_at(self):
        """Compatibility property mapping to started_at for activity feed and audit logs."""
        return self.started_at

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

    def advance_to_section(self, next_section: str) -> None:
        """
        Advances session to subsequent section, resetting section start time and timer.
        """
        now = timezone.now()
        duration = self.SECTION_DURATIONS.get(next_section, 600)
        self.current_section = next_section
        self.section_started_at = now
        self.section_time_remaining_sec = duration
        self.save(update_fields=["current_section", "section_started_at", "section_time_remaining_sec", "updated_at"])

    def finalize_submission(self) -> None:
        """
        Finalizes and locks the placement session with server timestamp.
        """
        now = timezone.now()
        self.status = self.Status.SUBMITTED
        self.completed_at = now
        self.save(update_fields=["status", "completed_at", "updated_at"])

    @classmethod
    def get_or_create_active_session(cls, user, expiration_hours: int = DEFAULT_EXPIRATION_HOURS) -> tuple["PlacementSession", bool]:
        """
        Retrieves current active unexpired session for user, or creates a new one.
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
            section_started_at=now,
            section_time_remaining_sec=cls.SECTION_DURATIONS.get("grammar", 900),
            assigned_item_ids=[],
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


class PlacementResult(models.Model):
    """
    Persistent psychometric result record for an evaluated placement session.
    Stores estimated latent ability theta, authentic 0-100 Endoora Placement Index,
    CEFR placement, multi-skill subscores, and pedagogical recommendations.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.OneToOneField(
        PlacementSession,
        on_delete=models.CASCADE,
        related_name="result",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="placement_results",
    )
    endoora_index = models.PositiveIntegerField(
        help_text="Authentic 0-100 Endoora Placement Index",
    )
    theta = models.FloatField(
        default=0.0,
        help_text="Rasch latent ability estimate in [-3.0, +3.0]",
    )
    standard_error = models.FloatField(
        default=0.0,
        help_text="Standard error SE(theta) of latent ability estimate",
    )
    cefr_level = models.CharField(
        max_length=8,
        default="A1",
        help_text="Estimated CEFR level: A1, A2, B1, B2, C1, C2",
    )
    skill_subscores = models.JSONField(
        default=dict,
        blank=True,
        help_text="Granular subscores across grammar, vocabulary, reading, listening, speaking, writing",
    )
    can_do_statements = models.JSONField(
        default=list,
        blank=True,
        help_text="Bilingual CEFR Can-Do competency descriptors",
    )
    curriculum_recommendations = models.JSONField(
        default=list,
        blank=True,
        help_text="Tailored textbook and roadmap recommendations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.user_id} - Index {self.endoora_index} ({self.cefr_level}) [{self.id}]"
