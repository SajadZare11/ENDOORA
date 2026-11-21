from difflib import unified_diff
import json
from django.core.exceptions import ValidationError
from django.db import transaction
from ielts.models import PracticeRelease
from ielts.practice_content import UNITS, revision
from .models import ClinicRevision


def build_unit(draft, strict=True):
    base = UNITS.get(draft.source_slug)
    if base is None:
        old = PracticeRelease.objects.filter(pk=draft.source_slug).first()
        base = old.content if old else None
    if not base:
        raise ValidationError("Select a known source release.")
    unit = {
        **base,
        "version": base["version"] + 1,
        "title": draft.title,
        "instruction": draft.instruction,
        "questions": [],
        ("transcript" if base["skill"] == "listening" else "passage"): draft.material,
    }
    for q in draft.questions.order_by("pk"):
        opts = [line.strip() for line in q.options.splitlines() if line.strip()]
        reasons = [line.strip() for line in q.reasons.splitlines() if line.strip()]
        if strict and (
            len(opts) < 2
            or len(set(opts)) != len(opts)
            or q.answer not in opts
            or len(reasons) != len(opts)
            or not q.evidence.strip()
            or q.evidence not in draft.material
        ):
            raise ValidationError(
                f"{q.code}: supply distinct options, the exact key, one reason per option and an exact evidence quote."
            )
        data = dict(
            id=q.code,
            prompt=q.prompt,
            choices=opts,
            answer=q.answer,
            explanation=q.explanation,
            evidence=q.evidence,
            choice_reasons=dict(zip(opts, reasons)),
            accepted=[q.answer],
        )
        if base["skill"] == "listening":
            if strict and (
                q.start_ms is None
                or q.end_ms is None
                or not 0 <= q.start_ms < q.end_ms <= draft.duration_ms
            ):
                raise ValidationError(f"{q.code}: correct the audio interval.")
            data.update(start_ms=q.start_ms, end_ms=q.end_ms)
        unit["questions"].append(data)
    if strict and not unit["questions"]:
        raise ValidationError("Add questions before publishing.")
    return base, unit


def comparison(old, new):
    def lines(obj):
        return json.dumps(
            obj, ensure_ascii=False, indent=2, sort_keys=True
        ).splitlines()

    return "\n".join(
        unified_diff(
            lines(old), lines(new), fromfile="source", tofile="draft", lineterm=""
        )
    )


@transaction.atomic
def release_clinic(draft, owner):
    draft = ClinicRevision.objects.select_for_update().get(pk=draft.pk)
    if (
        draft.published
        or draft.slug in UNITS
        or PracticeRelease.objects.filter(pk=draft.slug).exists()
    ):
        raise ValidationError("Choose an unused version slug.")
    _, unit = build_unit(draft)
    PracticeRelease.objects.create(
        slug=draft.slug,
        digest=revision(unit),
        content=unit,
        active=True,
        reviewed_by=owner,
    )
    draft.published = True
    draft.save(update_fields=["published"])
