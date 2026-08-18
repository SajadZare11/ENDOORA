from django.urls import path

from .views import (
    AccountDeletionRequestView,
    ConsentView,
    CsrfTokenView,
    CurrentSessionView,
    DeactivateAccountView,
    LoginView,
    LogoutView,
    MeView,
    OtpRequestView,
    OtpVerifyView,
)

app_name = "accounts"

urlpatterns = [
    path("csrf/", CsrfTokenView.as_view(), name="csrf"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("consents/", ConsentView.as_view(), name="consents"),
    path("otp/request/", OtpRequestView.as_view(), name="otp-request"),
    path("otp/verify/", OtpVerifyView.as_view(), name="otp-verify"),
    path("sessions/current/", CurrentSessionView.as_view(), name="current-session"),
    path("deactivate/", DeactivateAccountView.as_view(), name="deactivate"),
    path("deletion-request/", AccountDeletionRequestView.as_view(), name="deletion-request"),
]
