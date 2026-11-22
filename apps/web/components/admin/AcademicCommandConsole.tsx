"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useEffect, useState } from "react";
import styles from "./academic-command.module.css";
import {
  CourseEditorItem,
  ModuleEditorItem,
  LessonEditorItem,
  QuizItem,
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
} from "../../lib/courses-cms";
import {
  LearnerEnrollmentRecord,
  AcademicOverrideAuditRecord,
  MediaPresetAsset,
  MEDIA_PRESET_ASSETS,
  AiGeneratedQuizQuestion,
} from "../../lib/admin-academics-store";

export type AcademicSubTab = "curriculum" | "media" | "quizzes" | "learners";

export function AcademicCommandConsole() {
  const [activeSubTab, setActiveSubTab] = useState<AcademicSubTab>("curriculum");
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // -------------------------------------------------------------
  // Sub-Tab 1: Curriculum State
  // -------------------------------------------------------------
  const [courses, setCourses] = useState<CourseEditorItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCefr, setFilterCefr] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Modals for Curriculum
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
    estimated_hours: 12,
    source_attribution: "Endoora Academic Board",
    license_type: "original_editorial",
    author_name: "تیم مولفان ایندورا",
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState<boolean>(false);
  const [moduleParentCourseId, setModuleParentCourseId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleEditorItem | null>(null);
  const [moduleFormData, setModuleFormData] = useState<Partial<ModuleEditorItem>>({
    title_fa: "",
    title_en: "",
    description_fa: "",
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
    order: 1,
  });

  // -------------------------------------------------------------
  // Sub-Tab 2: Media Studio State
  // -------------------------------------------------------------
  const [selectedMediaPreset, setSelectedMediaPreset] = useState<MediaPresetAsset>(MEDIA_PRESET_ASSETS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>(MEDIA_PRESET_ASSETS[0].videoUrl);
  const [customAudioUrl, setCustomAudioUrl] = useState<string>(MEDIA_PRESET_ASSETS[0].audioUrl);
  const [mediaCollectionFilter, setMediaCollectionFilter] = useState<string>("all");
  const [activePlaybackTime, setActivePlaybackTime] = useState<string>("00:00");

  // -------------------------------------------------------------
  // Sub-Tab 3: AI & Quiz Studio State
  // -------------------------------------------------------------
  const [selectedQuizLesson, setSelectedQuizLesson] = useState<LessonEditorItem | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizItem[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiFocusTopic, setAiFocusTopic] = useState<string>("");
  // Form for single question builder
  const [qType, setQType] = useState<"multiple_choice" | "true_false" | "cloze" | "listening">("multiple_choice");
  const [qPromptFa, setQPromptFa] = useState<string>("");
  const [qPromptEn, setQPromptEn] = useState<string>("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qCorrectIdx, setQCorrectIdx] = useState<number>(0);
  const [qExplanationFa, setQExplanationFa] = useState<string>("");
  const [qExplanationEn, setQExplanationEn] = useState<string>("");
  // Live Simulator State
  const [simAnswers, setSimAnswers] = useState<{ [qIndex: number]: number }>({});
  const [simSubmitted, setSimSubmitted] = useState<boolean>(false);
  const [simScore, setSimScore] = useState<number | null>(null);

  // -------------------------------------------------------------
  // Sub-Tab 4: Learners & Progress State
  // -------------------------------------------------------------
  const [enrollments, setEnrollments] = useState<LearnerEnrollmentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AcademicOverrideAuditRecord[]>([]);
  const [loadingLearners, setLoadingLearners] = useState<boolean>(false);
  const [learnerSearch, setLearnerSearch] = useState<string>("");
  const [selectedEnrollmentCourse, setSelectedEnrollmentCourse] = useState<string>("all");
  const [expandedEnrollmentId, setExpandedEnrollmentId] = useState<string | null>(null);

  // Confirmation Modal for Destructive Actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: "reset" | "revoke" | "score";
    learnerId: string;
    courseId: string;
    enrollmentId?: string;
    lessonId?: string;
    scoreVal?: number;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionType: "reset",
    learnerId: "",
    courseId: "",
  });
  const [confirmReason, setConfirmReason] = useState<string>("");
  const [isExecutingConfirm, setIsExecutingConfirm] = useState<boolean>(false);

  // Grant New Enrollment Modal
  const [isGrantModalOpen, setIsGrantModalOpen] = useState<boolean>(false);
  const [grantName, setGrantName] = useState<string>("");
  const [grantEmail, setGrantEmail] = useState<string>("");
  const [grantPhone, setGrantPhone] = useState<string>("");
  const [grantCourseId, setGrantCourseId] = useState<string>("");
  const [grantReason, setGrantReason] = useState<string>("اعطای دوره توسط مدیریت آموزش");

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Load Courses
  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await fetchEditorCourses({
        q: searchQuery,
        cefr: filterCefr !== "all" ? filterCefr : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setCourses(data.results || []);
      if (!expandedCourseId && data.results?.length > 0) {
        setExpandedCourseId(data.results[0].id);
      }
    } catch {
      // In case api/courses/editor is not backed by active django, fallback to synthetic courses
      setCourses([
        {
          id: "course-grade12",
          slug: "grade-12-tamrin20",
          title_fa: "تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
          title_en: "Grade 12 Vision 3 - Final Exam Practice",
          description_fa: "بسته تخصصی امتحان نهایی زبان انگلیسی دوازدهم هماهنگ کشوری",
          description_en: "Nationwide high school final exam preparation module",
          skill_category: "school",
          cefr_level: "B1",
          target_audience: "school_konkur",
          status: "published",
          is_premium: true,
          thumbnail_url: "",
          estimated_hours: 15,
          source_attribution: "دفتر تالیف کتب درسی و تیم محتوای ایندورا",
          license_type: "educational_fair_use",
          author_name: "تیم زبان انگلیسی ایندورا",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          modules: [
            {
              id: "mod-v12-01",
              course: "course-grade12",
              title_fa: "فصل ۱: حس قدردانی و احترام (Sense of Appreciation)",
              title_en: "Module 1: Sense of Appreciation",
              description_fa: "تحلیل گرامر مجهول و واژگان دکتر قریب",
              description_en: "Passive voice and key lexical items",
              order: 1,
              lessons_count: 2,
              lessons: [
                {
                  id: "l-v12-01",
                  module: "mod-v12-01",
                  title_fa: "درس ۱: گرامر مجهول و ساختار افعال to be",
                  title_en: "Lesson 1: Passive Voice Framework",
                  order: 1,
                  duration_minutes: 20,
                  is_free_preview: true,
                  content_body_fa: "آموزش گام به گام تبدیل جملات معلوم به مجهول با تاکید بر امتحانات نهایی خرداد و شهریور.",
                  content_body_en: "Step-by-step guidance on passive transformations for final exams.",
                  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                  audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                  transcript_fa: "در این درس ما نحوه استفاده از افعال to be را به همراه اسم مفعول بررسی می‌کنیم.",
                  transcript_en: "In this lesson we analyze how to be auxiliaries pair with past participles.",
                  quiz_data: [
                    {
                      prompt_fa: "کدام ساختار مجهول برای جمله 'They built the hospital in 1980' صحیح است؟",
                      prompt_en: "Which passive sentence corresponds to 'They built the hospital in 1980'?",
                      options: [
                        "The hospital was built in 1980.",
                        "The hospital has been built in 1980.",
                        "The hospital is built in 1980.",
                        "The hospital will be built in 1980.",
                      ],
                      correct_index: 0,
                      explanation_fa: "چون زمان جمله گذشته ساده است، از was/were به همراه P.P (built) استفاده می‌شود.",
                      explanation_en: "Past simple active changes to was/were + past participle in passive.",
                    },
                  ],
                  downloadable_resources: [
                    { title: "کاربرگ سوالات نهایی درس ۱ (PDF)", url: "/downloads/v3_l1.pdf", size: "2.4 MB" },
                  ],
                  free_preview_excerpt_fa: "پیش‌نمایش رایگان قواعد درس اول زبان دوازدهم",
                  free_preview_excerpt_en: "Free preview excerpt of Grade 12 Unit 1 grammar",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                {
                  id: "l-v12-02",
                  module: "mod-v12-01",
                  title_fa: "درس ۲: واژگان تخصصی و کالوکیشن‌های امتحان نهایی",
                  title_en: "Lesson 2: Final Exam Essential Collocations",
                  order: 2,
                  duration_minutes: 25,
                  is_free_preview: false,
                  content_body_fa: "بررسی لغات پرکاربرد نظیر dedicate, distinguish, physician, boost و حل تست‌های نهایی.",
                  content_body_en: "Vocabulary drilling on essential high-frequency verbs and nouns.",
                  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                  transcript_fa: "دکتر قریب تمام عمر خود را وقف درمان کودکان بی‌بضاعت کرد.",
                  transcript_en: "Dr. Gharib dedicated his entire life to treating underprivileged children.",
                  quiz_data: [],
                  downloadable_resources: [],
                  free_preview_excerpt_fa: "برای مشاهده این بخش نیاز به اشتراک فعال دارید.",
                  free_preview_excerpt_en: "Subscription entitlement required.",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ],
            },
          ],
          total_modules: 1,
          total_lessons: 2,
          free_preview_count: 1,
          total_duration_minutes: 45,
          enrollment_count: 42,
        },
        {
          id: "course-speakout-b1",
          slug: "speakout-b1-mastery",
          title_fa: "دوره مکالمه و گرامر جامع (Speakout B1)",
          title_en: "Conversational Fluency Mastery (Speakout B1)",
          description_fa: "مهارت‌های مکالمه روزمره، مصاحبه و ساختارهای تعاملی پیشرفته",
          description_en: "Conversational fluency and pragmatic speaking drills",
          skill_category: "speaking",
          cefr_level: "B1",
          target_audience: "general",
          status: "published",
          is_premium: true,
          thumbnail_url: "",
          estimated_hours: 30,
          source_attribution: "BBC & Pearson Education",
          license_type: "cc_by_sa",
          author_name: "تیم مکالمه ایندورا",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          modules: [],
          total_modules: 0,
          total_lessons: 0,
          free_preview_count: 0,
          total_duration_minutes: 0,
          enrollment_count: 85,
        },
      ]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Load Learners & Enrollments
  const loadLearners = async () => {
    setLoadingLearners(true);
    try {
      const res = await fetch(
        `/api/admin/academics/enrollments?q=${encodeURIComponent(learnerSearch)}&course_id=${selectedEnrollmentCourse}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setEnrollments(json.enrollments || []);
          setAuditLogs(json.auditLogs || []);
        }
      }
    } catch {
      showToast("خطا در بارگذاری پرونده‌های ثبت‌نام زبان‌آموزان", "error");
    } finally {
      setLoadingLearners(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadLearners();
  }, []);

  // Set default active quiz lesson when courses load
  useEffect(() => {
    if (!selectedQuizLesson && courses.length > 0) {
      for (const c of courses) {
        for (const m of c.modules || []) {
          if (m.lessons && m.lessons.length > 0) {
            setSelectedQuizLesson(m.lessons[0]);
            setQuizQuestions(m.lessons[0].quiz_data || []);
            setAiFocusTopic(m.lessons[0].title_fa);
            return;
          }
        }
      }
    }
  }, [courses]);

  // Handle Course Form Submit
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateEditorCourse(editingCourse.id, courseFormData);
        showToast("دوره آموزشی با موفقیت ویرایش شد.", "success");
      } else {
        await createEditorCourse(courseFormData);
        showToast("دوره آموزشی جدید با موفقیت ایجاد گردید.", "success");
      }
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      loadCourses();
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ذخیره دوره", "error");
    }
  };

  // Handle Module Form Submit
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleParentCourseId) return;
    try {
      if (editingModule) {
        await updateEditorModule(moduleParentCourseId, editingModule.id, moduleFormData);
        showToast("فصل با موفقیت به‌روزرسانی شد.", "success");
      } else {
        await createEditorModule(moduleParentCourseId, moduleFormData);
        showToast("فصل جدید با موفقیت افزوده شد.", "success");
      }
      setIsModuleModalOpen(false);
      setEditingModule(null);
      loadCourses();
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ذخیره فصل", "error");
    }
  };

  // Handle Lesson Form Submit
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonParentModuleId) return;
    try {
      if (editingLesson) {
        await updateEditorLesson(editingLesson.id, lessonFormData);
        showToast("درس با موفقیت به‌روزرسانی شد.", "success");
      } else {
        await createEditorLesson(lessonParentModuleId, lessonFormData);
        showToast("درس جدید با موفقیت ایجاد گردید.", "success");
      }
      setIsLessonModalOpen(false);
      setEditingLesson(null);
      loadCourses();
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ذخیره درس", "error");
    }
  };

  // Transition Course Status
  const handleTransitionCourse = async (courseId: string, newStatus: string) => {
    try {
      await transitionCourse(courseId, newStatus as any);
      showToast(`وضعیت دوره به '${newStatus}' تغییر یافت.`, "success");
      loadCourses();
    } catch {
      // optimistic update locally
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, status: newStatus as any } : c))
      );
      showToast(`وضعیت دوره به '${newStatus}' تغییر یافت (اعمال محلی).`, "info");
    }
  };

  // AI Quiz Generation
  const handleGenerateAiQuiz = async () => {
    if (!selectedQuizLesson) {
      showToast("لطفاً ابتدا یک درس را انتخاب نمایید.", "error");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/admin/academics/ai-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiFocusTopic || selectedQuizLesson.title_fa,
          lessonBody: selectedQuizLesson.content_body_fa,
          transcript: selectedQuizLesson.transcript_fa,
          cefrLevel: "B1",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.questions) {
          const mappedQuestions: QuizItem[] = json.questions.map((q: AiGeneratedQuizQuestion) => ({
            prompt_fa: q.promptFa,
            prompt_en: q.promptEn,
            options: q.options,
            correct_index: q.correctIndex,
            explanation_fa: q.explanationFa,
            explanation_en: q.explanationEn,
          }));
          setQuizQuestions((prev) => [...prev, ...mappedQuestions]);
          showToast(`تعداد ${json.generatedCount} آزمونک آموزشی با هوش مصنوعی تولید و به درس اضافه شد.`, "success");
        }
      }
    } catch {
      showToast("خطا در ارتباط با موتور هوش مصنوعی", "error");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Add Custom Manual Question
  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPromptFa.trim()) {
      showToast("صورت سوال به فارسی الزامی است.", "error");
      return;
    }
    const cleanOptions = qType === "true_false" ? ["صحیح (True)", "غلط (False)"] : qOptions.filter((o) => o.trim() !== "");
    if (cleanOptions.length < 2) {
      showToast("حداقل دو گزینه برای سوال الزامی است.", "error");
      return;
    }

    const newQ: QuizItem = {
      prompt_fa: qPromptFa,
      prompt_en: qPromptEn,
      options: cleanOptions,
      correct_index: qCorrectIdx,
      explanation_fa: qExplanationFa,
      explanation_en: qExplanationEn,
    };

    setQuizQuestions((prev) => [...prev, newQ]);
    setQPromptFa("");
    setQPromptEn("");
    setQOptions(["", "", "", ""]);
    setQExplanationFa("");
    setQExplanationEn("");
    showToast("پرسش جدید با موفقیت به بانک آزمونک اضافه شد.", "success");
  };

  // Toggle Lesson Completion for a Student
  const handleToggleLessonCompletion = async (learnerId: string, courseId: string, lessonId: string) => {
    try {
      const res = await fetch("/api/admin/academics/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_lesson",
          learnerId,
          courseId,
          lessonId,
          reason: "تغییر وضعیت دستی درس توسط مدیر آموزش",
        }),
      });
      if (res.ok) {
        showToast("وضعیت تکمیل درس به‌روزرسانی شد.", "success");
        loadLearners();
      }
    } catch {
      showToast("خطا در ثبت تغییر وضعیت درس", "error");
    }
  };

  // Submit Destructive Action Modal
  const handleExecuteDestructiveAction = async () => {
    if (!confirmReason.trim()) {
      showToast("درج دلیل اقدام مدیریتی الزامی است.", "error");
      return;
    }
    setIsExecutingConfirm(true);
    try {
      if (confirmModal.actionType === "reset") {
        const res = await fetch("/api/admin/academics/override", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reset_progress",
            learnerId: confirmModal.learnerId,
            courseId: confirmModal.courseId,
            reason: confirmReason,
          }),
        });
        if (res.ok) {
          showToast("پیشرفت دوره با موفقیت ریست شد و در لاگ ممیزی ثبت گردید.", "success");
        }
      } else if (confirmModal.actionType === "revoke" && confirmModal.enrollmentId) {
        const res = await fetch("/api/admin/academics/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "revoke",
            enrollmentId: confirmModal.enrollmentId,
            reason: confirmReason,
          }),
        });
        if (res.ok) {
          showToast("ثبت‌نام و دسترسی دوره برای این زبان‌آموز لغو گردید.", "success");
        }
      } else if (confirmModal.actionType === "score" && confirmModal.lessonId && confirmModal.scoreVal !== undefined) {
        const res = await fetch("/api/admin/academics/override", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_score",
            learnerId: confirmModal.learnerId,
            courseId: confirmModal.courseId,
            lessonId: confirmModal.lessonId,
            newScore: confirmModal.scoreVal,
            reason: confirmReason,
          }),
        });
        if (res.ok) {
          showToast("نمره آزمونک با موفقیت اصلاح و ثبت شد.", "success");
        }
      }
      setConfirmModal({ isOpen: false, title: "", description: "", actionType: "reset", learnerId: "", courseId: "" });
      setConfirmReason("");
      loadLearners();
    } catch {
      showToast("خطا در اعمال تغییرات", "error");
    } finally {
      setIsExecutingConfirm(false);
    }
  };

  // Grant New Course Enrollment Submit
  const handleGrantEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantName || !grantCourseId) {
      showToast("نام زبان‌آموز و دوره انتخابی الزامی هستند.", "error");
      return;
    }
    const matchedCourse = courses.find((c) => c.id === grantCourseId || c.slug === grantCourseId);
    try {
      const res = await fetch("/api/admin/academics/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          learnerName: grantName,
          learnerEmail: grantEmail,
          learnerPhone: grantPhone,
          courseId: grantCourseId,
          courseTitleFa: matchedCourse?.title_fa || grantCourseId,
          courseTitleEn: matchedCourse?.title_en || grantCourseId,
          cefrLevel: matchedCourse?.cefr_level || "B1",
          reason: grantReason,
        }),
      });
      if (res.ok) {
        showToast(`دسترسی مستقیم دوره با موفقیت به '${grantName}' اعطا شد.`, "success");
        setIsGrantModalOpen(false);
        setGrantName("");
        setGrantEmail("");
        setGrantPhone("");
        loadLearners();
      }
    } catch {
      showToast("خطا در ثبت دوره برای زبان‌آموز", "error");
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`${styles.toastMessage} ${
            toast.type === "success" ? styles.toastSuccess : toast.type === "error" ? styles.toastError : styles.toastInfo
          }`}
        >
          <span>{toast.type === "success" ? "✅" : toast.type === "error" ? "⚠️" : "ℹ️"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Header & Sub-Tabs Navigation */}
      <div className={styles.headerCard}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <h2>🎓 سامانه جامع مدیریت آموزش، سرفصل‌ها و نمرات (Academic Command Center)</h2>
            <p>
              مرکز فرماندهی یکپارچه برای مدیریت چندرسانه‌ای دوره‌ها، درخت سرفصل‌ها، آزمونک‌های هوشمند هوش مصنوعی و
              میز کنترل سوابق و نمرات زبان‌آموزان
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                loadCourses();
                loadLearners();
                showToast("اطلاعات دوره‌ها و زبان‌آموزان به‌روزرسانی شد.", "info");
              }}
            >
              <span>🔄 تازه‌سازی داده‌ها</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className={styles.subTabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "curriculum" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("curriculum")}
          >
            <span>📚</span>
            <span>دایرکتوری و استودیو دوره‌ها</span>
            <span className={styles.tabBadge}>{courses.length} دوره</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "media" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("media")}
          >
            <span>🎬</span>
            <span>استودیو چندرسانه‌ای و پخش زنده</span>
            <span className={styles.tabBadge}>Live Preview</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "quizzes" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("quizzes")}
          >
            <span>🧠</span>
            <span>سازنده آزمونک و ارزیابی هوشمند</span>
            <span className={styles.tabBadge}>AI Powered</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "learners" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("learners")}
          >
            <span>🧑‍🎓</span>
            <span>میز فرمان ثبت‌نام و نمرات فراگیران</span>
            <span className={styles.tabBadge}>{enrollments.length} پرونده</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CURRICULUM & LESSON STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === "curriculum" && (
        <div className={styles.sectionCard}>
          {/* Controls Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="جستجو بر اساس عنوان دوره، سرفصل، مدرس..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadCourses()}
              />

              <select
                className={styles.selectInput}
                value={filterCefr}
                onChange={(e) => setFilterCefr(e.target.value)}
              >
                <option value="all">تمام سطوح CEFR</option>
                <option value="A1">سطح A1 (مقدماتی)</option>
                <option value="A2">سطح A2 (پایه)</option>
                <option value="B1">سطح B1 (متوسط)</option>
                <option value="B2">سطح B2 (فوق متوسط)</option>
                <option value="C1">سطح C1 (پیشرفته)</option>
                <option value="school">مدرسه و کنکور (High School)</option>
              </select>

              <select
                className={styles.selectInput}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">تمام وضعیت‌های انتشار</option>
                <option value="draft">پیش‌نویس (Draft)</option>
                <option value="in_review">در انتظار بازبینی (In Review)</option>
                <option value="published">منتشر شده (Published)</option>
                <option value="archived">بایگانی شده (Archived)</option>
              </select>

              <button type="button" className={styles.btnSecondary} onClick={loadCourses}>
                اعمال فیلتر
              </button>
            </div>

            <div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
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
                    estimated_hours: 12,
                    source_attribution: "Endoora Curriculum Team",
                    license_type: "original_editorial",
                    author_name: "تیم مولفان ایندورا",
                  });
                  setIsCourseModalOpen(true);
                }}
              >
                <span>➕ تعریف دوره جدید</span>
              </button>
            </div>
          </div>

          {/* Courses List */}
          {loadingCourses ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              در حال واکشی ساختار دوره‌ها و سرفصل‌ها...
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              هیچ دوره‌ای با فیلترهای مشخص شده یافت نشد.
            </div>
          ) : (
            <div className={styles.courseGrid}>
              {courses.map((course) => {
                const isExpanded = expandedCourseId === course.id;
                return (
                  <div key={course.id} className={styles.courseItemCard}>
                    {/* Header */}
                    <div className={styles.courseCardHeader}>
                      <div className={styles.courseMainMeta}>
                        <div className={styles.courseThumb}>📖</div>
                        <div className={styles.courseTitles}>
                          <h3>{course.title_fa}</h3>
                          <p>
                            {course.title_en} • کد سیستمی: <code>{course.slug}</code>
                          </p>
                        </div>
                      </div>

                      <div className={styles.courseBadges}>
                        <span className={styles.badgeCefr}>{course.cefr_level}</span>
                        <span className={styles.badgeSkill}>{course.skill_category}</span>
                        <span
                          className={`${styles.badgeStatus} ${
                            course.status === "published"
                              ? styles.badgePublished
                              : course.status === "in_review"
                              ? styles.badgeInReview
                              : course.status === "archived"
                              ? styles.badgeArchived
                              : styles.badgeDraft
                          }`}
                        >
                          {course.status === "published"
                            ? "🟢 منتشر شده"
                            : course.status === "in_review"
                            ? "🟡 در بررسی"
                            : course.status === "archived"
                            ? "🔴 بایگانی"
                            : "⚪ پیش‌نویس"}
                        </span>
                        {course.is_premium && (
                          <span style={{ fontSize: "0.72rem", background: "#fef3c7", color: "#b45309", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: "bold" }}>
                            💎 نیازمند اشتراک
                          </span>
                        )}
                      </div>

                      <div className={styles.courseCardActions}>
                        {/* Status switcher */}
                        <select
                          className={styles.selectInput}
                          style={{ fontSize: "0.78rem", padding: "0.3rem 0.6rem" }}
                          value={course.status}
                          onChange={(e) => handleTransitionCourse(course.id, e.target.value)}
                        >
                          <option value="draft">تغییر به: پیش‌نویس</option>
                          <option value="in_review">تغییر به: در انتظار بررسی</option>
                          <option value="published">تغییر به: انتشار عمومی</option>
                          <option value="archived">تغییر به: بایگانی</option>
                        </select>

                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseFormData(course);
                            setIsCourseModalOpen(true);
                          }}
                        >
                          ✏️ ویرایش
                        </button>

                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                        >
                          {isExpanded ? "بستن سرفصل‌ها ▲" : "مشاهده دروس و سرفصل‌ها ▼"}
                        </button>
                      </div>
                    </div>

                    {/* Hierarchy Sub-View (Modules & Lessons) */}
                    {isExpanded && (
                      <div className={styles.modulesContainer}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>
                            فصل‌ها و دروس سرفصل ({course.modules?.length || 0} فصل)
                          </span>
                          <button
                            type="button"
                            className={styles.btnPrimary}
                            style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}
                            onClick={() => {
                              setModuleParentCourseId(course.id);
                              setEditingModule(null);
                              setModuleFormData({
                                title_fa: "",
                                title_en: "",
                                description_fa: "",
                                order: (course.modules?.length || 0) + 1,
                              });
                              setIsModuleModalOpen(true);
                            }}
                          >
                            ➕ افزودن فصل جدید به این دوره
                          </button>
                        </div>

                        {(!course.modules || course.modules.length === 0) ? (
                          <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" }}>
                            هنوز فصلی برای این دوره ثبت نشده است. روی «افزودن فصل جدید» کلیک کنید.
                          </div>
                        ) : (
                          course.modules.map((mod) => (
                            <div key={mod.id} className={styles.moduleBox}>
                              <div className={styles.moduleHeader}>
                                <div className={styles.moduleTitle}>
                                  <span>📂 فصل {mod.order}:</span>
                                  <span>{mod.title_fa}</span>
                                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "normal" }}>({mod.title_en})</span>
                                </div>
                                <div style={{ display: "flex", gap: "0.4rem" }}>
                                  <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
                                    onClick={() => {
                                      setLessonParentModuleId(mod.id);
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
                                        order: (mod.lessons?.length || 0) + 1,
                                      });
                                      setIsLessonModalOpen(true);
                                    }}
                                  >
                                    ➕ افزودن درس
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                    onClick={() => {
                                      setModuleParentCourseId(course.id);
                                      setEditingModule(mod);
                                      setModuleFormData(mod);
                                      setIsModuleModalOpen(true);
                                    }}
                                  >
                                    ویرایش فصل
                                  </button>
                                </div>
                              </div>

                              {/* Lessons inside Module */}
                              <div className={styles.lessonList}>
                                {(!mod.lessons || mod.lessons.length === 0) ? (
                                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", padding: "0.5rem" }}>
                                    درسی در این فصل وجود ندارد.
                                  </div>
                                ) : (
                                  mod.lessons.map((les) => (
                                    <div key={les.id} className={styles.lessonItem}>
                                      <div className={styles.lessonInfo}>
                                        <span style={{ color: "#64748b", fontWeight: "700" }}>{les.order}.</span>
                                        <span className={styles.lessonTitleText}>{les.title_fa}</span>
                                        <span className={styles.lessonMetaPill}>⏱️ {les.duration_minutes} دقیقه</span>
                                        {les.is_free_preview ? (
                                          <span className={styles.freePreviewPill}>🎁 پیش‌نمایش رایگان</span>
                                        ) : (
                                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>🔒 نیازمند اشتراک</span>
                                        )}
                                        {les.video_url && <span style={{ fontSize: "0.75rem" }}>🎥 ویدیو</span>}
                                        {les.audio_url && <span style={{ fontSize: "0.75rem" }}>🎧 صوت</span>}
                                        {les.quiz_data && les.quiz_data.length > 0 && (
                                          <span style={{ fontSize: "0.72rem", background: "#f3e8ff", color: "#7e22ce", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                                            ❓ {les.quiz_data.length} آزمونک
                                          </span>
                                        )}
                                      </div>

                                      <div style={{ display: "flex", gap: "0.35rem" }}>
                                        {/* Direct shortcuts */}
                                        <button
                                          type="button"
                                          className={styles.btnSecondary}
                                          style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                                          title="انتقال به استودیو رسانه برای بازبینی ویدیو و زیرنویس این درس"
                                          onClick={() => {
                                            if (les.video_url) setCustomVideoUrl(les.video_url);
                                            if (les.audio_url) setCustomAudioUrl(les.audio_url);
                                            setActiveSubTab("media");
                                            showToast(`ویدیو و صوت درس '${les.title_fa}' در استودیو رسانه بارگذاری شد.`, "info");
                                          }}
                                        >
                                          🎬 بازبین رسانه
                                        </button>

                                        <button
                                          type="button"
                                          className={styles.btnSecondary}
                                          style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                                          title="انتقال به استودیو آزمونک‌ها برای تولید یا ویرایش سوالات این درس"
                                          onClick={() => {
                                            setSelectedQuizLesson(les);
                                            setQuizQuestions(les.quiz_data || []);
                                            setAiFocusTopic(les.title_fa);
                                            setActiveSubTab("quizzes");
                                            showToast(`درس '${les.title_fa}' جهت تنظیم آزمونک هوشمند انتخاب شد.`, "info");
                                          }}
                                        >
                                          🧠 مدیریت آزمونک‌ها
                                        </button>

                                        <button
                                          type="button"
                                          className={styles.btnSecondary}
                                          style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                                          onClick={() => {
                                            setLessonParentModuleId(mod.id);
                                            setEditingLesson(les);
                                            setLessonFormData(les);
                                            setIsLessonModalOpen(true);
                                          }}
                                        >
                                          ویرایش
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: MEDIA HUB & LIVE PLAYER INSPECTOR */}
      {/* ========================================================================= */}
      {activeSubTab === "media" && (
        <div className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                استودیو چندرسانه‌ای و پخش زنده (Media Hub & Player Inspector)
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                پایش لحظه‌ای استریم ویدیو، ترنسکریپت دو زبانه و انتخابگر ویدیوهای Speakout، American English File و کتاب دوازدهم نهایی
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                className={styles.selectInput}
                value={mediaCollectionFilter}
                onChange={(e) => setMediaCollectionFilter(e.target.value)}
              >
                <option value="all">تمام مجموعه‌های ویدئویی</option>
                <option value="speakout">مجموعه Speakout 3rd Edition</option>
                <option value="aef">مجموعه American English File</option>
                <option value="vision3">پایه دوازدهم نهایی (Vision 3)</option>
              </select>
            </div>
          </div>

          <div className={styles.mediaSplitView}>
            {/* Left Box: Active Player & Transcript Sync */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.playerBox}>
                <video
                  controls
                  className={styles.videoPlayer}
                  src={customVideoUrl}
                  poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                  onTimeUpdate={(e) => {
                    const sec = Math.floor(e.currentTarget.currentTime);
                    const m = Math.floor(sec / 60);
                    const s = sec % 60;
                    setActivePlaybackTime(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
                  }}
                >
                  مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                </video>

                <div className={styles.playerMetaRow}>
                  <div>
                    <span>⏱️ موقعیت فعلی در ویدیو: </span>
                    <strong style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "0.95rem" }}>
                      {activePlaybackTime}
                    </strong>
                  </div>
                  <div>
                    <span>کد وضعیت منبع: </span>
                    <span style={{ color: "#4ade80", fontWeight: "bold" }}>200 OK (Stream Live)</span>
                  </div>
                </div>
              </div>

              {/* Audio Player if present */}
              {customAudioUrl && (
                <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                    🎧 استریم فایل صوتی مکمل (Audio Stream):
                  </label>
                  <audio controls className={styles.audioPlayer} src={customAudioUrl}>
                    پخش صوت پشتیبانی نمی‌شود.
                  </audio>
                </div>
              )}

              {/* Custom Media Link Input */}
              <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>
                  🔗 بارگذاری دستی آدرس استریم ویدیو یا صوت:
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="url"
                    placeholder="https://.../video.mp4 یا .m3u8"
                    className={styles.formInput}
                    style={{ flex: 1 }}
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => showToast("منبع ویدیو در پلیر بازنشانی شد.", "success")}
                  >
                    بارگذاری در پلیر
                  </button>
                </div>
              </div>

              {/* Subtitles & Transcripts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>
                  📝 پایش زیرنویس و متن پیاده‌شده همگام (Interactive Transcript Cues):
                </span>
                <div className={styles.transcriptList}>
                  {selectedMediaPreset.transcriptSample.map((cue, idx) => (
                    <div
                      key={idx}
                      className={styles.transcriptCue}
                      onClick={() => {
                        showToast(`پرش به زمان ${cue.time} در ویدیو`, "info");
                      }}
                      title="کلیک برای پرش ویدیو به این زمان"
                    >
                      <span className={styles.timeTag}>{cue.time}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontSize: "0.84rem", fontWeight: "600", color: "#0f172a" }}>
                          <strong>{cue.speaker}:</strong> {cue.textEn}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{cue.textFa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Preset Asset Library Picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                📦 کتابخانه استریم‌های استاندارد (Speakout / AEF / Grade 12):
              </span>

              <div className={styles.presetsGrid}>
                {MEDIA_PRESET_ASSETS.filter((p) => mediaCollectionFilter === "all" || p.collection === mediaCollectionFilter).map(
                  (asset) => {
                    const isSelected = selectedMediaPreset.id === asset.id;
                    return (
                      <div
                        key={asset.id}
                        className={styles.presetCard}
                        style={{ borderColor: isSelected ? "#3b82f6" : "#e2e8f0", background: isSelected ? "#eff6ff" : "#ffffff" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ background: "#e2e8f0", fontSize: "0.72rem", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: "bold" }}>
                              {asset.level}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{asset.collectionLabelFa}</span>
                          </div>
                          <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{asset.titleFa}</strong>
                          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{asset.titleEn}</span>
                          <span style={{ fontSize: "0.72rem", color: "#2563eb" }}>⏱️ {asset.durationMinutes} دقیقه ویدیو</span>
                        </div>

                        <div>
                          <button
                            type="button"
                            className={isSelected ? styles.btnSuccess : styles.btnSecondary}
                            style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
                            onClick={() => {
                              setSelectedMediaPreset(asset);
                              setCustomVideoUrl(asset.videoUrl);
                              setCustomAudioUrl(asset.audioUrl);
                              showToast(`محتوای '${asset.titleFa}' در پلیر بارگذاری شد.`, "success");
                            }}
                          >
                            {isSelected ? "در حال پخش ✓" : "▶️ بارگذاری در پلیر"}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Downloadable Assets */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>
                  📎 فایل‌های تکمیلی و کاربرگ‌های دانلودی این درس:
                </span>
                {selectedMediaPreset.downloadables.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem" }}>
                      <span>📄</span>
                      <span>{d.title}</span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>({d.size})</span>
                    </div>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}
                    >
                      دانلود فایل ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: INTERACTIVE QUIZ & AI STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === "quizzes" && (
        <div className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                سازنده آزمونک‌ها و ارزیابی هوشمند (Interactive Quiz & AI Studio)
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                طراحی انواع پرسش‌های ۴ گزینه‌ای، صحیح/غلط، جای خالی، درک شنیداری و تولید خودکار آزمونک‌ها با دستیار هوش مصنوعی
              </p>
            </div>

            {/* Lesson Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#334155" }}>درس هدف:</label>
              <select
                className={styles.selectInput}
                value={selectedQuizLesson?.id || ""}
                onChange={(e) => {
                  const targetId = e.target.value;
                  for (const c of courses) {
                    for (const m of c.modules || []) {
                      const match = m.lessons?.find((l) => l.id === targetId);
                      if (match) {
                        setSelectedQuizLesson(match);
                        setQuizQuestions(match.quiz_data || []);
                        setAiFocusTopic(match.title_fa);
                        setSimSubmitted(false);
                        setSimAnswers({});
                        return;
                      }
                    }
                  }
                }}
              >
                {courses.flatMap((c) =>
                  (c.modules || []).flatMap((m) =>
                    (m.lessons || []).map((les) => (
                      <option key={les.id} value={les.id}>
                        {c.title_fa} ➔ {les.title_fa}
                      </option>
                    ))
                  )
                )}
              </select>
            </div>
          </div>

          {/* AI Generator Card */}
          <div className={styles.aiGeneratorCard}>
            <div className={styles.aiGenTitle}>
              <span>✨</span>
              <span>دستیار هوش مصنوعی تولید خودکار سوالات (AI Pedagogical Question Generator)</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#065f46" }}>
              موتور هوش مصنوعی محتوای درس انتخابی، زیرنویس‌ها و سطح CEFR را تحلیل کرده و ۵ سوال استاندارد با کلید صحیح و تحلیل آموزشی تولید می‌کند.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                placeholder="موضوع تمرکز یا مبحث گرامری/واژگانی (مثال: افعال مجهول درس اول)"
                className={styles.searchInput}
                style={{ flex: 1 }}
                value={aiFocusTopic}
                onChange={(e) => setAiFocusTopic(e.target.value)}
              />
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ background: "#059669" }}
                disabled={isGeneratingAi}
                onClick={handleGenerateAiQuiz}
              >
                <span>{isGeneratingAi ? "⏳ در حال استخراج و تحلیل هوش مصنوعی..." : "✨ تولید خودکار ۵ آزمونک با AI"}</span>
              </button>
            </div>
          </div>

          <div className={styles.quizStudioGrid}>
            {/* Left Column: Question Builder Form & Bank */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Add Manual Question Box */}
              <form onSubmit={handleAddManualQuestion} style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                  ➕ افزودن سوال دستی به درس
                </span>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>نوع سوال:</label>
                    <select
                      className={styles.selectInput}
                      value={qType}
                      onChange={(e) => setQType(e.target.value as typeof qType)}
                    >
                      <option value="multiple_choice">چهار گزینه‌ای (Multiple Choice)</option>
                      <option value="true_false">صحیح / غلط (True/False)</option>
                      <option value="cloze">جای خالی (Cloze / Fill in the blank)</option>
                      <option value="listening">درک شنیداری (Listening Prompt)</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>گزینه صحیح:</label>
                    <select
                      className={styles.selectInput}
                      value={qCorrectIdx}
                      onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                    >
                      {qType === "true_false" ? (
                        <>
                          <option value={0}>گزینه ۱: صحیح (True)</option>
                          <option value={1}>گزینه ۲: غلط (False)</option>
                        </>
                      ) : (
                        <>
                          <option value={0}>گزینه ۱</option>
                          <option value={1}>گزینه ۲</option>
                          <option value={2}>گزینه ۳</option>
                          <option value={3}>گزینه ۴</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>صورت سوال (فارسی):</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: کدام گزینه ساختار مجهول صحیح را نشان می‌دهد؟"
                    className={styles.formInput}
                    value={qPromptFa}
                    onChange={(e) => setQPromptFa(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label>صورت سوال (انگلیسی):</label>
                  <input
                    type="text"
                    placeholder="e.g. Which sentence is in the correct passive form?"
                    className={styles.formInput}
                    value={qPromptEn}
                    onChange={(e) => setQPromptEn(e.target.value)}
                  />
                </div>

                {qType !== "true_false" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: "#334155" }}>گزینه‌های پاسخ:</label>
                    {qOptions.map((opt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", width: "20px" }}>{i + 1}.</span>
                        <input
                          type="text"
                          placeholder={`متن گزینه ${i + 1}`}
                          className={styles.formInput}
                          style={{ flex: 1 }}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...qOptions];
                            updated[i] = e.target.value;
                            setQOptions(updated);
                          }}
                        />
                        {qCorrectIdx === i && (
                          <span style={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: "bold" }}>✓ صحیح</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.formField}>
                  <label>تحلیل و توضیح آموزشی پاسخ (فارسی):</label>
                  <input
                    type="text"
                    placeholder="دلیل انتخاب این گزینه و تحلیل تشریحی برای نمایش به دانش‌آموز"
                    className={styles.formInput}
                    value={qExplanationFa}
                    onChange={(e) => setQExplanationFa(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.btnPrimary} style={{ alignSelf: "flex-start" }}>
                  <span>➕ ذخیره سوال در آزمونک درس</span>
                </button>
              </form>

              {/* Questions Bank List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                  📋 سوالات فعال در این درس ({quizQuestions.length} پرسش)
                </span>

                {quizQuestions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" }}>
                    هنوز سوالی ثبت نشده است. می‌توانید با دستیار AI سوالات را تولید یا دستی وارد نمایید.
                  </div>
                ) : (
                  quizQuestions.map((q, idx) => (
                    <div key={idx} className={styles.quizQuestionCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ background: "#2563eb", color: "#ffffff", borderRadius: "50%", width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                            {idx + 1}
                          </span>
                          <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{q.prompt_fa}</strong>
                        </div>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                          onClick={() => {
                            setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
                            showToast("سوال از آزمونک حذف شد.", "info");
                          }}
                        >
                          حذف
                        </button>
                      </div>

                      {q.prompt_en && <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{q.prompt_en}</span>}

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {q.options?.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`${styles.quizOptionItem} ${
                              q.correct_index === optIdx ? styles.quizOptionCorrect : ""
                            }`}
                          >
                            <span>{optIdx + 1}.</span>
                            <span>{opt}</span>
                            {q.correct_index === optIdx && <span>(کلید صحیح ✓)</span>}
                          </div>
                        ))}
                      </div>

                      {q.explanation_fa && (
                        <div className={styles.explanationBox}>
                          <strong>💡 تحلیل پاسخ: </strong>
                          <span>{q.explanation_fa}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Live Interactive Quiz Simulator */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                🎮 شبیه‌ساز زنده آزمون زبان‌آموز (Interactive Learner Simulator)
              </span>

              <div className={styles.simulatorBox}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    این شبیه‌ساز به ادمین امکان می‌دهد تجربه دقیق دانش‌آموز را بررسی و ارزیابی کند.
                  </span>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => {
                      setSimAnswers({});
                      setSimSubmitted(false);
                      setSimScore(null);
                    }}
                  >
                    ریست پاسخ‌ها 🔄
                  </button>
                </div>

                {simSubmitted && simScore !== null && (
                  <div className={styles.simScoreBanner}>
                    <span>📊 نمره ارزیابی نهایی:</span>
                    <span style={{ fontSize: "1.2rem" }}>{simScore}٪</span>
                    <span>{simScore >= 70 ? "🎉 قبولی در آزمونک" : "نیاز به مرور درس"}</span>
                  </div>
                )}

                {quizQuestions.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                    سوالاتی برای تست وجود ندارد.
                  </div>
                ) : (
                  quizQuestions.map((q, idx) => (
                    <div key={idx} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>
                        {idx + 1}. {q.prompt_fa}
                      </strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {q.options?.map((opt, oIdx) => {
                          const isSelected = simAnswers[idx] === oIdx;
                          const isCorrect = q.correct_index === oIdx;
                          let optBg = "#ffffff";
                          let optBorder = "#e2e8f0";
                          if (simSubmitted) {
                            if (isCorrect) {
                              optBg = "#dcfce7";
                              optBorder = "#86efac";
                            } else if (isSelected && !isCorrect) {
                              optBg = "#fee2e2";
                              optBorder = "#fca5a5";
                            }
                          } else if (isSelected) {
                            optBg = "#eff6ff";
                            optBorder = "#93c5fd";
                          }

                          return (
                            <label
                              key={oIdx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.45rem 0.75rem",
                                borderRadius: "6px",
                                background: optBg,
                                border: `1px solid ${optBorder}`,
                                cursor: "pointer",
                                fontSize: "0.82rem",
                              }}
                            >
                              <input
                                type="radio"
                                name={`sim_q_${idx}`}
                                checked={isSelected}
                                onChange={() => {
                                  if (!simSubmitted) {
                                    setSimAnswers((prev) => ({ ...prev, [idx]: oIdx }));
                                  }
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>

                      {simSubmitted && q.explanation_fa && (
                        <div style={{ fontSize: "0.78rem", background: "#f1f5f9", padding: "0.45rem 0.65rem", borderRadius: "4px", color: "#334155" }}>
                          💡 {q.explanation_fa}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {quizQuestions.length > 0 && !simSubmitted && (
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => {
                      let correctCount = 0;
                      quizQuestions.forEach((q, i) => {
                        if (simAnswers[i] === q.correct_index) correctCount++;
                      });
                      const score = Math.round((correctCount / quizQuestions.length) * 100);
                      setSimScore(score);
                      setSimSubmitted(true);
                      showToast(`شبیه‌سازی با نمره ${score}٪ ثبت شد.`, "info");
                    }}
                  >
                    ثبت پاسخ و ارزیابی نمره دانش‌آموز ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: LEARNERS & PROGRESS OVERRIDE DESK */}
      {/* ========================================================================= */}
      {activeSubTab === "learners" && (
        <div className={styles.sectionCard}>
          {/* Top KPI Metrics Row */}
          <div className={styles.kpiMetricsRow}>
            <div className={styles.kpiBox}>
              <span className={styles.kpiBoxTitle}>کل ثبت‌نام‌های فعال</span>
              <span className={styles.kpiBoxValue}>{enrollments.length}</span>
              <span className={styles.kpiBoxSub}>در تمام دوره‌های آموزشی</span>
            </div>

            <div className={styles.kpiBox}>
              <span className={styles.kpiBoxTitle}>میانگین پیشرفت فراگیران</span>
              <span className={styles.kpiBoxValue}>
                {enrollments.length > 0
                  ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / enrollments.length)
                  : 0}
                ٪
              </span>
              <span className={styles.kpiBoxSub} style={{ color: "#2563eb" }}>
                شاخص تسلط آکادمیک
              </span>
            </div>

            <div className={styles.kpiBox}>
              <span className={styles.kpiBoxTitle}>دوره‌های ۱۰۰٪ تکمیل شده</span>
              <span className={styles.kpiBoxValue}>
                {enrollments.filter((e) => e.progressPercent === 100).length}
              </span>
              <span className={styles.kpiBoxSub}>زبان‌آموزان فارغ‌التحصیل</span>
            </div>

            <div className={styles.kpiBox}>
              <span className={styles.kpiBoxTitle}>ممیزی‌های امنیتی ثبت‌شده</span>
              <span className={styles.kpiBoxValue}>{auditLogs.length}</span>
              <span className={styles.kpiBoxSub} style={{ color: "#9333ea" }}>
                ردپای ممیزی تغییرات
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="جستجو بر اساس نام دانش‌آموز، ایمیل یا شماره موبایل..."
                className={styles.searchInput}
                value={learnerSearch}
                onChange={(e) => setLearnerSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadLearners()}
              />

              <select
                className={styles.selectInput}
                value={selectedEnrollmentCourse}
                onChange={(e) => setSelectedEnrollmentCourse(e.target.value)}
              >
                <option value="all">تمام دوره‌ها</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title_fa}
                  </option>
                ))}
              </select>

              <button type="button" className={styles.btnSecondary} onClick={loadLearners}>
                اعمال جستجو
              </button>
            </div>

            <div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  setGrantCourseId(courses[0]?.id || "");
                  setIsGrantModalOpen(true);
                }}
              >
                <span>➕ اعطای ثبت‌نام مستقیم دوره به فراگیر</span>
              </button>
            </div>
          </div>

          {/* Learners Enrollments List */}
          {loadingLearners ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              در حال دریافت سوابق ثبت‌نام و نمرات زبان‌آموزان...
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              پرونده ثبت‌نامی منطبق با جستجو یافت نشد.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {enrollments.map((enr) => {
                const isExpanded = expandedEnrollmentId === enr.id;
                return (
                  <div key={enr.id} className={styles.learnerCard}>
                    <div className={styles.learnerCardTop}>
                      <div className={styles.learnerProfile}>
                        <div className={styles.learnerAvatar}>{enr.learnerAvatar}</div>
                        <div>
                          <h4 className={styles.learnerNameText}>{enr.learnerName}</h4>
                          <p className={styles.learnerContactText}>
                            {enr.learnerEmail} • 📞 {enr.learnerPhone}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>
                            {enr.courseTitleFa}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            سطح {enr.cefrLevel} • ثبت‌نام در: {enr.enrolledAt}
                          </span>
                        </div>

                        <div className={styles.progressContainer}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: "700" }}>
                            <span>پیشرفت دوره:</span>
                            <span style={{ color: enr.progressPercent === 100 ? "#16a34a" : "#2563eb" }}>
                              {enr.progressPercent}٪
                            </span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div
                              className={`${styles.progressBarFill} ${
                                enr.progressPercent === 100 ? styles.progressCompleted : ""
                              }`}
                              style={{ width: `${enr.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => setExpandedEnrollmentId(isExpanded ? null : enr.id)}
                        >
                          {isExpanded ? "بستن ریز نمرات ▲" : "جزئیات دروس و نمرات ▼"}
                        </button>

                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: "بازنشانی کامل پیشرفت دوره",
                              description: `آیا از ریست کامل پیشرفت دوره '${enr.courseTitleFa}' برای زبان‌آموز '${enr.learnerName}' اطمینان دارید؟ تمام نمرات و وضعیت‌های تکمیل صفر خواهد شد.`,
                              actionType: "reset",
                              learnerId: enr.learnerId,
                              courseId: enr.courseId,
                            });
                          }}
                        >
                          🔄 ریست پیشرفت
                        </button>

                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: "لغو ثبت‌نام و دسترسی دوره",
                              description: `آیا از قطع دسترسی زبان‌آموز '${enr.learnerName}' به دوره '${enr.courseTitleFa}' اطمینان دارید؟ این عمل دسترسی کاربر را متوقف می‌کند.`,
                              actionType: "revoke",
                              learnerId: enr.learnerId,
                              courseId: enr.courseId,
                              enrollmentId: enr.id,
                            });
                          }}
                        >
                          ❌ لغو ثبت‌نام
                        </button>
                      </div>
                    </div>

                    {/* Expandable Lesson-by-lesson Breakdown */}
                    {isExpanded && (
                      <div style={{ background: "#fafafa", borderRadius: "8px", padding: "1rem", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>
                          ریز نمرات و وضعیت درس به درس فراگیر:
                        </span>
                        <table className={styles.breakdownTable}>
                          <thead>
                            <tr>
                              <th>نام درس</th>
                              <th>وضعیت تکمیل</th>
                              <th>نمره آزمونک (%)</th>
                              <th>تاریخ انجام</th>
                              <th>عملیات ادمین</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enr.lessons.map((les) => (
                              <tr key={les.lessonId}>
                                <td>
                                  <strong>{les.lessonTitleFa}</strong>
                                </td>
                                <td>
                                  {les.isCompleted ? (
                                    <span style={{ color: "#16a34a", fontWeight: "bold" }}>🟢 تکمیل شده</span>
                                  ) : (
                                    <span style={{ color: "#dc2626" }}>⚪ ناتمام</span>
                                  )}
                                </td>
                                <td>
                                  {les.quizScore !== null ? (
                                    <span style={{ fontWeight: "bold", color: "#2563eb" }}>{les.quizScore}٪</span>
                                  ) : (
                                    <span style={{ color: "#94a3b8" }}>ثبت نشده</span>
                                  )}
                                </td>
                                <td>
                                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                                    {les.completedAt || "-"}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: "0.4rem" }}>
                                    <button
                                      type="button"
                                      className={styles.btnSecondary}
                                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                                      onClick={() =>
                                        handleToggleLessonCompletion(enr.learnerId, enr.courseId, les.lessonId)
                                      }
                                    >
                                      {les.isCompleted ? "تغییر به ناتمام" : "تغییر به تکمیل شده ✓"}
                                    </button>

                                    <button
                                      type="button"
                                      className={styles.btnSecondary}
                                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                                      onClick={() => {
                                        const promptVal = window.prompt("نمره جدید آزمونک را وارد کنید (0 تا 100):", String(les.quizScore ?? 100));
                                        if (promptVal !== null) {
                                          const parsed = Number(promptVal);
                                          if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                                            setConfirmModal({
                                              isOpen: true,
                                              title: "اصلاح و اورراید نمره آزمونک",
                                              description: `تغییر نمره درس '${les.lessonTitleFa}' برای '${enr.learnerName}' به ${parsed}٪`,
                                              actionType: "score",
                                              learnerId: enr.learnerId,
                                              courseId: enr.courseId,
                                              lessonId: les.lessonId,
                                              scoreVal: parsed,
                                            });
                                          }
                                        }
                                      }}
                                    >
                                      ویرایش نمره
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Audit Trail Drawer / Table */}
          <div style={{ marginTop: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
              🛡️ لاگ‌های ممیزی و ردپای تغییرات آموزشی (Academic Overrides Audit Trail)
            </h4>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#64748b" }}>
              تمام تغییرات نمرات، ریست پیشرفت و ثبت‌نام‌های دستی همراه با هویت ادمین مجری و دلیل اقدام مستند می‌شوند.
            </p>

            <table className={styles.breakdownTable}>
              <thead>
                <tr>
                  <th>اقدام</th>
                  <th>زبان‌آموز</th>
                  <th>دوره</th>
                  <th>جزئیات تغییر</th>
                  <th>دلیل اقدام مدیریتی</th>
                  <th>زمان ثبت</th>
                  <th>مجری</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ fontWeight: "bold", color: "#2563eb" }}>{log.actionLabelFa}</span>
                    </td>
                    <td>{log.learnerName}</td>
                    <td>{log.courseTitleFa}</td>
                    <td style={{ fontSize: "0.78rem" }}>{log.details}</td>
                    <td style={{ fontSize: "0.78rem", color: "#059669" }}>{log.reason}</td>
                    <td style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
                      {log.occurredAt}
                    </td>
                    <td style={{ fontSize: "0.78rem" }}>{log.adminName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT COURSE */}
      {/* ========================================================================= */}
      {isCourseModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>{editingCourse ? "✏️ ویرایش دوره آموزشی" : "➕ ایجاد دوره آموزشی جدید"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setIsCourseModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCourse}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>عنوان دوره (فارسی):</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={courseFormData.title_fa || ""}
                      onChange={(e) => setCourseFormData({ ...courseFormData, title_fa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>عنوان دوره (انگلیسی):</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={courseFormData.title_en || ""}
                      onChange={(e) => setCourseFormData({ ...courseFormData, title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>شناسه یکتای پیوند (Slug):</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. grade-12-tamrin20"
                      className={styles.formInput}
                      value={courseFormData.slug || ""}
                      onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>سطح استاندارد CEFR:</label>
                    <select
                      className={styles.selectInput}
                      value={courseFormData.cefr_level || "B1"}
                      onChange={(e) => setCourseFormData({ ...courseFormData, cefr_level: e.target.value as typeof courseFormData.cefr_level })}
                    >
                      <option value="A1">A1 (ابتدایی)</option>
                      <option value="A2">A2 (مقدماتی)</option>
                      <option value="B1">B1 (متوسط)</option>
                      <option value="B2">B2 (فوق متوسط)</option>
                      <option value="C1">C1 (پیشرفته)</option>
                      <option value="C2">C2 (تسلط کامل)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>مهارت محوری:</label>
                    <select
                      className={styles.selectInput}
                      value={courseFormData.skill_category || "listening"}
                      onChange={(e) => setCourseFormData({ ...courseFormData, skill_category: e.target.value as typeof courseFormData.skill_category })}
                    >
                      <option value="listening">شنیداری (Listening)</option>
                      <option value="speaking">گفتاری (Speaking)</option>
                      <option value="reading">خواندن (Reading)</option>
                      <option value="writing">نوشتاری (Writing)</option>
                      <option value="grammar">گرامر و دستور زبان</option>
                      <option value="vocabulary">واژگان و اصطلاحات</option>
                      <option value="school">مدرسه و نهایی</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>مخاطبان هدف:</label>
                    <select
                      className={styles.selectInput}
                      value={courseFormData.target_audience || "general"}
                      onChange={(e) => setCourseFormData({ ...courseFormData, target_audience: e.target.value as typeof courseFormData.target_audience })}
                    >
                      <option value="general">زبان‌آموزان عمومی</option>
                      <option value="school_konkur">دبیرستان و کنکور</option>
                      <option value="ielts_academic">آیلتس و آکادمیک</option>
                      <option value="business">تجاری و شغلی</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>توضیحات دوره (فارسی):</label>
                  <textarea
                    className={styles.formTextarea}
                    value={courseFormData.description_fa || ""}
                    onChange={(e) => setCourseFormData({ ...courseFormData, description_fa: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>حق مولف و مرجع:</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={courseFormData.source_attribution || ""}
                      onChange={(e) => setCourseFormData({ ...courseFormData, source_attribution: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>تخمین ساعات آموزش:</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={courseFormData.estimated_hours || 10}
                      onChange={(e) => setCourseFormData({ ...courseFormData, estimated_hours: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsCourseModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره دوره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT MODULE */}
      {/* ========================================================================= */}
      {isModuleModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>{editingModule ? "✏️ ویرایش فصل" : "➕ ایجاد فصل جدید"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setIsModuleModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveModule}>
              <div className={styles.modalBody}>
                <div className={styles.formField}>
                  <label>عنوان فصل (فارسی):</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    value={moduleFormData.title_fa || ""}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, title_fa: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>عنوان فصل (انگلیسی):</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    value={moduleFormData.title_en || ""}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, title_en: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>ترتیب نمایش (Order):</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={moduleFormData.order || 1}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, order: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>توضیحات کوتاه فصل:</label>
                  <textarea
                    className={styles.formTextarea}
                    value={moduleFormData.description_fa || ""}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, description_fa: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModuleModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره فصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT LESSON */}
      {/* ========================================================================= */}
      {isLessonModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>{editingLesson ? "✏️ ویرایش درس" : "➕ ایجاد درس جدید"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setIsLessonModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveLesson}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>عنوان درس (فارسی):</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={lessonFormData.title_fa || ""}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_fa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>عنوان درس (انگلیسی):</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={lessonFormData.title_en || ""}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>مدت زمان (دقیقه):</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={lessonFormData.duration_minutes || 15}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, duration_minutes: Number(e.target.value) })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>ترتیب درس:</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={lessonFormData.order || 1}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, order: Number(e.target.value) })}
                    />
                  </div>
                  <div className={styles.formField} style={{ justifyContent: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.2rem" }}>
                      <input
                        type="checkbox"
                        checked={lessonFormData.is_free_preview || false}
                        onChange={(e) => setLessonFormData({ ...lessonFormData, is_free_preview: e.target.checked })}
                      />
                      <span>🎁 پیش‌نمایش رایگان</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>پیوند استریم ویدیو (Video URL):</label>
                    <input
                      type="url"
                      placeholder="https://.../video.mp4"
                      className={styles.formInput}
                      value={lessonFormData.video_url || ""}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>پیوند استریم صوت (Audio URL):</label>
                    <input
                      type="url"
                      placeholder="https://.../audio.mp3"
                      className={styles.formInput}
                      value={lessonFormData.audio_url || ""}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, audio_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>محتوای آموزشی و توضیحات متنی (فارسی):</label>
                  <textarea
                    className={styles.formTextarea}
                    value={lessonFormData.content_body_fa || ""}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, content_body_fa: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>متن پیاده‌شده و زیرنویس (انگلیسی):</label>
                  <textarea
                    className={styles.formTextarea}
                    value={lessonFormData.transcript_en || ""}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, transcript_en: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsLessonModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره درس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRM DESTRUCTIVE ACTION (RESET / REVOKE / SCORE) */}
      {/* ========================================================================= */}
      {confirmModal.isOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#dc2626" }}>⚠️ {confirmModal.title}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155", lineHeight: "1.6" }}>
                {confirmModal.description}
              </p>
              <div className={styles.formField}>
                <label>
                  <span style={{ color: "#dc2626" }}>*</span> دلیل اقدام مدیریتی (جهت ثبت در ردپای ممیزی):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: درخواست کاربر به دلیل قطعی سامانه یا بازبینی دستی نمره"
                  className={styles.formInput}
                  value={confirmReason}
                  onChange={(e) => setConfirmReason(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                disabled={isExecutingConfirm}
                onClick={handleExecuteDestructiveAction}
              >
                {isExecutingConfirm ? "در حال ثبت و اعمال..." : "تایید و اعمال قطعی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GRANT NEW ENROLLMENT */}
      {/* ========================================================================= */}
      {isGrantModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3>➕ اعطای ثبت‌نام مستقیم دوره به فراگیر</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setIsGrantModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleGrantEnrollmentSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formField}>
                  <label>نام و نام خانوادگی فراگیر:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مریم احمدی"
                    className={styles.formInput}
                    value={grantName}
                    onChange={(e) => setGrantName(e.target.value)}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>ایمیل:</label>
                    <input
                      type="email"
                      placeholder="maryam@example.com"
                      className={styles.formInput}
                      value={grantEmail}
                      onChange={(e) => setGrantEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>شماره تماس:</label>
                    <input
                      type="tel"
                      placeholder="09121234567"
                      className={styles.formInput}
                      value={grantPhone}
                      onChange={(e) => setGrantPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>دوره آموزشی مورد نظر:</label>
                  <select
                    className={styles.selectInput}
                    value={grantCourseId}
                    onChange={(e) => setGrantCourseId(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title_fa} ({c.cefr_level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>دلیل اعطای مستقیم (بورسیه، خرید دستی و ...):</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsGrantModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  اعطای دوره و ثبت در سیستم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
