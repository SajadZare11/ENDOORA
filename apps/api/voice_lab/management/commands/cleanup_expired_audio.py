from django.core.management.base import BaseCommand
from voice_lab.services import VoicePipelineService


class Command(BaseCommand):
    help = "Purges raw audio binaries whose learner retention period has expired."

    def handle(self, *args, **options):
        self.stdout.write("Running automated voice recording retention cleanup...")
        service = VoicePipelineService()
        purged_count = service.delete_expired_audio()
        self.stdout.write(
            self.style.SUCCESS(
                f"Retention cleanup complete: {purged_count} expired recordings purged."
            )
        )
