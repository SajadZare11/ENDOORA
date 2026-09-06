import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from search.normalizer import normalize_text


class SearchContentType(models.TextChoices):
    COURSE = "course", _("دوره آموزشی")
    TEACHER = "teacher", _("مدرس")
    COMMUNITY_POST = "community_post", _("پست جامعه")
    LESSON_PLAN = "lesson_plan", _("طرح درس")
    FAQ = "faq", _("سوال متداول")
    ASSIGNMENT = "assignment", _("تکلیف اختصاصی")
    CLASS = "class", _("کلاس")


class SearchVisibility(models.TextChoices):
    PUBLIC = "public", _("عمومی")
    AUTHENTICATED = "authenticated", _("کاربران وارد شده")
    TEACHER_ONLY = "teacher_only", _("مخصوص مدرسان")
    STUDENT_ONLY = "student_only", _("مخصوص زبان‌آموزان")
    PRIVATE_OWNER = "private_owner", _("مخصوص مالک")


class SearchDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name=_("عنوان"))
    normalized_title = models.CharField(max_length=255, db_index=True, blank=True)
    content = models.TextField(blank=True, default="", verbose_name=_("محتوا"))
    normalized_content = models.TextField(blank=True, default="")
    content_type = models.CharField(
        max_length=32,
        choices=SearchContentType.choices,
        db_index=True,
        verbose_name=_("نوع محتوا"),
    )
    visibility = models.CharField(
        max_length=32,
        choices=SearchVisibility.choices,
        default=SearchVisibility.PUBLIC,
        db_index=True,
        verbose_name=_("سطح دسترسی"),
    )
    owner_id = models.UUIDField(null=True, blank=True, db_index=True, verbose_name=_("شناسه مالک"))
    target_id = models.CharField(max_length=128, db_index=True, verbose_name=_("شناسه هدف"))
    target_url = models.CharField(max_length=512, verbose_name=_("آدرس هدف"))
    tags = models.JSONField(default=list, blank=True, verbose_name=_("برچسب‌ها"))
    popularity_score = models.IntegerField(default=0, db_index=True, verbose_name=_("امتیاز محبوبیت"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("سند جستجو")
        verbose_name_plural = _("اسناد جستجو")
        ordering = ["-popularity_score", "-updated_at"]
        indexes = [
            models.Index(fields=["content_type", "visibility"]),
            models.Index(fields=["owner_id", "visibility"]),
        ]

    def save(self, *args, **kwargs):
        self.normalized_title = normalize_text(self.title)
        self.normalized_content = normalize_text(self.content)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.content_type}][{self.visibility}] {self.title}"


class SearchQueryLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    query = models.CharField(max_length=255, verbose_name=_("عبارت جستجو"))
    normalized_query = models.CharField(max_length=255, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name=_("کاربر"),
    )
    results_count = models.IntegerField(default=0, verbose_name=_("تعداد نتایج"))
    is_zero_result = models.BooleanField(default=False, db_index=True, verbose_name=_("بدون نتیجه"))
    filter_applied = models.CharField(max_length=64, blank=True, default="", verbose_name=_("فیلتر اعمال شده"))
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _("گزارش جستجو")
        verbose_name_plural = _("گزارش‌های جستجو")
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        self.normalized_query = normalize_text(self.query)
        self.is_zero_result = self.results_count == 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.query} -> {self.results_count} results ({'Zero' if self.is_zero_result else 'Found'})"


class RecentSearch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recent_searches",
        verbose_name=_("کاربر"),
    )
    query = models.CharField(max_length=255, verbose_name=_("عبارت جستجو"))
    created_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        verbose_name = _("جستجوی اخیر")
        verbose_name_plural = _("جستجوهای اخیر")
        ordering = ["-created_at"]
        unique_together = ("user", "query")

    def __str__(self):
        return f"{self.user_id}: {self.query}"
