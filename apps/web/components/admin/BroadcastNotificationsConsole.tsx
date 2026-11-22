"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./broadcast-notifications.module.css";
import {
  type BroadcastChannel,
  type BroadcastPriority,
  type AudienceSegmentKey,
  type AudienceSegment,
  type BroadcastCampaign,
  type BroadcastTemplate,
  type BroadcastStats,
  CHANNEL_LABELS,
  PRIORITY_LABELS,
} from "@/lib/broadcast-notifications-content";

export function BroadcastNotificationsConsole() {
  const [activeTab, setActiveTab] = useState<"composer" | "segments" | "templates">("composer");
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [templates, setTemplates] = useState<BroadcastTemplate[]>([]);
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Composer Form
  const [title, setTitle] = useState("رونمایی از دوره جدید لغات پیشرفته C1");
  const [bodyText, setBodyText] = useState(
    "زبان‌آموز گرامی، دوره اصطلاحات بومی سطح C1 با تدریس استاد صبوری هم‌اکنون فعال شد. جهت ثبت‌نام و دریافت تخفیف کلیک فرمایید."
  );
  const [ctaText, setCtaText] = useState("مشاهده و ثبت‌نام در دوره");
  const [ctaUrl, setCtaUrl] = useState("/courses");
  const [selectedChannels, setSelectedChannels] = useState<BroadcastChannel[]>(["in_app", "sms"]);
  const [selectedPriority, setSelectedPriority] = useState<BroadcastPriority>("normal");
  const [selectedSegment, setSelectedSegment] = useState<AudienceSegmentKey>("all_users");
  const [scheduledFor, setScheduledFor] = useState("");
  const [adminPhone, setAdminPhone] = useState("09121234567");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/broadcast");
      const json = await res.json();
      if (json.success) {
        setCampaigns(json.data.campaigns);
        setTemplates(json.data.templates);
        setSegments(json.data.segments);
        setStats(json.data.stats);
      } else {
        showToast(json.error || "خطا در واکشی داده‌های مرکز اعلان", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleChannel = (ch: BroadcastChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) {
        showToast("حداقل یک کانال ارسال باید انتخاب شده باشد.", "error");
        return;
      }
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleApplyTemplate = (tpl: BroadcastTemplate) => {
    setTitle(tpl.defaultTitle);
    setBodyText(tpl.defaultBody);
    setCtaText(tpl.defaultCtaText);
    setCtaUrl(tpl.defaultCtaUrl);
    setSelectedChannels(tpl.channels);
    setSelectedPriority(tpl.priority);
    setActiveTab("composer");
    showToast(`قالب "${tpl.title}" در فرم تدوین بارگذاری شد.`, "success");
  };

  const handleSelectSegment = (segKey: AudienceSegmentKey) => {
    setSelectedSegment(segKey);
    setActiveTab("composer");
    const seg = segments.find((s) => s.key === segKey);
    showToast(`سگمنت "${seg ? seg.label : segKey}" برای ارسال انتخاب شد.`, "success");
  };

  const handleSendTest = async () => {
    if (!title.trim() || !bodyText.trim()) {
      showToast("لطفاً عنوان و متن پیام را وارد فرمایید.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test",
          title,
          body: bodyText,
          channels: selectedChannels,
          adminPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
      } else {
        showToast(data.error || "خطا در ارسال تست", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ارسال پیام تست", "error");
    }
  };

  const handleDispatchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bodyText.trim() || selectedChannels.length === 0) {
      showToast("لطفاً فیلدهای الزامی را پر کنید و حداقل یک کانال انتخاب فرمایید.", "error");
      return;
    }

    const seg = segments.find((s) => s.key === selectedSegment);
    const est = seg ? seg.estimatedCount : 0;
    const confirmMsg = scheduledFor
      ? `آیا از زمان‌بندی این کمپین برای تاریخ ${scheduledFor} و ارسال به ${est.toLocaleString("fa-IR")} مخاطب اطمینان دارید؟`
      : `⚠️ هشدار شلیک سراسری: آیا از ارسال فوری این پیام به ${est.toLocaleString("fa-IR")} مخاطب در کانال‌های (${selectedChannels.join(", ")}) اطمینان قطعی دارید؟`;

    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dispatch_campaign",
          title,
          body: bodyText,
          ctaText,
          ctaUrl,
          channels: selectedChannels,
          priority: selectedPriority,
          targetSegment: selectedSegment,
          scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`کمپین اعلان "${data.campaign.title}" با موفقیت ارسال/زمان‌بندی گردید.`, "success");
        loadData();
        setActiveTab("templates");
      } else {
        showToast(data.error || "خطا در ارسال کمپین", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای ارتباط با سرور", "error");
    }
  };

  const handleCancelCampaign = async (campaignId: string) => {
    if (!confirm("آیا مایلید ارسال این کمپین زمان‌بندی‌شده لغو گردد؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel_campaign", campaignId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در لغو کمپین", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای ارتباط با سرور", "error");
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("آیا مایلید تمام کمپین‌ها و داده‌های مرکز اعلان به حالت اولیه آزمایشی بازنشانی شوند؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در بازنشانی", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در بازنشانی داده‌ها", "error");
    }
  };

  const currentSegment = segments.find((s) => s.key === selectedSegment);

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            fontWeight: 700,
            fontSize: "0.9rem",
            direction: "rtl",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>📢</span>
            مرکز اعلان همگانی، پیامک و نوتیفیکیشن‌های درون‌برنامه‌ای (Broadcast Hub)
          </h2>
          <p className={styles.headerDesc}>
            ارسال چندکاناله پیام‌های سراسری، پیامک‌های خدماتی، بنرهای فوری و هدف‌گیری هوشمند سگمنت‌های آموزشی.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی دیتای اولیه">
            <span>🔄</span>
            بازنشانی دیتای اولیه
          </button>
          <button className={styles.btnRefresh} onClick={loadData}>
            <span>⚡</span>
            به‌روزرسانی
          </button>
        </div>
      </div>

      {/* Summary KPI Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#38bdf8" }}>
            🚀
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>کمپین‌های ارسال‌شده</p>
            <p className={styles.statValue}>{stats?.totalCampaignsSent ?? "..."}</p>
            <p className={styles.statSubtext}>{stats?.scheduledCampaignsCount ?? 0} کمپین در صف زمان‌بندی</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            🔔
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>نوتیفیکیشن‌های تحویل‌شده</p>
            <p className={styles.statValue}>{(stats?.totalNotificationsDelivered || 0).toLocaleString("fa-IR")}</p>
            <p className={styles.statSubtext}>درون‌برنامه‌ای و زنگوله فعال</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            📱
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>پیامک‌های مستقیم خدماتی</p>
            <p className={styles.statValue}>{(stats?.totalSmsDispatched || 0).toLocaleString("fa-IR")}</p>
            <p className={styles.statSubtext}>تحویل روی خطوط همراه کاربران</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            📊
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>میانگین نرخ موفقیت تحویل</p>
            <p className={styles.statValue}>{stats?.avgDeliveryRatePercent ?? "..."}٪</p>
            <p className={styles.statSubtext}>پایداری بالا در کلیه اپراتورها</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
            🚨
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>بنرهای اضطراری فعال سایت</p>
            <p className={styles.statValue}>{stats?.activeUrgentBannersCount ?? "..."}</p>
            <p className={styles.statSubtext}>نمایش در بالای صفحات وبسایت</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "composer" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("composer")}
        >
          <span>✍️</span>
          کارتابل تدوین و شلیک پیام
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "segments" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("segments")}
        >
          <span>🎯</span>
          سگمنت‌بندی هوشمند مخاطبان
          <span className={styles.tabBadge}>{segments.length} گروه</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "templates" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          <span>📜</span>
          قالب‌های استاندارد و تاریخچه ارسال‌ها
          <span className={styles.tabBadge}>{campaigns.length} کمپین</span>
        </button>
      </div>

      {/* TAB 1: COMPOSER & PREVIEW */}
      {activeTab === "composer" && (
        <div className={styles.composerLayout}>
          {/* Left Column: Form */}
          <div className={styles.composerCard}>
            <h3 className={styles.composerTitle}>
              <span>📤</span>
              تنظیمات کمپین اعلان و مشخصات پیام
            </h3>
            <p className={styles.composerDesc}>
              کانال‌های ارسال را تعیین نموده، پیام را نگارش کنید و پیش از ارسال انبوه، تست اولیه بگیرید.
            </p>

            <form onSubmit={handleDispatchCampaign} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Channel Selector */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>کانال‌های انتشار پیام (چندانتخابی):</label>
                <div className={styles.channelGroup}>
                  {(["in_app", "sms", "urgent_banner", "email"] as BroadcastChannel[]).map((ch) => {
                    const chMeta = CHANNEL_LABELS[ch];
                    const isActive = selectedChannels.includes(ch);
                    return (
                      <div
                        key={ch}
                        className={`${styles.channelCheckbox} ${isActive ? styles.channelCheckboxActive : ""}`}
                        onClick={() => handleToggleChannel(ch)}
                      >
                        <span>{chMeta.icon}</span>
                        <span>{chMeta.fa}</span>
                        {isActive && <span style={{ color: "#38bdf8", fontWeight: 800 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Segment & Priority Selectors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>گروه مخاطبان هدف (Audience Segment):</label>
                  <select
                    className={styles.selectInput}
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value as AudienceSegmentKey)}
                  >
                    {segments.map((seg) => (
                      <option key={seg.key} value={seg.key}>
                        {seg.label} ({seg.estimatedCount.toLocaleString("fa-IR")} نفر)
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>سطح اولویت اعلان (Priority):</label>
                  <select
                    className={styles.selectInput}
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as BroadcastPriority)}
                  >
                    <option value="normal">عادی و اطلاع‌رسانی</option>
                    <option value="important">مهم و اولویت‌دار</option>
                    <option value="critical">بحرانی و هشدار اضطراری پلتفرم</option>
                  </select>
                </div>
              </div>

              {/* Title & Body Inputs */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>عنوان اعلان (Title):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: آغاز جشنواره بزرگ پاییزه یا شروع کلاس زنده"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>متن کامل پیام (Body):</label>
                <textarea
                  className={styles.formTextarea}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="متن شفاف، جذاب و آموزنده خود را برای زبان‌آموزان بنویسید..."
                  required
                />
              </div>

              {/* CTA Link & Text */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>عنوان دکمه اقدام (CTA Button):</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="مثال: ورود به کلاس یا ثبت‌نام دوره"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>آدرس مقصد دکمه (CTA Link):</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="مثال: /courses یا /high-school/grade-12/tamrin20"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              {/* Optional Schedule & Admin Phone for Test */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>زمان‌بندی ارسال (اختیاری):</label>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>شماره همراه ادمین جهت تست:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="09121234567"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className={styles.composerActions}>
                <button type="button" className={styles.btnTestSend} onClick={handleSendTest}>
                  <span>🧪</span>
                  ارسال پیامک و نوتیفیکیشن آزمایشی به ادمین
                </button>

                <button type="submit" className={styles.btnDispatchMass}>
                  <span>🚀</span>
                  تأیید و ارسال سراسری به{" "}
                  {currentSegment ? currentSegment.estimatedCount.toLocaleString("fa-IR") : "..."} مخاطب
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Phone Simulator */}
          <div className={styles.previewPhoneFrame}>
            <div className={styles.phoneStatusBar}>
              <span>09:41</span>
              <span>📶 LTE 🔋 100%</span>
            </div>

            <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.75rem", margin: "0.5rem 0" }}>
              پیش‌نمایش بلادرنگ اعلان در تلفن همراه کاربر
            </div>

            {/* In-App / Push Notification Card */}
            <div className={styles.phoneNotificationCard}>
              <div className={styles.phoneNotifHeader}>
                <span className={styles.phoneAppName}>
                  <span>⚡</span>
                  سامانه آموزشی ایندورا (Endoora)
                </span>
                <span className={styles.phoneNotifTime}>هم‌اکنون</span>
              </div>
              <h4 className={styles.phoneNotifTitle}>{title || "عنوان اعلان"}</h4>
              <p className={styles.phoneNotifBody}>{bodyText || "متن پیام در این بخش قرار می‌گیرد..."}</p>
              {ctaText && <div className={styles.phoneNotifCta}>{ctaText} ←</div>}
            </div>

            {/* Top Banner simulation if urgent_banner is selected */}
            {selectedChannels.includes("urgent_banner") && (
              <div
                style={{
                  background: "linear-gradient(90deg, #b91c1c 0%, #dc2626 100%)",
                  color: "#ffffff",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
                }}
              >
                <span>🚨 {title || "اعلان فوری بالای سایت"}</span>
                <span style={{ textDecoration: "underline", fontSize: "0.7rem" }}>جزئیات ←</span>
              </div>
            )}

            <div style={{ marginTop: "auto", textAlign: "center", fontSize: "0.7rem", color: "#475569" }}>
              کانال‌های فعال در این شلیک: {selectedChannels.map((c) => CHANNEL_LABELS[c].fa).join(" • ")}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE SEGMENTS */}
      {activeTab === "segments" && (
        <div className={styles.segmentGrid}>
          {segments.map((seg) => (
            <div key={seg.key} className={styles.segmentCard}>
              <div className={styles.segmentTitleRow}>
                <h4 className={styles.segmentTitle}>{seg.label}</h4>
                <span className={styles.segmentCountBadge}>{seg.estimatedCount.toLocaleString("fa-IR")} کاربر</span>
              </div>
              <p className={styles.segmentDesc}>{seg.description}</p>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {seg.availableChannels.map((ch) => (
                  <span
                    key={ch}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#94a3b8",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      fontSize: "0.725rem",
                    }}
                  >
                    {CHANNEL_LABELS[ch].icon} {CHANNEL_LABELS[ch].fa.split(" ")[0]}
                  </span>
                ))}
              </div>
              <button className={styles.btnSelectSegment} onClick={() => handleSelectSegment(seg.key)}>
                ✍️ انتخاب جهت تدوین پیام ←
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TEMPLATES & HISTORY */}
      {activeTab === "templates" && (
        <div>
          {/* Templates Grid */}
          <h4 style={{ color: "#f8fafc", margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: 700 }}>
            کتابخانه قالب‌های آماده استاندارد:
          </h4>
          <div className={styles.templatesGrid}>
            {templates.map((tpl) => (
              <div key={tpl.id} className={styles.templateCard} onClick={() => handleApplyTemplate(tpl)}>
                <div className={styles.templateHeader}>
                  <h5 className={styles.templateTitle}>{tpl.title}</h5>
                  <span
                    className={`${styles.badge} ${
                      tpl.priority === "critical"
                        ? styles.priorityCritical
                        : tpl.priority === "important"
                        ? styles.priorityImportant
                        : styles.priorityNormal
                    }`}
                  >
                    {PRIORITY_LABELS[tpl.priority].fa}
                  </span>
                </div>
                <p className={styles.templateBody}>{tpl.defaultBody}</p>
                <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700, marginTop: "auto" }}>
                  کلیک برای اعمال در فرم ←
                </span>
              </div>
            ))}
          </div>

          {/* Delivery History Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <h3 className={styles.tableCardTitle}>
                <span>📜</span>
                تاریخچه کمپین‌ها و گزارش تحویل اعلان‌ها
              </h3>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>عنوان کمپین</th>
                    <th>کانال‌ها</th>
                    <th>گروه مخاطبان</th>
                    <th>گیرندگان قطعی</th>
                    <th>نرخ تحویل</th>
                    <th>وضعیت</th>
                    <th>زمان ارسال</th>
                    <th>ارسال‌کننده</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={9} className={styles.emptyState}>
                        {loading ? "در حال دریافت تاریخچه..." : "هیچ کمپینی ثبت نشده است."}
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((camp) => (
                      <tr key={camp.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            <span style={{ fontWeight: 700, color: "#f8fafc" }}>{camp.title}</span>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{camp.body.substring(0, 45)}...</span>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "0.3rem" }}>
                            {camp.channels.map((ch) => (
                              <span key={ch} title={CHANNEL_LABELS[ch].fa} style={{ fontSize: "1.1rem" }}>
                                {CHANNEL_LABELS[ch].icon}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600 }}>{camp.targetSegmentLabel}</span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#38bdf8" }}>
                            {camp.actualDeliveredCount.toLocaleString("fa-IR")} نفر
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 800, color: camp.deliveryRatePercent >= 95 ? "#34d399" : "#f59e0b" }}>
                            {camp.deliveryRatePercent}٪
                          </span>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              camp.status === "completed"
                                ? styles.statusCompleted
                                : camp.status === "scheduled"
                                ? styles.statusScheduled
                                : styles.statusCancelled
                            }`}
                          >
                            {camp.status === "completed"
                              ? "ارسال موفق"
                              : camp.status === "scheduled"
                              ? "در صف زمان‌بندی"
                              : "لغو شده"}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>
                            {camp.sentAt
                              ? new Date(camp.sentAt).toLocaleString("fa-IR")
                              : camp.scheduledFor
                              ? `زمان‌بندی: ${new Date(camp.scheduledFor).toLocaleString("fa-IR")}`
                              : "-"}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{camp.createdBy}</span>
                        </td>

                        <td>
                          {camp.status === "scheduled" && (
                            <button
                              className={styles.btnActionCancel}
                              onClick={() => handleCancelCampaign(camp.id)}
                            >
                              ✕ لغو ارسال
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
