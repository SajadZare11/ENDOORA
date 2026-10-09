# -*- coding: utf-8 -*-
import sys
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "endoora_api.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from teachers.models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    StudentLessonMastery,
    SessionStatus,
    LinkStatus,
)
from teachers.curriculum_service import TeacherCurriculumService

User = get_user_model()
teacher = User.objects.filter(email='example3@gmail.com').first()
student = User.objects.filter(email='example2@gmail.com').first()

print(f"Teacher found: {teacher.email if teacher else None}")
print(f"Student found: {student.email if student else None}")

if teacher and student:
    t_class, created = TeacherClass.objects.get_or_create(
        teacher=teacher,
        title='کلاس جامع ترمیک American English File 2',
        defaults={
            'coursebook': 'American English File 2',
            'subject': 'مکالمه و مهارتهای چهارگانه',
            'level': 'B1',
            'description': 'دوره آموزشی بر مبنای کتاب امریکن انگلیش فایل ۲ با تمرکز بر مکالمه روان و واژگان کاربردی',
            'max_capacity': 10,
        }
    )
    print(f"Class id: {t_class.id}, created: {created}")

    link, l_created = TeacherLearnerLink.objects.get_or_create(
        teacher_class=t_class,
        learner=student,
        defaults={
            'teacher': teacher,
            'status': LinkStatus.ACTIVE,
            'invite_code': 'AEF2-LINK-01',
            'consent_given_at': timezone.now(),
        }
    )
    if link.status != LinkStatus.ACTIVE:
        link.status = LinkStatus.ACTIVE
        link.save()
    print(f"Link id: {link.id}, status: {link.status}")

    now = timezone.now()
    if not ClassSession.objects.filter(teacher_class=t_class).exists():
        s1 = ClassSession.objects.create(
            teacher_class=t_class,
            learner=student,
            title='جلسه اول: آشنایی و گرامر ساختار سوالی (درس ۱)',
            scheduled_start=now - timedelta(days=7),
            scheduled_end=now - timedelta(days=7) + timedelta(minutes=60),
            duration_minutes=60,
            status=SessionStatus.COMPLETED,
            session_notes='بررسی ساختار جملات پرسشی در زمان‌های مختلف و تمرین جفتی مکالمه.',
            confirmed_by_teacher=True,
            confirmed_by_learner=True,
            completed_at=now - timedelta(days=7) + timedelta(minutes=60),
        )
        s2 = ClassSession.objects.create(
            teacher_class=t_class,
            learner=student,
            title='جلسه دوم: واژگان توصیف چهره و شخصیت (درس ۱)',
            scheduled_start=now - timedelta(days=3),
            scheduled_end=now - timedelta(days=3) + timedelta(minutes=60),
            duration_minutes=60,
            status=SessionStatus.COMPLETED,
            session_notes='واژگان توصیف ظاهر، صفت‌های شخصیتی و کاربرد آن در مکالمه واقعی.',
            confirmed_by_teacher=True,
            confirmed_by_learner=True,
            completed_at=now - timedelta(days=3) + timedelta(minutes=60),
        )
        print("Created 2 past completed sessions.")

    if not StudentLessonMastery.objects.filter(teacher_class=t_class, learner=student).exists():
        m = StudentLessonMastery.objects.create(
            teacher=teacher,
            teacher_class=t_class,
            learner=student,
            coursebook='American English File 2',
            unit_number=1,
            unit_title='درس ۱: آشنایی و احوال‌پرسی',
            subcategory_id='u1-gram',
            subcategory_title='گرامر: ترتیب کلمات در جملات پرسشی',
            subcategory_type='grammar',
            mastery_percentage=75,
            teacher_notes='تسلط بسیار خوب در استفاده از do/does و ترتیب کلمات. نیاز به تمرین بیشتر در wh-questions.',
            session_date=(now - timedelta(days=7)).date(),
        )
        print(f"Created initial mastery record: {m.id}")

    tree = TeacherCurriculumService.get_class_curriculum_tree(t_class)
    print(f"Curriculum tree units count: {len(tree.get('units', []))}")

    portfolio = TeacherCurriculumService.get_student_academic_portfolio(t_class, student)
    print(f"Portfolio loaded for student: {portfolio['student_info']['email']}")
    print(f"Past sessions count: {len(portfolio['academic_status']['past_sessions'])}")
    print(f"Past assignments count: {len(portfolio['academic_status']['past_assignments'])}")
    print(f"Past mastery records: {len(portfolio['learning_portfolio']['recent_masteries'])}")
    print("ALL SEED DATA INITIALIZED SUCCESSFULLY!")
