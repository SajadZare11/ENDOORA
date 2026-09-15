from __future__ import annotations

import json
from typing import Any
from django.core.management.base import BaseCommand

from disaster_recovery.services.ha_telemetry_service import get_ha_cluster_telemetry


class Command(BaseCommand):
    help = "Checks PostgreSQL 16 High-Availability replication health and RPO/RTO metrics (OPS-004)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--json",
            action="store_true",
            help="Output telemetry directly as JSON.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        telemetry = get_ha_cluster_telemetry()

        if options["json"]:
            self.stdout.write(json.dumps(telemetry, indent=2))
            return

        self.stdout.write(
            self.style.SUCCESS(
                f"=== High-Availability Telemetry: {telemetry['cluster_name']} ===\n"
                f"Cluster Health: {telemetry['cluster_health']}\n"
                f"Total Nodes:    {telemetry['topology']['total_nodes']} "
                f"(Primary: {telemetry['topology']['primary_node']}, "
                f"Sync: {telemetry['topology']['sync_replicas']}, "
                f"Async: {telemetry['topology']['async_replicas']})"
            )
        )

        self.stdout.write("\nNode Topology:")
        for node in telemetry["nodes"]:
            status_style = self.style.SUCCESS if node["is_healthy"] else self.style.ERROR
            self.stdout.write(
                status_style(
                    f"  * {node['name']} [{node['role_display']}]: "
                    f"Lag={node['replication_lag_ms']}ms ({node['replication_lag_bytes']} bytes), "
                    f"Endpoint={node['endpoint']}"
                )
            )

        sla = telemetry["sla_metrics"]
        self.stdout.write(
            f"\nSLA Compliance:\n"
            f"  * RPO: Target {sla['rpo_target_display']} | Current: {sla['rpo_current_display']} [{sla['rpo_status']}]\n"
            f"  * RTO: Target {sla['rto_target_display']} | Projected Failover: {sla['rto_projected_display']} [{sla['rto_status']}]"
        )
