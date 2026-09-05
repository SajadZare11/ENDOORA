from django.urls import path

from .views import (
    CourseEnrollView,
    CourseListView,
    CourseSyllabusView,
    LessonCompleteView,
    LessonDetailView,
)

urlpatterns = [
    path("", CourseListView.as_view(), name="courses-list"),
    path("<slug:slug>/", CourseSyllabusView.as_view(), name="course-syllabus"),
    path("<slug:slug>/enroll/", CourseEnrollView.as_view(), name="course-enroll"),
    path("<slug:slug>/lessons/<uuid:lesson_id>/", LessonDetailView.as_view(), name="lesson-detail"),
    path("<slug:slug>/lessons/<uuid:lesson_id>/complete/", LessonCompleteView.as_view(), name="lesson-complete"),
]
