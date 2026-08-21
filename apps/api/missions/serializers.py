from rest_framework import serializers
from .models import DailyMission

class DailyMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model=DailyMission
        fields=[
            "id","mission_date","title_fa","title_en",
            "explanation_fa","explanation_en",
            "evidence_reason","status"
        ]
