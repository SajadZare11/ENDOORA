from django.urls import path

from .views import (
    TaxonomyMetaAPIView,
    TaxonomyNodeDetailAPIView,
    TaxonomyNodeListAPIView,
    TaxonomyObjectiveListAPIView,
)

app_name = "taxonomy"

urlpatterns = [
    path("nodes/", TaxonomyNodeListAPIView.as_view(), name="node-list"),
    path("nodes/<uuid:pk>/", TaxonomyNodeDetailAPIView.as_view(), name="node-detail"),
    path("objectives/", TaxonomyObjectiveListAPIView.as_view(), name="objective-list"),
    path("meta/", TaxonomyMetaAPIView.as_view(), name="meta"),
]
