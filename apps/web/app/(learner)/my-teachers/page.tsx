"use client";

import React, { useEffect, useState, useId } from "react";
import styles from "./my-teachers.module.css";
import {
  fetchLearnerLinkedTeachers,
  acceptLearnerConsent,
  type LinkedTeacher,
} from "../../../lib/teacher-classes";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function MyTeachersPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [teachers, setTeachers] = useState<LinkedTeacher[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const inviteCodeId = useId();

  const loadTeachers = async () => {
    try {
      const data = await fetchLearnerLinkedTeachers();
      setTeachers(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchLearnerLinkedTeachers()
      .then((data) => {
        if (!cancelled) {
          setTeachers(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);


  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      await acceptLearnerConsent(inviteCode.trim());
      setFeedback({
        type: "success",
        message: isFa
          ? "دعوت‌نامه با موفقیت پذیرفته شد و پیوند آموزشی فعال گردید."
          : "Invitation successfully accepted and educational connection established.",
      });
      setInviteCode("");
      await loadTeachers();
    } catch {
      setFeedback({
        type: "error",
        message: isFa
          ? "کد دعوت نامعتبر است یا قبلاً استفاده شده است."
          : "Invalid invite code or already used.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header Card */}
      <section className={styles.headerCard}>
        <h1 className={styles.title}>
          {isFa ? "اساتید و کلاس‌های من" : "My Teachers & Classes"}
        </h1>
        <p className={styles.description}>
          {isFa
            ? "فهرست اساتیدی که با رضایت شما، به شواهد آموزشی و پیشرفت کلاسی‌تان دسترسی نظارتی دارند."
            : "List of teachers who, with your explicit consent, have supervision access to your educational evidence and class progress."}
        </p>

        <div className={styles.notice}>
          <span>🔒 </span>
          <span>
            {isFa
              ? "حفاظت سخت‌گیرانه از حریم خصوصی: چت‌های هوش مصنوعی اختصاصی، صدای ضبط‌شده و تمرین‌های فردی شما کاملاً محرمانه هستند و اساتید به آن‌ها دسترسی ندارند."
              : "Strict Privacy Boundary: Solo AI roleplays, personal voice recordings, and individual practice sessions are completely confidential and inaccessible to teachers."}
          </span>
        </div>
      </section>

      {/* Accept Invite Code Section */}
      <section className={styles.acceptCard}>
        <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
          {isFa ? "پذیرش دعوت‌نامه و اتصال به کلاس استاد" : "Accept Invitation & Connect to Class"}
        </h2>
        <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
          {isFa
            ? "اگر استاد برای شما کد دعوت اختصاصی ارسال کرده است، آن را وارد نمایید تا با رضایت صریح شما، پیوند آموزشی برقرار شود."
            : "If your teacher sent you an invitation code, enter it below to explicitly grant consent and establish the educational link."}
        </p>

        <form onSubmit={handleAcceptInvite} className={styles.inputGroup}>
          <label htmlFor={inviteCodeId} className="sr-only">
            {isFa ? "کد دعوت اختصاصی" : "Unique Invite Code"}
          </label>
          <input
            id={inviteCodeId}
            className={styles.input}
            type="text"
            required
            placeholder={isFa ? "کد دعوت (مثلاً: 9kL2x...)" : "Invite code (e.g. 9kL2x...)"}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={submitting}
          >
            {submitting
              ? isFa
                ? "در حال تایید…"
                : "Verifying…"
              : isFa
              ? "تایید و اعطای رضایت"
              : "Accept & Grant Consent"}
          </button>
        </form>

        {feedback ? (
          <div
            style={{
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control)",
              fontSize: "var(--font-size-meta)",
              backgroundColor: feedback.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
              color: feedback.type === "success" ? "var(--color-success-text)" : "var(--color-error-text)",
              border: `1px solid ${feedback.type === "success" ? "var(--color-success-border)" : "var(--color-error-border)"}`,
            }}
            role="status"
          >
            {feedback.message}
          </div>
        ) : null}
      </section>

      {/* Teachers List */}
      <section aria-label={isFa ? "فهرست اساتید" : "Teachers List"}>
        <h2 style={{ margin: "0 0 var(--space-4) 0", fontSize: "var(--font-size-title)", fontWeight: 700 }}>
          {isFa ? "اساتید فعال" : "Active Instructors"}
        </h2>

        {loading ? (
          <p style={{ color: "var(--color-muted)" }}>{isFa ? "در حال بارگیری…" : "Loading…"}</p>
        ) : teachers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {isFa
                ? "شما در حال حاضر با هیچ استادی پیوند آموزشی فعال ندارید."
                : "You do not currently have any active teacher relationships."}
            </p>
          </div>
        ) : (
          <div className={styles.teachersGrid}>
            {teachers.map((item) => (
              <article key={item.link_id} className={styles.teacherCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ margin: 0, fontSize: "var(--font-size-body)", fontWeight: 700 }}>
                    {item.class_title}
                  </h3>
                  <span className={styles.badge}>{item.level}</span>
                </div>
                <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                  {isFa ? `استاد: ${item.teacher_email}` : `Teacher: ${item.teacher_email}`}
                </p>
                <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", borderBlockStart: "1px solid var(--color-border)", paddingBlockStart: "var(--space-2)" }}>
                  {item.consent_given_at
                    ? isFa
                      ? `تاریخ تایید: ${new Date(item.consent_given_at).toLocaleDateString("fa-IR")}`
                      : `Consent Date: ${new Date(item.consent_given_at).toLocaleDateString("en-US")}`
                    : ""}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
