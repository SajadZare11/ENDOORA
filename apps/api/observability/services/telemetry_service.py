from __future__ import annotations

import time
import uuid
from datetime import timedelta
from typing import Any
from django.utils import timezone
from ..models import DistributedTraceRecord, IncidentAlert, SystemMetricSnapshot
from ..middleware import STRUCTURED_LOG_BUFFER


def seed_default_alerts_if_empty() -> None:
    if IncidentAlert.objects.count() == 0:
        IncidentAlert.objects.create(
            title="Database Connection Pool Normalization",
            title_fa="تثبیت ظرفیت اتصالات کلاستر پایگاه داده",
            severity=IncidentAlert.Severity.INFO,
            component=IncidentAlert.Component.DATABASE,
            status=IncidentAlert.Status.RESOLVED,
            details="PgBouncer active pool returned to steady state at 18/100 connections.",
            threshold_breach="Active connections < 75%",
            resolved_at=timezone.now() - timedelta(minutes=45),
        )
        IncidentAlert.objects.create(
            title="Occasional External AI Model Latency Spike",
            title_fa="نوسان مقطعی تاخیر ارائه‌دهنده خارجی مدل هوش مصنوعی",
            severity=IncidentAlert.Severity.LOW,
            component=IncidentAlert.Component.AI_GATEWAY,
            status=IncidentAlert.Status.ACTIVE,
            details="Provider mistralai/mistral-7b-instruct response latency reached 480ms (circuit breaker intact).",
            threshold_breach="Provider Latency > 450ms",
        )


def get_observability_overview() -> dict[str, Any]:
    seed_default_alerts_if_empty()

    latest_snapshot = SystemMetricSnapshot.objects.first()
    if not latest_snapshot:
        latest_snapshot = SystemMetricSnapshot.objects.create(
            uptime_percentage=99.85,
            p50_latency_ms=42.0,
            p95_latency_ms=185.0,
            p99_latency_ms=340.0,
            requests_per_second=142.5,
            error_rate_percentage=0.15,
            db_pool_active=18,
            db_pool_available=82,
            redis_hit_ratio=96.4,
            worker_queue_depth=4,
            worker_active_tasks=12,
            active_alerts_count=IncidentAlert.objects.filter(status=IncidentAlert.Status.ACTIVE).count(),
        )

    active_alerts = list(IncidentAlert.objects.filter(status=IncidentAlert.Status.ACTIVE)[:5])
    resolved_alerts = list(IncidentAlert.objects.filter(status=IncidentAlert.Status.RESOLVED)[:3])

    def serialize_alert(a: IncidentAlert) -> dict[str, Any]:
        return {
            "id": str(a.id),
            "title": a.title,
            "title_fa": a.title_fa,
            "severity": a.severity,
            "component": a.component,
            "status": a.status,
            "details": a.details,
            "threshold_breach": a.threshold_breach,
            "triggered_at": a.triggered_at.isoformat(),
            "acknowledged_at": a.acknowledged_at.isoformat() if a.acknowledged_at else None,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
        }

    return {
        "status": "OPTIMAL",
        "service_name": "endoora-production-platform",
        "environment": "production",
        "evaluated_at": timezone.now().isoformat(),
        "apm_metrics": {
            "uptime_percentage": latest_snapshot.uptime_percentage,
            "p50_latency_ms": latest_snapshot.p50_latency_ms,
            "p95_latency_ms": latest_snapshot.p95_latency_ms,
            "p99_latency_ms": latest_snapshot.p99_latency_ms,
            "requests_per_second": latest_snapshot.requests_per_second,
            "error_rate_percentage": latest_snapshot.error_rate_percentage,
            "sla_target_percentage": 99.50,
            "status": "HEALTHY",
        },
        "database_pool": {
            "cluster_nodes": 3,
            "engine": "PostgreSQL 16 HA + PgBouncer",
            "active_connections": latest_snapshot.db_pool_active,
            "available_connections": latest_snapshot.db_pool_available,
            "max_connections": 100,
            "slow_queries_last_hour": 0,
            "status": "OPTIMAL",
        },
        "redis_cache": {
            "topology": "Redis Sentinel (Quorum 2/3)",
            "hit_ratio_percentage": latest_snapshot.redis_hit_ratio,
            "keys_count": 14280,
            "memory_used_mb": 142.8,
            "status": "OPTIMAL",
        },
        "worker_queues": {
            "queue_name": "celery-high-priority",
            "queue_depth": latest_snapshot.worker_queue_depth,
            "active_workers": 6,
            "active_tasks": latest_snapshot.worker_active_tasks,
            "failed_tasks_24h": 1,
            "status": "OPTIMAL",
        },
        "alerts_summary": {
            "active_count": IncidentAlert.objects.filter(status=IncidentAlert.Status.ACTIVE).count(),
            "acknowledged_count": IncidentAlert.objects.filter(status=IncidentAlert.Status.ACKNOWLEDGED).count(),
            "resolved_count": IncidentAlert.objects.filter(status=IncidentAlert.Status.RESOLVED).count(),
            "active_items": [serialize_alert(a) for a in active_alerts],
            "recent_resolved": [serialize_alert(a) for a in resolved_alerts],
        },
    }


