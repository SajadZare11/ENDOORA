from __future__ import annotations

import re

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


_SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9_-]*$")

_SENSITIVE_KEY_FRAGMENTS = {
    "access_token",
    "apikey",
    "password",
    "client_secret",
    "secret",
    "token",
    "credential",
    "api_key",
    "api-key",
    "private_key",
    "private-key",
    "merchant_id",
    "merchant-id",
    "merchantid",
    "otp",
}

_UNSAFE_BOOLEAN_KEYS = {
    "allow_all_hosts",
    "debug",
    "disable_auth",
    "disable_csrf",
    "payment_bypass",
    "skip_payment_verification",
}

_ALLOWED_ENVIRONMENTS = {"development", "test", "staging", "production"}


class SystemSetting(models.Model):
    class ValueType(models.TextChoices):
        STRING = "string", "String"
        INTEGER = "integer", "Integer"
        BOOLEAN = "boolean", "Boolean"
        JSON = "json", "JSON object/list"

    class EnvironmentScope(models.TextChoices):
        GLOBAL = "global", "All environments"
        DEVELOPMENT = "development", "Development"
        TEST = "test", "Test"
        STAGING = "staging", "Staging"
        PRODUCTION = "production", "Production"

    key = models.SlugField(max_length=120, unique=True)
    value_type = models.CharField(max_length=16, choices=ValueType.choices)
    value = models.JSONField()
    description = models.TextField(blank=True)
    environment_scope = models.CharField(
        max_length=16,
        choices=EnvironmentScope.choices,
        default=EnvironmentScope.GLOBAL,
    )
    owner = models.CharField(max_length=120)
    rationale = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("key",)

    def clean(self):
        errors: dict[str, str] = {}
        lowered = self.key.lower()

        if any(fragment in lowered for fragment in _SENSITIVE_KEY_FRAGMENTS):
            errors["key"] = (
                "Secrets and credentials must stay in environment variables or the deployment "
                "secret manager, not SystemSetting."
            )

        expected_type = {
            self.ValueType.STRING: str,
            self.ValueType.INTEGER: int,
            self.ValueType.BOOLEAN: bool,
            self.ValueType.JSON: (dict, list),
        }.get(self.value_type)

        if expected_type is None:
            errors["value_type"] = "Unsupported setting value type."
        elif self.value_type == self.ValueType.INTEGER:
            if isinstance(self.value, bool) or not isinstance(self.value, int):
                errors["value"] = "This setting requires an integer value."
        elif not isinstance(self.value, expected_type):
            errors["value"] = f"This setting requires a {self.value_type} value."

        if (
            self.value is True
            and any(fragment in lowered for fragment in _UNSAFE_BOOLEAN_KEYS)
        ):
            errors["value"] = (
                "This unsafe bypass/debug setting cannot be enabled through the database."
            )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.key


class FeatureFlag(models.Model):
    class KillSwitchBehavior(models.TextChoices):
        DISABLE = "disable_feature", "Disable feature"
        REVIEWED_FALLBACK = "reviewed_fallback", "Use reviewed fallback"
        READ_ONLY = "read_only", "Read-only"
        RETRY_LATER = "retry_later", "Retry later"

    key = models.SlugField(max_length=120, unique=True)
    enabled = models.BooleanField(default=False)
    rollout_percentage = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    environments = models.JSONField(default=list)
    owner = models.CharField(max_length=120)
    rationale = models.TextField()
    dependencies = models.JSONField(default=list, blank=True)
    kill_switch_behavior = models.CharField(
        max_length=32,
        choices=KillSwitchBehavior.choices,
        default=KillSwitchBehavior.DISABLE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("key",)

    def clean(self):
        errors: dict[str, str] = {}

        if not isinstance(self.environments, list) or not self.environments:
            errors["environments"] = "Select at least one environment."
        else:
            invalid = sorted(set(self.environments) - _ALLOWED_ENVIRONMENTS)
            if invalid:
                errors["environments"] = (
                    "Unsupported environment(s): " + ", ".join(invalid)
                )

        if not isinstance(self.dependencies, list):
            errors["dependencies"] = "Dependencies must be a list of feature-flag keys."
        else:
            clean_dependencies = []
            for dependency in self.dependencies:
                if not isinstance(dependency, str) or not _SLUG_RE.match(dependency):
                    errors["dependencies"] = (
                        "Every dependency must be a lowercase slug."
                    )
                    break
                clean_dependencies.append(dependency)
            if self.key and self.key in clean_dependencies:
                errors["dependencies"] = "A feature flag cannot depend on itself."

        if self.enabled and self.rollout_percentage == 0:
            errors["rollout_percentage"] = (
                "An enabled flag must have a rollout percentage greater than zero."
            )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.key
