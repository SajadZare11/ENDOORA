from django.urls import path
from .views import TodayReviewView, ReviewSubmitView

urlpatterns = [
    path("today/", TodayReviewView.as_view()),
    path("review/", ReviewSubmitView.as_view()),
]
