from __future__ import annotations

import json
from typing import Any
from django.core.management.base import BaseCommand

from ai_gateway.services_ops import get_ai_operations_overview


class Command(BaseCommand):
    help = "Checks AI Gateway daily spend, token usage, circuit breaker status, and error budgets (OPS-005)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output AI operational status as JSON.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        overview = get_ai_operations_overview()

        if options["json"]:
            self.stdout.write(json.dumps(overview, indent=2))
            return

        budget = overview["budget_controls"]
        cb = overview["circuit_breaker"]
        sla = overview["sla_metrics"]

        self.stdout.write(
            self.style.SUCCESS(
                f"=== Endoora AI Gateway Operational Status (OPS-005) ===\n"
                f"Circuit Breaker: {cb['state']} (Provider: {cb['provider']}, Timeout: {cb['timeout_seconds']}s)\n"
                f"Daily Budget:    ${budget['current_spend_usd']} / ${budget['daily_budget_usd']} ({budget['spend_percentage']}% used)\n"
                f"Remaining:       ${budget['remaining_budget_usd']}\n"
                f"Tokens Today:    {budget['total_tokens_today']:,} tokens\n"
                f"SLA Performance: {sla['current_success_rate_pct']}% (Target: {sla['target_sla_pct']}%)\n"
                f"Error Budget:    {sla['error_budget_remaining_pct']}% remaining [{sla['budget_status']}]\n"
                f"Total Requests:  {sla['total_requests']} (Success: {sla['successful_requests']}, Fallbacks: {sla['fallback_activations']})"
            )
        )

        if budget["spend_percentage"] >= 90:
            self.stdout.write(self.style.WARNING("  [WARN] Daily spend exceeds 90% threshold!"))
        elif cb["state"] != "CLOSED":
            self.stdout.write(self.style.ERROR("  [ALERT] Circuit breaker is currently OPEN!"))
        else:
            self.stdout.write(self.style.SUCCESS("  [OK] AI Provider operating within SLA and budget ceilings."))
