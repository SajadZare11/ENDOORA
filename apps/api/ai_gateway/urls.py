from django.urls import path

from .views import (
    AIStatusView,
    ExerciseDetailView,
    ExerciseGenerateView,
    ExerciseHistoryView,
    ExerciseSubmitView,
)
from .views_ops import (
    AICircuitBreakerResetView,
    AIModelRouterStatusView,
    AIOperationsOverviewView,
    AIPromptRegistryListView,
    AIPromptTestView,
    AIProviderBudgetUpdateView,
    AIRequestLogListView,
)

urlpatterns = [
    path("exercises/generate/", ExerciseGenerateView.as_view(), name="exercise-generate"),
    path("exercise/", ExerciseGenerateView.as_view(), name="exercise-generate-alias"),
    path("exercises/<int:pk>/", ExerciseDetailView.as_view(), name="exercise-detail"),
    path("exercises/<int:pk>/submit/", ExerciseSubmitView.as_view(), name="exercise-submit"),
    path("exercises/history/", ExerciseHistoryView.as_view(), name="exercise-history"),
    path("status/", AIStatusView.as_view(), name="ai-status"),
    # Operational endpoints (OPS-005)
    path("ops/overview/", AIOperationsOverviewView.as_view(), name="ai-ops-overview"),
    path("ops/prompts/", AIPromptRegistryListView.as_view(), name="ai-ops-prompts"),
    path("ops/models/", AIModelRouterStatusView.as_view(), name="ai-ops-models"),
    path("ops/logs/", AIRequestLogListView.as_view(), name="ai-ops-logs"),
    path("ops/prompts/<str:prompt_id>/test/", AIPromptTestView.as_view(), name="ai-ops-prompt-test"),
    path("ops/circuit-breaker/reset/", AICircuitBreakerResetView.as_view(), name="ai-ops-circuit-breaker-reset"),
    path("ops/budget/update/", AIProviderBudgetUpdateView.as_view(), name="ai-ops-budget-update"),
]
