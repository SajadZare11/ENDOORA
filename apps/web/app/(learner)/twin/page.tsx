"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface SkillEvidence {
  id: string;
  nameFa: string;
  nameEn: string;
  evidenceCount: number;
  confidence: "high" | "medium" | "low";
  lastVerifiedFa: string;
  lastVerifiedEn: string;
  detailsFa: string;
  detailsEn: string;
}

const TWIN_SKILLS: SkillEvidence[] = [
  {
    id: "grammar",
    nameFa: "دستور زبان (Grammar)",
    nameEn: "Grammar & Structure",
    evidenceCount: 14,
    confidence: "high",
    lastVerifiedFa: "۲ روز پیش در مأموریت روزانه",
    lastVerifiedEn: "2 days ago in Daily Mission",
    detailsFa: "پوشش زمان‌های گذشته استمراری، حال کامل، شرطی‌ها و مجهول",
    detailsEn: "Past continuous, present perfect, conditionals, and passive voice",
  },
  {
    id: "vocabulary",
    nameFa: "واژگان و هم‌آیی (Vocabulary)",
    nameEn: "Vocabulary & Collocations",
    evidenceCount: 28,
    confidence: "high",
    lastVerifiedFa: "امروز در سیستم تکرار فاصله‌دار",
    lastVerifiedEn: "Today in Spaced Repetition",
    detailsFa: "تسلط بر واژگان دانشگاهی، اصطلاحات تجاری و ترکیب‌های همنشین",
    detailsEn: "Academic word list, workplace phrases, and contextual collocations",
  },
  {
    id: "reading",
    nameFa: "درک مطلب (Reading)",
    nameEn: "Reading Comprehension",
    evidenceCount: 8,
    confidence: "medium",
    lastVerifiedFa: "در آزمون تعیین سطح",
    lastVerifiedEn: "During Placement Test",
    detailsFa: "استخراج ایده اصلی، جزییات صریح و استنباط پیام ضمنی",
    detailsEn: "Gist extraction, explicit details, and contextual inference",
  },
  {
    id: "listening",
    nameFa: "شنیداری (Listening)",
    nameEn: "Listening Comprehension",
    evidenceCount: 6,
    confidence: "medium",
    lastVerifiedFa: "در بخش صوتی تعیین سطح",
    lastVerifiedEn: "During Audio Placement",
    detailsFa: "درک مکالمات روزمره فرودگاهی، ایستگاه قطار و سخنرانی‌های کوتاه",
    detailsEn: "Announcements, workplace dialogues, and academic mini-lectures",
  },
  {
    id: "speaking",
    nameFa: "گفتاری (Speaking)",
    nameEn: "Speaking & Articulation",
    evidenceCount: 4,
    confidence: "medium",
    lastVerifiedFa: "در آزمایشگاه صدا و تبدیل گفتار به متن",
    lastVerifiedEn: "During Voice STT Diagnostic",
    detailsFa: "روان‌گویی کلامی، تنوع ساختاری و کفایت طول پاسخ شفاهی",
    detailsEn: "Oral fluency, lexical variety, and spoken duration sufficiency",
  },
  {
    id: "writing",
    nameFa: "نگارش (Writing)",
    nameEn: "Writing & Composition",
    evidenceCount: 5,
    confidence: "medium",
    lastVerifiedFa: "در ویرایشگر مقاله‌نویسی",
    lastVerifiedEn: "During Essay Diagnostic",
    detailsFa: "انسجام پاراگراف، علائم نگارشی استاندارد و غنای واژگانی",
    detailsEn: "Paragraph cohesion, formal punctuation, and lexical sophistication",
  },
];

