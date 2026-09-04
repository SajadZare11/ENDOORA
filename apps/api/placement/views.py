import json
from pathlib import Path

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from assessment.models import PlacementResponse
from assessment.services import evaluate_placement_answers, item_key_to_uuid
from questions.models import QuestionVersion
from .models import PlacementAnswer, PlacementSession
from .serializers import (
    PlacementAnswerCreateSerializer,
    PlacementAnswerSerializer,
    PlacementQuestionItemSerializer,
    PlacementSectionAdvanceSerializer,
    PlacementSessionSerializer,
    PlacementSessionSummarySerializer,
)

CORE_ITEMS_PATH = getattr(settings, "REPO_ROOT", Path(__file__).resolve().parents[3]) / "data" / "placement" / "core-items.json"



class PlacementSessionListCreateView(APIView):
    """
    GET /api/placement/sessions/
    Lists all placement sessions belonging to the authenticated learner.

    POST /api/placement/sessions/
    Starts a new placement session or resumes an existing active unexpired session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = PlacementSession.objects.filter(user=request.user)
        for sess in sessions:
            sess.check_expiration()
        serializer = PlacementSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        session, created = PlacementSession.get_or_create_active_session(user=request.user)
        serializer = PlacementSessionSerializer(session)
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=http_status)


class PlacementCurrentSessionView(APIView):
    """
    GET /api/placement/sessions/current/
    Retrieves the currently active unexpired placement session for the authenticated learner.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        active_sessions = PlacementSession.objects.filter(
            user=request.user,
            status=PlacementSession.Status.ACTIVE,
        ).order_by("-started_at")

        for sess in active_sessions:
            if sess.check_expiration():
                continue
            serializer = PlacementSessionSerializer(sess)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"session": None, "detail": "No active session found."}, status=status.HTTP_404_NOT_FOUND)


