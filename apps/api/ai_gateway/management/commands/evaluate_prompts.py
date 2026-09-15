from __future__ import annotations

import json
from typing import Any
from django.core.management.base import BaseCommand

from ai_gateway.prompt_registry import PROMPT_REGISTRY
from ai_gateway.services_ops import test_evaluate_prompt


class Command(BaseCommand):
    help = "Evaluates all registered prompt templates for schema integrity and pedagogical constraints (OPS-005)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output evaluation results as JSON.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        results = []
        all_passed = True

        for prompt_id in PROMPT_REGISTRY:
            res = test_evaluate_prompt(prompt_id)
            results.append(res)
            if res.get("status") != "PASS":
                all_passed = False

        if options["json"]:
            self.stdout.write(json.dumps(results, indent=2))
            return

        self.stdout.write(
            self.style.SUCCESS(f"=== Evaluated {len(results)} Prompt Templates in Registry ===")
        )

        for r in results:
            if r.get("status") == "PASS":
                self.stdout.write(
                    self.style.SUCCESS(
                        f"  * {r['prompt_id']} (v{r['version']}) [{r['feature']}]: "
                        f"Score={r['benchmark_score']}%, Tokens={r['token_estimate']}, Duration={r['evaluation_duration_ms']}ms [PASS]"
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(
                        f"  * {r['prompt_id']} FAIL: {r.get('error')}"
                    )
                )

        if all_passed:
            self.stdout.write(self.style.SUCCESS("\n[SUCCESS] All prompt templates validated with 100% schema conformity."))
        else:
            self.stdout.write(self.style.ERROR("\n[FAILURE] One or more prompt templates failed validation."))
