"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../assignments.module.css";
import {
  AssignmentDetail,
  browseQuestionBank,
  configureAssignmentDelivery,
  createAssignmentDraft,
  publishAssignment,
  QuestionBankItem,
  setAssignmentAccommodation,
  setAssignmentQuestions,
  updateAssignmentDraft,
} from "@/lib/teacher-assignments";
import { fetchTeacherClasses, fetchTeacherClassDetail, TeacherClass } from "@/lib/teacher-classes";

type WizardStep = 1 | 2 | 3 | 4;

export default function CreateAssignmentWizardPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<AssignmentDetail | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingLater, setSavingLater] = useState(false);

  // Step 1: Classes
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [targetCefr, setTargetCefr] = useState<string>("B1");

  // Step 2: Question Bank Curation
  const [bankQuery, setBankQuery] = useState<string>("");
  const [bankCefr, setBankCefr] = useState<string>("");
  const [bankType, setBankType] = useState<string>("");
  const [bankQuestions, setBankQuestions] = useState<QuestionBankItem[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<{
    question_version_id: string;
    slug: string;
    title: string;
    prompt: string;
    type: string;
    points: number;
    custom_instructions: string;
  }[]>([]);

  // Step 3: Delivery & Accommodations
  const [dueDate, setDueDate] = useState<string>("");
  const [gracePeriod, setGracePeriod] = useState<number>(0);
  const [allowLate, setAllowLate] = useState<boolean>(false);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<string>("");
  const [passingPercentage, setPassingPercentage] = useState<number>(60);

  // Accommodations state
  const [enrolledLearners, setEnrolledLearners] = useState<{ id: string; email: string; name: string }[]>([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>("");
  const [extraTime, setExtraTime] = useState<number>(0);
  const [extraAttempts, setExtraAttempts] = useState<number>(0);
  const [extendedDueDate, setExtendedDueDate] = useState<string>("");
  const [accommodationNotes, setAccommodationNotes] = useState<string>("");
  const [accommodationsList, setAccommodationsList] = useState<{
    learner_id: string;
    learner_name: string;
    extra_time_minutes: number;
    extra_attempts: number;
    extended_due_date: string | null;
    notes: string;
  }[]>([]);

  // Load teacher classes on mount
  useEffect(() => {
    let cancelled = false;

    async function loadClasses() {
      setLoading(true);
      try {
        const clsList = await fetchTeacherClasses();
        if (!cancelled) {
          const activeClasses = clsList.filter((c) => c.status === "active");
          setClasses(activeClasses);
          if (activeClasses.length > 0) {
            setSelectedClassId(activeClasses[0].id);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در دریافت لیست کلاس‌ها.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, []);

  // Browse Question Bank when entering Step 2 or changing filters
  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;

    async function searchBank() {
      try {
        const items = await browseQuestionBank({
          q: bankQuery || undefined,
          cefr: bankCefr || undefined,
          type: bankType || undefined,
        });
        if (!cancelled) {
          setBankQuestions(items);
        }
      } catch {
        // fail silently for search suggestions
      }
    }

    const timer = setTimeout(searchBank, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, bankQuery, bankCefr, bankType]);

  // Load enrolled students when class is selected
  useEffect(() => {
    if (!selectedClassId) return;
    let cancelled = false;

    async function loadEnrolled() {
      try {
        const detail = await fetchTeacherClassDetail(selectedClassId);
        if (!cancelled && detail && detail.enrollments) {
          setEnrolledLearners(
            detail.enrollments
              .filter((e) => e.status === "active")
              .map((e) => ({
                id: e.learner,
                email: e.learner_email,
                name: e.learner_email.split("@")[0],
              }))
          );
        }
      } catch {
        // fail silently for student options
      }
    }

    loadEnrolled();

    return () => {
      cancelled = true;
    };
  }, [selectedClassId]);

  // Handler: Save and Continue Later
  const handleSaveAndContinueLater = async () => {
    setSavingLater(true);
    try {
      if (!draft && selectedClassId && title) {
        await createAssignmentDraft({
          class_id: selectedClassId,
          title,
          description,
          instructions,
          target_cefr: targetCefr,
        });
      } else if (draft) {
        await updateAssignmentDraft(draft.id, {
          title,
          description,
          instructions,
          target_cefr: targetCefr,
          expected_version: draft.version,
        });
      }
      router.push("/teacher/assignments");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره پیش‌نویس.");
      setSavingLater(false);
    }
  };

  // Step 1 Submission -> Step 2
  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      setError("لطفاً یک کلاس را انتخاب کنید.");
      return;
    }
    if (!title.trim()) {
      setError("عنوان تکلیف الزامی است.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let currentDraft = draft;
      if (!currentDraft) {
        currentDraft = await createAssignmentDraft({
          class_id: selectedClassId,
          title: title.trim(),
          description,
          instructions,
          target_cefr: targetCefr,
        });
      } else {
        currentDraft = await updateAssignmentDraft(currentDraft.id, {
          title: title.trim(),
          description,
          instructions,
          target_cefr: targetCefr,
          expected_version: currentDraft.version,
        });
      }
      setDraft(currentDraft);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره مرحله اول.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Submission -> Step 3
  const handleStep2Next = async () => {
    if (selectedQuestions.length === 0) {
      setError("حداقل یک سوال از بانک سوالات انتخاب کنید.");
      return;
    }
    if (!draft) return;

    setLoading(true);
    setError(null);
    try {
      const updated = await setAssignmentQuestions(draft.id, {
        questions: selectedQuestions.map((q) => ({
          question_version_id: q.question_version_id,
          points: q.points,
          custom_instructions: q.custom_instructions,
        })),
        expected_version: draft.version,
      });
      setDraft(updated);
      setStep(3);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در اتصال سوالات.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Submission -> Step 4
  const handleStep3Next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) {
      setError("تعیین مهلت تحویل (ددلاین) الزامی است.");
      return;
    }
    if (!draft) return;

    setLoading(true);
    setError(null);
    try {
      const updated = await configureAssignmentDelivery(draft.id, {
        due_date: new Date(dueDate).toISOString(),
        grace_period_minutes: Number(gracePeriod) || 0,
        allow_late_submission: allowLate,
        max_attempts: Number(maxAttempts) || 1,
        time_limit_minutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
        passing_percentage: Number(passingPercentage) || 60,
        expected_version: draft.version,
      });
      setDraft(updated);
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره تنظیمات تحویل.");
    } finally {
      setLoading(false);
    }
  };

  // Add question from bank
  const handleAddQuestion = (q: QuestionBankItem) => {
    if (selectedQuestions.some((item) => item.question_version_id === q.id)) return;
    setSelectedQuestions((prev) => [
      ...prev,
      {
        question_version_id: q.id,
        slug: q.slug,
        title: q.title_fa || q.title_en || q.slug,
        prompt: q.prompt_fa || q.prompt_en,
        type: q.question_type,
        points: 10,
        custom_instructions: "",
      },
    ]);
  };

  const handleRemoveQuestion = (versionId: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.question_version_id !== versionId));
  };

  const handleUpdatePoints = (versionId: string, pts: number) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.question_version_id === versionId ? { ...q, points: pts } : q))
    );
  };

  // Add individual accommodation in Step 3
  const handleAddAccommodation = async () => {
    if (!selectedLearnerId || !draft) {
      setError("لطفاً ابتدا زبان‌آموز را انتخاب کنید.");
      return;
    }

    try {
      const accom = await setAssignmentAccommodation(draft.id, {
        learner_id: selectedLearnerId,
        extra_time_minutes: Number(extraTime) || 0,
        extra_attempts: Number(extraAttempts) || 0,
        extended_due_date: extendedDueDate ? new Date(extendedDueDate).toISOString() : null,
        notes: accommodationNotes,
      });

      setAccommodationsList((prev) => [
        ...prev.filter((a) => a.learner_id !== selectedLearnerId),
        {
          learner_id: accom.learner_id,
          learner_name: accom.learner_name,
          extra_time_minutes: accom.extra_time_minutes,
          extra_attempts: accom.extra_attempts,
          extended_due_date: accom.extended_due_date,
          notes: accom.notes,
        },
      ]);

      // Reset accommodation form
      setSelectedLearnerId("");
      setExtraTime(0);
      setExtraAttempts(0);
      setExtendedDueDate("");
      setAccommodationNotes("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ثبت تسهیلات آموزشی.");
    }
  };

  // Final Publish Handler
  const handlePublish = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);

    try {
      const published = await publishAssignment(draft.id);
      router.push(`/teacher/assignments/${published.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در انتشار تکلیف.");
      setLoading(false);
    }
  };

  const totalPoints = selectedQuestions.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className={styles.container}>
      {/* Header with Breadcrumbs matching Wireframe 4 */}
      <div className={styles.headerCard}>
        <nav className={styles.breadcrumbs} aria-label="مسیر راهنما">
          <Link href="/teacher" className={styles.breadcrumbLink}>
            خانه مدرس
          </Link>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbLink}>تدریس</span>
          <span className={styles.breadcrumbSeparator}>←</span>
          <Link href="/teacher/assignments" className={styles.breadcrumbLink}>
            تکالیف
          </Link>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbCurrent}>ایجاد تکلیف جدید</span>
        </nav>

        <div className={styles.wizardHeader}>
          <h1 className={styles.title}>فرآیند ساخت و انتشار تکلیف</h1>
          {/* Step Indicators */}
          <div className={styles.stepIndicators}>
            <div className={`${styles.stepItem} ${step === 1 ? styles.stepItemActive : step > 1 ? styles.stepItemCompleted : ""}`}>
              <span className={`${styles.stepCircle} ${step === 1 ? styles.stepCircleActive : step > 1 ? styles.stepCircleCompleted : ""}`}>
                ۱
              </span>
              <span>کلاس و مشخصات</span>
            </div>
            <span className={styles.stepArrow}>←</span>

            <div className={`${styles.stepItem} ${step === 2 ? styles.stepItemActive : step > 2 ? styles.stepItemCompleted : ""}`}>
              <span className={`${styles.stepCircle} ${step === 2 ? styles.stepCircleActive : step > 2 ? styles.stepCircleCompleted : ""}`}>
                ۲
              </span>
              <span>انتخاب سوالات</span>
            </div>
            <span className={styles.stepArrow}>←</span>

            <div className={`${styles.stepItem} ${step === 3 ? styles.stepItemActive : step > 3 ? styles.stepItemCompleted : ""}`}>
              <span className={`${styles.stepCircle} ${step === 3 ? styles.stepCircleActive : step > 3 ? styles.stepCircleCompleted : ""}`}>
                ۳
              </span>
              <span>تنظیمات تحویل و تسهیلات</span>
            </div>
            <span className={styles.stepArrow}>←</span>

            <div className={`${styles.stepItem} ${step === 4 ? styles.stepItemActive : ""}`}>
              <span className={`${styles.stepCircle} ${step === 4 ? styles.stepCircleActive : ""}`}>
                ۴
              </span>
              <span>بازبینی و انتشار</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Content Card */}
      <div className={styles.contentCard}>
        {error && (
          <div className={styles.errorBanner} role="alert" style={{ marginBlockEnd: "var(--space-5)" }}>
            {error}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STAGE 1: Choose Class / Learners & Basic Info */}
        {/* ---------------------------------------------------- */}
        {step === 1 && (
          <div>
            {classes.length === 0 && !loading ? (
              /* Recovery Rule: No class exists */
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>کلاس فعالی یافت نشد</h3>
                <p className={styles.emptyText}>
                  برای تعریف تکلیف، ابتدا باید حداقل یک کلاس فعال داشته باشید تا زبان‌آموزان به آن متصل باشند.
                </p>
                <Link href="/teacher/classes" className={styles.primaryButton}>
                  ایجاد اولین کلاس آموزشی
                </Link>
              </div>
            ) : (
              <form onSubmit={handleStep1Next} className={styles.formGrid}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="classSelect" className={styles.label}>
                      انتخاب کلاس آموزشی *
                    </label>
                    <select
                      id="classSelect"
                      className={styles.select}
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      required
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.level} - {c.subject})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cefrSelect" className={styles.label}>
                      سطح هدف CEFR
                    </label>
                    <select
                      id="cefrSelect"
                      className={styles.select}
                      value={targetCefr}
                      onChange={(e) => setTargetCefr(e.target.value)}
                    >
                      <option value="A1">A1 - مبتدی</option>
                      <option value="A2">A2 - مقدماتی</option>
                      <option value="B1">B1 - متوسط</option>
                      <option value="B2">B2 - بالاتر از متوسط</option>
                      <option value="C1">C1 - پیشرفته</option>
                      <option value="C2">C2 - تسلط کامل</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="titleInput" className={styles.label}>
                    عنوان تکلیف / آزمون *
                  </label>
                  <input
                    id="titleInput"
                    type="text"
                    className={styles.input}
                    placeholder="مثال: کوئیز گرامر زمان گذشته ساده و واژگان درس ۴"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="descInput" className={styles.label}>
                    توضیحات کوتاه
                  </label>
                  <input
                    id="descInput"
                    type="text"
                    className={styles.input}
                    placeholder="هدف آموزشی و مباحث ارزیابی شده"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="instructionsInput" className={styles.label}>
                    دستورالعمل و راهنمای شرکت در آزمون برای زبان‌آموزان
                  </label>
                  <textarea
                    id="instructionsInput"
                    className={styles.textarea}
                    placeholder="دستورالعمل‌های آزمون مانند زمان پاسخ‌گویی، نحوه استفاده از منابع و نکات مهم"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                {/* Wizard Footer for Stage 1 */}
                <div className={styles.wizardFooter}>
                  <div className={styles.footerLeft}>
                    <button
                      type="button"
                      onClick={handleSaveAndContinueLater}
                      className={styles.secondaryButton}
                      disabled={savingLater || !title}
                    >
                      {savingLater ? "در حال ذخیره..." : "ذخیره پیش‌نویس و خروج"}
                    </button>
                    <Link href="/teacher/assignments" className={styles.secondaryButton}>
                      انصراف
                    </Link>
                  </div>
                  <div className={styles.footerRight}>
                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                      {loading ? "در حال پردازش..." : "مرحله بعد: انتخاب سوالات ←"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STAGE 2: Question Bank Curation */}
        {/* ---------------------------------------------------- */}
        {step === 2 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)" }}>
              {/* Left Column: Bank Search & Picker */}
              <div>
                <h3 style={{ fontSize: "var(--font-size-h3)", marginBlockEnd: "var(--space-3)" }}>
                  جستجو در بانک سوالات
                </h3>
                <div className={styles.searchToolbar}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="جستجوی موضوع یا متن سوال..."
                    value={bankQuery}
                    onChange={(e) => setBankQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <select
                    className={styles.select}
                    value={bankCefr}
                    onChange={(e) => setBankCefr(e.target.value)}
                    style={{ inlineSize: "110px" }}
                  >
                    <option value="">همه سطوح</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                  <select
                    className={styles.select}
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value)}
                    style={{ inlineSize: "130px" }}
                  >
                    <option value="">همه انواع</option>
                    <option value="mcq">چهارگزینه‌ای</option>
                    <option value="multi_select">چند انتخابی</option>
                    <option value="gap">جای خالی</option>
                    <option value="short_answer">پاسخ کوتاه</option>
                  </select>
                </div>

                <div className={styles.questionsList}>
                  {bankQuestions.map((q) => {
                    const isSelected = selectedQuestions.some((s) => s.question_version_id === q.id);
                    return (
                      <div key={q.id} className={styles.questionCard}>
                        <div className={styles.questionCardHeader}>
                          <div className={styles.questionBadges}>
                            <span className={styles.cefrBadge}>{q.cefr_level}</span>
                            <span className={styles.statusBadge}>{q.question_type}</span>
                            {isSelected && <span className={styles.selectedBadge}>انتخاب شده</span>}
                          </div>
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={() => handleAddQuestion(q)}
                              className={styles.secondaryButton}
                              style={{ paddingBlock: "var(--space-1)", paddingInline: "var(--space-2)", fontSize: "var(--font-size-caption)" }}
                            >
                              + افزودن
                            </button>
                          )}
                        </div>
                        <p className={styles.questionPrompt}>{q.prompt_fa || q.prompt_en}</p>
                        <span className={styles.questionTitle}>{q.title_fa || q.title_en || q.slug}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Questions in this Assignment */}
              <div className={styles.selectedQuestionsPanel}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "var(--font-size-h3)", margin: 0 }}>
                    سوالات منتخب ({selectedQuestions.length})
                  </h3>
                  <span style={{ fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                    مجموع نمرات: {totalPoints} نمره
                  </span>
                </div>

                {selectedQuestions.length === 0 ? (
                  <p className={styles.helpText}>
                    هنوز سوالی به این تکلیف اضافه نشده است. از ستون سمت راست سوالات مورد نظر خود را انتخاب کنید.
                  </p>
                ) : (
                  <div className={styles.reorderList}>
                    {selectedQuestions.map((item, idx) => (
                      <div key={item.question_version_id} className={styles.reorderItem}>
                        <div className={styles.reorderMeta}>
                          <span className={styles.orderNumber}>{idx + 1}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>{item.prompt}</p>
                            <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>
                              نوع: {item.type}
                            </span>
                          </div>
                        </div>

                        <div className={styles.reorderInputs}>
                          <label htmlFor={`pts-${item.question_version_id}`} style={{ fontSize: "var(--font-size-caption)" }}>نمره:</label>
                          <input
                            id={`pts-${item.question_version_id}`}
                            type="number"
                            min="1"
                            max="100"
                            className={styles.pointsInput}
                            value={item.points}
                            onChange={(e) => handleUpdatePoints(item.question_version_id, Number(e.target.value) || 0)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(item.question_version_id)}
                            className={styles.dangerButton}
                            style={{ paddingBlock: "var(--space-1)", paddingInline: "var(--space-2)", fontSize: "var(--font-size-caption)" }}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Wizard Footer for Stage 2 */}
            <div className={styles.wizardFooter}>
              <div className={styles.footerLeft}>
                <button type="button" onClick={() => setStep(1)} className={styles.secondaryButton}>
                  ← بازگشت به کلاس
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndContinueLater}
                  className={styles.secondaryButton}
                >
                  ذخیره پیش‌نویس و خروج
                </button>
              </div>
              <div className={styles.footerRight}>
                <button
                  type="button"
                  onClick={handleStep2Next}
                  className={styles.primaryButton}
                  disabled={loading || selectedQuestions.length === 0}
                >
                  مرحله بعد: تنظیمات تحویل و تسهیلات ←
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STAGE 3: Delivery Settings & Accommodations */}
        {/* ---------------------------------------------------- */}
        {step === 3 && (
          <form onSubmit={handleStep3Next} className={styles.formGrid}>
            <h3 style={{ fontSize: "var(--font-size-h3)", margin: 0 }}>
              تنظیمات زمان‌بندی، مهلت و ارسال
            </h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dueDateInput" className={styles.label}>
                  مهلت ارسال (ددلاین) *
                </label>
                <input
                  id="dueDateInput"
                  type="datetime-local"
                  className={styles.input}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gracePeriodInput" className={styles.label}>
                  فرصت ارفاقی پس از ددلاین (دقیقه)
                </label>
                <input
                  id="gracePeriodInput"
                  type="number"
                  min="0"
                  className={styles.input}
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(Number(e.target.value))}
                />
                <span className={styles.helpText}>
                  در این مدت، ارسال‌ها بدون علامت تاخیر یا جریمه ثبت می‌شوند.
                </span>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="maxAttemptsInput" className={styles.label}>
                  حداکثر دفعات مجاز تلاش
                </label>
                <input
                  id="maxAttemptsInput"
                  type="number"
                  min="1"
                  max="10"
                  className={styles.input}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="timeLimitInput" className={styles.label}>
                  محدودیت زمانی هر تلاش (دقیقه)
                </label>
                <input
                  id="timeLimitInput"
                  type="number"
                  min="1"
                  className={styles.input}
                  placeholder="خالی بگذارید برای آزمون بدون محدودیت زمانی"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="passingPctInput" className={styles.label}>
                  درصد قبولی (%)
                </label>
                <input
                  id="passingPctInput"
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={allowLate}
                  onChange={(e) => setAllowLate(e.target.checked)}
                />
                اجازه ارسال پس از پایان مهلت با برچسب تاخیر (Late Submission)
              </label>
            </div>

            {/* Individual Accommodations Section */}
            <div style={{ marginBlockStart: "var(--space-6)", borderBlockStart: "1px solid var(--color-border)", paddingBlockStart: "var(--space-4)" }}>
              <h4 style={{ fontSize: "var(--font-size-h3)", marginBlockEnd: "var(--space-2)" }}>
                تسهیلات و انطباقات آموزشی فردی (Differentiated Learning Accommodations)
              </h4>
              <p className={styles.helpText} style={{ marginBlockEnd: "var(--space-4)" }}>
                می‌توانید برای زبان‌آموزان با نیازهای ویژه آموزشی (مانند IEP، زبان‌آموزان نیازمند وقت اضافه یا تمدید فرصت) تنظیمات اختصاصی تعریف کنید.
              </p>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="learnerSelect" className={styles.label}>
                    انتخاب زبان‌آموز
                  </label>
                  {enrolledLearners.length > 0 ? (
                    <select
                      id="learnerSelect"
                      className={styles.select}
                      value={selectedLearnerId}
                      onChange={(e) => setSelectedLearnerId(e.target.value)}
                    >
                      <option value="">-- انتخاب از میان زبان‌آموزان کلاس --</option>
                      {enrolledLearners.map((lrn) => (
                        <option key={lrn.id} value={lrn.id}>
                          {lrn.name} ({lrn.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="learnerSelect"
                      type="text"
                      className={styles.input}
                      placeholder="شناسه UUID زبان‌آموز عضو کلاس"
                      value={selectedLearnerId}
                      onChange={(e) => setSelectedLearnerId(e.target.value)}
                    />
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="extraTimeInput" className={styles.label}>
                    زمان اضافه (دقیقه)
                  </label>
                  <input
                    id="extraTimeInput"
                    type="number"
                    min="0"
                    className={styles.input}
                    value={extraTime}
                    onChange={(e) => setExtraTime(Number(e.target.value))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="extraAttemptsInput" className={styles.label}>
                    تلاش اضافه
                  </label>
                  <input
                    id="extraAttemptsInput"
                    type="number"
                    min="0"
                    className={styles.input}
                    value={extraAttempts}
                    onChange={(e) => setExtraAttempts(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor="notesInput" className={styles.label}>
                  یادداشت و علت انطباق آموزشی
                </label>
                <input
                  id="notesInput"
                  type="text"
                  className={styles.input}
                  placeholder="علت اختصاص تسهیلات (محرمانه برای مدرس)"
                  value={accommodationNotes}
                  onChange={(e) => setAccommodationNotes(e.target.value)}
                />
              </div>

              <div style={{ marginBlockStart: "var(--space-3)" }}>
                <button
                  type="button"
                  onClick={handleAddAccommodation}
                  className={styles.secondaryButton}
                  disabled={!selectedLearnerId}
                >
                  + ثبت تسهیلات برای این زبان‌آموز
                </button>
              </div>

              {accommodationsList.length > 0 && (
                <div style={{ marginBlockStart: "var(--space-4)" }}>
                  <h5 style={{ marginBlockEnd: "var(--space-2)" }}>تسهیلات ثبت شده:</h5>
                  <ul>
                    {accommodationsList.map((item) => (
                      <li key={item.learner_id} style={{ fontSize: "var(--font-size-body)", marginBlockEnd: "var(--space-1)" }}>
                        <strong>{item.learner_name}</strong>: +{item.extra_time_minutes} دقیقه، +{item.extra_attempts} تلاش اضافه ({item.notes || "بدون یادداشت"})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Wizard Footer for Stage 3 */}
            <div className={styles.wizardFooter}>
              <div className={styles.footerLeft}>
                <button type="button" onClick={() => setStep(2)} className={styles.secondaryButton}>
                  ← بازگشت به سوالات
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndContinueLater}
                  className={styles.secondaryButton}
                >
                  ذخیره پیش‌نویس و خروج
                </button>
              </div>
              <div className={styles.footerRight}>
                <button type="submit" className={styles.primaryButton} disabled={loading || !dueDate}>
                  مرحله بعد: بازبینی و انتشار ←
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* STAGE 4: Review & Publish */}
        {/* ---------------------------------------------------- */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: "var(--font-size-h3)", marginBlockEnd: "var(--space-4)" }}>
              خلاصه نهایی تکلیف قبل از انتشار
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>عنوان و کلاس</span>
                <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>{title}</span>
                <span className={styles.helpText}>کلاس: {classes.find((c) => c.id === selectedClassId)?.title}</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>سطح و نمره کل</span>
                <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
                  سطح {targetCefr} - مجموع {totalPoints} نمره
                </span>
                <span className={styles.helpText}>تعداد {selectedQuestions.length} سوال</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>مهلت تحویل</span>
                <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
                  {dueDate ? new Date(dueDate).toLocaleString("fa-IR") : "تعیین نشده"}
                </span>
                <span className={styles.helpText}>
                  {timeLimitMinutes ? `محدودیت زمانی: ${timeLimitMinutes} دقیقه` : "بدون محدودیت زمانی"}
                </span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>دفعات تلاش و تسهیلات</span>
                <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
                  {maxAttempts} تلاش مجاز
                </span>
                <span className={styles.helpText}>
                  {accommodationsList.length} مورد انطباق آموزشی ثبت شد
                </span>
              </div>
            </div>

            <div className={styles.successBanner} style={{ marginBlockEnd: "var(--space-6)" }}>
              ✓ تمام پیش‌نیازهای انتشار تکلیف رعایت شده است. با کلیک بر روی انتشار نهایی، تکلیف بلافاصله برای زبان‌آموزان فعال خواهد شد.
            </div>

            {/* Wizard Footer for Stage 4 */}
            <div className={styles.wizardFooter}>
              <div className={styles.footerLeft}>
                <button type="button" onClick={() => setStep(3)} className={styles.secondaryButton}>
                  ← بازگشت به تنظیمات تحویل
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndContinueLater}
                  className={styles.secondaryButton}
                >
                  ذخیره به عنوان پیش‌نویس (بدون انتشار)
                </button>
              </div>
              <div className={styles.footerRight}>
                <button
                  type="button"
                  onClick={handlePublish}
                  className={styles.primaryButton}
                  style={{ background: "var(--color-learning-teal)", color: "var(--color-surface)" }}
                  disabled={loading}
                >
                  {loading ? "در حال انتشار..." : "انتشار نهایی تکلیف (Publish) ✓"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
