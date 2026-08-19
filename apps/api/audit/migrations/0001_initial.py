import uuid

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="AuditEvent",
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
                    "action",
                    models.CharField(
                        choices=[
                            ("create", "Create"),
                            ("update", "Update"),
                            ("delete", "Delete"),
                            ("m2m_change", "Relationship change"),
                        ],
                        max_length=24,
                    ),
                ),
                ("target_app", models.CharField(db_index=True, max_length=100)),
                ("target_model", models.CharField(db_index=True, max_length=100)),
                ("target_pk", models.CharField(db_index=True, max_length=160)),
                ("before_summary", models.JSONField(blank=True, default=dict)),
                ("after_summary", models.JSONField(blank=True, default=dict)),
                ("reason", models.CharField(blank=True, max_length=500)),
                ("request_method", models.CharField(blank=True, max_length=16)),
                ("request_path", models.CharField(blank=True, max_length=500)),
                (
                    "environment",
                    models.CharField(default="development", max_length=32),
                ),
                ("occurred_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                (
                    "actor",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_events",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ("-occurred_at",)},
        ),
        migrations.AddIndex(
            model_name="auditevent",
            index=models.Index(
                fields=["target_app", "target_model", "target_pk"],
                name="audit_audit_target_8f7ef6_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="auditevent",
            index=models.Index(
                fields=["actor", "occurred_at"],
                name="audit_audit_actor_i_7dd23e_idx",
            ),
        ),
    ]
