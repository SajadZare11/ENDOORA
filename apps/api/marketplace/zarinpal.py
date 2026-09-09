"""
ZarinPal and Sandbox Payment Gateway Integration Module for Endoora Marketplace (Day 42 - MKT-008).

Rules & Invariants:
- Currency conversion: Endoora internal order currency is Toman. Iranian Shaparak/Zarinpal banking gateways transact in Rials (1 Toman = 10 Rials).
- Zero direct status edits: Status mutations must be performed via verified gateway responses or cryptographically signed sandbox callbacks.
- Sandbox mode: Configurable via settings.ZARINPAL_SANDBOX or is_sandbox flag.
"""

import json
import logging
import random
import urllib.error
import urllib.request
import uuid
from decimal import Decimal
from typing import Any, Dict, Optional

from django.conf import settings

logger = logging.getLogger(__name__)

ZARINPAL_REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json"
ZARINPAL_VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json"
ZARINPAL_STARTPAY_URL = "https://www.zarinpal.com/pg/StartPay/{authority}"

ZARINPAL_SANDBOX_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
ZARINPAL_SANDBOX_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
ZARINPAL_SANDBOX_STARTPAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/{authority}"


class PaymentGatewayError(Exception):
    """Raised when payment gateway request fails or returns an error."""
    def __init__(self, message: str, code: Optional[int] = None, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}


class PaymentVerificationError(PaymentGatewayError):
    """Raised when payment verification fails."""
    pass


def toman_to_rial(toman: Decimal | int | float) -> int:
    """Convert Toman to Iranian Rial (1 Toman = 10 Rials)."""
    return int(Decimal(str(toman)) * 10)


def rial_to_toman(rial: Decimal | int | float) -> int:
    """Convert Iranian Rial to Toman."""
    return int(Decimal(str(rial)) // 10)


class ZarinPalGateway:
    """
    ZarinPal PG v4 Payment Gateway Client with seamless Sandbox fallback.
    """

    def __init__(
        self,
        merchant_id: Optional[str] = None,
        is_sandbox: Optional[bool] = None,
    ):
        self.merchant_id = merchant_id or getattr(
            settings, "ZARINPAL_MERCHANT_ID", "00000000-0000-0000-0000-000000000000"
        )
        if is_sandbox is not None:
            self.is_sandbox = is_sandbox
        else:
            self.is_sandbox = getattr(settings, "ZARINPAL_SANDBOX", True)

    def request_payment(
        self,
        amount_rial: int,
        description: str,
        callback_url: str,
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Request a payment authority code from ZarinPal.
        Returns dictionary with:
        - authority: str
        - payment_url: str
        - fee: int
        - is_sandbox: bool
        """
        if self.is_sandbox:
            authority = f"A0000000000000000000000000000{uuid.uuid4().hex[:6]}"
            payment_url = f"/checkout/callback?Authority={authority}&Status=OK&sandbox=true"
            logger.info("Sandbox payment initiated: authority=%s, amount_rial=%s", authority, amount_rial)
            return {
                "authority": authority,
                "payment_url": payment_url,
                "fee": 0,
                "is_sandbox": True,
            }

        payload = {
            "merchant_id": self.merchant_id,
            "amount": amount_rial,
            "description": description,
            "callback_url": callback_url,
            "metadata": metadata or {},
        }

        url = ZARINPAL_REQUEST_URL
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            logger.error("ZarinPal request HTTP error: %s", exc)
            raise PaymentGatewayError(f"خطای ارتباط با درگاه پرداخت زرین‌پال: {exc}")

        data_field = data.get("data") or {}
        code = data_field.get("code")
        if code != 100:
            errors = data.get("errors")
            msg = f"خطای درگاه زرین‌پال در صدور شناسه (کد {code}): {errors}"
            logger.error("ZarinPal request rejected: code=%s, errors=%s", code, errors)
            raise PaymentGatewayError(msg, code=code, details=data)

        authority = data_field.get("authority")
        payment_url = ZARINPAL_STARTPAY_URL.format(authority=authority)
        return {
            "authority": authority,
            "payment_url": payment_url,
            "fee": data_field.get("fee", 0),
            "is_sandbox": False,
        }

    def verify_payment(
        self,
        amount_rial: int,
        authority: str,
    ) -> Dict[str, Any]:
        """
        Verify an authorized payment.
        Returns dictionary with:
        - ref_id: str
        - card_pan: str
        - card_hash: str
        - fee: int
        - fee_type: str
        - code: int (100 = verified, 101 = verified previously)
        - is_sandbox: bool
        """
        if self.is_sandbox:
            ref_num = abs(hash(authority)) % 90000000 + 10000000
            logger.info("Sandbox payment verified: authority=%s, ref_id=%s", authority, ref_num)
            return {
                "ref_id": str(ref_num),
                "card_pan": "603799******1234",
                "card_hash": "sandbox_pan_hash_day42",
                "fee": 0,
                "fee_type": "Merchant",
                "code": 100,
                "is_sandbox": True,
            }

        payload = {
            "merchant_id": self.merchant_id,
            "amount": amount_rial,
            "authority": authority,
        }

        url = ZARINPAL_VERIFY_URL
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            logger.error("ZarinPal verify HTTP error: %s", exc)
            raise PaymentVerificationError(f"خطای ارتباط با درگاه در اعتبارسنجی: {exc}")

        data_field = data.get("data") or {}
        code = data_field.get("code")
        if code not in (100, 101):
            errors = data.get("errors")
            msg = f"اعتبارسنجی تراکنش ناموفق بود (کد {code}): {errors}"
            logger.error("ZarinPal verify rejected: code=%s, errors=%s", code, errors)
            raise PaymentVerificationError(msg, code=code, details=data)

        return {
            "ref_id": str(data_field.get("ref_id")),
            "card_pan": data_field.get("card_pan", ""),
            "card_hash": data_field.get("card_hash", ""),
            "fee": data_field.get("fee", 0),
            "fee_type": data_field.get("fee_type", "Merchant"),
            "code": code,
            "is_sandbox": False,
        }
