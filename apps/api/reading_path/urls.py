from django.urls import path
from . import views

app_name = "reading_path"
urlpatterns = [
    path("", views.home, name="home"),
    path("false-not-given/", views.step, name="sample"),
    path("diagnostic/", views.step, {"stage": "diagnostic"}, name="diagnostic"),
    path("notebook/", views.notebook, name="notebook"),
    path("<str:stage>/<str:skill>/", views.step, name="step"),
]
