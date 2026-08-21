from django.urls import path
from .views import RoleplayView
urlpatterns=[path('chat/',RoleplayView.as_view())]
