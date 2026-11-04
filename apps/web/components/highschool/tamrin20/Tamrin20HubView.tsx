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

const LESSON_THEMES: Record<number, { icon: string; highlight: string }> = {
  1: { icon: "🤝", highlight: "حس قدردانی و احترام" },
  2: { icon: "📚", highlight: "فرهنگ لغت و کاربردها" },
  3: { icon: "⚡", highlight: "انرژی‌های پاک و تجدیدپذیر" },
};

const STRATEGY_STEPS = [
  {
    step: 1,
    icon: "🌟",
    title: "شروع با ۲۰ تست طلایی",
    desc: "حل ۲۰ سوال پرتکرار و منتخب از امتحانات نهایی ادوار گذشته برای سنجش سریع مهم‌ترین تیپ‌های تستی.",
  },
  {
    step: 2,
    icon: "⚡",
    title: "بازخورد هوشمند آنی",
    desc: "دریافت فوری رنگ سبز با نکات تکمیلی یا رنگ قرمز همراه با پاسخ تشریحی کامل بلافاصله پس از هر پاسخ.",
  },
  {
    step: 3,
    icon: "🔍",
    title: "تحلیل تشریحی خط‌به‌خط",
    desc: "بررسی عمیق مترادف‌ها، متضادها، تله‌های تستی پرتکرار و ساختارهای گرامری مهم به کار رفته در هر تست.",
  },
  {
    step: 4,
    icon: "🏆",
    title: "تسلط کامل بر ۱۰۰۰ تست",
    desc: "امکان حل نامحدود کل سوالات طبقه‌بندی‌شده آزمون‌های نهایی جهت تثبیت کامل نمره ۲۰ در خردادماه.",
  },
];

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
      <header className={styles.hubHero}>
        <div className={styles.hubHeroGlow} aria-hidden="true" />
        <div className={styles.hubHeroGlowAlt} aria-hidden="true" />

        <div className={styles.hubHeroBadgeRow}>
          <span className={styles.hubHeroBadgeGrade}>
            پایه دوازدهم • Vision 3
          </span>
          <span className={styles.hubHeroBadgeYears}>
            امتحانات نهایی ۱۳۹۸ تا ۱۴۰۴
          </span>
          <span className={styles.hubHeroBadgeGold}>
            ⭐ بیش از ۱۰۰۰ سوال طبقه‌بندی‌شده
          </span>
        </div>

        <h1 className={styles.hubHeroTitle}>
          <span className={styles.hubHeroTitleGold}>تمرین تا ۲۰</span> (زبان انگلیسی پایه دوازدهم)
        </h1>
        <p className={styles.hubHeroDesc}>
          بانک تعاملی و طبقه‌بندی‌شده سوالات امتحانات نهایی به تفکیک درس و مهارت. در هر بخش ابتدا ۲۰ سوال پرتکرار
          و مهم را تمرین کنید؛ با هر پاسخ، بازخورد آنی (سبز با توضیحات تکمیلی یا قرمز با پاسخ صحیح تشریحی) دریافت
          کنید و در انتها به تمام سوالات دسترسی پیدا نمایید.
        </p>

        {/* Live Mini Stats Tracker */}
        {totalAttempted > 0 && (
          <div className={styles.hubStatsDashboard}>
            <div className={styles.hubStatItem}>
              <span className={styles.hubStatLabel}>🎯 سوالات حل شده</span>
              <strong className={styles.hubStatValue}>{totalAttempted}</strong>
            </div>
            <div className={styles.hubStatItem}>
              <span className={styles.hubStatLabel}>✅ پاسخ‌های درست</span>
              <strong className={styles.hubStatValue}>{totalCorrect}</strong>
            </div>
            <div className={styles.hubStatItem}>
              <span className={styles.hubStatLabel}>📊 درصد دقت کلی</span>
              <strong className={styles.hubStatValue}>{accuracy}٪</strong>
            </div>
            <div className={styles.hubStatItem}>
              <span className={styles.hubStatLabel}>⏱️ زمان مطالعه</span>
              <strong className={styles.hubStatValue}>{formatTimeSpentFa(totalTimeSeconds)}</strong>
            </div>
            <Link href="/progress" className={styles.hubStatLink}>
              مشاهده کارنامه تحلیلی کامل در پنل کاربر ←
            </Link>
          </div>
        )}
      </header>

      {/* Lesson Selector Tabs */}
      <section className={styles.hubSection} aria-label="انتخاب درس">
        <div className={styles.hubSectionHeader}>
          <div>
            <h2 className={styles.hubSectionTitle}>
              <span>📚</span> انتخاب درس کتاب انگلیسی ۳ (Vision 3):
            </h2>
            <p className={styles.hubSectionSubtitle}>
              درس مورد نظر را برای حل سوالات طبقه‌بندی‌شده انتخاب کنید:
            </p>
          </div>
        </div>

        <div className={styles.lessonGrid}>
          {[1, 2, 3].map((num) => {
            const lessonObj = ALL_LESSONS[num];
            const isSelected = selectedLessonTab === num;
            const theme = LESSON_THEMES[num] || { icon: "📖", highlight: "" };

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
                className={`${styles.lessonCard} ${isSelected ? styles.lessonCardActive : ""}`}
              >
                <div>
                  <div className={styles.lessonCardTopRow}>
                    <div className={styles.lessonCardIconBox}>
                      {theme.icon}
                    </div>
                    <span className={`${styles.lessonCardPill} ${isSelected ? styles.lessonCardPillActive : ""}`}>
                      درس {num}
                    </span>
                  </div>

                  <strong className={styles.lessonCardTitleFa}>
                    {lessonObj?.titleFa}
                  </strong>
                  <span className={styles.lessonCardTitleEn}>
                    {lessonObj?.titleEn}
                  </span>
                </div>

                <div>
                  {lessonAttempted > 0 ? (
                    <span
                      className={styles.lessonCardProgressTag}
                      style={{
                        background: lessonAcc >= 70 ? "#dcfce7" : "#fef3c7",
                        color: lessonAcc >= 70 ? "#166534" : "#92400e",
                        border: `1px solid ${lessonAcc >= 70 ? "#86efac" : "#fde68a"}`,
                      }}
                    >
                      {lessonAcc >= 70 ? "✅" : "⚠️"} {lessonAcc}٪ دقت ({lessonAttempted} تست)
                    </span>
                  ) : (
                    <span
                      className={styles.lessonCardProgressTag}
                      style={{
                        background: isSelected ? "var(--school-violet-light, #f5f3ff)" : "var(--color-canvas, #f8fafc)",
                        color: isSelected ? "var(--school-violet-base, #6d28d9)" : "var(--color-muted, #64748b)",
                        border: "1px solid var(--color-border, #e2e8f0)",
                      }}
                    >
                      {isSelected ? "✨ درس انتخاب‌شده" : "آماده تمرین"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Lesson: 5 Skills Grid */}
      <section className={styles.hubSection} aria-label={`مهارت‌های درس ${selectedLessonTab}`}>
        <div className={styles.hubSectionHeader}>
          <div>
            <h3 className={styles.hubSectionTitle}>
              <span>🎯</span> مهارت‌های ۵گانه درس {currentLesson.lesson}: {currentLesson.titleFa}
            </h3>
            <p className={styles.hubSectionSubtitle}>
              یک مهارت را انتخاب کنید تا ۲۰ سوال منتخب اولیه برای شما باز شود:
            </p>
          </div>
        </div>

        <div className={styles.skillsGrid}>
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
              <div key={skill} className={styles.skillCard}>
                <div>
                  <div className={styles.skillCardHeader}>
                    <div className={styles.skillIconContainer}>
                      {icon}
                    </div>
                    <span className={styles.skillTotalPill}>
                      {batch?.totalQuestions || 0} سوال نهایی
                    </span>
                  </div>

                  <h4 className={styles.skillTitleFa}>
                    بخش {titleFa}
                    <span className={styles.skillTitleEn}>({titleEn})</span>
                  </h4>

                  <p className={styles.skillDesc}>{desc}</p>

                  <div className={styles.skillGoldenBadge}>
                    <span>⭐</span> شروع با ۲۰ تست منتخب نهایی
                  </div>

                  {attempted > 0 && (
                    <div className={styles.skillProgressWrapper}>
                      <div className={styles.skillProgressMeta}>
                        <span>وضعیت تمرین:</span>
                        <strong style={{ color: skillAccuracy >= 70 ? "#166534" : "#b45309" }}>
                          {correct} از {attempted} درست ({skillAccuracy}٪)
                        </strong>
                      </div>
                      <div className={styles.skillProgressBarOuter}>
                        <div
                          className={styles.skillProgressBarInner}
                          style={{
                            inlineSize: `${skillAccuracy}%`,
                            background: skillAccuracy >= 70 ? "#16a34a" : "#d97706",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Link href={practiceHref} className={styles.skillStartButton}>
                  شروع ۲۰ سوال اول {titleFa} ←
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Golden 20 Strategy Roadmap */}
      <footer className={styles.strategyRoadmap}>
        <div className={styles.strategyHeader}>
          <span style={{ fontSize: "1.4rem" }}>💡</span>
          <h3 className={styles.strategyHeaderTitle}>
            نقشه راه ۴ مرحله‌ای کسب نمره ۲۰ امتحان نهایی زبان دوازدهم
          </h3>
        </div>

        <div className={styles.strategyGrid}>
          {STRATEGY_STEPS.map((st) => (
            <div key={st.step} className={styles.strategyCard}>
              <div className={styles.strategyCardTop}>
                <span className={styles.strategyStepNumber}>{st.step}</span>
                <span className={styles.strategyStepIcon}>{st.icon}</span>
              </div>
              <strong className={styles.strategyCardTitle}>{st.title}</strong>
              <p className={styles.strategyCardDesc}>{st.desc}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};