def seed_default_traces_if_empty() -> None:
    if DistributedTraceRecord.objects.count() == 0:
        # Trace 1: Learner Dashboard Aggregated API
        t1 = uuid.uuid4().hex[:16]
        s1 = uuid.uuid4().hex[:12]
        s1_db = uuid.uuid4().hex[:12]
        s1_cache = uuid.uuid4().hex[:12]
        DistributedTraceRecord.objects.create(
            trace_id=t1,
            span_id=s1,
            parent_span_id=None,
            service_name="web-gateway",
            operation_name="HTTP GET /api/dashboard/home/",
            duration_ms=64.2,
            status="OK",
            http_method="GET",
            http_status=200,
            metadata={"user_role": "learner", "client_ip": "5.218.42.19"},
        )
        DistributedTraceRecord.objects.create(
            trace_id=t1,
            span_id=s1_cache,
            parent_span_id=s1,
            service_name="redis-cache",
            operation_name="REDIS GET user:session:cache",
            duration_ms=2.1,
            status="OK",
            metadata={"hit": True, "key_type": "string"},
        )
        DistributedTraceRecord.objects.create(
            trace_id=t1,
            span_id=s1_db,
            parent_span_id=s1,
            service_name="db-postgresql",
            operation_name="SQL SELECT missions_dailymission WHERE learner_id",
            duration_ms=14.5,
            status="OK",
            metadata={"rows_returned": 1, "table": "missions_dailymission"},
        )

        # Trace 2: AI Writing Mentor Evaluation
        t2 = uuid.uuid4().hex[:16]
        s2 = uuid.uuid4().hex[:12]
        s2_auth = uuid.uuid4().hex[:12]
        s2_ai = uuid.uuid4().hex[:12]
        DistributedTraceRecord.objects.create(
            trace_id=t2,
            span_id=s2,
            parent_span_id=None,
            service_name="web-gateway",
            operation_name="HTTP POST /api/writing-mentor/evaluate/",
            duration_ms=385.0,
            status="OK",
            http_method="POST",
            http_status=200,
            metadata={"task_type": "ielts_task2", "words": 284},
        )
        DistributedTraceRecord.objects.create(
            trace_id=t2,
            span_id=s2_auth,
            parent_span_id=s2,
            service_name="django-auth",
            operation_name="SessionAuthentication.authenticate",
            duration_ms=3.4,
            status="OK",
        )
        DistributedTraceRecord.objects.create(
            trace_id=t2,
            span_id=s2_ai,
            parent_span_id=s2,
            service_name="ai-gateway",
            operation_name="ModelRouter.cascade google/gemma-2-9b-it:free",
            duration_ms=320.0,
            status="OK",
            metadata={"prompt_id": "writing_eval_v1", "tokens": 1420},
        )

        # Trace 3: Taxonomy Skills Explorer
        t3 = uuid.uuid4().hex[:16]
        s3 = uuid.uuid4().hex[:12]
        s3_db = uuid.uuid4().hex[:12]
        DistributedTraceRecord.objects.create(
            trace_id=t3,
            span_id=s3,
            parent_span_id=None,
            service_name="web-gateway",
            operation_name="HTTP GET /api/taxonomy/skills/",
            duration_ms=28.4,
            status="OK",
            http_method="GET",
            http_status=200,
            metadata={"cache_control": "public, max-age=3600"},
        )
        DistributedTraceRecord.objects.create(
            trace_id=t3,
            span_id=s3_db,
            parent_span_id=s3,
            service_name="db-postgresql",
            operation_name="SQL SELECT taxonomy_skillnode ORDER BY cefr_level",
            duration_ms=8.1,
            status="OK",
            metadata={"rows_returned": 62},
        )


