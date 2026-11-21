from collections import defaultdict
from datetime import timedelta
from django.db.models import Min, Sum
from django.utils import timezone
from .models import Journey, SupportTime


def weekly_metrics(start):
    """Cohort by each account's first journey, even after a content revision."""
    end = start + timedelta(days=7)
    today = timezone.localdate()
    cohort = (
        Journey.objects.exclude(learner=None)
        .values("learner_id")
        .annotate(first=Min("created_at"))
        .filter(first__date__gte=start, first__date__lt=end)
    )
    first_days = {
        row["learner_id"]: timezone.localtime(row["first"]).date() for row in cohort
    }
    journeys = Journey.objects.filter(learner_id__in=first_days).prefetch_related(
        "visits", "answers__item"
    )
    visits, answers = defaultdict(list), defaultdict(list)
    for journey in journeys:
        visits[journey.learner_id].extend(journey.visits.all())
        answers[journey.learner_id].extend(journey.answers.all())
    counts = dict(
        accounts=len(first_days),
        diagnostic=0,
        lesson=0,
        eligible_week=0,
        returned_week=0,
        retest_learners=0,
        retest_correct=0,
        retest_items=0,
    )
    for user, first in first_days.items():
        activity = visits[user]
        rows = answers[user]
        counts["diagnostic"] += any(a.item.stage == "diagnostic" for a in rows)
        counts["lesson"] += any(v.step == "lesson" for v in activity)
        if today > first + timedelta(days=7):
            counts["eligible_week"] += 1
            counts["returned_week"] += any(
                first < v.day <= first + timedelta(days=7) for v in activity
            )
        retests = [a for a in rows if a.item.stage == "retest"]
        counts["retest_learners"] += bool(retests)
        counts["retest_correct"] += sum(a.correct for a in retests)
        counts["retest_items"] += len(retests)
    counts["support_minutes"] = (
        SupportTime.objects.filter(day__gte=start, day__lt=end).aggregate(
            n=Sum("minutes")
        )["n"]
        or 0
    )
    return counts
