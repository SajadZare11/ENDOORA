# Generated for Endoora Day 12 taxonomy foundation.

import uuid

from django.db import migrations, models
import django.db.models.deletion
from django.db.models import Q


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="TaxonomyRelease",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("version", models.SlugField(max_length=80, unique=True)),
                ("checksum", models.CharField(db_index=True, max_length=64)),
                ("source_path", models.CharField(blank=True, max_length=255)),
                ("notes", models.TextField(blank=True)),
                ("imported_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "taxonomy release",
                "verbose_name_plural": "taxonomy releases",
                "ordering": ("-imported_at",),
            },
        ),
        migrations.CreateModel(
            name="TaxonomyNode",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "slug",
                    models.SlugField(
                        help_text=(
                            "Stable lowercase machine identifier. "
                            "Do not rename after creation."
                        ),
                        max_length=160,
                        unique=True,
                    ),
                ),
                (
                    "kind",
                    models.CharField(
                        choices=[
                            ("skill", "Skill"),
                            ("subskill", "Subskill"),
                            ("objective", "Objective"),
                            ("grammar_topic", "Grammar topic"),
                            ("vocabulary_topic", "Vocabulary topic"),
                            ("age_tag", "Age tag"),
                            ("exam_tag", "Exam tag"),
                        ],
                        db_index=True,
                        max_length=32,
                    ),
                ),
                ("label_fa", models.CharField(max_length=200)),
                ("label_en", models.CharField(max_length=200)),
                ("description_fa", models.TextField(blank=True)),
                ("description_en", models.TextField(blank=True)),
                (
                    "cefr_level",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("A1", "A1"),
                            ("A2", "A2"),
                            ("B1", "B1"),
                            ("B2", "B2"),
                            ("C1", "C1"),
                            ("C2", "C2"),
                        ],
                        db_index=True,
                        max_length=2,
                    ),
                ),
                ("descriptor_reference", models.CharField(blank=True, max_length=255)),
                ("source_name", models.CharField(blank=True, max_length=200)),
                ("source_url", models.URLField(blank=True)),
                ("license_note", models.CharField(blank=True, max_length=255)),
                (
                    "estimated_effort_minutes",
                    models.PositiveSmallIntegerField(blank=True, null=True),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("active", "Active"), ("deprecated", "Deprecated")],
                        db_index=True,
                        default="active",
                        max_length=16,
                    ),
                ),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "current_release",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="current_nodes",
                        to="taxonomy.taxonomyrelease",
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="children",
                        to="taxonomy.taxonomynode",
                    ),
                ),
                (
                    "replacement",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="replaces",
                        to="taxonomy.taxonomynode",
                    ),
                ),
            ],
            options={
                "verbose_name": "taxonomy node",
                "verbose_name_plural": "taxonomy nodes",
                "ordering": ("kind", "sort_order", "slug"),
            },
        ),
        migrations.CreateModel(
            name="TaxonomyNodeRevision",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("checksum", models.CharField(max_length=64)),
                ("snapshot", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "node",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="revisions",
                        to="taxonomy.taxonomynode",
                    ),
                ),
                (
                    "release",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="node_revisions",
                        to="taxonomy.taxonomyrelease",
                    ),
                ),
            ],
            options={
                "verbose_name": "taxonomy node revision",
                "verbose_name_plural": "taxonomy node revisions",
                "ordering": ("node__slug", "-created_at"),
            },
        ),
        migrations.CreateModel(
            name="TaxonomyPrerequisite",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "introduced_in",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="introduced_prerequisites",
                        to="taxonomy.taxonomyrelease",
                    ),
                ),
                (
                    "node",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="prerequisite_links",
                        to="taxonomy.taxonomynode",
                    ),
                ),
                (
                    "prerequisite",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="dependent_links",
                        to="taxonomy.taxonomynode",
                    ),
                ),
                (
                    "retired_in",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="retired_prerequisites",
                        to="taxonomy.taxonomyrelease",
                    ),
                ),
            ],
            options={
                "verbose_name": "taxonomy prerequisite",
                "verbose_name_plural": "taxonomy prerequisites",
            },
        ),
        migrations.AddField(
            model_name="taxonomynode",
            name="prerequisites",
            field=models.ManyToManyField(
                related_name="required_by",
                symmetrical=False,
                through="taxonomy.TaxonomyPrerequisite",
                through_fields=("node", "prerequisite"),
                to="taxonomy.taxonomynode",
            ),
        ),
        migrations.AddIndex(
            model_name="taxonomynode",
            index=models.Index(
                fields=["kind", "status"],
                name="taxonomy_kind_status_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="taxonomynode",
            index=models.Index(
                fields=["cefr_level", "status"],
                name="taxonomy_cefr_status_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="taxonomynode",
            index=models.Index(
                fields=["parent", "sort_order"],
                name="taxonomy_parent_sort_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="taxonomyprerequisite",
            index=models.Index(
                fields=["node", "retired_in"],
                name="taxonomy_prereq_active_idx",
            ),
        ),
        migrations.AddConstraint(
            model_name="taxonomynoderevision",
            constraint=models.UniqueConstraint(
                fields=("node", "release"),
                name="uniq_taxonomy_node_release_revision",
            ),
        ),
        migrations.AddConstraint(
            model_name="taxonomyprerequisite",
            constraint=models.UniqueConstraint(
                condition=Q(retired_in__isnull=True),
                fields=("node", "prerequisite"),
                name="uniq_active_taxonomy_prereq",
            ),
        ),
    ]
