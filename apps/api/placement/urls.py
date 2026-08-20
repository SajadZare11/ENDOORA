from django.urls import path

from . import views

urlpatterns = [
    path("sessions/", views.PlacementSessionView.as_view()),
]
