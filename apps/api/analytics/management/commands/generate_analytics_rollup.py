from datetime import datetime, timedelta, timezone as dt_timezone

from django.core.management.base import BaseCommand
from django.utils import timezone

from analytics.models import DailyAnalyticsRollup, ProductAnalyticsEvent


class Command(BaseCommand):
    help = "Generates aggregated daily product analytics rollups for high-performance reporting."

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            type=str,
            help="Target date in YYYY-MM-DD format (default: yesterday)",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=1,
            help="Number of past days to roll up",
        )

    def handle(self, *args, **options):
        now = timezone.now()
        date_str = options.get("date")
        days_count = options.get("days", 1)

        if date_str:
            try:
                base_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                self.stderr.write("Invalid date format. Use YYYY-MM-DD.")
                return
        else:
            base_date = now.date() - timedelta(days=1)

        for d in range(days_count):
            target_date = base_date - timedelta(days=d)
            start_dt = datetime.combine(target_date, datetime.min.time(), tzinfo=dt_timezone.utc)
            end_dt = datetime.combine(target_date, datetime.max.time(), tzinfo=dt_timezone.utc)

            # Daily Active Users
            day_qs = ProductAnalyticsEvent.objects.filter(created_at__gte=start_dt, created_at__lte=end_dt)
            u_count = day_qs.filter(user__isnull=False).values("user").distinct().count()
            s_count = day_qs.filter(user__isnull=True).exclude(session_id="").values("session_id").distinct().count()
            dau_val = float(u_count + s_count)

            # Total events
            events_val = float(day_qs.count())

            # Save rollups
            DailyAnalyticsRollup.objects.update_or_create(
                date=target_date,
                metric_type=DailyAnalyticsRollup.MetricType.DAU,
                dimension="all",
                defaults={"value": dau_val},
            )
            DailyAnalyticsRollup.objects.update_or_create(
                date=target_date,
                metric_type=DailyAnalyticsRollup.MetricType.TOTAL_EVENTS,
                dimension="all",
                defaults={"value": events_val},
            )

            self.stdout.write(
                f"Generated rollups for {target_date}: DAU={dau_val}, Events={events_val}"
            )

        self.stdout.write(self.style.SUCCESS("Daily analytics rollups completed successfully."))
