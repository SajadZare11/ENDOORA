"""
Endoora AI Gateway - Backend-only OpenRouter Client
Enforces:
1. Strict backend-only invocation (never called directly from browser).
2. Circuit breaker timeout (default 15 seconds).
3. Daily budget cap (stops calls when daily budget reached).
4. API key and credential redaction from all error messages.
5. Latency and token cost measurement.
"""

import json
import logging
import os
import time
import urllib.error
import urllib.request
from typing import Any

from .models import AIProviderConfig, AIRequestLog

logger = logging.getLogger(__name__)


class AIClientError(Exception):
    """Base exception for AI client failures."""
    pass


class AIClientTimeoutError(AIClientError):
    """Raised when an AI provider call times out."""
    pass


class BudgetExceededError(AIClientError):
    """Raised when the daily budget ceiling has been reached."""
    pass


class OpenRouterClient:
    """Secure, backend-only HTTP client for OpenRouter API."""

    DEFAULT_BASE_URL = "https://openrouter.ai/api/v1"
    DEFAULT_TIMEOUT_SECONDS = 15
    DEFAULT_DAILY_BUDGET_USD = 5.00

    def __init__(self, config: AIProviderConfig | None = None):
        self.config = config or self._get_or_create_default_config()

    @classmethod
    def _get_or_create_default_config(cls) -> AIProviderConfig:
        config = AIProviderConfig.objects.filter(enabled=True).first()
        if not config:
            config, _ = AIProviderConfig.objects.get_or_create(
                name="openrouter_main",
                defaults={
                    "provider": "openrouter",
                    "api_base_url": cls.DEFAULT_BASE_URL,
                    "api_key_env_var": "ENDOORA_OPENROUTER_API_KEY",
                    "timeout_seconds": cls.DEFAULT_TIMEOUT_SECONDS,
                    "daily_budget_usd": cls.DEFAULT_DAILY_BUDGET_USD,
                    "current_daily_spend_usd": 0.0,
                    "enabled": True,
                },
            )
        return config

    def get_api_key(self) -> str:
        env_var = self.config.api_key_env_var or "ENDOORA_OPENROUTER_API_KEY"
        key = os.getenv(env_var, "") or os.getenv("OPENROUTER_API_KEY", "")
        return key.strip()

    def check_budget(self) -> None:
        """Enforces daily budget ceiling circuit breaker."""
        if not self.config.enabled:
            raise AIClientError("AI Provider is currently disabled by administrator.")

        if self.config.current_daily_spend_usd >= self.config.daily_budget_usd:
            raise BudgetExceededError(
                f"Daily AI budget limit (${self.config.daily_budget_usd:.2f}) reached. "
                f"Current spend: ${self.config.current_daily_spend_usd:.4f}."
            )

    def redact_sensitive_info(self, text: str) -> str:
        """Sanitizes API keys and tokens from strings and exception messages."""
        if not text:
            return ""
        key = self.get_api_key()
        if key and len(key) > 4:
            text = text.replace(key, "[REDACTED_API_KEY]")
        return text

    def chat_completion(
        self,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.4,
        max_tokens: int = 1500,
        response_format: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """
        Executes a chat completion call to OpenRouter.
        Returns a dictionary with parsed response content, token counts, latency, and cost.
        """
        self.check_budget()

        api_key = self.get_api_key()
        if not api_key:
            raise AIClientError("OpenRouter API key is not configured. Fallback required.")

        base_url = (self.config.api_base_url or self.DEFAULT_BASE_URL).rstrip("/")
        endpoint = f"{base_url}/chat/completions"
        timeout = self.config.timeout_seconds or self.DEFAULT_TIMEOUT_SECONDS

        payload: dict[str, Any] = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        data_bytes = json.dumps(payload).encode("utf-8")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://endoora.com",
            "X-Title": "Endoora Pedagogical Engine",
            "User-Agent": "Endoora-Backend-AI-Gateway/1.0",
        }

        req = urllib.request.Request(endpoint, data=data_bytes, headers=headers, method="POST")
        start_time = time.monotonic()

        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                status_code = response.getcode()
                raw_body = response.read().decode("utf-8")
                elapsed_ms = int((time.monotonic() - start_time) * 1000)

                parsed = json.loads(raw_body)
                choices = parsed.get("choices", [])
                if not choices:
                    raise AIClientError("OpenRouter returned empty choices in response.")

                message = choices[0].get("message", {})
                content = message.get("content", "")

                usage = parsed.get("usage", {})
                prompt_tokens = usage.get("prompt_tokens", 0)
                completion_tokens = usage.get("completion_tokens", 0)

                cost_usd = self._estimate_cost(model, prompt_tokens, completion_tokens)
                self._record_spend(cost_usd)

                return {
                    "content": content,
                    "model": parsed.get("model", model),
                    "prompt_tokens": prompt_tokens,
                    "completion_tokens": completion_tokens,
                    "response_time_ms": elapsed_ms,
                    "cost_usd": cost_usd,
                    "status_code": status_code,
                }

        except urllib.error.HTTPError as exc:
            elapsed_ms = int((time.monotonic() - start_time) * 1000)
            err_body = ""
            try:
                err_body = exc.read().decode("utf-8", errors="replace")
            except Exception:
                pass
            sanitized = self.redact_sensitive_info(f"HTTP {exc.code} {exc.reason}: {err_body}")
            if exc.code == 429:
                raise AIClientError(f"Rate limited (429) on model {model}: {sanitized}")
            raise AIClientError(f"OpenRouter API HTTP {exc.code} error: {sanitized}")

        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            elapsed_ms = int((time.monotonic() - start_time) * 1000)
            if "timed out" in str(exc).lower() or isinstance(exc, TimeoutError):
                raise AIClientTimeoutError(
                    f"OpenRouter call timed out after {timeout}s on model {model} ({elapsed_ms}ms)"
                )
            sanitized = self.redact_sensitive_info(str(exc))
            raise AIClientError(f"Network error connecting to OpenRouter: {sanitized}")

        except json.JSONDecodeError as exc:
            elapsed_ms = int((time.monotonic() - start_time) * 1000)
            raise AIClientError(f"Invalid JSON received from provider: {exc}")

    def _estimate_cost(self, model: str, prompt_tokens: int, completion_tokens: int) -> float:
        if ":free" in model or "free" in model.lower():
            return 0.0

        if "70b" in model.lower():
            prompt_rate = 0.50 / 1_000_000
            comp_rate = 1.50 / 1_000_000
        else:
            prompt_rate = 0.15 / 1_000_000
            comp_rate = 0.20 / 1_000_000

        return round((prompt_tokens * prompt_rate) + (completion_tokens * comp_rate), 6)

    def _record_spend(self, cost_usd: float) -> None:
        if cost_usd <= 0.0:
            return
        try:
            self.config.current_daily_spend_usd = round(
                self.config.current_daily_spend_usd + cost_usd, 6
            )
            self.config.save(update_fields=["current_daily_spend_usd", "updated_at"])
        except Exception as exc:
            logger.warning("Could not persist AI daily spend: %s", exc)
