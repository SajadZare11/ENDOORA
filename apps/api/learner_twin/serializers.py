from rest_framework import serializers


class LearningPathTimelineSerializer(serializers.Serializer):
    id = serializers.CharField()
    title_fa = serializers.CharField()
    title_en = serializers.CharField()
    status = serializers.CharField()
    description_fa = serializers.CharField()
    description_en = serializers.CharField()
    evidence = serializers.ListField(child=serializers.CharField())


class LearningPathSerializer(serializers.Serializer):
    generated_from = serializers.ListField(child=serializers.CharField())
    next_best_step = serializers.CharField()
    next_best_step_fa = serializers.CharField()
    next_best_step_en = serializers.CharField()
    timeline = LearningPathTimelineSerializer(many=True)
    limitations_fa = serializers.ListField(child=serializers.CharField())
    limitations_en = serializers.ListField(child=serializers.CharField())
