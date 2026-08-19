from __future__ import annotations

from django.db.models.signals import m2m_changed, post_delete, post_save, pre_delete, pre_save
from django.dispatch import receiver

from .context import get_audit_context
from .models import AuditEvent
from .redaction import safe_model_snapshot


_EXCLUDED_LABELS = {
    "admin.logentry",
    "audit.auditevent",
    "contenttypes.contenttype",
    "sessions.session",
}


def _should_audit(instance) -> bool:
    context = get_audit_context()
    if not context.enabled or context.actor is None:
        return False
    return instance._meta.label_lower not in _EXCLUDED_LABELS


def _reason_for(instance) -> str:
    context = get_audit_context()
    if context.reason:
        return context.reason

    rationale = getattr(instance, "rationale", "")
    if isinstance(rationale, str) and rationale.strip():
        return rationale.strip()[:500]

    return "privileged_change"


def _create_event(*, instance, action: str, before: dict, after: dict) -> None:
    context = get_audit_context()
    AuditEvent.objects.create(
        actor=context.actor,
        action=action,
        target_app=instance._meta.app_label,
        target_model=instance._meta.model_name,
        target_pk=str(instance.pk),
        before_summary=before,
        after_summary=after,
        reason=_reason_for(instance),
        request_method=context.request_method,
        request_path=context.request_path,
        environment=context.environment,
    )


@receiver(pre_save, dispatch_uid="endoora_audit_pre_save")
def capture_before_save(sender, instance, **kwargs):
    if not _should_audit(instance):
        return

    before = {}
    if getattr(instance, "pk", None):
        try:
            previous = sender._default_manager.filter(pk=instance.pk).first()
        except (AttributeError, TypeError, ValueError):
            previous = None
        before = safe_model_snapshot(previous)

    instance._endoora_audit_before = before


@receiver(post_save, dispatch_uid="endoora_audit_post_save")
def record_after_save(sender, instance, created, **kwargs):
    if not _should_audit(instance):
        return

    _create_event(
        instance=instance,
        action=AuditEvent.Action.CREATE if created else AuditEvent.Action.UPDATE,
        before=getattr(instance, "_endoora_audit_before", {}),
        after=safe_model_snapshot(instance),
    )


@receiver(pre_delete, dispatch_uid="endoora_audit_pre_delete")
def capture_before_delete(sender, instance, **kwargs):
    if not _should_audit(instance):
        return
    instance._endoora_audit_before = safe_model_snapshot(instance)


@receiver(post_delete, dispatch_uid="endoora_audit_post_delete")
def record_after_delete(sender, instance, **kwargs):
    if not _should_audit(instance):
        return

    _create_event(
        instance=instance,
        action=AuditEvent.Action.DELETE,
        before=getattr(instance, "_endoora_audit_before", safe_model_snapshot(instance)),
        after={},
    )


@receiver(m2m_changed, dispatch_uid="endoora_audit_m2m")
def record_m2m_change(sender, instance, action, reverse, model, pk_set, **kwargs):
    if action not in {"post_add", "post_remove", "post_clear"}:
        return
    if not _should_audit(instance):
        return

    related_ids = sorted(str(pk) for pk in (pk_set or set()))
    _create_event(
        instance=instance,
        action=AuditEvent.Action.M2M_CHANGE,
        before={},
        after={
            "relation_table": sender._meta.db_table,
            "operation": action,
            "related_model": model._meta.label_lower,
            "related_ids": related_ids,
        },
    )
