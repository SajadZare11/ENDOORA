from __future__ import annotations

from django.urls import path

from analytics.views import (
    AdminAnalyticsOverviewView,
    AdminCohortsView,
    AdminEventsStreamView,
    AdminFunnelDetailView,
    AdminFunnelsListView,
    TrackEventView,
)

urlpatterns = [
    path("track/", TrackEventView.as_view(), name="analytics-track"),
    path("ops/overview/", AdminAnalyticsOverviewView.as_view(), name="analytics-ops-overview"),
    path("ops/funnels/", AdminFunnelsListView.as_view(), name="analytics-ops-funnels-list"),
    path("ops/funnels/<slug:slug>/", AdminFunnelDetailView.as_view(), name="analytics-ops-funnel-detail"),
    path("ops/cohorts/", AdminCohortsView.as_view(), name="analytics-ops-cohorts"),
    path("ops/events/", AdminEventsStreamView.as_view(), name="analytics-ops-events"),
]
