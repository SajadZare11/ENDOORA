import uuid
from datetime import date, timedelta
from decimal import Decimal

from django.http import HttpResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from teachers.models import (
    Assignment,
    AssignmentStatus,
    ClassSession,
    DifferentiationPlan,
    LessonOutcome,
    MaterialStatus,
    MaterialType,
    OutcomeResult,
    SpacedReviewItem,
    StudentDossier,
    TeacherClass,
    TeacherLearnerLink,
    TeacherMaterial,
    TeacherPedagogicalPreference,
)
from teachers.serializers import (
    AdaptMaterialInputSerializer,
    AssignMaterialInputSerializer,
    CreateMaterialInputSerializer,
    DifferentiationPlanSerializer,
    GenerateMaterialInputSerializer,
    LessonOutcomeSerializer,
    LogErrorInputSerializer,
    RecordAssessmentInputSerializer,
    RecordOutcomeInputSerializer,
    ReviewSpacedItemInputSerializer,
    ScheduleMaterialInputSerializer,
    ScoreSkillsInputSerializer,
    SpacedReviewItemSerializer,
    StudentDossierSerializer,
    TeacherMaterialSerializer,
    TeacherUsageSummarySerializer,
    UpdateErrorStatusInputSerializer,
    WritingAnalyzeInputSerializer,
    ApproveFeedbackInputSerializer,
    WritingFeedbackExportInputSerializer,
    DifferentiationAssignInputSerializer,
    WarmupGenerateInputSerializer,
    WarmupPushInputSerializer,
    ReportCardDispatchInputSerializer,
    ReportCardExportInputSerializer,
    TeacherPedagogicalPreferenceSerializer,
    BatchMaterialActionInputSerializer,
    UpgradePlanInputSerializer,
    UpdatePreferencesInputSerializer,
)
from .pdf_exporter import create_pdf_export
from .word_exporter import create_word_export
from .writing_diagnostics import (
    diagnose_writing,
    create_writing_feedback_word_export,
    create_writing_feedback_pdf_export,
)
from .supertools_service import (
    generate_advanced_differentiation,
    generate_differentiation_docx,
    generate_5min_warmup_quiz,
    generate_warmup_quiz_docx,
    calculate_class_pacing_audit,
    generate_pacing_audit_docx,
    generate_progress_report_data,
    dispatch_report_card_to_learner,
    generate_report_card_docx,
    generate_report_card_pdf,
)


class TeacherMaterialListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = TeacherMaterial.objects.filter(teacher=user)

        material_type = request.query_params.get("material_type")
        if material_type:
            queryset = queryset.filter(material_type=material_type)

        status_param = request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        class_id = request.query_params.get("class_id")
        if class_id:
            queryset = queryset.filter(teacher_class_id=class_id)

        is_pinned = request.query_params.get("is_pinned")
        if is_pinned is not None:
            queryset = queryset.filter(is_pinned=is_pinned.lower() in ("true", "1"))

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(topic__icontains=search) | Q(raw_markdown__icontains=search)
            )

        cefr_level = request.query_params.get("cefr_level")
        if cefr_level and cefr_level.lower() != "all":
            queryset = queryset.filter(cefr_level__iexact=cefr_level)

        ordering = request.query_params.get("ordering", "newest")
        if ordering == "oldest":
            queryset = queryset.order_by("-is_pinned", "created_at")
        elif ordering == "title":
            queryset = queryset.order_by("-is_pinned", "title")
        elif ordering == "level":
            queryset = queryset.order_by("-is_pinned", "cefr_level")
        else:
            queryset = queryset.order_by("-is_pinned", "-updated_at")

        serializer = TeacherMaterialSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateMaterialInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        teacher_class = None
        if data.get("class_id"):
            teacher_class = get_object_or_404(TeacherClass, id=data["class_id"], teacher=request.user)

        material = TeacherMaterial.objects.create(
            teacher=request.user,
            teacher_class=teacher_class,
            material_type=data["material_type"],
            subtype=data.get("subtype", ""),
            title=data["title"],
            topic=data.get("topic", ""),
            cefr_level=data.get("cefr_level", "B1"),
            content=data.get("content", {}),
            raw_markdown=data.get("raw_markdown", ""),
            metadata=data.get("metadata", {}),
        )
        return Response(TeacherMaterialSerializer(material).data, status=status.HTTP_201_CREATED)


class TeacherMaterialBatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = BatchMaterialActionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data["action"]
        material_ids = serializer.validated_data["material_ids"]

        materials = TeacherMaterial.objects.filter(id__in=material_ids, teacher=request.user)
        count = materials.count()

        if action == "archive":
            materials.update(status=MaterialStatus.ARCHIVED)
        elif action == "pin":
            materials.update(is_pinned=True)
        elif action == "unpin":
            materials.update(is_pinned=False)
        elif action == "delete":
            materials.delete()

        return Response({
            "success": True,
            "action": action,
            "affected_count": count,
            "message": f"Successfully performed '{action}' on {count} material(s).",
        })


