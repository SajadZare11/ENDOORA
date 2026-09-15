from __future__ import annotations

from typing import Any
from django.core.management.base import BaseCommand

from disaster_recovery.models import DatabaseBackupSnapshot
from disaster_recovery.services.backup_service import (
    create_database_backup,
    verify_backup_snapshot,
)


class Command(BaseCommand):
    help = "Generates an encrypted database backup snapshot with SHA-256 integrity check (OPS-004)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--type",
            type=str,
            default="full",
            choices=["full", "differential", "wal_archive"],
            help="Type of database backup to generate (default: full).",
        )
        parser.add_argument(
            "--verify",
            action="store_true",
            help="Immediately perform cryptographic SHA-256 verification after creation.",
        )
        parser.add_argument(
            "--notes",
            type=str,
            default="",
            help="Optional operational notes or reason for backup.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        backup_type = options["type"]
        should_verify = options["verify"]
        notes = options["notes"]

        self.stdout.write(self.style.NOTICE(f"Initiating {backup_type} database backup..."))
        snapshot = create_database_backup(backup_type=backup_type, notes=notes)

        self.stdout.write(
            self.style.SUCCESS(
                f"[SUCCESS] Backup created successfully:\n"
                f"  Snapshot ID: {snapshot.id}\n"
                f"  Backup Type: {snapshot.backup_type}\n"
                f"  Storage:     {snapshot.storage_location}\n"
                f"  Size:        {snapshot.file_size_bytes:,} bytes\n"
                f"  Checksum:    {snapshot.checksum_sha256}\n"
                f"  Status:      {snapshot.status}"
            )
        )

        if should_verify:
            self.stdout.write(self.style.NOTICE("Running cryptographic integrity verification..."))
            res = verify_backup_snapshot(snapshot.id)
            self.stdout.write(
                self.style.SUCCESS(
                    f"[VERIFIED] Verification completed in {res.get('verification_duration_ms')}ms:\n"
                    f"  Integrity:   {res.get('integrity_check')}\n"
                    f"  Status:      {res.get('status')}"
                )
            )
