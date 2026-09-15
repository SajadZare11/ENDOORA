from __future__ import annotations
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.utils import timezone
from admin_dashboard.permissions import IsAdministratorOrStaff

class SecurityAuditView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        return Response({
            "throttle_config": {
                "role_rates": {
                    "anonymous": "30/minute",
                    "learner": "60/minute",
                    "teacher": "100/minute",
                    "editor": "200/minute",
                    "support": "200/minute",
                    "administrator": "500/minute"
                },
                "ip_rate_limit": getattr(settings, "ENDOORA_IP_RATE_LIMIT_PER_MINUTE", 120),
                "burst_rate": "10/second",
            },
            "security_headers": {
                "x_content_type_options": getattr(settings, "SECURE_CONTENT_TYPE_NOSNIFF", False),
                "x_frame_options": getattr(settings, "X_FRAME_OPTIONS", "DENY"),
                "csp_enabled": True,
                "csp_report_only": getattr(settings, "ENDOORA_CSP_REPORT_ONLY", True),
                "hsts_enabled": getattr(settings, "ENDOORA_ENV", "development") != "development",
            },
            "cookie_security": {
                "csrf_httponly": getattr(settings, "CSRF_COOKIE_HTTPONLY", False),
                "csrf_samesite": getattr(settings, "CSRF_COOKIE_SAMESITE", "Lax"),
                "session_httponly": getattr(settings, "SESSION_COOKIE_HTTPONLY", True),
                "session_samesite": getattr(settings, "SESSION_COOKIE_SAMESITE", "Lax"),
            },
            "password_validators": len(getattr(settings, "AUTH_PASSWORD_VALIDATORS", [])),
            "cors_config": {
                "allowed_origins_count": len(getattr(settings, "CORS_ALLOWED_ORIGINS", [])),
                "allow_credentials": getattr(settings, "CORS_ALLOW_CREDENTIALS", False),
            },
            "module_version": "1.0.0",
            "evaluated_at": timezone.now().isoformat(),
        })

class SecurityHealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "operational", "module": "endoora-security", "version": "1.0.0"})