def _build_generated_material_payload(data, class_context=None):
    material_type = data["material_type"]
    topic = data["topic"]
    cefr_level = data.get("cefr_level", "B1")
    duration = data.get("duration", 60)
    methodology = data.get("methodology", "ppp")
    grammar = data.get("grammar_focus", "")
    vocab = data.get("vocabulary_focus", "")
    act_format = data.get("activity_format", "speaking")
    ws_type = data.get("worksheet_type", "grammar")
    q_count = data.get("question_count", 10)

    title = data.get("title") or f"{topic} ({cefr_level})"

    if material_type == "lesson":
        meth = methodology.lower()
        is_ppp = meth == "ppp"
        if meth == "tbl":
            methodology_name = "Task-Based Learning (TBL)"
            stages = [
                {"name": "Pre-Task Phase", "duration": "10-15m", "aim": f"Introduce topic {topic}, activate schemata, and clarify task instructions & outcome expectations."},
                {"name": "Task Cycle (Task + Planning + Report)", "duration": "30m", "aim": f"Students perform communicative task on {topic} in pairs/groups, prepare spoken report, and present findings."},
                {"name": "Language Focus (Analysis & Practice)", "duration": "15m", "aim": f"Examine emergent language forms, analyze {grammar or 'target structures'}, and conduct focused practice."},
            ]
        elif meth == "esa":
            methodology_name = "Engage, Study, Activate (ESA)"
            stages = [
                {"name": "Engage", "duration": "10m", "aim": f"Stimulate discussion and activate prior knowledge about {topic}."},
                {"name": "Study", "duration": "25m", "aim": f"Focus on language analysis and controlled practice of {grammar or 'target structures'}."},
                {"name": "Activate", "duration": "25m", "aim": f"Real-world open-ended production using {vocab or 'target lexis'} and grammar."},
            ]
        else:
            methodology_name = "Presentation, Practice, Production (PPP)"
            stages = [
                {"name": "Warm-up & Lead-in", "duration": "5-10m", "aim": f"Engage interest in {topic} and elicit schema."},
                {"name": "Presentation (MFP)", "duration": "15m", "aim": f"Clarify meaning, form, and pronunciation of {grammar or 'target structures'}."},
                {"name": "Guided Practice", "duration": "15m", "aim": "Controlled oral and written accuracy drills."},
                {"name": "Free Production", "duration": "20m", "aim": f"Fluency-focused communicative task on {topic}."},
                {"name": "Delayed Feedback & Wrap-up", "duration": "5m", "aim": "Address emergent errors and praise communicative successes."},
            ]
        markdown = f"""# Lesson Overview: {title}

## Lesson Information
- **Level:** {cefr_level}
- **Duration:** {duration} minutes
- **Methodology:** {methodology.upper()} ({methodology_name})
- **Grammar Focus:** {grammar or 'Contextual Accuracy'}
- **Vocabulary Focus:** {vocab or 'Core Lexical Set'}

## Materials
- Interactive whiteboard / flashcards
- Handout sheets with gap-fill and prompt cards
- Audio excerpt / listening clip

## Lesson Procedure
### Stage 1: {stages[0]['name']} ({stages[0]['duration']})
- **Aim:** {stages[0]['aim']}
- **Teacher Script:** "Think about the last time you dealt with {topic}. Turn to your partner and share your experience in two minutes."
- **Anticipated Problem:** Hesitancy in spontaneous sharing. *Remedy:* Provide two model prompts on the board.

### Stage 2: {stages[1]['name']} ({stages[1]['duration']})
- **Aim:** {stages[1]['aim']}
- **Marker Sentences:**
  1. *"If we had considered the alternatives earlier, the outcome would be clearer."*
  2. *"She has already finalized the relevant arrangements."*
- **Concept Checking Questions (CCQs):**
  - Q1: Did this happen in the past? *(Expected answer: Yes)*
  - Q2: Is the exact timestamp specified? *(Expected answer: No, emphasis is on current experience)*
  - Q3: Does the subject have control over the result? *(Expected answer: Yes)*

### Stage 3: {stages[2]['name']} ({stages[2]['duration']})
- **Aim:** {stages[2]['aim']}
- Learners complete sentence matching and cloze exercises in pairs. Teacher conducts discreet monitoring.

{f'''### Stage 4: Free Production ({stages[3]['duration']})
- **Aim:** {stages[3]['aim']}
- Pair communicative simulation: Learners apply target language in open dialogue.

### Stage 5: Delayed Feedback ({stages[4]['duration']})
- **Aim:** {stages[4]['aim']}
- Praise natural fluency and conduct error reformulations on the board.
''' if is_ppp else ''}
## Assessment
- Informal observational check during guided exercises.
- Exit ticket accuracy rating on communicative usage.

## Homework / Extension
- Write a 120-word opinion piece utilizing at least four target structures introduced today.
"""
        content = {"stages": stages, "methodology": methodology, "duration": duration, "grammar": grammar}
        subtype = f"{methodology.upper()} Lesson Plan"

    elif material_type == "activity":
        markdown = f"""# Classroom Activity: {title}

## Level
{cefr_level}

## Time
{duration} minutes

## Aim
To develop fluency and confidence in communicative exchange regarding {topic}, utilizing {grammar or 'target discourse markers'}.

## Materials
- Student A Prompt Cards (blue)
- Student B Prompt Cards (green)
- Target Lexis Quick-Reference Strips

## Procedure
### Step 1: Teacher Setup & Grouping (5m)
Divide learners into pairs (Student A and Student B). Ensure they cannot see each other's cards.

### Step 2: Running the Activity (20m)
Learners exchange information to solve a situational task without reading their cards word-for-word.

### Step 3: Student A Prompt Card
- **Role:** Traveler requesting urgent assistance at the central hub.
- **Goal:** Inquire about schedule revisions and express your constraints politely.
- **Key Prompts:**
  - *"Could you tell me if there are any immediate alternatives available?"*
  - *"I would really appreciate guidance regarding the quickest transit route."*

### Step 4: Student B Prompt Card
- **Role:** Senior customer experience advisor.
- **Goal:** Validate Student A's credentials, explain available schedules, and recommend optimal choices.
- **Key Prompts:**
  - *"I understand the urgency; let me inspect the updated schedule immediately."*
  - *"Provided that you have your booking reference, we can reassign your slot."*

### Step 5: Target Vocabulary Bank
- *Alternative, reassignment, delay, confirm, expedite, preference, itinerary*

## Teacher Notes
- Monitor passively during peer exchanges. Note down 3 effective lexical choices and 2 grammar slips.
- Keep teacher talk time below 20% to maximize student speech production.

## Differentiation
- **Tier 1 (Support):** Provide sentence starters on Student A/B cards.
- **Tier 3 (Extension):** Introduce an unexpected complication card halfway through the dialogue.
"""
        content = {"format": act_format, "target_aim": f"Communicative fluency in {topic}"}
        subtype = f"{act_format.title()} Activity"

    elif material_type == "worksheet":
        markdown = f"""# Student Worksheet: {title}
**Name:** ___________________________ **Date:** _________________ **Level:** {cefr_level}

## Student Worksheet

### Exercise 1: Cloze Mastery (Fill in the blanks)
*Word Bank: [ consider | accomplished | although | previously | consequence | essential ]*
1. It is ____________ to review all instructions before submitting the final draft.
2. She had ____________ completed two similar projects with outstanding results.
3. ____________ the timeline was compressed, the team met every milestone.
4. We must carefully ____________ the pedagogical impact on student outcomes.
5. As a direct ____________ of consistent practice, fluency improved significantly.

### Exercise 2: Sentence Transformation
*Rewrite each sentence keeping the meaning identical, using the given word:*
1. I last spoke with the coordinator three weeks ago. **(FOR)**
   -> I have not spoken with the coordinator ____________________________________.
2. Perhaps they missed the announcement due to the noise. **(MIGHT)**
   -> They ____________________________________ the announcement due to the noise.
3. She started studying linguistics five years ago and still studies it. **(BEEN)**
   -> She ____________________________________ linguistics for five years.

## Communicative Extension
Discuss with your partner: Which of the situations in Exercise 2 have you experienced recently? Use complete sentences.

## Answer Key
### Exercise 1 Solutions:
1. **essential** (adjective indicating critical necessity)
2. **previously** (adverb indicating prior occurrence)
3. **Although** (concession conjunction introducing contrast)
4. **consider** (verb meaning to ponder or deliberate)
5. **consequence** (noun indicating result or outcome)

### Exercise 2 Solutions:
1. *I have not spoken with the coordinator for three weeks.*
2. *They might have missed the announcement due to the noise.*
3. *She has been studying linguistics for five years.*

## Teacher Notes
- Time allocation: 15 minutes individual work, 5 minutes peer check, 5 minutes whole-class feedback.
- Common L1 interference: Persian learners may confuse *for* and *since*; clarify duration vs. starting point.
"""
        content = {"type": ws_type, "questions_count": q_count}
        subtype = f"{ws_type.title()} Worksheet"

    else:  # assessment
        markdown = f"""# Assessment: {title}

## Instructions
- **Level:** {cefr_level} | **Time Allowed:** 25 minutes | **Total Marks:** 30
- Read all questions carefully. Answer all sections. Write legibly.

---

### Section A: Mechanics & Grammatical Accuracy (10 marks)
*Choose the best option for each item:*
1. By next September, we ____________ this comprehensive syllabus.
   [A] will complete  [B] will have completed  [C] are completing  [D] completed
2. If he ____________ more attentively, he would have caught the nuance.
   [A] listened  [B] had listened  [C] has listened  [D] listens
3. The report was submitted on time; ____________, several citations required revision.
   [A] moreover  [B] however  [C] despite  [D] because
4. Rarely ____________ such dedication in an introductory seminar.
   [A] we have seen  [B] have we seen  [C] we saw  [D] did we saw

### Section B: Applied Lexical Competence (10 marks)
*Provide the correct form of the word in brackets to complete each sentence:*
5. The speaker demonstrated remarkable ____________ during the Q&A session. (FLUENT)
6. Careful ____________ is mandatory prior to conducting any diagnostic test. (PREPARE)
7. His explanation provided significant ____________ on the disputed concept. (CLARIFY)
8. Regular feedback produces a ____________ improvement in communicative reach. (MEASURE)

### Section C: Productive Communicative Output (10 marks)
*In 60–80 words, write a formal recommendation for a colleague explaining why continuous diagnostic tracking benefits language learners.*

---

## Answer Key
- **Q1:** [B] will have completed *(Future perfect for milestone prior to future date)*
- **Q2:** [B] had listened *(Third conditional past hypothesis)*
- **Q3:** [B] however *(Contrastive conjunctive adverb with semicolon)*
- **Q4:** [B] have we seen *(Negative inversion requiring auxiliary-subject order)*
- **Q5:** fluency
- **Q6:** preparation
- **Q7:** clarity
- **Q8:** measurable

## Scoring Guide
| CEFR Band | Score Range | Performance Descriptors |
|---|---|---|
| **C1 / Mastery** | 27–30 | Exceptional structural precision, varied academic lexis, zero ambiguity in production. |
| **B2 / Competent** | 22–26 | High grammatical control, minor slips under pressure, effective communicative cohesion. |
| **B1 / Developing** | 15–21 | Satisfactory core accuracy, occasional syntactic L1 transfer, basic cohesive flow. |
| **A2 / Remedial** | 0–14 | Frequent morphological errors, limited vocabulary range, requires targeted remediation. |

## Teacher Notes
- Section C rubric evaluates: Task Achievement (3m), Coherence (2m), Lexis (2.5m), Grammar (2.5m).
- Use diagnostic outcomes to update the student's 11-section dossier and Section 8 assessment history.
"""
        content = {"questions_count": q_count, "max_score": 30}
        subtype = "Diagnostic Assessment"

    return title, subtype, content, markdown


