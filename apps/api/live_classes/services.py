import json
import logging
import os
import time
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from assessment.services import evaluate_placement_answers, map_score_to_cefr_estimate
from placement.models import PlacementAnswer, PlacementSession
from .models import (
    AttendanceRecord,
    AttendanceStatus,
    ClassEnrollmentRequest,
    ClassFormat,
    CohortStatus,
    CurriculumBookMapping,
    CurriculumTrack,
    EnrollmentRequestStatus,
    LiveClassCohort,
    LiveClassQuiz,
    LiveClassQuizResponse,
    SessionAiRecap,
    SessionWhiteboardExport,
    TeacherSessionLog,
)
from .curriculum_data import CURRICULUM_SEEDS

logger = logging.getLogger(__name__)
User = get_user_model()

CORE_ITEMS_PATH = getattr(settings, "REPO_ROOT", Path(__file__).resolve().parents[3]) / "data" / "placement" / "core-items.json"


def ensure_curriculum_catalog() -> None:
    """Ensures standard Iranian institute textbooks are pre-seeded in the database."""
    if CurriculumBookMapping.objects.exists():
        return

    mappings = []
    for seed in CURRICULUM_SEEDS:
        mappings.append(
            CurriculumBookMapping(
                slug=seed["slug"],
                track=seed["track"],
                min_cefr=seed["min_cefr"],
                max_cefr=seed["max_cefr"],
                min_age=seed.get("min_age", 14),
                max_age=seed.get("max_age", 99),
                book_title=seed["book_title"],
                publisher=seed["publisher"],
                edition=seed.get("edition", ""),
                description_fa=seed.get("description_fa", ""),
                description_en=seed.get("description_en", ""),
                cover_image_url=seed.get("cover_image_url", ""),
                syllabus_json=seed.get("syllabus_json", {}),
            )
        )
    CurriculumBookMapping.objects.bulk_create(mappings)


