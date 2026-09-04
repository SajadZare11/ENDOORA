import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from questions.models import Question, QuestionVersion


class Command(BaseCommand):
    help = "Seed and validate Grammar, Vocabulary, Reading, and Listening placement test items."

    def add_arguments(self, parser):
        parser.add_argument(
            "--sync-questions",
            action="store_true",
            help="Synchronize items with Question/QuestionVersion models in question bank.",
        )

    def handle(self, *args, **options):
        root = getattr(settings, "REPO_ROOT", Path(__file__).resolve().parents[5])
        items_path = root / "data" / "placement" / "core-items.json"

        if not items_path.is_file():
            raise CommandError(f"Placement core items not found at: {items_path}")

        try:
            items = json.loads(items_path.read_text(encoding="utf-8-sig"))
        except Exception as exc:
            raise CommandError(f"Failed to parse placement items JSON: {exc}") from exc

        sections_count: dict[str, int] = {}
        for item in items:
            sec = item.get("section", "").lower()
            if sec not in ("grammar", "vocabulary", "reading", "listening"):
                raise CommandError(f"Invalid placement section in item {item.get('id')}: {sec}")
            sections_count[sec] = sections_count.get(sec, 0) + 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Validated {len(items)} placement items across sections: "
                + ", ".join(f"{k}: {v}" for k, v in sorted(sections_count.items()))
            )
        )

        if options.get("sync_questions"):
            created_q = 0
            for item in items:
                slug = f"placement-{item['id']}"
                question, _ = Question.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "cefr_level": item.get("cefr_level", "A1").lower(),
                        "question_type": "single_choice",
                    },
                )
                qv, qv_created = QuestionVersion.objects.get_or_create(
                    question=question,
                    version_number=1,
                    defaults={
                        "status": QuestionVersion.Status.PUBLISHED,
                        "difficulty": 1 if item.get("difficulty") == "easy" else (3 if item.get("difficulty") == "medium" else 5),
                        "author_payload": {
                            "prompt_en": item.get("question"),
                            "prompt_fa": item.get("prompt_fa", ""),
                            "options": item.get("options", []),
                            "correct_option": item.get("correct_option"),
                            "passage": item.get("passage", ""),
                            "audio_url": item.get("audio_url", ""),
                            "play_limit": item.get("play_limit", 2),
                            "transcript": item.get("transcript", ""),
                        },
                        "learner_payload": {
                            "prompt_en": item.get("question"),
                            "prompt_fa": item.get("prompt_fa", ""),
                            "options": item.get("options", []),
                            "passage": item.get("passage", ""),
                            "audio_url": item.get("audio_url", ""),
                            "play_limit": item.get("play_limit", 2),
                        },
                    },
                )
                if qv_created:
                    created_q += 1

            self.stdout.write(
                self.style.SUCCESS(f"Synchronized placement items to question bank: {created_q} question versions created.")
            )
