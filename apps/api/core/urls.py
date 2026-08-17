from django.urls import path

from .views import health, liveness

urlpatterns = [
    path("health/", health, name="health"),
    path("health/live/", liveness, name="liveness"),
]
