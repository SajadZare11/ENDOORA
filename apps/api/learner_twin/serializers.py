from rest_framework import serializers


class LearningPathTimelineSerializer(serializers.Serializer):
    id = serializers.CharField()
    title_fa = serializers.CharField()
    title_en = serializers.CharField()
    status = serializers.CharField()
    description_fa = serializers.CharField()
    description_en = serializers.CharField()
    evidence = serializers.ListField(child=serializers.CharField(), default=list)
    action_href = serializers.CharField(required=False, default="/placement")


class LearningPathFocusAreaSerializer(serializers.Serializer):
    skill = serializers.CharField()
    label_fa = serializers.CharField()
    label_en = serializers.CharField()
    score_percentage = serializers.FloatField()
    priority = serializers.CharField()
    recommendation_fa = serializers.CharField()
    recommendation_en = serializers.CharField()
    action_href = serializers.CharField()


class LearningPathSectionScoreSerializer(serializers.Serializer):
    section = serializers.CharField()
    label_fa = serializers.CharField()
    label_en = serializers.CharField()
    score_percentage = serializers.FloatField()
    answered = serializers.IntegerField()
    total = serializers.IntegerField()
    objectives_covered = serializers.ListField(child=serializers.CharField(), default=list)


class LearningPathSerializer(serializers.Serializer):
    placement_completed = serializers.BooleanField(default=False)
    estimated_cefr_level = serializers.CharField(allow_null=True, required=False, default=None)
    overall_percentage = serializers.FloatField(allow_null=True, required=False, default=None)
    generated_from = serializers.ListField(child=serializers.CharField(), default=list)
    next_best_step = serializers.CharField()
    next_best_step_fa = serializers.CharField()
    next_best_step_en = serializers.CharField()
    next_best_step_href = serializers.CharField(default="/placement")
    focus_areas = LearningPathFocusAreaSerializer(many=True, default=list)
    section_scores = LearningPathSectionScoreSerializer(many=True, default=list)
    timeline = LearningPathTimelineSerializer(many=True)
    limitations_fa = serializers.ListField(child=serializers.CharField())
    limitations_en = serializers.ListField(child=serializers.CharField())
