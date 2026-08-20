from __future__ import annotations

from copy import deepcopy
from typing import Any

from django.core.exceptions import ValidationError
from django.db import transaction

from taxonomy.models import TaxonomyNode

from .models import Question, QuestionMedia, QuestionObjective, QuestionVersion


REQUIRED_ITEM_FIELDS = {
    "slug",
    "version_number",
    "question_type",
    "prompt_en",
    "cefr_level",
    "difficulty",
    "objective_slugs",
    "source",
}


def validate_import_document(document: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(document, dict):
        return ["Import document must be a JSON object."]
    if not isinstance(document.get("version"), str) or not document["version"].strip():
        errors.append("Root 'version' must be a non-empty string.")
    items = document.get("items")
    if not isinstance(items, list) or not items:
        errors.append("Root 'items' must be a non-empty list.")
        return errors

    allowed_types = {choice for choice, _ in QuestionVersion.QuestionType.choices}
    allowed_cefr = {choice for choice, _ in QuestionVersion.CefrLevel.choices}
    allowed_origins = {choice for choice, _ in QuestionVersion.SourceOrigin.choices if choice}
    allowed_licenses = {choice for choice, _ in QuestionVersion.LicenseType.choices if choice}
    seen: set[tuple[str, int]] = set()

    for index, item in enumerate(items):
        prefix = f"items[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object.")
            continue
        missing = sorted(REQUIRED_ITEM_FIELDS - set(item))
        if missing:
            errors.append(f"{prefix} missing required fields: {', '.join(missing)}")
            continue

        try:
            version_number = int(item["version_number"])
        except (TypeError, ValueError):
            version_number = -1
        key = (str(item["slug"]), version_number)
        if key in seen:
            errors.append(f"{prefix} duplicates slug/version {key[0]} v{key[1]}.")
        seen.add(key)

        if str(item["slug"]) != str(item["slug"]).lower():
            errors.append(f"{prefix}.slug must be lowercase.")
        if version_number < 1:
            errors.append(f"{prefix}.version_number must be a positive integer.")
        if item["question_type"] not in allowed_types:
            errors.append(f"{prefix}.question_type is unsupported.")
        if item["cefr_level"] not in allowed_cefr:
            errors.append(f"{prefix}.cefr_level must be A1-C2.")
        if not isinstance(item["difficulty"], int) or not 1 <= item["difficulty"] <= 5:
            errors.append(f"{prefix}.difficulty must be an integer from 1 to 5.")
        if not isinstance(item["objective_slugs"], list) or not item["objective_slugs"]:
            errors.append(f"{prefix}.objective_slugs must be a non-empty list.")

        source = item["source"]
        if not isinstance(source, dict):
            errors.append(f"{prefix}.source must be an object.")
        else:
            if source.get("origin") not in allowed_origins:
                errors.append(f"{prefix}.source.origin is required and unsupported.")
            if source.get("license_type") not in allowed_licenses:
                errors.append(f"{prefix}.source.license_type is required and unsupported.")
            if not str(source.get("title", "")).strip():
                errors.append(f"{prefix}.source.title is required.")
    return errors


def _version_matches_item(version: QuestionVersion, item: dict[str, Any]) -> bool:
    source = item["source"]
    comparable = {
        "question_type": item["question_type"],
        "title_fa": item.get("title_fa", ""),
        "title_en": item.get("title_en", ""),
        "prompt_fa": item.get("prompt_fa", ""),
        "prompt_en": item["prompt_en"],
        "instructions_fa": item.get("instructions_fa", ""),
        "instructions_en": item.get("instructions_en", ""),
        "cefr_level": item["cefr_level"],
        "difficulty": item["difficulty"],
        "learner_payload": item.get("learner_payload", {}),
        "answer_key": item.get("answer_key", {}),
        "accepted_variants": item.get("accepted_variants", []),
        "explanation_fa": item.get("explanation_fa", ""),
        "explanation_en": item.get("explanation_en", ""),
        "rubric": item.get("rubric", {}),
        "source_origin": source["origin"],
        "source_title": source["title"],
        "source_url": source.get("url", ""),
        "license_type": source["license_type"],
        "license_reference": source.get("license_reference", ""),
        "rights_holder": source.get("rights_holder", ""),
    }
    if any(getattr(version, field) != value for field, value in comparable.items()):
        return False
    existing_objectives = sorted(
        link.objective.slug for link in version.objective_links.all()
    )
    return existing_objectives == sorted(item["objective_slugs"])


