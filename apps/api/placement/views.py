import json
import uuid
from pathlib import Path

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from assessment.models import PlacementResponse
from assessment.services import item_key_to_uuid, evaluate_placement_answers
from questions.models import QuestionVersion
from .models import PlacementAnswer, PlacementResult, PlacementSession
from .scoring import (
    estimate_theta_rasch,
    endoora_index_to_cefr,
    score_section,
    theta_to_endoora_index,
    get_cefr_description,
)
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

        for session in active_sessions:
            if session.is_expired:
                session.status = PlacementSession.Status.EXPIRED
                session.save(update_fields=["status", "updated_at"])
            else:
                serializer = PlacementSessionSerializer(session)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"detail": "هیچ نشست فعالی یافت نشد.", "code": "no_active_session"},
            status=status.HTTP_404_NOT_FOUND,
        )


class PlacementSessionDetailView(APIView):
    """
    GET /api/placement/sessions/<uuid:session_pk>/
    Retrieves details of a specific placement session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None, session_pk=None):
        actual_pk = pk or session_pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)
        session.check_expiration()
        serializer = PlacementSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlacementAnswerListCreateView(APIView):
    """
    GET /api/placement/sessions/<uuid:session_pk>/answers/
    Lists all answers recorded for a placement session.

    POST /api/placement/sessions/<uuid:session_pk>/answers/
    Records or idempotently updates an answer for a specific question key.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_pk=None, pk=None):
        actual_pk = session_pk or pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)
        answers = session.answers.all()
        serializer = PlacementAnswerSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, session_pk=None, pk=None):
        actual_pk = session_pk or pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)
        session.check_expiration()

        if not session.is_active:
            return Response(
                {"detail": "نشست فعال نیست یا منقضی شده است.", "code": "session_inactive"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PlacementAnswerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question_key = serializer.validated_data["question_key"]
        question_version_id = serializer.validated_data.get("question_version_id")
        answer_value = serializer.validated_data["answer_value"]
        idempotency_key = serializer.validated_data["idempotency_key"]

        question_version = None
        if question_version_id:
            try:
                question_version = QuestionVersion.objects.get(pk=question_version_id)
            except QuestionVersion.DoesNotExist:
                pass

        answer, created = PlacementAnswer.objects.update_or_create(
            session=session,
            question_key=question_key,
            defaults={
                "idempotency_key": idempotency_key,
                "question_version": question_version,
                "answer_value": answer_value,
            },
        )
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(PlacementAnswerSerializer(answer).data, status=http_status)


PlacementAnswerSaveView = PlacementAnswerListCreateView


class PlacementSectionAdvanceView(APIView):
    """
    POST /api/placement/sessions/<uuid:session_pk>/advance/
    Advances the section of an active placement session, persists in-flight answers,
    samples subsequent adaptive items, and handles final test conclusion.
    """
    permission_classes = [permissions.IsAuthenticated]

    SECTION_SEQUENCE = ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"]
    SECTION_DURATIONS = {
        "grammar": 900,
        "vocabulary": 900,
        "reading": 720,
        "listening": 600,
        "speaking": 600,
        "writing": 600,
    }
    SECTION_ITEM_COUNTS = {
        "grammar": 15,
        "vocabulary": 15,
        "reading": 5,
        "listening": 5,
        "speaking": 5,
        "writing": 5,
    }

    def post(self, request, session_pk=None, pk=None):
        actual_pk = session_pk or pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)
        session.check_expiration()

        if session.status == PlacementSession.Status.SUBMITTED:
            return Response(
                {"detail": "نشست قبلاً ارسال شده است.", "code": "session_completed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not session.is_active:
            return Response(
                {"detail": "نشست فعال نیست یا منقضی شده است.", "code": "session_inactive"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PlacementSectionAdvanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vdata = serializer.validated_data

        target_section = vdata.get("section")
        curr_section_input = vdata.get("current_section")
        answers_payload = vdata.get("answers")

        # 1. Persist unsaved intermediate answers if present
        if answers_payload:
            self._persist_answers(session, answers_payload)

        # 2. Determine Next Section
        curr_sec = (curr_section_input or session.current_section or "grammar").strip().lower()
        if target_section:
            norm_target = target_section.strip().lower()
            if norm_target in self.SECTION_SEQUENCE:
                next_section = norm_target
            elif norm_target in ("completed", "finish", "review"):
                next_section = "completed"
            else:
                next_section = norm_target
        else:
            if curr_sec in self.SECTION_SEQUENCE:
                idx = self.SECTION_SEQUENCE.index(curr_sec)
                if idx < len(self.SECTION_SEQUENCE) - 1:
                    next_section = self.SECTION_SEQUENCE[idx + 1]
                else:
                    next_section = "completed"
            else:
                next_section = "vocabulary"

        # 3. Test Completion Transition
        if next_section == "completed":
            session.status = PlacementSession.Status.SUBMITTED
            session.current_section = "completed"
            session.completed_at = timezone.now()
            session.save(update_fields=["status", "current_section", "completed_at", "updated_at"])

            self._compute_and_save_result(session, request.user)

            return Response(
                {
                    "id": session.id,
                    "current_section": "completed",
                    "next_section": "completed",
                    "next_section_duration_seconds": 0,
                    "questions": [],
                    "session_status": "completed",
                    "status": session.status,
                    "is_active": session.is_active,
                    "is_expired": session.is_expired,
                    "completed_at": session.completed_at.isoformat() if session.completed_at else None,
                    "started_at": session.started_at,
                    "expires_at": session.expires_at,
                    "answers_count": session.answers_count,
                },
                status=status.HTTP_200_OK,
            )

        # 4. Active Section Advance
        duration = self.SECTION_DURATIONS.get(next_section, 600)
        session.current_section = next_section
        session.section_started_at = timezone.now()
        session.section_time_remaining_sec = duration

        sampled_questions = self._sample_next_section_items(session, next_section, request.user)

        session.save(
            update_fields=[
                "current_section",
                "section_started_at",
                "section_time_remaining_sec",
                "assigned_item_ids",
                "updated_at",
            ]
        )

        return Response(
            {
                "id": session.id,
                "current_section": session.current_section,
                "next_section": next_section,
                "next_section_duration_seconds": duration,
                "questions": sampled_questions,
                "session_status": "in_progress",
                "status": session.status,
                "is_active": session.is_active,
                "is_expired": session.is_expired,
                "completed_at": None,
                "started_at": session.started_at,
                "expires_at": session.expires_at,
                "answers_count": session.answers_count,
            },
            status=status.HTTP_200_OK,
        )

    def _persist_answers(self, session, answers_payload):
        if isinstance(answers_payload, dict):
            items_to_save = answers_payload.items()
        elif isinstance(answers_payload, list):
            items_to_save = [
                (itm.get("question_key"), itm.get("answer_value"))
                for itm in answers_payload if isinstance(itm, dict)
            ]
        else:
            return

        for q_key, ans_val in items_to_save:
            if not q_key or ans_val is None:
                continue
            PlacementAnswer.objects.update_or_create(
                session=session,
                question_key=str(q_key),
                defaults={
                    "answer_value": ans_val if isinstance(ans_val, dict) else {"selected_option": ans_val},
                    "idempotency_key": uuid.uuid4(),
                },
            )

    def _sample_next_section_items(self, session, section: str, user) -> list[dict]:
        if not CORE_ITEMS_PATH.is_file():
            return []
        try:
            raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
        except Exception:
            return []

        assigned_ids = set(getattr(session, "assigned_item_ids", []) or [])

        # Exclude retakes from prior user sessions if available
        prior_ids = set()
        prior_sessions = PlacementSession.objects.filter(user=user).exclude(pk=session.pk)
        for ps in prior_sessions:
            for pid in getattr(ps, "assigned_item_ids", []) or []:
                prior_ids.add(pid)

        sec_items = [
            itm for itm in raw_items
            if itm.get("section", "").lower() == section and itm.get("id") not in assigned_ids
        ]

        fresh_items = [itm for itm in sec_items if itm.get("id") not in prior_ids]
        candidate_pool = fresh_items if len(fresh_items) >= self.SECTION_ITEM_COUNTS.get(section, 5) else sec_items
        if not candidate_pool:
            candidate_pool = [itm for itm in raw_items if itm.get("section", "").lower() == section]

        target_theta = self._estimate_running_theta(session, raw_items)
        candidate_pool.sort(key=lambda itm: abs(float(itm.get("difficulty_b", 0.0)) - target_theta))

        quota = self.SECTION_ITEM_COUNTS.get(section, 5)
        selected = candidate_pool[:quota]

        # Update session assigned IDs
        new_ids = [itm.get("id") for itm in selected if itm.get("id")]
        current_assigned = list(getattr(session, "assigned_item_ids", []) or [])
        for nid in new_ids:
            if nid not in current_assigned:
                current_assigned.append(nid)
        session.assigned_item_ids = current_assigned

        qview = PlacementQuestionsView()
        return [qview._sanitize_item(itm) for itm in selected]

    def _estimate_running_theta(self, session, raw_items) -> float:
        answers_map = {}
        for ans in session.answers.all():
            val = ans.answer_value
            if isinstance(val, dict):
                answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
            else:
                answers_map[ans.question_key] = val

        if not answers_map:
            return 0.0

        responses_for_irt = []
        item_by_id = {itm.get("id"): itm for itm in raw_items if itm.get("id")}
        for q_key, user_resp in answers_map.items():
            itm = item_by_id.get(q_key)
            if not itm:
                continue
            is_corr = str(user_resp).strip().lower() == str(itm.get("correct_option") or itm.get("answer_key", "")).strip().lower()
            responses_for_irt.append({
                "item_id": q_key,
                "is_correct": is_corr,
                "difficulty_b": float(itm.get("difficulty_b", 0.0)),
                "discrimination_a": float(itm.get("discrimination_a", 1.0)),
            })

        if not responses_for_irt:
            return 0.0
        theta, _ = estimate_theta_rasch(responses_for_irt)
        return theta

    def _compute_and_save_result(self, session, user):
        if not CORE_ITEMS_PATH.is_file():
            return None
        try:
            raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
        except Exception:
            return None

        answers_map = {}
        answers_raw_map = {}
        for ans in session.answers.all():
            val = ans.answer_value
            answers_raw_map[ans.question_key] = val
            if isinstance(val, dict):
                answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
            else:
                answers_map[ans.question_key] = val

        eval_res = evaluate_placement_answers(raw_items, answers_raw_map)
        evidence_by_id = {ev["item_id"]: ev for ev in eval_res.get("evidence", [])}

        item_by_id = {itm.get("id"): itm for itm in raw_items if itm.get("id")}
        responses_for_irt = []
        for q_key, user_resp in answers_map.items():
            itm = item_by_id.get(q_key)
            if not itm:
                continue
            ev = evidence_by_id.get(q_key)
            if ev is not None:
                is_corr = ev["is_correct"]
            else:
                is_corr = str(user_resp).strip().lower() == str(itm.get("correct_option") or itm.get("answer_key", "")).strip().lower()

            responses_for_irt.append({
                "item_id": q_key,
                "section": itm.get("section", "grammar"),
                "is_correct": is_corr,
                "difficulty_b": float(itm.get("difficulty_b", 0.0)),
                "discrimination_a": float(itm.get("discrimination_a", 1.0)),
            })
            # Persist to PlacementResponse audit log
            try:
                PlacementResponse.objects.update_or_create(
                    user_id=user.id,
                    section=itm.get("section", "grammar"),
                    item_id=item_key_to_uuid(q_key),
                    defaults={
                        "answer": {"response": user_resp},
                        "is_correct": is_corr,
                    },
                )
            except Exception:
                pass

        theta, se = estimate_theta_rasch(responses_for_irt)

        # Calculate section breakdown across all 6 competencies
        sections = ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"]
        subscores = {}
        section_scores = []
        for sec in sections:
            sec_res = [r for r in responses_for_irt if r.get("section") == sec]
            if sec_res:
                s_corr = sum(1 for r in sec_res if r["is_correct"])
                pct = round((s_corr / len(sec_res)) * 100, 1)
                s_idx = round(pct)
                s_cefr = endoora_index_to_cefr(s_idx)
                subscores[sec] = {
                    "total": len(sec_res),
                    "correct": s_corr,
                    "percentage": pct,
                    "endoora_index": s_idx,
                    "cefr_level": s_cefr,
                }
                section_scores.append(pct)
            else:
                subscores[sec] = {
                    "total": 0,
                    "correct": 0,
                    "percentage": 0.0,
                    "endoora_index": 0,
                    "cefr_level": "A1",
                }
                section_scores.append(0.0)

        # Final Endoora Placement Index and CEFR level are strictly the arithmetic average of the 6 skills
        endoora_idx = round(sum(section_scores) / len(section_scores)) if section_scores else 0
        cefr = endoora_index_to_cefr(endoora_idx)

        cefr_meta = get_cefr_description(cefr)
        can_dos = [{"statement": d} for d in cefr_meta.get("can_do_descriptors", [])] if isinstance(cefr_meta.get("can_do_descriptors"), list) else []
        recs = [{"title": b} for b in cefr_meta.get("recommended_books", [])] if isinstance(cefr_meta.get("recommended_books"), list) else []

        res, _ = PlacementResult.objects.update_or_create(
            session=session,
            defaults={
                "user": user,
                "theta": theta,
                "standard_error": se,
                "endoora_index": endoora_idx,
                "cefr_level": cefr,
                "skill_subscores": subscores,
                "can_do_statements": can_dos,
                "curriculum_recommendations": recs,
            },
        )
        return res


class PlacementSessionSubmitView(APIView):
    """
    POST /api/placement/sessions/<uuid:session_pk>/submit/
    Submits and finalizes an active placement session.
    Computes Rasch latent ability theta, authentic 0-100 Endoora Placement Index,
    CEFR placement, and persists PlacementResult.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_pk=None, pk=None):
        actual_pk = session_pk or pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)

        if session.status == PlacementSession.Status.SUBMITTED:
            return Response(PlacementSessionSerializer(session).data, status=status.HTTP_200_OK)

        session.check_expiration()
        if session.status == PlacementSession.Status.EXPIRED:
            return Response(
                {"detail": "نشست منقضی شده است و امکان ارسال وجود ندارد.", "code": "session_expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session.status = PlacementSession.Status.SUBMITTED
        session.completed_at = timezone.now()
        session.save(update_fields=["status", "completed_at", "updated_at"])

        adv_view = PlacementSectionAdvanceView()
        adv_view._compute_and_save_result(session, request.user)

        return Response(PlacementSessionSerializer(session).data, status=status.HTTP_200_OK)


class PlacementQuestionsView(APIView):
    """
    GET /api/placement/questions/
    Returns learner-safe question items for placement test sections.
    Supports dynamic CAT sampling by ability theta and non-repetition.
    """
    permission_classes = [permissions.IsAuthenticated]

    SECTION_ITEM_COUNTS = {
        "grammar": 15,
        "vocabulary": 15,
        "reading": 5,
        "listening": 5,
        "speaking": 5,
        "writing": 5,
    }

    def get(self, request):
        section_filter = request.query_params.get("section", "").strip().lower()
        session_id = request.query_params.get("session_id")
        theta_param = request.query_params.get("theta")

        items = []
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_data = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
            except Exception:
                raw_data = []

            # If section filter is specified, perform adaptive sampling
            if section_filter:
                filtered = [itm for itm in raw_data if str(itm.get("section", "")).lower() == section_filter]
                session = None
                if session_id:
                    try:
                        session = PlacementSession.objects.get(pk=session_id, user=request.user)
                    except PlacementSession.DoesNotExist:
                        pass

                assigned_ids = set()
                if session and hasattr(session, "assigned_item_ids"):
                    assigned_ids = set(session.assigned_item_ids or [])

                unassigned = [itm for itm in filtered if itm.get("id") not in assigned_ids]
                pool = unassigned if unassigned else filtered

                # Sort by distance to theta
                try:
                    target_theta = float(theta_param) if theta_param is not None else 0.0
                except (ValueError, TypeError):
                    target_theta = 0.0

                pool.sort(key=lambda itm: abs(float(itm.get("difficulty_b", 0.0)) - target_theta))
                quota = self.SECTION_ITEM_COUNTS.get(section_filter, len(pool))
                selected = pool[:quota]

                if session and hasattr(session, "assigned_item_ids"):
                    new_ids = [itm.get("id") for itm in selected if itm.get("id")]
                    cur = list(session.assigned_item_ids or [])
                    for nid in new_ids:
                        if nid not in cur:
                            cur.append(nid)
                    session.assigned_item_ids = cur
                    session.save(update_fields=["assigned_item_ids", "updated_at"])

                items = [self._sanitize_item(itm) for itm in selected]
            else:
                items = [self._sanitize_item(itm) for itm in raw_data]

        serializer = PlacementQuestionItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _sanitize_item(self, item: dict) -> dict:
        """
        Strips answer keys, rubrics, target keywords, and transcripts from learner payload.
        Maps internal schema keys to learner-facing API field names.
        """
        exclude_keys = {
            "correct_option",
            "correct_options",
            "answer_key",
            "accepted_variants",
            "rubric",
            "target_keywords",
            "transcript",
            "audio_script",
            "solution",
            "explanation",
            "model_answer",
        }
        res = {k: v for k, v in item.items() if k not in exclude_keys}

        sec = str(item.get("section", "")).lower()
        if "prompt" in item and not res.get("prompt_en"):
            res["prompt_en"] = item["prompt"]
        if "question" in item and not res.get("prompt_en"):
            res["prompt_en"] = item["question"]
        if "title" in item and not res.get("title_en"):
            res["title_en"] = item["title"]

        # Ensure min_words_expected and max_words_expected are present and accurate
        if "min_words" in item:
            res["min_words_expected"] = int(item["min_words"])
        elif "min_words_expected" not in res:
            res["min_words_expected"] = 15 if sec == "writing" else 10

        if "max_words" in item:
            res["max_words_expected"] = int(item["max_words"])
        elif "max_words_expected" not in res:
            res["max_words_expected"] = 60 if sec == "writing" else 100

        if "time_limit_sec" in item:
            res["recording_time_limit_sec"] = int(item["time_limit_sec"])
        elif "recording_time_limit_sec" not in res:
            res["recording_time_limit_sec"] = 60

        return res


class PlacementSessionSummaryView(APIView):
    """
    GET /api/placement/sessions/<uuid:session_pk>/summary/
    Retrieves the diagnostic summary report for a placement session.
    Calculates 1-PL Rasch latent ability theta, 0-100 Endoora Placement Index,
    CEFR placement, Can-Do descriptors, and curriculum textbook recommendations.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_pk=None, pk=None):
        actual_pk = session_pk or pk
        session = get_object_or_404(PlacementSession, pk=actual_pk, user=request.user)
        session.check_expiration()

        raw_items = []
        if CORE_ITEMS_PATH.is_file():
            try:
                raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
            except Exception:
                raw_items = []

        answers_map = {}
        answers_raw_map = {}
        for ans in session.answers.all():
            val = ans.answer_value
            answers_raw_map[ans.question_key] = val
            if isinstance(val, dict):
                answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
            else:
                answers_map[ans.question_key] = val

        item_by_id = {itm.get("id"): itm for itm in raw_items if itm.get("id")}
        responses_for_irt = []
        evidence_list = []

        eval_res = evaluate_placement_answers(raw_items, answers_raw_map)
        evidence_by_id = {ev["item_id"]: ev for ev in eval_res.get("evidence", [])}

        for q_key, user_resp in answers_map.items():
            itm = item_by_id.get(q_key)
            if not itm:
                continue
            ev = evidence_by_id.get(q_key)
            if ev is not None:
                is_corr = ev["is_correct"]
            else:
                is_corr = str(user_resp).strip().lower() == str(itm.get("correct_option") or itm.get("answer_key", "")).strip().lower()

            responses_for_irt.append({
                "item_id": q_key,
                "section": itm.get("section", "grammar"),
                "is_correct": is_corr,
                "difficulty_b": float(itm.get("difficulty_b", 0.0)),
                "discrimination_a": float(itm.get("discrimination_a", 1.0)),
            })
            evidence_list.append({
                "item_id": q_key,
                "section": itm.get("section", "grammar"),
                "is_correct": is_corr,
                "cefr_level": itm.get("cefr_level", "A1"),
            })

        is_sub = session.status == PlacementSession.Status.SUBMITTED

        # Retrieve or compute psychometric results
        res = getattr(session, "result", None)
        if res:
            theta = res.theta
            se = res.standard_error
            endoora_idx = res.endoora_index
            cefr = res.cefr_level
            skill_subscores = res.skill_subscores or {}
            can_dos = res.can_do_statements or []
            recs = res.curriculum_recommendations or []
        else:
            if responses_for_irt:
                theta, se = estimate_theta_rasch(responses_for_irt)
                endoora_idx = theta_to_endoora_index(theta)
                cefr = endoora_index_to_cefr(endoora_idx)
            else:
                theta, se = 0.0, 1.0
                endoora_idx = 0
                cefr = "A1"
            skill_subscores = {}
            cefr_meta = get_cefr_description(cefr)
            can_dos = [{"statement": d} for d in cefr_meta.get("can_do_descriptors", [])] if isinstance(cefr_meta.get("can_do_descriptors"), list) else []
            recs = [{"title": b} for b in cefr_meta.get("recommended_books", [])] if isinstance(cefr_meta.get("recommended_books"), list) else []

        # Section summaries across all 6 skills
        sections_payload = {}
        all_sections = ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"]
        sec_scores = []
        for sec in all_sections:
            sec_res = [r for r in responses_for_irt if r.get("section") == sec]
            sub = skill_subscores.get(sec, {})
            tot = len(sec_res) or sub.get("total", 0)
            corr = sum(1 for r in sec_res if r["is_correct"]) if is_sub else 0
            pct = round(corr / tot * 100, 1) if tot > 0 else 0.0
            sec_idx = sub.get("endoora_index", round(pct)) if (is_sub and tot > 0) else 0
            sec_cefr = sub.get("cefr_level", endoora_index_to_cefr(sec_idx)) if (is_sub and tot > 0) else "A1"
            sec_scores.append(pct)
            sections_payload[sec] = {
                "section": sec,
                "total": tot,
                "answered": len(sec_res),
                "correct": corr,
                "score_percentage": pct,
                "endoora_index": sec_idx,
                "cefr_level": sec_cefr,
                "objectives_covered": [f"توالی تطبیقی {sec}"],
            }

        total_questions = len(session.assigned_item_ids) if session.assigned_item_ids else 50
        total_answered = len(answers_map)
        if is_sub:
            avg_score = round(sum(sec_scores) / len(sec_scores), 1) if sec_scores else 0.0
            endoora_idx = round(avg_score)
            cefr = endoora_index_to_cefr(endoora_idx)
            overall_pct = avg_score
        else:
            overall_pct = None

        payload = {
            "session_id": session.id,
            "status": session.status,
            "is_submitted": is_sub,
            "current_section": session.current_section,
            "started_at": session.started_at,
            "expires_at": session.expires_at,
            "completed_at": session.completed_at if is_sub else None,
            "is_expired": session.is_expired,
            "total_questions": total_questions,
            "total_answered": total_answered,
            "overall_percentage": overall_pct if is_sub else None,
            "endoora_index": endoora_idx if is_sub else None,
            "theta": round(theta, 3) if is_sub else None,
            "standard_error": round(se, 3) if is_sub else None,
            "estimated_cefr_level": cefr if is_sub else None,
            "sections": sections_payload,
            "evidence": evidence_list if is_sub else [],
            "can_do_statements": can_dos if is_sub else [],
            "curriculum_recommendations": recs if is_sub else [],
            "notice": "این کارنامه یک برآورد علمی روان‌سنجی بر اساس چارچوب CEFR در سامانه سنجش اختصاصی اندورا است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
        }

        serializer = PlacementSessionSummarySerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)
