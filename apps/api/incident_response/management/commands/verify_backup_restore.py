from __future__ import annotations

from typing import Any
from django.core.management.base import BaseCommand
from incident_response.services.restore_service import RestoreVerificationService


class Command(BaseCommand):
    help = "Executes an automated backup restore verification drill (OPS-009)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--snapshot-id",
            type=str,
            default=None,
            help="Optional UUID of the DatabaseBackupSnapshot to restore.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Run verification in dry-run mode without modifying target sandbox.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        snapshot_id = options.get("snapshot_id")
        dry_run = options.get("dry_run", False)

        self.stdout.write(self.style.NOTICE(f"Initiating restore verification (dry_run={dry_run})..."))
        log = RestoreVerificationService.verify_backup_restore(
            snapshot_id=snapshot_id, dry_run=dry_run
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"[SUCCESS] Restore verification finished:\n"
                f"  Log ID:      {log.id}\n"
                f"  Status:      {log.status}\n"
                f"  Checksum OK: {log.checksum_verified}\n"
                f"  Tables:      {log.tables_restored_count}\n"
                f"  Records:     {log.records_sampled_count}\n"
                f"  Duration:    {log.duration_ms} ms"
            )
        )