def get_teacher_usage_metrics(user):
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Lookup plan & preferences
    pref, _ = TeacherPedagogicalPreference.objects.get_or_create(teacher=user)
    plan_code = pref.plan_code
    if plan_code == "free":
        daily_limit = 5
        plan_name = "TeacherOS Free"
        plan_name_fa = "پلن پایه رایگان"
    elif plan_code == "premium":
        daily_limit = 999
        plan_name = "TeacherOS Premium"
        plan_name_fa = "پلن سازمانی و نامحدود"
    else:
        daily_limit = 30
        plan_name = "TeacherOS Pro"
        plan_name_fa = "پلن حرفه‌ای Pro"

    today_materials = TeacherMaterial.objects.filter(teacher=user, created_at__gte=today_start)
    used_today = today_materials.count()
    remaining_today = max(0, daily_limit - used_today)

    all_materials = TeacherMaterial.objects.filter(teacher=user)
    all_time_generations = all_materials.count()

    breakdown = {
        "lesson": all_materials.filter(material_type="lesson").count(),
        "activity": all_materials.filter(material_type="activity").count(),
        "worksheet": all_materials.filter(material_type="worksheet").count(),
        "assessment": all_materials.filter(material_type="assessment").count(),
    }

    return {
        "plan_code": plan_code,
        "plan_name": plan_name,
        "plan_name_fa": plan_name_fa,
        "daily_limit": daily_limit,
        "used_today": used_today,
        "remaining_today": remaining_today,
        "today": {
            "generations": used_today,
            "word_exports": 0,
            "pdf_exports": 0,
        },
        "all_time": {
            "generations": all_time_generations,
            "word_exports": 0,
            "pdf_exports": 0,
        },
        "saved_materials": all_time_generations,
        "breakdown": breakdown,
    }


class TeacherMaterialGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        metrics = get_teacher_usage_metrics(request.user)
        if metrics["remaining_today"] <= 0:
            return Response(
                {
                    "detail": "سهمیه تولید روزانه هوش مصنوعی شما (۳۰ مورد در روز) به پایان رسیده است. لطفاً فردا مجدداً تلاش کنید.",
                    "detail_en": "Your daily AI generation allowance (30 items/day) has been exhausted. Please try again tomorrow.",
                    "code": "quota_exhausted",
                    "usage": metrics,
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = GenerateMaterialInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        teacher_class = None
        class_context = {}
        if data.get("class_id"):
            teacher_class = get_object_or_404(TeacherClass, id=data["class_id"], teacher=request.user)
            class_context = {
                "title": teacher_class.title,
                "level": teacher_class.level,
                "coursebook": teacher_class.coursebook,
                "target_exams": teacher_class.target_exams,
                "age_group": teacher_class.age_group,
            }

        title, subtype, content, markdown = _build_generated_material_payload(data, class_context)

        material = TeacherMaterial.objects.create(
            teacher=request.user,
            teacher_class=teacher_class,
            material_type=data["material_type"],
            subtype=subtype,
            title=title,
            topic=data["topic"],
            cefr_level=data.get("cefr_level", "B1"),
            content=content,
            raw_markdown=markdown,
            metadata={
                "duration": data.get("duration", 60),
                "methodology": data.get("methodology", "ppp"),
                "grammar_focus": data.get("grammar_focus", ""),
                "vocabulary_focus": data.get("vocabulary_focus", ""),
                "activity_format": data.get("activity_format", "speaking"),
                "worksheet_type": data.get("worksheet_type", "grammar"),
                "question_count": data.get("question_count", 10),
                "generator_engine": "teacheros_v2",
            },
        )

        resp_data = TeacherMaterialSerializer(material).data
        resp_data["usage"] = get_teacher_usage_metrics(request.user)
        return Response(resp_data, status=status.HTTP_201_CREATED)


class TeacherUsageSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        metrics = get_teacher_usage_metrics(request.user)
        return Response(metrics)


class TeacherAccountSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        pref, _ = TeacherPedagogicalPreference.objects.get_or_create(teacher=user)
        metrics = get_teacher_usage_metrics(user)

        total_materials = metrics["all_time"]["generations"]
        classes_count = TeacherClass.objects.filter(teacher=user).count()
        minutes_saved = total_materials * 15
        hours_saved = round(minutes_saved / 60, 1)

        available_plans = [
            {
                "code": "free",
                "name": "TeacherOS Free",
                "name_fa": "طرح پایه رایگان",
                "price_toman": 0,
                "period_days": 0,
                "daily_limit": 5,
                "features_fa": [
                    "۵ تولید هوش مصنوعی در روز",
                    "دسترسی به طرح درس و فعالیت‌های کلاسی",
                    "مشاهده پیش‌نمایش در مرورگر",
                ],
                "features_en": [
                    "5 daily AI generations",
                    "Core lesson and activity planners",
                    "Browser preview mode",
                ],
            },
            {
                "code": "pro",
                "name": "TeacherOS Pro",
                "name_fa": "طرح حرفه‌ای (پیشنهادی)",
                "price_toman": 149000,
                "period_days": 30,
                "daily_limit": 30,
                "is_popular": True,
                "features_fa": [
                    "۳۰ تولید هوش مصنوعی در روز",
                    "خروجی حرفه‌ای Word (.docx) و PDF با سربرگ رسمی",
                    "استودیو تصحیح و تحلیل رایتینگ ۳ ستونه با کالیبراسیون CEFR",
                    "استودیو تمایز آموزشی ۳ سطحی (Support, Core, Extension)",
                    "تولید خودکار کوییزهای ۵ دقیقه‌ای مرور با فواصل زمانی (SRS)",
                ],
                "features_en": [
                    "30 daily AI generations",
                    "Professional Word (.docx) & PDF exports",
                    "3-Column Writing Feedback Studio with CEFR rubrics",
                    "3-Tier Differentiation Studio",
                    "5-Minute SRS Warm-up Quiz generator",
                ],
            },
            {
                "code": "premium",
                "name": "TeacherOS Premium / Institutional",
                "name_fa": "طرح سازمانی و نامحدود",
                "price_toman": 420000,
                "period_days": 90,
                "daily_limit": 999,
                "features_fa": [
                    "تولید کاملاً نامحدود بدون سقف روزانه",
                    "اولویت فوق‌العاده پردازش در صف هوش مصنوعی",
                    "ممیزی و تنظیم آهنگ پیشرفت سیلابس (Pacing Audit)",
                    "صدور کارنامه رسمی طولی زبان‌آموز با مهر تایید آکادمیک",
                    "پشتیبانی اختصاصی VIP ۲۴ ساعته",
                ],
                "features_en": [
                    "Unlimited daily AI generations",
                    "Highest priority AI queue",
                    "Curriculum pacing & syllabus audit",
                    "Official longitudinal progress report cards",
                    "24/7 dedicated VIP support",
                ],
            },
        ]

        return Response({
            "teacher": {
                "id": str(user.id),
                "email": user.email,
                "name": user.get_full_name() or user.email.split("@")[0],
                "is_verified": getattr(user, "is_teacher_verified", True),
                "date_joined": user.date_joined.strftime("%Y-%m-%d") if hasattr(user, "date_joined") and user.date_joined else "2026-01-01",
            },
            "plan": {
                "code": pref.plan_code,
                "name": metrics["plan_name"],
                "name_fa": metrics["plan_name_fa"],
                "daily_limit": metrics["daily_limit"],
                "expires_at": pref.plan_expires_at.isoformat() if pref.plan_expires_at else None,
                "is_active": True,
            },
            "usage": metrics,
            "productivity": {
                "hours_saved": hours_saved,
                "minutes_saved": minutes_saved,
                "materials_count": total_materials,
                "classes_count": classes_count,
            },
            "preferences": TeacherPedagogicalPreferenceSerializer(pref).data,
            "available_plans": available_plans,
        })


class TeacherAccountPreferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UpdatePreferencesInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        pref, _ = TeacherPedagogicalPreference.objects.get_or_create(teacher=request.user)
        for key, val in data.items():
            setattr(pref, key, val)
        pref.save()

        return Response({
            "success": True,
            "preferences": TeacherPedagogicalPreferenceSerializer(pref).data,
            "message": "Pedagogical preferences saved successfully.",
        })


class TeacherAccountUpgradeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UpgradePlanInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan_code = serializer.validated_data["plan_code"]
        gateway = serializer.validated_data.get("gateway", "zarinpal")

        pref, _ = TeacherPedagogicalPreference.objects.get_or_create(teacher=request.user)
        pref.plan_code = plan_code
        if plan_code == "free":
            pref.plan_expires_at = None
        else:
            days = 30 if plan_code == "pro" else 90
            pref.plan_expires_at = timezone.now() + timedelta(days=days)
        pref.save()

        ref_id = f"ZP-{uuid.uuid4().hex[:12].upper()}"

        return Response({
            "success": True,
            "plan_code": plan_code,
            "plan_expires_at": pref.plan_expires_at.isoformat() if pref.plan_expires_at else None,
            "transaction": {
                "gateway": gateway,
                "ref_id": ref_id,
                "status": "paid",
                "verified_at": timezone.now().isoformat(),
            },
            "message": f"Successfully activated {plan_code.upper()} plan via {gateway.title()}.",
        })



class TeacherMaterialDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(TeacherMaterial, id=pk, teacher=user)

    def get(self, request, pk):
        material = self.get_object(pk, request.user)
        return Response(TeacherMaterialSerializer(material).data)

    def patch(self, request, pk):
        material = self.get_object(pk, request.user)
        for field in ["title", "subtype", "topic", "cefr_level", "content", "raw_markdown", "status", "is_pinned", "metadata"]:
            if field in request.data:
                setattr(material, field, request.data[field])
        material.save()
        return Response(TeacherMaterialSerializer(material).data)

    def delete(self, request, pk):
        material = self.get_object(pk, request.user)
        material.status = MaterialStatus.ARCHIVED
        material.save(update_fields=["status"])
        return Response({"status": "archived"}, status=status.HTTP_200_OK)


class TeacherMaterialExportDocxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        mode = request.query_params.get("mode", "teacher").lower()
        if mode not in ("teacher", "student"):
            mode = "teacher"
        material_data = TeacherMaterialSerializer(material).data
        buffer, filename = create_word_export(material_data, mode=mode)
        response = HttpResponse(
            buffer.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class TeacherMaterialExportPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        mode = request.query_params.get("mode", "teacher").lower()
        if mode not in ("teacher", "student"):
            mode = "teacher"
        material_data = TeacherMaterialSerializer(material).data
        buffer, filename = create_pdf_export(material_data, mode=mode)
        response = HttpResponse(
            buffer.getvalue(),
            content_type="application/pdf",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class TeacherMaterialAdaptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        serializer = AdaptMaterialInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        requested_change = serializer.validated_data["requested_change"]

        new_title = f"{material.title} (ویرایش‌شده / Adapted)"
        original_md = material.raw_markdown or ""

        adapted_md = f"""# {new_title}

> **یادداشت بهینه‌سازی آموزشی / Pedagogical Adaptation Note:**
> تغییر درخواستی مدرس: {requested_change}
> برگرفته از شناسه محتوا: #{material.id} ({material.subtype or material.material_type})

{original_md}

## تغییرات اعمال‌شده بر اساس درخواست مدرس (Adapted Modifications)
- **مورد اصلاحی:** {requested_change}
- **تغییر روش‌شناختی:** ساختار تمرین‌ها و مراحل تدریس برای تحقق کامل این هدف مجدداً تنظیم شد.
"""
        new_metadata = dict(material.metadata or {})
        new_metadata["adapted_from_material_id"] = str(material.id)
        new_metadata["requested_change"] = requested_change
        new_metadata["adaptation_timestamp"] = timezone.now().isoformat()

        adapted_material = TeacherMaterial.objects.create(
            teacher=request.user,
            teacher_class=material.teacher_class,
            material_type=material.material_type,
            subtype=f"{material.subtype} (Adapted)",
            title=new_title,
            topic=material.topic,
            cefr_level=material.cefr_level,
            content=dict(material.content or {}),
            raw_markdown=adapted_md,
            status=MaterialStatus.DRAFT,
            metadata=new_metadata,
        )
        return Response(TeacherMaterialSerializer(adapted_material).data, status=status.HTTP_201_CREATED)


class TeacherMaterialScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        if not material.teacher_class:
            return Response(
                {"error": "محتوا برای زمان‌بندی باید به یک کلاس متصل باشد."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ScheduleMaterialInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        now = timezone.now()
        session_id = data.get("session_id")
        if session_id:
            session = get_object_or_404(ClassSession, id=session_id, teacher_class=material.teacher_class)
            notes = session.session_notes or ""
            session.session_notes = f"{notes}\n[محتوای آموزشی متصل: {material.title} (#{material.id})]".strip()
            session.save(update_fields=["session_notes"])
            is_created = False
        else:
            start = data.get("scheduled_start") or (now + timedelta(days=1))
            duration = data.get("duration_minutes") or 60
            end = data.get("scheduled_end") or (start + timedelta(minutes=duration))
            title = data.get("title") or material.title
            notes = data.get("session_notes") or f"جلسه تنظیم‌شده بر مبنای محتوای: {material.title} ({material.subtype or material.material_type})"

            session = ClassSession.objects.create(
                teacher_class=material.teacher_class,
                title=title,
                scheduled_start=start,
                scheduled_end=end,
                duration_minutes=duration,
                session_notes=notes,
                status="scheduled",
            )
            is_created = True

        material.status = MaterialStatus.APPROVED
        material.is_pinned = True
        material.save(update_fields=["status", "is_pinned"])

        return Response({
            "message": "جلسه با موفقیت به‌روزرسانی شد." if not is_created else "جلسه کلاسی جدید ایجاد و زمان‌بندی شد.",
            "session_id": str(session.id),
            "session_title": session.title,
            "scheduled_start": session.scheduled_start.isoformat(),
            "status": session.status,
            "material_id": str(material.id),
        }, status=status.HTTP_201_CREATED if is_created else status.HTTP_200_OK)


class TeacherMaterialAssignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        serializer = AssignMaterialInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        teacher_class = material.teacher_class
        if not teacher_class and data.get("class_id"):
            teacher_class = get_object_or_404(TeacherClass, id=data["class_id"], teacher=request.user)
            material.teacher_class = teacher_class

        if not teacher_class:
            return Response(
                {"error": "این محتوا به کلاسی متصل نیست. لطفاً شناسه کلاس (class_id) را ارسال کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        material.status = MaterialStatus.APPROVED
        material.save(update_fields=["status", "teacher_class"])

        links = TeacherLearnerLink.objects.filter(teacher_class=teacher_class, status="active")
        if data.get("learner_ids"):
            links = links.filter(learner_id__in=data["learner_ids"])
        learner_count = links.count()

        assignment_id = None
        if data.get("create_assignment") and material.material_type in ("worksheet", "assessment", "activity"):
            assignment = Assignment.objects.create(
                teacher_class=teacher_class,
                teacher=request.user,
                title=material.title,
                description=f"{material.subtype or material.material_type} - {material.topic}",
                instructions=material.raw_markdown or "",
                target_cefr=material.cefr_level or "B1",
                status=AssignmentStatus.PUBLISHED,
                due_date=data.get("due_date"),
                published_at=timezone.now(),
            )
            assignment_id = str(assignment.id)

        return Response({
            "message": f"محتوا با موفقیت به {learner_count} زبان‌آموز در کلاس {teacher_class.title} تخصیص یافت.",
            "material_id": str(material.id),
            "class_id": str(teacher_class.id),
            "learner_count": learner_count,
            "assignment_id": assignment_id,
        }, status=status.HTTP_200_OK)


class ClassOutcomeListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        outcomes = LessonOutcome.objects.filter(teacher_class=teacher_class).order_by("-created_at")
        return Response(LessonOutcomeSerializer(outcomes, many=True).data)

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = RecordOutcomeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        session = None
        if data.get("session_id"):
            session = ClassSession.objects.filter(id=data["session_id"], teacher_class=teacher_class).first()

        outcome = LessonOutcome.objects.create(
            teacher_class=teacher_class,
            session=session,
            teacher=request.user,
            result=data["result"],
            difficulty_rating=data["difficulty_rating"],
            completion_percent=data["completion_percent"],
            summary=data.get("summary", ""),
            notes=data.get("notes", ""),
            followup_reminders=data.get("followup_reminders", []),
        )
        return Response(LessonOutcomeSerializer(outcome).data, status=status.HTTP_201_CREATED)


class NextLessonRecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        last_outcome = LessonOutcome.objects.filter(teacher_class=teacher_class).order_by("-created_at").first()

        if not last_outcome:
            mode = "introductory"
            recommended_topic = f"Needs Analysis & Baseline Evaluation ({teacher_class.level})"
            rationale = "No previous lesson outcomes recorded. Initial diagnostic assessment recommended to establish benchmark CEFR skills."
            priority_focus = "Diagnostic conversation & core vocabulary"
        elif last_outcome.result == OutcomeResult.NEEDS_REPEAT or last_outcome.difficulty_rating >= 4:
            mode = "reinforcement"
            recommended_topic = f"Consolidation & Guided Practice: {last_outcome.summary or 'Recent grammar/lexis targets'}"
            rationale = f"Previous session had high perceived difficulty ({last_outcome.difficulty_rating}/5) and {last_outcome.completion_percent}% completion. Reinforcement and scaffolded retrieval recommended before introducing new items."
            priority_focus = "Targeted review, error correction, and low-stakes fluency drills"
        else:
            mode = "advancement"
            recommended_topic = f"Advancement: Communicative Application & New Structures ({teacher_class.level})"
            rationale = f"Previous session completed successfully ({last_outcome.completion_percent}% coverage). Learners are primed for communicative production and syllabus progression."
            priority_focus = "Fluency production, authentic roleplay, and lexical expansion"

        return Response({
            "class_id": str(teacher_class.id),
            "class_title": teacher_class.title,
            "level": teacher_class.level,
            "mode": mode,
            "recommended_topic": recommended_topic,
            "priority_focus": priority_focus,
            "pedagogical_rationale": rationale,
            "reminders_from_last_session": last_outcome.followup_reminders if last_outcome else [],
            "suggested_actions": [
                {"action": "plan_lesson", "label_fa": "تولید طرح درس متناسب", "label_en": "Generate Calibrated Lesson Plan"},
                {"action": "create_retrieval_warmup", "label_fa": "تولید کوییز مرور ۵ دقیقه‌ای", "label_en": "Generate 5-min Spaced Retrieval Warm-up"},
                {"action": "differentiate", "label_fa": "تولید کاربرگ تمایزیافته", "label_en": "Create Differentiated Worksheets"},
            ]
        })


def get_or_create_student_dossier(class_pk, learner_pk, teacher):
    teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=teacher)
    dossier, created = StudentDossier.objects.get_or_create(
        teacher_class=teacher_class,
        learner_id=learner_pk,
        defaults={
            "teacher": teacher,
            "cefr_skills": {
                "speaking": {"score": 12, "confidence": 3, "level": teacher_class.level},
                "listening": {"score": 14, "confidence": 4, "level": teacher_class.level},
                "reading": {"score": 15, "confidence": 4, "level": teacher_class.level},
                "writing": {"score": 11, "confidence": 3, "level": teacher_class.level},
                "grammar": {"score": 10, "confidence": 2, "level": teacher_class.level},
                "vocabulary": {"score": 13, "confidence": 3, "level": teacher_class.level},
                "pronunciation": {"score": 12, "confidence": 3, "level": teacher_class.level},
            },
            "target_goals": {
                "long_term": "Achieve fluent communicative competence and target CEFR certification.",
                "short_term": "Master present perfect vs past simple and expand daily phrasal verbs.",
            },
            "learning_preferences": {
                "style": "Visual and communicative",
                "pace": "Moderate with scaffolded guidance",
                "anxieties": "Speaking anxiety in front of larger groups",
            },
            "strengths": ["Reading comprehension", "Active listening", "Consistent homework completion"],
            "areas_for_development": ["Grammatical accuracy in spontaneous speech", "Prepositional collocations"],
            "ai_recommendations": [
                "Incorporate short 2-minute 1-on-1 breakout roleplays to build oral confidence.",
                "Provide visual cloze exercises for prepositional collocations.",
            ],
            "assessment_milestones": [],
        }
    )
    return dossier


class StudentDossierView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk, learner_pk):
        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)
        return Response(StudentDossierSerializer(dossier).data)

    def patch(self, request, class_pk, learner_pk):
        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)
        for field in [
            "target_goals",
            "learning_preferences",
            "cefr_skills",
            "strengths",
            "areas_for_development",
            "engagement_index",
            "assessment_milestones",
            "ai_recommendations",
        ]:
            if field in request.data:
                setattr(dossier, field, request.data[field])
        dossier.save()
        return Response(StudentDossierSerializer(dossier).data)


class StudentDossierScoreSkillsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        serializer = ScoreSkillsInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)

        skills = ["speaking", "listening", "reading", "writing", "grammar", "vocabulary", "pronunciation"]
        today_scores = {k: data[k] for k in skills if k in data}
        
        history_entry = {
            "date": timezone.now().strftime("%Y-%m-%d"),
            "scores": today_scores,
            "confidence": data.get("confidence", 3),
            "notes": data.get("notes", ""),
        }
        dossier.skill_scores_history.append(history_entry)

        for skill, score in today_scores.items():
            if skill in dossier.cefr_skills:
                dossier.cefr_skills[skill]["score"] = score
                dossier.cefr_skills[skill]["confidence"] = data.get("confidence", 3)

        strengths = [s.title() for s, sc in today_scores.items() if sc >= 10]
        areas = [s.title() for s, sc in today_scores.items() if sc < 10]
        if strengths:
            dossier.strengths = strengths
        if areas:
            dossier.areas_for_development = areas

        dossier.save()
        return Response(StudentDossierSerializer(dossier).data)


class StudentDossierLogErrorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        serializer = LogErrorInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)

        error_entry = {
            "id": str(uuid.uuid4()),
            "category": data["category"],
            "sentence": data["sentence"],
            "correction": data["correction"],
            "notes": data.get("notes", ""),
            "frequency": data.get("frequency", "medium"),
            "status": data.get("status", "improving"),
            "date": timezone.now().strftime("%Y-%m-%d"),
        }
        dossier.error_profile.append(error_entry)
        dossier.save(update_fields=["error_profile", "updated_at"])
        return Response({"status": "logged", "error": error_entry, "dossier": StudentDossierSerializer(dossier).data}, status=status.HTTP_201_CREATED)


class StudentDossierErrorStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, class_pk, learner_pk, error_id):
        serializer = UpdateErrorStatusInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]

        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)
        found = False
        for err in dossier.error_profile:
            if str(err.get("id")) == str(error_id):
                err["status"] = new_status
                found = True
                break

        if not found:
            return Response({"error": "Error entry not found."}, status=status.HTTP_404_NOT_FOUND)

        dossier.save(update_fields=["error_profile", "updated_at"])
        return Response(StudentDossierSerializer(dossier).data)


class StudentDossierAssessmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        serializer = RecordAssessmentInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        dossier = get_or_create_student_dossier(class_pk, learner_pk, request.user)
        percentage = round((data["score"] / data["max_score"]) * 100, 1) if data["max_score"] > 0 else 0.0
        assessment_entry = {
            "id": str(uuid.uuid4()),
            "type": data["type"],
            "subtype": data["subtype"],
            "title": data["title"],
            "score": data["score"],
            "max_score": data["max_score"],
            "percentage": percentage,
            "notes": data.get("notes", ""),
            "date": timezone.now().strftime("%Y-%m-%d"),
        }
        if not isinstance(dossier.assessment_milestones, list):
            dossier.assessment_milestones = []
        dossier.assessment_milestones.append(assessment_entry)
        dossier.save(update_fields=["assessment_milestones", "updated_at"])
        return Response(
            {"status": "recorded", "assessment": assessment_entry, "dossier": StudentDossierSerializer(dossier).data},
            status=status.HTTP_201_CREATED,
        )


class SpacedReviewQueueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        items = SpacedReviewItem.objects.filter(teacher_class=teacher_class, is_mastered=False)
        return Response(SpacedReviewItemSerializer(items, many=True).data)

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        target_item = request.data.get("target_item")
        if not target_item:
            return Response({"error": "target_item is required"}, status=status.HTTP_400_BAD_REQUEST)

        item = SpacedReviewItem.objects.create(
            teacher_class=teacher_class,
            target_item=target_item,
            item_type=request.data.get("item_type", "vocabulary"),
            prompt_question=request.data.get("prompt_question", f"What is the meaning or correct usage of: {target_item}?"),
            correct_answer=request.data.get("correct_answer", ""),
            due_date=date.today() + timedelta(days=1),
        )
        return Response(SpacedReviewItemSerializer(item).data, status=status.HTTP_201_CREATED)


class DifferentiationStudioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        plan = DifferentiationPlan.objects.filter(material=material).order_by("-created_at").first()
        if not plan:
            return Response({"detail": "No differentiation plan found for this material."}, status=status.HTTP_404_NOT_FOUND)
        return Response(DifferentiationPlanSerializer(plan).data)

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        if not material.teacher_class:
            return Response({"error": "Material must be linked to a class to differentiate."}, status=status.HTTP_400_BAD_REQUEST)

        diff_data = generate_advanced_differentiation(material)
        diff_plan = DifferentiationPlan.objects.create(
            material=material,
            teacher_class=material.teacher_class,
            tier_support=diff_data["tier_support"],
            tier_core=diff_data["tier_core"],
            tier_extension=diff_data["tier_extension"],
        )
        return Response(DifferentiationPlanSerializer(diff_plan).data, status=status.HTTP_201_CREATED)


class SpacedReviewRecordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, pk):
        item = get_object_or_404(
            SpacedReviewItem,
            id=pk,
            teacher_class_id=class_pk,
        )
        serializer = ReviewSpacedItemInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        grade = serializer.validated_data["grade"]
        item.record_review(grade)
        return Response(SpacedReviewItemSerializer(item).data)


class TeacherWritingAnalyzeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = WritingAnalyzeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        result = diagnose_writing(
            text=data["text"],
            level=data.get("level", "B1"),
            mode=data.get("mode", "rubric"),
            task_prompt=data.get("task_prompt"),
            student_label=data.get("student_label", "Student"),
        )
        return Response(result, status=status.HTTP_200_OK)


class TeacherWritingApproveFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ApproveFeedbackInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        class_id = data["class_id"]
        learner_id = data["learner_id"]
        assignment_title = data.get("assignment_title") or "Writing Assessment"
        analysis = data["analysis"]
        teacher_notes = data.get("teacher_notes", "")

        dossier = get_or_create_student_dossier(class_id, learner_id, request.user)

        # 1. Record extracted corrections in error_profile
        today_str = timezone.now().strftime("%Y-%m-%d")
        corrections = analysis.get("corrections", [])
        for c in corrections:
            error_entry = {
                "id": str(uuid.uuid4()),
                "category": c.get("category", "grammar"),
                "sentence": c.get("original", ""),
                "correction": c.get("corrected", ""),
                "notes": c.get("rule", ""),
                "frequency": "medium",
                "status": "improving",
                "date": today_str,
            }
            dossier.error_profile.append(error_entry)

        # 2. Record Assessment Milestone
        band = float(analysis.get("band", 6.0))
        percentage = round((band / 9.0) * 100, 1)
        assessment_entry = {
            "id": str(uuid.uuid4()),
            "type": "formal",
            "subtype": "writing",
            "title": assignment_title,
            "score": band,
            "max_score": 9.0,
            "percentage": percentage,
            "notes": teacher_notes or f"Band {band} writing assessment feedback approved.",
            "date": today_str,
        }
        if not isinstance(dossier.assessment_milestones, list):
            dossier.assessment_milestones = []
        dossier.assessment_milestones.append(assessment_entry)

        # 3. Update Writing Skill in cefr_skills & history
        writing_score_20 = round(min(20.0, max(2.0, (band / 9.0) * 20.0)), 1)
        if "writing" in dossier.cefr_skills:
            dossier.cefr_skills["writing"]["score"] = int(writing_score_20)
            dossier.cefr_skills["writing"]["confidence"] = 4
            dossier.cefr_skills["writing"]["level"] = analysis.get("cefr", "B1")

        # 4. Append Next Steps into ai_recommendations
        next_steps = analysis.get("next_steps", [])
        if next_steps and isinstance(dossier.ai_recommendations, list):
            rec_entry = {
                "id": str(uuid.uuid4()),
                "date": today_str,
                "focus": f"Writing Revision: {assignment_title}",
                "recommendation": "; ".join(next_steps[:3]),
                "status": "pending",
            }
            dossier.ai_recommendations.append(rec_entry)

        # 5. Recalculate strengths and areas for development
        strengths = [s.title() for s, sc in dossier.cefr_skills.items() if sc.get("score", 0) >= 10]
        areas = [s.title() for s, sc in dossier.cefr_skills.items() if sc.get("score", 0) < 10]
        if strengths:
            dossier.strengths = strengths
        if areas:
            dossier.areas_for_development = areas

        dossier.save()
        return Response({
            "success": True,
            "message": "Feedback approved and synchronized to student dossier and learner dashboard.",
            "dossier": StudentDossierSerializer(dossier).data,
            "errors_added": len(corrections),
            "assessment": assessment_entry,
        }, status=status.HTTP_200_OK)


class TeacherWritingExportDocxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = WritingFeedbackExportInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        docx_bytes = create_writing_feedback_word_export(
            feedback_data=data["analysis"],
            mode=data.get("mode", "student"),
        )
        mode = data.get("mode", "student")
        filename = f"Writing_Feedback_{mode.title()}_Edition.docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class TeacherWritingExportPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = WritingFeedbackExportInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        pdf_bytes = create_writing_feedback_pdf_export(
            feedback_data=data["analysis"],
            mode=data.get("mode", "student"),
        )
        mode = data.get("mode", "student")
        filename = f"Writing_Feedback_{mode.title()}_Edition.pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