def recommend_curriculum_for_user(user: Any) -> dict[str, Any]:
    """
    Evaluates learner's placement evidence, age, and goals to select
    the exact textbook track and generate present/future syllabus graphs.
    """
    ensure_curriculum_catalog()

    # 1. Determine baseline CEFR from latest submitted placement session
    latest_placement = None
    if getattr(user, "is_authenticated", False):
        latest_placement = (
            PlacementSession.objects.filter(user=user, status=PlacementSession.Status.SUBMITTED)
            .order_by("-started_at")
            .first()
        )

    cefr = "A1"
    score_percentage = 0.0

    if latest_placement:
        raw_items = []
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
            except Exception:
                raw_items = []

        answers_map = {}
        for ans in latest_placement.answers.all():
            val = ans.answer_value
            if isinstance(val, dict):
                answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
            else:
                answers_map[ans.question_key] = val

        if answers_map:
            eval_res = evaluate_placement_answers(raw_items, answers_map)
            score_percentage = float(eval_res.get("overall_percentage", 0.0))
            cefr = eval_res.get("estimated_cefr_level") or map_score_to_cefr_estimate(score_percentage)

    if hasattr(user, "learner_twin") and getattr(user.learner_twin, "summary", {}).get("estimated_cefr_level"):
        cefr = user.learner_twin.summary.get("estimated_cefr_level")
        score_percentage = float(user.learner_twin.summary.get("overall_percentage", score_percentage))

    # 2. Extract profile attributes (age, goal) if available
    profile = getattr(user, "profile", None)
    birth_date = getattr(profile, "birth_date", None)
    target_goal = getattr(profile, "goal", "general")
    if hasattr(profile, "learning_goal"):
        target_goal = profile.learning_goal or target_goal

    age = 22  # default young adult
    if birth_date:
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

    # 3. Decision Matrix
    target_slug = "aef-starter"

    # A. Kids / Young Learners Track
    if age <= 7:
        target_slug = "family-and-friends-starter"
    elif 8 <= age <= 12:
        target_slug = "oxford-discover-superminds"
    # B. Exam Preparation Track (Iran high demand)
    elif target_goal in ["ielts", "ielts_academic", "ielts_general"]:
        target_slug = "cambridge-ielts-series"
    elif target_goal in ["toefl", "toefl_ibt"]:
        target_slug = "barrons-toefl-ibt"
    # C. Adult General Track (CEFR based)
    else:
        cefr_clean = cefr.upper().strip()
        if cefr_clean == "A1":
            target_slug = "aef-starter"
        elif cefr_clean == "A2":
            target_slug = "aef-1" if score_percentage < 60 else "aef-2"
        elif cefr_clean == "B1":
            target_slug = "aef-3"
        elif cefr_clean == "B2":
            target_slug = "aef-4"
        elif cefr_clean in ["C1", "C2"]:
            if target_goal in ["exam", "cae"]:
                target_slug = "cambridge-cae"
            else:
                target_slug = "aef-5"
        else:
            target_slug = "aef-starter"

    mapping = CurriculumBookMapping.objects.filter(slug=target_slug).first()
    if not mapping:
        mapping = CurriculumBookMapping.objects.first()

    syllabus = mapping.syllabus_json if mapping else {}
    total_units = syllabus.get("total_units", 12)
    current_unit = syllabus.get("current_recommended_unit", 1)

    # Build roadmap progression stages
    future_milestones = [
        {
            "phase": "مرحله مقدماتی (پایه‌گذاری مفاهیم)",
            "phase_en": "Foundational Phase (Core Concepts)",
            "units": f"واحد ۱ تا {max(2, total_units // 3)}",
            "grammar_focus": syllabus.get("grammar_milestones", ["مقدماتی"])[:2],
            "vocabulary_focus": syllabus.get("vocabulary_themes", ["واژگان پایه"])[:2],
            "status": "in_progress",
        },
        {
            "phase": "مرحله توسعه و تسلط میانی",
            "phase_en": "Expansion & Fluency Phase",
            "units": f"واحد {(total_units // 3) + 1} تا {(2 * total_units) // 3}",
            "grammar_focus": syllabus.get("grammar_milestones", ["توسعه ساختار"]) [2:4],
            "vocabulary_focus": syllabus.get("vocabulary_themes", ["واژگان کاربردی"]) [2:4],
            "status": "planned",
        },
        {
            "phase": "مرحله پیشرفته و تسلط بر مکالمه",
            "phase_en": "Consolidation & Active Speaking Output",
            "units": f"واحد {((2 * total_units) // 3) + 1} تا {total_units}",
            "grammar_focus": syllabus.get("grammar_milestones", ["تثبیت"]) [4:],
            "vocabulary_focus": syllabus.get("vocabulary_themes", ["تثبیت"]) [4:],
            "status": "planned",
        },
    ]

    return {
        "book_id": str(mapping.id) if mapping else None,
        "slug": mapping.slug if mapping else target_slug,
        "book_title": mapping.book_title if mapping else "American English File Starter",
        "publisher": mapping.publisher if mapping else "Oxford University Press",
        "edition": mapping.edition if mapping else "3rd Edition",
        "cover_image_url": mapping.cover_image_url if mapping else "",
        "description_fa": mapping.description_fa if mapping else "",
        "description_en": mapping.description_en if mapping else "",
        "track": mapping.track if mapping else "adult_general",
        "track_display_fa": mapping.get_track_display() if mapping else "عمومی بزرگسالان",
        "target_cefr": cefr,
        "overall_percentage": score_percentage,
        "current_unit": current_unit,
        "total_units": total_units,
        "grammar_milestones": syllabus.get("grammar_milestones", []),
        "vocabulary_themes": syllabus.get("vocabulary_themes", []),
        "speaking_goals": syllabus.get("speaking_goals", []),
        "sample_units": syllabus.get("sample_units", []),
        "future_milestones": future_milestones,
    }


