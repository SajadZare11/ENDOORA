"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./master-admin.module.css";
import { SiteContentCMSEditor } from "./SiteContentCMSEditor";
import { AdminUsersManager } from "./AdminUsersManager";
import { TeacherVerificationHub } from "./TeacherVerificationHub";
import TreasuryOperationsConsole from "./TreasuryOperationsConsole";
import MarketingGrowthConsole from "./MarketingGrowthConsole";
import SupportHelpdeskConsole from "./SupportHelpdeskConsole";
import { SecurityCommandConsole } from "./SecurityCommandConsole";
import { PlatformAnalyticsConsole } from "./PlatformAnalyticsConsole";
import { BroadcastNotificationsConsole } from "./BroadcastNotificationsConsole";
import { SeoMetadataConsole } from "./SeoMetadataConsole";
import { AiEngineConsole } from "./AiEngineConsole";
import { CommunityModerationConsole } from "./CommunityModerationConsole";
import { TeacherContractsConsole } from "./TeacherContractsConsole";
import { ExamIntegrityConsole } from "./ExamIntegrityConsole";
import { FeatureFlagsOperations } from "./FeatureFlagsOperations";
import { AuditLogsOperations } from "./AuditLogsOperations";
import { AcademicCommandConsole } from "./AcademicCommandConsole";
import { SiteBuilderStudio } from "./SiteBuilderStudio";
import { DynamicFormsWebhooksStudio } from "./DynamicFormsWebhooksStudio";
import ServerOperationsGodMode from "./ServerOperationsGodMode";

import { AdminHelpModal } from "./AdminHelpModal";
import { AdminDangerConfirmModal } from "./AdminDangerConfirmModal";
import { AdminPinModal } from "./AdminPinModal";
import { AdminUndoToast } from "./AdminUndoToast";

export type AdminModuleTab =
  | "overview"
  | "site-cms"
  | "site-builder"
  | "forms-webhooks"
  | "seo"
  | "ai-engine"
  | "teacher-verifications"
  | "teacher-contracts"
  | "exam-integrity"
  | "users"
  | "marketing"
  | "support"
  | "community"
  | "security"
  | "analytics"
  | "broadcast"
  | "academics"
  | "finance"
  | "system-ops";

interface AdminItemDef {
  id: AdminModuleTab;
  title: string;
  shortDesc: string;
  icon: string;
  badge?: { text: string; bg: string; color: string };
  isSensitive?: boolean;
}

interface AdminCategoryDef {
  id: string;
  title: string;
  emoji: string;
  isDangerZone?: boolean;
  items: AdminItemDef[];
}

