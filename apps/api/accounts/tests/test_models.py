from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.test import TestCase
from django.utils import timezone

from accounts.models import OneTimeCode, User


class AccountModelTests(TestCase):
    def test_default_role_is_learner_and_teacher_capabilities_are_off(self):
        user = User.objects.create_user(
            email="learner@example.com",
            password="StrongPass-123!",
        )
        self.assertEqual(user.role, User.Role.LEARNER)
        self.assertFalse(user.capabilities["teacher_verified"])
        self.assertFalse(user.capabilities["marketplace_eligible"])
        self.assertFalse(user.capabilities["paid_class_eligible"])

    def test_phone_is_normalized(self):
        user = User.objects.create_user(
            email="phone@example.com",
            password="StrongPass-123!",
            phone="09123456789",
        )
        self.assertEqual(user.phone, "+989123456789")

    def test_expired_otp_fails(self):
        otp = OneTimeCode.objects.create(
            identifier="+989123456789",
            purpose=OneTimeCode.Purpose.PHONE_VERIFY,
            code_hash=make_password("123456"),
            expires_at=timezone.now() - timedelta(seconds=1),
        )
        self.assertFalse(otp.verify("123456"))
        self.assertIsNone(otp.consumed_at)

    def test_raw_otp_is_not_stored(self):
        otp = OneTimeCode.objects.create(
            identifier="person@example.com",
            purpose=OneTimeCode.Purpose.PASSWORD_RESET,
            code_hash=make_password("654321"),
            expires_at=timezone.now() + timedelta(minutes=5),
        )
        self.assertNotEqual(otp.code_hash, "654321")
        self.assertNotIn("654321", otp.code_hash)
