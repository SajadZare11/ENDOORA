from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q


class TaxonomyRelease(models.Model):
    """Immutable record of one imported taxonomy dataset revision."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    version = models.SlugField(max_length=80, unique=True)
    checksum = models.CharField(max_length=64, db_index=True)
    source_path = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    imported_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-imported_at",)
        verbose_name = "taxonomy release"
        verbose_name_plural = "taxonomy releases"

    def __str__(self) -> str:
        return self.version

    def save(self, *args, **kwargs):
        if self.pk and TaxonomyRelease.objects.filter(pk=self.pk).exists():
            original = TaxonomyRelease.objects.only("version", "checksum").get(pk=self.pk)
            if original.version != self.version or original.checksum != self.checksum:
                raise ValidationError("Taxonomy release version/checksum are immutable.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Taxonomy releases are historical records and cannot be deleted.")


class TaxonomyNode(models.Model):
    class Kind(models.TextChoices):
        SKILL = "skill", "Skill"
        SUBSKILL = "subskill", "Subskill"
        OBJECTIVE = "objective", "Objective"
        GRAMMAR_TOPIC = "grammar_topic", "Grammar topic"
        VOCABULARY_TOPIC = "vocabulary_topic", "Vocabulary topic"
        AGE_TAG = "age_tag", "Age tag"
        EXAM_TAG = "exam_tag", "Exam tag"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DEPRECATED = "deprecated", "Deprecated"

    class CefrLevel(models.TextChoices):
        A1 = "A1", "A1"
        A2 = "A2", "A2"
        B1 = "B1", "B1"
        B2 = "B2", "B2"
        C1 = "C1", "C1"
        C2 = "C2", "C2"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(
        max_length=160,
        unique=True,
        help_text="Stable lowercase machine identifier. Do not rename after creation.",
    )
    kind = models.CharField(max_length=32, choices=Kind.choices, db_index=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        related_name="children",
        null=True,
        blank=True,
    )
    label_fa = models.CharField(max_length=200)
    label_en = models.CharField(max_length=200)
    description_fa = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    cefr_level = models.CharField(
        max_length=2,
        choices=CefrLevel.choices,
        blank=True,
        db_index=True,
    )
    descriptor_reference = models.CharField(max_length=255, blank=True)
    source_name = models.CharField(max_length=200, blank=True)
    source_url = models.URLField(blank=True)
    license_note = models.CharField(max_length=255, blank=True)
    estimated_effort_minutes = models.PositiveSmallIntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    replacement = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        related_name="replaces",
        null=True,
        blank=True,
    )
    current_release = models.ForeignKey(
        TaxonomyRelease,
        on_delete=models.PROTECT,
        related_name="current_nodes",
    )
    metadata = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    prerequisites = models.ManyToManyField(
        "self",
        through="TaxonomyPrerequisite",
        through_fields=("node", "prerequisite"),
        symmetrical=False,
        related_name="required_by",
    )

    class Meta:
        ordering = ("kind", "sort_order", "slug")
        indexes = [
            models.Index(fields=("kind", "status"), name="taxonomy_kind_status_idx"),
            models.Index(fields=("cefr_level", "status"), name="taxonomy_cefr_status_idx"),
            models.Index(fields=("parent", "sort_order"), name="taxonomy_parent_sort_idx"),
        ]
        verbose_name = "taxonomy node"
        verbose_name_plural = "taxonomy nodes"

    def __str__(self) -> str:
        return f"{self.label_fa} / {self.label_en} ({self.slug})"

    def clean(self):
        errors: dict[str, list[str] | str] = {}

        if self.slug != self.slug.lower():
            errors["slug"] = "Slug must be lowercase."
        if self.pk and self.parent_id == self.pk:
            errors["parent"] = "A taxonomy node cannot be its own parent."
        if self.pk and self.replacement_id == self.pk:
            errors["replacement"] = "A taxonomy node cannot replace itself."
        if self.kind in {self.Kind.SUBSKILL, self.Kind.OBJECTIVE} and self.parent_id is None:
            errors["parent"] = "Subskills and objectives require a parent node."
        if self.cefr_level and self.kind not in {
            self.Kind.OBJECTIVE,
            self.Kind.GRAMMAR_TOPIC,
            self.Kind.VOCABULARY_TOPIC,
        }:
            errors["cefr_level"] = (
                "CEFR level belongs on objectives/topics, not on a top-level skill or tag."
            )

        if errors:
            raise ValidationError(errors)

    def delete(self, *args, **kwargs):
        raise ValidationError(
            "Taxonomy nodes are stable identifiers. Deprecate a node instead of deleting it."
        )


class TaxonomyNodeRevision(models.Model):
    """Snapshot created by the controlled import command when a node changes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    node = models.ForeignKey(
        TaxonomyNode,
        on_delete=models.PROTECT,
        related_name="revisions",
    )
    release = models.ForeignKey(
        TaxonomyRelease,
        on_delete=models.PROTECT,
        related_name="node_revisions",
    )
    checksum = models.CharField(max_length=64)
    snapshot = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("node__slug", "-created_at")
        constraints = [
            models.UniqueConstraint(
                fields=("node", "release"),
                name="uniq_taxonomy_node_release_revision",
            )
        ]
        verbose_name = "taxonomy node revision"
        verbose_name_plural = "taxonomy node revisions"

    def __str__(self) -> str:
        return f"{self.node.slug} @ {self.release.version}"

    def save(self, *args, **kwargs):
        if self.pk and TaxonomyNodeRevision.objects.filter(pk=self.pk).exists():
            raise ValidationError("Taxonomy revisions are immutable historical records.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Taxonomy revisions are historical records and cannot be deleted.")


class TaxonomyPrerequisite(models.Model):
    node = models.ForeignKey(
        TaxonomyNode,
        on_delete=models.PROTECT,
        related_name="prerequisite_links",
    )
    prerequisite = models.ForeignKey(
        TaxonomyNode,
        on_delete=models.PROTECT,
        related_name="dependent_links",
    )
    introduced_in = models.ForeignKey(
        TaxonomyRelease,
        on_delete=models.PROTECT,
        related_name="introduced_prerequisites",
    )
    retired_in = models.ForeignKey(
        TaxonomyRelease,
        on_delete=models.PROTECT,
        related_name="retired_prerequisites",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=("node", "retired_in"), name="taxonomy_prereq_active_idx"),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=("node", "prerequisite"),
                condition=Q(retired_in__isnull=True),
                name="uniq_active_taxonomy_prereq",
            ),
        ]
        verbose_name = "taxonomy prerequisite"
        verbose_name_plural = "taxonomy prerequisites"

    def __str__(self) -> str:
        state = "active" if self.retired_in_id is None else "retired"
        return f"{self.node.slug} <- {self.prerequisite.slug} ({state})"

    def clean(self):
        if self.node_id and self.node_id == self.prerequisite_id:
            raise ValidationError("A node cannot require itself.")
        if not self.node_id or not self.prerequisite_id:
            return

        # A prerequisite points from a node to an earlier requirement. Walk
        # existing active links from the proposed prerequisite; reaching the
        # proposed node would create a cycle.
        pending = [self.prerequisite_id]
        visited: set[object] = set()
        while pending:
            current = pending.pop()
            if current == self.node_id:
                raise ValidationError(
                    "Prerequisite relationships must form an acyclic graph."
                )
            if current in visited:
                continue
            visited.add(current)
            pending.extend(
                TaxonomyPrerequisite.objects.filter(
                    node_id=current,
                    retired_in__isnull=True,
                ).values_list("prerequisite_id", flat=True)
            )
