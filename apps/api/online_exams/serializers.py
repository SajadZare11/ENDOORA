from __future__ import annotations

from decimal import Decimal
from rest_framework import serializers
from django.utils.crypto import get_random_string
from questions.models import QuestionVersion
from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer, ProctoringLog


class ExamQuestionSerializer(serializers.ModelSerializer):
    question_version = serializers.PrimaryKeyRelatedField(
        queryset=QuestionVersion.objects.all(),
        required=False,
    )
    question_version_id = serializers.UUIDField(write_only=True, required=False)

    question_slug = serializers.ReadOnlyField(source='question_version.question.slug')
    question_title_fa = serializers.ReadOnlyField(source='question_version.title_fa')
    question_title_en = serializers.ReadOnlyField(source='question_version.title_en')
    question_type = serializers.ReadOnlyField(source='question_version.question_type')
    cefr_level = serializers.ReadOnlyField(source='question_version.cefr_level')
    prompt_fa = serializers.ReadOnlyField(source='question_version.prompt_fa')
    prompt_en = serializers.ReadOnlyField(source='question_version.prompt_en')

    class Meta:
        model = ExamQuestion
        fields = [
            'id', 'exam_id', 'question_version', 'question_version_id', 'order', 'points',
            'custom_instructions', 'listening_play_limit', 'speaking_time_limit_seconds',
            'question_slug', 'question_title_fa', 'question_title_en', 'question_type',
            'cefr_level', 'prompt_fa', 'prompt_en'
        ]

    def validate(self, attrs):
        version_id = attrs.pop('question_version_id', None)
        if version_id:
            try:
                attrs['question_version'] = QuestionVersion.objects.get(id=version_id)
            except QuestionVersion.DoesNotExist:
                raise serializers.ValidationError({"question_version_id": "نسخه سوال مشخص شده یافت نشد."})
        if 'question_version' not in attrs and not self.instance:
            raise serializers.ValidationError({"question_version": "انتخاب نسخه سوال الزامی است."})
        return attrs


class OnlineExamListSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()
    teacher_class_title = serializers.SerializerMethodField()
    questions_count = serializers.SerializerMethodField()
    submissions_count = serializers.SerializerMethodField()

    class Meta:
        model = OnlineExam
        fields = [
            'id', 'teacher', 'teacher_class_id', 'teacher_class_title', 'title', 'status',
            'duration_minutes', 'passing_score', 'max_attempts', 'access_code',
            'starts_at', 'ends_at', 'questions_count', 'submissions_count',
            'created_at', 'updated_at'
        ]

    def get_teacher(self, obj):
        if obj.teacher:
            return obj.teacher.email
        return None

    def get_teacher_class_title(self, obj):
        if obj.teacher_class:
            return obj.teacher_class.title
        return None

    def get_questions_count(self, obj):
        return obj.exam_questions.count()

    def get_submissions_count(self, obj):
        return obj.submissions.count()


class OnlineExamDetailSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()
    exam_questions = ExamQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = OnlineExam
        fields = '__all__'

    def get_teacher(self, obj):
        if obj.teacher:
            return {
                'id': obj.teacher.id,
                'email': obj.teacher.email
            }
        return None


class OnlineExamCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineExam
        fields = [
            'title', 'description', 'instructions', 'duration_minutes',
            'anti_cheat_config', 'shuffle_questions', 'shuffle_choices',
            'passing_score', 'max_attempts', 'show_results_to_student',
            'starts_at', 'ends_at', 'teacher_class'
        ]
        extra_kwargs = {
            'teacher_class': {'write_only': True}
        }

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['teacher'] = user
        if not validated_data.get('access_code'):
            validated_data['access_code'] = get_random_string(length=8)
        return super().create(validated_data)


