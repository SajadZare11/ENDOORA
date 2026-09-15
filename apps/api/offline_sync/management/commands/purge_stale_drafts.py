from __future__ import annotations

from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

from offline_sync.models import OfflineDraft, OfflineSyncTelemetry


class Command(BaseCommand):
    help = "Purges archived drafts and old telemetry sessions to maintain database hygiene."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=60,
            help="Retention threshold in days for archived drafts and telemetry logs (default 60).",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simulate the purge without deleting records.",
        )

    def handle(self, *args, **options):
        retention_days = options["days"]
        dry_run = options["dry_run"]
        cutoff = timezone.now() - timedelta(days=retention_days)

        archived_qs = OfflineDraft.objects.filter(is_archived=True, server_updated_at__lt=cutoff)
        telemetry_qs = OfflineSyncTelemetry.objects.filter(created_at__lt=cutoff)

        drafts_count = archived_qs.count()
        telemetry_count = telemetry_qs.count()

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"[DRY RUN] Would purge {drafts_count} archived drafts and {telemetry_count} telemetry records older than {retention_days} days."
                )
            )
            return

        archived_qs.delete()
        telemetry_qs.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully purged {drafts_count} archived drafts and {telemetry_count} telemetry records."
            )
        )
