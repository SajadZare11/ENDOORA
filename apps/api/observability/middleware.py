from __future__ import annotations

import collections
import json
import logging
import time
import uuid
from typing import Callable
from django.http import HttpRequest, HttpResponse
from django.utils import timezone

logger = logging.getLogger("observability.structured")

# In-memory ring buffer for recent structured JSON logs (thread-safe operations in Python GIL)
LOG_BUFFER_MAX_SIZE = 150
STRUCTURED_LOG_BUFFER: collections.deque[dict] = collections.deque(maxlen=LOG_BUFFER_MAX_SIZE)


class CorrelationTraceMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # 1. Resolve or mint correlation and trace identifiers
        trace_id = request.headers.get("X-Trace-ID") or request.headers.get("X-Trace-Id")
        if not trace_id:
            trace_id = uuid.uuid4().hex

        correlation_id = request.headers.get("X-Correlation-ID") or request.headers.get("X-Correlation-Id")
        if not correlation_id:
            correlation_id = uuid.uuid4().hex

        request.trace_id = trace_id
        request.correlation_id = correlation_id

        # 2. Timing
        start_time = time.perf_counter()

        response = self.get_response(request)

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # 3. Headers propagation
        response["X-Trace-ID"] = trace_id
        response["X-Correlation-ID"] = correlation_id

        # 4. Resolve client IP and user context
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        client_ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR", "")
        user_id = str(request.user.id) if getattr(request, "user", None) and request.user.is_authenticated else None

        # Determine level
        status = response.status_code
        if status >= 500:
            level = "ERROR"
        elif status >= 400:
            level = "WARNING"
        else:
            level = "INFO"

        log_entry = {
            "timestamp": timezone.now().isoformat(),
            "level": level,
            "trace_id": trace_id,
            "correlation_id": correlation_id,
            "method": request.method,
            "path": request.path,
            "status_code": status,
            "duration_ms": duration_ms,
            "client_ip": client_ip,
            "user_id": user_id,
        }

        # Store in circular buffer for dashboard stream
        STRUCTURED_LOG_BUFFER.appendleft(log_entry)

        return response
