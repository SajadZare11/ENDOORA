from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    role = serializers.ChoiceField(
        choices=[
            User.Role.LEARNER,
            User.Role.TEACHER,
        ]
    )
    preferred_locale = serializers.ChoiceField(
        choices=User.Locale.choices,
        default=User.Locale.PERSIAN,
    )
    accept_terms = serializers.BooleanField(write_only=True)
    accept_privacy = serializers.BooleanField(write_only=True)

    def validate_email(self, value):
        # The database unique constraint is the authoritative duplicate check.
        # RegisterView converts the resulting IntegrityError into a bilingual,
        # race-safe conflict response.
        return value.strip().lower()

    def validate(self, attrs):
        errors = {}

        if attrs.get("accept_terms") is not True:
            errors["accept_terms"] = [
                "Terms must be accepted."
            ]

        if attrs.get("accept_privacy") is not True:
            errors["accept_privacy"] = [
                "Privacy terms must be accepted."
            ]

        candidate_user = User(
            email=attrs.get("email", ""),
            role=attrs.get(
                "role",
                User.Role.LEARNER,
            ),
            preferred_locale=attrs.get(
                "preferred_locale",
                User.Locale.PERSIAN,
            ),
        )

        try:
            validate_password(
                attrs.get("password", ""),
                user=candidate_user,
            )
        except DjangoValidationError as exc:
            errors["password"] = list(exc.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)
    code = serializers.RegexField(regex=r"^\d{6}$")
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
