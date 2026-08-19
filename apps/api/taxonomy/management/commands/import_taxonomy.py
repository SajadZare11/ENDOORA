from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from taxonomy.models import (
    TaxonomyNode,
    TaxonomyNodeRevision,
    TaxonomyPrerequisite,
    TaxonomyRelease,
)


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def canonical_checksum(value) -> str:
    payload = json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def validate_dataset(data: dict) -> None:
    if not isinstance(data, dict):
        raise CommandError("Taxonomy file must contain one JSON object.")

    version = data.get("version")
    nodes = data.get("nodes")
    prerequisites = data.get("prerequisites", [])

    if not isinstance(version, str) or not SLUG_RE.fullmatch(version):
        raise CommandError(
            "Taxonomy 'version' must be a lowercase slug such as day12-v1."
        )
    if not isinstance(nodes, list) or not nodes:
        raise CommandError("Taxonomy 'nodes' must be a non-empty list.")
    if not isinstance(prerequisites, list):
        raise CommandError("Taxonomy 'prerequisites' must be a list.")

    allowed_kinds = set(TaxonomyNode.Kind.values)
    allowed_statuses = set(TaxonomyNode.Status.values)
    allowed_cefr = {"", *TaxonomyNode.CefrLevel.values}

    seen_slugs: set[str] = set()
    for index, node in enumerate(nodes, start=1):
        if not isinstance(node, dict):
            raise CommandError(f"Node #{index} must be an object.")

        slug = node.get("slug")
        if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
            raise CommandError(f"Node #{index} has an invalid slug: {slug!r}")
        if slug in seen_slugs:
            raise CommandError(f"Duplicate taxonomy slug in JSON: {slug}")
        seen_slugs.add(slug)

        if node.get("kind") not in allowed_kinds:
            raise CommandError(f"{slug}: unsupported kind {node.get('kind')!r}")
        if node.get("status", "active") not in allowed_statuses:
            raise CommandError(f"{slug}: unsupported status.")
        if node.get("cefr_level", "") not in allowed_cefr:
            raise CommandError(f"{slug}: unsupported CEFR level.")
        if not str(node.get("label_fa", "")).strip():
            raise CommandError(f"{slug}: label_fa is required.")
        if not str(node.get("label_en", "")).strip():
            raise CommandError(f"{slug}: label_en is required.")

    for node in nodes:
        for key in ("parent", "replacement"):
            ref = node.get(key)
            if ref and ref not in seen_slugs:
                raise CommandError(
                    f"{node['slug']}: {key}={ref!r} must refer to a node in this dataset."
                )

    desired_edges: list[tuple[str, str]] = []
    for index, item in enumerate(prerequisites, start=1):
        if not isinstance(item, dict):
            raise CommandError(f"Prerequisite #{index} must be an object.")
        node_slug = item.get("node")
        prerequisite_slug = item.get("prerequisite")
        if node_slug not in seen_slugs or prerequisite_slug not in seen_slugs:
            raise CommandError(
                f"Prerequisite #{index} references an unknown node."
            )
        if node_slug == prerequisite_slug:
            raise CommandError(f"{node_slug}: a node cannot require itself.")
        desired_edges.append((node_slug, prerequisite_slug))

    validate_acyclic(desired_edges)


def validate_acyclic(edges: list[tuple[str, str]]) -> None:
    graph: dict[str, list[str]] = {}
    for node_slug, prerequisite_slug in edges:
        graph.setdefault(node_slug, []).append(prerequisite_slug)
        graph.setdefault(prerequisite_slug, [])

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(slug: str):
        if slug in visiting:
            raise CommandError(
                f"Prerequisite cycle detected at {slug}. Taxonomy prerequisites must be acyclic."
            )
        if slug in visited:
            return
        visiting.add(slug)
        for neighbor in graph.get(slug, []):
            visit(neighbor)
        visiting.remove(slug)
        visited.add(slug)

    for slug in graph:
        visit(slug)


