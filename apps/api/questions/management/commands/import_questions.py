from __future__ import annotations

import json
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from questions.services import import_document


class Command(BaseCommand):
    help = "Validate and import a question-bank JSON file as draft-only content."

    def add_arguments(self, parser):
        parser.add_argument("--path", required=True)
        parser.add_argument("--author-email")

    def handle(self, *args, **options):
        path = Path(options["path"]).resolve()
        if not path.is_file():
            raise CommandError(f"Question import file not found: {path}")
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise CommandError(f"Could not read valid JSON: {exc}") from exc

        author = None
        email = options.get("author_email")
        if email:
            User = get_user_model()
            try:
                author = User.objects.get(email=email.strip().lower())
            except User.DoesNotExist as exc:
                raise CommandError(
                    "No existing Endoora user matches --author-email. "
                    "Do not create a privileged user automatically."
                ) from exc
            if (
                getattr(author, "role", None) not in {"editor", "administrator"}
                and not author.is_superuser
            ):
                raise CommandError(
                    "--author-email must belong to an editor/administrator or superuser."
                )

        try:
            result = import_document(document, author=author)
        except ValidationError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"Question import complete: created={result['created']}, "
                f"skipped={result['skipped']}. Imported items remain DRAFT."
            )
        )
