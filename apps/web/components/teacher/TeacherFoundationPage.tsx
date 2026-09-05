"use client";

import Link from "next/link";
import { useTeacherHome } from "./TeacherShell";
import styles from "./teacher-foundation.module.css";

interface TeacherFoundationPageProps {
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
}

export function TeacherFoundationPage({
  titleFa,
  titleEn,
  bodyFa,
  bodyEn,
}: TeacherFoundationPageProps) {
  const { data, locale } = useTeacherHome();
  const isFa = locale === "fa";
  const verified = data.capabilities.teacher_verified;

  const isClasses = titleFa.includes("کلاس") || titleEn.toLowerCase().includes("class");
  const isResources = titleFa.includes("منابع") || titleEn.toLowerCase().includes("resource");
  const isQuestions = titleFa.includes("سؤال") || titleEn.toLowerCase().includes("question");
  const isRequests = titleFa.includes("درخواست") || titleEn.toLowerCase().includes("request");

  return (
    <section className={`teacher-foundation-page ${styles.pageContainer}`}>
      {/* Header Card */}
      <div className={styles.headerCard}>
        <h1 className={styles.title}>{isFa ? titleFa : titleEn}</h1>
        <p className={styles.description}>{isFa ? bodyFa : bodyEn}</p>

        <div className={`teacher-foundation-notice ${styles.notice}`} role="status">
          {isFa
            ? "این بخش اکنون مسیر، دسترسی و وضعیت امن را نشان می‌دهد. عملیات واقعی فقط پس از ساخته‌شدن مدل و داده همان دامنه فعال می‌شود."
            : "This area currently provides its safe route, access state, and guidance. Real operations activate only after that domain's models and data exist."}
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{isFa ? "وضعیت حساب مدرس" : "Teacher Status"}</span>
            <span className={styles.statValue} style={{ fontSize: "1.5rem" }}>
              {verified ? (isFa ? "تأییدشده ✓" : "Verified ✓") : (isFa ? "در انتظار تأیید" : "Unverified")}
            </span>
            <span className={styles.statSubtext}>
              {verified ? (isFa ? "دسترسی تدریس فعال" : "Teaching Active") : (isFa ? "قابلیت تدریس محدود" : "Capabilities Gated")}
            </span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>{isFa ? "جلسات فعال" : "Active Sessions"}</span>
            <span className={styles.statValue}>۰</span>
            <span className={styles.statSubtext}>{isFa ? "ثبت‌شده برای این ماه" : "recorded this month"}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>{isFa ? "دانش‌آموزان متصل" : "Connected Learners"}</span>
            <span className={styles.statValue}>۰</span>
            <span className={styles.statSubtext}>{isFa ? "بدون ارقام ساختگی" : "honest metrics"}</span>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Link className="teacher-button teacher-button--secondary" href="/teacher">
            {isFa ? "بازگشت به خانه مدرس" : "Back to teacher home"}
          </Link>
          {isClasses && (
            <Link className="teacher-button teacher-button--primary" href="/teacher/fixed-classes/new">
              {isFa ? "ایجاد کلاس جدید" : "Create New Class"}
            </Link>
          )}
          {isQuestions && (
            <Link className="teacher-button teacher-button--primary" href="/content/questions">
              {isFa ? "مشاهده بانک سؤالات تعاملی" : "Explore Question Bank"}
            </Link>
          )}
        </div>
      </div>

      {/* Domain-specific Preview Content */}
      {isClasses && (
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>
            <span aria-hidden="true">📅</span>
            {isFa ? "برنامه کلاس‌های آینده و فهرست زبان‌آموزان" : "Upcoming Classes & Student Roster"}
          </h2>
          <p className={styles.description}>
            {isFa
              ? "پس از تکمیل احراز هویت مدرس و آغاز ثبت‌نام دوره‌ها، جلسات زمان‌بندی‌شده در این جدول مدیریت می‌شوند."
              : "Once teacher verification and enrollment cycles open, scheduled sessions will be managed in this table."}
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>{isFa ? "عنوان کلاس" : "Class Title"}</th>
                <th>{isFa ? "سطح CEFR" : "Target Level"}</th>
                <th>{isFa ? "ظرفیت / ثبت‌نام" : "Capacity"}</th>
                <th>{isFa ? "زمان برگزاری" : "Schedule"}</th>
                <th>{isFa ? "وضعیت" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{isFa ? "مکالمه فشرده بازرگانی (نمونه)" : "Intensive Business Speaking (Sample)"}</strong></td>
                <td><span className={styles.badge}>B1 - B2</span></td>
                <td>۰ / ۵ {isFa ? "نفر" : "students"}</td>
                <td>{isFa ? "دوشنبه و چهارشنبه ۱۸:۰۰" : "Mon & Wed 18:00"}</td>
                <td><span className={`${styles.badge} ${styles.badgeWarning}`}>{isFa ? "در انتظار تأیید" : "Pending Verification"}</span></td>
              </tr>
              <tr>
                <td><strong>{isFa ? "آمادگی مهارت رایتینگ آیلتس (نمونه)" : "IELTS Writing Task 2 Lab (Sample)"}</strong></td>
                <td><span className={styles.badge}>B2</span></td>
                <td>۰ / ۴ {isFa ? "نفر" : "students"}</td>
                <td>{isFa ? "یکشنبه و سه‌شنبه ۱۹:۳۰" : "Sun & Tue 19:30"}</td>
                <td><span className={`${styles.badge} ${styles.badgeWarning}`}>{isFa ? "در انتظار تأیید" : "Pending Verification"}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {isResources && (
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>
            <span aria-hidden="true">📚</span>
            {isFa ? "مجموعه منابع و استانداردهای آموزشی Endoora" : "Endoora Teaching Standards & Curricula"}
          </h2>
          <div className={styles.resourceGrid}>
            {[
              {
                titleFa: "شیوه‌نامه سنجش ۶ مهارته CEFR",
                titleEn: "6-Skill CEFR Assessment Rubrics",
                metaFa: "دستورالعمل‌های استاندارد نمره‌دهی برای بخش‌های نگارش و گفتار",
                metaEn: "Official grading criteria for Writing task rubrics and Speaking pronunciation",
              },
              {
                titleFa: "راهنمای تداخل‌های متداول زبان فارسی (L1 Transfer)",
                titleEn: "Iranian Learner L1 Transfer Guide",
                metaFa: "تحلیل ریشه‌ای خطاهای گرامری و استرس سیلاب‌ها برای مدرسین",
                metaEn: "Root cause analysis of Persian grammatical interference and stress shifts",
              },
              {
                titleFa: "طرح درس‌های تعاملی سطوح A1 تا B2",
                titleEn: "Interactive Lesson Plan Blueprints",
                metaFa: "سرفصل‌های مصوب کلاسی منطبق با مهارت‌های آزمون تعیین سطح",
                metaEn: "Approved syllabi and classroom worksheets mapped to placement skills",
              },
              {
                titleFa: "بانک نمونه سوالات و آزمونک‌های هفتگی",
                titleEn: "Weekly Diagnostic Quiz Templates",
                metaFa: "سوالات استاندارد تکرار فاصله‌دار برای تثبیت واژگان کلاسی",
                metaEn: "Spaced repetition quiz blueprints for consolidating class vocabulary",
              },
            ].map((res, idx) => (
              <div key={idx} className={styles.resourceCard}>
                <div>
                  <h3 className={styles.resourceTitle}>{isFa ? res.titleFa : res.titleEn}</h3>
                  <p className={styles.resourceMeta}>{isFa ? res.metaFa : res.metaEn}</p>
                </div>
                <button type="button" className="teacher-button teacher-button--secondary" style={{ alignSelf: "flex-start", padding: "var(--space-1) var(--space-3)", fontSize: "var(--font-size-meta)" }}>
                  {isFa ? "مشاهده سرفصل" : "View Outline"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isRequests && (
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>
            <span aria-hidden="true">⚡</span>
            {isFa ? "تابلوی درخواست‌های آنی زبان‌آموزان (Learn Now)" : "Learn Now Student Request Board"}
          </h2>
          <p className={styles.description}>
            {isFa
              ? "درخواست‌های فوری زبان‌آموزانی که نیازمند جلسه رفع اشکال یا آمادگی آزمون هستند در این بخش نمایش داده می‌شود."
              : "Live urgent tutoring requests from learners requiring immediate diagnostic assistance appear here."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBlock: "var(--space-4)" }}>
            {[
              {
                skillFa: "رفع اشکال رایتینگ تسک ۲ آیلتس",
                skillEn: "IELTS Writing Task 2 Review",
                level: "B2",
                timeFa: "امروز ساعت ۲۰:۰۰ (۴۵ دقیقه)",
                timeEn: "Today 20:00 (45 mins)",
                rateFa: "۲۸۰,۰۰۰ تومان",
                rateEn: "280,000 Tomans",
              },
              {
                skillFa: "تمرین روان‌گویی مکالمه مصاحبه کاری",
                skillEn: "Job Interview Speaking Practice",
                level: "B1",
                timeFa: "فردا ساعت ۱۸:۳۰ (۳۰ دقیقه)",
                timeEn: "Tomorrow 18:30 (30 mins)",
                rateFa: "۲۲۰,۰۰۰ تومان",
                rateEn: "220,000 Tomans",
              },
            ].map((req, idx) => (
              <div
                key={idx}
                style={{
                  padding: "var(--space-4)",
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBlockEnd: "var(--space-1)" }}>
                    <strong style={{ color: "var(--color-text)" }}>{isFa ? req.skillFa : req.skillEn}</strong>
                    <span className={styles.badge}>{req.level}</span>
                  </div>
                  <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                    {isFa ? req.timeFa : req.timeEn} • {isFa ? req.rateFa : req.rateEn}
                  </span>
                </div>
                <button
                  type="button"
                  className="teacher-button teacher-button--primary"
                  disabled={!verified}
                  style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--font-size-meta)" }}
                >
                  {verified
                    ? isFa ? "پذیرش درخواست" : "Accept Request"
                    : isFa ? "نیاز به تأیید مدرس" : "Requires Verification"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
