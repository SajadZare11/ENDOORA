from django.contrib import admin
from .models import MarketplaceRequest, TeacherOffer


@admin.register(MarketplaceRequest)
class MarketplaceRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "learner", "target_skill", "target_cefr_level", "status", "created_at", "expires_at")
    list_filter = ("status", "target_skill", "target_cefr_level", "online_format")
    search_fields = ("learner__email", "learner__first_name", "learner__last_name", "short_description")
    readonly_fields = ("created_at", "updated_at")


@admin.register(TeacherOffer)
class TeacherOfferAdmin(admin.ModelAdmin):
    list_display = ("id", "request", "teacher", "rate_toman", "status", "created_at")
    list_filter = ("status", "online_format")
    search_fields = ("teacher__email", "teacher__first_name", "teacher__last_name", "intro_note")
    readonly_fields = ("created_at", "updated_at")
