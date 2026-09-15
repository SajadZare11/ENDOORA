"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import styles from "./courses-cms.module.css";
import {
  CourseEditorItem,
  CourseFilters,
  ModuleEditorItem,
  LessonEditorItem,
  PaywallRedactionPreview,
  fetchEditorCourses,
  createEditorCourse,
  updateEditorCourse,
  deleteEditorCourse,
  transitionCourse,
  createEditorModule,
  updateEditorModule,
  deleteEditorModule,
  createEditorLesson,
  updateEditorLesson,
  deleteEditorLesson,
  previewLessonRedaction,
} from "../../lib/courses-cms";

interface Props {
  initialLocale?: "fa" | "en";
}

export function CourseCMSOperations({ initialLocale = "fa" }: Props) {
  const [locale, setLocale] = useState<"fa" | "en">(initialLocale);
  const isFa = locale === "fa";

  const [courses, setCourses] = useState<CourseEditorItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCefr, setSelectedCefr] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLicense, setSelectedLicense] = useState<string>("all");

  // Expanded Course Curriculum Tree
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Redaction Inspector
  const [inspectingLesson, setInspectingLesson] = useState<LessonEditorItem | null>(null);
  const [redactionPreview, setRedactionPreview] = useState<PaywallRedactionPreview | null>(null);
  const [inspectMode, setInspectMode] = useState<"learner_unsubscribed" | "learner_subscribed">("learner_unsubscribed");
  const [redactionLoading, setRedactionLoading] = useState<boolean>(false);

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<CourseEditorItem | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<CourseEditorItem>>({
    slug: "",
    title_fa: "",
    title_en: "",
    description_fa: "",
    description_en: "",
    skill_category: "listening",
    cefr_level: "B1",
    target_audience: "general",
    is_premium: true,
    estimated_hours: 10,
    source_attribution: "Endoora Curriculum Team",
    license_type: "original_editorial",
    author_name: "Endoora Academic Board",
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState<boolean>(false);
  const [moduleParentCourseId, setModuleParentCourseId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleEditorItem | null>(null);
  const [moduleFormData, setModuleFormData] = useState<Partial<ModuleEditorItem>>({
    title_fa: "",
    title_en: "",
    description_fa: "",
    description_en: "",
    order: 1,
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [lessonParentModuleId, setLessonParentModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonEditorItem | null>(null);
  const [lessonFormData, setLessonFormData] = useState<Partial<LessonEditorItem>>({
    title_fa: "",
    title_en: "",
    duration_minutes: 15,
    is_free_preview: false,
    content_body_fa: "",
    content_body_en: "",
    video_url: "",
    audio_url: "",
    transcript_fa: "",
    transcript_en: "",
    free_preview_excerpt_fa: "",
    free_preview_excerpt_en: "",
  });

  const [transitionCourseItem, setTransitionCourseItem] = useState<CourseEditorItem | null>(null);
  const [transitionAction, setTransitionAction] = useState<"submit_review" | "publish" | "archive" | "revert_draft">("submit_review");
  const [transitionNote, setTransitionNote] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  // Load Courses
  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const filters: CourseFilters = {
          q: searchQuery,
          cefr: selectedCefr,
          skill: selectedSkill,
          audience: selectedAudience,
          status: selectedStatus,
          license: selectedLicense,
        };
        const data = await fetchEditorCourses(filters, controller.signal);
        setCourses(data.results);
        setTotalCount(data.count);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : isFa
            ? "بارگذاری دوره‌ها ناموفق بود."
            : "Failed to load courses."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => controller.abort();
  }, [searchQuery, selectedCefr, selectedSkill, selectedAudience, selectedStatus, selectedLicense, refreshKey, isFa]);

  // Load Redaction Preview
  useEffect(() => {
    if (!inspectingLesson) return;
    const controller = new AbortController();

    async function loadRedaction() {
      if (!inspectingLesson) return;
      setRedactionLoading(true);
      try {
        const preview = await previewLessonRedaction(inspectingLesson.id, inspectMode, controller.signal);
        setRedactionPreview(preview);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setRedactionPreview(null);
      } finally {
        if (!controller.signal.aborted) {
          setRedactionLoading(false);
        }
      }
    }

    void loadRedaction();

    return () => controller.abort();
  }, [inspectingLesson, inspectMode]);

  // Compute Metrics
  const publishedCount = courses.filter((c) => c.status === "published").length;
  const inReviewCount = courses.filter((c) => c.status === "in_review").length;
  const draftCount = courses.filter((c) => c.status === "draft").length;
  const archivedCount = courses.filter((c) => c.status === "archived").length;
  const totalLessons = courses.reduce((acc, c) => acc + (c.total_lessons || 0), 0);
  const totalHours = courses.reduce((acc, c) => acc + (c.estimated_hours || 0), 0);

  // Course Handlers
  function openCreateCourseModal() {
    setEditingCourse(null);
    setCourseFormData({
      slug: "",
      title_fa: "",
      title_en: "",
      description_fa: "",
      description_en: "",
      skill_category: "listening",
      cefr_level: "B1",
      target_audience: "general",
      is_premium: true,
      estimated_hours: 10,
      source_attribution: "Endoora Curriculum Team",
      license_type: "original_editorial",
      author_name: "Endoora Academic Board",
    });
    setActionError(null);
    setIsCourseModalOpen(true);
  }

  function openEditCourseModal(course: CourseEditorItem) {
    setEditingCourse(course);
    setCourseFormData({
      slug: course.slug,
      title_fa: course.title_fa,
      title_en: course.title_en,
      description_fa: course.description_fa,
      description_en: course.description_en,
      skill_category: course.skill_category,
      cefr_level: course.cefr_level,
      target_audience: course.target_audience,
      is_premium: course.is_premium,
      estimated_hours: course.estimated_hours,
      source_attribution: course.source_attribution,
      license_type: course.license_type,
      author_name: course.author_name,
      thumbnail_url: course.thumbnail_url,
    });
    setActionError(null);
    setIsCourseModalOpen(true);
  }

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);
    try {
      if (editingCourse) {
        await updateEditorCourse(editingCourse.id, courseFormData);
      } else {
        await createEditorCourse(courseFormData);
      }
      setIsCourseModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteCourse(course: CourseEditorItem) {
    if (
      !confirm(
        isFa
          ? `آیا از حذف دوره «${course.title_fa}» و تمامی سرفصل‌های آن اطمینان دارید؟ این عمل غیرقابل بازگشت است.`
          : `Are you sure you want to delete "${course.title_en}" and all its modules? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteEditorCourse(course.id);
      if (expandedCourseId === course.id) setExpandedCourseId(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  // Module Handlers
  function openAddModuleModal(courseId: string) {
    setModuleParentCourseId(courseId);
    setEditingModule(null);
    setModuleFormData({
      title_fa: "",
      title_en: "",
      description_fa: "",
      description_en: "",
      order: 1,
    });
    setActionError(null);
    setIsModuleModalOpen(true);
  }

  function openEditModuleModal(courseId: string, module: ModuleEditorItem) {
    setModuleParentCourseId(courseId);
    setEditingModule(module);
    setModuleFormData({
      title_fa: module.title_fa,
      title_en: module.title_en,
      description_fa: module.description_fa,
      description_en: module.description_en,
      order: module.order,
    });
    setActionError(null);
    setIsModuleModalOpen(true);
  }

  async function handleSaveModule(e: React.FormEvent) {
    e.preventDefault();
    if (!moduleParentCourseId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (editingModule) {
        await updateEditorModule(moduleParentCourseId, editingModule.id, moduleFormData);
      } else {
        await createEditorModule(moduleParentCourseId, moduleFormData);
      }
      setIsModuleModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteModule(courseId: string, moduleId: string) {
    if (!confirm(isFa ? "آیا از حذف این فصل آموزشی اطمینان دارید؟" : "Are you sure you want to delete this module?")) return;
    try {
      await deleteEditorModule(courseId, moduleId);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  // Lesson Handlers
  function openAddLessonModal(moduleId: string) {
    setLessonParentModuleId(moduleId);
    setEditingLesson(null);
    setLessonFormData({
      title_fa: "",
      title_en: "",
      duration_minutes: 15,
      is_free_preview: false,
      content_body_fa: "",
      content_body_en: "",
      video_url: "",
      audio_url: "",
      transcript_fa: "",
      transcript_en: "",
      free_preview_excerpt_fa: "",
      free_preview_excerpt_en: "",
    });
    setActionError(null);
    setIsLessonModalOpen(true);
  }

  function openEditLessonModal(lesson: LessonEditorItem) {
    setLessonParentModuleId(lesson.module);
    setEditingLesson(lesson);
    setLessonFormData({
      title_fa: lesson.title_fa,
      title_en: lesson.title_en,
      duration_minutes: lesson.duration_minutes,
      is_free_preview: lesson.is_free_preview,
      content_body_fa: lesson.content_body_fa,
      content_body_en: lesson.content_body_en,
      video_url: lesson.video_url,
      audio_url: lesson.audio_url,
      transcript_fa: lesson.transcript_fa,
      transcript_en: lesson.transcript_en,
      free_preview_excerpt_fa: lesson.free_preview_excerpt_fa,
      free_preview_excerpt_en: lesson.free_preview_excerpt_en,
    });
    setActionError(null);
    setIsLessonModalOpen(true);
  }

  async function handleSaveLesson(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);
    try {
      if (editingLesson) {
        await updateEditorLesson(editingLesson.id, lessonFormData);
      } else if (lessonParentModuleId) {
        await createEditorLesson(lessonParentModuleId, lessonFormData);
      }
      setIsLessonModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm(isFa ? "آیا از حذف این درس اطمینان دارید؟" : "Are you sure you want to delete this lesson?")) return;
    try {
      await deleteEditorLesson(lessonId);
      if (inspectingLesson?.id === lessonId) setInspectingLesson(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  // Transition Handlers
  function openTransitionModal(course: CourseEditorItem, action: "submit_review" | "publish" | "archive" | "revert_draft") {
    setTransitionCourseItem(course);
    setTransitionAction(action);
    setTransitionNote("");
    setActionError(null);
  }

  async function handleConfirmTransition() {
    if (!transitionCourseItem) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await transitionCourse(transitionCourseItem.id, transitionAction, transitionNote);
      setTransitionCourseItem(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  // Export JSON
  function handleExportJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `endoora-courses-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Operations Navigation Ribbon */}
      <nav className={styles.operationsNav} aria-label={isFa ? "ناوبری عملیات محتوا" : "Content Operations Navigation"}>
        <Link href="/operations/taxonomy" className={styles.navTab}>
          {isFa ? "تاکسونومی و سرفصل آموزشی (CONTENT-001)" : "Content Taxonomy (CONTENT-001)"}
        </Link>
        <Link href="/operations/questions" className={styles.navTab}>
          {isFa ? "بانک سؤال نسخه‌بندی‌شده (CONTENT-002)" : "Versioned Question Bank (CONTENT-002)"}
        </Link>
        <Link href="/operations/courses" className={`${styles.navTab} ${styles.navTabActive}`}>
          {isFa ? "مدیریت دوره‌ها و سرفصل‌ها (CONTENT-003)" : "Course CMS & Units (CONTENT-003)"}
        </Link>
        <Link href="/operations/content" className={styles.navTab}>
          {isFa ? "محتوا، فرهنگ و وبلاگ (CONTENT-004)" : "Skills & Culture CMS (CONTENT-004)"}
        </Link>
        <Link href="/admin" className={styles.navTab}>
          {isFa ? "میز مدیریت عملیات (OPS-001)" : "Admin Operations (OPS-001)"}
        </Link>
        <Link href="/operations/flags" className={styles.navTab}>
          {isFa ? "کلیدهای ویژگی (OPS-002)" : "Feature Flags (OPS-002)"}
        </Link>
        <Link href="/operations/audit" className={styles.navTab}>
          {isFa ? "ردپای ممیزی (OPS-003)" : "Audit Trail (OPS-003)"}
        </Link>
        <Link href="/operations/security" className={styles.navTab}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (Privacy)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (Pen-Test)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
        <Link href="/operations/ai" className={styles.opsTab}>
          🤖 مدل‌ها و پرامپت‌ها (OPS-005)
        </Link>
        <Link href="/operations/monitoring" className={styles.opsTab}>
          📊 پایش و لاگ‌ها (OPS-006)
        </Link>
        <Link href="/operations/analytics" className={styles.opsTab}>
          📈 تحلیل محصول و فانل (OPS-007)
        </Link>
        <Link href="/operations/pwa" className={styles.opsTab}>
          📱 PWA و تاب‌آوری آفلاین (OPS-008)
        </Link>
        <Link href="/operations/incidents" className={styles.opsTab}>
          🚨 مدیریت بحران و ران‌بوک‌ها (OPS-009)
        </Link>
      </nav>

      {/* Operational Header */}
      <header className={styles.headerSection}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <span className={styles.kicker}>
              {isFa ? "سامانه جامع مدیریت محتوای آموزشی" : "Educational Content Management"}
            </span>
            <h1 className={styles.headerTitle}>
              {isFa ? "مدیریت دوره‌ها، فصول و بررسی سانسور پی‌وال (CONTENT-003)" : "Course CMS, Curriculum Units & Paywall Redaction"}
            </h1>
            <p className={styles.headerDescription}>
              {isFa
                ? "طراحی و ویرایش دوره‌ها، فصول و جلسات آموزشی، مدیریت وضعیت‌های انتشار، اعتبارسنجی حقوق مالکیت فکری و شبیه‌سازی سانسور محتوای ویژه در سمت سرور."
                : "Author and manage courses, curriculum modules, and lessons, govern editorial release gates, enforce copyright metadata, and inspect server-side paywall redaction."}
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.localeToggle}>
              <button
                type="button"
                className={`${styles.localeBtn} ${isFa ? styles.localeBtnActive : ""}`}
                onClick={() => setLocale("fa")}
              >
                فارسی
              </button>
              <button
                type="button"
                className={`${styles.localeBtn} ${!isFa ? styles.localeBtnActive : ""}`}
                onClick={() => setLocale("en")}
              >
                English
              </button>
            </div>

            <button type="button" className={styles.secondaryActionBtn} onClick={handleExportJson}>
              📥 {isFa ? "خروجی JSON" : "Export JSON"}
            </button>

            <button type="button" className={styles.primaryActionBtn} onClick={openCreateCourseModal}>
              ➕ {isFa ? "ایجاد دوره جدید" : "Create New Course"}
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "کل دوره‌ها" : "Total Courses"}</span>
            <span className={styles.metricValue}>{totalCount}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "منتشر شده" : "Published"}</span>
            <span className={styles.metricValue} style={{ color: "var(--color-success)" }}>
              {publishedCount}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "در انتظار بازبینی" : "In Review"}</span>
            <span className={styles.metricValue} style={{ color: "var(--color-warning)" }}>
              {inReviewCount}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "پیش‌نویس" : "Draft"}</span>
            <span className={styles.metricValue}>{draftCount}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "بایگانی شده" : "Archived"}</span>
            <span className={styles.metricValue} style={{ color: "var(--color-text-muted)" }}>
              {archivedCount}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "تعداد کل دروس" : "Total Lessons"}</span>
            <span className={styles.metricValue}>{totalLessons}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{isFa ? "ساعت آموزش" : "Total Hours"}</span>
            <span className={styles.metricValue}>{totalHours}</span>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <section className={styles.filterBar} aria-label={isFa ? "فیلترها و جستجو" : "Filters and Search"}>
        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={isFa ? "جست‌وجوی عنوان دوره، شناسه، نویسنده یا منبع..." : "Search title, slug, author, attribution..."}
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            aria-label={isFa ? "جست‌وجوی دوره" : "Search courses"}
          />

          <select
            className={styles.filterSelect}
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
            aria-label={isFa ? "سطح CEFR" : "CEFR Level"}
          >
            <option value="all">{isFa ? "همه سطوح CEFR" : "All CEFR"}</option>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            aria-label={isFa ? "مهارت" : "Skill Category"}
          >
            <option value="all">{isFa ? "همه مهارت‌ها" : "All Skills"}</option>
            <option value="listening">{isFa ? "شنیداری (Listening)" : "Listening"}</option>
            <option value="speaking">{isFa ? "گفتاری (Speaking)" : "Speaking"}</option>
            <option value="reading">{isFa ? "خواندن (Reading)" : "Reading"}</option>
            <option value="writing">{isFa ? "نگارش (Writing)" : "Writing"}</option>
            <option value="grammar">{isFa ? "گرامر (Grammar)" : "Grammar"}</option>
            <option value="vocabulary">{isFa ? "واژگان (Vocabulary)" : "Vocabulary"}</option>
            <option value="culture">{isFa ? "فرهنگ و رویدادها (Culture)" : "Culture"}</option>
            <option value="school">{isFa ? "دبیرستان و کنکور (School)" : "School & Konkur"}</option>
          </select>

          <select
            className={styles.filterSelect}
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            aria-label={isFa ? "مخاطب هدف" : "Target Audience"}
          >
            <option value="all">{isFa ? "همه مخاطبان" : "All Audiences"}</option>
            <option value="general">{isFa ? "عمومی (General)" : "General Learners"}</option>
            <option value="school_konkur">{isFa ? "دبیرستان و کنکور" : "High School & Konkur"}</option>
            <option value="ielts_academic">{isFa ? "آزمون آیلتس" : "IELTS & Academic"}</option>
            <option value="business">{isFa ? "کسب‌وکار و تخصصی" : "Business"}</option>
          </select>

          <select
            className={styles.filterSelect}
            value={selectedLicense}
            onChange={(e) => setSelectedLicense(e.target.value)}
            aria-label={isFa ? "نوع مجوز" : "License Type"}
          >
            <option value="all">{isFa ? "همه مجوزها" : "All Licenses"}</option>
            <option value="original_editorial">{isFa ? "تألیفی اختصاصی اندورا" : "Original Editorial"}</option>
            <option value="cc_by_sa">{isFa ? "کریتیو کامنز (CC-BY-SA)" : "CC BY-SA"}</option>
            <option value="public_domain">{isFa ? "مالکیت عمومی (Public Domain)" : "Public Domain"}</option>
            <option value="educational_fair_use">{isFa ? "استفاده منصفانه آموزشی" : "Educational Fair Use"}</option>
          </select>
        </div>

        <div className={styles.statusPills}>
          {[
            { key: "all", labelFa: "همه وضعیت‌ها", labelEn: "All Statuses" },
            { key: "draft", labelFa: "پیش‌نویس", labelEn: "Draft" },
            { key: "in_review", labelFa: "در انتظار بازبینی", labelEn: "In Review" },
            { key: "published", labelFa: "منتشر شده", labelEn: "Published" },
            { key: "archived", labelFa: "بایگانی شده", labelEn: "Archived" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`${styles.statusPill} ${selectedStatus === item.key ? styles.statusPillActive : ""}`}
              onClick={() => setSelectedStatus(item.key)}
            >
              {isFa ? item.labelFa : item.labelEn}
            </button>
          ))}
        </div>
      </section>

      {/* Main Course Inventory */}
      {loading ? (
        <div className={styles.loadingSpinner}>
          <span>{isFa ? "در حال بارگذاری دوره‌های آموزشی..." : "Loading courses..."}</span>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>{isFa ? "خطا در بارگذاری داده‌ها" : "Failed to load data"}</div>
          <p className={styles.emptyText}>{error}</p>
          <button type="button" className={styles.secondaryActionBtn} onClick={() => setRefreshKey((k) => k + 1)}>
            {isFa ? "تلاش مجدد" : "Retry"}
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>{isFa ? "دوره‌ای با این مشخصات یافت نشد" : "No courses found"}</div>
          <p className={styles.emptyText}>
            {isFa
              ? "فیلترهای انتخابی را تغییر داده یا دوره جدیدی ایجاد نمایید."
              : "Adjust your filter criteria or create a new course."}
          </p>
          <button type="button" className={styles.primaryActionBtn} onClick={openCreateCourseModal}>
            ➕ {isFa ? "ایجاد اولین دوره" : "Create First Course"}
          </button>
        </div>
      ) : (
        <div className={styles.coursesList}>
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <article key={course.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.badgeRow}>
                    <span className={styles.cefrBadge}>{course.cefr_level}</span>

                    <span
                      className={`${styles.statusBadge} ${
                        course.status === "published"
                          ? styles.statusPublished
                          : course.status === "in_review"
                          ? styles.statusInReview
                          : course.status === "draft"
                          ? styles.statusDraft
                          : styles.statusArchived
                      }`}
                    >
                      {course.status === "published"
                        ? isFa
                          ? "✓ منتشر شده"
                          : "Published"
                        : course.status === "in_review"
                        ? isFa
                          ? "⏳ در انتظار بازبینی"
                          : "In Review"
                        : course.status === "draft"
                        ? isFa
                          ? "📝 پیش‌نویس"
                          : "Draft"
                        : isFa
                        ? "📦 بایگانی شده"
                        : "Archived"}
                    </span>

                    {course.is_premium ? (
                      <span className={styles.premiumBadge}>🔒 {isFa ? "ویژه (Premium)" : "Premium"}</span>
                    ) : (
                      <span className={styles.freeBadge}>🎁 {isFa ? "رایگان (Free)" : "Free"}</span>
                    )}

                    <span className={styles.categoryBadge}>{course.skill_category}</span>
                    <span className={styles.categoryBadge}>{course.target_audience}</span>
                  </div>

                  <div className={styles.courseTitles}>
                    <h2 className={styles.titleFa}>{course.title_fa}</h2>
                    <span className={styles.titleEn}>{course.title_en}</span>
                  </div>
                </div>

                <p className={styles.courseDesc}>{isFa ? course.description_fa : course.description_en || course.description_fa}</p>

                {/* Metadata Strip */}
                <div className={styles.cardMetaBar}>
                  <div className={styles.metaItem}>
                    <span>📚 {isFa ? "فصول:" : "Modules:"}</span>
                    <strong>{course.total_modules}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>📝 {isFa ? "کل دروس:" : "Lessons:"}</span>
                    <strong>{course.total_lessons}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>👁️ {isFa ? "پیش‌نمایش رایگان:" : "Previews:"}</span>
                    <strong>{course.free_preview_count}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>⏱️ {isFa ? "مدت تخمینی:" : "Est. Hours:"}</span>
                    <strong>{course.estimated_hours} {isFa ? "ساعت" : "hrs"}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>✍️ {isFa ? "پدیدآورنده:" : "Author:"}</span>
                    <strong>{course.author_name}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>⚖️ {isFa ? "مجوز:" : "License:"}</span>
                    <strong>{course.license_type}</strong>
                  </div>
                  <div className={styles.metaItem}>
                    <span>🏷️ {isFa ? "شناسه:" : "Slug:"}</span>
                    <code>{course.slug}</code>
                  </div>
                </div>

                {/* Action Bar */}
                <div className={styles.cardActions}>
                  <div className={styles.leftButtonGroup}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    >
                      {isExpanded ? "▲ " : "▼ "}
                      {isFa ? "سرفصل‌ها و جلسات آموزشی" : "Curriculum Units & Lessons"}
                    </button>

                    <button type="button" className={styles.iconBtn} onClick={() => openEditCourseModal(course)}>
                      ✏️ {isFa ? "ویرایش مشخصات" : "Edit Metadata"}
                    </button>

                    <Link
                      href={`/courses/${course.slug}`}
                      className={styles.iconBtn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ↗️ {isFa ? "مشاهده نمای زبان‌آموز" : "Learner View"}
                    </Link>
                  </div>

                  <div className={styles.rightButtonGroup}>
                    {course.status === "draft" && (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => openTransitionModal(course, "submit_review")}
                      >
                        📤 {isFa ? "ارسال به بازبینی" : "Submit for Review"}
                      </button>
                    )}

                    {(course.status === "in_review" || course.status === "draft") && (
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.publishBtn}`}
                        onClick={() => openTransitionModal(course, "publish")}
                      >
                        ✓ {isFa ? "تأیید و انتشار رسمی" : "Publish Course"}
                      </button>
                    )}

                    {course.status === "published" && (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => openTransitionModal(course, "archive")}
                      >
                        📦 {isFa ? "بایگانی" : "Archive"}
                      </button>
                    )}

                    {course.status === "archived" && (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => openTransitionModal(course, "revert_draft")}
                      >
                        🔄 {isFa ? "بازگشت به پیش‌نویس" : "Revert to Draft"}
                      </button>
                    )}

                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.dangerBtn}`}
                      onClick={() => handleDeleteCourse(course)}
                    >
                      🗑️ {isFa ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Expanded Curriculum Tree */}
                {isExpanded && (
                  <div className={styles.curriculumTree}>
                    <div className={styles.curriculumHeader}>
                      <span>{isFa ? "ساختار فصول و جلسات آموزشی این دوره" : "Curriculum Units Hierarchy"}</span>
                      <button
                        type="button"
                        className={styles.primaryActionBtn}
                        onClick={() => openAddModuleModal(course.id)}
                      >
                        ➕ {isFa ? "افزودن فصل جدید" : "Add Module"}
                      </button>
                    </div>

                    {course.modules.length === 0 ? (
                      <div style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--color-text-muted)" }}>
                        {isFa ? "هنوز فصلی برای این دوره ثبت نشده است. روی «افزودن فصل جدید» کلیک کنید." : "No modules in this course yet."}
                      </div>
                    ) : (
                      course.modules.map((mod) => (
                        <div key={mod.id} className={styles.moduleItem}>
                          <div className={styles.moduleHeader}>
                            <div className={styles.moduleTitle}>
                              <span>فصل {mod.order}: {mod.title_fa}</span>
                              <span style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", marginInlineStart: "var(--space-2)" }}>
                                ({mod.title_en})
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                onClick={() => openAddLessonModal(mod.id)}
                              >
                                ➕ {isFa ? "افزودن درس" : "Add Lesson"}
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                onClick={() => openEditModuleModal(course.id, mod)}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.dangerBtn}`}
                                onClick={() => handleDeleteModule(course.id, mod.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {mod.lessons.length === 0 ? (
                            <div style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", paddingInlineStart: "var(--space-4)" }}>
                              {isFa ? "درسی در این فصل وجود ندارد." : "No lessons in this module."}
                            </div>
                          ) : (
                            <div className={styles.lessonsList}>
                              {mod.lessons.map((lesson) => (
                                <div key={lesson.id} className={styles.lessonRow}>
                                  <div className={styles.lessonInfo}>
                                    <strong>درس {lesson.order}:</strong>
                                    <span>{lesson.title_fa}</span>
                                    <span style={{ color: "var(--color-text-muted)" }}>({lesson.title_en})</span>
                                    <span>⏱️ {lesson.duration_minutes} دقیقه</span>
                                    {lesson.is_free_preview ? (
                                      <span className={styles.previewTag}>✓ پیش‌نمایش رایگان</span>
                                    ) : (
                                      <span className={styles.lockedTag}>🔒 قفل اشتراک ویژه</span>
                                    )}
                                  </div>

                                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                    <button
                                      type="button"
                                      className={styles.iconBtn}
                                      onClick={() => setInspectingLesson(lesson)}
                                      title={isFa ? "بررسی سانسور پی‌وال سمت سرور" : "Inspect Server-Side Paywall Redaction"}
                                    >
                                      🛡️ {isFa ? "آزمایش سانسور پی‌وال" : "Inspect Redaction"}
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.iconBtn}
                                      onClick={() => openEditLessonModal(lesson)}
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      className={`${styles.iconBtn} ${styles.dangerBtn}`}
                                      onClick={() => handleDeleteLesson(lesson.id)}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Paywall Redaction Inspector Drawer / Panel */}
      {inspectingLesson && (
        <section className={styles.inspectorCard} aria-label={isFa ? "بازرس سانسور سمت سرور" : "Server-Side Paywall Inspector"}>
          <div className={styles.inspectorHeader}>
            <div>
              <span className={styles.kicker}>
                {isFa ? "شبیه‌ساز و ممیز پی‌وال سمت سرور (Rule #10 Security)" : "Server-Side Redaction Auditor"}
              </span>
              <h2 style={{ margin: 0, fontSize: "var(--font-size-heading-sm)" }}>
                {isFa ? "بررسی صحت سانسور درس:" : "Inspecting Lesson:"} {inspectingLesson.title_fa}
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div className={styles.modeToggleGroup}>
                <button
                  type="button"
                  className={`${styles.modeToggleBtn} ${
                    inspectMode === "learner_unsubscribed" ? styles.modeToggleBtnActive : ""
                  }`}
                  onClick={() => setInspectMode("learner_unsubscribed")}
                >
                  {isFa ? "کاربر بدون اشتراک (Unsubscribed)" : "Unsubscribed Learner"}
                </button>
                <button
                  type="button"
                  className={`${styles.modeToggleBtn} ${
                    inspectMode === "learner_subscribed" ? styles.modeToggleBtnActive : ""
                  }`}
                  onClick={() => setInspectMode("learner_subscribed")}
                >
                  {isFa ? "کاربر با اشتراک ویژه (Subscribed)" : "Subscribed Learner"}
                </button>
              </div>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setInspectingLesson(null)}
                aria-label={isFa ? "بستن بازرس" : "Close inspector"}
              >
                ✕
              </button>
            </div>
          </div>

          {redactionLoading ? (
            <div className={styles.loadingSpinner}>
              <span>{isFa ? "در حال دریافت پاسخ سرور..." : "Querying server..."}</span>
            </div>
          ) : redactionPreview ? (
            <>
              <div
                className={`${styles.redactionSummaryAlert} ${
                  redactionPreview.is_locked ? styles.alertLocked : styles.alertUnlocked
                }`}
              >
                <strong>{redactionPreview.is_locked ? "🔒 وضعیت محتوا: سانسور شده (LOCKED)" : "🔓 وضعیت محتوا: دسترسی کامل (UNLOCKED)"}</strong>
                <p style={{ margin: "0.25rem 0 0 0" }}>
                  {isFa ? redactionPreview.redaction_summary_fa : redactionPreview.redaction_summary_en}
                </p>
                {redactionPreview.redacted_fields.length > 0 && (
                  <div style={{ marginBlockStart: "0.5rem" }}>
                    <span>{isFa ? "فیلدهای سانسور و حذف‌شده از شبکه:" : "Redacted wire fields:"} </span>
                    <code>{redactionPreview.redacted_fields.join(", ")}</code>
                  </div>
                )}
              </div>

              <div>
                <strong style={{ fontSize: "var(--font-size-small)" }}>
                  {isFa ? "بسته داده خام ارسال‌شده به مرورگر (Wire JSON Payload):" : "Actual Wire JSON Payload:"}
                </strong>
                <pre className={styles.codeBox}>
                  {JSON.stringify(redactionPreview.payload, null, 2)}
                </pre>
              </div>
            </>
          ) : null}
        </section>
      )}

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingCourse
                  ? isFa
                    ? "ویرایش مشخصات دوره"
                    : "Edit Course Metadata"
                  : isFa
                  ? "ایجاد دوره آموزشی جدید"
                  : "Create New Course"}
              </h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsCourseModalOpen(false)}>
                ✕
              </button>
            </div>

            {actionError && (
              <div className={styles.alertLocked} style={{ padding: "var(--space-3)" }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveCourse} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "عنوان فارسی دوره *" : "Persian Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={courseFormData.title_fa || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title_fa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "عنوان انگلیسی دوره *" : "English Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={courseFormData.title_en || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title_en: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "شناسه یکتا (Slug) *" : "Unique Slug *"}</label>
                <input
                  type="text"
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  className={styles.formInput}
                  placeholder="e.g. ielts-academic-writing"
                  value={courseFormData.slug || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value.toLowerCase() })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "سطح CEFR *" : "CEFR Level *"}</label>
                <select
                  className={styles.formSelect}
                  value={courseFormData.cefr_level || "B1"}
                  onChange={(e) => setCourseFormData({ ...courseFormData, cefr_level: e.target.value as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" })}
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "دسته‌بندی مهارتی *" : "Skill Category *"}</label>
                <select
                  className={styles.formSelect}
                  value={courseFormData.skill_category || "listening"}
                  onChange={(e) => setCourseFormData({ ...courseFormData, skill_category: e.target.value as "listening" | "speaking" | "reading" | "writing" | "grammar" | "vocabulary" | "culture" | "school" })}
                >
                  <option value="listening">{isFa ? "شنیداری (Listening)" : "Listening"}</option>
                  <option value="speaking">{isFa ? "گفتاری (Speaking)" : "Speaking"}</option>
                  <option value="reading">{isFa ? "خواندن (Reading)" : "Reading"}</option>
                  <option value="writing">{isFa ? "نگارش (Writing)" : "Writing"}</option>
                  <option value="grammar">{isFa ? "گرامر (Grammar)" : "Grammar"}</option>
                  <option value="vocabulary">{isFa ? "واژگان (Vocabulary)" : "Vocabulary"}</option>
                  <option value="culture">{isFa ? "فرهنگ و رویدادها (Culture)" : "Culture"}</option>
                  <option value="school">{isFa ? "دبیرستان و کنکور (School)" : "School"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "مخاطب هدف *" : "Target Audience *"}</label>
                <select
                  className={styles.formSelect}
                  value={courseFormData.target_audience || "general"}
                  onChange={(e) => setCourseFormData({ ...courseFormData, target_audience: e.target.value as "general" | "school_konkur" | "ielts_academic" | "business" })}
                >
                  <option value="general">{isFa ? "عمومی (General)" : "General"}</option>
                  <option value="school_konkur">{isFa ? "دبیرستان و کنکور" : "High School & Konkur"}</option>
                  <option value="ielts_academic">{isFa ? "آزمون آیلتس" : "IELTS & Academic"}</option>
                  <option value="business">{isFa ? "کسب‌وکار و تخصصی" : "Business"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "ساعت تخمینی آموزش *" : "Estimated Hours *"}</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  className={styles.formInput}
                  value={courseFormData.estimated_hours || 10}
                  onChange={(e) => setCourseFormData({ ...courseFormData, estimated_hours: parseInt(e.target.value, 10) || 10 })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "نوع دسترسی *" : "Access Model *"}</label>
                <label className={styles.checkboxRow} style={{ marginBlockStart: "var(--space-2)" }}>
                  <input
                    type="checkbox"
                    checked={courseFormData.is_premium ?? true}
                    onChange={(e) => setCourseFormData({ ...courseFormData, is_premium: e.target.checked })}
                  />
                  <span>{isFa ? "دوره ویژه نیازمند اشتراک (Premium)" : "Requires Premium Subscription"}</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "نام پدیدآورنده یا هیئت علمی *" : "Author / Academic Board *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={courseFormData.author_name || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, author_name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "نوع مجوز کپی‌رایت *" : "Copyright License *"}</label>
                <select
                  className={styles.formSelect}
                  value={courseFormData.license_type || "original_editorial"}
                  onChange={(e) => setCourseFormData({ ...courseFormData, license_type: e.target.value as "original_editorial" | "cc_by_sa" | "public_domain" | "educational_fair_use" })}
                >
                  <option value="original_editorial">{isFa ? "تألیفی اختصاصی اندورا" : "Original Editorial"}</option>
                  <option value="cc_by_sa">{isFa ? "کریتیو کامنز (CC-BY-SA)" : "CC BY-SA"}</option>
                  <option value="public_domain">{isFa ? "مالکیت عمومی (Public Domain)" : "Public Domain"}</option>
                  <option value="educational_fair_use">{isFa ? "استفاده منصفانه آموزشی" : "Educational Fair Use"}</option>
                </select>
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "ذکر منبع و اطلاعات حق نشر *" : "Source Attribution & Rights Reference *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={courseFormData.source_attribution || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, source_attribution: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "توضیح فارسی دوره" : "Persian Description"}</label>
                <textarea
                  className={styles.formTextarea}
                  value={courseFormData.description_fa || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description_fa: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "توضیح انگلیسی دوره" : "English Description"}</label>
                <textarea
                  className={styles.formTextarea}
                  value={courseFormData.description_en || ""}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description_en: e.target.value })}
                />
              </div>

              <div className={styles.modalFooter} style={{ gridColumn: "span 2" }}>
                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setIsCourseModalOpen(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={styles.primaryActionBtn}
                >
                  {actionLoading ? (isFa ? "در حال ذخیره..." : "Saving...") : isFa ? "ذخیره اطلاعات دوره" : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingModule ? (isFa ? "ویرایش فصل آموزشی" : "Edit Module") : isFa ? "افزودن فصل آموزشی جدید" : "Add New Module"}
              </h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModuleModalOpen(false)}>
                ✕
              </button>
            </div>

            {actionError && (
              <div className={styles.alertLocked} style={{ padding: "var(--space-3)" }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveModule} className={styles.formGrid}>
              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "عنوان فارسی فصل *" : "Persian Module Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={moduleFormData.title_fa || ""}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, title_fa: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "عنوان انگلیسی فصل *" : "English Module Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={moduleFormData.title_en || ""}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, title_en: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "ترتیب نمایش" : "Order Sequence"}</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={moduleFormData.order || 1}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, order: parseInt(e.target.value, 10) || 1 })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "توضیح فصل" : "Module Description"}</label>
                <textarea
                  className={styles.formTextarea}
                  value={moduleFormData.description_fa || ""}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, description_fa: e.target.value })}
                />
              </div>

              <div className={styles.modalFooter} style={{ gridColumn: "span 2" }}>
                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setIsModuleModalOpen(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={styles.primaryActionBtn}
                >
                  {actionLoading ? (isFa ? "در حال ذخیره..." : "Saving...") : isFa ? "ذخیره فصل" : "Save Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingLesson ? (isFa ? "ویرایش درس آموزشی" : "Edit Lesson") : isFa ? "افزودن درس آموزشی جدید" : "Add New Lesson"}
              </h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsLessonModalOpen(false)}>
                ✕
              </button>
            </div>

            {actionError && (
              <div className={styles.alertLocked} style={{ padding: "var(--space-3)" }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveLesson} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "عنوان فارسی درس *" : "Persian Lesson Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={lessonFormData.title_fa || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title_fa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "عنوان انگلیسی درس *" : "English Lesson Title *"}</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={lessonFormData.title_en || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title_en: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "مدت زمان (دقیقه) *" : "Duration (minutes) *"}</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  required
                  className={styles.formInput}
                  value={lessonFormData.duration_minutes || 15}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, duration_minutes: parseInt(e.target.value, 10) || 15 })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "دسترسی پیش‌نمایش" : "Preview Access"}</label>
                <label className={styles.checkboxRow} style={{ marginBlockStart: "var(--space-2)" }}>
                  <input
                    type="checkbox"
                    checked={lessonFormData.is_free_preview ?? false}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, is_free_preview: e.target.checked })}
                  />
                  <span>{isFa ? "جلسه پیش‌نمایش رایگان (Free Preview)" : "Free Preview Lesson"}</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "آدرس ویدئو (Video URL)" : "Video URL"}</label>
                <input
                  type="url"
                  className={styles.formInput}
                  placeholder="https://media.endoora.ir/videos/lesson.mp4"
                  value={lessonFormData.video_url || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "آدرس صوت (Audio URL)" : "Audio URL"}</label>
                <input
                  type="url"
                  className={styles.formInput}
                  placeholder="https://media.endoora.ir/audios/lesson.mp3"
                  value={lessonFormData.audio_url || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, audio_url: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "متن کامل درس (فارسی - مارک‌داون)" : "Full Body (Persian Markdown)"}</label>
                <textarea
                  className={styles.formTextarea}
                  value={lessonFormData.content_body_fa || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, content_body_fa: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "متن کامل درس (انگلیسی)" : "Full Body (English)"}</label>
                <textarea
                  className={styles.formTextarea}
                  value={lessonFormData.content_body_en || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, content_body_en: e.target.value })}
                />
              </div>

              <div className={styles.formFull}>
                <label className={styles.formLabel}>{isFa ? "متن بریده پیش‌نمایش رایگان (هنگام قفل بودن درس نمایش می‌یابد)" : "Free Preview Excerpt (Shown when locked)"}</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder={isFa ? "چکیده‌ای از مبحث که قبل از خرید اشتراک برای کاربر قابل مشاهده است..." : "Brief teaser visible to unentitled users..."}
                  value={lessonFormData.free_preview_excerpt_fa || ""}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, free_preview_excerpt_fa: e.target.value })}
                />
              </div>

              <div className={styles.modalFooter} style={{ gridColumn: "span 2" }}>
                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setIsLessonModalOpen(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={styles.primaryActionBtn}
                >
                  {actionLoading ? (isFa ? "در حال ذخیره..." : "Saving...") : isFa ? "ذخیره درس" : "Save Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transition Modal */}
      {transitionCourseItem && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {transitionAction === "publish"
                  ? isFa
                    ? "تأیید و انتشار رسمی دوره"
                    : "Publish Course"
                  : transitionAction === "submit_review"
                  ? isFa
                    ? "ارسال دوره برای بازبینی"
                    : "Submit Course for Review"
                  : transitionAction === "archive"
                  ? isFa
                    ? "بایگانی دوره آموزشی"
                    : "Archive Course"
                  : isFa
                  ? "بازگردانی به پیش‌نویس"
                  : "Revert to Draft"}
              </h2>
              <button type="button" className={styles.closeBtn} onClick={() => setTransitionCourseItem(null)}>
                ✕
              </button>
            </div>

            {actionError && (
              <div className={styles.alertLocked} style={{ padding: "var(--space-3)" }}>
                {actionError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <p style={{ margin: 0, fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-relaxed)" }}>
                {transitionAction === "publish"
                  ? isFa
                    ? `آیا از انتشار رسمی دوره «${transitionCourseItem.title_fa}» با ${transitionCourseItem.total_modules} فصل و ${transitionCourseItem.total_lessons} درس اطمینان دارید؟ دوره منتشر شده در کاتالوگ عمومی قرار می‌گیرد.`
                    : `Are you sure you want to publish "${transitionCourseItem.title_en}"? It will become visible in the public course catalog.`
                  : isFa
                  ? `تغییر وضعیت دوره «${transitionCourseItem.title_fa}» به ${transitionAction}.`
                  : `Change status of "${transitionCourseItem.title_en}" to ${transitionAction}.`}
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "یادداشت تغییر وضعیت (اختیاری):" : "Transition Note (Optional):"}</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={isFa ? "علت یا توضیحات بازبینی..." : "Reason or review comments..."}
                  value={transitionNote}
                  onChange={(e) => setTransitionNote(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => setTransitionCourseItem(null)}
              >
                {isFa ? "انصراف" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                className={`${styles.primaryActionBtn} ${transitionAction === "publish" ? styles.publishBtn : ""}`}
                onClick={handleConfirmTransition}
              >
                {actionLoading ? (isFa ? "در حال پردازش..." : "Processing...") : isFa ? "تأیید و اعمال" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
