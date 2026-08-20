# Generated for Endoora Day 13 on 2026-08-20.

import django.core.validators
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("taxonomy", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Question",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("slug", models.SlugField(help_text="Stable lowercase machine identifier. Do not rename after use.", max_length=160, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="created_questions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("slug",)},
        ),
        migrations.CreateModel(
            name="QuestionVersion",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("version_number", models.PositiveIntegerField()),
                ("question_type", models.CharField(choices=[("mcq", "Multiple choice"), ("multi_select", "Multi-select"), ("gap", "Gap fill"), ("matching", "Matching"), ("ordering", "Ordering"), ("short_answer", "Short answer"), ("long_writing", "Long writing"), ("audio", "Audio prompt"), ("speaking", "Speaking prompt")], max_length=24)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("in_review", "In review"), ("published", "Published"), ("retired", "Retired")], db_index=True, default="draft", max_length=16)),
                ("title_fa", models.CharField(blank=True, max_length=240)),
                ("title_en", models.CharField(blank=True, max_length=240)),
                ("prompt_fa", models.TextField(blank=True)),
                ("prompt_en", models.TextField()),
                ("instructions_fa", models.TextField(blank=True)),
                ("instructions_en", models.TextField(blank=True)),
                ("cefr_level", models.CharField(choices=[("A1", "A1"), ("A2", "A2"), ("B1", "B1"), ("B2", "B2"), ("C1", "C1"), ("C2", "C2")], db_index=True, max_length=2)),
                ("difficulty", models.PositiveSmallIntegerField(help_text="Difficulty is 1–5 and is deliberately separate from CEFR.", validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ("learner_payload", models.JSONField(blank=True, default=dict)),
                ("answer_key", models.JSONField(blank=True, default=dict)),
                ("accepted_variants", models.JSONField(blank=True, default=list)),
                ("explanation_fa", models.TextField(blank=True)),
                ("explanation_en", models.TextField(blank=True)),
                ("rubric", models.JSONField(blank=True, default=dict)),
                ("source_origin", models.CharField(blank=True, choices=[("", "Not set"), ("original", "Endoora original"), ("licensed", "Licensed third-party"), ("public_domain", "Public domain"), ("ai_assisted", "Human-reviewed AI-assisted original")], default="", max_length=24)),
                ("source_title", models.CharField(blank=True, max_length=255)),
                ("source_url", models.URLField(blank=True)),
                ("license_type", models.CharField(blank=True, choices=[("", "Not set"), ("original", "Endoora-owned original"), ("public_domain", "Public domain"), ("cc_by", "CC BY"), ("cc_by_sa", "CC BY-SA"), ("commercial", "Commercial licence"), ("other", "Other documented licence")], default="", max_length=24)),
                ("license_reference", models.CharField(blank=True, max_length=255)),
                ("rights_holder", models.CharField(blank=True, max_length=255)),
                ("reviewed_at", models.DateTimeField(blank=True, null=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("retired_at", models.DateTimeField(blank=True, null=True)),
                ("content_hash", models.CharField(blank=True, editable=False, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="authored_question_versions", to=settings.AUTH_USER_MODEL)),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="versions", to="questions.question")),
                ("reviewer", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="reviewed_question_versions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("question__slug", "-version_number")},
        ),
        migrations.AddField(
            model_name="question",
            name="current_published_version",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="+", to="questions.questionversion"),
        ),
        migrations.CreateModel(
            name="QuestionObjective",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_primary", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("objective", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="question_objective_links", to="taxonomy.taxonomynode")),
                ("version", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="objective_links", to="questions.questionversion")),
            ],
        ),
        migrations.AddField(
            model_name="questionversion",
            name="objectives",
            field=models.ManyToManyField(related_name="question_versions", through="questions.QuestionObjective", to="taxonomy.taxonomynode"),
        ),
        migrations.CreateModel(
            name="QuestionMedia",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("media_type", models.CharField(choices=[("image", "Image"), ("audio", "Audio"), ("video", "Video")], max_length=16)),
                ("asset_url", models.URLField(blank=True)),
                ("storage_key", models.CharField(blank=True, max_length=500)),
                ("mime_type", models.CharField(blank=True, max_length=120)),
                ("checksum_sha256", models.CharField(blank=True, max_length=64)),
                ("duration_seconds", models.PositiveIntegerField(blank=True, null=True)),
                ("alt_text_fa", models.CharField(blank=True, max_length=300)),
                ("alt_text_en", models.CharField(blank=True, max_length=300)),
                ("transcript_fa", models.TextField(blank=True)),
                ("transcript_en", models.TextField(blank=True)),
                ("source_title", models.CharField(blank=True, max_length=255)),
                ("license_type", models.CharField(blank=True, choices=[("", "Not set"), ("original", "Endoora-owned original"), ("public_domain", "Public domain"), ("cc_by", "CC BY"), ("cc_by_sa", "CC BY-SA"), ("commercial", "Commercial licence"), ("other", "Other documented licence")], default="", max_length=24)),
                ("license_reference", models.CharField(blank=True, max_length=255)),
                ("rights_holder", models.CharField(blank=True, max_length=255)),
                ("is_learner_visible", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("version", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="media", to="questions.questionversion")),
            ],
        ),
        migrations.CreateModel(
            name="QuestionReview",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("decision", models.CharField(choices=[("submitted", "Submitted for review"), ("approved", "Approved/published"), ("changes_requested", "Changes requested"), ("retired", "Retired")], max_length=32)),
                ("note", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("reviewer", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="question_review_events", to=settings.AUTH_USER_MODEL)),
                ("version", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="reviews", to="questions.questionversion")),
            ],
            options={"ordering": ("-created_at",)},
        ),
        migrations.AddConstraint(
            model_name="questionversion",
            constraint=models.UniqueConstraint(fields=("question", "version_number"), name="questions_unique_question_version"),
        ),
        migrations.AddIndex(
            model_name="questionversion",
            index=models.Index(fields=["status", "question_type"], name="questions_status_type_idx"),
        ),
        migrations.AddIndex(
            model_name="questionversion",
            index=models.Index(fields=["cefr_level", "status"], name="questions_cefr_status_idx"),
        ),
        migrations.AddConstraint(
            model_name="questionobjective",
            constraint=models.UniqueConstraint(fields=("version", "objective"), name="questions_unique_version_objective"),
        ),
        migrations.AddConstraint(
            model_name="questionobjective",
            constraint=models.UniqueConstraint(condition=models.Q(("is_primary", True)), fields=("version",), name="questions_one_primary_objective"),
        ),
    ]
