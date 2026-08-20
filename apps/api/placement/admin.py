from django.contrib import admin

from .models import PlacementAnswer, PlacementSession


@admin.register(PlacementSession)
class PlacementSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "current_section", "updated_at")
    search_fields = ("user__email", "id")


@admin.register(PlacementAnswer)
class PlacementAnswerAdmin(admin.ModelAdmin):
    list_display = ("session", "question_key", "updated_at")
