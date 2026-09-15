from __future__ import annotations

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from ai_gateway.models import AIRequestLog
from ai_gateway.services_ops import (
    get_ai_operations_overview,
    get_prompt_registry_catalog,
    reset_circuit_breaker,
    test_evaluate_prompt,
    update_provider_budget,
)


class AIOperationsOverviewView(APIView):
    """
    Returns live AI Gateway telemetry, SLA metrics, error budget status,
    latency percentiles, and provider budget controls (OPS-005).
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        overview = get_ai_operations_overview()
        return Response(overview, status=status.HTTP_200_OK)


class AIPromptRegistryListView(APIView):
    """
    Returns the versioned prompt templates catalog with schema and evaluation metadata.
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        prompts = get_prompt_registry_catalog()
        return Response(prompts, status=status.HTTP_200_OK)


class AIModelRouterStatusView(APIView):
    """
    Returns the active model router tiers, fallback priority cascade, and circuit breaker status.
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        overview = get_ai_operations_overview()
        return Response(
            {
                "model_tiers": overview["model_tiers"],
                "circuit_breaker": overview["circuit_breaker"],
                "evaluated_at": overview["evaluated_at"],
            },
            status=status.HTTP_200_OK,
        )


class AIRequestLogListView(APIView):
    """
    Returns recent structured request audit logs with latency, tokens, cost, and fallback indicators.
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        logs = AIRequestLog.objects.all().order_by("-created_at")[:50]
        results = [
            {
                "id": log.id,
                "feature": log.feature,
                "model_name": log.model_name,
                "provider": log.provider,
                "prompt_tokens": log.prompt_tokens,
                "completion_tokens": log.completion_tokens,
                "total_tokens": log.prompt_tokens + log.completion_tokens,
                "total_cost_usd": log.total_cost_usd,
                "response_time_ms": log.response_time_ms,
                "success": log.success,
                "is_fallback": log.is_fallback,
                "error_message": log.error_message,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ]
        return Response(results, status=status.HTTP_200_OK)


class AIPromptTestView(APIView):
    """
    Runs automated schema validation and synthetic benchmark test against a prompt template.
    """

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, prompt_id: str) -> Response:
        test_params = request.data.get("test_params", {})
        result = test_evaluate_prompt(prompt_id=prompt_id, test_params=test_params)
        return Response(result, status=status.HTTP_200_OK)


class AICircuitBreakerResetView(APIView):
    """
    Manually resets a tripped provider circuit breaker and logs an immutable audit event.
    """

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request) -> Response:
        provider_name = request.data.get("provider_name", "openrouter_main")
        result = reset_circuit_breaker(provider_name=provider_name, operator=request.user)
        return Response(result, status=status.HTTP_200_OK)


class AIProviderBudgetUpdateView(APIView):
    """
    Updates the daily budget cap for the AI provider and logs an immutable audit event.
    """

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request) -> Response:
        daily_budget_usd = request.data.get("daily_budget_usd")
        if daily_budget_usd is None:
            return Response(
                {"detail": "daily_budget_usd is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider_name = request.data.get("provider_name", "openrouter_main")
        result = update_provider_budget(
            daily_budget_usd=float(daily_budget_usd),
            provider_name=provider_name,
            operator=request.user,
        )
        return Response(result, status=status.HTTP_200_OK)
