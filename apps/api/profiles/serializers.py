import json
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from rest_framework import serializers

from .models import (
    DataExportRequest,
    LearnerProfile,
    OnboardingProgress,
    TeacherProfile,
)


VALID_STUDY_DAYS = {
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
}

BLOCKED_DRAFT_KEYWORDS = {
    "password",
    "passcode",
    "otp",
    "token",
    "secret",
    "api_key",
    "merchant_id",
    "identity_document",
    "national_id",
    "bank_account",
}


def _validate_string_list(
    value,
    *,
    field_name: str,
    max_items: int,
    max_item_length: int,
):
    if not isinstance(value, list):
        raise serializers.ValidationError(
            f"{field_name} must be a list."
        )

    if len(value) > max_items:
        raise serializers.ValidationError(
            f"{field_name} contains too many items."
        )

    cleaned = []

    for item in value:
        if not isinstance(item, str):
            raise serializers.ValidationError(
                f"Every {field_name} item must be text."
            )

        item = item.strip()

        if not item:
            continue

        if len(item) > max_item_length:
            raise serializers.ValidationError(
                f"One {field_name} item is too long."
            )

        if item not in cleaned:
            cleaned.append(item)

    return cleaned


def _contains_blocked_key(value) -> bool:
    if isinstance(value, dict):
        for key, nested_value in value.items():
            normalized_key = str(key).strip().lower()

            if any(
                blocked in normalized_key
                for blocked in BLOCKED_DRAFT_KEYWORDS
            ):
                return True

            if _contains_blocked_key(nested_value):
                return True

    elif isinstance(value, list):
        return any(_contains_blocked_key(item) for item in value)

    return False


class LearnerProfileSerializer(serializers.ModelSerializer):
    completeness_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = LearnerProfile
        fields = (
            "id",
            "goal",
            "age_band",
            "current_estimate",
            "preferred_daily_minutes",
            "preferred_days",
            "timezone",
            "completeness_percent",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "completeness_percent",
            "created_at",
            "updated_at",
        )

    def validate_preferred_days(self, value):
        days = _validate_string_list(
            value,
            field_name="preferred_days",
            max_items=7,
            max_item_length=16,
        )

        invalid_days = [
            day for day in days if day not in VALID_STUDY_DAYS
        ]

        if invalid_days:
            raise serializers.ValidationError(
                "Use full English weekday identifiers such as "
                "'saturday' or 'monday'."
            )

        return days

    def validate_timezone(self, value):
        value = value.strip()

        try:
            ZoneInfo(value)
        except ZoneInfoNotFoundError as exc:
            raise serializers.ValidationError(
                "Unknown timezone."
            ) from exc

        return value


class TeacherProfileSerializer(serializers.ModelSerializer):
    completeness_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = (
            "id",
            "public_name",
            "bio",
            "experience_years",
            "specialties",
            "city",
            "languages",
            "availability_intent",
            "verification_intent",
            "completeness_percent",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "completeness_percent",
            "created_at",
            "updated_at",
        )

    def validate_specialties(self, value):
        return _validate_string_list(
            value,
            field_name="specialties",
            max_items=12,
            max_item_length=80,
        )

    def validate_languages(self, value):
        return _validate_string_list(
            value,
            field_name="languages",
            max_items=12,
            max_item_length=80,
        )


class OnboardingProgressSerializer(serializers.ModelSerializer):
    is_completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = OnboardingProgress
        fields = (
            "id",
            "role",
            "stage",
            "current_step",
            "completed_steps",
            "draft_data",
            "is_completed",
            "completed_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "role",
            "stage",
            "is_completed",
            "completed_at",
            "created_at",
            "updated_at",
        )

    def validate_current_step(self, value):
        if value < 1 or value > 20:
            raise serializers.ValidationError(
                "current_step must be between 1 and 20."
            )

        return value

    def validate_completed_steps(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                "completed_steps must be a list."
            )

        cleaned = []

        for item in value:
            if not isinstance(item, int):
                raise serializers.ValidationError(
                    "Every completed step must be an integer."
                )

            if item < 1 or item > 20:
                raise serializers.ValidationError(
                    "Completed step numbers must be between 1 and 20."
                )

            if item not in cleaned:
                cleaned.append(item)

        return sorted(cleaned)

    def validate_draft_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "draft_data must be an object."
            )

        if _contains_blocked_key(value):
            raise serializers.ValidationError(
                "Sensitive authentication, identity, payment, or secret "
                "data cannot be stored in onboarding drafts."
            )

        encoded = json.dumps(
            value,
            ensure_ascii=False,
            separators=(",", ":"),
        ).encode("utf-8")

        if len(encoded) > 8192:
            raise serializers.ValidationError(
                "The onboarding draft is too large."
            )

        return value


class DataExportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataExportRequest
        fields = (
            "id",
            "status",
            "requested_at",
            "processing_started_at",
            "completed_at",
            "failure_code",
        )
        read_only_fields = fields