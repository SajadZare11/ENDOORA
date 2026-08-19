from django.core.exceptions import ValidationError
from django.test import TestCase

from core.models import FeatureFlag, SystemSetting


class SystemSettingValidationTests(TestCase):
    def test_secret_like_key_is_rejected(self):
        setting = SystemSetting(
            key="openrouter_api_key",
            value_type=SystemSetting.ValueType.STRING,
            value="not-a-real-secret",
            environment_scope=SystemSetting.EnvironmentScope.DEVELOPMENT,
            owner="security",
            rationale="test",
        )
        with self.assertRaises(ValidationError):
            setting.full_clean()

    def test_unsafe_bypass_is_rejected(self):
        setting = SystemSetting(
            key="payment_bypass",
            value_type=SystemSetting.ValueType.BOOLEAN,
            value=True,
            environment_scope=SystemSetting.EnvironmentScope.DEVELOPMENT,
            owner="finance",
            rationale="test",
        )
        with self.assertRaises(ValidationError):
            setting.full_clean()

    def test_typed_value_is_required(self):
        setting = SystemSetting(
            key="homepage_item_limit",
            value_type=SystemSetting.ValueType.INTEGER,
            value="10",
            environment_scope=SystemSetting.EnvironmentScope.GLOBAL,
            owner="product",
            rationale="test",
        )
        with self.assertRaises(ValidationError):
            setting.full_clean()


class FeatureFlagValidationTests(TestCase):
    def test_invalid_environment_is_rejected(self):
        flag = FeatureFlag(
            key="voice_beta",
            enabled=False,
            rollout_percentage=0,
            environments=["production", "local-machine"],
            owner="ai",
            rationale="test",
        )
        with self.assertRaises(ValidationError):
            flag.full_clean()

    def test_enabled_flag_requires_nonzero_rollout(self):
        flag = FeatureFlag(
            key="voice_beta",
            enabled=True,
            rollout_percentage=0,
            environments=["staging"],
            owner="ai",
            rationale="test",
        )
        with self.assertRaises(ValidationError):
            flag.full_clean()

    def test_self_dependency_is_rejected(self):
        flag = FeatureFlag(
            key="voice_beta",
            enabled=False,
            rollout_percentage=0,
            environments=["staging"],
            owner="ai",
            rationale="test",
            dependencies=["voice_beta"],
        )
        with self.assertRaises(ValidationError):
            flag.full_clean()
