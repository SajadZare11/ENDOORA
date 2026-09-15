from __future__ import annotations
from django.db import transaction
from django.utils import timezone
from accounts.models import User, OneTimeCode
from audit.models import AuditEvent
from accounts.models import AccountDeletionRequest

@transaction.atomic
def execute_account_erasure(user: User, reason: str = "", operator: User | None = None) -> dict:
    original_id = str(user.id)
    
    # Scramble User PII
    user.email = f"deleted_{user.id.hex[:12]}@deleted.endoora.ir"
    user.phone = None
    user.phone_verified_at = None
    user.first_name = ""
    user.last_name = ""
    user.set_unusable_password()
    user.is_active = False
    user.deactivated_at = timezone.now()
    user.save()
    
    # Anonymize / clear profiles
    if hasattr(user, 'learner_profile') and user.learner_profile:
        user.learner_profile.goal = "other"  # or None if nullable
        user.learner_profile.preferred_days = []
        user.learner_profile.notes = ""
        user.learner_profile.save()
        
    if hasattr(user, 'teacher_profile') and user.teacher_profile:
        user.teacher_profile.bio = ""
        user.teacher_profile.video_links = {}
        user.teacher_profile.certificates = []
        user.teacher_profile.save()
        
    # Purge personal audio records
    # If voice_lab has VoiceRecording
    if hasattr(user, 'voice_recordings'):
        user.voice_recordings.all().update(status="purged", audio_file=None)
        
    # Purge pending one-time codes
    OneTimeCode.objects.filter(requested_by=user).delete()
    
    # Update all pending AccountDeletionRequest for user
    AccountDeletionRequest.objects.filter(user=user, status=AccountDeletionRequest.Status.PENDING).update(
        status=AccountDeletionRequest.Status.COMPLETED,
        completed_at=timezone.now()
    )
    
    # Record immutable AuditEvent
    AuditEvent.objects.create(
        actor=operator or user,
        action=AuditEvent.Action.DELETE,
        target_app="accounts",
        target_model="User",
        target_pk=original_id,
        reason=f"Account erasure executed under SEC-002: {reason or 'Scheduled deletion'}",
        before_summary={"status": "active"},
        after_summary={"status": "erased_and_anonymized"},
    )
    
    return {
        "user_id": original_id,
        "erased_at": timezone.now().isoformat(),
        "status": "erased"
    }