const ADMIN_CATEGORIES: AdminCategoryDef[] = [
  {
    id: "content",
    title: "۱. ظاهر و نوشته‌های سایت",
    emoji: "🌐",
    items: [
      {
        id: "overview",
        title: "نمای کلی و کارهای امروز",
        shortDesc: "خلاصه وضعیت، پیام‌ها و کارهای منتظر",
        icon: "📊",
      },
      {
        id: "site-cms",
        title: "ویرایش متن‌ها و بنرها",
        shortDesc: "تغییر آنلاین بنرها، عناوین و قیمت‌های ویترین",
        icon: "📝",
      },
      {
        id: "site-builder",
        title: "استودیو ساخت صفحات جدید",
        shortDesc: "طراحی صفحات جشنواره و لندینگ بدون کدنویسی",
        icon: "🎨",
      },
      {
        id: "forms-webhooks",
        title: "فرم‌ها و دریافت پیام‌ها",
        shortDesc: "فرم تماس، پیش‌ثبت‌نام همایش و پرسشنامه‌ها",
        icon: "📋",
      },
      {
        id: "seo",
        title: "تنظیمات گوگل و سئو",
        shortDesc: "بهینه‌سازی کلمات کلیدی، عنوان گوگل و ریدایرکت",
        icon: "🌐",
      },
    ],
  },
  {
    id: "academics",
    title: "۲. مدرسه و آزمون‌ها",
    emoji: "🎓",
    items: [
      {
        id: "academics",
        title: "دوره‌ها و بانک سوالات",
        shortDesc: "درس‌های پایه‌ها، کنکور، آیلتس و سوالات تستی",
        icon: "🎓",
      },
      {
        id: "exam-integrity",
        title: "سلامت و نظارت بر آزمون‌ها",
        shortDesc: "مراقبت از آزمون، بررسی تقلب و بازبینی نمرات",
        icon: "🛡️",
      },
    ],
  },
  {
    id: "users",
    title: "۳. کاربران و پشتیبانی",
    emoji: "👥",
    items: [
      {
        id: "users",
        title: "فهرست اعضا و دسترسی‌ها",
        shortDesc: "مدیریت زبان‌آموزان و نقش‌های کاربری",
        icon: "👥",
      },
      {
        id: "teacher-verifications",
        title: "بررسی و تایید معلمان جدید",
        shortDesc: "مشاهده ویدیو و مدارک تدریس ارسالی مدرسان",
        icon: "🧑‍🏫",
        badge: { text: "۳ در صف", bg: "#fee2e2", color: "#dc2626" },
      },
      {
        id: "teacher-contracts",
        title: "قراردادها و سهم معلمان",
        shortDesc: "تعیین درصد کارمزد تدریس و متن قراردادها",
        icon: "📜",
      },
      {
        id: "support",
        title: "تیکت‌ها و پیام‌های پشتیبانی",
        shortDesc: "پاسخ به سوالات و مشکلات زبان‌آموزان",
        icon: "🎧",
        badge: { text: "۲ جدید", bg: "#fef3c7", color: "#d97706" },
      },
      {
        id: "community",
        title: "نظرات و تالار گفتگو",
        shortDesc: "تایید نظرات کاربران و جلوگیری از پیام نامناسب",
        icon: "💬",
      },
    ],
  },
  {
    id: "growth",
    title: "۴. فروش و تبلیغات",
    emoji: "📈",
    items: [
      {
        id: "finance",
        title: "درآمد و تسویه‌حساب",
        shortDesc: "گزارش فروش، فاکتورها و واریزی معلمان",
        icon: "💳",
      },
      {
        id: "marketing",
        title: "کدهای تخفیف و جشنواره‌ها",
        shortDesc: "تعریف کوپن تخفیف و پیشنهادهای ویژه",
        icon: "🚀",
      },
      {
        id: "broadcast",
        title: "ارسال پیامک و اعلانات",
        shortDesc: "پیامک گروهی و نوتیفیکیشن همگانی به کاربران",
        icon: "📢",
      },
      {
        id: "analytics",
        title: "آمار بازدیدها و رشد سایت",
        shortDesc: "تعداد بازدیدهای امروز و رفتار کاربران",
        icon: "📈",
      },
    ],
  },
  {
    id: "danger_zone",
    title: "۵. منطقه حساس و فنی (با احتیاط)",
    emoji: "🛑",
    isDangerZone: true,
    items: [
      {
        id: "system-ops",
        title: "عملیات سرور و دیتابیس",
        shortDesc: "بک‌آپ کل سامانه، حالت تعمیرات و موتورخانه سرور",
        icon: "⚙️",
        isSensitive: true,
      },
      {
        id: "ai-engine",
        title: "مغز هوش مصنوعی و ربات‌ها",
        shortDesc: "دستورات تصحیح آزمون و پرامپت‌های ربات معلم",
        icon: "🧠",
        isSensitive: true,
      },
      {
        id: "security",
        title: "دیوار آتش و اتاق امنیت",
        shortDesc: "شناسایی حملات هکرها و مسدودسازی آی‌پی مزاحم",
        icon: "🚨",
        isSensitive: true,
      },
    ],
  },
];

