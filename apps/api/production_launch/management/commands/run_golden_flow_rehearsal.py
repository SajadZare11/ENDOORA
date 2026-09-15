from __future__ import annotations

from typing import Any
from django.core.management.base import BaseCommand
from production_launch.services.golden_flow_runner import GoldenFlowVerificationRunner


class Command(BaseCommand):
    help = "Runs synthetic automated rehearsals across all 7 Golden Flows (LAUNCH-001)."

    def handle(self, *args: Any, **options: Any) -> None:
        self.stdout.write(self.style.NOTICE("Initiating End-to-End Golden Flow Rehearsal..."))
        result = GoldenFlowVerificationRunner.run_rehearsal()

        self.stdout.write(
            self.style.SUCCESS(
                f"[SUCCESS] Golden Flow Rehearsal Completed:\n"
                f"  Run ID:       {result['run_id']}\n"
                f"  Overall Score:{result['score']}%\n"
                f"  Status:       {result['status']}\n"
                f"  Passed Flows: {result['passed_flows']} / {result['total_flows']}\n"
                f"  Duration:     {result['duration_ms']} ms"
            )
        )

        for flow in result["flows"]:
            self.stdout.write(f"  [OK] {flow['flow_id']} ({flow['duration_ms']} ms)")
