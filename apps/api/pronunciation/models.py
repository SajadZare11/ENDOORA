from django.conf import settings
from django.db import models


class PronunciationItem(models.Model):
    """
    Curated phonetic and prosodic practice items targeting Persian L1
    phonological transfer challenges (minimal pairs, stress shifts,
    consonant cluster epenthesis, and connected speech elision).
    """

    CATEGORY_CHOICES = [
        ("minimal_pairs", "Minimal Pairs (جفت‌های کمینه)"),
        ("stress_shifts", "Syllable Stress Shifts (جابجایی استرس)"),
        ("consonant_clusters", "Consonant Clusters & Epenthesis (خوشه‌های همخوانی)"),
        ("connected_speech", "Connected Speech & Elision (گفتار پیوسته و ادغام)"),
    ]

    item_id = models.CharField(max_length=64, unique=True, db_index=True)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    title_en = models.CharField(max_length=128)
    title_fa = models.CharField(max_length=128)
    target_text = models.CharField(max_length=255)
    ipa = models.CharField(max_length=128)
    stress_pattern = models.CharField(max_length=128, blank=True, default="")
    target_wpm = models.FloatField(default=120.0)
    difficulty_level = models.CharField(max_length=16, default="B1")
    l1_note_en = models.TextField(blank=True, default="")
    l1_note_fa = models.TextField(blank=True, default="")
    example_sentence = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "difficulty_level", "id"]
        verbose_name = "Pronunciation Practice Item"
        verbose_name_plural = "Pronunciation Practice Items"

    def __str__(self):
        return f"[{self.category}] {self.target_text} ({self.difficulty_level})"


class PronunciationAttempt(models.Model):
    """
    Learner's oral practice attempt evaluated for speech rate (WPM),
    pause/hesitation counts, syllable stress articulation, and communicative
    intelligibility trends under Product Constitution Rule #8.
    Does NOT claim pseudoscientific native phoneme or accent diagnosis.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pronunciation_attempts",
    )
    practice_item = models.ForeignKey(
        PronunciationItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attempts",
    )
    item_id = models.CharField(max_length=64, blank=True, default="")
    target_text = models.CharField(max_length=255)
    spoken_transcript = models.TextField(blank=True, default="")
    duration_seconds = models.FloatField(default=0.0)
    speech_rate_wpm = models.FloatField(default=0.0)
    pause_count = models.IntegerField(default=0)
    intelligibility_score = models.IntegerField(default=75)
    stress_matched = models.BooleanField(default=True)
    feedback_en = models.TextField(blank=True, default="")
    feedback_fa = models.TextField(blank=True, default="")
    saved_to_genome = models.BooleanField(default=False)
    genome_pattern_key = models.CharField(max_length=64, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Pronunciation Attempt"
        verbose_name_plural = "Pronunciation Attempts"

    def __str__(self):
        return f"Attempt by {self.learner_id} on '{self.target_text}' (Score: {self.intelligibility_score}%)"

    # Backward compatibility properties for legacy accessors
    @property
    def transcript(self) -> str:
        return self.spoken_transcript

    @property
    def speech_rate(self) -> float:
        return self.speech_rate_wpm

    @property
    def pauses(self) -> int:
        return self.pause_count

    @property
    def confidence(self) -> float:
        return self.intelligibility_score / 100.0