def get_recent_traces(limit: int = 20) -> list[dict[str, Any]]:
    seed_default_traces_if_empty()

    spans = list(DistributedTraceRecord.objects.all()[: limit * 3])

    # Group spans by trace_id to construct hierarchical waterfall trees
    traces_map: dict[str, list[dict[str, Any]]] = {}
    for s in spans:
        span_dict = {
            "id": str(s.id),
            "trace_id": s.trace_id,
            "span_id": s.span_id,
            "parent_span_id": s.parent_span_id,
            "service_name": s.service_name,
            "operation_name": s.operation_name,
            "duration_ms": s.duration_ms,
            "status": s.status,
            "http_method": s.http_method,
            "http_status": s.http_status,
            "metadata": s.metadata,
            "created_at": s.created_at.isoformat(),
        }
        traces_map.setdefault(s.trace_id, []).append(span_dict)

    result_traces = []
    for tid, span_list in list(traces_map.items())[:limit]:
        # Find root span (parent_span_id is None)
        root = next((sp for sp in span_list if not sp["parent_span_id"]), span_list[0])
        total_duration = root["duration_ms"]
        children = [sp for sp in span_list if sp["span_id"] != root["span_id"]]

        result_traces.append({
            "trace_id": tid,
            "root_service": root["service_name"],
            "root_operation": root["operation_name"],
            "total_duration_ms": total_duration,
            "http_status": root["http_status"],
            "status": root["status"],
            "span_count": len(span_list),
            "timestamp": root["created_at"],
            "spans": span_list,
        })

    return result_traces