def get_learner_class_status(user: Any) -> dict[str, Any]:
    """Retrieves the learner's active class request, cohort membership, and latest teacher session log."""
    if not getattr(user, "is_authenticated", False):
        return {
            "has_active_request": False,
            "request": None,
            "is_enrolled": False,
            "cohort": None,
            "latest_session_log": None,
        }

    # 1. Check for active enrolled cohort
    cohort = (
        LiveClassCohort.objects.filter(students=user, status=CohortStatus.ACTIVE)
        .select_related("teacher", "book")
        .first()
    )

    cohort_data = None
    latest_log_data = None

    if cohort:
        cohort_data = {
            "id": str(cohort.id),
            "title": cohort.title,
            "teacher_id": str(cohort.teacher_id),
            "teacher_name": cohort.teacher.get_full_name() or cohort.teacher.email,
            "book_title": cohort.book.book_title if cohort.book else "",
            "class_format": cohort.class_format,
            "class_format_display": cohort.get_class_format_display(),
            "meeting_url": cohort.meeting_url,
            "schedule_summary": cohort.schedule_summary,
            "next_session_at": cohort.next_session_at.isoformat() if cohort.next_session_at else None,
            "students_count": cohort.students.count(),
            "max_capacity": cohort.max_capacity,
        }

        latest_log = cohort.session_logs.order_by("-session_date", "-session_number").first()
        if latest_log:
            latest_log_data = {
                "id": str(latest_log.id),
                "session_number": latest_log.session_number,
                "units_covered": latest_log.units_covered,
                "grammar_covered": latest_log.grammar_covered,
                "vocabulary_list": latest_log.vocabulary_list,
                "homework_description": latest_log.homework_description,
                "teacher_notes": latest_log.teacher_notes,
                "session_date": latest_log.session_date.isoformat(),
            }

    # 2. Check for latest enrollment request
    latest_request = (
        ClassEnrollmentRequest.objects.filter(student=user)
        .select_related("target_book")
        .order_by("-created_at")
        .first()
    )

    request_data = None
    if latest_request:
        request_data = {
            "id": str(latest_request.id),
            "preferred_format": latest_request.preferred_format,
            "preferred_format_display": latest_request.get_preferred_format_display(),
            "max_classmates": latest_request.max_classmates,
            "available_slots": latest_request.available_slots_json,
            "status": latest_request.status,
            "status_display": latest_request.get_status_display(),
            "target_book_title": latest_request.target_book.book_title if latest_request.target_book else None,
            "created_at": latest_request.created_at.isoformat(),
        }

    return {
        "has_active_request": latest_request is not None and latest_request.status in [EnrollmentRequestStatus.PENDING, EnrollmentRequestStatus.CLAIMED],
        "request": request_data,
        "is_enrolled": cohort is not None,
        "cohort": cohort_data,
        "latest_session_log": latest_log_data,
    }


def submit_enrollment_request(
    user: Any,
    preferred_format: str,
    max_classmates: int,
    available_slots: list[dict[str, Any]],
    notes: str = "",
) -> ClassEnrollmentRequest:
    """Submits or updates a learner's live class enrollment request."""
    rec = recommend_curriculum_for_user(user)
    target_book = None
    if rec.get("book_id"):
        target_book = CurriculumBookMapping.objects.filter(id=rec["book_id"]).first()

    # Cap classmates to valid range (1 to 3 classmates -> 2 to 4 total students)
    classmates_capped = max(1, min(3, int(max_classmates)))

    # If pending request exists, update it; otherwise create new
    pending_req = ClassEnrollmentRequest.objects.filter(
        student=user,
        status=EnrollmentRequestStatus.PENDING,
    ).first()

    if pending_req:
        pending_req.preferred_format = preferred_format
        pending_req.max_classmates = classmates_capped
        pending_req.available_slots_json = available_slots
        pending_req.target_book = target_book
        pending_req.student_notes = notes
        pending_req.save()
        return pending_req

    return ClassEnrollmentRequest.objects.create(
        student=user,
        preferred_format=preferred_format,
        max_classmates=classmates_capped,
        available_slots_json=available_slots,
        target_book=target_book,
        student_notes=notes,
        status=EnrollmentRequestStatus.PENDING,
    )


