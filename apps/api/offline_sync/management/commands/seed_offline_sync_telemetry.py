from __future__ import annotations

import uuid
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from offline_sync.models import DraftType, OfflineDraft, OfflineSyncTelemetry

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds offline sync drafts and telemetry data for development and testing."

    def handle(self, *args, **options):
        self.stdout.write("Seeding offline sync telemetry and sample drafts...")

        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                email="pwa_tester@endoora.ir",
                password="PwaSecurePassword123!",
                first_name="PWA",
                last_name="Tester",
            )

        # 1. Seed sample drafts
        sample_drafts = [
            {
                "draft_type": DraftType.WRITING_SUBMISSION,
                "resource_id": "prompt-ielts-task2-climate",
                "title": "مقاله آیلتس: چالش‌های تغییرات اقلیمی در خاورمیانه",
                "content_json": {
                    "text": "Climate change poses severe challenges for developing nations...",
                    "word_count": 184,
                    "target_band": 7.5,
                },
                "client_version": 2,
                "server_version": 2,
            },
            {
                "draft_type": DraftType.PLACEMENT_CHECKPOINT,
                "resource_id": "placement-session-2026",
                "title": "چک‌پوینت پاسخ‌های آزمون تعیین سطح",
                "content_json": {
                    "current_stage": "listening_b2",
                    "completed_items": 14,
                    "confidence_score": 0.88,
                },
                "client_version": 4,
                "server_version": 4,
            },
            {
                "draft_type": DraftType.TEACHER_NOTE,
                "resource_id": "class-session-phrasal-verbs",
                "title": "یادداشت‌های مدرس: بررسی خطاهای رایج افعال عبارتی",
                "content_json": {
                    "key_takeaways": ["put off vs call off", "look forward to + ing"],
                    "homework_assigned": True,
                },
                "client_version": 1,
                "server_version": 1,
            },
            {
                "draft_type": DraftType.ROLEPLAY_RESPONSE,
                "resource_id": "scenario-hotel-booking",
                "title": "مکالمه شبیه‌سازی: رزرو هتل و درخواست تخفیف",
                "content_json": {
                    "dialogue_turns": 6,
                    "politeness_markers": ["Would it be possible", "I was wondering if"],
                },
                "client_version": 1,
                "server_version": 1,
            },
        ]

        created_drafts = 0
        for data in sample_drafts:
            draft, created = OfflineDraft.objects.get_or_create(
                user=user,
                draft_type=data["draft_type"],
                resource_id=data["resource_id"],
                defaults={
                    "title": data["title"],
                    "content_json": data["content_json"],
                    "client_version": data["client_version"],
                    "server_version": data["server_version"],
                    "checksum": OfflineDraft.compute_content_checksum(data["content_json"]),
                    "client_updated_at": timezone.now(),
                },
            )
            if created:
                created_drafts += 1

        # 2. Seed a simulated conflict draft for testing resolution UI
        conflict_draft, _ = OfflineDraft.objects.get_or_create(
            user=user,
            draft_type=DraftType.GENERAL_DRAFT,
            resource_id="conflict-test-draft",
            defaults={
                "title": "پیش‌نویس دارای تداخل همزمانی (آزمایشی)",
                "content_json": {
                    "text": "Server version of this draft written from desktop browser.",
                    "notes": "Version 3 on server",
                },
                "client_version": 2,
                "server_version": 3,
                "checksum": OfflineDraft.compute_content_checksum({"notes": "Version 3 on server"}),
                "is_conflict": True,
                "conflict_backup": {
                    "title": "پیش‌نویس دارای تداخل همزمانی (آزمایشی) - ویرایش موبایل",
                    "content_json": {
                        "text": "Mobile offline draft revision written during commute.",
                        "notes": "Offline edit from mobile client",
                    },
                    "client_version": 2,
                    "checksum": OfflineDraft.compute_content_checksum({"notes": "Offline edit from mobile client"}),
                },
            },
        )

        # 3. Seed sync telemetry events
        networks = [
            ("4g", False, 1450, 4, 4, 0),
            ("3g", False, 820, 2, 2, 0),
            ("2g", True, 420, 1, 1, 0),
            ("slow-2g", True, 310, 1, 0, 1),
            ("4g", False, 2100, 5, 5, 0),
            ("3g", True, 950, 2, 2, 0),
        ]

        now = timezone.now()
        for idx, (net_type, low_band, b_size, rx, up, conf) in enumerate(networks):
            OfflineSyncTelemetry.objects.create(
                user=user,
                sync_session_id=f"sync-session-{uuid.uuid4().hex[:8]}",
                drafts_received=rx,
                drafts_updated=up,
                conflicts_detected=conf,
                payload_bytes=b_size,
                network_effective_type=net_type,
                is_low_bandwidth=low_band,
                client_user_agent="Mozilla/5.0 (Linux; Android 14; EndooraPWA/1.0)",
                created_at=now - timedelta(hours=idx * 3),
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded offline sync telemetry: {created_drafts} drafts created, 6 telemetry sessions."
            )
        )
