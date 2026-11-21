from collections import Counter
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from .models import Edition, Item, SKILLS


def validate_items(items):
    counts = Counter()
    passages = {}
    for item in items:
        item.full_clean()
        choices = [
            value.strip().casefold() for _, value, _ in item.choices_with_reasons()
        ]
        if len(set(choices)) != 3 or item.evidence.strip() not in item.passage:
            raise ValidationError(
                f"{item.code}: enter distinct choices and quote the passage exactly."
            )
        normalized = " ".join(item.passage.casefold().split())
        if normalized in passages and passages[normalized] != item.stage:
            raise ValidationError(
                f"{item.code}: use a separate passage for each stage."
            )
        passages[normalized] = item.stage
        counts[(item.stage, item.skill)] += 1
    if (
        counts[("sample", "evidence")] != 3
        or sum(v for (s, _), v in counts.items() if s == "sample") != 3
    ):
        raise ValidationError(
            "Supply exactly three evidence questions for the free lesson."
        )
    for stage in ("diagnostic", "lesson", "retest"):
        for skill in SKILLS:
            if counts[(stage, skill)] != 2:
                raise ValidationError(f"Supply two {stage} items for {skill}.")


@transaction.atomic
def publish(edition, user):
    # A consistent lock order also serializes publication of competing drafts.
    editions = list(Edition.objects.select_for_update().order_by("pk"))
    target = next(e for e in editions if e.pk == edition.pk)
    if target.state != "draft":
        raise ValidationError("Only a draft can be published.")
    validate_items(list(target.items.all()))
    Edition.objects.filter(state="live").update(state="superseded")
    target.state, target.reviewer, target.published_at = "live", user, timezone.now()
    target.save(update_fields=["state", "reviewer", "published_at"])


@transaction.atomic
def copy_edition(edition):
    parent = Edition.objects.select_for_update().get(pk=edition.pk)
    draft = Edition.objects.create(parent=parent, title=parent.title)
    items = list(parent.items.all())
    for item in items:
        item.pk, item.edition = None, draft
    Item.objects.bulk_create(items)
    return draft