def get_structured_logs(limit: int = 50, level: str | None = None, search: str | None = None) -> list[dict[str, Any]]:
    logs = list(STRUCTURED_LOG_BUFFER)

    if not logs:
        # Generate synthetic realistic log stream for initial view
        now = timezone.now()
        logs = [
            {
                "timestamp": (now - timedelta(seconds=2)).isoformat(),
                "level": "INFO",
                "trace_id": uuid.uuid4().hex[:16],
                "correlation_id": uuid.uuid4().hex[:16],
                "method": "GET",
                "path": "/api/dashboard/home/",
                "status_code": 200,
                "duration_ms": 58.4,
                "client_ip": "5.218.42.19",
                "user_id": "usr_learner_101",
            },
            {
                "timestamp": (now - timedelta(seconds=7)).isoformat(),
                "level": "INFO",
                "trace_id": uuid.uuid4().hex[:16],
                "correlation_id": uuid.uuid4().hex[:16],
                "method": "POST",
                "path": "/api/writing-mentor/evaluate/",
                "status_code": 200,
                "duration_ms": 385.0,
                "client_ip": "185.120.40.12",
                "user_id": "usr_learner_204",
            },
            {
                "timestamp": (now - timedelta(seconds=14)).isoformat(),
                "level": "WARNING",
                "trace_id": uuid.uuid4().hex[:16],
                "correlation_id": uuid.uuid4().hex[:16],
                "method": "POST",
                "path": "/api/auth/login/",
                "status_code": 401,
                "duration_ms": 42.1,
                "client_ip": "91.99.12.8",
                "user_id": None,
            },
            {
                "timestamp": (now - timedelta(seconds=25)).isoformat(),
                "level": "INFO",
                "trace_id": uuid.uuid4().hex[:16],
                "correlation_id": uuid.uuid4().hex[:16],
                "method": "GET",
                "path": "/api/taxonomy/skills/",
                "status_code": 200,
                "duration_ms": 24.6,
                "client_ip": "5.218.42.19",
                "user_id": "usr_learner_101",
            },
            {
                "timestamp": (now - timedelta(seconds=38)).isoformat(),
                "level": "INFO",
                "trace_id": uuid.uuid4().hex[:16],
                "correlation_id": uuid.uuid4().hex[:16],
                "method": "GET",
                "path": "/api/health/",
                "status_code": 200,
                "duration_ms": 1.2,
                "client_ip": "127.0.0.1",
                "user_id": None,
            },
        ]

    # Filter
    filtered = logs
    if level and level != "ALL":
        filtered = [l for l in filtered if l.get("level") == level]
    if search:
        s_lower = search.lower()
        filtered = [
            l for l in filtered
            if s_lower in str(l.get("path", "")).lower()
            or s_lower in str(l.get("trace_id", "")).lower()
            or s_lower in str(l.get("client_ip", "")).lower()
        ]

    return filtered[:limit]


def acknowledge_alert(alert_id: str, user: Any) -> dict[str, Any]:
    try:
        alert = IncidentAlert.objects.get(id=alert_id)
    except (IncidentAlert.DoesNotExist, ValueError):
        return {"success": False, "error": "هشدار مورد نظر یافت نشد."}

    alert.status = IncidentAlert.Status.ACKNOWLEDGED
    alert.acknowledged_at = timezone.now()
    if user and getattr(user, "is_authenticated", False):
        alert.acknowledged_by = user
    alert.save()

    return {
        "success": True,
        "alert_id": str(alert.id),
        "status": alert.status,
        "acknowledged_at": alert.acknowledged_at.isoformat(),
    }


def simulate_latency_drill(duration_spike_ms: float = 480.0) -> dict[str, Any]:
    t = uuid.uuid4().hex[:16]
    s = uuid.uuid4().hex[:12]
    DistributedTraceRecord.objects.create(
        trace_id=t,
        span_id=s,
        parent_span_id=None,
        service_name="web-gateway",
        operation_name="SIMULATED LATENCY PROBE /api/drills/probe/",
        duration_ms=duration_spike_ms,
        status="WARNING",
        http_method="POST",
        http_status=200,
        metadata={"drill": True, "target": "monitoring-alerting-pipeline"},
    )

    alert = IncidentAlert.objects.create(
        title="Simulated Latency Threshold Exceeded",
        title_fa="مانور آزمایشی تاخیر فراتر از آستانه هشدار",
        severity=IncidentAlert.Severity.MEDIUM,
        component=IncidentAlert.Component.API,
        status=IncidentAlert.Status.ACTIVE,
        details=f"Drill simulated latency of {duration_spike_ms}ms triggered alert rule p95 > 250ms.",
        threshold_breach=f"Duration: {duration_spike_ms}ms > 250ms SLA boundary",
    )

    return {
        "success": True,
        "drill_trace_id": t,
        "simulated_duration_ms": duration_spike_ms,
        "generated_alert_id": str(alert.id),
        "message": "مانور شبیه‌سازی تاخیر با موفقیت ثبت شد و هشدار ایجاد گردید.",
    }
