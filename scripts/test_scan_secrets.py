from __future__ import annotations

import unittest

from scripts.scan_secrets import is_obvious_placeholder, scan_text


class SecretScannerRegressionTests(unittest.TestCase):
    def test_known_local_placeholder_is_not_flagged(self) -> None:
        text = "ENDOORA_DJANGO_SECRET_KEY=local-development-only-change-me"
        self.assertEqual(scan_text(text), [])

    def test_known_ci_placeholder_is_not_flagged(self) -> None:
        text = "ENDOORA_DJANGO_SECRET_KEY: ci-only-not-a-production-secret"
        self.assertEqual(scan_text(text), [])

    def test_realistic_long_secret_assignment_is_flagged(self) -> None:
        text = "API_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
        self.assertIn("generic API secret assignment", scan_text(text))

    def test_openrouter_key_shape_is_flagged(self) -> None:
        text = "ENDOORA_OPENROUTER_API_KEY=sk-or-v1-abcdefghijklmnopqrstuvwxyz123456"
        self.assertIn("OpenRouter key", scan_text(text))

    def test_placeholder_marker_detection(self) -> None:
        self.assertTrue(is_obvious_placeholder("<ZARINPAL_MERCHANT_ID>"))
        self.assertFalse(is_obvious_placeholder("AbCdEfGhIjKlMnOpQrStUvWxYz123456"))


if __name__ == "__main__":
    unittest.main()
