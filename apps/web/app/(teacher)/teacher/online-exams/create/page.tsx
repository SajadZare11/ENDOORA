"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../online-exams.module.css";
import { Button } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  createOnlineExam,
  type OnlineExamCreatePayload,
  type AntiCheatPreset,
} from "@/lib/online-exams";

export default function TeacherOnlineExamCreatePage() {
  const router = useRouter();
  const { locale } = useTeacherHome();
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

  // Step 2: Anti-Cheat & Security Presets
  const [securityPreset, setSecurityPreset] = useState<AntiCheatPreset>("standard");
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [blockClipboard, setBlockClipboard] = useState(true);
  const [blockDevtools, setBlockDevtools] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [sequentialNavigation, setSequentialNavigation] = useState(false);
  const [allowNegativeMarking, setAllowNegativeMarking] = useState(false);
  const [maxBlurEvents, setMaxBlurEvents] = useState(3);
  const [maxFullscreenExits, setMaxFullscreenExits] = useState(2);
  const [autoSubmitOnViolation, setAutoSubmitOnViolation] = useState(true);
  const [violationThreshold, setViolationThreshold] = useState(3);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleChoices, setShuffleChoices] = useState(true);

  // 11. Security Presets Handler
  const applyPreset = (preset: "strict" | "standard" | "practice") => {
    setSecurityPreset(preset);
    if (preset === "strict") {
      setEnforceFullscreen(true);
      setBlockClipboard(true);
      setBlockDevtools(true);
      setWatermarkEnabled(true);
      setSequentialNavigation(true);
      setAllowNegativeMarking(true);
      setMaxBlurEvents(2);
      setMaxFullscreenExits(1);
      setAutoSubmitOnViolation(true);
      setViolationThreshold(2);
      setShuffleQuestions(true);
      setShuffleChoices(true);
    } else if (preset === "standard") {
      setEnforceFullscreen(true);
      setBlockClipboard(true);
      setBlockDevtools(true);
      setWatermarkEnabled(true);
      setSequentialNavigation(false);
      setAllowNegativeMarking(false);
      setMaxBlurEvents(3);
      setMaxFullscreenExits(2);
      setAutoSubmitOnViolation(true);
      setViolationThreshold(3);
      setShuffleQuestions(true);
      setShuffleChoices(true);
    } else if (preset === "practice") {
      setEnforceFullscreen(false);
      setBlockClipboard(false);
      setBlockDevtools(false);
      setWatermarkEnabled(false);
      setSequentialNavigation(false);
      setAllowNegativeMarking(false);
      setMaxBlurEvents(99);
      setMaxFullscreenExits(99);
      setAutoSubmitOnViolation(false);
      setViolationThreshold(99);
      setShuffleQuestions(false);
      setShuffleChoices(false);
    }
  };

  // Step 3: Quick Questions
  interface DraftQuestion {
    id: string;
    title: string;
    type: string;
    points: number;
    prompt: string;
  }

  const [draftQuestions] = useState<DraftQuestion[]>([
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

  const handleCreateExam = async () => {
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
          watermark_enabled: watermarkEnabled,
          sequential_navigation: sequentialNavigation,
          security_preset: securityPreset,
          allow_negative_marking: allowNegativeMarking,
        },
      };

      const created = await createOnlineExam(payload);
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
            اطلاعات پایه و شرایط برگزاری
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
                placeholder="مثال: آزمون میان‌ترم تاپ‌ناچ ۲ (Top Notch 2A)"
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
                توضیحات کلی یا هدف آزمون
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="سرفصل‌های یونیت ۱ تا ۴ کتاب، گرامر زمان گذشته و ریدینگ"
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
                مدت زمان پاسخ‌دهی (دقیقه)
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
                تخصیص به کلاس (اختیاری)
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
                <option value="">آزمون آزاد (تمام زبان‌آموزان با لینک یا کد)</option>
                <option value="class-1">کلاس جامع ترمیک B1 (یکشنبه و سه‌شنبه)</option>
                <option value="class-2">کلاس فشرده آیلتس آکادمیک (پنجشنبه‌ها)</option>
                <option value="class-3">کلاس مکالمه تجاری Business English</option>
              </select>
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

      {/* Step 2: Anti-Cheat Controls & Presets */}
      {currentStep === 2 && (
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem", fontWeight: 700 }}>
            🛡️ سامانه نظارت و پیشگیری از تقلب (Anti-Cheat Engine)
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            یکی از پروفایل‌های امنیتی آماده را انتخاب کنید یا گزینه‌ها را به صورت سفارشی تنظیم نمایید.
          </p>

          {/* 11. Three Preset Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {/* Strict Preset */}
            <div
              onClick={() => applyPreset("strict")}
              style={{
                cursor: "pointer",
                padding: "1.25rem",
                borderRadius: "0.875rem",
                border: securityPreset === "strict" ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
                background: securityPreset === "strict" ? "#fef2f2" : "#ffffff",
                boxShadow: securityPreset === "strict" ? "0 4px 12px rgba(220, 38, 38, 0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🔴</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: "#fee2e2",
                    color: "#991b1b",
                  }}
                >
                  سخت‌گیرانه
                </span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                حالت سخت‌گیرانه (Strict)
              </h4>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.5 }}>
                تمام‌صفحه اجباری، حداکثر ۲ اخطار خروج از تب، قفل کپی/پیست، واترمارک هویتی، ناوبری ترتیبی، ارسال اجباری.
              </p>
            </div>

            {/* Standard Preset */}
            <div
              onClick={() => applyPreset("standard")}
              style={{
                cursor: "pointer",
                padding: "1.25rem",
                borderRadius: "0.875rem",
                border: securityPreset === "standard" ? "2px solid #4f46e5" : "1.5px solid #e2e8f0",
                background: securityPreset === "standard" ? "#eef2ff" : "#ffffff",
                boxShadow: securityPreset === "standard" ? "0 4px 12px rgba(79, 70, 229, 0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>⚖️</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: "#e0e7ff",
                    color: "#3730a3",
                  }}
                >
                  استاندارد (پیشنهادی)
                </span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                حالت استاندارد (Standard)
              </h4>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.5 }}>
                تمام‌صفحه اجباری، حداکثر ۳ اخطار خروج از تب، قفل کپی/پیست و کنسول، واترمارک هویتی، ارسال خودکار.
              </p>
            </div>

            {/* Practice Preset */}
            <div
              onClick={() => applyPreset("practice")}
              style={{
                cursor: "pointer",
                padding: "1.25rem",
                borderRadius: "0.875rem",
                border: securityPreset === "practice" ? "2px solid #10b981" : "1.5px solid #e2e8f0",
                background: securityPreset === "practice" ? "#ecfdf5" : "#ffffff",
                boxShadow: securityPreset === "practice" ? "0 4px 12px rgba(16, 185, 129, 0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📝</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: "#d1fae5",
                    color: "#065f46",
                  }}
                >
                  تمرینی و آزمایشی
                </span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                حالت تمرینی (Practice)
              </h4>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.5 }}>
                بدون محدودیت تمام‌صفحه، بدون سقف خروج، بدون قفل کلیپ‌بورد و بدون نمره منفی یا ارسال اجباری.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* 1 & 2. Fullscreen */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="enforceFs"
                checked={enforceFullscreen}
                onChange={(e) => {
                  setEnforceFullscreen(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="enforceFs" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  اجبار به حالت تمام‌صفحه و پایش خروج (Fullscreen Enforcement & Monitoring)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  ورود به آزمون منوط به حالت تمام‌صفحه است و در صورت فشردن Esc، F11 یا خروج از تمام‌صفحه، اخطار امنیتی ثبت می‌شود.
                </p>
              </div>
            </div>

            {/* 3. Clipboard Lock */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="blockClip"
                checked={blockClipboard}
                onChange={(e) => {
                  setBlockClipboard(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="blockClip" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  مسدودسازی کپی، پیست و کلیک‌راست (Clipboard & Context Menu Lock)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  غیرفعال‌سازی کلیک راست، جلوگیری از کپی و پیست متون، و غیرفعال‌سازی انتخاب متن (user-select: none).
                </p>
              </div>
            </div>

            {/* 4. DevTools and Shortcuts */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="blockDev"
                checked={blockDevtools}
                onChange={(e) => {
                  setBlockDevtools(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="blockDev" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  غیرفعال‌سازی کلیدهای میانبر حساس و کنسول توسعه‌دهنده (DevTools & Shortcuts Lock)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  مسدودسازی F12، Ctrl+Shift+I، Ctrl+U، PrintScreen، و کلیدهای ترکیبی چاپ صفحه (Ctrl+P).
                </p>
              </div>
            </div>

            {/* 5. Floating Watermark */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="watermarkToggle"
                checked={watermarkEnabled}
                onChange={(e) => {
                  setWatermarkEnabled(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="watermarkToggle" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  واترمارک پویا و نیمه‌شفاف هویتی (Anti-Leak Floating Watermark)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  نمایش اطلاعات یکتای داوطلب به صورت مورب در پس‌زمینه آزمون جهت جلوگیری از عکس‌برداری یا ضبط ویدیویی از مانیتور.
                </p>
              </div>
            </div>

            {/* 6. Shuffling */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="shuffleToggle"
                checked={shuffleQuestions && shuffleChoices}
                onChange={(e) => {
                  const val = e.target.checked;
                  setShuffleQuestions(val);
                  setShuffleChoices(val);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="shuffleToggle" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  بهم‌ریختگی تصادفی سوالات و گزینه‌ها (Question & Option Shuffling)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  ترتیب سوالات و چینش ۴ گزینه برای هر داوطلب با الگوریتم فیشر یتس تصادفی‌سازی می‌شود تا امکان تقلب گروهی از بین برود.
                </p>
              </div>
            </div>

            {/* 7. Sequential Navigation */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="seqNavToggle"
                checked={sequentialNavigation}
                onChange={(e) => {
                  setSequentialNavigation(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="seqNavToggle" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  ناوبری ترتیبی یک‌طرفه (Sequential / Linear Navigation)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  زبان‌آموز پس از پاسخ و زدن سوال بعدی حق بازگشت به سوالات قبلی را نخواهد داشت.
                </p>
              </div>
            </div>

            {/* 9. Auto-Submit on Threshold */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <input
                type="checkbox"
                id="autoSub"
                checked={autoSubmitOnViolation}
                onChange={(e) => {
                  setAutoSubmitOnViolation(e.target.checked);
                  setSecurityPreset("custom");
                }}
                style={{ width: "1.25rem", height: "1.25rem", marginTop: "0.2rem", accentColor: "#4f46e5" }}
              />
              <div>
                <label htmlFor="autoSub" style={{ fontWeight: 700, display: "block", cursor: "pointer" }}>
                  ارسال خودکار و اجباری پس از سقف تخلفات (Forced Auto-Submit on Cap)
                </label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  در صورت خروج مکرر از صفحه یا رسیدن به سقف تخلفات، آزمون بدون تأیید داوطلب بلافاصله بسته و نهایی خواهد شد.
                </p>
              </div>
            </div>

            {/* Limits Config */}
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
                  onChange={(e) => {
                    setMaxBlurEvents(Number(e.target.value));
                    setSecurityPreset("custom");
                  }}
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
                  سقف کل تخلفات قبل از تحویل اجباری (Violation Threshold)
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={violationThreshold}
                  onChange={(e) => {
                    setViolationThreshold(Number(e.target.value));
                    setSecurityPreset("custom");
                  }}
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
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>سطح امنیت ضد تقلب:</span>
                <div
                  style={{
                    fontWeight: 800,
                    color:
                      securityPreset === "strict"
                        ? "#dc2626"
                        : securityPreset === "standard"
                        ? "#4f46e5"
                        : "#10b981",
                  }}
                >
                  {securityPreset === "strict" && "🛡️ سخت‌گیرانه (Strict)"}
                  {securityPreset === "standard" && "⚖️ استاندارد (Standard)"}
                  {securityPreset === "practice" && "📝 تمرینی (Practice)"}
                  {securityPreset === "custom" && "⚙️ سفارشی (Custom)"}
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
                onClick={handleCreateExam}
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
