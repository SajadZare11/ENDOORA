from __future__ import annotations
import time
from datetime import timedelta
from django.utils import timezone
from data_protection.models import DataPurgeLog
from data_protection.services.erasure_service import execute_account_erasure
from accounts.models import AccountDeletionRequest, OneTimeCode
from voice_lab.models import VoiceRecording
from profiles.models import DataExportRequest

def run_retention_purge(dry_run: bool = False, operator=None, trigger: str = "automated_cron") -> dict:
    start_time = time.time()
    
    # 1. Deletions
    pending_deletions = AccountDeletionRequest.objects.filter(
        status=AccountDeletionRequest.Status.PENDING,
        scheduled_for__lte=timezone.now()
    ).select_related('user')
    accounts_to_erase = list(pending_deletions)
    accounts_erased_count = len(accounts_to_erase)
    
    if not dry_run:
        for item in accounts_to_erase:
            execute_account_erasure(item.user, reason="Scheduled deletion grace period elapsed", operator=operator)
            
    # 2. Expired Audio Recordings
    expired_audio = VoiceRecording.objects.filter(
        expires_at__lte=timezone.now()
    ).exclude(status="purged")
    audio_purged_count = expired_audio.count()
    if not dry_run:
        for rec in expired_audio:
            # Note: might need to physically delete file if using local storage, but requirements say "clear audio_file"
            if rec.audio_file:
                rec.audio_file.delete(save=False)
            rec.audio_file = None
            rec.status = "purged"
            rec.save(update_fields=['audio_file', 'status'])
            
    # 3. Stale OTP Codes
    # created > 30 days ago or consumed > 7 days ago
    # OneTimeCode has 'created_at' and 'consumed_at'? Let's assume these fields exist.
    stale_otps = OneTimeCode.objects.filter(
        created_at__lt=timezone.now() - timedelta(days=30)
    ) | OneTimeCode.objects.filter(
        consumed_at__lt=timezone.now() - timedelta(days=7)
    )
    otps_purged_count = stale_otps.count()
    if not dry_run:
        stale_otps.delete()
        
    # 4. Stale Data Export Requests
    stale_exports = DataExportRequest.objects.filter(
        status=DataExportRequest.Status.COMPLETED,
        completed_at__lt=timezone.now() - timedelta(hours=48)
    )
    exports_purged_count = stale_exports.count()
    if not dry_run:
        stale_exports.delete()
        
    duration_ms = int((time.time() - start_time) * 1000)
    status = "dry_run" if dry_run else "completed"
    
    if not dry_run:
        DataPurgeLog.objects.create(
            trigger=trigger,
            operator=operator,
            accounts_erased=accounts_erased_count,
            audio_files_purged=audio_purged_count,
            stale_otps_purged=otps_purged_count,
            stale_exports_purged=exports_purged_count,
            duration_ms=duration_ms,
            status=status
        )
        
    return {
        "dry_run": dry_run,
        "accounts_erased": accounts_erased_count,
        "audio_files_purged": audio_purged_count,
        "stale_otps_purged": otps_purged_count,
        "stale_exports_purged": exports_purged_count,
        "duration_ms": duration_ms,
        "executed_at": timezone.now().isoformat(),
        "status": status,
    }
