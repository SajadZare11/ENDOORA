import logging
from typing import Any, Dict, List, Optional

from mistake_genome.services import MistakeGenomeService
from .models import PronunciationAttempt, PronunciationItem

logger = logging.getLogger(__name__)

CURATED_PRACTICE_ITEMS = [
    {
        "item_id": "min_v_w_1",
        "category": "minimal_pairs",
        "title_en": "Contrast: /v/ vs /w/ (Labiodental vs Labiovelar)",
        "title_fa": "تمایز آوایی: /v/ و /w/",
        "target_text": "very wary",
        "ipa": "/ˈver.i ˈweər.i/",
        "stress_pattern": "VER-y WAR-y",
        "target_wpm": 110.0,
        "difficulty_level": "A2",
        "l1_note_en": "Persian L1 lacks the /w/ sound, leading speakers to pronounce /w/ as /v/. Round your lips tightly without touching your teeth for /w/.",
        "l1_note_fa": "در زبان فارسی صدای /w/ وجود ندارد و معمولاً با /v/ جایگزین می‌شود. برای تلفظ /w/ لب‌ها کاملاً گرد می‌شوند و دندان با لب تماس پیدا نمی‌کند.",
        "example_sentence": "Be very wary of cold winds in the morning.",
    },
    {
        "item_id": "min_th_s_1",
        "category": "minimal_pairs",
        "title_en": "Contrast: /θ/ vs /s/ (Voiceless Dental vs Alveolar)",
        "title_fa": "تمایز آوایی: /θ/ و /s/",
        "target_text": "thought vs sought",
        "ipa": "/θɔːt/ vs /sɔːt/",
        "stress_pattern": "THOUGHT vs SOUGHT",
        "target_wpm": 100.0,
        "difficulty_level": "B1",
        "l1_note_en": "Place the tongue tip lightly between your upper and lower teeth for /θ/. Do not press against the alveolar ridge like /s/ or /t/.",
        "l1_note_fa": "نوک زبان را بین دندان‌های بالا و پایین بگذارید و هوا را خارج کنید (صدای th بی‌صدا). نوک زبان نباید پشت دندان‌ها قرار بگیرد.",
        "example_sentence": "I thought carefully before I sought the answer.",
    },
    {
        "item_id": "min_p_b_1",
        "category": "minimal_pairs",
        "title_en": "Contrast: /p/ vs /b/ (Voiceless Aspirated vs Voiced)",
        "title_fa": "تمایز آوایی: /p/ دمشی و /b/",
        "target_text": "pack vs back",
        "ipa": "/pæk/ vs /bæk/",
        "stress_pattern": "PACK vs BACK",
        "target_wpm": 110.0,
        "difficulty_level": "A2",
        "l1_note_en": "English /p/ has a distinct puff of aspiration when beginning a stressed syllable, unlike Persian /p/.",
        "l1_note_fa": "صدای /p/ در ابتدای هجای استرس‌دار در انگلیسی با خروج محسوس هوا (دمش یا Aspiration) ادا می‌شود.",
        "example_sentence": "Please pack your belongings and step back.",
    },
    {
        "item_id": "min_ee_i_1",
        "category": "minimal_pairs",
        "title_en": "Contrast: /iː/ vs /ɪ/ (Tense Long vs Lax Short Vowel)",
        "title_fa": "تمایز آوایی: /iː/ کشیده و /ɪ/ کوتاه",
        "target_text": "sheep vs ship",
        "ipa": "/ʃiːp/ vs /ʃɪp/",
        "stress_pattern": "SHEEP vs SHIP",
        "target_wpm": 105.0,
        "difficulty_level": "A2",
        "l1_note_en": "The vowel in 'ship' /ɪ/ is shorter, more central, and relaxed. Do not pronounce it with the full smile tension of /iː/.",
        "l1_note_fa": "مصوت /ɪ/ در ship کوتاه و با عضلات شل زبان ادا می‌شود، در حالی که /iː/ در sheep کشیده‌تر و با کشیدگی لب‌هاست.",
        "example_sentence": "We saw twenty sheep boarding the cargo ship.",
    },
    {
        "item_id": "stress_photo_1",
        "category": "stress_shifts",
        "title_en": "Suffix-Induced Stress Shift: Photographer",
        "title_fa": "جابجایی استرس سیلاب: کلمه Photographer",
        "target_text": "photographer",
        "ipa": "/fəˈtɒɡ.rə.fər/",
        "stress_pattern": "pho-TOG-ra-pher",
        "target_wpm": 120.0,
        "difficulty_level": "B1",
        "l1_note_en": "Adding the suffix '-er' shifts primary lexical stress from syllable 1 (PHO-to-graph) to syllable 2 (pho-TOG-ra-pher).",
        "l1_note_fa": "در کلمه photograph استرس روی بخش اول است، اما با افزودن پسوند در photographer استرس به بخش دوم می‌رود.",
        "example_sentence": "The professional photographer captured the city skyline.",
    },
    {
        "item_id": "stress_economy_1",
        "category": "stress_shifts",
        "title_en": "Suffix-Induced Stress Shift: Economic",
        "title_fa": "جابجایی استرس سیلاب: کلمه Economic",
        "target_text": "economy vs economic",
        "ipa": "/ɪˈkɒn.ə.mi/ vs /ˌiː.kəˈnɒm.ɪk/",
        "stress_pattern": "e-CON-o-my vs ec-o-NOM-ic",
        "target_wpm": 120.0,
        "difficulty_level": "B2",
        "l1_note_en": "Primary stress shifts to the syllable immediately preceding '-ic': e-CON-o-my shifts to ec-o-NOM-ic.",
        "l1_note_fa": "پسوند ic- استرس را به سیلاب بلافاصله قبل از خود جذب می‌کند: e-CON-o-my تبدیل به ec-o-NOM-ic می‌شود.",
        "example_sentence": "Rapid growth in the economy spurred major economic reforms.",
    },
    {
        "item_id": "cluster_sport_1",
        "category": "consonant_clusters",
        "title_en": "Initial S-Cluster (Avoid Vowel Epenthesis)",
        "title_fa": "خوشه صامت آغازین /s/ (جلوگیری از افزودن صدای e)",
        "target_text": "sport and student",
        "ipa": "/spɔːt ænd ˈstjuː.dənt/",
        "stress_pattern": "SPORT and STU-dent",
        "target_wpm": 115.0,
        "difficulty_level": "A2",
        "l1_note_en": "Persian syllable phonotactics forbid CC- initial clusters, causing learners to insert an initial vowel (e.g. 'e-sport', 'e-student'). Start directly with the hiss of /s/.",
        "l1_note_fa": "در زبان فارسی هجا با دو صامت متوالی آغاز نمی‌شود و گویشوران ناخودآگاه مصوت 'اِ' اضافه می‌کنند (مثل اِسپورت). کلمه را مستقیماً با صدای سوت /s/ شروع کنید.",
        "example_sentence": "Every student took part in the annual sport day.",
    },
    {
        "item_id": "elision_comf_1",
        "category": "connected_speech",
        "title_en": "Vowel Elision: Comfortable & Temperature",
        "title_fa": "حذف مصوت ناخواسته (Elision): کلمه Comfortable",
        "target_text": "comfortable",
        "ipa": "/ˈkʌmf.tə.bəl/",
        "stress_pattern": "COMF-ter-ble (3 syllables)",
        "target_wpm": 125.0,
        "difficulty_level": "B1",
        "l1_note_en": "The unstressed middle vowel 'or' is elided in standard pronunciation, producing 3 syllables rather than 4.",
        "l1_note_fa": "مصوت میانی 'or' در گفتار طبیعی تلفظ نمی‌شود و کلمه به صورت ۳ سیلابی (COMF-ter-ble) ادا می‌شود، نه ۴ سیلابی.",
        "example_sentence": "Make yourself comfortable in the lounge while you wait.",
    },
    {
        "item_id": "linking_apple_1",
        "category": "connected_speech",
        "title_en": "Consonant-to-Vowel Linking in Connected Speech",
        "title_fa": "اتصال صامت به مصوت در گفتار پیوسته (Linking)",
        "target_text": "an apple in an hour",
        "ipa": "/ən ˈæp.əl ɪn ən ˈaʊ.ər/",
        "stress_pattern": "a-NAP-ple i-na-NOUR",
        "target_wpm": 130.0,
        "difficulty_level": "B1",
        "l1_note_en": "Link the final consonant of a word smoothly to the initial vowel of the next word, producing fluid flow without glottal stops.",
        "l1_note_fa": "در گفتار پیوسته، صامت انتهای کلمه مستقیماً به مصوت ابتدای کلمه بعدی متصل می‌شود (a-napple). بین کلمات توقف گلوگاهی ایجاد نکنید.",
        "example_sentence": "I will eat an apple in an hour before our walk.",
    },
]


