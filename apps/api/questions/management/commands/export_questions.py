from __future__ import annotations

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from questions.services import export_document


class Command(BaseCommand):
    help = "Export the protected question bank to JSON for controlled editor backup/review."

    def add_arguments(self, parser):
        parser.add_argument("--output", required=True)

    def handle(self, *args, **options):
        output = Path(options["output"]).resolve()
        if output.exists():
            raise CommandError(
                f"Refusing to overwrite existing export: {output}. Choose a new filename."
            )
        output.parent.mkdir(parents=True, exist_ok=True)
        document = export_document()
        output.write_text(
            json.dumps(document, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Exported {len(document['items'])} protected question version(s) to {output}."
            )
        )
