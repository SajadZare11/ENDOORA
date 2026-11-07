"use client";

import React, { useState, useEffect } from "react";
import styles from "./JoinClassroomModal.module.css";
import {
  checkClassroomAccess,
  buildAdobeConnectLinks,
  type ClassScheduleInfo,
  type ScheduleAccessStatus,
} from "../../lib/classroom-schedule";

export interface JoinClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  classTitle: string;
  teacherName?: string;
  scheduleDays?: string[];
  scheduleTimeStart?: string;
  scheduleTimeEnd?: string;
  meetingUrl?: string;
  adobeConnectUrl?: string;
  adobeConnectAppUrl?: string;
  locale?: "fa" | "en";
}

export function JoinClassroomModal({
  isOpen,
  onClose,
  classId,
  classTitle,
  teacherName,
  scheduleDays = ["شنبه", "دوشنبه"],
  scheduleTimeStart = "18:00",
  scheduleTimeEnd = "19:30",
  meetingUrl,
  adobeConnectUrl,
  adobeConnectAppUrl,
  locale = "fa",
}: JoinClassroomModalProps) {
  const isFa = locale === "fa";
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [promptNotice, setPromptNotice] = useState<string | null>(null);

  const scheduleInfo: ClassScheduleInfo = {
    scheduleDays,
    startTime: scheduleTimeStart,
    endTime: scheduleTimeEnd,
    meetingUrl,
    adobeConnectUrl: meetingUrl || adobeConnectUrl,
    adobeConnectAppUrl,
  };

  const [accessStatus, setAccessStatus] = useState<ScheduleAccessStatus>(() =>
    checkClassroomAccess(scheduleInfo)
  );

  useEffect(() => {
    if (!isOpen) return;
    const update = () => setAccessStatus(checkClassroomAccess(scheduleInfo));
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, [isOpen, scheduleDays, scheduleTimeStart, scheduleTimeEnd, meetingUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const links = buildAdobeConnectLinks(classId, meetingUrl || adobeConnectUrl);
  const canLaunch = accessStatus.canEnter;

  const handleLaunchInternalStudio = () => {
    if (!canLaunch) return;
    const classroomUrl = `/classroom/${encodeURIComponent(classId)}?role=student`;
    window.open(classroomUrl, "_blank", "noopener,noreferrer");
  };

  const handleLaunchAdobeApp = () => {
    if (!canLaunch) return;
    const protocolTarget = links.appUrl;
    setPromptNotice(
      isFa
        ? "در حال ارسال دستور به نرم‌افزار Adobe Connect... در صورت عدم باز شدن، از نسخه وب یا دکمه کپی لینک استفاده نمایید."
        : "Launching Adobe Connect desktop application..."
    );
    try {
      window.location.assign(protocolTarget);
    } catch {
      window.open(protocolTarget, "_blank");
    }
  };

  const handleLaunchAdobeWeb = () => {
    if (!canLaunch) return;
    window.open(links.webUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyMeetingUrl = async () => {
    try {
      await navigator.clipboard.writeText(links.webUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 id="join-modal-title" className={styles.headerTitle}>
              <span>🎥</span>
              <span>{isFa ? "ورود به کلاس آنلاین" : "Join Online Classroom"}</span>
            </h2>
            <p className={styles.headerSubtitle}>
              {classTitle} {teacherName ? `• ${isFa ? "مدرس:" : "Teacher:"} ${teacherName}` : ""}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Status & 15-Minute Gate Card */}
          <div className={`${styles.statusCard} ${canLaunch ? styles.statusActive : styles.statusLocked}`}>
            <div className={styles.statusHeader}>
              <span>{canLaunch ? "🟢" : "⏳"}</span>
              <span>
                {canLaunch
                  ? isFa
                    ? accessStatus.isInProgress
                      ? "جلسه هم‌اکنون در حال برگزاری است"
                      : "کلاس آماده ورود است (پنجره ۱۵ دقیقه قبل از کلاس)"
                    : "Classroom is live and ready for entry"
                  : isFa
                  ? "ورود به کلاس از ۱۵ دقیقه قبل از زمان جلسه فعال می‌شود"
                  : "Room unlocks 15 minutes prior to scheduled start"}
              </span>
            </div>
            <p className={styles.statusDesc}>
              {isFa
                ? `برنامه هفتگی: ${scheduleDays.join(" و ")} • ساعت: ${accessStatus.formattedTimeFa || `${scheduleTimeStart} الی ${scheduleTimeEnd}`}`
                : `Schedule: ${scheduleDays.join(", ")} at ${scheduleTimeStart} - ${scheduleTimeEnd}`}
            </p>
          </div>

          {/* Platform Selection Cards */}
          <div className={styles.platformGrid}>
            {/* Option 1: In-Site Internal LiveKit Classroom Studio */}
            <div className={`${styles.platformCard} ${styles.platformCardFeatured}`}>
              <span className={styles.platformBadge}>
                {isFa ? "پیشنهادی ایندورا ✨" : "Recommended ✨"}
              </span>
              <div className={styles.platformHeader}>
                <span className={styles.platformIcon}>💻</span>
                <div>
                  <h3 className={styles.platformTitle}>
                    {isFa ? "فضای داخلی سایت (Endoora Studio)" : "In-Site Studio (LiveKit)"}
                  </h3>
                  <p className={styles.platformSubtitle}>
                    {isFa
                      ? "محیط اختصاصی کلاس آنلاین در مرورگر بدون نیاز به نصب هیچ نرم‌افزاری"
                      : "Native web classroom with interactive studio and whiteboard"}
                  </p>
                </div>
              </div>

              <ul className={styles.platformFeatures}>
                <li>✓ {isFa ? "تخته وایت‌برد هوشمند تعاملی" : "Interactive Smart Whiteboard"}</li>
                <li>✓ {isFa ? "ارتباط صوتی و تصویری پرسرعت تحت وب" : "Ultra-fast Web Video & Audio"}</li>
                <li>✓ {isFa ? "کوئیز کلاسی و چت زنده متنی" : "Live Quizzes & Real-time Chat"}</li>
                <li>✓ {isFa ? "ثبت حضور و غیاب و شواهد یادگیری" : "Automatic Attendance & Recap"}</li>
              </ul>

              <button
                type="button"
                className={styles.primaryLaunchBtn}
                onClick={handleLaunchInternalStudio}
                disabled={!canLaunch}
              >
                <span>🌐</span>
                <span>
                  {isFa ? "ورود به کلاس در فضای سایت (تب جدید)" : "Enter In-Site Classroom"}
                </span>
              </button>
            </div>

            {/* Option 2: Adobe Connect */}
            <div className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <span className={styles.platformIcon}>🚀</span>
                <div>
                  <h3 className={styles.platformTitle}>
                    {isFa ? "اتصال با Adobe Connect" : "Connect via Adobe Connect"}
                  </h3>
                  <p className={styles.platformSubtitle}>
                    {isFa
                      ? "اتصال از طریق اپلیکیشن دسکتاپ ادوبی کانکت یا نسخه وب HTML5"
                      : "Join class room through Adobe Connect desktop or web"}
                  </p>
                </div>
              </div>

              <ul className={styles.platformFeatures}>
                <li>✓ {isFa ? "قابلیت اتصال مستقیم اپلیکیشن دسکتاپ" : "Desktop Application Direct Link"}</li>
                <li>✓ {isFa ? "پشتیبانی از نسخه HTML5 تحت وب" : "HTML5 Web Client Support"}</li>
                <li>✓ {isFa ? "امکان کپی آدرس اختصاصی اتاق" : "Copy Direct Room URL"}</li>
              </ul>

              <div className={styles.adobeSubOptions}>
                <button
                  type="button"
                  className={styles.adobeLaunchBtn}
                  onClick={handleLaunchAdobeApp}
                  disabled={!canLaunch}
                >
                  <span>💻</span>
                  <span>{isFa ? "ورود با نرم‌افزار Adobe Connect" : "Launch Adobe App"}</span>
                </button>

                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleLaunchAdobeWeb}
                  disabled={!canLaunch}
                >
                  <span>🌐</span>
                  <span>{isFa ? "ورود با نسخه وب (HTML5 مرورگر)" : "Open in Web Browser"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Copy Meeting URL row */}
          {links.webUrl ? (
            <div className={styles.copyRow}>
              <span>
                🔗 {isFa ? "آدرس اتاق کلاس:" : "Room URL:"}{" "}
                <bdi>{links.webUrl}</bdi>
              </span>
              <button
                type="button"
                className={styles.copySmallBtn}
                onClick={handleCopyMeetingUrl}
              >
                {copiedUrl ? (isFa ? "✓ کپی شد" : "✓ Copied") : (isFa ? "📋 کپی آدرس" : "📋 Copy")}
              </button>
            </div>
          ) : null}

          {/* Desktop Protocol Notice */}
          {promptNotice && (
            <div className={styles.promptNotice} role="status">
              ℹ️ {promptNotice}
            </div>
          )}

          {/* Downloads section */}
          <div className={styles.downloadsSection}>
            <div className={styles.downloadsTitle}>
              <span>📥</span>
              <span>
                {isFa
                  ? "دانلود نرم‌افزار Adobe Connect (در صورت نیاز به نرم‌افزار خارجی):"
                  : "Download Adobe Connect:"}
              </span>
            </div>
            <div className={styles.downloadsGrid}>
              <a
                href="https://www.adobe.com/go/ConnectShell11"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🪟 {isFa ? "ویندوز" : "Windows"}
              </a>
              <a
                href="https://www.adobe.com/go/ConnectMac11Plus"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🍏 {isFa ? "مک" : "macOS"}
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=air.com.adobe.connectpro"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🤖 {isFa ? "اندروید" : "Android"}
              </a>
              <a
                href="https://apps.apple.com/app/adobe-connect/id430437503"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                📱 {isFa ? "آیفون (iOS)" : "iOS"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
