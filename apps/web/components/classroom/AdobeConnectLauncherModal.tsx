"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdobeConnectLauncherModal.module.css";
import {
  checkClassroomAccess,
  buildAdobeConnectLinks,
  normalizeDayName,
  getTodayPersianDay,
  PERSIAN_DAYS,
  type ClassScheduleInfo,
  type ScheduleAccessStatus,
  type DayOfWeek,
} from "../../lib/classroom-schedule";
import { updateTeacherClass } from "../../lib/teacher-classes";

export interface AdobeConnectLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  classTitle: string;
  scheduleDays?: string[];
  scheduleTimeStart?: string;
  scheduleTimeEnd?: string;
  meetingUrl?: string;
  adobeConnectUrl?: string;
  adobeConnectAppUrl?: string;
  isTeacher?: boolean;
  locale?: "fa" | "en";
  onMeetingUrlUpdated?: (newUrl: string) => void;
}

export function AdobeConnectLauncherModal({
  isOpen,
  onClose,
  classId,
  classTitle,
  scheduleDays = ["شنبه", "دوشنبه"],
  scheduleTimeStart = "18:00",
  scheduleTimeEnd = "19:30",
  meetingUrl,
  adobeConnectUrl,
  adobeConnectAppUrl,
  isTeacher = false,
  locale = "fa",
  onMeetingUrlUpdated,
}: AdobeConnectLauncherModalProps) {
  const isFa = locale === "fa";

  const [currentMeetingUrl, setCurrentMeetingUrl] = useState<string>(meetingUrl || "");
  const [urlInputValue, setUrlInputValue] = useState<string>(
    meetingUrl && !meetingUrl.includes("live.endoora.com") ? meetingUrl : ""
  );
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedManual, setCopiedManual] = useState(false);

  useEffect(() => {
    if (meetingUrl) {
      setCurrentMeetingUrl(meetingUrl);
      if (!meetingUrl.includes("live.endoora.com")) {
        setUrlInputValue(meetingUrl);
      }
    }
  }, [meetingUrl]);

  const scheduleInfo: ClassScheduleInfo = {
    scheduleDays,
    startTime: scheduleTimeStart,
    endTime: scheduleTimeEnd,
    meetingUrl: currentMeetingUrl || meetingUrl,
    adobeConnectUrl: currentMeetingUrl || adobeConnectUrl,
    adobeConnectAppUrl,
  };

  const [accessStatus, setAccessStatus] = useState<ScheduleAccessStatus>(() =>
    checkClassroomAccess(scheduleInfo)
  );

  const [promptNotice, setPromptNotice] = useState<string | null>(null);
  const [teacherPreviewActive, setTeacherPreviewActive] = useState(false);

  // Recalculate access status every 15 seconds while open
  useEffect(() => {
    if (!isOpen) return;

    const updateStatus = () => {
      setAccessStatus(checkClassroomAccess(scheduleInfo));
    };

    updateStatus();
    const interval = setInterval(updateStatus, 15000);
    return () => clearInterval(interval);
  }, [isOpen, scheduleDays, scheduleTimeStart, scheduleTimeEnd, currentMeetingUrl]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const links = buildAdobeConnectLinks(classId, currentMeetingUrl || meetingUrl || adobeConnectUrl);
  const effectiveAppUrl = links.appUrl;
  const effectiveWebUrl = links.webUrl;
  const effectiveProtoUrl = links.protoUrl;

  const todayFa = getTodayPersianDay();
  const normalizedClassDays = scheduleDays
    .map(normalizeDayName)
    .filter((d): d is DayOfWeek => d !== null);

  const canLaunch = accessStatus.canEnter || teacherPreviewActive;

  const handleSaveMeetingUrl = async () => {
    let clean = urlInputValue.trim();
    if (!clean) return;
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }

    try {
      setSavingUrl(true);
      setSaveFeedback(null);
      await updateTeacherClass(classId, { meeting_url: clean });
      setCurrentMeetingUrl(clean);
      setUrlInputValue(clean);
      setIsEditingUrl(false);
      onMeetingUrlUpdated?.(clean);
      setSaveFeedback({
        type: "success",
        message: isFa ? "لینک کلاس با موفقیت ذخیره شد." : "Class meeting URL successfully saved.",
      });
      setTimeout(() => setSaveFeedback(null), 4000);
    } catch {
      setSaveFeedback({
        type: "error",
        message: isFa ? "خطا در ذخیره لینک کلاس." : "Failed to save meeting URL.",
      });
    } finally {
      setSavingUrl(false);
    }
  };

  const handleCopyManualUrl = async () => {
    try {
      await navigator.clipboard.writeText(links.webUrl);
      setCopiedManual(true);
      setTimeout(() => setCopiedManual(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleLaunchWeb = () => {
    setPromptNotice(null);
    window.open(effectiveWebUrl, "_blank", "noopener,noreferrer");
  };

  const handleLaunchApp = () => {
    if (!links.isConfigured) {
      setPromptNotice(
        isFa
          ? "توجه: لطفاً ابتدا لینک سرور اختصاصی Adobe Connect را در کادر تنظیمات ثبت کنید."
          : "Please configure your real Adobe Connect meeting room link first."
      );
      return;
    }

    setPromptNotice(
      isFa
        ? "در حال اتصال به اپلیکیشن ادوبی کانکت... در صورت نمایش پیام مرورگر، گزینه Open Adobe Connect را تایید کنید."
        : "Launching Adobe Connect application... If prompted by browser, click 'Open Adobe Connect'."
    );

    // Trigger desktop protocol
    try {
      window.location.href = effectiveAppUrl;
    } catch {
      window.open(effectiveProtoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleLaunchProto = () => {
    setPromptNotice(null);
    window.open(effectiveProtoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="adobe-modal-title"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 id="adobe-modal-title" className={styles.headerTitle}>
              <span>🎙️</span>
              <span>{isFa ? "اتاق کلاس آنلاین Adobe Connect" : "Adobe Connect Online Classroom"}</span>
            </h2>
            <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-muted)", fontSize: "0.875rem" }}>
              {classTitle}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={isFa ? "بستن پنجره" : "Close"}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Schedule Banner */}
          <div className={styles.scheduleBanner}>
            <div className={styles.scheduleRow}>
              <span className={styles.scheduleLabel}>
                {isFa ? "روزهای برگزاری کلاس:" : "Scheduled Days:"}
              </span>
              <div className={styles.dayBadges}>
                {normalizedClassDays.map((day) => {
                  const isToday = day === todayFa;
                  return (
                    <span
                      key={day}
                      className={`${styles.dayBadge} ${isToday ? styles.dayBadgeActiveToday : ""}`}
                    >
                      {day} {isToday ? (isFa ? "(امروز)" : "(Today)") : ""}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.scheduleRow}>
              <span className={styles.scheduleLabel}>
                {isFa ? "ساعت برگزاری:" : "Class Time:"}
              </span>
              <span className={styles.scheduleValue}>
                {accessStatus.formattedTimeFa}
              </span>
            </div>
          </div>

          {/* Access Status Card (15-min Gate) */}
          <div
            className={`${styles.statusCard} ${
              canLaunch
                ? styles.statusCardActive
                : accessStatus.statusKey === "today_later"
                ? styles.statusCardWarning
                : styles.statusCardMuted
            }`}
          >
            <div className={styles.statusHeader}>
              {canLaunch ? (
                <>
                  <span className={styles.statusPulse} />
                  <span>
                    {isFa
                      ? accessStatus.isInProgress
                        ? "کلاس هم‌اکنون در حال برگزاری است"
                        : "کلاس آماده ورود است (پنجره ۱۵ دقیقه قبل از کلاس)"
                      : accessStatus.isInProgress
                      ? "Class is live in session"
                      : "Classroom is ready for entry"}
                  </span>
                </>
              ) : (
                <>
                  <span>⏳</span>
                  <span>
                    {isFa
                      ? accessStatus.statusKey === "today_later"
                        ? "ورود از ۱۵ دقیقه قبل از شروع کلاس فعال می‌شود"
                        : "کلاس در این زمان فعال نیست"
                      : "Classroom is currently locked"}
                  </span>
                </>
              )}
            </div>
            <p className={styles.statusDesc}>
              {teacherPreviewActive
                ? isFa
                  ? "حالت پیش‌نمایش و آزمایش مدرس فعال است. می‌توانید محیط کلاس را بررسی کنید."
                  : "Teacher preview mode active. You can enter and inspect the room."
                : isFa
                ? accessStatus.messageFa
                : accessStatus.messageEn}
            </p>
          </div>

          {/* Teacher Preview Override */}
          {isTeacher && !accessStatus.canEnter && (
            <div className={styles.teacherOverrideRow}>
              <span>
                {isFa
                  ? "👩‍🏫 دسترسی تست مدرس: برای آماده‌سازی اسلایدها و تست صدا می‌توانید از قبل وارد شوید."
                  : "Teacher Prep Mode: Enter early to upload materials and check microphone."}
              </span>
              <button
                type="button"
                className={styles.teacherOverrideButton}
                onClick={() => setTeacherPreviewActive(!teacherPreviewActive)}
              >
                {teacherPreviewActive
                  ? isFa
                    ? "غیرفعال‌سازی تست"
                    : "Disable Preview"
                  : isFa
                  ? "ورود آزمایشی مدرس"
                  : "Test Room as Teacher"}
              </button>
            </div>
          )}

          {/* Room URL Configuration & Status Card */}
          {!links.isConfigured ? (
            <div className={styles.unconfiguredBox}>
              <div className={styles.unconfiguredHeader}>
                <span>⚠️</span>
                <strong>
                  {isFa
                    ? "لینک اختصاصی اتاق Adobe Connect ثبت نشده است"
                    : "Adobe Connect URL Not Configured"}
                </strong>
              </div>
              <p className={styles.unconfiguredText}>
                {isFa
                  ? "دلیل اینکه نرم‌افزار ادوبی کانکت باز می‌شود اما وارد کلاس نمی‌شود این است که هنوز آدرس واقعی کلاس (از سرور اختصاصی دانشگاه، آموزشگاه یا سرویس ادوبی کانکت شما) در این کلاس ذخیره نشده است. لطفاً لینک سرور خود را در کادر زیر وارد کرده و ذخیره نمایید:"
                  : "Adobe Connect desktop application opens but cannot connect because a live server URL has not been saved for this class. Please enter your real meeting room URL below:"}
              </p>
              <div className={styles.urlInputRow}>
                <input
                  type="url"
                  className={styles.urlInput}
                  placeholder={
                    isFa
                      ? "مثال: https://vc.sharif.edu/room یا https://myconnect.ir/class..."
                      : "e.g. https://myroom.adobeconnect.com/class..."
                  }
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.saveUrlButton}
                  onClick={handleSaveMeetingUrl}
                  disabled={savingUrl || !urlInputValue.trim()}
                >
                  {savingUrl
                    ? isFa
                      ? "در حال ذخیره..."
                      : "Saving..."
                    : isFa
                    ? "💾 ذخیره لینک کلاس"
                    : "Save URL"}
                </button>
              </div>
              {saveFeedback && (
                <span
                  className={
                    saveFeedback.type === "success"
                      ? styles.successMsg
                      : styles.errorMsg
                  }
                >
                  {saveFeedback.message}
                </span>
              )}
            </div>
          ) : (
            <div className={styles.configuredUrlBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "0.8125rem", color: "#0369a1" }}>
                  🔗 {isFa ? "آدرس اتاق کلاس:" : "Class Room URL:"}{" "}
                  <strong style={{ direction: "ltr", display: "inline-block" }}>
                    {links.webUrl}
                  </strong>
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className={styles.copySmallBtn}
                    onClick={handleCopyManualUrl}
                    title={isFa ? "کپی آدرس لینک اتاق" : "Copy URL"}
                  >
                    {copiedManual ? (isFa ? "✓ کپی شد" : "✓ Copied") : (isFa ? "📋 کپی آدرس" : "📋 Copy")}
                  </button>
                  {isTeacher && (
                    <button
                      type="button"
                      className={styles.editSmallBtn}
                      onClick={() => setIsEditingUrl(!isEditingUrl)}
                    >
                      ✏️ {isEditingUrl ? (isFa ? "انصراف" : "Cancel") : (isFa ? "ویرایش لینک" : "Edit")}
                    </button>
                  )}
                </div>
              </div>

              {isEditingUrl && (
                <div className={styles.urlInputRow}>
                  <input
                    type="url"
                    className={styles.urlInput}
                    placeholder="https://..."
                    value={urlInputValue}
                    onChange={(e) => setUrlInputValue(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.saveUrlButton}
                    onClick={handleSaveMeetingUrl}
                    disabled={savingUrl || !urlInputValue.trim()}
                  >
                    {savingUrl
                      ? isFa
                        ? "در حال ذخیره..."
                        : "Saving..."
                      : isFa
                      ? "💾 ذخیره تغییرات"
                      : "Save"}
                  </button>
                </div>
              )}
              {saveFeedback && (
                <span
                  className={
                    saveFeedback.type === "success"
                      ? styles.successMsg
                      : styles.errorMsg
                  }
                >
                  {saveFeedback.message}
                </span>
              )}
            </div>
          )}

          {/* Action Launchers */}
          <div className={styles.actionSection}>
            {/* Primary Option: Web HTML5 Browser Client */}
            <button
              type="button"
              className={styles.primaryLaunchButton}
              onClick={handleLaunchWeb}
              disabled={!canLaunch}
            >
              <span>🌐</span>
              <span>
                {isFa ? "ورود به کلاس از طریق مرورگر (نسخه Web HTML5)" : "Enter Classroom via Browser (HTML5 Web)"}
              </span>
            </button>

            {/* Secondary Option: Desktop Application Protocol */}
            <button
              type="button"
              className={styles.appLaunchButton}
              onClick={handleLaunchApp}
              disabled={!canLaunch}
            >
              <span>💻</span>
              <span>
                {isFa
                  ? "ورود با نرم‌افزار Adobe Connect (اتصال مستقیم سیستم)"
                  : "Open in Adobe Connect Desktop App"}
              </span>
            </button>

            {/* Tertiary Option: Official Web Launcher (proto=true) */}
            <button
              type="button"
              className={styles.protoLaunchButton}
              onClick={handleLaunchProto}
              disabled={!canLaunch}
            >
              <span>🚀</span>
              <span>
                {isFa
                  ? "ورود با وب‌لانچر ادوبی کانکت (پروتکل کمکی proto=true)"
                  : "Launch App via Adobe Web Launcher (proto=true)"}
              </span>
            </button>
            <p className={styles.actionHelpText}>
              {isFa
                ? "💡 نکته: در صورتی که اتصال مستقیم نرم‌افزار در سیستم شما واکنشی نشان نداد، روی دکمه «وب‌لانچر» کلیک فرمایید یا آدرس اتاق را در نرم‌افزار Paste نمایید."
                : "Tip: If the direct desktop launcher doesn't respond on your OS, click Web Launcher or paste the room URL into the app."}
            </p>

            {promptNotice && (
              <div className={styles.appPromptNotice} role="status">
                ℹ️ {promptNotice}
              </div>
            )}
          </div>

          {/* Downloads & Requirements */}
          <div className={styles.downloadsSection}>
            <div className={styles.downloadsTitle}>
              <span>📥</span>
              <span>
                {isFa
                  ? "دانلود نرم‌افزار Adobe Connect (در صورت نیاز به کیفیت و سرعت بالاتر):"
                  : "Download Adobe Connect Application (Recommended for best performance):"}
              </span>
            </div>
            <div className={styles.downloadsGrid}>
              <a
                href="https://www.adobe.com/go/ConnectShell11"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🪟 {isFa ? "نسخه ویندوز" : "Windows App"}
              </a>
              <a
                href="https://www.adobe.com/go/ConnectMac11Plus"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🍏 {isFa ? "نسخه مک" : "macOS App"}
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=air.com.adobe.connectpro"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                🤖 {isFa ? "اندروید (گوگل‌پلی)" : "Android App"}
              </a>
              <a
                href="https://apps.apple.com/app/adobe-connect/id430437503"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                📱 {isFa ? "نسخه iOS" : "iOS App"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
