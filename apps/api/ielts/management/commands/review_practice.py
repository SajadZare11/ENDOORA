from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from ielts.models import PracticeRelease
from ielts.practice_content import UNITS, revision


class Command(BaseCommand):
    help = "Preview, withdraw, or publish one immutable owner-reviewed practice unit."

    def add_arguments(self, parser):
        parser.add_argument("action", choices=["preview", "publish", "withdraw"])
        parser.add_argument("slug", choices=list(UNITS))
        parser.add_argument("--reviewer", help="Email of the active staff account performing review")
        parser.add_argument("--digest", help="Digest printed during preview")

    @transaction.atomic
    def handle(self, action, slug, reviewer, digest, **options):
        unit = UNITS[slug]
        expected = revision(unit)
        if action == "preview":
            self.stdout.write(unit["title"])
            self.stdout.write(unit.get("passage") or unit["transcript"])
            for q in unit["questions"]:
                self.stdout.write(f'{q["prompt"]}\n  {q["choices"]}\n  {q["answer"]} — {q["explanation"]}')
            self.stdout.write(expected)
            return
        owner = get_user_model().objects.filter(email__iexact=reviewer or "", is_active=True,
                                                is_staff=True).first()
        if owner is None:
            raise CommandError("An active staff reviewer is required.")
        if action == "withdraw":
            count = PracticeRelease.objects.filter(pk=slug).update(active=False)
            self.stdout.write(f"Withdrawn releases: {count}")
            return
        if digest != expected:
            raise CommandError("Preview and review this exact revision first.")
        release, _ = PracticeRelease.objects.select_for_update().get_or_create(
            slug=slug, defaults={"digest": expected, "reviewed_by": owner})
        if release.digest != expected:
            raise CommandError("Existing revision is immutable. Assign a new slug and version.")
        release.active = True
        release.reviewed_by = owner
        release.save()
        self.stdout.write(f"Published {slug}.")
