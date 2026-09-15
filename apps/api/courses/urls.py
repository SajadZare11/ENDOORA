from django.urls import path

from .views import (
    CourseEnrollView,
    CourseEditorDetailView,
    CourseEditorListCreateView,
    CourseEditorTransitionView,
    CourseListView,
    CourseSyllabusView,
    LessonCompleteView,
    LessonDetailView,
    LessonEditorCreateView,
    LessonEditorDetailView,
    LessonRedactionPreviewView,
    ModuleEditorDetailView,
    ModuleEditorListCreateView,
)

urlpatterns = [
    # Editor / Operations Routes (Must precede <slug:slug>/ pattern)
    path("editor/", CourseEditorListCreateView.as_view(), name="courses-editor-list-create"),
    path("editor/<uuid:course_id>/", CourseEditorDetailView.as_view(), name="courses-editor-detail"),
    path("editor/<uuid:course_id>/transition/", CourseEditorTransitionView.as_view(), name="courses-editor-transition"),
    path("editor/<uuid:course_id>/modules/", ModuleEditorListCreateView.as_view(), name="courses-editor-module-create"),
    path("editor/<uuid:course_id>/modules/<uuid:module_id>/", ModuleEditorDetailView.as_view(), name="courses-editor-module-detail"),
    path("editor/modules/<uuid:module_id>/lessons/", LessonEditorCreateView.as_view(), name="courses-editor-lesson-create"),
    path("editor/lessons/<uuid:lesson_id>/", LessonEditorDetailView.as_view(), name="courses-editor-lesson-detail"),
    path("editor/lessons/<uuid:lesson_id>/preview-redaction/", LessonRedactionPreviewView.as_view(), name="courses-editor-lesson-preview-redaction"),

    # Public / Learner Routes
    path("", CourseListView.as_view(), name="courses-list"),
    path("<slug:slug>/", CourseSyllabusView.as_view(), name="course-syllabus"),
    path("<slug:slug>/enroll/", CourseEnrollView.as_view(), name="course-enroll"),
    path("<slug:slug>/lessons/<uuid:lesson_id>/", LessonDetailView.as_view(), name="lesson-detail"),
    path("<slug:slug>/lessons/<uuid:lesson_id>/complete/", LessonCompleteView.as_view(), name="lesson-complete"),
]
