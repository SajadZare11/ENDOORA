"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./notifications.module.css";
import {
  fetchNotificationPreferences,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreferences,
  FALLBACK_NOTIFICATIONS,
  FALLBACK_PREFERENCES,
  NotificationItem,
  NotificationPreferences,
} from "@/lib/notifications";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(FALLBACK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>(FALLBACK_PREFERENCES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadData = async (cat?: string, unread?: boolean) => {
    try {
      const [res, pr] = await Promise.all([
        fetchNotifications(cat ?? selectedCategory, unread ?? unreadOnly),
        fetchNotificationPreferences(),
      ]);
      setNotifications(res.notifications);
      setUnreadCount(res.unread_count);
      setPrefs(pr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setUnreadOnly(cat === "UNREAD");
    loadData(cat === "UNREAD" ? "ALL" : cat, cat === "UNREAD");
  };

  const handleMarkAsRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true, status: "READ" } : item))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true, status: "READ" })));
    setUnreadCount(0);
    setSaveMessage("تمامی اعلان‌ها به عنوان خوانده‌شده علامت‌گذاری شدند.");
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleSavePreferences = async () => {
    const ok = await updateNotificationPreferences(prefs);
    if (ok) {
      setSaveMessage("تنظیمات دریافت اعلان‌ها با موفقیت ذخیره شد.");
    } else {
      setSaveMessage("خطا در ذخیره تنظیمات.");
    }
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const getActionLabel = (url: string) => {
    if (url.includes("placement")) return "ورود به آزمون تعیین سطح ←";
    if (url.includes("today")) return "مشاهده ماموریت روزانه ←";
    if (url.includes("sessions")) return "بررسی نشست‌های فعال ←";
    if (url.includes("writing")) return "مشاهده بازخورد رایتینگ ←";
    return "مشاهده جزئیات ←";
  };

  return (
    <div className={styles.container}>
      {/* 1. Page Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>
            <span>🔔 مرکز اعلان‌ها و پیام‌ها (OPS-006)</span>
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {unreadCount.toLocaleString("fa-IR")} اعلان جدید
              </span>
            )}
          </h1>
          <p className={styles.pageSubtitle}>
            مشاهده پیام‌های آموزشی، اطلاعیه‌های آزمون و تعیین سطح، تراکنش‌های مالی و هشدارهای امنیتی
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionButton} onClick={handleMarkAllAsRead}>
            ✓ خواندن همه
          </button>
          <button className={styles.actionButton} onClick={() => loadData()}>
            🔄 بروزرسانی
          </button>
        </div>
      </header>

      {saveMessage && (
        <div className={styles.carrierNotice} style={{ backgroundColor: "var(--color-success-subtle)", color: "var(--color-success)" }}>
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 2. Filter Category Ribbon */}
      <div className={styles.filterRibbon}>
        {[
          { key: "ALL", label: "همه اعلان‌ها" },
          { key: "UNREAD", label: `خوانده‌نشده (${unreadCount})` },
          { key: "LEARNING", label: "📚 یادگیری و تمارین" },
          { key: "ASSIGNMENT", label: "📝 تکالیف و آزمون‌ها" },
          { key: "SECURITY", label: "🛡️ امنیت حساب" },
          { key: "FINANCIAL", label: "💳 مالی و پرداخت" },
          { key: "SYSTEM", label: "⚙️ سیستم" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.filterTab} ${
              selectedCategory === tab.key ? styles.filterTabActive : ""
            }`}
            onClick={() => handleCategorySelect(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notification Feed */}
      <div className={styles.notificationList}>
        {loading ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>در حال دریافت اعلان‌ها...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <div className={styles.emptyText}>اعلانی در این دسته‌بندی یافت نشد.</div>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`${styles.notificationCard} ${
                !item.is_read ? styles.notificationUnread : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardMetaGroup}>
                  <span className={styles.categoryTag}>{item.category_display}</span>
                  <span className={styles.timestamp}>
                    {new Date(item.created_at).toLocaleDateString("fa-IR")}
                  </span>
                  {!item.is_read && (
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)", fontWeight: "bold" }}>
                      ● جدید
                    </span>
                  )}
                </div>
                {!item.is_read && (
                  <button
                    className={styles.markReadBtn}
                    onClick={() => handleMarkAsRead(item.id)}
                  >
                    علامت‌گذاری به عنوان خوانده‌شده
                  </button>
                )}
              </div>

              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardMessage}>{item.message}</p>

              {item.action_url && (
                <div className={styles.cardFooter}>
                  <Link href={item.action_url} className={styles.cardLink}>
                    {getActionLabel(item.action_url)}
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. Notification Preferences & Carrier Delivery Notice */}
      <section className={styles.prefSection}>
        <div>
          <h2 className={styles.prefTitle}>⚙️ تنظیمات ترجیحات دریافت اعلان‌ها</h2>
          <p className={styles.prefSubtitle}>
            کانال‌های ارتباطی و انواع پیام‌هایی که مایل به دریافت آن‌ها هستید را مدیریت کنید.
          </p>
        </div>

        <div className={styles.carrierNotice}>
          <span>
            📱 <strong>نکته ارتباطات مخابراتی ایران:</strong> پیامک‌های حساس امنیتی (کدهای یک‌بارمصرف و هشدارهای امنیتی) از طریق سرشماره‌های خدماتی معتبر ارسال شده و به خطوطی که دریافت پیامک تبلیغاتی را مسدود کرده‌اند نیز تحویل می‌گردند.
          </span>
        </div>

        <div className={styles.prefGrid}>
          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>اعلان‌های درون‌برنامه‌ای (In-App)</span>
              <span className={styles.prefDesc}>نمایش نشان قرمز و لیست پیام‌ها در هدر سایت</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.in_app_enabled}
              onChange={(e) => setPrefs({ ...prefs, in_app_enabled: e.target.checked })}
            />
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>پیامک موبایل (SMS ایران)</span>
              <span className={styles.prefDesc}>ارسال به شماره همراه تایید شده ({prefs.user_phone || "ثبت نشده"})</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.sms_enabled}
              onChange={(e) => setPrefs({ ...prefs, sms_enabled: e.target.checked })}
            />
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>ایمیل اطلاع‌رسانی</span>
              <span className={styles.prefDesc}>گزارش‌های پیشرفت و کارنامه دوره‌ای</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.email_enabled}
              onChange={(e) => setPrefs({ ...prefs, email_enabled: e.target.checked })}
            />
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>یادآوری تمرین‌ها و ماموریت‌ها</span>
              <span className={styles.prefDesc}>اطلاع‌رسانی تمرین روزانه و مرور فاصله‌دار SRS</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.learning_updates}
              onChange={(e) => setPrefs({ ...prefs, learning_updates: e.target.checked })}
            />
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>تکالیف و اعلام نمرات</span>
              <span className={styles.prefDesc}>بازخورد استادان و تصحیح هوشمند مقالات</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.assignment_alerts}
              onChange={(e) => setPrefs({ ...prefs, assignment_alerts: e.target.checked })}
            />
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefName}>تراکنش‌های مالی و فاکتور</span>
              <span className={styles.prefDesc}>رسید رزرو کلاس، شارژ کیف پول و تسویه</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.financial_receipts}
              onChange={(e) => setPrefs({ ...prefs, financial_receipts: e.target.checked })}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={handleSavePreferences}>
            💾 ذخیره تغییرات ترجیحات
          </button>
        </div>
      </section>
    </div>
  );
}
