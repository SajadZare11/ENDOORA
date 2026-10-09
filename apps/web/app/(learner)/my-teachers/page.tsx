"use client";

import React, { useEffect, useState, useId } from "react";
import Link from "next/link";
import { Button, Input } from "@endoora/ui";
import styles from "./my-teachers.module.css";
import {
  fetchLearnerLinkedTeachers,
  acceptLearnerConsent,
  joinClassByCode,
  type LinkedTeacher,
} from "../../../lib/teacher-classes";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { AdobeConnectLauncherModal } from "../../../components/classroom/AdobeConnectLauncherModal";
import { checkClassroomAccess } from "../../../lib/classroom-schedule";

export default function MyTeachersPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [teachers, setTeachers] = useState<LinkedTeacher[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedClassForLauncher, setSelectedClassForLauncher] = useState<LinkedTeacher | null>(null);

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


  const handleCopyClassCode = async (code: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inviteCode.trim();
    if (!clean) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      // Check if code is a 7-digit numeric class code
      if (/^\d{7}$/.test(clean)) {
        const res = await joinClassByCode(clean);
        setFeedback({
          type: "success",
          message: res.message || (isFa
            ? `با موفقیت با کد اختصاصی ${clean} در کلاس «${res.class_title}» ثبت‌نام شدید.`
            : `Successfully enrolled in class "${res.class_title}" using code ${clean}.`),
        });
      } else {
        // Otherwise treat as invite code
        await acceptLearnerConsent(clean);
        setFeedback({
          type: "success",
          message: isFa
            ? "دعوت‌نامه با موفقیت پذیرفته شد و پیوند آموزشی برقرار گردید."
            : "Invitation successfully accepted and educational connection established.",
        });
      }
      setInviteCode("");
      await loadTeachers();
    } catch (err: unknown) {
      const errObj = err as { detail?: string; message?: string };
      setFeedback({
        type: "error",
        message: errObj?.detail || errObj?.message || (isFa
          ? "کد وارد شده نامعتبر است یا کلاسی با این کد یافت نشد."
          : "Invalid code or no class found with this code."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTeachers = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => {
      const matchTitle = t.class_title?.toLowerCase().includes(q);
      const matchTeacher = (t.teacher_name || t.teacher_email || "").toLowerCase().includes(q);
      const matchSubject = t.subject?.toLowerCase().includes(q);
      const matchCode = (t.code || t.class_code || "").toLowerCase().includes(q);
      return matchTitle || matchTeacher || matchSubject || matchCode;
    });
  }, [teachers, searchQuery]);

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

        <div style={{ marginBlockStart: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
          <Link
            href="/learn/now"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              paddingInline: "var(--space-4)",
              paddingBlock: "var(--space-2)",
              backgroundColor: "var(--color-primary-600)",
              color: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontSize: "var(--font-size-sm)",
              fontWeight: 600,
            }}
          >
            ⚡ {isFa ? "درخواست جلسه جدید با مدرس (Learn Now)" : "Request New Session (Learn Now)"}
          </Link>
          <Link
            href="/bookings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              backgroundColor: "transparent",
              color: "var(--color-primary-600)",
              border: "1px solid var(--color-primary-600)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontSize: "var(--font-size-sm)",
              fontWeight: 600,
            }}
          >
            🗓 {isFa ? "مشاهده جلسات و رزروها" : "View Booked Sessions"}
          </Link>
          <Link
            href="/teachers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              backgroundColor: "transparent",
              color: "var(--color-primary-600)",
              border: "1px solid var(--color-primary-600)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontSize: "var(--font-size-sm)",
              fontWeight: 600,
            }}
          >
            👥 {isFa ? "مشاهده بانک مدرسان ایندورا" : "Browse All Teachers"}
          </Link>
        </div>
      </section>

      {/* Accept Invite Code Section */}
      <section className={styles.acceptCard}>
        <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
          {isFa ? "عضویت در کلاس با کد ۷ رقمی یا کد دعوت استاد" : "Join Class via 7-Digit Code or Teacher Invite"}
        </h2>
        <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
          {isFa
            ? "اگر استاد به شما کد اختصاصی ۷ رقمی کلاس داده است یا کد دعوت ارسال نموده، آن را در کادر زیر وارد کنید تا مستقیماً به کلاس متصل شوید."
            : "If your teacher gave you a unique 7-digit class code or sent an invite code, enter it below to join directly."}
        </p>

        <form onSubmit={handleAcceptInvite} className={styles.inputGroup}>
          <label htmlFor={inviteCodeId} className="sr-only">
            {isFa ? "کد ۷ رقمی کلاس یا کد دعوت" : "7-Digit Class Code or Invite Code"}
          </label>
          <Input
            id={inviteCodeId}
            type="text"
            required
            placeholder={isFa ? "کد ۷ رقمی کلاس (مثلاً ۲۸۹۹۷۱۷) یا کد دعوت..." : "7-digit class code (e.g. 2899717) or invite code..."}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={submitting}
          >
            {submitting
              ? isFa
                ? "در حال تایید…"
                : "Verifying…"
              : isFa
              ? "ورود و ثبت‌نام در کلاس"
              : "Join & Connect"}
          </Button>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)", marginBlockEnd: "var(--space-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
            {isFa ? "کلاس‌ها و اساتید فعال من" : "My Active Classes & Instructors"}
          </h2>
          {teachers.length > 0 && (
            <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)", background: "var(--color-surface-subtle)", padding: "3px 10px", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
              {isFa ? `${filteredTeachers.length} از ${teachers.length} کلاس` : `${filteredTeachers.length} / ${teachers.length} Classes`}
            </span>
          )}
        </div>

        {/* Search filter for learner's classes */}
        {teachers.length > 0 && (
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <Input
              type="text"
              placeholder={isFa ? "🔍 جستجو در کلاس‌ها با عنوان، نام استاد یا کد ۷ رقمی کلاس..." : "🔍 Search classes by title, teacher, or 7-digit code..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {loading ? (
          <p style={{ color: "var(--color-muted)" }}>{isFa ? "در حال بارگیری…" : "Loading…"}</p>
        ) : teachers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {isFa
                ? "شما در حال حاضر در هیچ کلاسی عضو نشده‌اید. با وارد کردن کد ۷ رقمی کلاس می‌توانید به کلاس اضافه شوید."
                : "You do not currently have any active classes. Enter a 7-digit class code above to join."}
            </p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {isFa
                ? "هیچ کلاسی با این عنوان یا کد ۷ رقمی یافت نشد."
                : "No classes match your search query."}
            </p>
          </div>
        ) : (
          <div className={styles.teachersGrid}>
            {filteredTeachers.map((item) => {
              const scheduleDays =
                item.schedule_days && item.schedule_days.length > 0
                  ? item.schedule_days
                  : ["شنبه", "دوشنبه"];
              const startTime = item.schedule_time_start || "18:00";
              const endTime = item.schedule_time_end || "19:30";
              const accessStatus = checkClassroomAccess({
                scheduleDays,
                startTime,
                endTime,
                meetingUrl: item.meeting_url,
                adobeConnectUrl: item.adobe_connect_url,
                adobeConnectAppUrl: item.adobe_connect_app_url,
              });

              return (
                <article key={item.link_id} className={styles.teacherCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ margin: 0, fontSize: "var(--font-size-body)", fontWeight: 700 }}>
                      {item.class_title}
                    </h3>
                    <span className={styles.badge}>{item.level}</span>
                  </div>
                  <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                    {isFa
                      ? `استاد: ${item.teacher_name || item.teacher_email}`
                      : `Teacher: ${item.teacher_name || item.teacher_email}`}
                  </p>

                  {/* 7-digit numeric class code badge with copy button */}
                  {(item.code || item.class_code) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        marginBlock: "var(--space-2)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#166534" }}>🏷️ {isFa ? "کد کلاس:" : "Code:"}</span>
                        <strong style={{ fontFamily: "monospace", letterSpacing: "1px", color: "#15803d", fontSize: "0.9375rem" }}>
                          {item.code || item.class_code}
                        </strong>
                      </div>
                      <button
                        type="button"
                        title={isFa ? "کپی کد کلاس" : "Copy Class Code"}
                        style={{
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          background: "#ffffff",
                          border: "1px solid #86efac",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#166534",
                          fontWeight: 600,
                        }}
                        onClick={() => handleCopyClassCode(item.code || item.class_code || "", item.link_id)}
                      >
                        {copiedLinkId === item.link_id ? (isFa ? "✓ کپی شد" : "✓ Copied") : (isFa ? "📋 کپی" : "📋 Copy")}
                      </button>
                    </div>
                  )}

                  {/* Schedule Details */}
                  <div
                    style={{
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: "var(--radius-control, 0.5rem)",
                      padding: "var(--space-2) var(--space-3)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#0369a1" }}>
                      <span>📅 {isFa ? "روزهای برگزاری:" : "Days:"}</span>
                      <strong style={{ color: "#0f172a" }}>{scheduleDays.join(" و ")}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#0369a1" }}>
                      <span>⏰ {isFa ? "ساعت کلاس:" : "Time:"}</span>
                      <strong style={{ color: "#0f172a" }}>{startTime} الی {endTime}</strong>
                    </div>
                  </div>

                  {/* 15-Minute Gate Status Indicator */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: accessStatus.canEnter ? "#15803d" : "#64748b",
                    }}
                  >
                    <span>{accessStatus.canEnter ? "🟢" : "⏳"}</span>
                    <span>
                      {accessStatus.canEnter
                        ? isFa
                          ? "کلاس آنلاین هم‌اکنون فعال و آماده ورود است"
                          : "Online classroom is open right now"
                        : isFa
                        ? "ورود به کلاس از ۱۵ دقیقه قبل از شروع فعال می‌شود"
                        : "Room opens 15 minutes before scheduled start"}
                    </span>
                  </div>

                  {/* Join Class Button */}
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      background: accessStatus.canEnter
                        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                        : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-control, 0.5rem)",
                      fontSize: "var(--font-size-meta)",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-2)",
                      boxShadow: accessStatus.canEnter
                        ? "0 4px 12px rgba(5, 150, 105, 0.3)"
                        : "0 2px 8px rgba(2, 132, 199, 0.25)",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => setSelectedClassForLauncher(item)}
                  >
                    🎥 {isFa ? "ورود به کلاس (Adobe Connect)" : "Join Adobe Connect Room"}
                  </button>

                  <div style={{ fontSize: "0.75rem", color: "var(--color-muted)", borderBlockStart: "1px solid var(--color-border)", paddingBlockStart: "var(--space-2)" }}>
                    {item.consent_given_at
                      ? isFa
                        ? `تاریخ تایید: ${new Date(item.consent_given_at).toLocaleDateString("fa-IR")}`
                        : `Consent Date: ${new Date(item.consent_given_at).toLocaleDateString("en-US")}`
                      : ""}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Adobe Connect Launcher Modal */}
      {selectedClassForLauncher ? (
        <AdobeConnectLauncherModal
          isOpen={Boolean(selectedClassForLauncher)}
          onClose={() => setSelectedClassForLauncher(null)}
          classId={selectedClassForLauncher.class_id}
          classTitle={selectedClassForLauncher.class_title}
          scheduleDays={selectedClassForLauncher.schedule_days}
          scheduleTimeStart={selectedClassForLauncher.schedule_time_start}
          scheduleTimeEnd={selectedClassForLauncher.schedule_time_end}
          meetingUrl={selectedClassForLauncher.meeting_url}
          adobeConnectUrl={selectedClassForLauncher.adobe_connect_url}
          adobeConnectAppUrl={selectedClassForLauncher.adobe_connect_app_url}
          isTeacher={false}
          locale={locale as any}
        />
      ) : null}
    </div>
  );
}
