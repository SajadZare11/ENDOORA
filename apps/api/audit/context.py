from __future__ import annotations

from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass
from typing import Any, Iterator


@dataclass(frozen=True)
class AuditRequestContext:
    actor: Any | None = None
    reason: str = ""
    request_method: str = ""
    request_path: str = ""
    environment: str = "development"
    enabled: bool = False


_DEFAULT_CONTEXT = AuditRequestContext()
_AUDIT_CONTEXT: ContextVar[AuditRequestContext] = ContextVar(
    "endoora_audit_context",
    default=_DEFAULT_CONTEXT,
)


def get_audit_context() -> AuditRequestContext:
    return _AUDIT_CONTEXT.get()


@contextmanager
def audit_context(
    *,
    actor: Any | None,
    reason: str = "",
    request_method: str = "",
    request_path: str = "",
    environment: str = "development",
    enabled: bool = True,
) -> Iterator[AuditRequestContext]:
    context = AuditRequestContext(
        actor=actor,
        reason=reason.strip()[:500],
        request_method=request_method.strip().upper()[:16],
        request_path=request_path.strip()[:500],
        environment=environment.strip()[:32] or "development",
        enabled=enabled,
    )
    token = _AUDIT_CONTEXT.set(context)
    try:
        yield context
    finally:
        _AUDIT_CONTEXT.reset(token)