export default function LearnerTwinPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<"skills" | "history" | "controls">("skills");
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const placementCompleted =
    data.path_steps?.find((step) => step.id === "placement")?.state === "complete";

  function handleResetEvidence() {
    setResetNotice(
      isFa
        ? "درخواست بررسی شواهد ثبت شد. شواهد اولیه حفظ می‌شوند و ارزیابی مجدد پس از انجام تست جدید فعال خواهد شد."
        : "Evidence recalibration requested. Historic evidence remains audit-safe while new diagnostics take precedence."
    );
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "دوقلوی یادگیری (Learner Digital Twin)" : "Learner Digital Twin & Model"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "دوقلوی یادگیری Endoora تصویری زنده، قابل بازبینی و شفاف از تسلط زبانی شماست که صرفاً با شواهد واقعی تغذیه می‌شود؛ بدون حدس‌های روانشناختی یا برچسب‌زنی نامرئی."
                : "The Endoora Learner Twin is an explainable, user-auditable digital profile reflecting your verified language competency strictly grounded in evidence."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {placementCompleted
              ? isFa
                ? "مدل فعال بر پایه شواهد"
                : "Active Evidence Model"
              : isFa
              ? "نیازمند ارزیابی اولیه"
              : "Calibrating"}
          </span>
        </div>

        {/* Immersive Twin Orb Representation from Volume 1/4 */}
        <div className={styles.twinOrbContainer}>
          <div className={styles.twinOrb} aria-label={isFa ? "هسته هوشمند دوقلوی یادگیری" : "Twin Intelligence Core"}>
            <span aria-hidden="true">✦</span>
          </div>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/path">
            {isFa ? "مشاهده مسیر یادگیری مبتنی بر دوقلو" : "View Personalized Path"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            {isFa ? "بررسی شواهد کارنامه" : "Inspect Diagnostic Evidence"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "تغذیه مدل با مأموریت امروز" : "Feed with Daily Mission"}
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <section className={styles.card}>
        <div className={styles.filterBar} role="tablist">
          <button
            type="button"
            className={`${styles.filterPill} ${activeTab === "skills" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            {isFa ? "شواهد ۶ مهارت اصلی" : "6-Skill Evidence Matrix"}
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeTab === "history" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveTab("history")}
          >
            {isFa ? "تاریخچه ثبت شواهد" : "Calibration History"}
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeTab === "controls" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveTab("controls")}
          >
            {isFa ? "کنترل‌ها و حریم خصوصی" : "Privacy & Evidence Controls"}
          </button>
        </div>

        {activeTab === "skills" && (
          <div>
            <h2 className={styles.cardTitle}>
              {isFa ? "ماتریس شواهد مستند ۶ مهارت" : "Verified 6-Skill Evidence Matrix"}
            </h2>
            <p className={styles.cardDescription}>
              {isFa
                ? "هر مهارت فقط به میزانی که شواهد آموزشی معتبر دارد گزارش می‌شود. هیچ پیش‌فرضی بدون آزمون پذیرفته نیست."
                : "Every skill confidence level correlates directly with empirical evidence volume gathered from diagnostics and exercises."}
            </p>

            <div className={styles.skillsGrid}>
              {TWIN_SKILLS.map((item) => (
                <article className={styles.skillCard} key={item.id}>
                  <div className={styles.skillCardHeader}>
                    <h3 className={styles.skillCardTitle}>{isFa ? item.nameFa : item.nameEn}</h3>
                    <span
                      style={{
                        fontSize: "var(--font-size-meta)",
                        fontWeight: 700,
                        padding: "2px var(--space-2)",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--color-info-bg)",
                        color: "var(--color-info-text)",
                      }}
                    >
                      {item.evidenceCount} {isFa ? "شاهد" : "evidence"}
                    </span>
                  </div>

                  <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", lineHeight: 1.6, margin: "var(--space-2) 0" }}>
                    {isFa ? item.detailsFa : item.detailsEn}
                  </p>

                  <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-2)" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "آخرین بازبینی: " : "Last verified: "}</span>
                    <strong>{isFa ? item.lastVerifiedFa : item.lastVerifiedEn}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className={styles.cardTitle}>{isFa ? "سوابق کالیبراسیون دوقلو" : "Calibration Log"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBlock: "var(--space-4)" }}>
              {[
                {
                  dateFa: "امروز",
                  dateEn: "Today",
                  eventFa: "ثبت ۳ پاسخ موفق در تمرین مأموریت روزانه و به‌روزرسانی نمره گرامر",
                  eventEn: "Recorded 3 correct steps in Daily Mission, updating grammar calibration",
                },
                {
                  dateFa: "۳ روز پیش",
                  dateEn: "3 days ago",
                  eventFa: "تکمیل آزمون ۶ مهارته تعیین سطح با نمره معتبر و تولید اولین نسخه دوقلو",
                  eventEn: "Completed 6-skill placement session, generating baseline twin model",
                },
                {
                  dateFa: "۵ روز پیش",
                  dateEn: "5 days ago",
                  eventFa: "ایجاد حساب کاربری و تعیین اهداف یادگیری در فرآیند آنبوردینگ",
                  eventEn: "Created account and configured learning targets during onboarding",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    background: "var(--color-canvas)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-control)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "var(--space-3)",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
                    {isFa ? log.eventFa : log.eventEn}
                  </span>
                  <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                    {isFa ? log.dateFa : log.dateEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "controls" && (
          <div>
            <h2 className={styles.cardTitle}>{isFa ? "اختیارات و حریم خصوصی زبان‌آموز" : "Learner Privacy & Transparency"}</h2>
            <p className={styles.cardDescription}>
              {isFa
                ? "بر طبق تعهدات حریم خصوصی Endoora، شما کنترل کامل بر داده‌های آموزشی خود دارید. اطلاعات شما هرگز فروخته نمی‌شود و بدون اجازه به اشتراک گذاشته نمی‌شود."
                : "In adherence to Endoora privacy contracts, you hold complete sovereignty over your learning model. No personality profiling or hidden assessments."}
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlock: "var(--space-4)" }}>
              <button type="button" className={styles.buttonSecondary} onClick={handleResetEvidence}>
                {isFa ? "درخواست بازنگری و کالیبراسیون شواهد" : "Request Evidence Recalibration"}
              </button>
              <Link className={styles.buttonSecondary} href="/account/data-controls">
                {isFa ? "خروجی کامل داده‌ها (Data Export)" : "GDPR Data Controls"}
              </Link>
            </div>

            {resetNotice && (
              <div className={`${styles.feedbackBox} ${styles.feedbackBoxSuccess}`} role="status">
                {resetNotice}
              </div>
            )}
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): دوقلوی یادگیری Endoora هرگز ادعای ارزیابی روانشناختی یا پیش‌بینی هوش نمی‌کند و صرفاً تسلط بر شواهد عینی زبان انگلیسی را مدل‌سازی می‌نماید."
            : "Product Constitution Rule #8 Disclosure: The Endoora Learner Twin never generates psychological inferences or ungrounded IQ/cognitive metrics, focusing strictly on objective CEFR linguistic competencies."}
        </footer>
      </section>
    </div>
  );
}
