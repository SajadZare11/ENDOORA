"""
Contract check for Day 30: Skills Hub, Lesson CMS, Courses, Culture, School, and Paywall Content.
Validates:
1. Backend models (ContentItem, ContentReviewLog, Course, Module, Lesson,
   LearnerCourseEnrollment, LearnerLessonProgress).
2. Mandatory copyright validation in ContentItem.clean().
3. Database migrations in content and courses apps.
4. Services in content/services.py and courses/services.py with server-side paywall redaction.
5. URL routing in apps/api/content/urls.py, apps/api/courses/urls.py, and endoora_api/urls.py.
6. Settings installed apps in apps/api/endoora_api/settings/base.py.
7. Frontend routes (skills hub, skill deep dive, culture, school, courses catalog, syllabus, lesson CMS player, learn hub).
8. Navigation link in Header.tsx.
9. Frontend CSS module tokens (zero raw hex colors and 100% logical properties).
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        print(f"[FAIL] {message}")
        sys.exit(1)
    print(f"[PASS] {message}")


def main():
    print("Running Day 30 Contract Verification...")

    # 1. Backend Content Models & Copyright Validation
    content_models_py = REPO_ROOT / "apps" / "api" / "content" / "models.py"
    check(content_models_py.is_file(), "apps/api/content/models.py exists")
    content_models = content_models_py.read_text(encoding="utf-8")
    check("class ContentItem(" in content_models, "ContentItem model defined")
    check("class ContentReviewLog(" in content_models, "ContentReviewLog model defined")
    check("class ContentCategory(" in content_models, "ContentCategory choices defined")
    check("class ContentType(" in content_models, "ContentType choices defined")
    check("class ContentStatus(" in content_models, "ContentStatus choices defined")
    check("class LicenseType(" in content_models, "LicenseType choices defined")
    check("source_attribution" in content_models, "source_attribution field defined on ContentItem")
    check("license_type" in content_models, "license_type field defined on ContentItem")
    check("author_name" in content_models, "author_name field defined on ContentItem")
    check("def clean(self):" in content_models, "ContentItem has clean() method for validation")
    check("ValidationError" in content_models, "ValidationError raised for missing copyright")

    # 2. Backend Course Models
    course_models_py = REPO_ROOT / "apps" / "api" / "courses" / "models.py"
    check(course_models_py.is_file(), "apps/api/courses/models.py exists")
    course_models = course_models_py.read_text(encoding="utf-8")
    check("class Course(" in course_models, "Course model defined")
    check("class Module(" in course_models, "Module model defined")
    check("class Lesson(" in course_models, "Lesson model defined")
    check("class LearnerCourseEnrollment(" in course_models, "LearnerCourseEnrollment model defined")
    check("class LearnerLessonProgress(" in course_models, "LearnerLessonProgress model defined")
    check("is_free_preview" in course_models, "is_free_preview field defined on Lesson")

    # 3. Database Migrations
    content_migrations = list((REPO_ROOT / "apps" / "api" / "content" / "migrations").glob("0001_*.py"))
    check(len(content_migrations) >= 1, "content migration 0001 exists")
    course_migrations = list((REPO_ROOT / "apps" / "api" / "courses" / "migrations").glob("0001_*.py"))
    check(len(course_migrations) >= 1, "courses migration 0001 exists")

    # 4. Service Layer & Server-Side Paywall Redaction
    content_services_py = REPO_ROOT / "apps" / "api" / "content" / "services.py"
    check(content_services_py.is_file(), "apps/api/content/services.py exists")
    content_services = content_services_py.read_text(encoding="utf-8")
    check("class ContentService" in content_services, "ContentService defined")
    check("get_skills_hub_summary" in content_services, "get_skills_hub_summary defined")
    check("get_content_detail" in content_services, "get_content_detail defined")
    check("review_content" in content_services, "review_content defined")
    check("is_locked" in content_services and "paywall_info" in content_services, "Server-side paywall redaction in ContentService")

    course_services_py = REPO_ROOT / "apps" / "api" / "courses" / "services.py"
    check(course_services_py.is_file(), "apps/api/courses/services.py exists")
    course_services = course_services_py.read_text(encoding="utf-8")
    check("class CourseService" in course_services, "CourseService defined")
    check("list_courses" in course_services, "list_courses defined")
    check("get_course_syllabus" in course_services, "get_course_syllabus defined")
    check("get_lesson_detail" in course_services, "get_lesson_detail defined")
    check("complete_lesson" in course_services, "complete_lesson defined")
    check("is_locked" in course_services and "video_url" in course_services, "Server-side lesson locking and media redaction in CourseService")

    # 5. URLs & Installed Apps
    content_urls_py = REPO_ROOT / "apps" / "api" / "content" / "urls.py"
    check(content_urls_py.is_file(), "apps/api/content/urls.py exists")
    course_urls_py = REPO_ROOT / "apps" / "api" / "courses" / "urls.py"
    check(course_urls_py.is_file(), "apps/api/courses/urls.py exists")

    root_urls_py = REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    root_urls = root_urls_py.read_text(encoding="utf-8")
    check('"api/content/"' in root_urls and '"content.urls"' in root_urls, "api/content/ included in root urls")
    check('"api/courses/"' in root_urls and '"courses.urls"' in root_urls, "api/courses/ included in root urls")

    settings_base = (REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py").read_text(encoding="utf-8")
    check('"content"' in settings_base, '"content" in INSTALLED_APPS')
    check('"courses"' in settings_base, '"courses" in INSTALLED_APPS')

    # 6. Frontend Routes
    web_app = REPO_ROOT / "apps" / "web" / "app"
    check((web_app / "(public)" / "skills" / "page.tsx").is_file(), "Skills hub page exists")
    check((web_app / "(public)" / "skills" / "[skill]" / "page.tsx").is_file(), "Skill deep-dive page exists")
    check((web_app / "(public)" / "skills" / "culture" / "page.tsx").is_file(), "Culture hub page exists")
    check((web_app / "(public)" / "skills" / "school" / "page.tsx").is_file(), "School & Konkur hub page exists")
    check((web_app / "(learner)" / "courses" / "page.tsx").is_file(), "Courses catalog page exists")
    check((web_app / "(learner)" / "courses" / "[slug]" / "page.tsx").is_file(), "Course syllabus page exists")
    check((web_app / "(learner)" / "courses" / "[slug]" / "lessons" / "[lessonId]" / "page.tsx").is_file(), "Lesson player page exists")
    check((web_app / "(learner)" / "courses" / "[slug]" / "lessons" / "[lessonId]" / "LessonPlayer.tsx").is_file(), "LessonPlayer component exists")
    check((web_app / "(learner)" / "learn" / "page.tsx").is_file(), "Learner hub page exists")

    # 7. Navigation in Header
    header_tsx = (REPO_ROOT / "apps" / "web" / "components" / "layout" / "Header.tsx").read_text(encoding="utf-8")
    check('href="/skills"' in header_tsx, "Skills link present in Header navigation")

    # 8. Frontend CSS Modules Token Compliance
    css_files = [
        web_app / "(public)" / "skills" / "skills.module.css",
        web_app / "(public)" / "skills" / "culture" / "culture.module.css",
        web_app / "(public)" / "skills" / "school" / "school.module.css",
        web_app / "(learner)" / "courses" / "courses.module.css",
        web_app / "(learner)" / "courses" / "[slug]" / "lessons" / "[lessonId]" / "lesson-cms.module.css",
        web_app / "(learner)" / "learn" / "learn.module.css",
    ]

    for css_path in css_files:
        check(css_path.is_file(), f"{css_path.name} exists")
        css_content = css_path.read_text(encoding="utf-8")

        # Hex color check
        hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
        check(len(hex_matches) == 0, f"Zero raw hex colors in {css_path.name} (found {len(hex_matches)})")

        # Physical left/right check
        physical_props = re.findall(r"(?:margin|padding|border)-(?:left|right)\s*:", css_content, re.IGNORECASE)
        check(len(physical_props) == 0, f"Zero physical left/right CSS properties in {css_path.name} (found {len(physical_props)})")

    print("\n[SUCCESS] Day 30 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