class Command(BaseCommand):
    help = "Import/version Endoora taxonomy JSON without changing stable node IDs."

    def add_arguments(self, parser):
        default_path = (
            Path(settings.REPO_ROOT)
            / "data"
            / "taxonomy"
            / "endoora_core_taxonomy.v1.json"
        )
        parser.add_argument(
            "--path",
            default=str(default_path),
            help="Path to the taxonomy JSON file.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validate and execute inside a transaction, then roll back.",
        )

    def handle(self, *args, **options):
        path = Path(options["path"]).resolve()
        if not path.is_file():
            raise CommandError(f"Taxonomy file not found: {path}")

        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise CommandError(f"Invalid JSON: {exc}") from exc

        validate_dataset(data)
        file_checksum = canonical_checksum(data)
        version = data["version"]

        with transaction.atomic():
            release, release_created = TaxonomyRelease.objects.get_or_create(
                version=version,
                defaults={
                    "checksum": file_checksum,
                    "source_path": str(path),
                    "notes": str(data.get("notes", "")),
                },
            )
            if not release_created and release.checksum != file_checksum:
                raise CommandError(
                    f"Release {version!r} already exists with a different checksum. "
                    "Create a new version instead of rewriting taxonomy history."
                )

            created_nodes = 0
            updated_nodes = 0
            revision_count = 0
            nodes_by_slug: dict[str, TaxonomyNode] = {}

            scalar_fields = (
                "kind",
                "label_fa",
                "label_en",
                "description_fa",
                "description_en",
                "cefr_level",
                "descriptor_reference",
                "source_name",
                "source_url",
                "license_note",
                "estimated_effort_minutes",
                "status",
                "metadata",
                "sort_order",
            )

            for payload in data["nodes"]:
                defaults = {
                    "kind": payload["kind"],
                    "label_fa": payload["label_fa"].strip(),
                    "label_en": payload["label_en"].strip(),
                    "description_fa": payload.get("description_fa", "").strip(),
                    "description_en": payload.get("description_en", "").strip(),
                    "cefr_level": payload.get("cefr_level", ""),
                    "descriptor_reference": payload.get("descriptor_reference", "").strip(),
                    "source_name": payload.get("source_name", "").strip(),
                    "source_url": payload.get("source_url", "").strip(),
                    "license_note": payload.get("license_note", "").strip(),
                    "estimated_effort_minutes": payload.get("estimated_effort_minutes"),
                    "status": payload.get("status", TaxonomyNode.Status.ACTIVE),
                    "metadata": payload.get("metadata", {}),
                    "sort_order": int(payload.get("sort_order", 0)),
                    "current_release": release,
                }

                node, created = TaxonomyNode.objects.get_or_create(
                    slug=payload["slug"],
                    defaults=defaults,
                )
                changed = created

                if not created:
                    for field in scalar_fields:
                        new_value = defaults[field]
                        if getattr(node, field) != new_value:
                            setattr(node, field, new_value)
                            changed = True
                    if node.current_release_id != release.id:
                        node.current_release = release
                        changed = True

                if created:
                    created_nodes += 1
                elif changed:
                    updated_nodes += 1

                # Parent/replacement references are attached in the second pass.
                # The entire operation is atomic, so no half-linked state can commit.
                node.save()
                nodes_by_slug[node.slug] = node

            for payload in data["nodes"]:
                node = nodes_by_slug[payload["slug"]]
                parent_slug = payload.get("parent")
                replacement_slug = payload.get("replacement")
                parent = nodes_by_slug.get(parent_slug) if parent_slug else None
                replacement = (
                    nodes_by_slug.get(replacement_slug) if replacement_slug else None
                )

                relation_changed = False
                if node.parent_id != (parent.id if parent else None):
                    node.parent = parent
                    relation_changed = True
                if node.replacement_id != (replacement.id if replacement else None):
                    node.replacement = replacement
                    relation_changed = True

                node.full_clean()
                if relation_changed:
                    node.save(update_fields=("parent", "replacement", "updated_at"))
                    if not release_created:
                        updated_nodes += 1

                snapshot = {
                    "slug": node.slug,
                    "kind": node.kind,
                    "parent": node.parent.slug if node.parent_id else None,
                    "label_fa": node.label_fa,
                    "label_en": node.label_en,
                    "description_fa": node.description_fa,
                    "description_en": node.description_en,
                    "cefr_level": node.cefr_level,
                    "descriptor_reference": node.descriptor_reference,
                    "source_name": node.source_name,
                    "source_url": node.source_url,
                    "license_note": node.license_note,
                    "estimated_effort_minutes": node.estimated_effort_minutes,
                    "status": node.status,
                    "replacement": node.replacement.slug if node.replacement_id else None,
                    "metadata": node.metadata,
                    "sort_order": node.sort_order,
                }
                snapshot_checksum = canonical_checksum(snapshot)
                _, revision_created = TaxonomyNodeRevision.objects.get_or_create(
                    node=node,
                    release=release,
                    defaults={
                        "checksum": snapshot_checksum,
                        "snapshot": snapshot,
                    },
                )
                if revision_created:
                    revision_count += 1

            desired_pairs = {
                (item["node"], item["prerequisite"])
                for item in data.get("prerequisites", [])
            }
            imported_slugs = set(nodes_by_slug)

            active_links = TaxonomyPrerequisite.objects.filter(
                retired_in__isnull=True,
                node__slug__in=imported_slugs,
            ).select_related("node", "prerequisite")

            retired_count = 0
            for link in active_links:
                pair = (link.node.slug, link.prerequisite.slug)
                if pair not in desired_pairs:
                    link.retired_in = release
                    link.save(update_fields=("retired_in",))
                    retired_count += 1

            created_prerequisites = 0
            for node_slug, prerequisite_slug in sorted(desired_pairs):
                exists = TaxonomyPrerequisite.objects.filter(
                    node=nodes_by_slug[node_slug],
                    prerequisite=nodes_by_slug[prerequisite_slug],
                    retired_in__isnull=True,
                ).exists()
                if not exists:
                    link = TaxonomyPrerequisite(
                        node=nodes_by_slug[node_slug],
                        prerequisite=nodes_by_slug[prerequisite_slug],
                        introduced_in=release,
                    )
                    link.full_clean()
                    link.save()
                    created_prerequisites += 1

            if options["dry_run"]:
                transaction.set_rollback(True)

        mode = "DRY RUN (rolled back)" if options["dry_run"] else "IMPORTED"
        self.stdout.write(
            self.style.SUCCESS(
                f"{mode}: release={version}, nodes={len(nodes_by_slug)}, "
                f"created={created_nodes}, updated={updated_nodes}, "
                f"revisions={revision_count}, prerequisites_added={created_prerequisites}, "
                f"prerequisites_retired={retired_count}"
            )
        )
