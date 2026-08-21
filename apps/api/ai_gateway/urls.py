from django.urls import path
from .views import ExerciseGenerateView

urlpatterns = [
    path("exercise/", ExerciseGenerateView.as_view()),
]
