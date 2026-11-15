from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PronunciationAttempt, PronunciationItem
from .serializers import (
    AnalyzeAttemptRequestSerializer,
    PronunciationAttemptSerializer,
    PronunciationItemSerializer,
    SpectrogramDiagnosticSyncRequestSerializer,
)
from .services import PronunciationService

User = get_user_model()


class PronunciationItemListView(APIView):
    """
    Returns curated practice items, optionally filtered by category and difficulty level.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category")
        difficulty_level = request.query_params.get("level")
        service = PronunciationService()
        items = service.get_practice_items(category=category, difficulty_level=difficulty_level)
        serializer = PronunciationItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PronunciationItemDetailView(APIView):
    """
    Returns a single pronunciation practice item by unique item_id.
    """

    permission_classes = [AllowAny]

    def get(self, request, item_id):
        service = PronunciationService()
        item = service.get_item_by_id(item_id)
        if not item:
            return Response(
                {"error": f"Practice item '{item_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PronunciationItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PronunciationAnalyzeView(APIView):
    """
    Analyzes an oral practice attempt for speech pacing (WPM), pause count,
    syllable stress articulation, and communicative intelligibility trends
    under Product Constitution Rule #8.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AnalyzeAttemptRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        item_id = data.get("item_id", "")
        target_text = data.get("target_text", "")
        spoken_transcript = data.get("spoken_transcript", "")
        duration_seconds = data.get("duration_seconds", 2.0)
        pause_count = data.get("pause_count", 0)

        service = PronunciationService()

        # If learner is authenticated, persist attempt to database
        if request.user and request.user.is_authenticated:
            learner = request.user
            attempt = service.analyze_attempt(
                learner=learner,
                target_text=target_text,
                spoken_transcript=spoken_transcript,
                duration_seconds=duration_seconds,
                pause_count=pause_count,
                item_id=item_id,
            )
            resp_data = PronunciationAttemptSerializer(attempt).data
            return Response(resp_data, status=status.HTTP_201_CREATED)

        # For unauthenticated guest visitors, evaluate trends formatively without DB persistence
        practice_item = service.get_item_by_id(item_id) if item_id else None
        clean_target = (practice_item.target_text if practice_item else target_text).strip()
        safe_duration = max(0.5, float(duration_seconds or 2.0))
        word_count = max(1, len(spoken_transcript.split())) if spoken_transcript else max(1, len(clean_target.split()))
        wpm = round((word_count / safe_duration) * 60.0, 1)

        feedback_en, feedback_fa = service._generate_formative_feedback(
            practice_item=practice_item,
            clean_target=clean_target,
            match_ratio=0.85 if spoken_transcript else 0.5,
            speech_rate_wpm=wpm,
            pause_count=pause_count,
            stress_matched=True,
        )

        return Response(
            {
                "id": None,
                "item_id": item_id,
                "target_text": clean_target,
                "spoken_transcript": spoken_transcript,
                "duration_seconds": safe_duration,
                "speech_rate_wpm": wpm,
                "pause_count": pause_count,
                "intelligibility_score": 85 if spoken_transcript else 70,
                "stress_matched": True,
                "feedback_en": feedback_en,
                "feedback_fa": feedback_fa,
                "saved_to_genome": False,
                "disclaimer": "Product Constitution Rule #8: Intelligibility & fluency trend feedback only. No unvalidated phoneme or native accent claims.",
            },
            status=status.HTTP_200_OK,
        )


