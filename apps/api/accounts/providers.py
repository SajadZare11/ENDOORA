from __future__ import annotations

from dataclasses import dataclass
import json
import logging
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import send_mail

from .models import OneTimeCode

logger = logging.getLogger(__name__)


class OtpDeliveryError(Exception):
    """Raised when OTP delivery fails or provider cannot accept the message."""
    pass


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
        # Never print or log the raw OTP.
        return OtpDelivery(provider=self.name, accepted=True)


class EmailOtpProvider(BaseOtpProvider):
    name = "email"

    def send(self, identifier: str, code: str, purpose: str) -> OtpDelivery:
        if "@" not in identifier:
            raise OtpDeliveryError("Email delivery requires an email address.")

        subject_map = {
            OneTimeCode.Purpose.EMAIL_VERIFY: "کد تأیید ایمیل در پلتفرم اندورا | Endoora Email Verification",
            OneTimeCode.Purpose.PASSWORD_RESET: "کد بازیابی رمز عبور | Endoora Password Reset",
        }
        subject = subject_map.get(purpose, "کد تأیید امنیتی | Endoora Security Code")
        message = (
            f"کد تأیید شما در اندورا:\n\n{code}\n\n"
            "این کد به مدت ۵ دقیقه معتبر است. در صورتی که این درخواست توسط شما ثبت نشده، این ایمیل را نادیده بگیرید.\n\n"
            "Your Endoora verification code is above. Valid for 5 minutes."
        )

        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@endoora.ir")
        try:
            sent_count = send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[identifier],
                fail_silently=False,
            )
            if sent_count <= 0:
                raise OtpDeliveryError("Email backend reported 0 messages delivered.")
            return OtpDelivery(provider=self.name, accepted=True)
        except Exception as exc:
            logger.error("Email OTP delivery failed: %s", type(exc).__name__)
            raise OtpDeliveryError(f"Email delivery failed: {type(exc).__name__}") from exc


class KavenegarOtpProvider(BaseOtpProvider):
    name = "kavenegar"

    def __init__(
        self,
        api_key: str | None = None,
        sender: str | None = None,
        timeout: int | None = None,
    ) -> None:
        self.api_key = (
            api_key
            if api_key is not None
            else (
                getattr(settings, "ENDOORA_KAVENEGAR_API_KEY", "")
                or getattr(settings, "ENDOORA_SMS_API_KEY", "")
            )
        )
        if not self.api_key or not self.api_key.strip():
            raise ImproperlyConfigured(
                "Kavenegar API key is required. Set ENDOORA_KAVENEGAR_API_KEY or ENDOORA_SMS_API_KEY."
            )

        self.sender = (
            sender
            if sender is not None
            else getattr(settings, "ENDOORA_KAVENEGAR_SENDER", "")
        )
        self.timeout = (
            timeout
            if timeout is not None
            else int(getattr(settings, "ENDOORA_KAVENEGAR_TIMEOUT_SECONDS", 10))
        )

    def send(self, identifier: str, code: str, purpose: str) -> OtpDelivery:
        # Route email identifiers to email delivery
        if "@" in identifier:
            email_provider = EmailOtpProvider()
            return email_provider.send(identifier, code, purpose)

        # Phone delivery via Kavenegar SMS API
        url = f"https://api.kavenegar.com/v1/{self.api_key}/sms/send.json"
        data = {
            "receptor": identifier,
            "message": f"کد تأیید اندورا: {code}\n(معتبر تا ۵ دقیقه)",
        }
        if self.sender:
            data["sender"] = self.sender

        try:
            encoded_data = urllib.parse.urlencode(data).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=encoded_data,
                headers={"User-Agent": "Endoora-Backend/1.0"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                return_meta = resp_data.get("return", {})
                if return_meta.get("status") != 200:
                    status_code = return_meta.get("status")
                    logger.error("Kavenegar API returned non-200 return status: %s", status_code)
                    raise OtpDeliveryError(f"Kavenegar API returned status {status_code}")

                entries = resp_data.get("entries", [])
                if not entries:
                    raise OtpDeliveryError("Kavenegar API returned no dispatch entries.")

                return OtpDelivery(provider=self.name, accepted=True)
        except urllib.error.URLError as exc:
            logger.error("Kavenegar network communication error: %s", type(exc).__name__)
            raise OtpDeliveryError("Kavenegar communication error") from exc
        except Exception as exc:
            if isinstance(exc, OtpDeliveryError):
                raise
            logger.error("Kavenegar delivery error: %s", type(exc).__name__)
            raise OtpDeliveryError("Kavenegar delivery error") from exc


def get_otp_provider() -> BaseOtpProvider:
    provider_name = getattr(settings, "ENDOORA_OTP_PROVIDER", "mock").strip().lower()

    if provider_name == "mock":
        # Keep mock delivery restricted to explicit development/test use.
        is_debug = getattr(settings, "DEBUG", False)
        is_testing = getattr(settings, "TESTING", False)
        env = getattr(settings, "ENDOORA_ENV", "development").strip().lower()
        if not is_debug and not is_testing and env == "production":
            raise ImproperlyConfigured(
                "Local mock OTP delivery is prohibited in production. "
                "Configure ENDOORA_OTP_PROVIDER='kavenegar' and provide credentials."
            )
        return LocalMockOtpProvider()

    if provider_name == "kavenegar":
        if getattr(settings, "ENDOORA_SMS_TEMPLATE", None):
            from .sms import KavenegarProvider
            return KavenegarProvider()
        return KavenegarOtpProvider()

    if provider_name == "sms":
        from .sms import KavenegarProvider
        return KavenegarProvider()

    if provider_name == "email":
        return EmailOtpProvider()

    raise ImproperlyConfigured(
        f"Unsupported ENDOORA_OTP_PROVIDER={provider_name!r}. "
        "Supported providers: 'mock', 'kavenegar', 'sms', 'email'."
    )
    )