class ExamAnswerSerializer(serializers.ModelSerializer):
    question_type = serializers.ReadOnlyField(source='exam_question.question_version.question_type')
    question_title = serializers.SerializerMethodField()
    question_points = serializers.ReadOnlyField(source='exam_question.points')

    class Meta:
        model = ExamAnswer
        fields = '__all__'

    def get_question_title(self, obj):
        version = obj.exam_question.question_version
        if hasattr(version, 'title_fa') and version.title_fa:
            return version.title_fa
        if hasattr(version, 'title_en') and version.title_en:
            return version.title_en
        return str(version)


class ExamSubmissionListSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()

    class Meta:
        model = ExamSubmission
        fields = [
            'id', 'exam_id', 'student', 'attempt_number', 'status', 'started_at',
            'submitted_at', 'total_score', 'percentage', 'integrity_score', 'is_late'
        ]

    def get_student(self, obj):
        if obj.student:
            name = f"{obj.student.first_name} {obj.student.last_name}".strip()
            return {
                'id': obj.student.id,
                'email': obj.student.email,
                'name': name if name else obj.student.email
            }
        return None


class ExamSubmissionDetailSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    class Meta:
        model = ExamSubmission
        fields = '__all__'

    def get_student(self, obj):
        if obj.student:
            name = f"{obj.student.first_name} {obj.student.last_name}".strip()
            return {
                'id': obj.student.id,
                'email': obj.student.email,
                'name': name if name else obj.student.email
            }
        return None

    def get_answers(self, obj):
        request = self.context.get('request')
        answers = obj.answers.all()
        # Respect show_results_to_student: hide scores/feedback from student if False
        if request and request.user == obj.student and not obj.exam.show_results_to_student:
            results = []
            for a in answers:
                data = ExamAnswerSerializer(a).data
                data['manual_score'] = None
                data['auto_score'] = None
                data['score_awarded'] = None
                data['teacher_feedback'] = ""
                results.append(data)
            return results
        return ExamAnswerSerializer(answers, many=True).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.user == instance.student and not instance.exam.show_results_to_student:
            data['total_score'] = None
            data['percentage'] = None
        return data


class ExamAnswerSubmitSerializer(serializers.Serializer):
    exam_question_id = serializers.UUIDField()
    student_response = serializers.JSONField(required=False, default=dict)
    audio_recording_url = serializers.URLField(required=False, allow_blank=True)


class ExamTeacherGradingSerializer(serializers.Serializer):
    manual_score = serializers.DecimalField(max_digits=5, decimal_places=2, required=True)
    teacher_feedback = serializers.CharField(required=False, allow_blank=True, default="")


class ProctoringLogItemSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=ProctoringLog.ProctoringEventType.choices)
    duration_seconds = serializers.FloatField(required=False, allow_null=True)
    client_timestamp = serializers.DateTimeField(required=False, allow_null=True)
    metadata = serializers.JSONField(required=False, default=dict)


class ProctoringLogBatchSerializer(serializers.Serializer):
    events = serializers.ListField(
        child=ProctoringLogItemSerializer(),
        max_length=500,
        allow_empty=True,
    )
    submission_id = serializers.UUIDField(required=False)


class ExamStudentViewSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = OnlineExam
        fields = [
            'id', 'title', 'description', 'instructions', 'duration_minutes', 'questions',
            'shuffle_questions', 'shuffle_choices', 'anti_cheat_config'
        ]

    def get_questions(self, obj):
        questions = obj.exam_questions.all()
        result = []
        for eq in questions:
            qv = eq.question_version
            payload = getattr(qv, 'learner_payload', {})
            
            result.append({
                'id': eq.id,
                'order': eq.order,
                'points': eq.points,
                'prompt_fa': getattr(qv, 'prompt_fa', None),
                'prompt_en': getattr(qv, 'prompt_en', None),
                'question_type': getattr(qv, 'question_type', None),
                'learner_payload': payload,
                'custom_instructions': eq.custom_instructions,
                'listening_play_limit': eq.listening_play_limit,
                'speaking_time_limit_seconds': eq.speaking_time_limit_seconds,
            })
        return result