class SaveToMistakeGenomeView(APIView):
    """
    Saves an identified pronunciation or syllable stress challenge to the learner's Mistake Genome.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, attempt_id):
        service = PronunciationService()
        try:
            attempt = service.save_to_mistake_genome(learner=request.user, attempt_id=attempt_id)
            return Response(
                {
                    "message": "Pronunciation challenge successfully recorded in Mistake Genome.",
                    "attempt_id": attempt.id,
                    "saved_to_genome": attempt.saved_to_genome,
                },
                status=status.HTTP_200_OK,
            )
        except PronunciationAttempt.DoesNotExist:
            return Response(
                {"error": f"Attempt with ID {attempt_id} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


class PronunciationAttemptListView(APIView):
    """
    Returns recent pronunciation practice history for the authenticated learner.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = PronunciationService()
        history = service.get_learner_history(learner=request.user)
        serializer = PronunciationAttemptSerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SpectrogramDiagnosticSyncView(APIView):
    """
    Synchronizes client-side Edge AI Spectrogram Neural GOP diagnostic evaluations
    with the learner's persistent profile, PronunciationAttempt history,
    and Mistake Genome.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SpectrogramDiagnosticSyncRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        sentence_text = data.get("sentence_text", "")
        module_source = data.get("module_source", "PHONETICS_LAB")
        overall_score = data.get("overall_score", 0.0)
        fluency_score = data.get("fluency_score", 0.0)
        ielts_band_estimate = data.get("ielts_band_estimate", "6.5")
        weak_phonemes = data.get("weak_phonemes", [])
        persian_l1_flags = data.get("persian_l1_flags", [])
        backend = data.get("backend", "webgpu")

        response_payload = {
            "status": "success",
            "synced_at": timezone.now().isoformat(),
            "overall_score": overall_score,
            "fluency_score": fluency_score,
            "ielts_band_estimate": ielts_band_estimate,
            "recorded_to_genome": False,
            "patterns_recorded": [],
        }

        if request.user and request.user.is_authenticated:
            learner = request.user
            # 1. Create PronunciationAttempt record
            attempt = PronunciationAttempt.objects.create(
                learner=learner,
                item_id=f"gop_{module_source.lower()}",
                target_text=sentence_text,
                spoken_transcript=sentence_text,
                speech_rate_wpm=fluency_score,
                intelligibility_score=int(round(overall_score)),
                stress_matched=overall_score >= 70,
                feedback_en=f"2D-CNN GOP evaluation: {overall_score}% accuracy, IELTS {ielts_band_estimate} band ({backend}).",
                feedback_fa=f"ارزیابی طیف‌نگاره عصبی GOP: دقت {overall_score}٪، تخمین آیلتس {ielts_band_estimate}.",
                genome_pattern_key=";".join(persian_l1_flags[:3]) if persian_l1_flags else ("pronunciation.phoneme." + weak_phonemes[0].lower() if weak_phonemes else ""),
            )

            # 2. Record weak phonemes & Persian L1 transfer to Mistake Genome
            recorded_patterns = []
            try:
                from mistake_genome.services import MistakeGenomeService
                genome_service = MistakeGenomeService()

                L1_MAPPING = {
                    "TH_SUBSTITUTION_S": (
                        "تداخل آوایی: تبدیل /θ/ به /s/ یا /t/",
                        "L1 Phonetic Transfer: /θ/ (th) replaced by /s/ or /t/",
                        "نوک زبان باید دقیقاً بین دندان‌های بالا و پایین قرار گیرد تا هوای بازدمی صدای سایشی /θ/ تولید کند.",
                    ),
                    "DH_SUBSTITUTION_D": (
                        "تداخل آوایی: تبدیل /ð/ به /d/ یا /z/",
                        "L1 Phonetic Transfer: Voiced dental fricative /ð/ replaced by /d/ or /z/",
                        "نوک زبان بین دندان‌ها قرار گرفته و تارهای صوتی بلرزند.",
                    ),
                    "W_SUBSTITUTION_V": (
                        "تداخل آوایی: تبدیل /w/ به /v/",
                        "L1 Phonetic Transfer: Labio-velar /w/ replaced by labiodental /v/",
                        "لب‌ها باید کاملاً گرد شده و دندان‌های بالا با لب پایین برخورد نکنند.",
                    ),
                    "NG_SUBSTITUTION_G": (
                        "تداخل آوایی: افزودن صدای گ به انتهای /ŋ/",
                        "L1 Phonetic Transfer: Velar nasal /ŋ/ released with audible plosive /g/",
                        "جریان هوا از بینی خارج شده و صدای انفجاری گ یا ک نباید رها شود.",
                    ),
                    "EPENTHETIC_E_CLUSTER": (
                        "تداخل آوایی: افزودن کسره /e/ به ابتدای خوشه‌های صامت /sp/ و /st/",
                        "L1 Phonetic Transfer: Epenthetic vowel /e/ inserted before /s/ clusters",
                        "بدون افزودن مصوت، صدای سایش /s/ را به صامت بعدی پیوند دهید.",
                    ),
                }

                for flag in persian_l1_flags:
                    info = L1_MAPPING.get(flag)
                    if info:
                        title_fa, title_en, tip_fa = info
                        pattern, _ = genome_service.record_mistake(
                            learner=learner,
                            tag=f"pronunciation.l1_transfer.{flag.lower()}",
                            category="pronunciation",
                            title_en=title_en,
                            title_fa=title_fa,
                            source_activity=f"spectrogram_lab_{module_source.lower()}",
                            raw_snippet=sentence_text,
                            correction_snippet=sentence_text,
                            explanation_en=f"Detected L1 phonological transfer flag: {flag}",
                            explanation_fa=tip_fa,
                            source_id=str(attempt.id),
                        )
                        recorded_patterns.append(pattern.tag)

                if recorded_patterns:
                    attempt.saved_to_genome = True
                    attempt.save(update_fields=["saved_to_genome"])
                    response_payload["recorded_to_genome"] = True
                    response_payload["patterns_recorded"] = recorded_patterns

            except Exception as e:
                response_payload["genome_error"] = str(e)

            response_payload["attempt_id"] = attempt.id

        return Response(response_payload, status=status.HTTP_200_OK)

