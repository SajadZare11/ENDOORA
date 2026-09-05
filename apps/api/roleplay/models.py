from django.conf import settings
from django.db import models


class RoleplaySession(models.Model):
    """
    Tracks a text-based roleplay conversation session between a learner
    and an AI character persona within a structured scenario.
    """

    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("abandoned", "Abandoned"),
    ]

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="roleplay_sessions",
    )
    scenario_id = models.CharField(max_length=64)
    scenario_title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    turn_count = models.IntegerField(default=0)
    max_turns = models.IntegerField(default=10)
    goals_completed = models.JSONField(default=list, blank=True)
    xp_awarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Roleplay Session"
        verbose_name_plural = "Roleplay Sessions"

    def __str__(self):
        return f"Roleplay #{self.id} ({self.scenario_id}) - {self.learner.email} [{self.status}]"


class RoleplayMessage(models.Model):
    """
    Represents an individual utterance in a roleplay conversation.
    """

    SENDER_CHOICES = [
        ("character", "Character"),
        ("learner", "Learner"),
        ("system", "System"),
    ]

    session = models.ForeignKey(
        RoleplaySession,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.CharField(
        max_length=20,
        choices=SENDER_CHOICES,
        default="character",
    )
    sender_name = models.CharField(max_length=100, default="Assistant")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]
        verbose_name = "Roleplay Message"
        verbose_name_plural = "Roleplay Messages"

    def __str__(self):
        return f"[{self.session_id}] {self.sender_name}: {self.content[:40]}"


class RoleplayReport(models.Model):
    """
    Deferred post-conversation diagnostic report.
    Presents goal achievements, communicative fluency score, deferred error
    feedback (with option to add to Mistake Genome), and extracted vocabulary
    (with option to save to SRS deck).
    """

    session = models.OneToOneField(
        RoleplaySession,
        on_delete=models.CASCADE,
        related_name="report",
    )
    goals_achieved_count = models.IntegerField(default=0)
    total_goals_count = models.IntegerField(default=0)
    communicative_score = models.IntegerField(default=80)
    estimated_cefr = models.CharField(max_length=16, default="B1")
    accomplishments_fa = models.JSONField(default=list, blank=True)
    accomplishments_en = models.JSONField(default=list, blank=True)
    feedback_mistakes = models.JSONField(default=list, blank=True)
    vocabulary_extracted = models.JSONField(default=list, blank=True)
    xp_earned = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Roleplay Report"
        verbose_name_plural = "Roleplay Reports"

    def __str__(self):
        return f"Report for Session #{self.session_id} - Score: {self.communicative_score}"


# Backward compatibility aliases
ConversationSession = RoleplaySession
ConversationMessage = RoleplayMessage
