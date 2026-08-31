from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "apps/api/taxonomy/__init__.py",
    "apps/api/taxonomy/apps.py",
    "apps/api/taxonomy/models.py",
    "apps/api/taxonomy/serializers.py",
    "apps/api/taxonomy/views.py",
    "apps/api/taxonomy/urls.py",
    "apps/api/taxonomy/admin.py",
    "apps/api/taxonomy/tests.py",
    "apps/api/taxonomy/migrations/0001_initial.py",
    "apps/api/taxonomy/management/commands/import_taxonomy.py",
    "data/taxonomy/endoora_core_taxonomy.v1.json",
    "docs/content/taxonomy-governance.md",
]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"Day 12 static check failed: {message}")


for relative in REQUIRED_FILES:
    require((ROOT / relative).is_file(), f"missing {relative}")

settings_text = (
    ROOT / "apps/api/endoora_api/settings/base.py"
).read_text(encoding="utf-8")
urls_text = (
    ROOT / "apps/api/endoora_api/urls.py"
).read_text(encoding="utf-8")
models_text = (
    ROOT / "apps/api/taxonomy/models.py"
).read_text(encoding="utf-8")
admin_text = (
    ROOT / "apps/api/taxonomy/admin.py"
).read_text(encoding="utf-8")
import_text = (
    ROOT / "apps/api/taxonomy/management/commands/import_taxonomy.py"
).read_text(encoding="utf-8")
views_text = (ROOT / "apps/api/taxonomy/views.py").read_text(encoding="utf-8")

require('"taxonomy"' in settings_text, "taxonomy is not in INSTALLED_APPS")
require(
    'path("api/taxonomy/", include("taxonomy.urls"))' in urls_text,
    "taxonomy API route is not registered",
)
require("UUIDField" in models_text, "stable UUID identifiers are missing")
require("slug = models.SlugField" in models_text, "stable slugs are missing")
require("DEPRECATED" in models_text, "deprecation state is missing")
require("TaxonomyNodeRevision" in models_text, "taxonomy revision history is missing")
require("TaxonomyPrerequisite" in models_text, "prerequisite model is missing")
require(
    "has_delete_permission" in admin_text,
    "admin deletion protection is missing",
)
require(
    "validate_acyclic" in import_text,
    "prerequisite cycle protection is missing",
)
require(
    "different checksum" in import_text,
    "immutable release protection is missing",
)
require(
    "include_deprecated" in views_text,
    "deprecated detail/list visibility control is missing",
)

seed_path = ROOT / "data/taxonomy/endoora_core_taxonomy.v1.json"
seed = json.loads(seed_path.read_text(encoding="utf-8"))
nodes = seed.get("nodes", [])
slugs = [node["slug"] for node in nodes]
require(len(slugs) == len(set(slugs)), "seed contains duplicate slugs")

skills = [node for node in nodes if node.get("kind") == "skill"]
require(len(skills) >= 9, "seed must include 9 top-level skill domains")
require(
    all(node.get("label_fa") and node.get("label_en") for node in nodes),
    "every seed node needs Persian and English labels",
)
require(
    all(node["slug"].isascii() for node in nodes),
    "machine slugs must remain language-neutral ASCII",
)
require(
    any(node.get("kind") == "grammar_topic" for node in nodes),
    "grammar topic tree is missing",
)
require(
    any(node.get("kind") == "vocabulary_topic" for node in nodes),
    "vocabulary topic tree is missing",
)
require(
    any(node.get("kind") == "age_tag" for node in nodes),
    "age tags are missing",
)
require(
    any(node.get("kind") == "exam_tag" for node in nodes),
    "exam tags are missing",
)
require(seed.get("prerequisites"), "content prerequisites are missing")

print(
    "Day 12 static checks passed: taxonomy app, stable UUID/slugs, Persian-first "
    "bilingual labels, CEFR/objective structure, topic/tag trees, versioned import, "
    "deprecation traceability, prerequisite cycle protection, admin safety, and API route."
)