@transaction.atomic
def import_document(document: dict[str, Any], *, author=None) -> dict[str, int]:
    errors = validate_import_document(document)
    if errors:
        raise ValidationError({"document": errors})

    created = 0
    skipped = 0

    for index, item in enumerate(document["items"]):
        objective_slugs = list(dict.fromkeys(item["objective_slugs"]))
        objective_rows = list(
            TaxonomyNode.objects.filter(
                slug__in=objective_slugs,
                kind=TaxonomyNode.Kind.OBJECTIVE,
            )
        )
        objective_map = {node.slug: node for node in objective_rows}
        found = set(objective_map)
        missing = sorted(set(objective_slugs) - found)
        if missing:
            raise ValidationError(
                {
                    f"items[{index}].objective_slugs":
                        f"Unknown/non-objective slugs: {', '.join(missing)}"
                }
            )

        question, _ = Question.objects.get_or_create(
            slug=item["slug"],
            defaults={"created_by": author},
        )
        existing = (
            QuestionVersion.objects.filter(
                question=question,
                version_number=item["version_number"],
            )
            .prefetch_related("objective_links__objective")
            .first()
        )
        if existing:
            if _version_matches_item(existing, item):
                skipped += 1
                continue
            raise ValidationError(
                {
                    f"items[{index}]": (
                        "This slug/version already exists with different content. "
                        "Create a new immutable version number instead of overwriting it."
                    )
                }
            )

        source = item["source"]
        version = QuestionVersion(
            question=question,
            version_number=item["version_number"],
            question_type=item["question_type"],
            status=QuestionVersion.Status.DRAFT,
            title_fa=item.get("title_fa", ""),
            title_en=item.get("title_en", ""),
            prompt_fa=item.get("prompt_fa", ""),
            prompt_en=item["prompt_en"],
            instructions_fa=item.get("instructions_fa", ""),
            instructions_en=item.get("instructions_en", ""),
            cefr_level=item["cefr_level"],
            difficulty=item["difficulty"],
            learner_payload=deepcopy(item.get("learner_payload", {})),
            answer_key=deepcopy(item.get("answer_key", {})),
            accepted_variants=deepcopy(item.get("accepted_variants", [])),
            explanation_fa=item.get("explanation_fa", ""),
            explanation_en=item.get("explanation_en", ""),
            rubric=deepcopy(item.get("rubric", {})),
            source_origin=source["origin"],
            source_title=source["title"],
            source_url=source.get("url", ""),
            license_type=source["license_type"],
            license_reference=source.get("license_reference", ""),
            rights_holder=source.get("rights_holder", ""),
            author=author,
        )
        version.full_clean()
        version.save()

        objectives = [objective_map[slug] for slug in objective_slugs]
        for position, objective in enumerate(objectives):
            QuestionObjective.objects.create(
                version=version,
                objective=objective,
                is_primary=(position == 0),
            )

        for media_payload in item.get("media", []):
            media = QuestionMedia(version=version, **media_payload)
            media.full_clean()
            media.save()

        created += 1

    return {"created": created, "skipped": skipped}


def export_document(queryset=None) -> dict[str, Any]:
    qs = queryset or QuestionVersion.objects.all()
    qs = qs.select_related("question").prefetch_related(
        "objective_links__objective", "media"
    )
    items = []
    for version in qs:
        items.append(
            {
                "slug": version.question.slug,
                "version_number": version.version_number,
                "question_type": version.question_type,
                "status": version.status,
                "title_fa": version.title_fa,
                "title_en": version.title_en,
                "prompt_fa": version.prompt_fa,
                "prompt_en": version.prompt_en,
                "instructions_fa": version.instructions_fa,
                "instructions_en": version.instructions_en,
                "cefr_level": version.cefr_level,
                "difficulty": version.difficulty,
                "learner_payload": version.learner_payload,
                "answer_key": version.answer_key,
                "accepted_variants": version.accepted_variants,
                "explanation_fa": version.explanation_fa,
                "explanation_en": version.explanation_en,
                "rubric": version.rubric,
                "objective_slugs": [
                    link.objective.slug for link in version.objective_links.all()
                ],
                "source": {
                    "origin": version.source_origin,
                    "title": version.source_title,
                    "url": version.source_url,
                    "license_type": version.license_type,
                    "license_reference": version.license_reference,
                    "rights_holder": version.rights_holder,
                },
                "media": [
                    {
                        "media_type": media.media_type,
                        "asset_url": media.asset_url,
                        "storage_key": media.storage_key,
                        "mime_type": media.mime_type,
                        "checksum_sha256": media.checksum_sha256,
                        "duration_seconds": media.duration_seconds,
                        "alt_text_fa": media.alt_text_fa,
                        "alt_text_en": media.alt_text_en,
                        "transcript_fa": media.transcript_fa,
                        "transcript_en": media.transcript_en,
                        "source_title": media.source_title,
                        "license_type": media.license_type,
                        "license_reference": media.license_reference,
                        "rights_holder": media.rights_holder,
                        "is_learner_visible": media.is_learner_visible,
                    }
                    for media in version.media.all()
                ],
            }
        )
    return {"version": "day13-export-v1", "items": items}
