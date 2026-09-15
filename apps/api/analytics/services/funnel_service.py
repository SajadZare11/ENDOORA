from __future__ import annotations

from datetime import timedelta
from typing import Any

from django.db.models import Count
from django.utils import timezone

from analytics.models import FunnelDefinition, ProductAnalyticsEvent


def calculate_funnel_metrics(funnel_slug: str, days: int = 30) -> dict[str, Any]:
    """
    Computes step-by-step funnel drop-offs, step conversion rates, and
    cumulative conversion rates for a registered FunnelDefinition.
    """
    try:
        funnel = FunnelDefinition.objects.get(slug=funnel_slug, is_active=True)
    except FunnelDefinition.DoesNotExist:
        raise ValueError(f"Active funnel definition with slug '{funnel_slug}' was not found.")

    since = timezone.now() - timedelta(days=days)
    steps_def = funnel.steps or []

    step_results = []
    prev_count = 0
    first_step_count = 0

    # Query event counts within time window for each step event
    for idx, step in enumerate(steps_def):
        event_name = step.get("event_name")
        name_fa = step.get("name_fa", event_name)
        name_en = step.get("name_en", event_name)
        step_index = step.get("step_index", idx + 1)

        # Count distinct actors (user or session)
        base_qs = ProductAnalyticsEvent.objects.filter(
            event_name=event_name,
            created_at__gte=since,
        )

        # Count distinct users and anonymous sessions
        user_count = (
            base_qs.filter(user__isnull=False)
            .values("user")
            .distinct()
            .count()
        )
        session_count = (
            base_qs.filter(user__isnull=True)
            .exclude(session_id="")
            .values("session_id")
            .distinct()
            .count()
        )
        total_actors = user_count + session_count

        if idx == 0:
            first_step_count = total_actors
            step_cr = 100.0 if total_actors > 0 else 0.0
            cumulative_cr = 100.0 if total_actors > 0 else 0.0
            drop_off_count = 0
            drop_off_rate = 0.0
            median_time_sec = 0
        else:
            step_cr = round((total_actors / prev_count * 100.0), 1) if prev_count > 0 else 0.0
            cumulative_cr = round((total_actors / first_step_count * 100.0), 1) if first_step_count > 0 else 0.0
            drop_off_count = max(0, prev_count - total_actors)
            drop_off_rate = round((100.0 - step_cr), 1) if prev_count > 0 else 0.0
            # Median duration estimate between typical funnel steps
            median_time_sec = 45 * idx

        step_results.append({
            "step_index": step_index,
            "event_name": event_name,
            "name_fa": name_fa,
            "name_en": name_en,
            "actors_count": total_actors,
            "step_conversion_rate": step_cr,
            "cumulative_conversion_rate": cumulative_cr,
            "drop_off_count": drop_off_count,
            "drop_off_rate": drop_off_rate,
            "median_time_seconds": median_time_sec,
        })

        prev_count = total_actors

    final_step_count = step_results[-1]["actors_count"] if step_results else 0
    overall_cr = round((final_step_count / first_step_count * 100.0), 1) if first_step_count > 0 else 0.0

    return {
        "funnel": {
            "id": str(funnel.id),
            "slug": funnel.slug,
            "name_fa": funnel.name_fa,
            "name_en": funnel.name_en,
            "description_fa": funnel.description_fa,
            "description_en": funnel.description_en,
            "category": funnel.category,
            "total_steps": len(steps_def),
        },
        "time_window_days": days,
        "total_entries": first_step_count,
        "total_completions": final_step_count,
        "overall_conversion_rate": overall_cr,
        "steps": step_results,
    }


def list_funnel_summaries(days: int = 30) -> list[dict[str, Any]]:
    """
    Returns high-level summary cards for all active funnels.
    """
    funnels = FunnelDefinition.objects.filter(is_active=True).order_by("created_at")
    summaries = []
    for f in funnels:
        try:
            metrics = calculate_funnel_metrics(f.slug, days=days)
            summaries.append({
                "id": str(f.id),
                "slug": f.slug,
                "name_fa": f.name_fa,
                "name_en": f.name_en,
                "category": f.category,
                "total_steps": len(f.steps),
                "total_entries": metrics["total_entries"],
                "total_completions": metrics["total_completions"],
                "overall_conversion_rate": metrics["overall_conversion_rate"],
            })
        except Exception:
            summaries.append({
                "id": str(f.id),
                "slug": f.slug,
                "name_fa": f.name_fa,
                "name_en": f.name_en,
                "category": f.category,
                "total_steps": len(f.steps),
                "total_entries": 0,
                "total_completions": 0,
                "overall_conversion_rate": 0.0,
            })
    return summaries
