from django.conf import settings
from django.db import models


class AIProviderConfig(models.Model):
    """Configuration for LLM API providers with strict budget and timeout ceilings."""

    name = models.CharField(max_length=100, unique=True, default="openrouter_main")
    provider = models.CharField(max_length=50, default="openrouter")
    api_base_url = models.CharField(
        max_length=255, default="https://openrouter.ai/api/v1"
    )
    api_key_env_var = models.CharField(
        max_length=100, default="ENDOORA_OPENROUTER_API_KEY"
    )
    timeout_seconds = models.PositiveIntegerField(
        default=15, help_text="Circuit breaker timeout in seconds"
    )
    daily_budget_usd = models.FloatField(
        default=5.0, help_text="Daily budget cap to prevent runaway billing"
    )
    current_daily_spend_usd = models.FloatField(default=0.0)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.provider}) - enabled={self.enabled}"


class AIRequestLog(models.Model):
    """Audit log for all backend LLM generation calls and fallback activations."""

    feature = models.CharField(max_length=100, default="exercise_generation")
    prompt_id = models.CharField(max_length=100, blank=True)
    prompt_version = models.CharField(max_length=20, blank=True)
    model_name = models.CharField(max_length=200)
    provider = models.CharField(max_length=50, default="openrouter")
    prompt_tokens = models.PositiveIntegerField(default=0)
    completion_tokens = models.PositiveIntegerField(default=0)
    total_cost_usd = models.FloatField(default=0.0)
    response_time_ms = models.PositiveIntegerField(default=0)
    success = models.BooleanField(default=False)
    is_fallback = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["feature", "created_at"]),
            models.Index(fields=["success", "is_fallback"]),
        ]

    def __str__(self):
        status = "OK" if self.success else "ERR"
        return f"[{status}] {self.feature} - {self.model_name} at {self.created_at}"


class GeneratedExerciseSet(models.Model):
    """A safe, validated exercise set generated for a learner."""

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="generated_exercises",
    )
    title_fa = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    target_skill = models.CharField(max_length=50, default="grammar")
    cefr_level = models.CharField(max_length=10, default="B1")
    objective_id = models.CharField(max_length=120, blank=True)
    questions = models.JSONField(
        default=list,
        help_text="Validated structured question items with prompt, options, answer key, and explanation",
    )
    is_fallback = models.BooleanField(
        default=False,
        help_text="True if generated from reviewed question bank fallback",
    )
    model_used = models.CharField(max_length=200, default="reviewed_bank_fallback")
    cost_usd = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["learner", "target_skill"]),
            models.Index(fields=["learner", "created_at"]),
        ]

    def __str__(self):
        return f"Exercise {self.id}: {self.title_en} ({self.cefr_level}) for {self.learner_id}"


class ExerciseAttempt(models.Model):
    """Submission and evaluation record of a learner's attempt on an exercise set."""

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercise_attempts",
    )
    exercise_set = models.ForeignKey(
        GeneratedExerciseSet,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    answers = models.JSONField(
        default=dict,
        help_text="Map of question_id -> selected_option_id",
    )
    score_percentage = models.FloatField(default=0.0)
    correct_count = models.PositiveIntegerField(default=0)
    total_count = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-completed_at"]

    def __str__(self):
        return f"Attempt {self.id}: {self.score_percentage}% by {self.learner_id}"
