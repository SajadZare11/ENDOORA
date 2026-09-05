"""
Endoora AI Mistake Genome - Models
Persistent map of recurring language errors, L1 Persian transfer patterns,
and evidence-driven practice targeting.
"""

from django.conf import settings
from django.db import models
from django.utils import timezone


class MistakeCategory(models.TextChoices):
    GRAMMAR = "grammar", "Grammar & Structure"
    LEXICAL = "lexical", "Lexical & Vocabulary"
    COLLOCATION = "collocation", "Collocations & Phrasing"
    SPELLING = "spelling", "Spelling & Mechanics"
    DISCOURSE = "discourse", "Discourse & Cohesion"
    COMPREHENSION = "comprehension", "Comprehension & Nuance"
    PRONUNCIATION = "pronunciation", "Pronunciation & Stress"
    STRATEGY = "strategy", "Learning Strategy & Avoidance"


class MistakeSeverity(models.TextChoices):
    MINOR = "minor", "Minor (Slip / Typo candidate)"
    MODERATE = "moderate", "Moderate (Noticeable error)"
    CRITICAL = "critical", "Critical (Comprehension barrier)"


class MistakeStatus(models.TextChoices):
    OCCASIONAL = "occasional", "Occasional (Under evidence threshold)"
    RECURRING = "recurring", "Recurring (Persistent pattern)"
    DISPUTED = "disputed", "Disputed (Excluded from recommendations)"
    MASTERED = "mastered", "Mastered (Overcome through practice)"


class LearnerMistakePattern(models.Model):
    """
    Aggregated linguistic error pattern for a specific learner.
    Must accumulate multiple evidence events before progressing from 'occasional' to 'recurring'.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mistake_patterns",
    )
    category = models.CharField(
        max_length=50,
        choices=MistakeCategory.choices,
        default=MistakeCategory.GRAMMAR,
    )
    tag = models.CharField(
        max_length=120,
        help_text="Normalized machine key, e.g. grammar.third_person_s",
    )
    title_fa = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    description_fa = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    l1_interference_note_fa = models.TextField(
        blank=True,
        help_text="Constructive explanation of Persian-English transfer root",
    )
    l1_interference_note_en = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=MistakeStatus.choices,
        default=MistakeStatus.OCCASIONAL,
    )
    severity = models.CharField(
        max_length=20,
        choices=MistakeSeverity.choices,
        default=MistakeSeverity.MODERATE,
    )
    evidence_count = models.PositiveIntegerField(default=1)
    decay_score = models.FloatField(
        default=1.0,
        help_text="Decay multiplier for recency-based relevance",
    )
    is_disputed = models.BooleanField(
        default=False,
        help_text="If disputed, stops targeting in recommendations",
    )
    dispute_reason = models.TextField(blank=True)
    disputed_at = models.DateTimeField(null=True, blank=True)
    first_seen_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-evidence_count", "-last_seen_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["learner", "tag"],
                name="unique_learner_mistake_tag",
            )
        ]
        indexes = [
            models.Index(fields=["learner", "status"]),
            models.Index(fields=["learner", "category"]),
            models.Index(fields=["learner", "severity"]),
        ]

    def __str__(self):
        return f"[{self.status}] {self.tag} ({self.evidence_count}x) for learner {self.learner_id}"

    @property
    def is_recurring(self) -> bool:
        return self.status == MistakeStatus.RECURRING and not self.is_disputed


class MistakeEvidence(models.Model):
    """
    A single factual occurrence supporting a mistake pattern.
    Stored privately to the learner; sanitized and strippable.
    """

    pattern = models.ForeignKey(
        LearnerMistakePattern,
        on_delete=models.CASCADE,
        related_name="evidence_records",
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mistake_evidences",
    )
    source_activity = models.CharField(
        max_length=50,
        default="exercise",
        help_text="placement, exercise, writing, speaking, srs, etc.",
    )
    source_id = models.CharField(max_length=100, blank=True)
    raw_mistake_snippet = models.TextField(
        help_text="Sanitized excerpt displaying the error; strictly private",
    )
    correction_snippet = models.TextField(
        help_text="Natural target language correction",
    )
    explanation_fa = models.TextField(blank=True)
    explanation_en = models.TextField(blank=True)
    is_scrubbed = models.BooleanField(
        default=False,
        help_text="True if personal text snippet was scrubbed upon learner deletion request",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["pattern", "created_at"]),
            models.Index(fields=["learner", "created_at"]),
        ]

    def __str__(self):
        return f"Evidence {self.id} for {self.pattern.tag} in {self.source_activity}"


# Legacy model aliases for backward compatibility
LearnerMistake = LearnerMistakePattern
MistakePattern = LearnerMistakePattern
