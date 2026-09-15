from __future__ import annotations
import hashlib
import json
from django.utils import timezone
from accounts.models import User
from profiles.models import DataExportRequest

def compile_full_user_data_export(user: User) -> dict:
    data = {}
    
    # account
    data["account"] = {
        "id": str(user.id),
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "preferred_locale": user.preferred_locale,
        "date_joined": user.date_joined.isoformat() if user.date_joined else None,
        "is_teacher_verified": getattr(user, "is_teacher_verified", False)
    }

    # privacy_preferences
    if hasattr(user, "privacy_preferences"):
        prefs = user.privacy_preferences
        data["privacy_preferences"] = {
            "functional_storage": prefs.functional_storage,
            "analytics_processing": prefs.analytics_processing,
            "ai_model_training_telemetry": prefs.ai_model_training_telemetry,
            "marketing_communications": prefs.marketing_communications,
            "updated_at": prefs.updated_at.isoformat() if prefs.updated_at else None
        }
    else:
        data["privacy_preferences"] = {}

    # consent_records (assuming empty for now if not existing)
    data["consent_records"] = []

    # profiles
    data["profiles"] = {}
    if hasattr(user, "learner_profile") and user.learner_profile:
        data["profiles"]["learner_profile"] = {
            "goal": user.learner_profile.goal,
            "preferred_days": user.learner_profile.preferred_days,
            "notes": user.learner_profile.notes
        }
    elif hasattr(user, "teacher_profile") and user.teacher_profile:
        data["profiles"]["teacher_profile"] = {
            "bio": user.teacher_profile.bio,
            "video_links": user.teacher_profile.video_links,
            "certificates": user.teacher_profile.certificates
        }
        
    # learning
    data["learning"] = {
        "placement_status": "none",
        "mission_stats": {},
        "srs_cards_count": 0,
        "writing_submissions_summary": {},
        "mistake_genome_summary": {}
    }
    
    # community
    data["community"] = {
        "post_counts": getattr(user, "post_counts", 0),
        "comment_counts": getattr(user, "comment_counts", 0)
    }

    # financial
    data["financial"] = {}

    # NEVER export password hashes, raw OTP codes, session tokens, or secret keys!
    # calculate SHA-256 integrity checksum over the formatted JSON data
    compiled_json_str = json.dumps(data, sort_keys=True)
    checksum = hashlib.sha256(compiled_json_str.encode('utf-8')).hexdigest()
    
    return {
        "schema_version": "1.0.0",
        "format": "endoora_user_data_archive",
        "user_id": str(user.id),
        "exported_at": timezone.now().isoformat(),
        "integrity_checksum_sha256": checksum,
        "data": data
    }


def process_data_export_request(export_request: DataExportRequest) -> dict:
    compiled_data = compile_full_user_data_export(export_request.user)
    
    export_request.status = DataExportRequest.Status.COMPLETED
    export_request.completed_at = timezone.now()
    export_request.save()
    
    return compiled_data