def get_open_class_requests_for_teachers() -> dict[str, Any]:
    """
    Returns pending student requests and algorithmic cohort suggestions for teachers.
    Groups compatible students (matching CEFR / book & schedule) up to 4 students.
    """
    requests = (
        ClassEnrollmentRequest.objects.filter(status=EnrollmentRequestStatus.PENDING)
        .select_related("student", "target_book")
        .order_by("-created_at")
    )

    requests_list = []
    # Index by book_id to find group matching opportunities
    book_groups: dict[str, list[dict[str, Any]]] = {}

    for req in requests:
        user = req.student
        placement = PlacementSession.objects.filter(user=user, status=PlacementSession.Status.SUBMITTED).order_by("-started_at").first()
        cefr = getattr(placement, "estimated_cefr", "A1") if placement else "A1"

        item = {
            "id": str(req.id),
            "student_id": str(user.id),
            "student_name": user.get_full_name() or user.email,
            "student_email": user.email,
            "cefr_level": cefr,
            "preferred_format": req.preferred_format,
            "preferred_format_display": req.get_preferred_format_display(),
            "max_classmates": req.max_classmates,
            "available_slots": req.available_slots_json,
            "target_book_id": str(req.target_book.id) if req.target_book else None,
            "target_book_title": req.target_book.book_title if req.target_book else "American English File",
            "notes": req.student_notes,
            "created_at": req.created_at.isoformat(),
        }
        requests_list.append(item)

        if req.preferred_format == ClassFormat.GROUP and req.target_book:
            book_id_str = str(req.target_book.id)
            if book_id_str not in book_groups:
                book_groups[book_id_str] = []
            book_groups[book_id_str].append(item)

    # Form smart cohort recommendations (2 to 4 students in the same book pool)
    cohort_suggestions = []
    for book_id_str, members in book_groups.items():
        if len(members) >= 2:
            chunk = members[:4]  # Up to 4 students max
            cohort_suggestions.append({
                "book_title": chunk[0]["target_book_title"],
                "cefr_level": chunk[0]["cefr_level"],
                "suggested_capacity": len(chunk),
                "member_ids": [m["id"] for m in chunk],
                "student_names": [m["student_name"] for m in chunk],
                "common_slots": _find_common_slots([m["available_slots"] for m in chunk]),
            })

    return {
        "requests": requests_list,
        "cohort_suggestions": cohort_suggestions,
        "total_pending": len(requests_list),
    }


def _find_common_slots(slot_lists: list[list[dict[str, Any]]]) -> list[str]:
    """Finds overlapping schedule slot descriptions across students."""
    if not slot_lists:
        return []
    common = []
    first = slot_lists[0]
    for s in first:
        day = s.get("day", "")
        time = s.get("time_window", "")
        key = f"{day}_{time}"
        all_have = True
        for other in slot_lists[1:]:
            has_it = any(o.get("day") == day and o.get("time_window") == time for o in other)
            if not has_it:
                all_have = False
                break
        if all_have:
            common.append(f"{day} ({time})")
    return common


@transaction.atomic
def claim_and_create_cohort(
    teacher: Any,
    request_ids: list[str],
    title: str,
    meeting_url: str = "",
    schedule_summary: str = "",
    next_session_at: Any = None,
) -> LiveClassCohort:
    """
    Teacher claims 1 to 4 student requests and instantiates an active LiveClassCohort.
    """
    if len(request_ids) < 1 or len(request_ids) > 4:
        raise ValueError("تعداد زبان‌آموزان در کلاس آنلاین باید بین ۱ تا ۴ نفر باشد.")

    requests = list(
        ClassEnrollmentRequest.objects.filter(
            id__in=request_ids,
            status=EnrollmentRequestStatus.PENDING,
        ).select_related("target_book", "student")
    )

    if len(requests) != len(request_ids):
        raise ValueError("برخی از درخواست‌های انتخاب‌شده قبلاً توسط مدرس دیگری پذیرفته شده‌اند یا معتبر نیستند.")

    book = requests[0].target_book
    is_solo = len(requests) == 1 and requests[0].preferred_format == ClassFormat.SOLO
    class_format = ClassFormat.SOLO if is_solo else ClassFormat.GROUP

    cohort = LiveClassCohort.objects.create(
        teacher=teacher,
        book=book,
        title=title or (f"کلاس اختصاصی {book.book_title}" if book else "کلاس آنلاین زبان"),
        class_format=class_format,
        max_capacity=4 if class_format == ClassFormat.GROUP else 1,
        meeting_url=meeting_url,
        schedule_summary=schedule_summary,
        next_session_at=next_session_at,
        status=CohortStatus.ACTIVE,
    )

    for req in requests:
        cohort.students.add(req.student)
        req.status = EnrollmentRequestStatus.MATCHED
        req.claimed_by_teacher = teacher
        req.save()

    return cohort