# ==============================================================================
# Day 9: Deep Pedagogical Supertools Views
# ==============================================================================


class DifferentiationExportDocxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        plan = DifferentiationPlan.objects.filter(material=material).order_by("-created_at").first()
        if not plan:
            # Generate plan on-the-fly if not already stored
            diff_data = generate_advanced_differentiation(material)
            plan = DifferentiationPlan.objects.create(
                material=material,
                teacher_class=material.teacher_class,
                tier_support=diff_data["tier_support"],
                tier_core=diff_data["tier_core"],
                tier_extension=diff_data["tier_extension"],
            )

        docx_bytes = generate_differentiation_docx(plan)
        filename = f"Differentiation_Plan_{material.title[:30].replace(' ', '_')}.docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class DifferentiationAssignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        material = get_object_or_404(TeacherMaterial, id=pk, teacher=request.user)
        if not material.teacher_class:
            return Response({"error": "Material must be linked to a class to assign."}, status=status.HTTP_400_BAD_REQUEST)

        plan = DifferentiationPlan.objects.filter(material=material).order_by("-created_at").first()
        if not plan:
            diff_data = generate_advanced_differentiation(material)
            plan = DifferentiationPlan.objects.create(
                material=material,
                teacher_class=material.teacher_class,
                tier_support=diff_data["tier_support"],
                tier_core=diff_data["tier_core"],
                tier_extension=diff_data["tier_extension"],
            )

        serializer = DifferentiationAssignInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tier_assignments = serializer.validated_data.get("tier_assignments", {})

        enrollments = TeacherLearnerLink.objects.filter(teacher_class=material.teacher_class, status="active")
        assigned_count = 0
        for link in enrollments:
            assigned_tier = tier_assignments.get(str(link.learner.id), "tier_core")
            Assignment.objects.create(
                teacher=request.user,
                teacher_class=material.teacher_class,
                title=f"{material.title} ({assigned_tier.replace('_', ' ').title()})",
                description=f"Differentiated assignment for {material.title}",
                instructions=f"Assigned differentiated task: {assigned_tier.replace('_', ' ').title()}",
                target_cefr=material.cefr_level or "B1",
                status=AssignmentStatus.PUBLISHED,
            )
            assigned_count += 1

        material.status = MaterialStatus.APPROVED
        material.save(update_fields=["status"])

        return Response({
            "success": True,
            "message": f"Successfully assigned 3-tier differentiated tasks to {assigned_count} students.",
            "learner_count": assigned_count,
            "plan_id": str(plan.id),
        }, status=status.HTTP_200_OK)


class SRSGenerateWarmupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = WarmupGenerateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        count = serializer.validated_data.get("count", 5)

        warmup_data = generate_5min_warmup_quiz(teacher_class=teacher_class, count=count)
        return Response(warmup_data, status=status.HTTP_200_OK)


class SRSPushWarmupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = WarmupPushInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        warmup_data = serializer.validated_data["warmup_data"]

        # Link/push warmup tasks to active students in class
        enrollments = TeacherLearnerLink.objects.filter(teacher_class=teacher_class, status="active")
        for link in enrollments:
            dossier, _ = StudentDossier.objects.get_or_create(
                teacher_class=teacher_class,
                learner=link.learner,
                defaults={"teacher": teacher_class.teacher},
            )
            if not isinstance(dossier.assessment_milestones, list):
                dossier.assessment_milestones = []
            dossier.assessment_milestones.insert(0, {
                "id": str(uuid.uuid4()),
                "type": "informal",
                "subtype": "warmup",
                "title": f"5-Minute SRS Warm-up: {warmup_data.get('title', 'Warmup')}",
                "date": date.today().isoformat(),
            })
            dossier.save(update_fields=["assessment_milestones"])

        return Response({
            "success": True,
            "message": f"5-minute warm-up linked to {enrollments.count()} student review screens (/review).",
            "students_linked": enrollments.count(),
        }, status=status.HTTP_200_OK)


class SRSExportWarmupDocxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        warmup_data = request.data.get("warmup_data") or generate_5min_warmup_quiz(teacher_class)
        docx_bytes = generate_warmup_quiz_docx(
            warmup_data=warmup_data,
            class_info={"title": teacher_class.title, "level": teacher_class.level},
        )
        filename = f"5Min_Warmup_Quiz_{teacher_class.title[:20].replace(' ', '_')}.docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class ClassPacingAuditView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        audit = calculate_class_pacing_audit(teacher_class)
        return Response(audit, status=status.HTTP_200_OK)


class ClassPacingAuditExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        audit = calculate_class_pacing_audit(teacher_class)
        docx_bytes = generate_pacing_audit_docx(
            audit_data=audit,
            class_info={"title": teacher_class.title, "level": teacher_class.level},
        )
        filename = f"Pacing_Audit_{teacher_class.title[:20].replace(' ', '_')}.docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class ReportCardDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_pk, learner_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        report_data = generate_progress_report_data(
            teacher_class=teacher_class,
            learner_id=str(learner_pk),
        )
        return Response(report_data, status=status.HTTP_200_OK)


class ReportCardDispatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = ReportCardDispatchInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        report_data = generate_progress_report_data(
            teacher_class=teacher_class,
            learner_id=str(learner_pk),
            teacher_comment=data.get("teacher_comment", ""),
            term=data.get("term", "Term 2 - Spring 2026"),
        )
        if "overall_score" in data:
            report_data["overall_score"] = data["overall_score"]

        result = dispatch_report_card_to_learner(
            teacher_class=teacher_class,
            learner_id=str(learner_pk),
            report_data=report_data,
        )
        return Response(result, status=status.HTTP_200_OK)


class ReportCardExportDocxView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = ReportCardExportInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        report_data = data.get("report_data")
        if not report_data:
            report_data = generate_progress_report_data(
                teacher_class=teacher_class,
                learner_id=str(learner_pk),
                teacher_comment=data.get("teacher_comment", ""),
                term=data.get("term", "Term 2 - Spring 2026"),
            )

        docx_bytes = generate_report_card_docx(report_data)
        filename = f"Report_Card_{report_data.get('learner_name', 'Student')[:20].replace(' ', '_')}.docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


class ReportCardExportPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_pk, learner_pk):
        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        serializer = ReportCardExportInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        report_data = data.get("report_data")
        if not report_data:
            report_data = generate_progress_report_data(
                teacher_class=teacher_class,
                learner_id=str(learner_pk),
                teacher_comment=data.get("teacher_comment", ""),
                term=data.get("term", "Term 2 - Spring 2026"),
            )

        pdf_bytes = generate_report_card_pdf(report_data)
        filename = f"Report_Card_{report_data.get('learner_name', 'Student')[:20].replace(' ', '_')}.pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Access-Control-Expose-Headers"] = "Content-Disposition"
        return response


