from datetime import timedelta
from django.utils import timezone


def review_item(item, rating):
    """Simple SM-2 inspired update. Ratings: 1-5."""
    rating = max(1, min(5, int(rating)))
    previous = item.interval_days

    if rating < 3:
        item.interval_days = 1
        item.status = "learning"
    else:
        item.repetition += 1
        item.interval_days = max(1, item.interval_days * 2)
        item.status = "mastered" if item.repetition >= 5 else "review"

    item.due_at = timezone.now() + timedelta(days=item.interval_days)
    item.save(update_fields=["interval_days", "repetition", "status", "due_at", "updated_at"])
    return previous
