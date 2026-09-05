# Day 30 Package Manifest

## Scope
Day 30: Skills Hub, Lesson CMS Player, Courses, Iranian High School / Konkur, Culture & Paywall Enforcement.

## Backend Assets
- `apps/api/content/models.py`: `ContentItem` with mandatory copyright attribution validation in `clean()`, `ContentReviewLog`, choices for `ContentCategory`, `ContentType`, `ContentStatus`, `LicenseType`, `CefrLevel`, `AgeBand`, `SchoolGrade`.
- `apps/api/content/migrations/0001_initial.py`: Database schema migration for content.
- `apps/api/content/services.py`: `ContentService` with skills hub summary, content list, content detail, review workflow, and server-side entitlement redaction.
- `apps/api/content/serializers.py`: DRF serializers for skills summary, content list, content detail, culture, school, and review actions.
- `apps/api/content/views.py`: API views for skills, content items, review, culture hub, and high school hub.
- `apps/api/content/urls.py`: Routed endpoints under `/api/content/`.
- `apps/api/content/tests.py`: Unit and regression test suite covering copyright validation, paywall redactions, and editor workflow.
- `apps/api/courses/models.py`: `Course`, `Module`, `Lesson`, `LearnerCourseEnrollment`, `LearnerLessonProgress`, `TargetAudience`.
- `apps/api/courses/migrations/0001_initial.py`: Database schema migration for courses.
- `apps/api/courses/services.py`: `CourseService` with catalog listing, syllabus generation, lesson detail player redaction, enrollment, and lesson completion engine awarding XP.
- `apps/api/courses/serializers.py`: DRF serializers for course catalog, syllabus, lesson detail, and completion.
- `apps/api/courses/views.py`: API views for courses, enrollment, and lessons.
- `apps/api/courses/urls.py`: Routed endpoints under `/api/courses/`.
- `apps/api/courses/tests.py`: Unit and regression test suite covering catalog, preview access, locked lesson paywalls, and progress recalculation.
- `apps/api/endoora_api/settings/base.py`: Registered `content` and `courses` in `INSTALLED_APPS`.
- `apps/api/endoora_api/urls.py`: Routed `api/content/` and `api/courses/`.

## Frontend Assets
- `apps/web/app/(public)/skills/page.tsx` & `skills.module.css`: Public Skills Hub landing page with 8 categories, search, and CEFR filters.
- `apps/web/app/(public)/skills/[skill]/page.tsx`: Dynamic skill deep-dive pages (grammar, listening, reading, writing, speaking, vocabulary) with Persian L1 challenges.
- `apps/web/app/(public)/skills/culture/page.tsx` & `culture.module.css`: Intercultural communication and pragmatics hub.
- `apps/web/app/(public)/skills/school/page.tsx` & `school.module.css`: Iranian High School (Vision 1-3) and Konkur preparation hub.
- `apps/web/app/(learner)/courses/page.tsx` & `courses.module.css`: Courses catalog with CEFR and target audience filters.
- `apps/web/app/(learner)/courses/[slug]/page.tsx`: Course syllabus with preview vs. locked lesson indicators.
- `apps/web/app/(learner)/courses/[slug]/lessons/[lessonId]/page.tsx` & `lesson-cms.module.css`: SSG pre-rendered lesson CMS player with server-side locked paywall card.
- `apps/web/app/(learner)/courses/[slug]/lessons/[lessonId]/LessonPlayer.tsx`: Interactive client player for video, audio, transcripts, and quizzes.
- `apps/web/app/(learner)/learn/page.tsx` & `learn.module.css`: Unified learner dashboard hub connecting all learning destinations.
- `apps/web/components/layout/Header.tsx`: Added `/skills` navigation link.

## Documentation & Verification
- `scripts/backup_day30.ps1`: Automated pre-migration database backup script.
- `scripts/check_day30.py`: Contract and verification script for Day 30.
- `docs/product/CHANGELOG.md`: Updated changelog.
- `docs/product/ROADMAP_PROGRESS.md`: Updated roadmap progress.
- `docs/product/PROJECT_STATE.md`: Updated project state.
