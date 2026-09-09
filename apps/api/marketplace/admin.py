from django.contrib import admin
from .models import MarketplaceRequest, TeacherOffer, SessionBooking


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


@admin.register(SessionBooking)
class SessionBookingAdmin(admin.ModelAdmin):
    list_display = ("id", "learner", "teacher", "target_skill", "status", "scheduled_start", "rate_toman")
    list_filter = ("status", "target_skill", "online_format")
    search_fields = ("learner__email", "teacher__email", "session_notes", "cancellation_reason")
    readonly_fields = ("created_at", "updated_at")

from .models import TeacherReview


@admin.register(TeacherReview)
class TeacherReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "learner", "overall_rating", "status", "created_at")
    list_filter = ("status", "overall_rating", "created_at")
    search_fields = ("teacher__email", "learner__email", "comment", "masked_display_name")
    readonly_fields = ("created_at", "updated_at")
from .models import TeacherAvailabilitySlot, TeacherTimeOff, TeacherAvailabilitySetting


@admin.register(TeacherAvailabilitySlot)
class TeacherAvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "day_of_week", "start_time", "end_time", "is_active")
    list_filter = ("day_of_week", "is_active")
    search_fields = ("teacher__email", "teacher__first_name", "teacher__last_name")


@admin.register(TeacherTimeOff)
class TeacherTimeOffAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "start_datetime", "end_datetime", "reason", "is_full_day")
    list_filter = ("is_full_day", "start_datetime")
    search_fields = ("teacher__email", "reason")


@admin.register(TeacherAvailabilitySetting)
class TeacherAvailabilitySettingAdmin(admin.ModelAdmin):
    list_display = ("teacher", "notice_lead_time_hours", "max_booking_ahead_days", "default_session_duration_minutes", "default_buffer_minutes")

from .models import BookingDispute, TeacherOnboardingApplication, PlatformPricingPlan


@admin.register(BookingDispute)
class BookingDisputeAdmin(admin.ModelAdmin):
    list_display = ("id", "booking", "opened_by", "reason_category", "status", "refund_percentage", "created_at")
    list_filter = ("status", "reason_category", "created_at")
    search_fields = ("booking__id", "opened_by__email", "description", "resolution_notes")
    readonly_fields = ("created_at", "updated_at")


@admin.register(TeacherOnboardingApplication)
class TeacherOnboardingApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "status", "national_id_number", "reviewed_by", "reviewed_at", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("teacher__email", "teacher__first_name", "teacher__last_name", "national_id_number")
    readonly_fields = ("created_at", "updated_at")


@admin.register(PlatformPricingPlan)
class PlatformPricingPlanAdmin(admin.ModelAdmin):
    list_display = ("code", "name_fa", "duration_days", "price_toman", "is_active", "is_featured")
    list_filter = ("is_active", "is_featured")
    search_fields = ("code", "name_fa", "name_en")
