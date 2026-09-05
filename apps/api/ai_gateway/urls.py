from django.urls import path

from .views import (
    AIStatusView,
    ExerciseDetailView,
    ExerciseGenerateView,
    ExerciseHistoryView,
    ExerciseSubmitView,
)

urlpatterns = [
    path("exercises/generate/", ExerciseGenerateView.as_view(), name="exercise-generate"),
    path("exercise/", ExerciseGenerateView.as_view(), name="exercise-generate-alias"),
    path("exercises/<int:pk>/", ExerciseDetailView.as_view(), name="exercise-detail"),
    path("exercises/<int:pk>/submit/", ExerciseSubmitView.as_view(), name="exercise-submit"),
    path("exercises/history/", ExerciseHistoryView.as_view(), name="exercise-history"),
    path("status/", AIStatusView.as_view(), name="ai-status"),
]
