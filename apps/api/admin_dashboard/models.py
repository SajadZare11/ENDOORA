from __future__ import annotations

import uuid
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.utils import timezone


class AdminSecurityConfig(models.Model):
    """
    Singleton security configuration for Master Admin PIN and God-Mode safeguards.
    """
    pin_hash = models.CharField(max_length=255, default="")
    failed_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    last_verified_at = models.DateTimeField(null=True, blank=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Admin Security Configuration"
        verbose_name_plural = "Admin Security Configurations"

    @classmethod
    def get_instance(cls) -> "AdminSecurityConfig":
        obj, _ = cls.objects.get_or_create(id=1)
        if not obj.pin_hash:
            # Default fallback PIN is "123456" until changed by admin
            obj.pin_hash = make_password("123456")
            obj.save(update_fields=["pin_hash"])
        return obj

    def is_locked(self) -> bool:
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False

    def verify_pin(self, raw_pin: str) -> bool:
        if self.is_locked():
            return False

        if check_password(str(raw_pin).strip(), self.pin_hash):
            self.failed_attempts = 0
            self.locked_until = None
            self.last_verified_at = timezone.now()
            self.save(update_fields=["failed_attempts", "locked_until", "last_verified_at"])
            return True
        else:
            self.failed_attempts += 1
            if self.failed_attempts >= 5:
                # Lock for 15 minutes after 5 consecutive failed attempts
                self.locked_until = timezone.now() + timezone.timedelta(minutes=15)
            self.save(update_fields=["failed_attempts", "locked_until"])
            return False

    def set_pin(self, new_pin: str) -> None:
        clean_pin = str(new_pin).strip()
        self.pin_hash = make_password(clean_pin)
        self.failed_attempts = 0
        self.locked_until = None
        self.save(update_fields=["pin_hash", "failed_attempts", "locked_until", "last_updated_at"])


class SiteCmsSnapshot(models.Model):
    """
    Authoritative snapshot of the published site content, menus, banners, and layout.
    """
    version = models.PositiveIntegerField(unique=True, db_index=True)
    content_json = models.JSONField(default=dict)
    is_live = models.BooleanField(default=False, db_index=True)
    summary = models.CharField(max_length=255, default="انتشار محتوای سایت")
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="published_cms_versions",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-version"]
        verbose_name = "Site CMS Snapshot"
        verbose_name_plural = "Site CMS Snapshots"

    def __str__(self) -> str:
        return f"CMS v{self.version} ({'Live' if self.is_live else 'Archived'}) - {self.summary}"


class SiteCmsDraft(models.Model):
    """
    Working draft for the site content before being officially published.
    """
    content_json = models.JSONField(default=dict)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_cms_drafts",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site CMS Draft"
        verbose_name_plural = "Site CMS Drafts"


class SiteMediaAsset(models.Model):
    """
    Media files uploaded directly through the Admin Media Asset Manager.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="admin_media/%Y/%m/")
    file_url = models.CharField(max_length=500, blank=True)
    file_type = models.CharField(max_length=64, default="image/png")
    file_size_bytes = models.BigIntegerField(default=0)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_admin_media",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Site Media Asset"
        verbose_name_plural = "Site Media Assets"

    def __str__(self) -> str:
        return f"{self.title} ({self.file_type})"
