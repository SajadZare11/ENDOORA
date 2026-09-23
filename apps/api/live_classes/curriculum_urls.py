from django.urls import path
from .views import CurriculumRecommendationView

urlpatterns = [
    path("recommendation/", CurriculumRecommendationView.as_view(), name="curriculum_recommendation"),
]
