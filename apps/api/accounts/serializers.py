from __future__ import annotations

from rest_framework import serializers

from .models import ConsentRecord, OneTimeCode, User
from .phone import InvalidIranianMobile, normalize_iranian_mobile


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False, write_only=True)


class AccountSerializer(serializers.ModelSerializer):
    email_verified = serializers.BooleanField(read_only=True)
    phone_verified = serializers.BooleanField(read_only=True)
    capabilities = serializers.DictField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "email_verified",
            "phone",
            "phone_verified",
            "role",
            "preferred_locale",
            "capabilities",
            "is_active",
        )
        read_only_fields = (
            "id",
            "email",
            "phone_verified",
            "role",
            "capabilities",
            "is_active",
        )


class AccountUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ("phone", "preferred_locale")

    def validate_phone(self, value):
        try:
            return normalize_iranian_mobile(value)
        except InvalidIranianMobile as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def update(self, instance, validated_data):
        if "phone" in validated_data:
            new_phone = validated_data["phone"]
            if new_phone != instance.phone:
                instance.phone = new_phone
                instance.phone_verified_at = None
        if "preferred_locale" in validated_data:
            instance.preferred_locale = validated_data["preferred_locale"]
        instance.save()
        return instance


class ConsentCreateSerializer(serializers.Serializer):
    consent_type = serializers.ChoiceField(choices=ConsentRecord.ConsentType.choices)
    version = serializers.CharField(max_length=32)
    locale = serializers.ChoiceField(choices=User.Locale.choices, default=User.Locale.PERSIAN)
    accepted = serializers.BooleanField()

    def validate_accepted(self, value):
        if value is not True:
            raise serializers.ValidationError("Consent can only be recorded after explicit acceptance.")
        return value


class ConsentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsentRecord
        fields = ("id", "consent_type", "version", "locale", "source", "accepted_at")
        read_only_fields = fields


class OtpRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)
    purpose = serializers.ChoiceField(choices=OneTimeCode.Purpose.choices)


class OtpVerifySerializer(OtpRequestSerializer):
    code = serializers.RegexField(regex=r"^\d{6}$")


class DeactivateSerializer(serializers.Serializer):
    confirm = serializers.CharField()

    def validate_confirm(self, value):
        if value != "DEACTIVATE":
            raise serializers.ValidationError('Type exactly "DEACTIVATE".')
        return value


class DeleteRequestSerializer(serializers.Serializer):
    confirm = serializers.CharField()
    reason_code = serializers.CharField(max_length=64, required=False, allow_blank=True)

    def validate_confirm(self, value):
        if value != "DELETE":
            raise serializers.ValidationError('Type exactly "DELETE".')
        return value


class DeleteCancellationSerializer(serializers.Serializer):
    confirm = serializers.CharField()

    def validate_confirm(self, value):
        if value != "KEEP":
            raise serializers.ValidationError('Type exactly "KEEP".')
        return value
