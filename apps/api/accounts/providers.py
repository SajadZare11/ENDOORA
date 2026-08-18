from __future__ import annotations

from dataclasses import dataclass

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


@dataclass(frozen=True)
class OtpDelivery:
    provider: str
    accepted: bool


class BaseOtpProvider:
    name = "base"

    def send(self, identifier: str, code: str, purpose: str) -> OtpDelivery:
        raise NotImplementedError


class LocalMockOtpProvider(BaseOtpProvider):
    name = "mock"

    def send(self, identifier: str, code: str, purpose: str) -> OtpDelivery:
        # Never print or log the raw OTP. The service may return it only in DEBUG
        # mode so the local developer can complete the flow.
        return OtpDelivery(provider=self.name, accepted=True)


def get_otp_provider() -> BaseOtpProvider:
    provider_name = getattr(settings, "ENDOORA_OTP_PROVIDER", "mock").strip().lower()
    if provider_name == "mock":
        return LocalMockOtpProvider()

    raise ImproperlyConfigured(
        f"Unsupported ENDOORA_OTP_PROVIDER={provider_name!r}. "
        "Only local mock mode is enabled on Day 07."
    )
