"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../online-exams.module.css";
import { Button } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { createOnlineExam, addQuestionToExam, type OnlineExamCreatePayload } from "@/lib/online-exams";

export default function CreateOnlineExamPage() {
  const router = useRouter();
  const { locale, classesList } = useTeacherHome();
  const isFa = locale === "fa";

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingScore, setPassingScore] = useState(60);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Step 2: Anti-Cheat Configuration
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [blockClipboard, setBlockClipboard] = useState(true);
  const [blockDevtools, setBlockDevtools] = useState(true);
  const [maxBlurEvents, setMaxBlurEvents] = useState(5);
  const [maxFullscreenExits, setMaxFullscreenExits] = useState(3);
  const [autoSubmitOnViolation, setAutoSubmitOnViolation] = useState(true);
  const [violationThreshold, setViolationThreshold] = useState(5);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleChoices, setShuffleChoices] = useState(false);

  // Step 3: Quick Questions
  interface DraftQuestion {
    id: string;
    title: string;
    type: string;
    points: number;
    prompt: string;
  }

  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([
    {
      id: "demo-q1",
      title: "IELTS Reading / Vocabulary Cloze",
      type: "gap",
      points: 10,
      prompt: "Complete the passage with appropriate academic words.",
    },
    {
      id: "demo-q2",
      title: "Grammar: Conditionals MCQ",
      type: "mcq",
      points: 10,
      prompt: "If students ___ more attention to syntax, their writing would improve.",
    },
    {
      id: "demo-q3",
      title: "Listening Comprehension Part 1",
      type: "audio",
      points: 15,
      prompt: "Listen to the conversation and answer the following questions.",
    },
    {
      id: "demo-q4",
      title: "Speaking Task 2: Expressing Opinions",
      type: "speaking",
      points: 20,
      prompt: "Describe an environmental initiative in your community and explain its impact.",
    },
    {
      id: "demo-q5",
      title: "Academic Essay Writing",
      type: "long_writing",
      points: 25,
      prompt: "Some people believe that artificial intelligence will replace teachers...",
    },
  ]);

  const handleCreateExam = async (publishImmediately = false) => {
    if (!title.trim()) {
      setErrorMsg("لطفاً عنوان آزمون را وارد کنید.");
      setCurrentStep(1);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload: OnlineExamCreatePayload = {
        title,
        description,
        instructions,
        duration_minutes: durationMinutes,
        passing_score: passingScore,
        max_attempts: maxAttempts,
        teacher_class: selectedClassId || null,
        shuffle_questions: shuffleQuestions,
        shuffle_choices: shuffleChoices,
        anti_cheat_config: {
          enforce_fullscreen: enforceFullscreen,
          block_clipboard: blockClipboard,
          block_devtools: blockDevtools,
          max_blur_events: maxBlurEvents,
          max_fullscreen_exits: maxFullscreenExits,
          auto_submit_on_violation: autoSubmitOnViolation,
          violation_threshold: violationThreshold,
        },
      };

      const created = await createOnlineExam(payload);

      // Redirect to the exam detail page to manage questions
      router.push(`/teacher/online-exams/${created.id}`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "خطا در ساخت آزمون. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <Link href="/teacher/online-exams" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.875rem" }}>
              ← بازگشت به آزمون‌ها
            </Link>
          </div>
          <h1 className={styles.title}>طراحی و پیکربندی آزمون جدید</h1>
          <p className={styles.subtitle}>
            تنظیم مشخصات عمومی، فعال‌سازی پروتکل‌های نظارتی ضد تقلب و تخصیص سوالات
          </p>
        </div>
      </header>

      {errorMsg && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Stepper Tabs */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabItem} ${currentStep === 1 ? styles.tabItemActive : ""}`}
          onClick={() => setCurrentStep(1)}
        >
          ۱. اطلاعات و سرفصل‌ها
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${currentStep === 2 ? styles.tabItemActive : ""}`}
          onClick={() => setCurrentStep(2)}
        >
          ۲. تنظیمات ضد تقلب و امنیت
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${currentStep === 3 ? styles.tabItemActive : ""}`}
          onClick={() => setCurrentStep(3)}
        >
          ۳. مرور سوالات و تأیید نهایی
        </button>
      </div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.125rem", fontWeight: 700 }}>
            مشخصات کلی آزمون
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                عنوان آزمون *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: میان‌ترم جامع زبان انگلیسی B2 - گرامر و رایتینگ"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                کلاس مرتبط
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.9375rem",
                  background: "#ffffff",
                }}
              >
                <option value="">آزمون آزاد (همگانی با کد دعوت)</option>
                {classesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                مدت زمان مجاز (دقیقه)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                حداقل درصد قبولی (Pass Mark)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                حداکثر دفعات تلاش مجاز
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                توضیحات و دستورالعمل آزمون
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="توضیحات لازم برای زبان‌آموزان قبل از شروع آزمون..."
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.9375rem",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{ background: "#4f46e5", color: "#ffffff", padding: "0.625rem 2rem", fontWeight: 700 }}
            >
              مرحله بعد: تنظیمات ضد تقلب ←
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Anti-Cheat Controls */}
      {currentStep === 2 && (
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem", fontWeight: 700 }}>
            🛡️ سامانه نظارت و پیشگیری از تقلب (Anti-Cheat Engine)
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            قابلیت‌های تله‌متری امنیتی، ره‌گیری رفتار مرورگر و محاسبه خودکار نمره اصالت (Integrity Score) را پیکربندی کنید.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="enforceFs"
                checked={enforceFullscreen}
                onChange={(e) => setEnforceFullscreen(e.target.checked)}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="enforceFs" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  اجبار به حالت تمام‌صفحه (Fullscreen Enforcement)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  زبان‌آموز ملزم به قرارگیری در حالت تمام‌صفحه است و در صورت خروج هشدار دریافت کرده و ثبت تخلف می‌شود.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="blockClip"
                checked={blockClipboard}
                onChange={(e) => setBlockClipboard(e.target.checked)}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="blockClip" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  مسدودسازی کلیپ‌بورد و کپی/پیست (Clipboard & Paste Blocking)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  از کپی کردن سوالات و پیست کردن متن‌های آماده در بخش‌های تشریحی و رایتینگ جلوگیری می‌کند.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="blockDev"
                checked={blockDevtools}
                onChange={(e) => setBlockDevtools(e.target.checked)}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="blockDev" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  مسدودسازی کلیدهای میانبر و ابزار توسعه‌دهنده (DevTools & Shortcut Block)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  کلیدهای میانبر کلیدی نظیر F12، Ctrl+Shift+I و کلیک‌راست را در طول آزمون غیرفعال می‌سازد.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="autoSub"
                checked={autoSubmitOnViolation}
                onChange={(e) => setAutoSubmitOnViolation(e.target.checked)}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="autoSub" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  ارسال خودکار آزمون پس از سقف تخلفات (Auto-Submit on Threshold)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  در صورتی که تعداد تخلفات (خروج از تب، خروج از فول‌اسکرین) به حد نصاب رسید، آزمون فوراً ثبت نهایی می‌شود.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "0.5rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  حداکثر دفعات خروج از تب / پنجره (Blur Events)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxBlurEvents}
                  onChange={(e) => setMaxBlurEvents(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  سقف مجاز تخلف قبل از ثبت اجباری (Violation Threshold)
                </label>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={violationThreshold}
                  onChange={(e) => setViolationThreshold(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <Button type="button" onClick={() => setCurrentStep(1)}>
              → مرحله قبل
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(3)}
              style={{ background: "#4f46e5", color: "#ffffff", padding: "0.625rem 2rem", fontWeight: 700 }}
            >
              مرحله بعد: مرور و ذخیره ←
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Questions */}
      {currentStep === 3 && (
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.125rem", fontWeight: 700 }}>
            خلاصه و ذخیره آزمون
          </h3>

          <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>عنوان آزمون:</span>
                <div style={{ fontWeight: 700 }}>{title || "بدون عنوان"}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>مدت زمان:</span>
                <div style={{ fontWeight: 700 }}>{durationMinutes} دقیقه</div>
              </div>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>نمره قبولی:</span>
                <div style={{ fontWeight: 700 }}>{passingScore}٪</div>
              </div>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>نظارت ضد تقلب:</span>
                <div style={{ fontWeight: 700, color: enforceFullscreen ? "#059669" : "#64748b" }}>
                  {enforceFullscreen ? "🛡️ فعال (سخت‌گیرانه)" : "استاندارد"}
                </div>
              </div>
            </div>
          </div>

          <h4 style={{ margin: "0 0 1rem 0", fontWeight: 700 }}>
            ساختار سوالات آزمون (پیش‌نمایش آیتم‌های زبانی)
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            {draftQuestions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 1rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontWeight: 700, width: "24px" }}>{idx + 1}.</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{q.title}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{q.prompt}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.8125rem", background: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontWeight: 600 }}>
                    {q.type}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    {q.points} نمره
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="button" onClick={() => setCurrentStep(2)}>
              → مرحله قبل
            </Button>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button
                type="button"
                onClick={() => handleCreateExam(false)}
                disabled={submitting}
                style={{ background: "#4f46e5", color: "#ffffff", fontWeight: 700, padding: "0.625rem 2rem" }}
              >
                {submitting ? "در حال ایجاد..." : "ذخیره و ساخت آزمون ✔"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
