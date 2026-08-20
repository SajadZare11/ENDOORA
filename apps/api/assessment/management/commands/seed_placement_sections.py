from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Prepare Day 15 placement section seed placeholder"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS(
                "Placement grammar/vocabulary/reading section seed placeholder ready."
            )
        )
