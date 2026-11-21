from secrets import token_urlsafe
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http import Http404
from django.shortcuts import redirect, render
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods
from .models import Answer, Edition, Journey, SKILLS, STAGES, Visit
from .services import (
    account_journey,
    current_edition,
    eligible,
    make_answers,
    progress,
    TIPS,
)

BASE = "reading_path:"


def page(request, template, context=None, status=200):
    return render(
        request, "reading_path/" + template + ".html", context or {}, status=status
    )


def actor(request):
    if request.user.is_authenticated:
        return str(request.user.pk)
    if "reading_actor" not in request.session:
        request.session["reading_actor"] = token_urlsafe(18)
    return request.session["reading_actor"]


@never_cache
def home(request):
    edition = current_edition(request)
    state = {}
    if edition and request.user.is_authenticated:
        journey = account_journey(request, edition)
        Visit.touch(journey, "home")
        state = progress(journey)
    return page(request, "home", {"edition": edition, **state})


@never_cache
@require_http_methods(["GET", "POST"])
def step(request, stage="sample", skill=""):
    if (
        stage not in STAGES
        or (stage in ("lesson", "retest") and skill not in SKILLS)
        or (stage in ("sample", "diagnostic") and skill)
    ):
        raise Http404
    edition = current_edition(request)
    if not edition:
        return page(request, "unavailable", status=503)
    if stage != "sample" and not request.user.is_authenticated:
        return redirect("/auth/login?reading=1")
    with transaction.atomic():
        if request.method == "POST":
            edition = Edition.objects.select_for_update().get(pk=edition.pk)
            if edition.state not in ("live", "superseded"):
                return page(request, "conflict", status=409)
        journey = (
            account_journey(request, edition) if request.user.is_authenticated else None
        )
        if journey:
            journey = Journey.objects.select_for_update().get(pk=journey.pk)
            if not eligible(stage, skill, progress(journey)):
                return page(request, "locked", status=403)
            Visit.touch(journey, stage)
        items = edition.items.filter(stage=stage)
        if skill:
            items = items.filter(skill=skill)
        items = list(items)
        if not items:
            raise Http404
        context = {
            "stage": stage,
            "label": STAGES[stage],
            "skill": SKILLS.get(skill),
            "tip": TIPS.get(skill) if stage == "lesson" else None,
            "edition": edition,
            "actor": actor(request),
            "items": items,
        }
        stored = {}
        if journey:
            stored = dict(
                journey.answers.filter(item__in=items).values_list(
                    "item__code", "choice"
                )
            )
        elif (request.session.get("reading_sample") or {}).get("edition") == edition.pk:
            stored = request.session["reading_sample"]["answers"]
        if journey and stage == "retest" and not stored:
            prior = (
                Answer.objects.filter(journey__learner=request.user)
                .exclude(journey=journey)
                .values_list("item__passage", flat=True)
            )
            seen = {" ".join(p.casefold().split()) for p in prior}
            if any(" ".join(q.passage.casefold().split()) in seen for q in items):
                return page(request, "repeated", status=409)
        if request.method == "POST":
            if (
                request.POST.get("edition") != str(edition.pk)
                or request.POST.get("actor") != context["actor"]
            ):
                return page(request, "conflict", status=409)
            values = {item.code: request.POST.get(item.code) for item in items}
            if any(v not in ("A", "B", "C") for v in values.values()):
                return page(
                    request,
                    "step",
                    {**context, "error": "برای هر سؤال یک پاسخ انتخاب کنید."},
                    status=400,
                )
            if stored and stored != values:
                return page(request, "conflict", status=409)
            if not stored:
                if journey:
                    Answer.objects.bulk_create(make_answers(journey, items, values))
                else:
                    request.session["reading_sample"] = {
                        "edition": edition.pk,
                        "answers": values,
                    }
            return redirect(request.path)
        if stored:
            results = make_answers(journey, items, stored)
            return page(
                request,
                "result",
                {
                    **context,
                    "results": results,
                    "correct": sum(a.correct for a in results),
                },
            )
        return page(request, "step", context)


@never_cache
@login_required(login_url="/auth/login?reading=1")
def notebook(request):
    rows = (
        Answer.objects.filter(journey__learner=request.user, correct=False)
        .select_related("item", "journey__edition")
        .order_by("-submitted_at")
    )
    return page(request, "notebook", {"rows": rows})
