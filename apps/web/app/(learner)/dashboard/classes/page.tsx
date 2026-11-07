"use client";

import React, { useEffect, useState, useId, useMemo } from "react";
import Link from "next/link";
import { Button, Input } from "@endoora/ui";
import styles from "./classes.module.css";
import {
  fetchLearnerLinkedTeachers,
  joinClassByCode,
  acceptLearnerConsent,
  type LinkedTeacher,
} from "../../../../lib/teacher-classes";
import { useLearnerHome } from "../../../../components/learner/LearnerShell";
import { checkClassroomAccess } from "../../../../lib/classroom-schedule";
import { JoinClassroomModal } from "../../../../components/classroom/JoinClassroomModal";

export default function DashboardClassesPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [classes, setClasses] = useState<LinkedTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [submittingCode, setSubmittingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [selectedClassForModal, setSelectedClassForModal] = useState<LinkedTeacher | null>(null);

  const inviteInputId = useId();

  const loadClasses = async () => {
    try {
      const data = await fetchLearnerLinkedTeachers();
      setClasses(data);
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
          setClasses(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyCode = async (code: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inviteCode.trim();
    if (!clean) return;

    try {
      setSubmittingCode(true);
      setCodeFeedback(null);

      if (/^\d{7}$/.test(clean)) {
        const res = await joinClassByCode(clean);
        setCodeFeedback({
          type: "success",
          message:
            res.message ||
            (isFa
              ? `با موفقیت با کد اختصاصی ${clean} در کلاس «${res.class_title}» ثبت‌نام شدید.`
              : `Enrolled successfully in "${res.class_title}" using code ${clean}.`),
        });
      } else {
        await acceptLearnerConsent(clean);
        setCodeFeedback({
          type: "success",
          message: isFa
            ? "دعوت‌نامه با موفقیت پذیرفته شد و به کلاس افزوده شدید."
            : "Invitation accepted and class linked.",
        });
      }
      setInviteCode("");
      await loadClasses();
    } catch (err: unknown) {
      const errObj = err as { detail?: string; message?: string };
      setCodeFeedback({
        type: "error",
        message:
          errObj?.detail ||
          errObj?.message ||
          (isFa
            ? "کد وارد شده معتبر نیست یا کلاسی با این کد یافت نشد."
            : "Invalid code or class not found."),
      });
    } finally {
      setSubmittingCode(false);
    }
  };

  const { activeList, pastList } = useMemo(() => {
    const active: LinkedTeacher[] = [];
    const past: LinkedTeacher[] = [];

    classes.forEach((c) => {
      if (
        c.is_past ||
        c.class_status === "completed" ||
        c.class_status === "archived" ||
        c.link_status === "terminated"
      ) {
        past.push(c);
      } else {
        active.push(c);
      }
    });

    return { activeList: active, pastList: past };
  }, [classes]);

  const currentTabList = activeTab === "active" ? activeList : pastList;

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentTabList;
    return currentTabList.filter((item) => {
      const matchTitle = item.class_title?.toLowerCase().includes(q);
      const matchTeacher = (item.teacher_name || item.teacher_email || "").toLowerCase().includes(q);
      const matchSubject = item.subject?.toLowerCase().includes(q);
      const matchCode = (item.code || item.class_code || "").toLowerCase().includes(q);
      return matchTitle || matchTeacher || matchSubject || matchCode;
    });
  }, [currentTabList, searchQuery]);

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* 1. Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>
              {isFa ? "کلاس‌ها و مدرس‌های من" : "My Classes & Instructors"}
            </h1>
            <p className={styles.description}>
              {isFa
                ? "کلاس‌های آنلاین فعال شما، ورود مستقیم از فضای سایت یا Adobe Connect، و آرشیو دوره‌های گذشته."
                : "Manage your active online classrooms, join via In-Site Studio or Adobe Connect, and view past course archives."}
            </p>
          </div>
          <Link href="/teachers" className={styles.marketplaceBtn}>
            <span>👥</span>
            <span>{isFa ? "مشاهده بانک مدرسان ایندورا" : "Browse All Teachers"}</span>
          </Link>
        </div>

        {/* Quick Join via 7-Digit Code */}
        <div className={styles.joinCodeSection}>
          <h2 className={styles.joinCodeTitle}>
            {isFa ? "ثبت‌نام در کلاس جدید با کد ۷ رقمی اختصاصی" : "Join Class via 7-Digit Code"}
          </h2>
          <form onSubmit={handleJoinByCode} className={styles.joinCodeForm}>
            <label htmlFor={inviteInputId} className="sr-only">
              {isFa ? "کد کلاس" : "Class Code"}
            </label>
            <Input
              id={inviteInputId}
              type="text"
              placeholder={isFa ? "کد ۷ رقمی کلاس (مثلاً ۷۸۲۱۹۴۰) یا کد دعوت..." : "7-digit class code or invite code..."}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              style={{ flex: 1, minWidth: "15rem" }}
            />
            <Button type="submit" variant="primary" loading={submittingCode} disabled={submittingCode}>
              {submittingCode
                ? isFa
                  ? "در حال بررسی…"
                  : "Checking…"
                : isFa
                ? "عضویت در کلاس"
                : "Enroll in Class"}
            </Button>
          </form>

          {codeFeedback ? (
            <div
              className={`${styles.codeFeedback} ${
                codeFeedback.type === "success" ? styles.codeFeedbackSuccess : styles.codeFeedbackError
              }`}
              role="status"
            >
              {codeFeedback.message}
            </div>
          ) : null}
        </div>
      </section>

      {/* 2. Tabs Navigation */}
      <div className={styles.tabsContainer} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "active"}
          className={`${styles.tabBtn} ${activeTab === "active" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("active")}
        >
          <span>🟢</span>
          <span>{isFa ? "کلاس‌های جاری و فعال" : "Active Classes"}</span>
          <span className={styles.tabCount}>{activeList.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "past"}
          className={`${styles.tabBtn} ${activeTab === "past" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("past")}
        >
          <span>📂</span>
          <span>{isFa ? "کلاس‌های گذشته و پایان‌یافته" : "Past Classes"}</span>
          <span className={styles.tabCount}>{pastList.length}</span>
        </button>
      </div>

      {/* 3. Search Bar */}
      {currentTabList.length > 0 && (
        <div className={styles.searchBar}>
          <Input
            type="text"
            placeholder={
              isFa
                ? "🔍 جستجو با عنوان کلاس، نام مدرس، موضوع یا کد ۷ رقمی..."
                : "🔍 Search classes by title, instructor, subject, or code..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* 4. Classes Grid */}
      {loading ? (
        <div className={styles.emptyState}>
          <p>{isFa ? "در حال دریافت اطلاعات کلاس‌ها…" : "Loading classes…"}</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {activeTab === "active"
              ? isFa
                ? "در حال حاضر کلاس فعالی ثبت نشده است. می‌توانید با کد ۷ رقمی ثبت‌نام کنید."
                : "No active classes found."
              : isFa
              ? "هیچ کلاس پایان‌یافته‌ای در سوابق شما ثبت نشده است."
              : "No past classes found."}
          </p>
        </div>
      ) : (
        <div className={styles.classesGrid}>
          {filteredList.map((item) => {
            const isPast = activeTab === "past";
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
              <article
                key={item.link_id}
                className={`${styles.classCard} ${isPast ? styles.classCardPast : ""}`}
              >
                {/* Header */}
                <div className={styles.cardHeader}>
                  <h3 className={styles.classTitle}>{item.class_title}</h3>
                  <span className={`${styles.badge} ${isPast ? styles.badgePast : ""}`}>
                    {isPast ? (isFa ? "پایان‌یافته" : "Completed") : item.level || "B1"}
                  </span>
                </div>

                <p className={styles.teacherInfo}>
                  {isFa ? "مدرس:" : "Instructor:"}{" "}
                  <strong>{item.teacher_name || item.teacher_email}</strong>
                </p>

                {/* 7-digit code box */}
                {(item.code || item.class_code) && (
                  <div className={`${styles.codeBox} ${isPast ? styles.codeBoxPast : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className={`${styles.codeLabel} ${isPast ? styles.codeLabelPast : ""}`}>
                        🏷️ {isFa ? "کد کلاس:" : "Code:"}
                      </span>
                      <span className={`${styles.codeDigits} ${isPast ? styles.codeDigitsPast : ""}`}>
                        {item.code || item.class_code}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.copyCodeBtn}
                      onClick={() => handleCopyCode(item.code || item.class_code || "", item.link_id)}
                      title={isFa ? "کپی کد کلاس" : "Copy Code"}
                    >
                      {copiedLinkId === item.link_id
                        ? isFa
                          ? "✓ کپی شد"
                          : "✓ Copied"
                        : isFa
                        ? "📋 کپی"
                        : "📋 Copy"}
                    </button>
                  </div>
                )}

                {/* Schedule box */}
                <div className={`${styles.scheduleBox} ${isPast ? styles.scheduleBoxPast : ""}`}>
                  <div className={isPast ? styles.scheduleRowPast : styles.scheduleRow}>
                    <span>📅 {isFa ? "روزهای برگزاری:" : "Days:"}</span>
                    <strong>{scheduleDays.join(" و ")}</strong>
                  </div>
                  <div className={isPast ? styles.scheduleRowPast : styles.scheduleRow}>
                    <span>⏰ {isFa ? "ساعت جلسه:" : "Time:"}</span>
                    <strong>
                      {startTime} الی {endTime}
                    </strong>
                  </div>
                </div>

                {/* Active Class Only: Live Gate & Join Button */}
                {!isPast ? (
                  <>
                    <div
                      className={`${styles.liveGatePill} ${
                        accessStatus.canEnter ? styles.liveGatePillActive : styles.liveGatePillLocked
                      }`}
                    >
                      <span>{accessStatus.canEnter ? "🟢" : "⏳"}</span>
                      <span>
                        {accessStatus.canEnter
                          ? isFa
                            ? "کلاس هم‌اکنون فعال و آماده ورود است"
                            : "Class is open right now"
                          : isFa
                          ? "ورود از ۱۵ دقیقه قبل از زمان کلاس فعال می‌شود"
                          : "Room unlocks 15 mins prior to start"}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={styles.joinOnlineBtn}
                      onClick={() => setSelectedClassForModal(item)}
                    >
                      <span>🎥</span>
                      <span>{isFa ? "ورود به کلاس آنلاین" : "Join Online Classroom"}</span>
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-muted, #64748b)",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <span>
                      {item.consent_given_at
                        ? isFa
                          ? `تاریخ عضویت: ${new Date(item.consent_given_at).toLocaleDateString("fa-IR")}`
                          : `Enrolled: ${new Date(item.consent_given_at).toLocaleDateString("en-US")}`
                        : isFa
                        ? "دوره با موفقیت به پایان رسیده است."
                        : "Course completed."}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* 5. Join Classroom Modal */}
      {selectedClassForModal ? (
        <JoinClassroomModal
          isOpen={Boolean(selectedClassForModal)}
          onClose={() => setSelectedClassForModal(null)}
          classId={selectedClassForModal.class_id}
          classTitle={selectedClassForModal.class_title}
          teacherName={selectedClassForModal.teacher_name}
          scheduleDays={selectedClassForModal.schedule_days}
          scheduleTimeStart={selectedClassForModal.schedule_time_start}
          scheduleTimeEnd={selectedClassForModal.schedule_time_end}
          meetingUrl={selectedClassForModal.meeting_url}
          adobeConnectUrl={selectedClassForModal.adobe_connect_url}
          adobeConnectAppUrl={selectedClassForModal.adobe_connect_app_url}
          locale={locale as any}
        />
      ) : null}
    </div>
  );
}
