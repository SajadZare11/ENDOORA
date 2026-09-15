from __future__ import annotations

from django.urls import path
from .views import (
    AdminNotificationBroadcastView,
    AdminNotificationTelemetryView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationPreferencesView,
    NotificationReadAllView,
)

app_name = "notifications"

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<uuid:pk>/read/", NotificationMarkReadView.as_view(), name="notification-mark-read"),
    path("read-all/", NotificationReadAllView.as_view(), name="notification-read-all"),
    path("preferences/", NotificationPreferencesView.as_view(), name="notification-preferences"),
    path("ops/broadcast/", AdminNotificationBroadcastView.as_view(), name="notification-broadcast"),
    path("ops/telemetry/", AdminNotificationTelemetryView.as_view(), name="notification-telemetry"),
]