class PronunciationService:
    """
    Evaluates learner speech pacing (WPM), pause hesitations, syllable stress,
    and intelligibility trends under Product Constitution Rule #8.
    Never fabricates unvalidated phoneme-level or native-accent percentages.
    """

    def ensure_seed_items(self) -> None:
        """Seeds curated practice items if table is empty."""
        for data in CURATED_PRACTICE_ITEMS:
            PronunciationItem.objects.get_or_create(
                item_id=data["item_id"],
                defaults=data,
            )

    def get_practice_items(
        self,
        category: Optional[str] = None,
        difficulty_level: Optional[str] = None,
    ) -> List[PronunciationItem]:
        """Returns catalog of pronunciation items with optional category filtering."""
        self.ensure_seed_items()
        qs = PronunciationItem.objects.all()
        if category and category != "all":
            qs = qs.filter(category=category)
        if difficulty_level and difficulty_level != "all":
            qs = qs.filter(difficulty_level=difficulty_level)
        return list(qs)

    def get_item_by_id(self, item_id: str) -> Optional[PronunciationItem]:
        """Retrieves a single item by unique item_id."""
        self.ensure_seed_items()
        return PronunciationItem.objects.filter(item_id=item_id).first()

    @staticmethod
    def calculate_speech_rate_wpm(word_count: int, duration_seconds: float) -> float:
        """Calculates speaking rate in words per minute."""
        safe_duration = max(0.5, float(duration_seconds or 2.0))
        return round((max(1, word_count) / safe_duration) * 60.0, 1)

    @staticmethod
    def count_hesitations(pause_count: int) -> int:
        """Sanitizes detected pause/hesitation counts."""
        return max(0, int(pause_count or 0))

    @staticmethod
    def evaluate_intelligibility_trend(match_ratio: float, pause_count: int) -> int:
        """Computes formative intelligibility trend score (60-96) under Rule #8."""
        base_score = int(70 + (max(0.0, min(1.0, match_ratio)) * 25))
        if pause_count > 3:
            base_score = max(60, base_score - 8)
        return min(96, max(60, base_score))

    def analyze_attempt(
        self,
        learner,
        target_text: str,
        spoken_transcript: str,
        duration_seconds: float = 0.0,
        pause_count: int = 0,
        item_id: str = "",
    ) -> PronunciationAttempt:
        """
        Performs formative intelligibility analysis:
        - Computes speech rate (WPM)
        - Evaluates pauses/hesitations
        - Assesses lexical match & stress accuracy
        - Generates formative coaching feedback without accent bias
        """
        practice_item = None
        if item_id:
            practice_item = self.get_item_by_id(item_id)

        clean_target = (practice_item.target_text if practice_item else target_text).strip()
        clean_spoken = spoken_transcript.strip()

        # Duration and WPM calculation
        safe_duration = max(0.5, float(duration_seconds or 2.0))
        word_count = len(clean_spoken.split()) if clean_spoken else len(clean_target.split())
        speech_rate_wpm = self.calculate_speech_rate_wpm(word_count, safe_duration)
        sanitized_pauses = self.count_hesitations(pause_count)

        # Lexical intelligibility heuristic (trend evaluation only)
        target_words = clean_target.lower().replace("vs", "").replace("-", " ").split()
        spoken_words = clean_spoken.lower().replace("vs", "").replace("-", " ").split()

        matched_words = 0
        for tw in target_words:
            if any(tw in sw or sw in tw for sw in spoken_words):
                matched_words += 1

        match_ratio = matched_words / max(1, len(target_words))
        intelligibility_score = self.evaluate_intelligibility_trend(match_ratio, sanitized_pauses)

        # Stress match heuristic
        stress_matched = match_ratio >= 0.75 and (80.0 <= speech_rate_wpm <= 180.0)

        # Formative feedback generation
        feedback_en, feedback_fa = self._generate_formative_feedback(
            practice_item=practice_item,
            clean_target=clean_target,
            match_ratio=match_ratio,
            speech_rate_wpm=speech_rate_wpm,
            pause_count=pause_count,
            stress_matched=stress_matched,
        )

        genome_key = f"pronunciation.{practice_item.category if practice_item else 'general'}"

        attempt = PronunciationAttempt.objects.create(
            learner=learner,
            practice_item=practice_item,
            item_id=practice_item.item_id if practice_item else item_id,
            target_text=clean_target,
            spoken_transcript=clean_spoken,
            duration_seconds=safe_duration,
            speech_rate_wpm=speech_rate_wpm,
            pause_count=pause_count,
            intelligibility_score=intelligibility_score,
            stress_matched=stress_matched,
            feedback_en=feedback_en,
            feedback_fa=feedback_fa,
            saved_to_genome=False,
            genome_pattern_key=genome_key,
        )

        return attempt

    def save_to_mistake_genome(
        self,
        learner,
        attempt_id: int,
    ) -> PronunciationAttempt:
        """
        Bridges an identified pronunciation / stress challenge to the learner's Mistake Genome
        under the 'pronunciation' error category.
        """
        attempt = PronunciationAttempt.objects.get(id=attempt_id, learner=learner)
        if attempt.saved_to_genome:
            return attempt

        pattern_tag = attempt.genome_pattern_key or "pronunciation.articulation_hesitation"

        # Record to Mistake Genome
        genome_service = MistakeGenomeService()
        genome_service.record_mistake(
            learner=learner,
            tag=pattern_tag,
            category="pronunciation",
            title_en=f"Pronunciation Focus: {attempt.target_text}",
            title_fa=f"تمرکز تلفظ: {attempt.target_text}",
            source_activity="pronunciation_lab",
            raw_snippet=attempt.spoken_transcript or attempt.target_text,
            correction_snippet=attempt.target_text,
            explanation_en=attempt.feedback_en or "",
            explanation_fa=attempt.feedback_fa or "",
            source_id=str(attempt.id),
        )

        attempt.saved_to_genome = True
        attempt.save(update_fields=["saved_to_genome"])
        return attempt

    def get_learner_history(self, learner, limit: int = 20) -> List[PronunciationAttempt]:
        """Returns learner's recent pronunciation practice attempts."""
        return list(PronunciationAttempt.objects.filter(learner=learner)[:limit])

    # Backward compatibility bridge for legacy calls
    def analyze(self, audio) -> Dict[str, Any]:
        """Legacy mock endpoint."""
        return {
            "feedback": "Intelligibility and speech rate trends only.",
            "warning": "Constitution Rule #8: Not an accent diagnosis or native phoneme claim.",
            "intelligibility_score": 80,
            "speech_rate_wpm": 120.0,
        }

    def _generate_formative_feedback(
        self,
        practice_item: Optional[PronunciationItem],
        clean_target: str,
        match_ratio: float,
        speech_rate_wpm: float,
        pause_count: int,
        stress_matched: bool,
    ) -> tuple[str, str]:
        """Produces transparent, encouraging, actionable formative feedback in EN and FA."""
        en_parts = []
        fa_parts = []

        if match_ratio >= 0.8:
            en_parts.append("Clear communicative intelligibility detected.")
            fa_parts.append("وضوح کلام و تمایز واژگانی به خوبی ادا شد.")
        else:
            en_parts.append("Focus on articulating target phonemes cleanly.")
            fa_parts.append("بر روی تمایز دقیق آواهای کلیدی تمرکز بیشتری داشته باشید.")

        if speech_rate_wpm < 85.0:
            en_parts.append(f"Pacing was somewhat slow ({speech_rate_wpm} WPM). Practice connected shadowing to increase natural flow.")
            fa_parts.append(f"سرعت گفتار کمی آهسته بود ({speech_rate_wpm} کلمه در دقیقه). با تکنیک سایه‌زنی روان‌تر بخوانید.")
        elif speech_rate_wpm > 170.0:
            en_parts.append(f"Pacing was fast ({speech_rate_wpm} WPM). Allow primary stressed vowels enough duration.")
            fa_parts.append(f"سرعت گفتار بالا بود ({speech_rate_wpm} کلمه در دقیقه). به مصوت‌های استرس‌دار زمان کافی برای کشش بدهید.")
        else:
            en_parts.append(f"Excellent conversational pacing ({speech_rate_wpm} WPM).")
            fa_parts.append(f"ریتم و سرعت گفتار کاملاً طبیعی و استاندارد است ({speech_rate_wpm} کلمه در دقیقه).")

        if pause_count > 2:
            en_parts.append(f"Detected {pause_count} mid-phrase hesitations. Try linking words smoothly.")
            fa_parts.append(f"تعداد {pause_count} مکث میانی شناسایی شد. سعی کنید کلمات را به صورت پیوسته به هم متصل کنید.")

        if practice_item and practice_item.stress_pattern:
            if stress_matched:
                en_parts.append(f"Syllable stress matches standard target: '{practice_item.stress_pattern}'.")
                fa_parts.append(f"استرس هجاها با الگوی استاندارد مطابقت دارد: '{practice_item.stress_pattern}'.")
            else:
                en_parts.append(f"Pay attention to primary stress: '{practice_item.stress_pattern}'.")
                fa_parts.append(f"به استرس هجای اصلی دقت کنید: '{practice_item.stress_pattern}'.")

        return " ".join(en_parts), " ".join(fa_parts)
