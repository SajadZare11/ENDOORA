from django.urls import path
from .views import MistakeGenomeView
urlpatterns=[path('mine/',MistakeGenomeView.as_view())]
