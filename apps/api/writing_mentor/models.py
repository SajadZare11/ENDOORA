from django.conf import settings
from django.db import models


class WritingDraft(models.Model):
    """
    Stores learner essay drafts with version history, autosave tracking,
    and prompt context.
    """
    MODE_CHOICES = [
        ("general", "General English"),
        ("ielts_academic", "IELTS Academic Writing"),
        ("ielts_general", "IELTS General Writing"),
        ("free", "Free Writing"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("analyzed", "Analyzed"),
        ("revised", "Revised"),
    ]

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="writing_drafts",
    )
    prompt_id = models.CharField(max_length=64, blank=True, default="")
    prompt_title = models.CharField(max_length=255, blank=True, default="")
    prompt_text = models.TextField(blank=True, default="")
    target_cefr = models.CharField(max_length=8, default="B1")
    mode = models.CharField(max_length=32, choices=MODE_CHOICES, default="general")
    text = models.TextField(blank=True, default="")
    word_count = models.IntegerField(default=0)
    version = models.IntegerField(default=1)
    parent_draft = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="revisions",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    time_spent_seconds = models.IntegerField(default=0)
    is_shared_with_teacher = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Writing Draft"
        verbose_name_plural = "Writing Drafts"

    def __str__(self):
        return f"Draft #{self.id} v{self.version} ({self.learner.email}) - {self.prompt_title or 'Untitled'}"

    def update_word_count(self):
        words = self.text.strip().split() if self.text else []
        self.word_count = len(words)
        return self.word_count


class WritingAnalysis(models.Model):
    """
    Diagnostic formative feedback, IELTS estimated rubric ranges,
    categorized error annotations, graduated A2/B2/C2 rewrites,
    and actionable revision tasks.
    """
    draft = models.OneToOneField(
        WritingDraft,
        on_delete=models.CASCADE,
        related_name="analysis",
    )
    strengths_summary_fa = models.TextField(blank=True, default="")
    strengths_summary_en = models.TextField(blank=True, default="")
    top_priorities_fa = models.JSONField(default=list)
    top_priorities_en = models.JSONField(default=list)
    estimated_cefr_range = models.CharField(max_length=32, default="B1 – B2")
    ielts_scores = models.JSONField(default=dict)
    error_annotations = models.JSONField(default=list)
    graduated_rewrites = models.JSONField(default=dict)
    revision_tasks = models.JSONField(default=list)
    disclaimer_fa = models.TextField(
        default="اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): نمره و سطح تخمینی برای هدایت فرآیند بازنویسی بوده و مدرک رسمی آزمون آیلتس محسوب نمی‌شود."
    )
    disclaimer_en = models.TextField(
        default="Product Constitution Rule #8 Disclosure: Estimated band ranges and CEFR levels are formative coaching indicators and do not constitute an official IELTS or CEFR certificate."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Writing Analysis"
        verbose_name_plural = "Writing Analyses"

    def __str__(self):
        return f"Analysis for Draft #{self.draft_id} ({self.estimated_cefr_range})"
