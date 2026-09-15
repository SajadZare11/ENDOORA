from __future__ import annotations
import json
from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User
from security.middleware import SecurityHeadersMiddleware, InputSanitizationMiddleware, IPRateLimitMiddleware
from security.throttles import RoleBasedThrottle, BurstProtectionThrottle
from security.validators import sanitize_text_input, validate_no_injection, validate_content_length
from django.core.exceptions import ValidationError
from django.http import HttpResponse

class SecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(email="learner@example.com", password="password", role="learner")
        self.admin = User.objects.create_user(email="admin@example.com", password="password", role="administrator", is_staff=True)
        self.factory = RequestFactory()
        
        # Reset IP Rate Limit Store
        IPRateLimitMiddleware._records = {}

    def test_security_headers_present(self):
        middleware = SecurityHeadersMiddleware(lambda req: HttpResponse("OK"))
        request = self.factory.get("/")
        response = middleware(request)
        
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response["X-Frame-Options"], "DENY")
        self.assertEqual(response["X-XSS-Protection"], "1; mode=block")
        self.assertEqual(response["Referrer-Policy"], "strict-origin-when-cross-origin")
        self.assertEqual(response["Permissions-Policy"], "camera=(), microphone=(self), geolocation=()")
        self.assertIn("default-src 'self'", response.get("Content-Security-Policy-Report-Only", response.get("Content-Security-Policy", "")))

    def test_xss_payload_blocked(self):
        middleware = InputSanitizationMiddleware(lambda req: HttpResponse("OK"))
        request = self.factory.post(
            "/api/test/", 
            data='{"text": "<script>alert(1)</script>"}', 
            content_type="application/json"
        )
        response = middleware(request)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("DANGEROUS_INPUT_DETECTED", response.content.decode('utf-8'))

    def test_sql_injection_blocked(self):
        middleware = InputSanitizationMiddleware(lambda req: HttpResponse("OK"))
        request = self.factory.post(
            "/api/test/", 
            data="text='; DROP TABLE users; --", 
            content_type="application/x-www-form-urlencoded"
        )
        response = middleware(request)
        
        self.assertEqual(response.status_code, 400)

    def test_clean_input_allowed(self):
        middleware = InputSanitizationMiddleware(lambda req: HttpResponse("OK"))
        request = self.factory.post(
            "/api/test/", 
            data='{"text": "Hello world"}', 
            content_type="application/json"
        )
        response = middleware(request)
        
        self.assertEqual(response.status_code, 200)

    def test_ip_rate_limit_returns_429(self):
        middleware = IPRateLimitMiddleware(lambda req: HttpResponse("OK"))
        middleware.limit = 2
        
        request = self.factory.get("/")
        request.META["REMOTE_ADDR"] = "127.0.0.1"
        
        middleware(request)
        middleware(request)
        
        response = middleware(request)
        
        self.assertEqual(response.status_code, 429)
        self.assertIn("IP_RATE_LIMIT_EXCEEDED", response.content.decode('utf-8'))
        self.assertTrue(response.has_header("Retry-After"))

    def test_role_based_throttle_rates(self):
        throttle = RoleBasedThrottle()
        
        request = self.factory.get("/")
        request.user = self.learner
        
        throttle.allow_request(request, None)
        self.assertEqual(throttle.rate, "60/minute")
        
        request.user = self.admin
        throttle.allow_request(request, None)
        self.assertEqual(throttle.rate, "500/minute")

    def test_burst_protection_throttle(self):
        throttle = BurstProtectionThrottle()
        self.assertEqual(throttle.scope, "burst_protection")
        self.assertEqual(throttle.rate, "10/second")
        
        request = self.factory.get("/")
        request.user = self.learner
        key = throttle.get_cache_key(request, None)
        self.assertTrue(key.startswith("throttle_burst_protection_"))

    def test_security_audit_requires_admin(self):
        self.client.force_authenticate(user=self.learner)
        response = self.client.get(reverse("security-audit"))
        self.assertEqual(response.status_code, 403)
        
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("security-audit"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("throttle_config", response.json())

    def test_security_health_public(self):
        response = self.client.get(reverse("security-health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "operational")

    def test_input_validators(self):
        # test sanitize_text_input
        dirty = "hello <script>bad()</script> world javascript:alert(1) onclick=foo"
        clean = sanitize_text_input(dirty)
        self.assertNotIn("<script>", clean)
        self.assertNotIn("javascript:", clean)
        self.assertNotIn("onclick=", clean)
        
        # test validate_no_injection
        with self.assertRaises(ValidationError):
            validate_no_injection("SELECT * FROM users; DROP TABLE users; --")
            
        validate_no_injection("Normal text")
        
        # test validate_content_length
        with self.assertRaises(ValidationError):
            validate_content_length("a" * 100, max_bytes=50)
            
        validate_content_length("a", max_bytes=50)

    def test_admin_django_path_exempt_from_sanitization(self):
        middleware = InputSanitizationMiddleware(lambda req: HttpResponse("OK"))
        request = self.factory.post(
            "/admin/users/", 
            data='{"text": "<script>alert(1)</script>"}', 
            content_type="application/json"
        )
        response = middleware(request)
        
        self.assertEqual(response.status_code, 200)
