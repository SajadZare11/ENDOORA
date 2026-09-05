"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTeacherHome } from "../../../../../components/teacher/TeacherShell";
import styles from "../../../../../components/teacher/teacher-foundation.module.css";

export default function NewFixedClassFoundationPage() {
  const { data, locale } = useTeacherHome();
  const isFa = locale === "fa";
  const verified = Boolean(data.capabilities.teacher_verified);

  const [title, setTitle] = useState(isFa ? "دوره فشرده مکالمه و تقویت روان‌زبانی B1" : "B1 Conversational Fluency Intensive");
  const [cefrLevel, setCefrLevel] = useState("B1");
  const [skill, setSkill] = useState("Speaking");
  const [capacity, setCapacity] = useState("6");
  const [sessions, setSessions] = useState("8");
  const [schedule, setSchedule] = useState(isFa ? "دوشنبه و چهارشنبه ۱۸:۳۰ تا ۲۰:۰۰" : "Mon & Wed 18:30 - 20:00 IRST");
  const [priceTomans, setPriceTomans] = useState("1,650,000");
  const [syllabus, setSyllabus] = useState(
    isFa
      ? "تمرکز بر رفع خطاهای ساختاری انتقال زبان اول فارسی، تمرین نقش‌آفرینی زنده و یادگیری واژگان کاربردی سطح B1."
      : "Focusing on eliminating Persian L1 transfer interference, live conversational roleplay, and B1 lexical range."
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveDraft = () => {
    setStatusMessage(
      isFa
        ? "پیش‌نویس کلاس با موفقیت ذخیره شد. می‌توانید بعداً از بخش کلاس‌های من ویرایش کنید."
        : "Class draft saved successfully. You can resume editing anytime from My Classes."
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!verified) {
      setStatusMessage(
        isFa
          ? "برای انتشار نهایی و دریافت رزرو زبان‌آموزان، احراز هویت مدرسی الزامی است. پیش‌نویس شما ذخیره شد."
          : "Teacher verification is required before publishing live enrollments. Your draft has been saved."
      );
      return;
    }
    setStatusMessage(
      isFa
        ? "کلاس شما برای بازبینی کیفی ارسال شد و ظرف حداکثر ۲۴ ساعت کاری در تقویم عمومی قرار می‌گیرد."
        : "Class submitted for quality review. It will appear on the public timetable within 24 hours."
    );
  };

  return (
    <section className={`teacher-foundation-page ${styles.pageContainer}`}>
      {/* Header Card */}
      <div className={styles.headerCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-2)" }}>
          <div>
            <h1 className={styles.title}>{isFa ? "ایجاد کلاس ثابت جدید" : "Create New Fixed Class"}</h1>
            <p className={styles.description}>
              {isFa
                ? "طراحی و زمان‌بندی دوره گروهی ساختاریافته برای زبان‌آموزان با جلسات هفتگی منظم و اهداف یادگیری معین."
                : "Design and schedule a structured group course for Endoora learners with weekly milestones."}
            </p>
          </div>
          <span className={`${styles.badge} ${verified ? styles.badgeSuccess : styles.badgeWarning}`}>
            {verified
              ? isFa ? "✓ حساب مدرسی تأیید شده" : "✓ Teacher Verified"
              : isFa ? "⚠ نیازمند احراز هویت" : "⚠ Verification Required"}
          </span>
        </div>

        {/* Verification Status Alert */}
        <div className={`teacher-foundation-notice ${styles.notice}`} role="status">
          {verified
            ? isFa
              ? "مدرس گرامی، حساب شما تأیید شده است. پس از ذخیره یا ارسال، کلاس شما وارد برنامه آموزشی مدرسان فعال خواهد شد."
              : "Teacher verified. Your submitted class will enter the active course catalog upon final submission."
            : isFa
              ? "ایجاد کلاس پولی قبل از تأیید نهایی نیازمند احراز هویت است. می‌توانید پیش‌نویس را آماده کنید و پس از تأیید مدارک، کلاس را منتشر نمایید."
              : "Paid class publishing requires teacher verification. You can configure this draft now, and publish once your credentials are confirmed."}
        </div>

        {statusMessage && (
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-control)",
              background: "var(--color-success-bg)",
              color: "var(--color-success-text)",
              border: "1px solid var(--color-border)",
              fontWeight: 600,
              fontSize: "var(--font-size-meta)",
              marginBlockEnd: "var(--space-4)",
            }}
            role="status"
          >
            {statusMessage}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className={styles.contentCard} style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="class-title" className={styles.formLabel}>
                {isFa ? "عنوان دوره / کلاس *" : "Class Title *"}
              </label>
              <input
                id="class-title"
                className={styles.formInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={isFa ? "مثال: دوره فشرده رایتینگ تسک ۲" : "e.g. IELTS Writing Task 2 Masterclass"}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cefr-level" className={styles.formLabel}>
                {isFa ? "سطح هدف CEFR" : "Target CEFR Level"}
              </label>
              <select
                id="cefr-level"
                className={styles.formSelect}
                value={cefrLevel}
                onChange={(e) => setCefrLevel(e.target.value)}
              >
                <option value="A1">A1 - Breakthrough</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class-skill" className={styles.formLabel}>
                {isFa ? "مهارت اصلی" : "Primary Skill Focus"}
              </label>
              <select
                id="class-skill"
                className={styles.formSelect}
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                <option value="Speaking">{isFa ? "مکالمه (Speaking)" : "Speaking"}</option>
                <option value="Writing">{isFa ? "نگارش (Writing)" : "Writing"}</option>
                <option value="Listening">{isFa ? "شنیداری (Listening)" : "Listening"}</option>
                <option value="Grammar">{isFa ? "گرامر و ساختار" : "Grammar"}</option>
                <option value="IELTS">{isFa ? "آمادگی آزمون آیلتس" : "IELTS Prep"}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class-capacity" className={styles.formLabel}>
                {isFa ? "حداکثر ظرفیت (نفر)" : "Max Capacity (Learners)"}
              </label>
              <input
                id="class-capacity"
                type="number"
                min="2"
                max="15"
                className={styles.formInput}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class-sessions" className={styles.formLabel}>
                {isFa ? "تعداد جلسات" : "Total Sessions"}
              </label>
              <input
                id="class-sessions"
                type="number"
                min="1"
                max="30"
                className={styles.formInput}
                value={sessions}
                onChange={(e) => setSessions(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class-schedule" className={styles.formLabel}>
                {isFa ? "زمان‌بندی جلسات" : "Weekly Schedule"}
              </label>
              <input
                id="class-schedule"
                className={styles.formInput}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder={isFa ? "مثال: شنبه و چهارشنبه ۱۸:۰۰ تا ۱۹:۳۰" : "e.g. Saturdays & Tuesdays 18:00 - 19:30"}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class-price" className={styles.formLabel}>
                {isFa ? "شهریه کل دوره (تومان)" : "Tuition Fee (Tomans)"}
              </label>
              <input
                id="class-price"
                className={styles.formInput}
                value={priceTomans}
                onChange={(e) => setPriceTomans(e.target.value)}
                placeholder="1,500,000"
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="class-syllabus" className={styles.formLabel}>
                {isFa ? "سرفصل و اهداف آموزشی دوره" : "Syllabus & Learning Outcomes"}
              </label>
              <textarea
                id="class-syllabus"
                className={styles.formInput}
                rows={3}
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                style={{ resize: "vertical", minHeight: "5rem" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={styles.buttonRow}>
            <button
              type="submit"
              className="teacher-button teacher-button--primary"
            >
              {isFa ? "ثبت و ارسال کلاس" : "Submit Class for Review"}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="teacher-button teacher-button--secondary"
            >
              {isFa ? "ذخیره پیش‌نویس" : "Save Draft"}
            </button>
            <Link
              className="teacher-button teacher-button--secondary"
              href={verified ? "/teacher/classes" : "/account/profile"}
            >
              {verified
                ? isFa ? "بازگشت به کلاس‌ها" : "Back to Classes"
                : isFa ? "تکمیل پروفایل مدرسی" : "Complete Teacher Profile"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
