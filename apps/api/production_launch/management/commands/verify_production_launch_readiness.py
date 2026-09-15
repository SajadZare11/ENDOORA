from __future__ import annotations

from typing import Any
from django.core.management.base import BaseCommand
from production_launch.services.launch_gate_checklist import LaunchGateChecklistEvaluator


class Command(BaseCommand):
    help = "Evaluates the 10-Point Master Launch Readiness Matrix for Endoora (LAUNCH-001)."

    def handle(self, *args: Any, **options: Any) -> None:
        self.stdout.write(self.style.NOTICE("Evaluating Master Production Launch Gate..."))
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()

        self.stdout.write(
            self.style.SUCCESS(
                f"[SUCCESS] Production Launch Gate Evaluation:\n"
                f"  Score:         {scorecard['score']}%\n"
                f"  Status:        {scorecard['status']}\n"
                f"  Certification: {scorecard['certification']}\n"
                f"  Passed Checks: {scorecard['passed_count']} / {scorecard['total_checks']}\n"
                f"  Release Hash:  {scorecard['confirmation_hash'][:16]}..."
            )
        )

        for check in scorecard["checks"]:
            self.stdout.write(f"  [{check['status']}] {check['id']}: {check['category']}")
