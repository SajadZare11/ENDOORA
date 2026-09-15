from __future__ import annotations

import json
from django.core.management.base import BaseCommand
from observability.services import telemetry_service


class Command(BaseCommand):
    help = "Inspect production platform APM telemetry, SLA compliance, latency percentiles, and active incidents (OPS-006)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output metrics as structured JSON.",
        )

    def handle(self, *args, **options) -> None:
        overview = telemetry_service.get_observability_overview()
        apm = overview["apm_metrics"]
        db = overview["database_pool"]
        redis = overview["redis_cache"]
        workers = overview["worker_queues"]
        alerts = overview["alerts_summary"]

        if options["json"]:
            self.stdout.write(json.dumps(overview, ensure_ascii=False, indent=2))
            return

        self.stdout.write(self.style.SUCCESS("=================================================="))
        self.stdout.write(self.style.SUCCESS("   ENDOORA PRODUCTION OBSERVABILITY & APM (OPS-006)"))
        self.stdout.write(self.style.SUCCESS("=================================================="))
        self.stdout.write(f"System Uptime (SLA 99.5%):  {apm['uptime_percentage']}%")
        self.stdout.write(f"Latency Percentiles:        p50={apm['p50_latency_ms']}ms | p95={apm['p95_latency_ms']}ms | p99={apm['p99_latency_ms']}ms")
        self.stdout.write(f"Throughput & Error Rate:    {apm['requests_per_second']} RPS | Error Rate: {apm['error_rate_percentage']}%")
        self.stdout.write("--------------------------------------------------")
        self.stdout.write(f"PostgreSQL 16 Pool:         {db['active_connections']}/{db['max_connections']} connections active ({db['status']})")
        self.stdout.write(f"Redis Sentinel Cache:       Hit Ratio: {redis['hit_ratio_percentage']}% ({redis['status']})")
        self.stdout.write(f"Celery Worker Queues:       Depth: {workers['queue_depth']} | Active: {workers['active_tasks']} ({workers['status']})")
        self.stdout.write("--------------------------------------------------")
        self.stdout.write(f"Active Incident Alerts:     {alerts['active_count']}")
        self.stdout.write(f"Acknowledged Alerts:        {alerts['acknowledged_count']}")
        self.stdout.write("==================================================")
