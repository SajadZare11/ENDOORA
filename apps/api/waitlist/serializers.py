from rest_framework import serializers

from .models import WaitlistSignup


CONSENT_VERSION = "waitlist-2026-08-18-v1"


class WaitlistSignupSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    consent = serializers.BooleanField(write_only=True)
    locale = serializers.ChoiceField(choices=WaitlistSignup.Locale.choices, default=WaitlistSignup.Locale.PERSIAN)
    source = serializers.CharField(max_length=64, required=False, default="direct", allow_blank=True)
    landing_path = serializers.CharField(max_length=255, required=False, default="", allow_blank=True)

    def validate_consent(self, value: bool) -> bool:
        if value is not True:
            raise serializers.ValidationError("Explicit waitlist consent is required.")
        return value

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def create(self, validated_data):
        validated_data.pop("consent", None)
        signup, created = WaitlistSignup.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "locale": validated_data.get("locale", WaitlistSignup.Locale.PERSIAN),
                "source": validated_data.get("source", "direct") or "direct",
                "landing_path": validated_data.get("landing_path", ""),
                "consent_version": CONSENT_VERSION,
            },
        )
        self.context["created"] = created
        return signup
