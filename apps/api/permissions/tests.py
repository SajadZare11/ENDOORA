from types import SimpleNamespace

from django.test import TestCase
from rest_framework.test import APIRequestFactory

from accounts.models import User
from permissions.base import IsSelfOrAdministrator, IsVerifiedTeacher


class PermissionFoundationTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="StrongPass-123!",
        )
        self.other = User.objects.create_user(
            email="other@example.com",
            password="StrongPass-123!",
        )

    def test_unrelated_user_fails_object_permission(self):
        request = self.factory.get("/")
        request.user = self.other
        permission = IsSelfOrAdministrator()
        self.assertFalse(
            permission.has_object_permission(request, None, self.owner)
        )

    def test_owner_passes_object_permission(self):
        request = self.factory.get("/")
        request.user = self.owner
        permission = IsSelfOrAdministrator()
        self.assertTrue(
            permission.has_object_permission(request, None, self.owner)
        )

    def test_teacher_role_alone_does_not_grant_verified_capability(self):
        teacher = User.objects.create_user(
            email="teacher@example.com",
            password="StrongPass-123!",
            role=User.Role.TEACHER,
            is_teacher_verified=False,
        )
        request = self.factory.get("/")
        request.user = teacher
        self.assertFalse(IsVerifiedTeacher().has_permission(request, None))
