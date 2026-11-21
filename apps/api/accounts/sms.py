import json
import re
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

from django.conf import settings

from .providers import BaseOtpProvider, OtpDelivery


class DeliveryUnavailable(Exception):
    """Safe to catch at the API boundary without logging identifiers or keys."""


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class KavenegarProvider(BaseOtpProvider):
    name = "kavenegar"

    def send(self, identifier, code, purpose):
        key = settings.ENDOORA_SMS_API_KEY
        template = settings.ENDOORA_SMS_TEMPLATE
        if not re.fullmatch(r"[a-zA-Z0-9]+", key or "") or not template or not re.fullmatch(r"\+989\d{9}", identifier):
            raise DeliveryUnavailable()
        data = urlencode({"receptor": "0" + identifier[3:], "token": code, "template": template}).encode()
        req = Request(f"https://api.kavenegar.com/v1/{key}/verify/lookup.json", data=data, method="POST")
        try:
            with build_opener(NoRedirect).open(req, timeout=5) as response:
                payload = json.loads(response.read(65536))
            if (payload["return"]["status"] != 200 or not isinstance(payload.get("entries"), list)
                    or not payload["entries"] or int(payload["entries"][0]["messageid"]) <= 0):
                raise DeliveryUnavailable()
        except (URLError, OSError, ValueError, TypeError, KeyError, IndexError):
            raise DeliveryUnavailable() from None
        return OtpDelivery(provider=self.name, accepted=True)
