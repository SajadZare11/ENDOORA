import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone

SKILLS = {
    "evidence": "درست، نادرست یا ذکرنشده",
    "paraphrase": "بازگویی معنا",
    "heading": "انتخاب عنوان",
}
STAGES = {
    "sample": "نمونهٔ رایگان",
    "diagnostic": "سنجش آغازین",
    "lesson": "تمرین هدفمند",
    "retest": "مرور با سؤال تازه",
}
STATES = [
    ("draft", "Draft"),
    ("live", "Published"),
    ("superseded", "Earlier version"),
    ("withdrawn", "Withdrawn"),
]


class Edition(models.Model):
    title = models.CharField(max_length=160)
    state = models.CharField(
        max_length=16, choices=STATES, default="draft", editable=False
    )
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, editable=False)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, editable=False, on_delete=models.SET_NULL
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["state"],
                condition=models.Q(state="live"),
                name="one_live_reading_path",
            )
        ]

    def __str__(self):
        return f"{self.title} · #{self.pk}"


class Item(models.Model):
    edition = models.ForeignKey(Edition, on_delete=models.CASCADE, related_name="items")
    code = models.SlugField(max_length=48)
    stage = models.CharField(max_length=12, choices=STAGES)
    skill = models.CharField(max_length=14, choices=SKILLS)
    passage = models.TextField()
    prompt = models.CharField(max_length=450)
    option_a = models.CharField(max_length=180)
    option_b = models.CharField(max_length=180)
    option_c = models.CharField(max_length=180)
    key = models.CharField(max_length=1, choices=[(v, v) for v in "ABC"])
    evidence = models.TextField(
        help_text="Copy the exact passage text that supports your explanation. For Not Given, quote the closest relevant sentence."
    )
    reason_a = models.TextField(verbose_name="Persian explanation for A")
    reason_b = models.TextField(verbose_name="Persian explanation for B")
    reason_c = models.TextField(verbose_name="Persian explanation for C")

    class Meta:
        ordering = ["code"]
        constraints = [
            models.UniqueConstraint(
                fields=["edition", "code"], name="reading_edition_code"
            )
        ]

    def choices_with_reasons(self):
        return [
            (
                k,
                getattr(self, "option_" + k.lower()),
                getattr(self, "reason_" + k.lower()),
            )
            for k in "ABC"
        ]

    def __str__(self):
        return f"{self.code} · {self.get_stage_display()}"


class Journey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    edition = models.ForeignKey(Edition, on_delete=models.PROTECT)
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["edition", "learner"], name="one_reading_journey_per_edition"
            )
        ]


class Answer(models.Model):
    journey = models.ForeignKey(
        Journey, related_name="answers", on_delete=models.CASCADE
    )
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    choice = models.CharField(max_length=1)
    correct = models.BooleanField()
    submitted_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["journey", "item"], name="first_reading_answer"
            )
        ]

    @property
    def selected_text(self):
        return getattr(self.item, "option_" + self.choice.lower())

    @property
    def expected_text(self):
        return getattr(self.item, "option_" + self.item.key.lower())

    @property
    def explanation(self):
        return getattr(self.item, "reason_" + self.choice.lower())


class SupportTime(models.Model):
    day = models.DateField(default=timezone.localdate)
    minutes = models.PositiveSmallIntegerField()
    note = models.CharField(
        max_length=160,
        blank=True,
        help_text="Operational category only. Omit learner names.",
    )


class Visit(models.Model):
    journey = models.ForeignKey(
        Journey, on_delete=models.CASCADE, related_name="visits"
    )
    day = models.DateField()
    step = models.CharField(max_length=16)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["journey", "day", "step"], name="one_reading_step_visit_daily"
            )
        ]

    @classmethod
    def touch(cls, journey, step):
        cls.objects.get_or_create(journey=journey, day=timezone.localdate(), step=step)


class ClinicRevision(models.Model):
    slug = models.SlugField(unique=True)
    source_slug = models.SlugField(
        help_text="Published version or original unit to revise."
    )
    title = models.CharField(max_length=180)
    instruction = models.TextField()
    material = models.TextField(
        help_text="Reading passage or verbatim listening transcript."
    )
    duration_ms = models.PositiveIntegerField(
        default=0, help_text="Recording duration in milliseconds for listening."
    )
    published = models.BooleanField(default=False, editable=False)

    def __str__(self):
        return self.slug


class ClinicQuestion(models.Model):
    draft = models.ForeignKey(
        ClinicRevision, on_delete=models.CASCADE, related_name="questions"
    )
    code = models.SlugField()
    prompt = models.CharField(max_length=400)
    options = models.TextField(help_text="One choice on each line.")
    answer = models.CharField(
        max_length=160, help_text="Copy the accepted choice exactly."
    )
    reasons = models.TextField(
        help_text="One Persian reason on each line, in choice order."
    )
    explanation = models.TextField()
    evidence = models.TextField()
    start_ms = models.PositiveIntegerField(null=True, blank=True)
    end_ms = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["draft", "code"], name="unique_draft_clinic_code"
            )
        ]
