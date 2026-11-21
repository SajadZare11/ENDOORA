from django.db import transaction
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from rest_framework import serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PracticeRelease, PracticeProgress, PracticeIssue
from .practice_content import UNITS, grade, public_unit, revision


def visible_units():
    visible = {}
    for release in PracticeRelease.objects.filter(active=True):
        unit = release.content or UNITS.get(release.slug)
        if unit and release.digest == revision(unit):
            visible[release.slug] = unit
    return visible


@method_decorator(never_cache, name="dispatch")
class PracticeCatalog(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"units": [{"slug": k, "title": v["title"]} for k, v in visible_units().items()]})


class PracticeInput(serializers.Serializer):
    action = serializers.ChoiceField(choices=["save", "finish"])
    answers = serializers.DictField(child=serializers.CharField(max_length=160))
    revision = serializers.IntegerField(min_value=0, default=0)
    owner = serializers.CharField(max_length=64, allow_null=True, required=True)


@method_decorator(never_cache, name="dispatch")
class PracticeUnit(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        unit = visible_units().get(slug)
        if unit is None:
            return Response(status=404)
        owner = request.user if request.user.is_authenticated else None
        record = PracticeProgress.objects.filter(learner=owner, release_id=slug).first() if owner else None
        return Response({"unit": public_unit(unit), "owner": str(owner.pk) if owner else None,
                         "answers": record.answers if record else {}, "revision": record.revision if record else 0,
                         "result": record.result if record else None})

    @transaction.atomic
    def post(self, request, slug):
        # Serialize withdrawal and grading for the short, individually reviewed units.
        release = get_object_or_404(PracticeRelease.objects.select_for_update(), slug=slug, active=True)
        unit = release.content or UNITS.get(slug)
        if not unit or release.digest != revision(unit):
            return Response(status=404)
        form = PracticeInput(data=request.data)
        form.is_valid(raise_exception=True)
        data = form.validated_data
        answers = data["answers"]
        choices = {q["id"]: q["choices"] for q in unit["questions"]}
        if any(k not in choices or v not in choices[k] for k, v in answers.items()):
            return Response({"detail": "Invalid answer choice."}, status=400)
        finish = data["action"] == "finish"
        if finish and set(answers) != set(choices):
            return Response({"detail": "Answer every question before finishing."}, status=400)
        owner = str(request.user.pk) if request.user.is_authenticated else None
        if owner != data["owner"]:
            return Response({"detail": "Account changed. Reload before continuing."}, status=409)
        if owner is None:
            if not finish:
                return Response({"detail": "Sign in to save a draft."}, status=403)
            return Response({"result": grade(unit, answers), "saved": False, "revision": 0})
        record, _ = PracticeProgress.objects.get_or_create(learner=request.user, release=release)
        if record.answers == answers and (record.result is not None) == finish:
            return Response({"saved": True, "result": record.result, "revision": record.revision})
        if record.revision != data["revision"] or record.result is not None:
            return Response({"detail": "A newer or finished attempt exists. Reload to read it."}, status=409)
        record.answers = answers
        record.revision += 1
        record.result = grade(unit, answers) if finish else None
        record.save(update_fields=["answers", "revision", "result"])
        return Response({"saved": True, "result": record.result, "revision": record.revision})


class ReportInput(serializers.Serializer):
    question = serializers.CharField(max_length=32)
    note = serializers.CharField(min_length=3, max_length=700)


class PracticeReport(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        unit = visible_units().get(slug)
        if not unit:
            return Response(status=404)
        form = ReportInput(data=request.data)
        form.is_valid(raise_exception=True)
        data = form.validated_data
        if data["question"] not in {q["id"] for q in unit["questions"]}:
            return Response(status=400)
        issue, created = PracticeIssue.objects.get_or_create(
            learner=request.user, release_id=slug, question=data["question"], note=data["note"])
        return Response({"id": issue.pk}, status=201 if created else 200)
