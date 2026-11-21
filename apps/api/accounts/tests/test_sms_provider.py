from io import BytesIO
from unittest.mock import patch
from urllib.error import URLError
from django.test import SimpleTestCase, override_settings
from accounts.sms import KavenegarProvider, DeliveryUnavailable


@override_settings(ENDOORA_SMS_API_KEY="fixture", ENDOORA_SMS_TEMPLATE="test")
class SmsProviderTests(SimpleTestCase):
    @patch("accounts.sms.build_opener")
    def test_provider_acceptance_and_failure(self, build):
        opener = build.return_value
        opener.open.return_value = BytesIO(b'{"return":{"status":200},"entries":[{"messageid":21}]}')
        self.assertTrue(KavenegarProvider().send("+989123456789", "123456", "login").accepted)
        request = opener.open.call_args.args[0]
        self.assertIn(b"receptor=09123456789", request.data)
        opener.open.side_effect = URLError("offline")
        with self.assertRaises(DeliveryUnavailable):
            KavenegarProvider().send("+989123456789", "123456", "login")
        with self.assertRaises(DeliveryUnavailable):
            KavenegarProvider().send("example@example.org", "123456", "login")
