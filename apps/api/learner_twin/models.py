from django.db import models
from django.conf import settings


class LearnerTwin(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_twin",
    )
    summary = models.JSONField(default=dict)
    evidence_count = models.PositiveIntegerField(default=0)
    last_updated_at = models.DateTimeField(auto_now=True)
    consent_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"Twin<{self.user_id}>"


class LearnerTwinSnapshot(models.Model):
    twin = models.ForeignKey(
        LearnerTwin,
        on_delete=models.CASCADE,
        related_name="snapshots",
    )
    snapshot = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, default="evidence_update")