export function MasterAdminConsole({ onLogout }: { onLogout?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Safety Lock State for Category 5 (Sensitive Zone)
  const [isTechnicalZoneUnlocked, setIsTechnicalZoneUnlocked] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingSensitiveTab, setPendingSensitiveTab] = useState<AdminModuleTab | null>(null);

  // Help Modal State ("Explain Like I'm 5")
  const [helpTab, setHelpTab] = useState<AdminModuleTab | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Danger Confirm Modal State
  const [dangerModalConfig, setDangerModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    actionName: string;
    consequences: string[];
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    actionName: "",
    consequences: [],
    onConfirm: () => {},
  });

  // Undo Toast State
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    onUndo?: () => void;
  }>({
    message: "",
    isVisible: false,
  });

  // Open Help Modal
  const openHelp = (tab: AdminModuleTab, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHelpTab(tab);
    setIsHelpOpen(true);
  };

  // Trigger Navigation with Safety Check
  const handleSelectTab = (tab: AdminModuleTab, isSensitive?: boolean) => {
    if (isSensitive && !isTechnicalZoneUnlocked) {
      setPendingSensitiveTab(tab);
      setIsPinModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // On PIN success
  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsTechnicalZoneUnlocked(true);
    setToast({
      message: "🔓 قفل منطقه حساس با موفقیت باز شد.",
      isVisible: true,
    });
    if (pendingSensitiveTab) {
      setActiveTab(pendingSensitiveTab);
      setPendingSensitiveTab(null);
    }
  };

  // Lock sensitive zone again
  const handleLockZone = () => {
    setIsTechnicalZoneUnlocked(false);
    if (["system-ops", "ai-engine", "security"].includes(activeTab)) {
      setActiveTab("overview");
    }
    setToast({
      message: "🔒 منطقه حساس مجدداً قفل شد و در حالت امن قرار گرفت.",
      isVisible: true,
    });
  };

  // Filter items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ADMIN_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();

    return ADMIN_CATEGORIES.map((cat) => {
      const matchedItems = cat.items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.shortDesc.toLowerCase().includes(q)
      );
      return {
        ...cat,
        items: matchedItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Check if current tab is in danger zone
  const isCurrentTabSensitive = ["system-ops", "ai-engine", "security"].includes(activeTab);

  return (
    <div className={styles.adminWrapper} dir="rtl">
      {/* 1. Master Top Header */}
      <header className={styles.masterHeader}>
        {/* Brand Area */}
        <div className={styles.brandArea}>
          <div className={styles.brandLogo}>E</div>
          <div className={styles.brandInfo}>
            <h1 className={styles.brandTitle}>
              <span>سامانه مدیریت آسان ایندورا</span>
            </h1>
            <p className={styles.brandSubtitle}>
              پیشخوان ساده، شفاف و دسته‌بندی‌شده برای مدیریت محتوا، کاربران و آموزش
            </p>
          </div>
        </div>

        {/* Realtime Search Bar */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="جستجوی سریع در امکانات (مثلاً بنر، تخفیف، معلم، پیامک)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setSearchQuery("")}
              title="پاک کردن جستجو"
            >
              ✕
            </button>
          )}
        </div>

        {/* Header Controls */}
        <div className={styles.headerControls}>
          {/* System Live Status Pill */}
          <div className={styles.systemStatusPill} title="همه سرویس‌ها بدون نقص فعال هستند">
            <span>●</span>
            <span>سامانه فعال و پایدار</span>
          </div>

          {/* Quick Help Button */}
          <button
            type="button"
            className={styles.btnHelpGlobal}
            onClick={() => openHelp(activeTab)}
            title="راهنمای ساده و ۵ ساله برای این بخش"
          >
            <span>💡</span>
            <span>راهنمای ساده این بخش</span>
          </button>

          {/* Safety Zone Lock Toggle */}
          <button
            type="button"
            className={`${styles.btnSafetyStatus} ${
              isTechnicalZoneUnlocked ? styles.safetyUnlocked : styles.safetyLocked
            }`}
            onClick={() => {
              if (isTechnicalZoneUnlocked) {
                handleLockZone();
              } else {
                setIsPinModalOpen(true);
              }
            }}
            title={
              isTechnicalZoneUnlocked
                ? "قفل منطقه حساس باز است. برای ایمنی کلیک کنید تا قفل شود."
                : "منطقه حساس قفل است تا از خرابکاری جلوگیری شود."
            }
          >
            <span>{isTechnicalZoneUnlocked ? "🔓 منطقه حساس باز" : "🔒 قفل محافظ فعال"}</span>
          </button>

          {/* Visit Public Site */}
          <Link href="/" target="_blank" className={styles.btnVisitSite}>
            <span>🌐 مشاهده سایت</span>
            <span style={{ fontSize: "0.7rem" }}>↗</span>
          </Link>

          {/* Safe Logout */}
          {onLogout && (
            <button
              type="button"
              className={styles.btnLogout}
              onClick={onLogout}
              title="خروج امن از پنل مدیریت"
            >
              <span>خروج</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Master Layout (Sidebar + Content View) */}
      <div className={styles.masterLayout}>
        {/* 5-Category Modular Sidebar */}
        <aside className={styles.sidebar} aria-label="دسته‌بندی امکانات مدیریت">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryGroup} ${
                category.isDangerZone ? styles.dangerCategoryGroup : ""
              }`}
            >
              {/* Category Header */}
              <div className={styles.categoryHeader}>
                <div className={styles.categoryHeaderLeft}>
                  <span className={styles.categoryEmoji}>{category.emoji}</span>
                  <span
                    className={`${styles.categoryTitle} ${
                      category.isDangerZone ? styles.dangerCategoryTitle : ""
                    }`}
                  >
                    {category.title}
                  </span>
                </div>
                <span
                  className={`${styles.categoryCountBadge} ${
                    category.isDangerZone ? styles.dangerCategoryCountBadge : ""
                  }`}
                >
                  {category.items.length}
                </span>
              </div>

              {/* Category Items */}
              <div className={styles.categoryList}>
                {category.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const isDanger = Boolean(item.isSensitive || category.isDangerZone);

                  return (
                    <div key={item.id} className={styles.sidebarItemWrapper}>
                      <button
                        type="button"
                        className={`${styles.sidebarBtn} ${
                          isActive
                            ? isDanger
                              ? styles.dangerSidebarBtnActive
                              : styles.sidebarBtnActive
                            : isDanger
                            ? styles.dangerSidebarBtn
                            : ""
                        }`}
                        onClick={() => handleSelectTab(item.id, item.isSensitive)}
                      >
                        <div className={styles.sidebarBtnContent}>
                          <span className={styles.sidebarItemIcon}>{item.icon}</span>
                          <div className={styles.sidebarItemLabel}>
                            <span className={styles.sidebarItemTitle}>{item.title}</span>
                            <span className={styles.sidebarItemSubtitle}>
                              {item.shortDesc}
                            </span>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            style={{
                              background: item.badge.bg,
                              color: item.badge.color,
                              fontSize: "0.68rem",
                              fontWeight: "bold",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.badge.text}
                          </span>
                        )}
                      </button>

                      {/* Small (?) Help Popover Trigger */}
                      <button
                        type="button"
                        className={styles.btnItemHelp}
                        onClick={(e) => openHelp(item.id, e)}
                        title={`راهنمای ساده ۵ ساله برای «${item.title}»`}
                      >
                        ؟
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Shortcuts in Sidebar footer */}
          <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
              لینک‌های کاربردی آموزش:
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.35rem" }}>
              <Link
                href="/high-school/grade-12/tamrin20"
                target="_blank"
                className={styles.sidebarBtn}
                style={{ fontSize: "0.775rem", color: "#64748b" }}
              >
                <span>🎯</span>
                <span>تمرین تا ۲۰ (پایه دوازدهم)</span>
              </Link>
              <Link
                href="/skills"
                target="_blank"
                className={styles.sidebarBtn}
                style={{ fontSize: "0.775rem", color: "#64748b" }}
              >
                <span>⚡</span>
                <span>هاب ۶ مهارت انگلیسی</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Content View Area */}
        <main className={styles.mainContent}>
          {/* Sensitive Zone Banner if in category 5 */}
          {isCurrentTabSensitive && (
            <div className={styles.dangerZoneBanner}>
              <div className={styles.dangerBannerLeft}>
                <div className={styles.dangerBannerIcon}>🚨</div>
                <div>
                  <h3 className={styles.dangerBannerTitle}>
                    منطقه حساس و فنی (زیرساخت و سرور)
                  </h3>
                  <p className={styles.dangerBannerSub}>
                    دستکاری در این بخش مستقیماً روی سرور، دیتابیس یا نمرات اثر می‌گذارد. لطفاً فقط در صورت اطمینان کامل تغییرات را ذخیره نمایید.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.btnLockZone}
                onClick={handleLockZone}
              >
                🔒 قفل کردن این بخش
              </button>
            </div>
          )}

          {/* ==============================================================================
              TAB 1: OVERVIEW (REDESIGNED)
              ============================================================================== */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* 1. Welcome & Peace-of-Mind Status Banner */}
              <div className={styles.welcomeBanner}>
                <div className={styles.welcomeLeft}>
                  <h2 className={styles.welcomeGreeting}>
                    سلام مدیر عزیز، روزتان بخیر 👋
                  </h2>
                  <p className={styles.welcomeDesc}>
                    تمامی بخش‌های وب‌سایت در این لحظه پایدار هستند و هیچ اختلالی گزارش نشده است.
                  </p>
                </div>

                <div className={styles.systemHealthCards}>
                  <div className={styles.healthCard}>
                    <span className={styles.healthDot} />
                    <span>سرور و سایت: ۱۰۰٪ آنلاین</span>
                  </div>
                  <div className={styles.healthCard}>
                    <span className={styles.healthDot} />
                    <span>دیتابیس: پشتیبان‌گیری شده</span>
                  </div>
                  <div className={styles.healthCard}>
                    <span className={styles.healthDot} />
                    <span>درگاه پرداخت: فعال</span>
                  </div>
                </div>
              </div>

              {/* 2. Action Center: Pending Tasks Waiting for Admin */}
              <div className={styles.actionCenterSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <span>📋 جعبه کارهای فوری منتظر من</span>
                  </h3>
                  <span className={styles.sectionSubtitle}>
                    مواردی که نیاز به تصمیم‌گیری یا تایید شما دارند
                  </span>
                </div>

                <div className={styles.actionGrid}>
                  {/* Task 1: Teacher verifications */}
                  <div className={styles.actionCard}>
                    <div className={styles.actionCardTop}>
                      <div className={styles.actionCardIcon}>🧑‍🏫</div>
                      <div className={styles.actionCardContent}>
                        <h4 className={styles.actionCardTitle}>۳ معلم در صف تایید مدارک</h4>
                        <p className={styles.actionCardDesc}>
                          اساتید جدید ویدیو و مدارک تدریس ارسال کرده‌اند و منتظر تایید برای شروع کلاس هستند.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.actionCardBtn}
                      onClick={() => setActiveTab("teacher-verifications")}
                    >
                      <span>بررسی و تایید مدارک</span>
                      <span>←</span>
                    </button>
                  </div>

                  {/* Task 2: Support tickets */}
                  <div className={styles.actionCard}>
                    <div className={styles.actionCardTop}>
                      <div className={styles.actionCardIcon}>🎧</div>
                      <div className={styles.actionCardContent}>
                        <h4 className={styles.actionCardTitle}>۲ پیام پشتیبانی بی‌پاسخ</h4>
                        <p className={styles.actionCardDesc}>
                          دانش‌آموزان در مورد ثبت‌نام دوره‌ها سوال پرسیده‌اند و منتظر راهنمایی شما هستند.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.actionCardBtn}
                      onClick={() => setActiveTab("support")}
                    >
                      <span>پاسخگویی به پیام‌ها</span>
                      <span>←</span>
                    </button>
                  </div>

                  {/* Task 3: Community moderation */}
                  <div className={styles.actionCard}>
                    <div className={styles.actionCardTop}>
                      <div className={styles.actionCardIcon}>💬</div>
                      <div className={styles.actionCardContent}>
                        <h4 className={styles.actionCardTitle}>۴ نظر جدید در تالار گفتگو</h4>
                        <p className={styles.actionCardDesc}>
                          نظرات ارسالی کاربران زیر درس‌ها آماده بازبینی و انتشار در سایت هستند.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.actionCardBtn}
                      onClick={() => setActiveTab("community")}
                    >
                      <span>مشاهده و تایید نظرات</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Daily Quick Shortcuts */}
              <div className={styles.quickShortcutsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <span>⚡ کارهای پرکاربرد روزمره</span>
                  </h3>
                  <span className={styles.sectionSubtitle}>
                    دسترسی سریع به صفحاتی که هر روز با آنها سر و کار دارید
                  </span>
                </div>

                <div className={styles.quickShortcutsGrid}>
                  <div
                    className={styles.shortcutCard}
                    onClick={() => setActiveTab("site-cms")}
                  >
                    <div className={styles.shortcutIcon} style={{ background: "#e0e7ff", color: "#4338ca" }}>
                      📝
                    </div>
                    <div className={styles.shortcutText}>
                      <span className={styles.shortcutTitle}>تغییر متن و بنر صفحه اول</span>
                      <span className={styles.shortcutDesc}>ویرایش متن خوش‌آمدگویی یا قیمت‌ها</span>
                    </div>
                  </div>

                  <div
                    className={styles.shortcutCard}
                    onClick={() => setActiveTab("marketing")}
                  >
                    <div className={styles.shortcutIcon} style={{ background: "#fef3c7", color: "#b45309" }}>
                      🎁
                    </div>
                    <div className={styles.shortcutText}>
                      <span className={styles.shortcutTitle}>ایجاد کد تخفیف جدید</span>
                      <span className={styles.shortcutDesc}>کوپن تخفیف برای کمپین‌ها و مناسبت‌ها</span>
                    </div>
                  </div>

                  <div
                    className={styles.shortcutCard}
                    onClick={() => setActiveTab("broadcast")}
                  >
                    <div className={styles.shortcutIcon} style={{ background: "#fee2e2", color: "#b91c1c" }}>
                      📢
                    </div>
                    <div className={styles.shortcutText}>
                      <span className={styles.shortcutTitle}>ارسال پیامک به کاربران</span>
                      <span className={styles.shortcutDesc}>اطلاع‌رسانی سریع به شماره موبایل بچه‌ها</span>
                    </div>
                  </div>

                  <div
                    className={styles.shortcutCard}
                    onClick={() => setActiveTab("academics")}
                  >
                    <div className={styles.shortcutIcon} style={{ background: "#dcfce7", color: "#15803d" }}>
                      🎓
                    </div>
                    <div className={styles.shortcutText}>
                      <span className={styles.shortcutTitle}>افزودن درس یا آزمون جدید</span>
                      <span className={styles.shortcutDesc}>مدیریت سوالات تستی و پکیج‌های آموزشی</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Simple Key Metrics (KPIs) */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>کل زبان‌آموزان ثبت‌نامی</span>
                    <span className={styles.kpiIcon}>👥</span>
                  </div>
                  <div className={styles.kpiValue}>۱٬۴۲۰</div>
                  <div className={styles.kpiSub}>+۱۲٪ رشد در ماه جاری</div>
                </div>

                <div
                  className={styles.kpiCard}
                  onClick={() => setActiveTab("teacher-verifications")}
                  style={{ cursor: "pointer" }}
                  title="کلیک برای بررسی معلمان"
                >
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>اساتید فعال پلتفرم</span>
                    <span className={styles.kpiIcon}>🧑‍🏫</span>
                  </div>
                  <div className={styles.kpiValue}>۳۸</div>
                  <div className={styles.kpiSub} style={{ color: "#dc2626" }}>
                    ۳ متقاضی جدید در صف بررسی ←
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>دوره‌ها و بسته‌های فعال</span>
                    <span className={styles.kpiIcon}>📚</span>
                  </div>
                  <div className={styles.kpiValue}>۲۴</div>
                  <div className={styles.kpiSub}>شامل آیلتس، کنکور و مکالمه</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>ضریب ایمنی سامانه</span>
                    <span className={styles.kpiIcon}>🛡️</span>
                  </div>
                  <div className={styles.kpiValue} style={{ color: "#16a34a" }}>
                    ۱۰۰٪ امن
                  </div>
                  <div className={styles.kpiSub} style={{ color: "#2563eb" }}>
                    پایش ۲۴ ساعته تهدیدات
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITE CMS */}
          {activeTab === "site-cms" && <SiteContentCMSEditor />}

          {/* TAB: SITE BUILDER & DYNAMIC NAVIGATION STUDIO */}
          {activeTab === "site-builder" && <SiteBuilderStudio />}

          {/* TAB: DYNAMIC FORMS & WEBHOOKS STUDIO */}
          {activeTab === "forms-webhooks" && <DynamicFormsWebhooksStudio />}

          {/* TAB: SEO, METADATA & REDIRECTS STUDIO */}
          {activeTab === "seo" && <SeoMetadataConsole />}

          {/* TAB: AI ENGINE & LLM OPS HUB */}
          {activeTab === "ai-engine" && <AiEngineConsole />}

          {/* TAB: TEACHER VERIFICATIONS */}
          {activeTab === "teacher-verifications" && <TeacherVerificationHub />}

          {/* TAB: TEACHER CONTRACTS & COMMISSION STUDIO */}
          {activeTab === "teacher-contracts" && <TeacherContractsConsole />}

          {/* TAB: EXAM & PLACEMENT INTEGRITY HUB */}
          {activeTab === "exam-integrity" && <ExamIntegrityConsole />}

          {/* TAB 3: USERS & TEACHERS */}
          {activeTab === "users" && <AdminUsersManager />}

          {/* TAB 4: ACADEMICS & COURSES */}
          {activeTab === "academics" && <AcademicCommandConsole />}

          {/* TAB 4: MARKETING & GROWTH */}
          {activeTab === "marketing" && <MarketingGrowthConsole />}

          {/* TAB 5: SUPPORT & HELPDESK */}
          {activeTab === "support" && <SupportHelpdeskConsole />}

          {/* TAB: COMMUNITY & FORUM MODERATION */}
          {activeTab === "community" && <CommunityModerationConsole />}

          {/* TAB: SECURITY & THREAT DEFENSE ROOM */}
          {activeTab === "security" && <SecurityCommandConsole />}

          {/* TAB: PLATFORM ANALYTICS & FUNNEL INTELLIGENCE */}
          {activeTab === "analytics" && <PlatformAnalyticsConsole />}

          {/* TAB: BROADCAST & NOTIFICATIONS HUB */}
          {activeTab === "broadcast" && <BroadcastNotificationsConsole />}

          {/* TAB 6: FINANCE & TREASURY */}
          {activeTab === "finance" && <TreasuryOperationsConsole />}

          {/* TAB 6: SYSTEM OPS & GOD MODE */}
          {activeTab === "system-ops" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <ServerOperationsGodMode />

              <div
                style={{
                  background: "#ffffff",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.15rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  مدیریت کلیدهای ویژگی (Feature Flags) و لاگ‌های ممیزی
                </h3>
                <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem", color: "#64748b" }}>
                  تنظیمات پیشرفته ویژگی‌های سامانه و ثبت وقایع ممیزی برای مدیران فنی
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <FeatureFlagsOperations />
                  <AuditLogsOperations />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==============================================================================
          MODALS & OVERLAYS
          ============================================================================== */}

      {/* 1. "Explain Like I'm 5" Help Modal */}
      <AdminHelpModal
        tab={helpTab}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 2. Security PIN Modal for unlocking Danger Zone */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        title="🔒 تأیید هویت برای ورود به منطقه حساس و فنی"
        description="این بخش شامل تنظیمات حیاتی سرور، پایگاه داده و هوش مصنوعی است. جهت جلوگیری از بروز اشتباه، لطفاً پین امنیتی مدیر ارشد (پیش‌فرض: ۱۲۳۴۵۶) را وارد نمایید."
        onSuccess={handlePinSuccess}
        onCancel={() => {
          setIsPinModalOpen(false);
          setPendingSensitiveTab(null);
        }}
      />

      {/* 3. Two-Step Danger Confirmation Modal */}
      <AdminDangerConfirmModal
        isOpen={dangerModalConfig.isOpen}
        title={dangerModalConfig.title}
        actionName={dangerModalConfig.actionName}
        consequences={dangerModalConfig.consequences}
        onConfirm={() => {
          dangerModalConfig.onConfirm();
          setDangerModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setDangerModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 4. Undo Toast Notification */}
      <AdminUndoToast
        message={toast.message}
        isVisible={toast.isVisible}
        onUndo={toast.onUndo}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
