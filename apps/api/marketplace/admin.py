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
from .models import (
    UserWallet,
    WalletTransaction,
    PaymentTransaction,
    BookingEscrow,
    TeacherPayoutRequest,
)


@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "balance_toman", "locked_toman", "updated_at")
    search_fields = ("user__email", "user__first_name", "user__last_name")
    readonly_fields = ("created_at", "updated_at")


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "wallet", "transaction_type", "amount_toman", "balance_after_toman", "tracking_code", "created_at")
    list_filter = ("transaction_type", "created_at")
    search_fields = ("wallet__user__email", "tracking_code", "reference_id", "description")
    readonly_fields = ("created_at",)


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "order_type", "gateway_provider", "amount_toman", "status", "ref_id", "is_sandbox", "created_at")
    list_filter = ("order_type", "gateway_provider", "status", "is_sandbox", "created_at")
    search_fields = ("user__email", "authority", "ref_id", "idempotency_key", "card_pan")
    readonly_fields = ("created_at", "updated_at", "verified_at")


@admin.register(BookingEscrow)
class BookingEscrowAdmin(admin.ModelAdmin):
    list_display = ("id", "booking", "total_amount_toman", "platform_commission_toman", "teacher_net_toman", "status", "settled_at")
    list_filter = ("status", "funded_at")
    search_fields = ("booking__id", "booking__teacher__email", "booking__learner__email")
    readonly_fields = ("funded_at", "created_at", "updated_at")


@admin.register(TeacherPayoutRequest)
class TeacherPayoutRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "amount_toman", "bank_shaba_number", "status", "processed_by", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("teacher__email", "bank_shaba_number", "account_holder_name")
    readonly_fields = ("created_at", "updated_at", "processed_at")

