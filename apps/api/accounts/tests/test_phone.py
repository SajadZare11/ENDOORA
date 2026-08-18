from django.test import SimpleTestCase

from accounts.phone import InvalidIranianMobile, normalize_iranian_mobile


class IranianMobileNormalizationTests(SimpleTestCase):
    def test_supported_formats_normalize_to_e164(self):
        cases = {
            "09123456789": "+989123456789",
            "+989123456789": "+989123456789",
            "989123456789": "+989123456789",
            "00989123456789": "+989123456789",
            "9123456789": "+989123456789",
            "0912 345 6789": "+989123456789",
        }
        for raw, expected in cases.items():
            with self.subTest(raw=raw):
                self.assertEqual(normalize_iranian_mobile(raw), expected)

    def test_invalid_number_fails(self):
        with self.assertRaises(InvalidIranianMobile):
            normalize_iranian_mobile("02112345678")
