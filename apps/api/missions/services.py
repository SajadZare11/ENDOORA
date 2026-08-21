from django.utils import timezone
from .models import DailyMission

def build_daily_mission(user):
    today=timezone.localdate()
    mission, _ = DailyMission.objects.get_or_create(
        user=user,
        mission_date=today,
        defaults={
            "title_fa":"ماموریت امروز: تقویت مهارت فعلی",
            "title_en":"Today's mission: strengthen your current skill",
            "explanation_fa":"این ماموریت بر اساس مسیر یادگیری، شواهد قبلی و نیازهای فعلی انتخاب شده است.",
            "explanation_en":"This mission is selected from learning evidence and current path needs.",
            "evidence_reason":{
                "source":"learner_path",
                "reason_fa":"ادامه مسیر شخصی زبان‌آموز",
                "reason_en":"Continue personal learning path"
            }
        }
    )
    return mission
