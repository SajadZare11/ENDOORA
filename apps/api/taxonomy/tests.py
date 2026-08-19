from __future__ import annotations

import json
import tempfile
from copy import deepcopy
from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import CommandError
from django.db import IntegrityError, transaction
from django.test import TestCase
from rest_framework.test import APIClient

from .models import TaxonomyNode, TaxonomyPrerequisite, TaxonomyRelease


class TaxonomyImportTests(TestCase):
    @classmethod
    def seed_path(cls) -> Path:
        return (
            Path(settings.REPO_ROOT)
            / "data"
            / "taxonomy"
            / "endoora_core_taxonomy.v1.json"
        )

    def load_seed(self) -> dict:
        return json.loads(self.seed_path().read_text(encoding="utf-8"))

    def write_temp_dataset(self, data: dict) -> str:
        handle = tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            encoding="utf-8",
            delete=False,
        )
        with handle:
            json.dump(data, handle, ensure_ascii=False, indent=2)
        self.addCleanup(lambda: Path(handle.name).unlink(missing_ok=True))
        return handle.name

    def test_import_is_idempotent_and_preserves_stable_ids(self):
        call_command("import_taxonomy")
        first_count = TaxonomyNode.objects.count()
        first_ids = {
            node.slug: node.id for node in TaxonomyNode.objects.all()
        }

        call_command("import_taxonomy")

        self.assertEqual(TaxonomyNode.objects.count(), first_count)
        self.assertEqual(TaxonomyRelease.objects.count(), 1)
        self.assertEqual(
            {node.slug: node.id for node in TaxonomyNode.objects.all()},
            first_ids,
        )

    def test_new_release_can_change_persian_label_without_changing_node_id(self):
        call_command("import_taxonomy")
        node = TaxonomyNode.objects.get(slug="skill-reading")
        original_id = node.id

        data = deepcopy(self.load_seed())
        data["version"] = "day12-v2-test"
        for payload in data["nodes"]:
            if payload["slug"] == "skill-reading":
                payload["label_fa"] = "مهارت خواندن"
                break

        call_command("import_taxonomy", path=self.write_temp_dataset(data))

        node.refresh_from_db()
        self.assertEqual(node.id, original_id)
        self.assertEqual(node.label_fa, "مهارت خواندن")
        self.assertEqual(node.revisions.count(), 2)

    def test_existing_release_cannot_be_rewritten(self):
        call_command("import_taxonomy")
        data = deepcopy(self.load_seed())
        data["notes"] = "tampered history"
        with self.assertRaises(CommandError):
            call_command("import_taxonomy", path=self.write_temp_dataset(data))

    def test_prerequisite_cycle_is_rejected(self):
        data = deepcopy(self.load_seed())
        data["version"] = "day12-cycle-test"
        data["prerequisites"] = [
            {
                "node": "objective-reading-main-idea-a2",
                "prerequisite": "objective-reading-gist-a1",
            },
            {
                "node": "objective-reading-gist-a1",
                "prerequisite": "objective-reading-main-idea-a2",
            },
        ]
        with self.assertRaises(CommandError):
            call_command("import_taxonomy", path=self.write_temp_dataset(data))

    def test_slug_is_unique_at_database_boundary(self):
        call_command("import_taxonomy")
        release = TaxonomyRelease.objects.get(version="day12-v1")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                TaxonomyNode.objects.create(
                    slug="skill-reading",
                    kind=TaxonomyNode.Kind.SKILL,
                    label_fa="تکراری",
                    label_en="Duplicate",
                    current_release=release,
                )


class TaxonomyApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_taxonomy")

    def setUp(self):
        self.client = APIClient()

    def test_default_api_language_is_persian(self):
        response = self.client.get("/api/taxonomy/nodes/?kind=skill&per_page=20")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data["count"], 9)
        reading = next(
            item for item in response.data["results"] if item["slug"] == "skill-reading"
        )
        self.assertEqual(reading["display_label"], reading["label_fa"])
        self.assertNotEqual(reading["label_fa"], reading["label_en"])

    def test_english_is_an_explicit_optional_language(self):
        response = self.client.get(
            "/api/taxonomy/nodes/?kind=skill&lang=en&per_page=20"
        )
        self.assertEqual(response.status_code, 200)
        reading = next(
            item for item in response.data["results"] if item["slug"] == "skill-reading"
        )
        self.assertEqual(reading["display_label"], reading["label_en"])

    def test_objective_lookup_filters_by_cefr(self):
        response = self.client.get("/api/taxonomy/objectives/?cefr=A2&per_page=100")
        self.assertEqual(response.status_code, 200)
        self.assertGreater(response.data["count"], 0)
        self.assertTrue(
            all(item["kind"] == "objective" for item in response.data["results"])
        )
        self.assertTrue(
            all(item["cefr_level"] == "A2" for item in response.data["results"])
        )

    def test_deprecated_node_remains_traceable_but_hidden_by_default(self):
        release = TaxonomyRelease.objects.get(version="day12-v1")
        node = TaxonomyNode.objects.create(
            slug="grammar-topic-legacy-example",
            kind=TaxonomyNode.Kind.GRAMMAR_TOPIC,
            label_fa="موضوع قدیمی",
            label_en="Legacy topic",
            status=TaxonomyNode.Status.DEPRECATED,
            current_release=release,
        )

        default_response = self.client.get(
            "/api/taxonomy/nodes/?kind=grammar_topic&per_page=100"
        )
        self.assertNotIn(
            str(node.id),
            [item["id"] for item in default_response.data["results"]],
        )

        history_response = self.client.get(
            "/api/taxonomy/nodes/?kind=grammar_topic&include_deprecated=1&per_page=100"
        )
        self.assertIn(
            str(node.id),
            [item["id"] for item in history_response.data["results"]],
        )

    def test_seed_contains_active_prerequisites(self):
        self.assertGreater(
            TaxonomyPrerequisite.objects.filter(retired_in__isnull=True).count(),
            0,
        )
