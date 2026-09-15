from __future__ import annotations

from typing import Any
from django.core.management.base import BaseCommand
from incident_response.services.runbook_service import RunbookService


class Command(BaseCommand):
    help = "Seeds and updates official mission-critical operational runbooks (OPS-009)."

    def handle(self, *args: Any, **options: Any) -> None:
        self.stdout.write(self.style.NOTICE("Synchronizing official operational runbooks..."))
        count = RunbookService.sync_official_runbooks()
        self.stdout.write(
            self.style.SUCCESS(
                f"[SUCCESS] Successfully synchronized {count} operational runbooks:\n"
                f"  - db-failover-recovery\n"
                f"  - payment-gateway-outage\n"
                f"  - ai-quota-exhaustion\n"
                f"  - auth-credential-stuffing\n"
                f"  - storage-unavailability\n"
                f"  - ddos-rate-limiting"
            )
        )
