from __future__ import annotations

import hashlib
import json
from django.db.models import Q
from django.utils import timezone

from accounts.models import ConsentRecord, User
from profiles.models import DataExportRequest


def compile_full_user_data_export(user: User) -> dict:
    """
    Compiles an authoritative, complete, cross-domain account data export archive (F24).
    Excludes all passwords, hashes, authentication tokens, and internal-only secrets.
    """
    data = {}

    # 1. Account & Security State (No secrets/passwords)
    data["account"] = {
        "id": str(user.id),
        "email": user.email,
        "phone": getattr(user, "phone", None),
        "role": getattr(user, "role", "learner"),
        "preferred_locale": getattr(user, "preferred_locale", "fa"),
        "date_joined": user.date_joined.isoformat() if user.date_joined else None,
        "is_active": user.is_active,
        "is_teacher_verified": getattr(user, "is_teacher_verified", False),
    }

    # 2. Privacy & Consent Preferences
    if hasattr(user, "privacy_preferences"):
        prefs = user.privacy_preferences
        data["privacy_preferences"] = {
            "functional_storage": prefs.functional_storage,
            "analytics_processing": prefs.analytics_processing,
            "ai_model_training_telemetry": prefs.ai_model_training_telemetry,
            "marketing_communications": prefs.marketing_communications,
            "updated_at": prefs.updated_at.isoformat() if prefs.updated_at else None,
        }
    else:
        data["privacy_preferences"] = {}

    # Consent Audit Records
    consent_items = []
    for c in ConsentRecord.objects.filter(user=user).order_by("-accepted_at"):
        consent_items.append({
            "id": str(c.id),
            "consent_type": c.consent_type,
            "version": c.version,
            "locale": c.locale,
            "source": c.source,
            "accepted_at": c.accepted_at.isoformat() if c.accepted_at else None,
        })
    data["consent_records"] = consent_items

    # 3. User Profiles
    data["profiles"] = {}
    if hasattr(user, "learner_profile") and user.learner_profile:
        lp = user.learner_profile
        data["profiles"]["learner_profile"] = {
            "goal": getattr(lp, "goal", ""),
            "preferred_days": getattr(lp, "preferred_days", []),
            "notes": getattr(lp, "notes", ""),
        }
    elif hasattr(user, "teacher_profile") and user.teacher_profile:
        tp = user.teacher_profile
        data["profiles"]["teacher_profile"] = {
            "bio": getattr(tp, "bio", ""),
            "video_links": getattr(tp, "video_links", []),
            "certificates": getattr(tp, "certificates", []),
        }

    # 4. Learning History & Assessment Submissions
    learning_data = {
        "placement_sessions": [],
        "online_exam_submissions": [],
        "ielts_writing_submissions": [],
        "ielts_speaking_submissions": [],
        "ielts_test_sessions": [],
        "missions_completed_count": 0,
        "srs_cards_count": 0,
        "tracked_mistakes_count": 0,
    }

    # Placement Sessions
    from placement.models import PlacementSession
    for ps in PlacementSession.objects.filter(user=user).select_related("result").order_by("-started_at"):
        learning_data["placement_sessions"].append({
            "session_id": str(ps.id),
            "status": ps.status,
            "current_step": ps.current_section,
            "recommended_level": getattr(getattr(ps, "result", None), "cefr_level", ""),
            "started_at": ps.started_at.isoformat() if ps.started_at else None,
            "completed_at": ps.completed_at.isoformat() if ps.completed_at else None,
        })

    # Online Exam Submissions
    from online_exams.models import ExamSubmission
    for es in ExamSubmission.objects.filter(student=user).select_related("exam").order_by("-started_at"):
        learning_data["online_exam_submissions"].append({
            "submission_id": str(es.id),
            "exam_id": str(es.exam_id),
            "exam_title": es.exam.title if es.exam else "",
            "status": es.status,
            "total_score": float(es.total_score) if es.total_score is not None else None,
            "percentage": float(es.percentage) if es.percentage is not None else None,
            "started_at": es.started_at.isoformat() if es.started_at else None,
            "submitted_at": es.submitted_at.isoformat() if es.submitted_at else None,
        })

    # IELTS Submissions
    from ielts.models import IELTSWritingSubmission, IELTSSpeakingSubmission, IELTSTestSession
    for ws in IELTSWritingSubmission.objects.filter(learner=user).order_by("-created_at"):
        learning_data["ielts_writing_submissions"].append({
            "submission_id": str(ws.id),
            "task_type": getattr(ws, "task_type", ""),
            "status": getattr(ws, "status", ""),
            "band_score": float(ws.overall_band) if getattr(ws, "overall_band", None) is not None else None,
            "created_at": ws.created_at.isoformat() if ws.created_at else None,
        })
    for ss in IELTSSpeakingSubmission.objects.filter(learner=user).order_by("-created_at"):
        learning_data["ielts_speaking_submissions"].append({
            "submission_id": str(ss.id),
            "status": getattr(ss, "status", ""),
            "band_score": float(ss.overall_band) if getattr(ss, "overall_band", None) is not None else None,
            "created_at": ss.created_at.isoformat() if ss.created_at else None,
        })
    for ts in IELTSTestSession.objects.filter(learner=user).order_by("-started_at"):
        learning_data["ielts_test_sessions"].append({
            "session_id": str(ts.id),
            "status": getattr(ts, "status", ""),
            "overall_band": float(ts.scaled_band_score) if getattr(ts, "scaled_band_score", None) is not None else None,
            "started_at": ts.started_at.isoformat() if ts.started_at else None,
        })

    # Missions & SRS
    from missions.models import DailyMission
    learning_data["missions_completed_count"] = DailyMission.objects.filter(user=user, status="completed").count()

    from srs.models import SrsItem
    learning_data["srs_cards_count"] = SrsItem.objects.filter(learner=user).count()

    from mistake_genome.models import LearnerMistakePattern
    learning_data["tracked_mistakes_count"] = LearnerMistakePattern.objects.filter(learner=user).count()

    data["learning"] = learning_data

    # 5. Financial & Commerce Records
    financial_data = {
        "wallet": None,
        "transactions": [],
        "bookings": [],
        "subscriptions": [],
    }

    from marketplace.models import UserWallet, PaymentTransaction, SessionBooking, UserSubscription
    wallet = UserWallet.objects.filter(user=user).first()
    if wallet:
        financial_data["wallet"] = {
            "balance_toman": float(wallet.balance_toman),
            "locked_toman": float(wallet.locked_toman),
            "created_at": wallet.created_at.isoformat() if wallet.created_at else None,
        }

    for tx in PaymentTransaction.objects.filter(user=user).order_by("-created_at"):
        financial_data["transactions"].append({
            "transaction_id": str(tx.id),
            "order_type": tx.order_type,
            "amount_toman": float(tx.amount_toman),
            "gateway_provider": tx.gateway_provider,
            "status": tx.status,
            "ref_id": getattr(tx, "ref_id", ""),
            "created_at": tx.created_at.isoformat() if tx.created_at else None,
        })

    for bk in SessionBooking.objects.filter(Q(learner=user) | Q(teacher=user)).order_by("-created_at"):
        financial_data["bookings"].append({
            "booking_id": str(bk.id),
            "status": bk.status,
            "target_skill": getattr(bk, "target_skill", ""),
            "duration_minutes": getattr(bk, "duration_minutes", 45),
            "scheduled_start": bk.scheduled_start.isoformat() if getattr(bk, "scheduled_start", None) else None,
            "rate_toman": float(bk.rate_toman) if getattr(bk, "rate_toman", None) is not None else None,
            "is_paid": getattr(bk, "is_paid", False),
        })

    for sub in UserSubscription.objects.filter(user=user).order_by("-created_at"):
        financial_data["subscriptions"].append({
            "subscription_id": str(sub.id),
            "plan_id": str(sub.plan_id) if sub.plan_id else None,
            "is_active": sub.is_currently_active(),
            "started_at": sub.starts_at.isoformat() if sub.starts_at else None,
            "expires_at": sub.expires_at.isoformat() if sub.expires_at else None,
        })

    data["financial"] = financial_data

    # 6. Community Records
    community_data = {
        "posts_count": 0,
        "comments_count": 0,
    }
    from community.models import CommunityPost, PostComment
    community_data["posts_count"] = CommunityPost.objects.filter(author=user).count()
    community_data["comments_count"] = PostComment.objects.filter(author=user).count()
    data["community"] = community_data

    # Calculate deterministic SHA-256 integrity checksum over the formatted JSON data
    compiled_json_str = json.dumps(data, sort_keys=True)
    checksum = hashlib.sha256(compiled_json_str.encode("utf-8")).hexdigest()

    return {
        "schema_version": "1.0.0",
        "format": "endoora_user_data_archive",
        "user_id": str(user.id),
        "exported_at": timezone.now().isoformat(),
        "integrity_checksum_sha256": checksum,
        "data": data,
    }


def process_data_export_request(export_request: DataExportRequest) -> dict:
    compiled_data = compile_full_user_data_export(export_request.user)

    export_request.status = DataExportRequest.Status.COMPLETED
    export_request.completed_at = timezone.now()
    export_request.save()

    return compiled_data
