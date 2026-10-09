"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Tamrin20Skill } from "@endoora/contracts";
import {
  ALL_LESSONS,
  ALL_SKILLS,
  SKILL_TITLES_FA,
  SKILL_TITLES_EN,
} from "@/lib/tamrin20-data";
import { useTamrin20Progress, formatTimeSpentFa, getOverallAccuracy } from "@/lib/tamrin20-progress";
import styles from "./tamrin20.module.css";

const SKILL_ICONS: Record<Tamrin20Skill, string> = {
  listening: "🎧",
  vocabulary: "📖",
  grammar: "📐",
  reading: "🔍",
  writing: "✍️",
};

const SKILL_DESCRIPTIONS: Record<Tamrin20Skill, string> = {
  listening: "سوالات بخش شنیداری همراه با پلیر فایل‌های صوتی رسمی امتحان نهایی",
  vocabulary: "واژگان، اصطلاحات، هم‌آیی‌ها (Collocations) و مترادف/متضاد",
  grammar: "سوالات تستی، بازنویسی جملات، تگ کوئسشن، مجهول و شرطی‌ها",
  reading: "متون و ریدینگ‌های استاندارد نهایی همراه با سوالات تحلیلی و مرجع ضمایر",
  writing: "جملات مرکب، ربط‌دهنده‌ها، ساختار پاراگراف و Topic Sentence",
};

