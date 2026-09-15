from __future__ import annotations
import json
import re
import threading
import time
from django.conf import settings
from django.http import JsonResponse

class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["X-Content-Type-Options"] = "nosniff"
        response["X-Frame-Options"] = "DENY"
        response["X-XSS-Protection"] = "1; mode=block"
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response["Permissions-Policy"] = "camera=(), microphone=(self), geolocation=()"
        
        csp_report_only = getattr(settings, "ENDOORA_CSP_REPORT_ONLY", True)
        if csp_report_only:
            response["Content-Security-Policy-Report-Only"] = "default-src 'self'"
        else:
            response["Content-Security-Policy"] = "default-src 'self'"

        if getattr(settings, "ENDOORA_ENV", "development") != "development":
            max_age = getattr(settings, "ENDOORA_HSTS_MAX_AGE", 31536000)
            response["Strict-Transport-Security"] = f"max-age={max_age}; includeSubDomains; preload"

        return response


class InputSanitizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.dangerous_patterns = [
            re.compile(r"<script", re.IGNORECASE),
            re.compile(r"javascript:", re.IGNORECASE),
            re.compile(r"on[a-z]+\s*=", re.IGNORECASE),
            re.compile(r"UNION\s+SELECT", re.IGNORECASE),
            re.compile(r"DROP\s+TABLE", re.IGNORECASE),
            re.compile(r"INSERT\s+INTO.*VALUES", re.IGNORECASE),
            re.compile(r"DELETE\s+FROM.*WHERE\s+1=1", re.IGNORECASE),
            re.compile(r"OR\s+1=1", re.IGNORECASE),
            re.compile(r"';\s*--", re.IGNORECASE),
        ]

    def __call__(self, request):
        if request.path.startswith("/admin/"):
            return self.get_response(request)

        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.META.get("CONTENT_TYPE", "")
            if any(ctype in content_type for ctype in ["json", "form-urlencoded", "multipart"]):
                try:
                    body = request.body.decode("utf-8", errors="ignore")
                    for pattern in self.dangerous_patterns:
                        if pattern.search(body):
                            return JsonResponse(
                                {"detail": "درخواست شامل محتوای غیرمجاز است.", "code": "DANGEROUS_INPUT_DETECTED"},
                                status=400
                            )
                except Exception:
                    pass

        return self.get_response(request)


class IPRateLimitMiddleware:
    _lock = threading.Lock()
    _records = {}
    _cleanup_counter = 0

    def __init__(self, get_response):
        self.get_response = get_response
        self.limit = getattr(settings, "ENDOORA_IP_RATE_LIMIT_PER_MINUTE", 120)
        self.window = 60

    def __call__(self, request):
        ip = self.get_client_ip(request)
        now = time.time()
        
        with self._lock:
            self.__class__._cleanup_counter += 1
            if self.__class__._cleanup_counter > 100:
                self.cleanup(now)
                self.__class__._cleanup_counter = 0

            record = self.__class__._records.get(ip, {"count": 0, "start": now})
            if now - record["start"] > self.window:
                record = {"count": 1, "start": now}
            else:
                record["count"] += 1

            self.__class__._records[ip] = record

            if record["count"] > self.limit:
                retry_after = int(self.window - (now - record["start"]))
                response = JsonResponse(
                    {"detail": "تعداد درخواستها بیش از حد مجاز است. لطفاً کمی صبر کنید.", "code": "IP_RATE_LIMIT_EXCEEDED", "retry_after": retry_after},
                    status=429
                )
                response["Retry-After"] = str(retry_after)
                return response

        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")

    def cleanup(self, now):
        expired = [ip for ip, record in self.__class__._records.items() if now - record["start"] > self.window]
        for ip in expired:
            del self.__class__._records[ip]
