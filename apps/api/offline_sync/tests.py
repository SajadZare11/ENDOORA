from __future__ import annotations

import uuid
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import DraftType, OfflineDraft, OfflineSyncTelemetry
from .services.sync_service import SyncService
from .services.telemetry_service import OfflineTelemetryService

User = get_user_model()


class OfflineSyncTests(APITestCase):
    def setUp(self):
        self.learner = User.objects.create_user(
            email="learner_pwa@endoora.ir",
            password="SecureLearnerPassword123!",
            first_name="Learner",
            role="learner",
        )
        self.other_user = User.objects.create_user(
            email="other_pwa@endoora.ir",
            password="SecureOtherPassword123!",
            first_name="Other",
            role="learner",
        )
        self.admin = User.objects.create_user(
            email="admin_pwa@endoora.ir",
            password="SecureAdminPassword123!",
            first_name="Admin",
            role="administrator",
            is_staff=True,
        )

    def test_create_draft_authenticated(self):
        self.client.force_authenticate(user=self.learner)
        payload = {
            "draft_type": DraftType.WRITING_SUBMISSION,
            "resource_id": "prompt-101",
            "title": "مقاله زبان‌آموز",
            "content_json": {"body": "My essay introduction."},
            "client_version": 1,
        }
        resp = self.client.post("/api/drafts/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["title"], "مقاله زبان‌آموز")
        self.assertEqual(resp.data["server_version"], 1)
        self.assertTrue(bool(resp.data["checksum"]))

    def test_list_user_drafts_isolation(self):
        self.client.force_authenticate(user=self.learner)
        OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Learner Note",
            content_json={"note": "Learner secret"},
        )
        OfflineDraft.objects.create(
            user=self.other_user,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Other Note",
            content_json={"note": "Other secret"},
        )

        resp = self.client.get("/api/drafts/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]["title"], "Learner Note")

    def test_update_and_archive_draft(self):
        self.client.force_authenticate(user=self.learner)
        draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.TEACHER_NOTE,
            title="Initial Title",
            content_json={"text": "Initial body"},
            server_version=1,
        )

        # Update
        update_resp = self.client.put(
            f"/api/drafts/{draft.id}/",
            {"title": "Updated Title", "content_json": {"text": "Updated body"}},
            format="json",
        )
        self.assertEqual(update_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(update_resp.data["title"], "Updated Title")
        self.assertEqual(update_resp.data["server_version"], 2)

        # Archive (Delete)
        del_resp = self.client.delete(f"/api/drafts/{draft.id}/")
        self.assertEqual(del_resp.status_code, status.HTTP_200_OK)

        draft.refresh_from_db()
        self.assertTrue(draft.is_archived)

    def test_batch_sync_creates_and_updates(self):
        self.client.force_authenticate(user=self.learner)
        batch_payload = {
            "sync_session_id": "session-1234",
            "network_effective_type": "4g",
            "is_low_bandwidth": False,
            "payload_bytes": 1024,
            "drafts": [
                {
                    "draft_type": DraftType.WRITING_SUBMISSION,
                    "resource_id": "task-essay-01",
                    "title": "Offline Essay Draft",
                    "content_json": {"paragraph1": "In today's globalized world..."},
                    "client_version": 1,
                },
                {
                    "draft_type": DraftType.PLACEMENT_CHECKPOINT,
                    "resource_id": "placement-01",
                    "title": "Offline Placement",
                    "content_json": {"step": 3},
                    "client_version": 1,
                },
            ],
        }

        resp = self.client.post("/api/drafts/sync/", batch_payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["drafts_received"], 2)
        self.assertEqual(resp.data["drafts_updated"], 2)
        self.assertEqual(resp.data["conflicts_detected"], 0)
        self.assertEqual(len(resp.data["drafts"]), 2)

        # Telemetry should be created
        telemetry = OfflineSyncTelemetry.objects.filter(sync_session_id="session-1234").first()
        self.assertIsNotNone(telemetry)
        self.assertEqual(telemetry.drafts_received, 2)

    def test_batch_sync_detects_concurrency_conflict(self):
        self.client.force_authenticate(user=self.learner)
        # Server has a draft at version 3
        existing_draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            resource_id="shared-resource-1",
            title="Server Title v3",
            content_json={"text": "Server content updated from desktop"},
            server_version=3,
        )

        # Mobile sends update based on old client_version 1
        batch_payload = {
            "sync_session_id": "session-conflict",
            "drafts": [
                {
                    "id": str(existing_draft.id),
                    "draft_type": DraftType.GENERAL_DRAFT,
                    "resource_id": "shared-resource-1",
                    "title": "Mobile Title v1",
                    "content_json": {"text": "Mobile offline edits"},
                    "client_version": 1,
                }
            ],
        }

        resp = self.client.post("/api/drafts/sync/", batch_payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["conflicts_detected"], 1)

        existing_draft.refresh_from_db()
        self.assertTrue(existing_draft.is_conflict)
        self.assertIn("Mobile offline edits", str(existing_draft.conflict_backup))

    def test_batch_sync_sanitizes_malicious_script(self):
        self.client.force_authenticate(user=self.learner)
        batch_payload = {
            "drafts": [
                {
                    "draft_type": DraftType.GENERAL_DRAFT,
                    "title": "Safe Title <script>alert(1)</script>",
                    "content_json": {
                        "dangerous": "<script>evil()</script>",
                        "normal": "Safe content",
                    },
                    "client_version": 1,
                }
            ]
        }
        resp = self.client.post("/api/drafts/sync/", batch_payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        draft = resp.data["drafts"][0]
        self.assertNotIn("<script>", draft["title"])
        self.assertNotIn("<script>", str(draft["content_json"]))

    def test_resolve_conflict_keep_server(self):
        self.client.force_authenticate(user=self.learner)
        draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Server Title",
            content_json={"text": "Server Content"},
            server_version=2,
            is_conflict=True,
            conflict_backup={"content_json": {"text": "Client Content"}},
        )

        resp = self.client.post(
            f"/api/drafts/{draft.id}/resolve/",
            {"resolution": "keep_server"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        draft.refresh_from_db()
        self.assertFalse(draft.is_conflict)
        self.assertEqual(draft.content_json["text"], "Server Content")

    def test_resolve_conflict_keep_client(self):
        self.client.force_authenticate(user=self.learner)
        draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Server Title",
            content_json={"text": "Server Content"},
            server_version=2,
            is_conflict=True,
            conflict_backup={"content_json": {"text": "Client Content"}},
        )

        resp = self.client.post(
            f"/api/drafts/{draft.id}/resolve/",
            {"resolution": "keep_client"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        draft.refresh_from_db()
        self.assertFalse(draft.is_conflict)
        self.assertEqual(draft.content_json["text"], "Client Content")

    def test_resolve_conflict_custom_merge(self):
        self.client.force_authenticate(user=self.learner)
        draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Server Title",
            content_json={"text": "Server Content"},
            server_version=2,
            is_conflict=True,
            conflict_backup={"content_json": {"text": "Client Content"}},
        )

        resp = self.client.post(
            f"/api/drafts/{draft.id}/resolve/",
            {
                "resolution": "custom_merge",
                "chosen_content": {"text": "Manually Merged Content"},
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        draft.refresh_from_db()
        self.assertFalse(draft.is_conflict)
        self.assertEqual(draft.content_json["text"], "Manually Merged Content")

    def test_offline_ops_telemetry_requires_admin(self):
        # Learner gets 403 Forbidden
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get("/api/drafts/ops/telemetry/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Admin gets 200 OK
        self.client.force_authenticate(user=self.admin)
        resp_admin = self.client.get("/api/drafts/ops/telemetry/")
        self.assertEqual(resp_admin.status_code, status.HTTP_200_OK)
        self.assertIn("total_drafts_synced", resp_admin.data)
        self.assertIn("pwa_posture", resp_admin.data)
        self.assertIn("draft_distribution", resp_admin.data)

    def test_seed_offline_sync_telemetry_command(self):
        call_command("seed_offline_sync_telemetry")
        self.assertTrue(OfflineDraft.objects.exists())
        self.assertTrue(OfflineSyncTelemetry.objects.exists())

    def test_purge_stale_drafts_command(self):
        old_time = timezone.now() - timedelta(days=70)
        archived_draft = OfflineDraft.objects.create(
            user=self.learner,
            draft_type=DraftType.GENERAL_DRAFT,
            title="Stale Draft",
            is_archived=True,
        )
        OfflineDraft.objects.filter(id=archived_draft.id).update(server_updated_at=old_time)

        # Dry run
        call_command("purge_stale_drafts", "--dry-run")
        self.assertTrue(OfflineDraft.objects.filter(id=archived_draft.id).exists())

        # Real run
        call_command("purge_stale_drafts", "--days=60")
        self.assertFalse(OfflineDraft.objects.filter(id=archived_draft.id).exists())
