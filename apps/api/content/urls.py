from django.urls import path

from .views import (
    ContentItemDetailView,
    ContentItemListView,
    ContentReviewView,
    CultureListView,
    SchoolListView,
    SkillsHubView,
)

urlpatterns = [
    path("skills/", SkillsHubView.as_view(), name="content-skills-hub"),
    path("items/", ContentItemListView.as_view(), name="content-items-list"),
    path("items/<slug:slug>/", ContentItemDetailView.as_view(), name="content-item-detail"),
    path("items/<uuid:item_id>/review/", ContentReviewView.as_view(), name="content-item-review"),
    path("culture/", CultureListView.as_view(), name="content-culture-list"),
    path("school/", SchoolListView.as_view(), name="content-school-list"),
]
