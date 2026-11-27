"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useLearnerHome } from "./LearnerShell";
import { trackPrimaryAction } from "../../lib/learner-dashboard";
import { useTwin } from "../twin/useTwin";
import { getLearnerTwin, TWIN_CATALOG } from "../../lib/ai/learner-twin-store";
import { DktEngine, type DktPredictionResult } from "../../lib/dkt-engine/dkt-engine";
import { endooraIndexToCefr } from "../../lib/adaptive-engine";

export function LearnerDashboard() {
  const { data, locale } = useLearnerHome();
  const fa = locale === "fa";
  const action = data.primary_action;
  const course = data.active_course;

  const snapshot = useTwin();

  // Dynamic DKT predictions (loaded on mount via useEffect to prevent SSR hydration mismatch)
  const [dktPredictions, setDktPredictions] = useState<DktPredictionResult | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setDktPredictions(DktEngine.getInstance().getPredictions());
      } catch {
        // Safe fallback
      }
    };
    handleUpdate();
    window.addEventListener("endoora_twin_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("endoora_twin_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const forecast = snapshot ? getLearnerTwin()?.getIELTSForecast() : null;
  const c = snapshot?.calibration;

  // Personalized time-of-day greeting
  const greetingTimeText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return fa ? "صبح بخیر" : "Good morning";
    if (hour >= 12 && hour < 17) return fa ? "عصر بخیر" : "Good afternoon";
    return fa ? "شب بخیر" : "Good evening";
  }, [fa]);

  // 6 Skills computed for metric cards
  const skillsData = useMemo(() => {
    if (!snapshot) {
      return [
        {
          id: "listening",
          nameFa: "شنیداری",
          nameEn: "Listening",
          band: 5.5,
          cefr: "B2",
          icon: "🎧",
          evidenceCount: 14,
          masteryPercent: 72,
          fillClass: "learner-skill-bar-fill--listening",
        },
        {
          id: "reading",
          nameFa: "درک مطلب",
          nameEn: "Reading",
          band: 5.0,
          cefr: "B1",
          icon: "📖",
          evidenceCount: 12,
          masteryPercent: 65,
          fillClass: "learner-skill-bar-fill--reading",
        },
        {
          id: "writing",
          nameFa: "نگارش",
          nameEn: "Writing",
          band: 5.0,
          cefr: "B1",
          icon: "✍️",
          evidenceCount: 9,
          masteryPercent: 62,
          fillClass: "learner-skill-bar-fill--writing",
        },
        {
          id: "speaking",
          nameFa: "مکالمه",
          nameEn: "Speaking",
          band: 5.0,
          cefr: "B1",
          icon: "🎙️",
          evidenceCount: 10,
          masteryPercent: 64,
          fillClass: "learner-skill-bar-fill--speaking",
        },
        {
          id: "grammar",
          nameFa: "دستور زبان",
          nameEn: "Grammar",
          band: 5.5,
          cefr: "B2",
          icon: "🧩",
          evidenceCount: 22,
          masteryPercent: 76,
          fillClass: "learner-skill-bar-fill--grammar",
        },
        {
          id: "vocabulary",
          nameFa: "واژگان",
          nameEn: "Vocabulary",
          band: 6.0,
          cefr: "B2",
          icon: "📚",
          evidenceCount: 28,
          masteryPercent: 82,
          fillClass: "learner-skill-bar-fill--vocabulary",
        },
      ];
    }

    const toBand = (mean: number) => Math.round(Math.max(1, Math.min(9, 1 + 8 * mean)) * 2) / 2;

    const listMean = snapshot.modalityMastery.listening.mean;
    const listCount = snapshot.modalityMastery.listening.evidenceCount;
    const listBand = toBand(listMean);

    const readMean = snapshot.modalityMastery.reading.mean;
    const readCount = snapshot.modalityMastery.reading.evidenceCount;
    const readBand = toBand(readMean);

    const writeMean = snapshot.modalityMastery.writing.mean;
    const writeCount = snapshot.modalityMastery.writing.evidenceCount;
    const writeBand = toBand(writeMean);

    const speakMean = snapshot.modalityMastery.speaking.mean;
    const speakCount = snapshot.modalityMastery.speaking.evidenceCount;
    const speakBand = toBand(speakMean);

    const grammarNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    });
    const grammarMean = grammarNodes.length
      ? grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length
      : 0.55;
    const grammarCount = grammarNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const grammarBand = toBand(grammarMean);

    const vocabNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    });
    const vocabMean = vocabNodes.length
      ? vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length
      : 0.58;
    const vocabCount = vocabNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const vocabBand = toBand(vocabMean);

    return [
      {
        id: "listening",
        nameFa: "شنیداری",
        nameEn: "Listening",
        band: listBand,
        cefr: endooraIndexToCefr(listMean * 100),
        icon: "🎧",
        evidenceCount: listCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(listMean * 100))),
        fillClass: "learner-skill-bar-fill--listening",
      },
      {
        id: "reading",
        nameFa: "درک مطلب",
        nameEn: "Reading",
        band: readBand,
        cefr: endooraIndexToCefr(readMean * 100),
        icon: "📖",
        evidenceCount: readCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(readMean * 100))),
        fillClass: "learner-skill-bar-fill--reading",
      },
      {
        id: "writing",
        nameFa: "نگارش",
        nameEn: "Writing",
        band: writeBand,
        cefr: endooraIndexToCefr(writeMean * 100),
        icon: "✍️",
        evidenceCount: writeCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(writeMean * 100))),
        fillClass: "learner-skill-bar-fill--writing",
      },
      {
        id: "speaking",
        nameFa: "مکالمه",
        nameEn: "Speaking",
        band: speakBand,
        cefr: endooraIndexToCefr(speakMean * 100),
        icon: "🎙️",
        evidenceCount: speakCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(speakMean * 100))),
        fillClass: "learner-skill-bar-fill--speaking",
      },
      {
        id: "grammar",
        nameFa: "دستور زبان",
        nameEn: "Grammar",
        band: grammarBand,
        cefr: endooraIndexToCefr(grammarMean * 100),
        icon: "🧩",
        evidenceCount: grammarCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(grammarMean * 100))),
        fillClass: "learner-skill-bar-fill--grammar",
      },
      {
        id: "vocabulary",
        nameFa: "واژگان",
        nameEn: "Vocabulary",
        band: vocabBand,
        cefr: endooraIndexToCefr(vocabMean * 100),
        icon: "📚",
        evidenceCount: vocabCount,
        masteryPercent: Math.max(15, Math.min(99, Math.round(vocabMean * 100))),
        fillClass: "learner-skill-bar-fill--vocabulary",
      },
    ];
  }, [snapshot]);

  const totalInteractions = (c?.totalInteractions ?? 0) + (dktPredictions?.totalInteractions ?? 0);
  const twinAccuracyPct = c?.totalInteractions
    ? Math.min(99, Math.max(35, Math.round((1 - c.rollingMAE) * 100)))
    : null;

  // Learning Hub Bento Destinations
  const hubDestinations = useMemo(() => [
    {
      href: "/leitner",
      titleFa: "جعبه لایتنر هوشمند",
      titleEn: "Smart Leitner Box",
      descFa: "مرور واژگان با الگوریتم فاصله‌گذاری زمانی و پیش‌بینی DKT",
      descEn: "Spaced repetition vocabulary review powered by DKT",
      icon: "⚡",
      accent: "#14b8a6",
      iconBg: "linear-gradient(135deg, rgba(20, 184, 166, 0.18), rgba(13, 148, 136, 0.28))",
      badgeFa: (data.srs_due_count ?? 0) > 0 ? `${data.srs_due_count} واژه برای مرور` : "همه مرور شد ✨",
      badgeEn: (data.srs_due_count ?? 0) > 0 ? `${data.srs_due_count} due reviews` : "All reviewed ✨",
      actionTextFa: "شروع مرور لغات",
      actionTextEn: "Start review",
    },
    {
      href: "/dashboard/classes",
      titleFa: "کلاس‌ها و تکالیف",
      titleEn: "Classes & Assignments",
      descFa: "بررسی تکالیف ارسالی دبیران، کلاس‌های برخط و تقویم درسی",
      descEn: "Teacher assignments, live sessions, and academic calendar",
      icon: "👨‍🏫",
      accent: "#2563eb",
      iconBg: "linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(29, 78, 216, 0.28))",
      badgeFa: "کلاس‌های من",
      badgeEn: "My Classes",
      actionTextFa: "مشاهده کلاس‌ها",
      actionTextEn: "View classes",
    },
    {
      href: "/learn/video",
      titleFa: "دوره‌های جامع ویدیویی",
      titleEn: "Comprehensive Video Courses",
      descFa: "آرشیو تدریس‌های تصویری Speakout، American English File و مکالمه",
      descEn: "Video lectures, Speakout, AEF series, and speaking labs",
      icon: "🎬",
      accent: "#8b5cf6",
      iconBg: "linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(124, 58, 237, 0.28))",
      badgeFa: "دوره‌های ویدیویی",
      badgeEn: "Video series",
      actionTextFa: "ورود به دوره‌ها",
      actionTextEn: "Watch courses",
    },
    {
      href: "/high-school",
      titleFa: "تمرین تا ۲۰ (نهایی ۱۲ام)",
      titleEn: "Grade 12 Finals Mastery",
      descFa: "بانک نمونه‌سوالات امتحانات نهایی کشوری با تحلیل کلید بارم‌بندی",
      descEn: "National final exam question bank with official rubrics",
      icon: "🎯",
      accent: "#f59e0b",
      iconBg: "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.28))",
      badgeFa: "امتحان نهایی ۲۰",
      badgeEn: "Final 20 Target",
      actionTextFa: "شروع تمرین نهایی",
      actionTextEn: "Start practice",
    },
    {
      href: "/twin",
      titleFa: "دوقلوی یادگیری هوش مصنوعی",
      titleEn: "AI Cognitive Learner Twin",
      descFa: "نقشه زنده تسلط عصبی-شناختی و پیش‌بینی رفتار یادگیری شما",
      descEn: "Live neuro-cognitive mastery graph and memory predictions",
      icon: "🧠",
      accent: "#6366f1",
      iconBg: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(79, 70, 229, 0.28))",
      badgeFa: "هوش مصنوعی زنده",
      badgeEn: "Live AI Model",
      actionTextFa: "مرکز کامل دوقلو",
      actionTextEn: "Explore Twin",
    },
    {
      href: "/books",
      titleFa: "کتابخانه و فایل‌های آموزشی",
      titleEn: "Books & Study Library",
      descFa: "دانلود کتاب‌های مرجع CEFR، فایل‌های صوتی Listening و جزوات",
      descEn: "CEFR coursebooks, native audio files, and study sheets",
      icon: "📚",
      accent: "#059669",
      iconBg: "linear-gradient(135deg, rgba(5, 150, 105, 0.18), rgba(4, 120, 87, 0.28))",
      badgeFa: "منابع دانلودی",
      badgeEn: "Downloads",
      actionTextFa: "مشاهده منابع",
      actionTextEn: "Browse books",
    },
    {
      href: "/progress",
      titleFa: "کارنامه جامع و پیشرفت",
      titleEn: "Progress Ledger & Analytics",
      descFa: "نمودار رشد در طول زمان، آمار دقیق پاسخ‌گویی و تحلیل مهارت‌ها",
      descEn: "Longitudinal mastery growth, test scores, and analytics",
      icon: "📊",
      accent: "#0284c7",
      iconBg: "linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(3, 105, 161, 0.28))",
      badgeFa: "تحلیل عملکرد",
      badgeEn: "Performance",
      actionTextFa: "مشاهده کارنامه",
      actionTextEn: "View ledger",
    },
  ], [data.srs_due_count]);

  const activities = data.recent_activities;

  return (
    <div className="learner-dashboard-container" dir={fa ? "rtl" : "ltr"}>
      {/* 1. Hero Welcome Banner & Stats Strip */}
      <section className="learner-hero-banner" aria-label={fa ? "بنر خوش‌آمدگویی و مأموریت جاری" : "Welcome Banner & Primary Action"}>
        <div className="learner-hero-banner__glow" aria-hidden="true" />
        
        <div className="learner-hero-banner__main">
          <div className="learner-hero-banner__info">
            <div className="learner-hero-banner__meta-row">
              <span className="learner-hero-badge">
                ⚡ {fa ? "مأموریت فعال شما" : "Active Focus"}
              </span>
              <span style={{ fontSize: "0.825rem", color: "var(--color-muted)", fontWeight: 700 }}>
                {greetingTimeText}
              </span>
            </div>

            <h1 className="learner-hero-greeting">
              {fa ? `سلام ${data.greeting_name}، آماده‌ای؟` : `Hello ${data.greeting_name}, ready?`}
            </h1>

            <p className="learner-hero-desc">
              <strong>{fa ? action.title_fa : action.title_en}: </strong>
              {fa ? action.description_fa : action.description_en}
              {action.reason_fa && (
                <span style={{ display: "block", fontSize: "0.85rem", marginTop: "0.25rem", opacity: 0.85 }}>
                  {fa ? action.reason_fa : action.reason_en}
                </span>
              )}
            </p>
          </div>

          <div className="learner-hero-banner__actions">
            <Link
              className="learner-cta-btn learner-cta-btn--primary"
              href={action.href}
              onClick={() => { void trackPrimaryAction(action.id); }}
            >
              <span>{fa ? "ادامه مسیر آموزشی" : "Continue Focus"}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>

            {data.today_mission && (
              <Link
                className="learner-cta-btn learner-cta-btn--secondary"
                href="/today"
              >
                <span>{fa ? "مأموریت روز 🎯" : "Today's Mission 🎯"}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Glassmorphic Stats Strip */}
        <div className="learner-stats-strip" aria-label={fa ? "آمارهای سریع عملکرد" : "Quick performance stats"}>
          {/* Streak Days */}
          <div className="learner-stat-card">
            <div className="learner-stat-card__icon-box learner-stat-card__icon-box--streak" aria-hidden="true">
              <span>🔥</span>
            </div>
            <div className="learner-stat-card__details">
              <span className="learner-stat-card__value">
                {data.streak_days ?? 7} {fa ? "روز" : "Days"}
              </span>
              <span className="learner-stat-card__label">
                {fa ? "زنجیره مطالعه مداوم" : "Day Streak"}
              </span>
            </div>
          </div>

          {/* XP Score */}
          <div className="learner-stat-card">
            <div className="learner-stat-card__icon-box learner-stat-card__icon-box--xp" aria-hidden="true">
              <span>⚡</span>
            </div>
            <div className="learner-stat-card__details">
              <span className="learner-stat-card__value">
                {(data.xp ?? 1420).toLocaleString(fa ? "fa-IR" : "en")} XP
              </span>
              <span className="learner-stat-card__label">
                {fa ? "امتیاز تجربی کسب‌شده" : "Experience Points"}
              </span>
            </div>
          </div>

          {/* Band / Target CEFR */}
          <div className="learner-stat-card">
            <div className="learner-stat-card__icon-box learner-stat-card__icon-box--band" aria-hidden="true">
              <span>🎯</span>
            </div>
            <div className="learner-stat-card__details">
              <span className="learner-stat-card__value">
                Band {forecast?.overall.band ? forecast.overall.band.toFixed(1) : "5.5"} · {forecast?.predictedCEFR ?? "B2"}
              </span>
              <span className="learner-stat-card__label">
                {fa ? "تراز هوش مصنوعی" : "Predicted Band"}
              </span>
            </div>
          </div>

          {/* Daily Mission Status */}
          <div className="learner-stat-card">
            <div className="learner-stat-card__icon-box learner-stat-card__icon-box--mission" aria-hidden="true">
              <span>✅</span>
            </div>
            <div className="learner-stat-card__details">
              <span className="learner-stat-card__value">
                {data.today_mission?.status === "completed"
                  ? fa ? "انجام شد" : "Completed"
                  : fa ? "در حال انجام" : "In Progress"}
              </span>
              <span className="learner-stat-card__label">
                {fa ? "هدف‌گذاری امروز" : "Daily Goal"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cognitive Twin & Skills State (Advanced 6-Metric Cards) */}
      <section className="learner-skills-section" aria-label={fa ? "دوقلوی شناختی و وضعیت مهارت‌ها" : "Cognitive Twin & Skills State"}>
        <div className="learner-skills-section__header">
          <div className="learner-skills-section__title-wrap">
            <div className="learner-skills-section__title-icon" aria-hidden="true">
              <span>🧠</span>
            </div>
            <div>
              <h2 className="learner-skills-section__title">
                {fa ? "دوقلوی شناختی و وضعیت مهارت‌ها" : "Cognitive Twin & Skills State"}
              </h2>
              <p className="learner-skills-section__subtitle">
                {fa
                  ? "مدل‌سازی زنده وضعیت ذهن آموزشی شما با شبکه پویای DKT و فیلتر تطبیقی بیزی"
                  : "Live neuro-cognitive state powered by Neuro-Bayesian EKF and DKT-Forget GRU"}
              </p>
            </div>
          </div>

          <div className="learner-skills-section__pills">
            {forecast?.overall.band && (
              <span className="learner-twin-band-pill">
                🎯 Band {forecast.overall.band.toFixed(1)} · {forecast.predictedCEFR}
              </span>
            )}
            <span className="learner-twin-accuracy-pill">
              {twinAccuracyPct
                ? fa
                  ? `دقت شناخت: ${twinAccuracyPct}٪`
                  : `Twin Accuracy: ${twinAccuracyPct}%`
                : fa
                ? "آماده کالیبراسیون ✨"
                : "Calibrated ✨"}
            </span>
          </div>
        </div>

        {/* 6 Skill Metric Cards Grid */}
        <div className="learner-skills-grid">
          {skillsData.map((s) => (
            <div key={s.id} className="learner-skill-metric-card">
              <div className="learner-skill-metric-card__top">
                <div className="learner-skill-metric-card__title-row">
                  <div className="learner-skill-metric-card__icon" aria-hidden="true">
                    <span>{s.icon}</span>
                  </div>
                  <strong className="learner-skill-metric-card__name">
                    {fa ? s.nameFa : s.nameEn}
                  </strong>
                </div>

                <div className="learner-skill-metric-card__scores">
                  <span className="learner-skill-cefr-badge">
                    {s.cefr}
                  </span>
                  <span className="learner-skill-band-badge">
                    {s.band.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div
                className="learner-skill-bar-track"
                role="progressbar"
                aria-valuenow={s.masteryPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${fa ? s.nameFa : s.nameEn}: ${s.masteryPercent}%`}
              >
                <div
                  className={`learner-skill-bar-fill ${s.fillClass}`}
                  style={{ width: `${s.masteryPercent}%` }}
                />
              </div>

              <div className="learner-skill-metric-card__bottom">
                <span>
                  {fa ? `${s.evidenceCount} تمرین ثبت‌شده` : `${s.evidenceCount} activities`}
                </span>
                <span className="learner-skill-metric-card__mastery">
                  {fa ? `تسلط: ${s.masteryPercent}٪` : `Mastery: ${s.masteryPercent}%`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Retention & Direct Action Footer */}
        <div className="learner-retention-footer">
          <div className="learner-retention-info">
            <span className="learner-retention-indicator">
              ⚡ {fa ? "شاخص پایداری حافظه (DKT): " : "DKT Memory Retention: "}
              <strong>{dktPredictions?.overallRetentionIndex ?? 78}٪</strong>
            </span>
            <span>•</span>
            <span>
              {fa ? `مجموع تعاملات آموزشی: ${totalInteractions}` : `Total Interactions: ${totalInteractions}`}
            </span>
          </div>

          <div className="learner-retention-links">
            <Link href="/twin" className="learner-glass-link">
              <span>{fa ? "مرکز کامل دوقلوی هوش مصنوعی" : "Explore AI Twin Center"}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>
            <Link href="/progress" className="learner-glass-link" style={{ color: "var(--color-action)" }}>
              <span>{fa ? "مشاهده کارنامه جامع مهارت‌ها" : "View Comprehensive Ledger"}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Smart Weekly Flow (Integrated Learning Path & Active Course) */}
      <section className="learner-weekly-flow-card" aria-label={fa ? "برنامه گام‌به‌گام هفته" : "Smart Weekly Program"}>
        <div className="learner-weekly-flow-card__top">
          <div className="learner-weekly-flow-card__title-group">
            <div className="learner-weekly-flow-card__icon-box" aria-hidden="true">
              <span>🗺️</span>
            </div>
            <div>
              <h2 className="learner-weekly-flow-card__title">
                {fa ? "برنامه گام‌به‌گام و نقشه راه یادگیری" : "Weekly Flow & Learning Roadmap"}
              </h2>
              <p className="learner-weekly-flow-card__subtitle">
                {fa ? data.path_message_fa : data.path_message_en}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-muted)" }}>
              {fa ? "پیشرفت کل مسیر:" : "Overall Progress:"}
            </span>
            <span style={{
              fontSize: "0.95rem",
              fontWeight: 900,
              color: "var(--color-action)",
              background: "color-mix(in srgb, var(--color-action) 12%, transparent)",
              padding: "0.2rem 0.65rem",
              borderRadius: "var(--radius-pill)"
            }}>
              {data.path_progress_percent ?? 78}٪
            </span>
            <Link
              href="/path"
              className="learner-glass-link"
              style={{ fontSize: "0.85rem", color: "var(--color-action)" }}
            >
              <span>{fa ? "مشاهده نقشه کامل" : "Full Map"}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>
          </div>
        </div>

        {/* Stepper Roadmap Row */}
        <div className="learner-stepper-roadmap">
          {data.path_steps.map((step) => {
            const isComplete = step.state === "complete";
            const isCurrent = step.state === "current";
            return (
              <div
                key={step.id}
                className={`learner-stepper-step ${isComplete ? "is-complete" : isCurrent ? "is-current" : "is-locked"}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="learner-stepper-step__badge" aria-hidden="true">
                  {isComplete ? "✓" : isCurrent ? "⚡" : "🔒"}
                </div>
                <div className="learner-stepper-step__info">
                  <span className="learner-stepper-step__name">
                    {fa ? step.label_fa : step.label_en}
                  </span>
                  <span className="learner-stepper-step__status">
                    {isComplete
                      ? fa ? "تکمیل شده" : "Completed"
                      : isCurrent
                      ? fa ? "در حال یادگیری" : "In Progress"
                      : fa ? "گام بعدی" : "Locked"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Active Course Box */}
        {course && (
          <div className="learner-embedded-course-box">
            <div className="learner-embedded-course-box__meta">
              <div className="learner-embedded-course-box__icon" aria-hidden="true">
                <span>🎓</span>
              </div>
              <div>
                <h3 className="learner-embedded-course-box__title">
                  {String((fa ? course.title_fa : course.title_en) || course.slug || (fa ? "دوره فعال شما" : "Your Active Course"))}
                </h3>
                <p className="learner-embedded-course-box__subtitle">
                  {fa ? "ادامه تماشا و تمرین درس‌های تعاملی" : "Resume interactive video lectures and tasks"}
                </p>
              </div>
            </div>

            <Link
              href={course.slug ? `/courses/${encodeURIComponent(String(course.slug))}` : "/learn"}
              className="learner-cta-btn learner-cta-btn--primary"
              style={{ minHeight: "2.6rem", padding: "0.5rem 1.35rem", fontSize: "0.9rem" }}
            >
              <span>{fa ? "ادامه یادگیری دوره" : "Resume Course"}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>
          </div>
        )}
      </section>

      {/* 4. Learning Hub Bento Grid (فضاهای یادگیری) */}
      <section className="learner-hub-section" aria-label={fa ? "فضاهای یادگیری" : "Learning Hub"}>
        <h2 className="learner-hub-section__title">
          <span>🚀</span>
          <span>{fa ? "فضاهای یادگیری و دسترسی سریع" : "Learning Spaces & Quick Hub"}</span>
        </h2>

        <div className="learner-hub-grid">
          {hubDestinations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="learner-hub-card"
              style={{ "--hub-accent": item.accent } as React.CSSProperties}
            >
              <div className="learner-hub-card__top">
                <div
                  className="learner-hub-card__icon-box"
                  style={{ background: item.iconBg, color: item.accent }}
                  aria-hidden="true"
                >
                  <span>{item.icon}</span>
                </div>

                <span className="learner-hub-card__badge">
                  {fa ? item.badgeFa : item.badgeEn}
                </span>
              </div>

              <div className="learner-hub-card__body">
                <h3 className="learner-hub-card__title">
                  {fa ? item.titleFa : item.titleEn}
                </h3>
                <p className="learner-hub-card__desc">
                  {fa ? item.descFa : item.descEn}
                </p>
              </div>

              <div className="learner-hub-card__footer">
                <span>{fa ? item.actionTextFa : item.actionTextEn}</span>
                <span className="learner-hub-card__arrow" aria-hidden="true">
                  {fa ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Modern Activity Timeline */}
      <section className="learner-activity-card" aria-label={fa ? "فعالیت‌های اخیر" : "Recent Activity"}>
        <div className="learner-activity-card__header">
          <h2 className="learner-activity-card__title">
            <span>⏱️</span>
            <span>{fa ? "فعالیت‌ها و تمرین‌های اخیر" : "Recent Activity"}</span>
          </h2>
          <Link
            href="/progress"
            className="learner-glass-link"
            style={{ fontSize: "0.85rem" }}
          >
            <span>{fa ? "مشاهده همه" : "View All"}</span>
            <span aria-hidden="true">{fa ? "←" : "→"}</span>
          </Link>
        </div>

        {activities && activities.length > 0 ? (
          <div className="learner-timeline">
            {activities.map((a) => (
              <div key={a.id} className="learner-timeline__item">
                <div className="learner-timeline__left">
                  <div className="learner-timeline__icon-box" aria-hidden="true">
                    <span>{a.icon || "📝"}</span>
                  </div>
                  <div className="learner-timeline__details">
                    <strong className="learner-timeline__title">
                      {fa ? a.title_fa : a.title_en}
                    </strong>
                    <span className="learner-timeline__meta">
                      {a.category} · {a.badge_text_fa && fa ? a.badge_text_fa : a.badge_text_en}
                    </span>
                  </div>
                </div>

                <time className="learner-timeline__time" dateTime={a.created_at}>
                  {a.time_ago_fa && fa ? a.time_ago_fa : a.time_ago_en || new Date(a.created_at).toLocaleDateString(fa ? "fa-IR" : "en")}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <div className="learner-empty-activity">
            <span className="learner-empty-activity__icon" aria-hidden="true">✨</span>
            <h3 className="learner-empty-activity__title">
              {fa ? "هنوز تمرینی برای امروز ثبت نشده است" : "No activities recorded yet"}
            </h3>
            <p className="learner-empty-activity__text">
              {fa
                ? "با یک جلسه ۵ دقیقه‌ای مرور در جعبه لایتنر یا ادامه درس امروز، زنجیره یادگیری‌ات را قوی‌تر کن!"
                : "Boost your streak today by starting a 5-minute review in the Leitner box or continuing your course!"}
            </p>
            <Link
              href="/leitner"
              className="learner-cta-btn learner-cta-btn--primary"
              style={{ minHeight: "2.5rem", padding: "0.5rem 1.35rem", fontSize: "0.88rem" }}
            >
              <span>{fa ? "شروع مرور در لایتنر ⚡" : "Start Leitner Review ⚡"}</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
