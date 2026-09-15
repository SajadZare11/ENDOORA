from __future__ import annotations

import json
import sys
from typing import Any
from django.core.management.base import BaseCommand, CommandError
from production_launch.services.launch_gate_checklist import LaunchGateChecklistEvaluator


def write_line(out: Any, text: str) -> None:
    try:
        out.write(text)
    except UnicodeEncodeError:
        out.write(text.encode("ascii", errors="replace").decode("ascii"))


class Command(BaseCommand):
    help = "Evaluates the 10-Point Master Launch Readiness Matrix for Endoora (LAUNCH-001)."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output evaluation results formatted as JSON.",
        )
        parser.add_argument(
            "--verbose",
            action="store_true",
            help="Display detailed requirements and evidence for each check.",
        )
        parser.add_argument(
            "--min-score",
            type=int,
            default=100,
            help="Minimum passing score required for production release (default: 100).",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        if hasattr(sys.stdout, "reconfigure"):
            try:
                sys.stdout.reconfigure(encoding="utf-8")
            except Exception:
                pass

        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()

        if options.get("json"):
            write_line(self.stdout, json.dumps(scorecard, indent=2, ensure_ascii=False))
            min_score = options.get("min_score", 100)
            if scorecard["score"] < min_score:
                raise CommandError(f"Production readiness score {scorecard['score']}% below required {min_score}%.")
            return

        write_line(self.stdout, self.style.NOTICE("Evaluating Master Production Launch Gate..."))
        write_line(
            self.stdout,
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
            write_line(self.stdout, f"  [{check['status']}] {check['id']}: {check['category']}")
            if options.get("verbose"):
                write_line(self.stdout, f"       Requirement: {check['requirement']}")
                write_line(self.stdout, f"       Evidence:    {check['evidence']}")

        min_score = options.get("min_score", 100)
        if scorecard["score"] < min_score:
            raise CommandError(
                f"Production readiness score {scorecard['score']}% is below required threshold of {min_score}%."
            )
