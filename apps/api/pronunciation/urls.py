from django.urls import path
from . import views

app_name = "pronunciation"

urlpatterns = [
    path("items/", views.PronunciationItemListView.as_view(), name="items"),
    path("items/<str:item_id>/", views.PronunciationItemDetailView.as_view(), name="item_detail"),
    path("analyze/", views.PronunciationAnalyzeView.as_view(), name="analyze"),
    path("attempts/<int:attempt_id>/save-to-genome/", views.SaveToMistakeGenomeView.as_view(), name="save_to_genome"),
    path("attempts/", views.PronunciationAttemptListView.as_view(), name="attempts"),
]