def log_teacher_session(
    teacher: Any,
    cohort_id: str,
    units_covered: str,
    grammar_covered: str = "",
    vocabulary_list: list[str] | None = None,
    homework_description: str = "",
    teacher_notes: str = "",
    next_session_at: Any = None,
) -> TeacherSessionLog:
    """Records a completed session log and updates the cohort next session schedule."""
    cohort = LiveClassCohort.objects.get(id=cohort_id, teacher=teacher)

    current_count = cohort.session_logs.count()
    session_number = current_count + 1

    session_log = TeacherSessionLog.objects.create(
        cohort=cohort,
        teacher=teacher,
        session_number=session_number,
        units_covered=units_covered,
        grammar_covered=grammar_covered,
        vocabulary_list=vocabulary_list or [],
        homework_description=homework_description,
        teacher_notes=teacher_notes,
        session_date=timezone.now().date(),
    )

    if next_session_at:
        cohort.next_session_at = next_session_at
        cohort.save()

    return session_log


# ==============================================================================
# LiveKit WebRTC Token & Session Management
# ==============================================================================

def create_livekit_token(
    room_name: str,
    user: Any,
    is_teacher: bool = False,
    extra_metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Generates a secure LiveKit JWT access token for room authentication.
    """
    api_key = os.getenv("LIVEKIT_API_KEY", "devkey")
    api_secret = os.getenv("LIVEKIT_API_SECRET", "secret_dev_key_for_endoora_local_development_only_123456789")
    livekit_url = os.getenv("LIVEKIT_URL", "ws://127.0.0.1:7880")
    
    identity = str(user.id)
    display_name = getattr(user, "get_full_name", lambda: "")() or getattr(user, "email", "کاربر")
    
    meta = {
        "user_id": str(user.id),
        "email": getattr(user, "email", ""),
        "name": display_name,
        "role": "teacher" if is_teacher else "student",
    }
    if extra_metadata:
        meta.update(extra_metadata)

    now = int(time.time())
    payload = {
        "iss": api_key,
        "sub": identity,
        "name": display_name,
        "nbf": now - 5,
        "exp": now + 8 * 3600,  # 8 hours validity
        "video": {
            "room": str(room_name),
            "roomJoin": True,
            "canPublish": True,  # Allows teacher and approved students to publish audio/video
            "canSubscribe": True,
            "canPublishData": True,  # Crucial for whiteboard sync, live quiz, and text chat
        },
        "metadata": json.dumps(meta, ensure_ascii=False),
    }

    token = jwt.encode(payload, api_secret, algorithm="HS256")
    return {
        "token": token,
        "server_url": livekit_url,
        "room_name": str(room_name),
        "identity": identity,
        "display_name": display_name,
        "is_teacher": is_teacher,
    }


# ==============================================================================
# Automatic Attendance Tracking (>= 70% Presence)
# ==============================================================================

def record_livekit_attendance_event(
    session_id: str,
    user_identity: str,
    event_type: str,
    event_time: Any = None,
    duration_seconds: int = 0,
) -> AttendanceRecord | None:
    """
    Processes LiveKit participant events (participant_joined, participant_left).
    Tracks active connected seconds for each student.
    """
    try:
        user = User.objects.get(id=user_identity)
    except (User.DoesNotExist, ValueError):
        # Could be an email or guest
        user = User.objects.filter(email=user_identity).first()
        if not user:
            logger.warning(f"Could not find user for identity: {user_identity}")
            return None

    record, _ = AttendanceRecord.objects.get_or_create(
        session_id=str(session_id),
        student=user,
        defaults={
            "first_joined_at": event_time or timezone.now(),
            "total_connected_seconds": 0,
            "status": AttendanceStatus.ABSENT,
        },
    )

    now = event_time or timezone.now()
    if event_type == "participant_joined":
        if not record.first_joined_at:
            record.first_joined_at = now
        record.save(update_fields=["first_joined_at"])
    elif event_type == "participant_left":
        record.last_left_at = now
        if duration_seconds > 0:
            record.total_connected_seconds += duration_seconds
        record.save(update_fields=["last_left_at", "total_connected_seconds"])

    return record


def finalize_session_attendance(
    session_id: str,
    session_duration_minutes: int = 60,
) -> list[dict[str, Any]]:
    """
    Evaluates in-class presence against the 70% threshold.
    If presence >= 70%: Status = PRESENT (حاضر)
    If 30% <= presence < 70%: Status = TARDY (حضور ناقص / تاخیر)
    Else: Status = ABSENT (غایب)
    """
    total_session_seconds = max(1, session_duration_minutes * 60)
    records = AttendanceRecord.objects.filter(session_id=str(session_id))
    results = []

    for rec in records:
        if not rec.teacher_override:
            pct = Decimal(min(100.0, (rec.total_connected_seconds / total_session_seconds) * 100.0))
            rec.attendance_percentage = round(pct, 2)
            if pct >= Decimal("70.0"):
                rec.status = AttendanceStatus.PRESENT
            elif pct >= Decimal("30.0"):
                rec.status = AttendanceStatus.TARDY
            else:
                rec.status = AttendanceStatus.ABSENT
            rec.is_auto_verified = True
            rec.save()

        results.append({
            "id": str(rec.id),
            "student_id": str(rec.student_id),
            "student_name": getattr(rec.student, "get_full_name", lambda: "")() or rec.student.email,
            "student_email": rec.student.email,
            "total_connected_seconds": rec.total_connected_seconds,
            "total_connected_minutes": round(rec.total_connected_seconds / 60, 1),
            "attendance_percentage": float(rec.attendance_percentage),
            "status": rec.status,
            "status_display": rec.get_status_display(),
            "teacher_override": rec.teacher_override,
            "teacher_override_reason": rec.teacher_override_reason,
            "first_joined_at": rec.first_joined_at.isoformat() if rec.first_joined_at else None,
            "last_left_at": rec.last_left_at.isoformat() if rec.last_left_at else None,
        })

    return results


def teacher_override_attendance(
    session_id: str,
    student_id: str,
    new_status: str,
    reason: str = "",
) -> AttendanceRecord:
    """Allows verified teachers to manually adjust a student's attendance before locking."""
    record = AttendanceRecord.objects.get(session_id=str(session_id), student_id=student_id)
    record.status = new_status
    record.teacher_override = True
    record.teacher_override_reason = reason
    record.save(update_fields=["status", "teacher_override", "teacher_override_reason", "updated_at"])
    return record


def get_session_attendance_summary(session_id: str) -> list[dict[str, Any]]:
    """Returns the attendance sheet for a given session."""
    records = AttendanceRecord.objects.filter(session_id=str(session_id)).select_related("student")
    return [
        {
            "id": str(rec.id),
            "student_id": str(rec.student_id),
            "student_name": getattr(rec.student, "get_full_name", lambda: "")() or rec.student.email,
            "student_email": rec.student.email,
            "total_connected_seconds": rec.total_connected_seconds,
            "total_connected_minutes": round(rec.total_connected_seconds / 60, 1),
            "attendance_percentage": float(rec.attendance_percentage),
            "status": rec.status,
            "status_display": rec.get_status_display(),
            "teacher_override": rec.teacher_override,
            "teacher_override_reason": rec.teacher_override_reason,
            "first_joined_at": rec.first_joined_at.isoformat() if rec.first_joined_at else None,
            "last_left_at": rec.last_left_at.isoformat() if rec.last_left_at else None,
        }
        for rec in records
    ]


# ==============================================================================
# In-Class Real-Time Quiz & Analytics
# ==============================================================================

def launch_in_class_quiz(
    session_id: str,
    prompt: str = "",
    options: list[str] | None = None,
    correct_option_index: int | None = None,
    duration_seconds: int = 45,
    class_session: Any = None,
) -> LiveClassQuiz:
    """
    Teacher launches an instant multiple-choice quiz (A/B/C/D or custom).
    """
    # Deactivate previous active quizzes in this room
    LiveClassQuiz.objects.filter(session_id=str(session_id), is_active=True).update(is_active=False)

    opts = options or ["الف", "ب", "ج", "د"]
    quiz = LiveClassQuiz.objects.create(
        session_id=str(session_id),
        class_session=class_session,
        prompt=prompt or "پاسخ صحیح به سوال مطرح‌شده روی تخته را انتخاب کنید:",
        options=opts,
        correct_option_index=correct_option_index,
        duration_seconds=duration_seconds,
        is_active=True,
        is_results_published=False,
    )
    return quiz


def submit_in_class_quiz_response(
    quiz_id: str,
    student: Any,
    selected_option_index: int,
    time_to_respond_seconds: float = 0.0,
) -> LiveClassQuizResponse:
    """Submits student's option for an active quiz."""
    quiz = LiveClassQuiz.objects.get(id=quiz_id)
    if not quiz.is_active:
        raise ValueError("این کوییز به پایان رسیده است و امکان ثبت پاسخ وجود ندارد.")

    response, created = LiveClassQuizResponse.objects.update_or_create(
        quiz=quiz,
        student=student,
        defaults={
            "selected_option_index": selected_option_index,
            "time_to_respond_seconds": Decimal(str(round(time_to_respond_seconds, 2))),
        },
    )
    return response


def get_quiz_summary(quiz_id: str) -> dict[str, Any]:
    """
    Computes real-time distribution chart metrics for the teacher's podium.
    """
    quiz = LiveClassQuiz.objects.get(id=quiz_id)
    responses = list(quiz.responses.select_related("student"))
    total_count = len(responses)
    options = quiz.options

    counts = {i: 0 for i in range(len(options))}
    for r in responses:
        if 0 <= r.selected_option_index < len(options):
            counts[r.selected_option_index] += 1

    distribution = []
    for i, opt_label in enumerate(options):
        c = counts[i]
        pct = round((c / total_count * 100), 1) if total_count > 0 else 0.0
        distribution.append({
            "index": i,
            "label": opt_label,
            "count": c,
            "percentage": pct,
            "is_correct": (i == quiz.correct_option_index) if quiz.correct_option_index is not None else None,
        })

    return {
        "quiz_id": str(quiz.id),
        "prompt": quiz.prompt,
        "is_active": quiz.is_active,
        "is_results_published": quiz.is_results_published,
        "duration_seconds": quiz.duration_seconds,
        "total_responses": total_count,
        "correct_option_index": quiz.correct_option_index,
        "distribution": distribution,
        "created_at": quiz.created_at.isoformat(),
    }


def publish_quiz_results(quiz_id: str) -> LiveClassQuiz:
    """Teacher closes the poll and reveals the answer/chart to students."""
    quiz = LiveClassQuiz.objects.get(id=quiz_id)
    quiz.is_active = False
    quiz.is_results_published = True
    quiz.save(update_fields=["is_active", "is_results_published"])
    return quiz


# ==============================================================================
# Whiteboard PDF Export
# ==============================================================================

def save_whiteboard_export(
    session_id: str,
    pdf_file: Any,
    page_count: int = 1,
    class_session: Any = None,
) -> SessionWhiteboardExport:
    """Stores the generated multi-page whiteboard PDF document."""
    export, _ = SessionWhiteboardExport.objects.update_or_create(
        session_id=str(session_id),
        defaults={
            "class_session": class_session,
            "pdf_file": pdf_file,
            "page_count": page_count,
            "file_size_bytes": getattr(pdf_file, "size", 0),
        },
    )
    return export


# ==============================================================================
# Smart Educational Recap (Gemini AI)
# ==============================================================================

def generate_session_ai_recap(
    session_id: str,
    topics_covered_raw: str = "",
    whiteboard_text: str = "",
    teacher_notes: str = "",
    chat_logs: str = "",
    class_session: Any = None,
) -> SessionAiRecap:
    """
    Invokes Gemini AI via the AI Gateway to produce a structured recap of the session:
    - Topics Covered
    - Golden Formulas & Key Takeaways
    - Common Pitfalls identified in quizzes
    - Recommended Homework
    """
    # 1. Gather Quiz statistics from this session
    quizzes = LiveClassQuiz.objects.filter(session_id=str(session_id)).prefetch_related("responses")
    quiz_context = []
    for q in quizzes:
        summary = get_quiz_summary(str(q.id))
        quiz_context.append(f"سوال: {q.prompt} | گزینه صحیح: {q.correct_option_index} | توزیع پاسخ‌ها: {summary['distribution']}")
    quiz_summary_str = "\n".join(quiz_context) if quiz_context else "کوییزی برگزار نشد."

    system_prompt = (
        "شما دستیار ارشد هوش مصنوعی آموزشی مدرسه اندورا (Endoora) هستید. "
        "وظیفه شما بررسی اطلاعات جلسه تدریس آنلاین و تولید یک خلاصه ساختاریافته، جذاب و کاربردی به زبان فارسی "
        "برای دانش‌آموزان است. خروجی باید به صورت یک شیء JSON با کلیدهای زیر باشد:\n"
        "{\n"
        '  "topics_covered": ["مبحث ۱", "مبحث ۲"],\n'
        '  "key_points": ["نکته یا فرمول طلایی ۱", "نکته طلایی ۲"],\n'
        '  "quiz_pitfalls": ["اشتباه پرتکرار دانش‌آموزان در کوییزها و راه حل صحیح"],\n'
        '  "suggested_homework": "شرح تکالیف پیشنهادی برای تسلط بیشتر",\n'
        '  "markdown_summary": "متن مشروح و زیبای خلاصه تدریس با تیتربندی و نکات برجسته به مارک‌داون"\n'
        "}"
    )

    user_prompt = (
        f"اطلاعات جلسه تدریس:\n"
        f"شناسه جلسه: {session_id}\n"
        f"سرفصل‌های کلی: {topics_covered_raw or 'سرفصل تدریس‌شده'}\n"
        f"متون و فرمول‌های استخراج‌شده از تخته: {whiteboard_text or 'فرمول‌ها و دست‌نوشته‌های تخته'}\n"
        f"یادداشت دبیر: {teacher_notes or 'ندارد'}\n"
        f"گفتگوی متنی کلاسی: {chat_logs or 'چت عادی کلاسی'}\n"
        f"آمار کوییزهای کلاسی:\n{quiz_summary_str}\n\n"
        "لطفاً با استانداردهای آموزشی، دقیق‌ترین خلاصه تدریس را در قالب شیء JSON با کلیدهای اعلام‌شده بازگردانید."
    )

    parsed_json = None
    try:
        from ai_gateway.client import OpenRouterClient
        client = OpenRouterClient()
        response = client.chat_completion(
            model="google/gemini-2.5-flash",
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
            max_tokens=2000,
        )
        content = response.get("content", "")
        # Clean markdown codeblocks if wrapped
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        parsed_json = json.loads(content)
    except Exception as exc:
        logger.warning(f"AI Gateway Gemini call failed or unconfigured, using rule-based educational generator: {exc}")
        # Robust fallback using session data
        parsed_json = {
            "topics_covered": [t.strip() for t in (topics_covered_raw or "مباحث کلیدی جلسه تدریس").split(",") if t.strip()],
            "key_points": [
                "مرور و تسلط بر فرمول‌ها و نکات دست‌نویس تخته کلاسی",
                "دقت ویژه به مفاهیم پرتکرار مطرح‌شده در پرسش‌وپاسخ‌های زنده",
            ],
            "quiz_pitfalls": [
                f"تحلیل کوییزهای جلسه: {len(quizzes)} سوال تستی در کلاس بررسی شد. توجه به جزئیات گزینه‌ها ضروری است."
            ],
            "suggested_homework": teacher_notes or "حل تمرین‌های انتهای درس و مرور جزوه PDF تخته‌سیاه.",
            "markdown_summary": (
                f"### خلاصه جلسه تدریس آنلاین ({session_id})\n\n"
                f"**سرفصل‌ها:** {topics_covered_raw or 'بررسی سرفصل‌های مصوب'}\n\n"
                f"**نکات کلیدی:** جزوه دست‌نویس تخته را از بخش دانلودها دریافت کرده و فرمول‌های حل‌شده را مرور نمایید.\n\n"
                f"**تکالیف بعدی:** {teacher_notes or 'حل تمارین کتاب کار و مرور واژگان/فرمول‌ها'}"
            ),
        }

    recap, _ = SessionAiRecap.objects.update_or_create(
        session_id=str(session_id),
        defaults={
            "class_session": class_session,
            "topics_covered": parsed_json.get("topics_covered", []),
            "key_points": parsed_json.get("key_points", []),
            "quiz_pitfalls": parsed_json.get("quiz_pitfalls", []),
            "suggested_homework": parsed_json.get("suggested_homework", ""),
            "raw_markdown": parsed_json.get("markdown_summary", ""),
        },
    )
    return recap

