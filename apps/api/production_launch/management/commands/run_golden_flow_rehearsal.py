from __future__ import annotations

import json
import sys
from typing import Any
from django.core.management.base import BaseCommand
from production_launch.services.golden_flow_runner import GoldenFlowVerificationRunner


def write_line(out: Any, text: str) -> None:
    try:
        out.write(text)
    except UnicodeEncodeError:
        out.write(text.encode("ascii", errors="replace").decode("ascii"))


class Command(BaseCommand):
    help = "Runs synthetic automated rehearsals across all 7 Golden Flows (LAUNCH-001)."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output results formatted as JSON.",
        )
        parser.add_argument(
            "--verbose",
            action="store_true",
            help="Display detailed verification steps and evidence.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        if hasattr(sys.stdout, "reconfigure"):
            try:
                sys.stdout.reconfigure(encoding="utf-8")
            except Exception:
                pass

        result = GoldenFlowVerificationRunner.run_rehearsal()

        if options.get("json"):
            write_line(self.stdout, json.dumps(result, indent=2, ensure_ascii=False))
            return

        write_line(self.stdout, self.style.NOTICE("Initiating End-to-End Golden Flow Rehearsal..."))
        write_line(
            self.stdout,
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
            write_line(self.stdout, f"  [OK] {flow['flow_id']} ({flow['duration_ms']} ms)")
            if options.get("verbose"):
                for step in flow.get("steps", []):
                    write_line(self.stdout, f"       -> Step {step['step']}: {step['description']} [{step['status']}]")
                write_line(self.stdout, f"       Evidence: {flow.get('evidence')}")
