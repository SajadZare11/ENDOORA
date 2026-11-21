from django.core.management.base import BaseCommand
from django.db import transaction
from reading_path.models import Edition
from reading_path.starter import populate


class Command(BaseCommand):
    help = (
        "Create the original reading curriculum as a draft. Run once after migration."
    )

    @transaction.atomic
    def handle(self, **options):
        if Edition.objects.exists():
            self.stdout.write("An edition already exists. No content was replaced.")
            return
        draft = Edition.objects.create(title="کارگاه ریدینگ · دورهٔ نخست")
        populate(draft)
        self.stdout.write(
            f"Draft #{draft.pk} created. Review and publish in Django admin."
        )