class PlacementSessionDetailView(APIView):
    """
    GET /api/placement/sessions/<uuid:pk>/
    Retrieves session details. Strictly enforces object-level user ownership.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        session = get_object_or_404(PlacementSession, pk=pk, user=request.user)
        session.check_expiration()
        serializer = PlacementSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlacementAnswerSaveView(APIView):
    """
    POST /api/placement/sessions/<uuid:session_pk>/answers/
    Saves or updates a learner answer idempotently with server timestamps.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_pk):
        session = get_object_or_404(PlacementSession, pk=session_pk, user=request.user)
        session.check_expiration()

        if not session.is_active:
            return Response(
                {
                    "detail": "نشست آزمون فعال نیست یا منقضی شده است.",
                    "code": "session_inactive",
                    "status": session.status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PlacementAnswerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        idempotency_key = data["idempotency_key"]
        question_key = data["question_key"]
        answer_value = data["answer_value"]
        question_version_id = data.get("question_version_id")

        question_version = None
        if question_version_id:
            try:
                question_version = QuestionVersion.objects.filter(pk=question_version_id).first()
            except Exception:
                question_version = None

        # 1. Check idempotency key collision
        existing_by_idem = PlacementAnswer.objects.filter(
            session=session,
            idempotency_key=idempotency_key,
        ).first()
        if existing_by_idem:
            return Response(PlacementAnswerSerializer(existing_by_idem).data, status=status.HTTP_200_OK)

        # 2. Check existing answer for this question in this session (update)
        existing_by_question = PlacementAnswer.objects.filter(
            session=session,
            question_key=question_key,
        ).first()

        if existing_by_question:
            existing_by_question.answer_value = answer_value
            existing_by_question.idempotency_key = idempotency_key
            if question_version:
                existing_by_question.question_version = question_version
            existing_by_question.save(update_fields=["answer_value", "idempotency_key", "question_version", "updated_at"])
            return Response(PlacementAnswerSerializer(existing_by_question).data, status=status.HTTP_200_OK)

        # 3. Create new answer record
        answer = PlacementAnswer.objects.create(
            session=session,
            idempotency_key=idempotency_key,
            question_key=question_key,
            question_version=question_version,
            answer_value=answer_value,
        )
        return Response(PlacementAnswerSerializer(answer).data, status=status.HTTP_201_CREATED)


class PlacementSectionAdvanceView(APIView):
    """
    POST /api/placement/sessions/<uuid:session_pk>/advance/
    Advances the current section of an active placement session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_pk):
        session = get_object_or_404(PlacementSession, pk=session_pk, user=request.user)
        session.check_expiration()

        if not session.is_active:
            return Response(
                {"detail": "نشست فعال نیست یا منقضی شده است.", "code": "session_inactive"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PlacementSectionAdvanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session.current_section = serializer.validated_data["section"]
        session.save(update_fields=["current_section", "updated_at"])

        return Response(PlacementSessionSerializer(session).data, status=status.HTTP_200_OK)


class PlacementSessionSubmitView(APIView):
    """
    POST /api/placement/sessions/<uuid:session_pk>/submit/
    Submits and finalizes an active placement session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_pk):
        session = get_object_or_404(PlacementSession, pk=session_pk, user=request.user)

        if session.status == PlacementSession.Status.SUBMITTED:
            return Response(PlacementSessionSerializer(session).data, status=status.HTTP_200_OK)

        session.check_expiration()
        if session.status == PlacementSession.Status.EXPIRED:
            return Response(
                {"detail": "نشست منقضی شده است و امکان ارسال وجود ندارد.", "code": "session_expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session.status = PlacementSession.Status.SUBMITTED
        session.save(update_fields=["status", "updated_at"])

        # Record learner evidence into PlacementResponse for audit & learning profile
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
                answers_map = {}
                for ans in session.answers.all():
                    val = ans.answer_value
                    if isinstance(val, dict):
                        answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
                    else:
                        answers_map[ans.question_key] = val
                eval_res = evaluate_placement_answers(raw_items, answers_map)
                for ev in eval_res.get("evidence", []):
                    item_id_uuid = item_key_to_uuid(ev["item_id"])
                    raw_val = answers_map.get(ev["item_id"], {})
                    PlacementResponse.objects.update_or_create(
                        user_id=request.user.id,
                        section=ev["section"],
                        item_id=item_id_uuid,
                        defaults={
                            "answer": raw_val if isinstance(raw_val, dict) else {"response": raw_val},
                            "is_correct": ev["is_correct"],
                        },
                    )
            except Exception:
                pass

        return Response(PlacementSessionSerializer(session).data, status=status.HTTP_200_OK)


class PlacementQuestionsView(APIView):
    """
    GET /api/placement/questions/
    Returns learner-safe question items for placement test sections.
    Guarantees that answer keys, rubrics, target keywords, and correct solutions are never exposed.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        section_filter = request.query_params.get("section", "").strip().lower()

        items = []
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_data = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
                for raw_item in raw_data:
                    sec = raw_item.get("section", "").lower()
                    if section_filter and sec != section_filter:
                        continue

                    # Look up question version if available in DB
                    qv = QuestionVersion.objects.filter(
                        status=QuestionVersion.Status.PUBLISHED,
                    ).first()

                    sec_titles_fa = {
                        "grammar": "بخش دستور زبان (Grammar)",
                        "vocabulary": "بخش واژگان (Vocabulary)",
                        "reading": "بخش درک مطلب (Reading)",
                        "listening": "بخش مهارت شنیداری (Listening)",
                        "speaking": "بخش مهارت گفتاری (Speaking)",
                        "writing": "بخش مهارت نگارش (Writing)",
                    }
                    title_fa = sec_titles_fa.get(sec, f"بخش {sec}")

                    is_speaking = sec == "speaking"
                    is_writing = sec == "writing"
                    q_type = "speaking" if is_speaking else ("writing" if is_writing else "single_choice")

                    default_instructions_fa = (
                        "یک گزینه را انتخاب کنید."
                        if not is_speaking and not is_writing
                        else ("صدای خود را ضبط کنید." if is_speaking else "پاسخ نگارشی خود را در کادر متنی بنویسید.")
                    )
                    default_instructions_en = (
                        "Choose one option."
                        if not is_speaking and not is_writing
                        else ("Record your spoken response." if is_speaking else "Compose your written response in the editor.")
                    )

                    # Sanitize: never include correct_option, answer_key, target_keywords, rubric, or audio transcript
                    items.append({
                        "id": raw_item.get("id"),
                        "section": sec,
                        "question_type": q_type,
                        "title_fa": title_fa,
                        "title_en": f"{sec.capitalize()} Section",
                        "prompt_fa": raw_item.get("prompt_fa", "پاسخ دهید."),
                        "prompt_en": raw_item.get("question", ""),
                        "instructions_fa": raw_item.get("instructions_fa", default_instructions_fa),
                        "instructions_en": raw_item.get("instructions_en", default_instructions_en),
                        "cefr_level": raw_item.get("cefr_level", "A1"),
                        "difficulty": raw_item.get("difficulty", "easy"),
                        "passage": raw_item.get("passage", ""),
                        "audio_url": raw_item.get("audio_url", ""),
                        "play_limit": raw_item.get("play_limit", 2),
                        "recording_time_limit_sec": raw_item.get("time_limit_sec", 60),
                        "min_words_expected": raw_item.get("min_words", 10),
                        "max_words_expected": raw_item.get("max_words", 100),
                        "options": raw_item.get("options", []),
                        "question_version_id": qv.id if qv else None,
                    })
            except Exception:
                items = []

        serializer = PlacementQuestionItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlacementSessionSummaryView(APIView):
    """
    GET /api/placement/sessions/<uuid:session_pk>/summary/
    Retrieves section-by-section breakdown (Grammar, Vocabulary, Reading, Listening, Speaking) and learner evidence.
    Enforces strict user isolation (returns 404 for unauthorized users).
    Adheres strictly to Product Constitution Rule #8: avoids premature or definitive CEFR claims.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_pk):
        session = get_object_or_404(PlacementSession, pk=session_pk, user=request.user)
        session.check_expiration()

        raw_items = []
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
            except Exception:
                raw_items = []

        answers_map = {}
        for ans in session.answers.all():
            val = ans.answer_value
            if isinstance(val, dict):
                answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
            else:
                answers_map[ans.question_key] = val

        eval_result = evaluate_placement_answers(raw_items, answers_map)

        is_sub = session.status == PlacementSession.Status.SUBMITTED

        # Redact exact answers from active sessions to avoid leakage before submission
        sections_payload = {}
        for sec_name, sec_data in eval_result.get("sections", {}).items():
            sections_payload[sec_name] = {
                "section": sec_name,
                "total": sec_data["total"],
                "answered": sec_data["answered"],
                "correct": sec_data["correct"] if is_sub else 0,
                "score_percentage": sec_data["score_percentage"] if is_sub else 0.0,
                "objectives_covered": sec_data["objectives_covered"],
            }

        evidence_payload = []
        if is_sub:
            evidence_payload = eval_result.get("evidence", [])

        payload = {
            "session_id": session.id,
            "status": session.status,
            "is_submitted": is_sub,
            "current_section": session.current_section,
            "started_at": session.started_at,
            "expires_at": session.expires_at,
            "is_expired": session.is_expired,
            "total_questions": eval_result.get("total_questions", 0),
            "total_answered": eval_result.get("total_answered", 0),
            "overall_percentage": eval_result.get("overall_percentage") if is_sub else None,
            "estimated_cefr_level": eval_result.get("estimated_cefr_level", "A1") if is_sub else None,
            "sections": sections_payload,
            "evidence": evidence_payload,
            "notice": eval_result.get(
                "notice",
                "این کارنامه یک برآورد آموزشی اولیه بر اساس بخش‌های گرامر، واژگان، درک مطلب، شنیداری، گفتاری و نگارش است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
            ),
        }

        serializer = PlacementSessionSummarySerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)
