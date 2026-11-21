from collections import Counter
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from .models import Answer, Edition, Journey, SKILLS

DELAY = timedelta(days=3)
TIPS = {
    "evidence": "بین «متن خلاف این ادعا را می‌گوید» و «اطلاعات کافی نداریم» فرق بگذارید. کلمه‌هایی مثل only و all را پیدا کنید.",
    "paraphrase": "ابتدا شرط، زمان و رابطهٔ علت و معلول را مشخص کنید. سپس عبارتی با همان معنا پیدا کنید، حتی اگر واژه‌ها عوض شده باشند.",
    "heading": "از خود بپرسید همهٔ جمله‌ها به کدام ایده کمک می‌کنند. گزینه‌ای که فقط یک مثال را نام می‌برد معمولاً بیش از حد محدود است.",
}


@transaction.atomic
def account_journey(request, edition):
    # Django rotates the session key on ordinary login, preserving its guest data.
    user = (
        get_user_model().objects.select_for_update().only("pk").get(pk=request.user.pk)
    )
    journey, _ = Journey.objects.get_or_create(learner=user, edition=edition)
    sample = request.session.pop("reading_sample", None)
    if sample and sample.get("edition") == edition.pk:
        rows = make_answers(
            journey, list(edition.items.filter(stage="sample")), sample["answers"]
        )
        Answer.objects.bulk_create(rows, ignore_conflicts=True)
    return journey


def current_edition(request):
    if request.user.is_authenticated:
        active = (
            Journey.objects.filter(
                learner=request.user, edition__state__in=["live", "superseded"]
            )
            .order_by("-created_at")
            .select_related("edition")
            .first()
        )
        if active:
            return active.edition
    return Edition.objects.filter(state="live").first()


def make_answers(journey, items, values):
    return [
        Answer(
            journey=journey,
            item=item,
            choice=values[item.code],
            correct=item.key == values[item.code],
        )
        for item in items
    ]


def progress(journey, now=None):
    now = now or timezone.now()
    rows = list(journey.answers.select_related("item").order_by("submitted_at", "pk"))
    diag = [a for a in rows if a.item.stage == "diagnostic"]
    misses = Counter(a.item.skill for a in diag if not a.correct)
    skills = []
    for key in sorted(SKILLS, key=lambda k: -misses[k]):
        own = [a for a in rows if a.item.skill == key]
        lesson = [a for a in own if a.item.stage == "lesson"]
        retest = [a for a in own if a.item.stage == "retest"]
        due = max((a.submitted_at for a in lesson), default=None)
        due = due + DELAY if due else None
        skills.append(
            {
                "key": key,
                "name": SKILLS[key],
                "misses": misses[key],
                "due": due,
                "lesson_done": bool(lesson),
                "retest_done": bool(retest),
                "ready": bool(due and due <= now and not retest),
                "diagnostic_correct": sum(
                    a.correct for a in diag if a.item.skill == key
                ),
                "fresh_correct": sum(a.correct for a in retest),
                "fresh_total": len(retest),
            }
        )
    return {
        "skills": skills,
        "diagnosed": bool(diag),
        "total": len(rows),
        "errors": [a for a in rows if not a.correct],
        "next_lesson": next((s for s in skills if not s["lesson_done"]), None),
    }


def eligible(stage, skill, state):
    if stage in ("sample", "diagnostic"):
        return True
    entry = next((s for s in state["skills"] if s["key"] == skill), None)
    if not entry or not state["diagnosed"]:
        return False
    return stage == "lesson" or (
        stage == "retest" and (entry["ready"] or entry["retest_done"])
    )
