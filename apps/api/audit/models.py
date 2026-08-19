from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models


class ImmutableAuditQuerySet(models.QuerySet):
    def update(self, **kwargs):
        # User/account deletion may legitimately SET_NULL the actor FK while
        # preserving the immutable event payload. No other field update is allowed.
        allowed_actor_null = (
            set(kwargs) in ({"actor"}, {"actor_id"})
            and next(iter(kwargs.values())) is None
        )
        if allowed_actor_null:
            return super().update(**kwargs)
        raise RuntimeError("Audit events are immutable and cannot be updated.")

    def delete(self):
        raise RuntimeError("Audit events are immutable and cannot be deleted.")


class AuditEvent(models.Model):
    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"
        M2M_CHANGE = "m2m_change", "Relationship change"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_events",
    )
    action = models.CharField(max_length=24, choices=Action.choices)
    target_app = models.CharField(max_length=100, db_index=True)
    target_model = models.CharField(max_length=100, db_index=True)
    target_pk = models.CharField(max_length=160, db_index=True)
    before_summary = models.JSONField(default=dict, blank=True)
    after_summary = models.JSONField(default=dict, blank=True)
    reason = models.CharField(max_length=500, blank=True)
    request_method = models.CharField(max_length=16, blank=True)
    request_path = models.CharField(max_length=500, blank=True)
    environment = models.CharField(max_length=32, default="development")
    occurred_at = models.DateTimeField(auto_now_add=True, db_index=True)

    objects = ImmutableAuditQuerySet.as_manager()

    class Meta:
        ordering = ("-occurred_at",)
        indexes = [
            models.Index(
                fields=("target_app", "target_model", "target_pk"),
                name="audit_audit_target_8f7ef6_idx",
            ),
            models.Index(
                fields=("actor", "occurred_at"),
                name="audit_audit_actor_i_7dd23e_idx",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self._state.adding:
            raise RuntimeError("Audit events are immutable and cannot be changed.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise RuntimeError("Audit events are immutable and cannot be deleted.")

    def __str__(self) -> str:
        return f"{self.action}: {self.target_app}.{self.target_model}#{self.target_pk}"