export const Tamrin20HubView: React.FC = () => {
  const { progress } = useTamrin20Progress();
  const [selectedLessonTab, setSelectedLessonTab] = useState<number>(1);
  const accuracy = getOverallAccuracy(progress);
  const { totalAttempted, totalCorrect, totalTimeSeconds } = progress.summary;

  const currentLesson = ALL_LESSONS[selectedLessonTab] || ALL_LESSONS[1];

  return (
    <div className={styles.container}>
      {/* Breadcrumb Trail */}
      <nav className={styles.breadcrumbs} aria-label="مسیر راهنما">
        <Link href="/">خانه</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/skills/school">زبان دبیرستان</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/high-school/grade-12">پایه دوازدهم</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span aria-current="page">تمرین تا ۲۰ (Vision 3)</span>
      </nav>

      {/* Hero Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "2rem 1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              backdropFilter: "blur(4px)",
            }}
          >
            پایه دوازدهم • Vision 3
          </span>
          <span
            style={{
              background: "#22c55e",
              color: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
            }}
          >
            امتحانات نهایی ۱۳۹۸ تا ۱۴۰۴
          </span>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
            }}
          >
            بیش از ۱۰۰۰ سوال طبقه‌بندی‌شده
          </span>
        </div>

        <h1 style={{ fontSize: "1.85rem", fontWeight: 900, margin: "0 0 0.5rem 0", lineHeight: 1.3 }}>
          تمرین تا ۲۰ (زبان انگلیسی پایه دوازدهم)
        </h1>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.95, maxInlineSize: "48rem" }}>
          بانک تعاملی و طبقه‌بندی‌شده سوالات امتحانات نهایی به تفکیک درس و مهارت. در هر بخش ابتدا ۲۰ سوال پرتکرار
          و مهم را تمرین کنید؛ با هر پاسخ، بازخورد آنی (سبز با توضیحات تکمیلی یا قرمز با پاسخ صحیح تشریحی) دریافت
          کنید و در انتها به تمام سوالات دسترسی پیدا نمایید.
        </p>

        {/* Live Mini Stats Tracker */}
        {totalAttempted > 0 && (
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              fontSize: "0.85rem",
            }}
          >
            <span>
              🎯 سوالات حل شده: <strong>{totalAttempted}</strong> ({totalCorrect} درست)
            </span>
            <span>
              📊 دقت کلی: <strong>{accuracy}٪</strong>
            </span>
            <span>
              ⏱️ زمان مطالعه: <strong>{formatTimeSpentFa(totalTimeSeconds)}</strong>
            </span>
            <Link
              href="/progress"
              style={{
                color: "#fef08a",
                fontWeight: 700,
                textDecoration: "underline",
                marginInlineStart: "auto",
              }}
            >
              مشاهده کارنامه کامل در پنل ←
            </Link>
          </div>
        )}
      </header>

      {/* Lesson Selector Tabs */}
      <section style={{ marginBottom: "1.5rem" }} aria-label="انتخاب درس">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--color-text, #0f172a)" }}>
          درس مورد نظر را انتخاب کنید:
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {[1, 2, 3].map((num) => {
            const lessonObj = ALL_LESSONS[num];
            const isSelected = selectedLessonTab === num;

            // Compute student stats for this lesson
            let lessonAttempted = 0;
            let lessonCorrect = 0;
            if (progress.byLesson[num]) {
              for (const sk of ALL_SKILLS) {
                const sStat = progress.byLesson[num][sk];
                if (sStat) {
                  lessonAttempted += sStat.attempted || 0;
                  lessonCorrect += sStat.correct || 0;
                }
              }
            }
            const lessonAcc = lessonAttempted > 0 ? Math.round((lessonCorrect / lessonAttempted) * 100) : 0;

            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedLessonTab(num)}
                style={{
                  background: isSelected ? "var(--color-surface, #ffffff)" : "var(--color-canvas, #f8fafc)",
                  border: isSelected ? "2px solid #2563eb" : "1px solid var(--color-border, #e2e8f0)",
                  borderRadius: "12px",
                  padding: "1rem",
                  textAlign: "right",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "#2563eb" : "#64748b" }}>
                    درس {num}
                  </span>
                  {lessonAttempted > 0 && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "999px",
                        background: lessonAcc >= 70 ? "#dcfce7" : "#fef3c7",
                        color: lessonAcc >= 70 ? "#166534" : "#92400e",
                      }}
                    >
                      {lessonAcc}٪ ({lessonAttempted} تست)
                    </span>
                  )}
                </div>

                <strong style={{ fontSize: "1rem", color: "var(--color-text, #0f172a)", display: "block" }}>
                  {lessonObj?.titleFa}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "#2563eb", fontFamily: "var(--font-family-latin)", display: "block", marginTop: "0.2rem" }}>
                  {lessonObj?.titleEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Lesson: 5 Skills Grid */}
      <section style={{ marginBottom: "2rem" }} aria-label={`مهارت‌های درس ${selectedLessonTab}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
              مهارت‌های ۵گانه درس {currentLesson.lesson}: {currentLesson.titleFa}
            </h3>
            <span style={{ fontSize: "0.85rem", color: "var(--color-muted, #64748b)" }}>
              یک مهارت را انتخاب کنید تا ۲۰ سوال منتخب اولیه برای شما باز شود:
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {ALL_SKILLS.map((skill) => {
            const batch = currentLesson.skills[skill];
            const icon = SKILL_ICONS[skill];
            const desc = SKILL_DESCRIPTIONS[skill];
            const titleFa = SKILL_TITLES_FA[skill];
            const titleEn = SKILL_TITLES_EN[skill];

            // Progress for this specific lesson & skill
            const skillStat = progress.byLesson[selectedLessonTab]?.[skill];
            const attempted = skillStat?.attempted || 0;
            const correct = skillStat?.correct || 0;
            const skillAccuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            const practiceHref = `/high-school/grade-12/tamrin20/lesson-${selectedLessonTab}/${skill}`;

            return (
              <div
                key={skill}
                style={{
                  background: "var(--color-surface, #ffffff)",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-subtle, 0 1px 3px rgba(0,0,0,0.05))",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        color: "#2563eb",
                      }}
                    >
                      {batch?.totalQuestions || 0} سوال نهایی
                    </span>
                  </div>

                  <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
                    بخش {titleFa}
                    <span style={{ fontSize: "0.85rem", color: "#64748b", marginInlineStart: "0.35rem", fontFamily: "var(--font-family-latin)" }}>
                      ({titleEn})
                    </span>
                  </h4>

                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.825rem", color: "var(--color-muted, #64748b)", lineHeight: 1.5 }}>
                    {desc}
                  </p>

                  {attempted > 0 && (
                    <div style={{ background: "var(--color-canvas, #f8fafc)", padding: "0.5rem 0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span>وضعیت تمرین:</span>
                        <strong style={{ color: skillAccuracy >= 70 ? "#166534" : "#b45309" }}>
                          {correct} از {attempted} درست ({skillAccuracy}٪)
                        </strong>
                      </div>
                      <div style={{ inlineSize: "100%", blockSize: "5px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                        <div
                          style={{
                            inlineSize: `${skillAccuracy}%`,
                            blockSize: "100%",
                            background: skillAccuracy >= 70 ? "#16a34a" : "#d97706",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={practiceHref}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.65rem 1rem",
                    background: "var(--color-action, #2563eb)",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                  }}
                >
                  شروع ۲۰ سوال اول {titleFa} ←
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide & Pedagogical Tips */}
      <footer
        style={{
          background: "var(--color-canvas, #f8fafc)",
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          fontSize: "0.875rem",
          color: "var(--color-muted, #64748b)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--color-text, #0f172a)", display: "block", marginBottom: "0.5rem" }}>
          💡 راهنمای مطالعه برای نمره ۲۰ امتحان نهایی:
        </strong>
        <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
          <li>در ابتدا ۲۰ سوال پرتکرار از آزمون‌های اخیر به شما ارائه می‌شود تا مهم‌ترین تیپ‌های تستی را بسنجید.</li>
          <li>اگر به پاسخی اشتباه دهید، کادر فوراً قرمز شده و پاسخ صحیح به همراه نکته تشریحی کامل برایتان نمایان می‌شود.</li>
          <li>در صورت پاسخ صحیح، کادر سبز می‌شود و با کلیک بر روی «توضیحات تکمیلی» می‌توانید تحلیل عمیق‌تری را مشاهده کنید.</li>
          <li>با کلیک روی «مایل به حل بیشتر سوال هستم» در انتهای صفحه، کل سوالات نهایی آن مهارت بدون پاک شدن پاسخ‌های قبلی بارگذاری می‌شوند.</li>
        </ul>
      </footer>
    </div>
  );
};
