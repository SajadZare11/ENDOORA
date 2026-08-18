from django.db import models


class WaitlistSignup(models.Model):
    class Locale(models.TextChoices):
        PERSIAN = "fa", "Persian"
        ENGLISH = "en", "English"

    email = models.EmailField(unique=True)
    locale = models.CharField(max_length=2, choices=Locale.choices, default=Locale.PERSIAN)
    source = models.CharField(max_length=64, default="direct")
    landing_path = models.CharField(max_length=255, blank=True)
    consent_version = models.CharField(max_length=32)
    consented_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "waitlist signup"
        verbose_name_plural = "waitlist signups"

    def save(self, *args, **kwargs):
        self.email = self.email.strip().lower()
        self.source = self.source.strip()[:64] or "direct"
        self.landing_path = self.landing_path.strip()[:255]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.email
