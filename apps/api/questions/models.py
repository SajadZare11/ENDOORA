from __future__ import annotations

import hashlib
import json
import uuid
from typing import Any

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.db.models import Q
from django.utils import timezone

from taxonomy.models import TaxonomyNode


PROTECTED_LEARNER_KEYS = {
    "answer_key",
    "accepted_variants",
    "correct_answer",
    "correct_answers",
    "correct_option",
    "correct_options",
    "is_correct",
    "rubric",
    "pairs",
    "order",
    "solution",
    "solutions",
    "explanation",
    "explanation_fa",
    "explanation_en",
}


def _find_protected_key(value: Any, path: str = "learner_payload") -> str | None:
    if isinstance(value, dict):
        for key, nested in value.items():
            if str(key).strip().lower() in PROTECTED_LEARNER_KEYS:
                return f"{path}.{key}"
            found = _find_protected_key(nested, f"{path}.{key}")
            if found:
                return found
    elif isinstance(value, list):
        for index, nested in enumerate(value):
            found = _find_protected_key(nested, f"{path}[{index}]")
            if found:
                return found
    return None


class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(
        max_length=160,
        unique=True,
        help_text="Stable lowercase machine identifier. Do not rename after use.",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_questions",
        null=True,
        blank=True,
    )
    current_published_version = models.ForeignKey(
        "QuestionVersion",
        on_delete=models.PROTECT,
        related_name="+",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("slug",)

    def __str__(self) -> str:
        return self.slug

    def clean(self):
        if self.slug != self.slug.lower():
            raise ValidationError({"slug": "Question slug must be lowercase."})

    def delete(self, *args, **kwargs):
        if self.versions.exists():
            raise ValidationError(
                "A question with versions cannot be deleted. Retire published versions instead."
            )
        return super().delete(*args, **kwargs)


class QuestionVersion(models.Model):
    class QuestionType(models.TextChoices):
        MCQ = "mcq", "Multiple choice"
        MULTI_SELECT = "multi_select", "Multi-select"
        GAP = "gap", "Gap fill"
        MATCHING = "matching", "Matching"
        ORDERING = "ordering", "Ordering"
        SHORT_ANSWER = "short_answer", "Short answer"
        LONG_WRITING = "long_writing", "Long writing"
        AUDIO = "audio", "Audio prompt"
        SPEAKING = "speaking", "Speaking prompt"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        IN_REVIEW = "in_review", "In review"
        PUBLISHED = "published", "Published"
        RETIRED = "retired", "Retired"

    class CefrLevel(models.TextChoices):
        A1 = "A1", "A1"
        A2 = "A2", "A2"
        B1 = "B1", "B1"
        B2 = "B2", "B2"
        C1 = "C1", "C1"
        C2 = "C2", "C2"

    class SourceOrigin(models.TextChoices):
        UNSPECIFIED = "", "Not set"
        ORIGINAL = "original", "Endoora original"
        LICENSED = "licensed", "Licensed third-party"
        PUBLIC_DOMAIN = "public_domain", "Public domain"
        AI_ASSISTED = "ai_assisted", "Human-reviewed AI-assisted original"

    class LicenseType(models.TextChoices):
        UNSPECIFIED = "", "Not set"
        ORIGINAL = "original", "Endoora-owned original"
        PUBLIC_DOMAIN = "public_domain", "Public domain"
        CC_BY = "cc_by", "CC BY"
        CC_BY_SA = "cc_by_sa", "CC BY-SA"
        COMMERCIAL = "commercial", "Commercial licence"
        OTHER = "other", "Other documented licence"

    AUTO_SCORED_TYPES = {
        QuestionType.MCQ,
        QuestionType.MULTI_SELECT,
        QuestionType.GAP,
        QuestionType.MATCHING,
        QuestionType.ORDERING,
        QuestionType.SHORT_ANSWER,
        QuestionType.AUDIO,
    }
    RUBRIC_TYPES = {QuestionType.LONG_WRITING, QuestionType.SPEAKING}

    IMMUTABLE_CONTENT_FIELDS = (
        "question_id",
        "version_number",
        "question_type",
        "title_fa",
        "title_en",
        "prompt_fa",
        "prompt_en",
        "instructions_fa",
        "instructions_en",
        "cefr_level",
        "difficulty",
        "learner_payload",
        "answer_key",
        "accepted_variants",
        "explanation_fa",
        "explanation_en",
        "rubric",
        "source_origin",
        "source_title",
        "source_url",
        "license_type",
        "license_reference",
        "rights_holder",
        "author_id",
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(
        Question, on_delete=models.PROTECT, related_name="versions"
    )
    version_number = models.PositiveIntegerField()
    question_type = models.CharField(max_length=24, choices=QuestionType.choices)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.DRAFT, db_index=True
    )
    title_fa = models.CharField(max_length=240, blank=True)
    title_en = models.CharField(max_length=240, blank=True)
    prompt_fa = models.TextField(blank=True)
    prompt_en = models.TextField()
    instructions_fa = models.TextField(blank=True)
    instructions_en = models.TextField(blank=True)
    cefr_level = models.CharField(max_length=2, choices=CefrLevel.choices, db_index=True)
    difficulty = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Difficulty is 1–5 and is deliberately separate from CEFR.",
    )
    learner_payload = models.JSONField(default=dict, blank=True)
    answer_key = models.JSONField(default=dict, blank=True)
    accepted_variants = models.JSONField(default=list, blank=True)
    explanation_fa = models.TextField(blank=True)
    explanation_en = models.TextField(blank=True)
    rubric = models.JSONField(default=dict, blank=True)
    source_origin = models.CharField(
        max_length=24, choices=SourceOrigin.choices, default="", blank=True
    )
    source_title = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(blank=True)
    license_type = models.CharField(
        max_length=24, choices=LicenseType.choices, default="", blank=True
    )
    license_reference = models.CharField(max_length=255, blank=True)
    rights_holder = models.CharField(max_length=255, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="authored_question_versions",
        null=True,
        blank=True,
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="reviewed_question_versions",
        null=True,
        blank=True,
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    retired_at = models.DateTimeField(null=True, blank=True)
    content_hash = models.CharField(max_length=64, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objectives = models.ManyToManyField(
        TaxonomyNode, through="QuestionObjective", related_name="question_versions"
    )

    class Meta:
        ordering = ("question__slug", "-version_number")
        constraints = [
            models.UniqueConstraint(
                fields=("question", "version_number"),
                name="questions_unique_question_version",
            )
        ]
        indexes = [
            models.Index(fields=("status", "question_type"), name="questions_status_type_idx"),
            models.Index(fields=("cefr_level", "status"), name="questions_cefr_status_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.question.slug} v{self.version_number} ({self.status})"

    def compute_content_hash(self) -> str:
        payload = {field: getattr(self, field) for field in self.IMMUTABLE_CONTENT_FIELDS}
        raw = json.dumps(
            payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=str
        ).encode("utf-8")
        return hashlib.sha256(raw).hexdigest()

    def clean(self):
        errors: dict[str, str] = {}
        protected = _find_protected_key(self.learner_payload)
        if protected:
            errors["learner_payload"] = (
                f"Learner-visible payload contains protected answer data at {protected}."
            )
        if self.question_type in self.RUBRIC_TYPES and self.answer_key:
            errors["answer_key"] = (
                "Writing/speaking uses a rubric/manual review, not an exact answer key."
            )
        if errors:
            raise ValidationError(errors)

    def validate_for_publication(self):
        errors: dict[str, str] = {}
        if not self.pk:
            errors["status"] = "Save the draft before publishing."
        if not self.author_id:
            errors["author"] = "An author is required before publication."
        if not self.reviewer_id:
            errors["reviewer"] = "A reviewer is required before publication."
        if not self.source_origin:
            errors["source_origin"] = "Source origin is required before publication."
        if not self.source_title.strip():
            errors["source_title"] = "Source title is required before publication."
        if not self.license_type:
            errors["license_type"] = "Documented licence metadata is required."
        if (
            self.source_origin in {self.SourceOrigin.ORIGINAL, self.SourceOrigin.AI_ASSISTED}
            and self.license_type
            and self.license_type != self.LicenseType.ORIGINAL
        ):
            errors["license_type"] = (
                "Endoora original/AI-assisted original content must use the original-rights licence type."
            )
        if (
            self.source_origin == self.SourceOrigin.PUBLIC_DOMAIN
            and self.license_type
            and self.license_type != self.LicenseType.PUBLIC_DOMAIN
        ):
            errors["license_type"] = "Public-domain origin must use the public-domain licence type."
        if (
            self.source_origin == self.SourceOrigin.LICENSED
            and self.license_type == self.LicenseType.ORIGINAL
        ):
            errors["license_type"] = "Licensed third-party content cannot be marked Endoora-owned original."
        if self.license_type in {self.LicenseType.COMMERCIAL, self.LicenseType.OTHER}:
            if not self.license_reference.strip():
                errors["license_reference"] = "This licence requires a licence reference."
        if (
            self.source_origin == self.SourceOrigin.LICENSED
            and not self.source_url.strip()
            and not self.license_reference.strip()
        ):
            errors["license_reference"] = (
                "Licensed third-party content requires a source URL or licence reference."
            )
        if not self.cefr_level:
            errors["cefr_level"] = "CEFR level is required."
        if self.question_type in self.AUTO_SCORED_TYPES and not self.answer_key:
            errors["answer_key"] = "An answer key is required for this question type."

        if self.question_type in {
            self.QuestionType.MCQ,
            self.QuestionType.MULTI_SELECT,
        }:
            options = self.learner_payload.get("options", [])
            if not isinstance(options, list) or len(options) < 2:
                errors["learner_payload"] = "Choice questions require at least two options."
            else:
                option_ids = [
                    str(item.get("id", "")).strip()
                    for item in options
                    if isinstance(item, dict)
                ]
                if len(option_ids) != len(options) or any(not value for value in option_ids):
                    errors["learner_payload"] = "Every choice option requires a non-empty id."
                elif len(set(option_ids)) != len(option_ids):
                    errors["learner_payload"] = "Choice option ids must be unique."
                elif self.question_type == self.QuestionType.MCQ:
                    if str(self.answer_key.get("correct_option", "")).strip() not in set(option_ids):
                        errors["answer_key"] = "MCQ correct_option must match one learner option id."
                else:
                    correct_options = self.answer_key.get("correct_options", [])
                    if (
                        not isinstance(correct_options, list)
                        or not correct_options
                        or not set(map(str, correct_options)).issubset(set(option_ids))
                    ):
                        errors["answer_key"] = (
                            "Multi-select correct_options must be a non-empty subset of option ids."
                        )

        if self.question_type in {
            self.QuestionType.GAP,
            self.QuestionType.SHORT_ANSWER,
            self.QuestionType.AUDIO,
        }:
            accepted = self.answer_key.get("accepted", [])
            combined = list(accepted) if isinstance(accepted, list) else []
            combined.extend(self.accepted_variants or [])
            if not any(str(item).strip() for item in combined):
                errors["answer_key"] = (
                    "This question type requires at least one explicit accepted answer."
                )

        if self.question_type == self.QuestionType.MATCHING:
            pairs = self.answer_key.get("pairs", {})
            if not isinstance(pairs, dict) or not pairs:
                errors["answer_key"] = "Matching questions require a non-empty pairs object."

        if self.question_type == self.QuestionType.ORDERING:
            order = self.answer_key.get("order", [])
            if not isinstance(order, list) or len(order) < 2:
                errors["answer_key"] = "Ordering questions require an ordered list of at least two items."

        if self.question_type in self.RUBRIC_TYPES and not self.rubric:
            errors["rubric"] = "A rubric is required for writing/speaking."
        if self.pk:
            links = list(self.objective_links.select_related("objective").all())
            if not links:
                errors["objectives"] = "At least one taxonomy objective is required."
            elif any(link.objective.kind != TaxonomyNode.Kind.OBJECTIVE for link in links):
                errors["objectives"] = "Every linked taxonomy node must be an objective."
            elif any(link.objective.status != TaxonomyNode.Status.ACTIVE for link in links):
                errors["objectives"] = (
                    "New publication cannot target a deprecated taxonomy objective."
                )
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if self._state.adding and self.status != self.Status.DRAFT:
            raise ValidationError("New question versions must start as draft.")

        if self.pk and QuestionVersion.objects.filter(pk=self.pk).exists():
            original = QuestionVersion.objects.get(pk=self.pk)
            workflow_transition = getattr(self, "_allow_workflow_transition", False)
            if (
                original.status in {self.Status.DRAFT, self.Status.IN_REVIEW}
                and self.status in {self.Status.PUBLISHED, self.Status.RETIRED}
                and not workflow_transition
            ):
                raise ValidationError(
                    "Use the controlled publish/retire workflow for protected status transitions."
                )
            if original.status in {self.Status.PUBLISHED, self.Status.RETIRED}:
                for field in self.IMMUTABLE_CONTENT_FIELDS:
                    if getattr(original, field) != getattr(self, field):
                        raise ValidationError(
                            f"Published/retired question versions are immutable: {field} changed."
                        )
                if original.status == self.Status.RETIRED and self.status != self.Status.RETIRED:
                    raise ValidationError("A retired question version cannot be reactivated.")
                if original.status == self.Status.PUBLISHED and self.status not in {
                    self.Status.PUBLISHED, self.Status.RETIRED
                }:
                    raise ValidationError(
                        "A published version may only remain published or be retired."
                    )
                if (
                    original.status == self.Status.PUBLISHED
                    and self.status == self.Status.RETIRED
                    and not workflow_transition
                ):
                    raise ValidationError(
                        "Use the controlled retire workflow so the review trail stays complete."
                    )
        if self.status in {self.Status.PUBLISHED, self.Status.RETIRED}:
            self.content_hash = self.compute_content_hash()
        return super().save(*args, **kwargs)

    @transaction.atomic
    def publish(self, reviewer):
        if self.status not in {self.Status.DRAFT, self.Status.IN_REVIEW}:
            raise ValidationError("Only draft/in-review versions can be published.")
        if not reviewer or not reviewer.is_authenticated:
            raise ValidationError({"reviewer": "Authenticated reviewer required."})
        self.reviewer = reviewer
        self.reviewed_at = timezone.now()
        self.full_clean()
        self.validate_for_publication()
        previous = self.question.current_published_version
        if (
            previous
            and previous.pk != self.pk
            and previous.status == self.Status.PUBLISHED
        ):
            previous.retire(
                reviewer,
                note=f"Superseded by {self.question.slug} v{self.version_number}.",
            )

        self.status = self.Status.PUBLISHED
        self.published_at = timezone.now()
        self.content_hash = self.compute_content_hash()
        self._allow_workflow_transition = True
        try:
            self.save()
        finally:
            self._allow_workflow_transition = False
        QuestionReview.objects.create(
            version=self,
            reviewer=reviewer,
            decision=QuestionReview.Decision.APPROVED,
            note="Published through controlled review workflow.",
        )
        self.question.current_published_version = self
        self.question.save(update_fields=["current_published_version", "updated_at"])
        return self

    @transaction.atomic
    def retire(self, reviewer, note: str = ""):
        if self.status != self.Status.PUBLISHED:
            raise ValidationError("Only published versions can be retired.")
        self.status = self.Status.RETIRED
        self.retired_at = timezone.now()
        self._allow_workflow_transition = True
        try:
            self.save()
        finally:
            self._allow_workflow_transition = False
        QuestionReview.objects.create(
            version=self,
            reviewer=reviewer,
            decision=QuestionReview.Decision.RETIRED,
            note=note or "Retired without deleting historical version.",
        )
        if self.question.current_published_version_id == self.id:
            self.question.current_published_version = None
            self.question.save(update_fields=["current_published_version", "updated_at"])
        return self

    def delete(self, *args, **kwargs):
        if self.status in {self.Status.PUBLISHED, self.Status.RETIRED}:
            raise ValidationError(
                "Published/retired versions are historical records and cannot be deleted."
            )
        return super().delete(*args, **kwargs)


class QuestionObjective(models.Model):
    version = models.ForeignKey(
        QuestionVersion, on_delete=models.CASCADE, related_name="objective_links"
    )
    objective = models.ForeignKey(
        TaxonomyNode, on_delete=models.PROTECT, related_name="question_objective_links"
    )
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("version", "objective"),
                name="questions_unique_version_objective",
            ),
            models.UniqueConstraint(
                fields=("version",),
                condition=Q(is_primary=True),
                name="questions_one_primary_objective",
            ),
        ]

    def clean(self):
        if self.objective_id and self.objective.kind != TaxonomyNode.Kind.OBJECTIVE:
            raise ValidationError(
                {"objective": "Question links must target taxonomy objective nodes."}
            )

    def save(self, *args, **kwargs):
        if self.version_id and self.version.status in {
            QuestionVersion.Status.PUBLISHED, QuestionVersion.Status.RETIRED
        }:
            if self._state.adding:
                raise ValidationError("Cannot add objectives to published/retired versions.")
            original = QuestionObjective.objects.get(pk=self.pk)
            if (
                original.objective_id != self.objective_id
                or original.is_primary != self.is_primary
                or original.version_id != self.version_id
            ):
                raise ValidationError("Published/retired objective links are immutable.")
        self.full_clean()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.version.status in {
            QuestionVersion.Status.PUBLISHED, QuestionVersion.Status.RETIRED
        }:
            raise ValidationError("Cannot remove objectives from published/retired versions.")
        return super().delete(*args, **kwargs)


class QuestionMedia(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        AUDIO = "audio", "Audio"
        VIDEO = "video", "Video"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    version = models.ForeignKey(
        QuestionVersion, on_delete=models.CASCADE, related_name="media"
    )
    media_type = models.CharField(max_length=16, choices=MediaType.choices)
    asset_url = models.URLField(blank=True)
    storage_key = models.CharField(max_length=500, blank=True)
    mime_type = models.CharField(max_length=120, blank=True)
    checksum_sha256 = models.CharField(max_length=64, blank=True)
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    alt_text_fa = models.CharField(max_length=300, blank=True)
    alt_text_en = models.CharField(max_length=300, blank=True)
    transcript_fa = models.TextField(blank=True)
    transcript_en = models.TextField(blank=True)
    source_title = models.CharField(max_length=255, blank=True)
    license_type = models.CharField(
        max_length=24, choices=QuestionVersion.LicenseType.choices, default="", blank=True
    )
    license_reference = models.CharField(max_length=255, blank=True)
    rights_holder = models.CharField(max_length=255, blank=True)
    is_learner_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.asset_url and not self.storage_key:
            raise ValidationError("Media requires asset_url or storage_key.")

    def save(self, *args, **kwargs):
        if self.version_id and self.version.status in {
            QuestionVersion.Status.PUBLISHED, QuestionVersion.Status.RETIRED
        }:
            if self._state.adding:
                raise ValidationError("Cannot add media to published/retired versions.")
            original = QuestionMedia.objects.get(pk=self.pk)
            immutable = [
                "version_id", "media_type", "asset_url", "storage_key", "mime_type",
                "checksum_sha256", "duration_seconds", "alt_text_fa", "alt_text_en",
                "transcript_fa", "transcript_en", "source_title", "license_type",
                "license_reference", "rights_holder", "is_learner_visible",
            ]
            if any(getattr(original, f) != getattr(self, f) for f in immutable):
                raise ValidationError("Published/retired question media is immutable.")
        self.full_clean()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.version.status in {
            QuestionVersion.Status.PUBLISHED, QuestionVersion.Status.RETIRED
        }:
            raise ValidationError("Cannot remove media from published/retired versions.")
        return super().delete(*args, **kwargs)


class QuestionReview(models.Model):
    class Decision(models.TextChoices):
        SUBMITTED = "submitted", "Submitted for review"
        APPROVED = "approved", "Approved/published"
        CHANGES_REQUESTED = "changes_requested", "Changes requested"
        RETIRED = "retired", "Retired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    version = models.ForeignKey(
        QuestionVersion, on_delete=models.PROTECT, related_name="reviews"
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="question_review_events",
        null=True,
        blank=True,
    )
    decision = models.CharField(max_length=32, choices=Decision.choices)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        if self.pk and QuestionReview.objects.filter(pk=self.pk).exists():
            raise ValidationError("Question review events are append-only and cannot be edited.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Question review events are append-only and cannot be deleted.")
