"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./master-admin.module.css";
import {
  IconOverview,
  IconCMS,
  IconSiteBuilder,
  IconForms,
  IconSEO,
  IconAcademics,
  IconExamIntegrity,
  IconUsers,
  IconTeachers,
  IconContracts,
  IconSupport,
  IconCommunity,
  IconFinance,
  IconMarketing,
  IconBroadcast,
  IconAnalytics,
  IconSystemOps,
  IconAiEngine,
  IconSecurity,
  IconSidebarToggle,
  IconSearch,
  IconEye,
  IconLock,
  IconUnlock,
  IconHelp,
  IconExternalLink,
  IconLogout,
  IconChevronDown,
  IconArrowLeft,
  IconTrendingUp,
  IconClock,
  IconCheckCircle,
} from "./AdminIcons";

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
import { AdminHoverTooltip } from "./AdminHoverTooltip";
import { AdminLiveWebsitePreview } from "./AdminLiveWebsitePreview";

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
  siteLocation: string;
  badge?: { text: string; bg: string; color: string };
  isSensitive?: boolean;
}

interface AdminCategoryDef {
  id: string;
  title: string;
  isDangerZone?: boolean;
  items: AdminItemDef[];
}

const ADMIN_CATEGORIES: AdminCategoryDef[] = [
  {
    id: "content",
    title: "محتوا و ظاهر سایت",
    items: [
      {
        id: "overview",
        title: "پیشخوان و نمای کلی",
        shortDesc: "خلاصه وضعیت، صف تاییدها و شاخص‌های کلیدی",
        siteLocation: "پیشخوان داشبورد و شاخص‌های کلیدی سایت",
      },
      {
        id: "site-cms",
        title: "ویرایشگر متن‌ها و بنرها",
        shortDesc: "تغییر آنلاین بنرها، عناوین و قیمت‌های ویترین",
        siteLocation: "صفحه اصلی سایت > نوار اعلان، هیرو، مهارت‌ها و قیمت‌ها",
      },
      {
        id: "site-builder",
        title: "استودیو ساخت لندینگ‌پیج",
        shortDesc: "طراحی صفحات جدید و جشنواره‌ها بدون کدنویسی",
        siteLocation: "صفحات فرود و کمپین‌ها (مانند /p/exam-cram-1403)",
      },
      {
        id: "forms-webhooks",
        title: "فرم‌ها و دریافت پیام‌ها",
        shortDesc: "فرم تماس، پیش‌ثبت‌نام همایش و پرسشنامه‌ها",
        siteLocation: "صفحه تماس با ما و فرم‌های ثبت‌نامی سایت",
      },
      {
        id: "seo",
        title: "تنظیمات گوگل و سئو",
        shortDesc: "بهینه‌سازی کلمات کلیدی، عنوان گوگل و ریدایرکت",
        siteLocation: "نتایج جستجوی گوگل و نقشه سایت (sitemap.xml)",
      },
    ],
  },
  {
    id: "academics",
    title: "مدرسه و آزمون‌ها",
    items: [
      {
        id: "academics",
        title: "دوره‌ها و بانک سوالات",
        shortDesc: "درس‌های پایه‌ها، کنکور، آیلتس و سوالات تستی",
        siteLocation: "بخش مدرسه و پایه‌های دهم تا دوازدهم (/high-school)",
      },
      {
        id: "exam-integrity",
        title: "نظارت بر آزمون و سنجش",
        shortDesc: "مراقبت از آزمون، بررسی تقلب و بازبینی نمرات",
        siteLocation: "اتاق برگزاری آزمون آنلاین و کارنامه زبان‌آموزان (/ielts)",
        badge: { text: "۱ بازبینی", bg: "#fdf4ff", color: "#9333ea" },
      },
    ],
  },
  {
    id: "users",
    title: "کاربران و پشتیبانی",
    items: [
      {
        id: "users",
        title: "فهرست اعضا و دسترسی‌ها",
        shortDesc: "مدیریت کاربران، زبان‌آموزان و نقش‌ها",
        siteLocation: "حساب‌های کاربری و پروفایل زبان‌آموزان (/profile)",
      },
      {
        id: "teacher-verifications",
        title: "بررسی و احراز اساتید",
        shortDesc: "مشاهده نمونه ویدیو و مدارک تدریس ارسالی مدرسان",
        siteLocation: "ویترین عمومی اساتید و رزومه مدرسان (/teachers)",
        badge: { text: "۳ در صف", bg: "#fef2f2", color: "#dc2626" },
      },
      {
        id: "teacher-contracts",
        title: "قراردادها و کارمزد تدریس",
        shortDesc: "تعیین درصد کارمزد تدریس و متن قراردادها",
        siteLocation: "قراردادهای مالی و سهم تدریس در پنل اساتید (/teacher)",
      },
      {
        id: "support",
        title: "تیکت‌های پشتیبانی",
        shortDesc: "پاسخ به سوالات و مشکلات زبان‌آموزان",
        siteLocation: "بخش پشتیبانی و ارسال تیکت دانش‌آموزان (/support)",
        badge: { text: "۲ جدید", bg: "#fffbeb", color: "#b45309" },
      },
      {
        id: "community",
        title: "نظرات و تالار گفتگو",
        shortDesc: "تایید نظرات کاربران و جلوگیری از پیام نامناسب",
        siteLocation: "تالار گفتگوی عمومی و نظرات زیر درس‌ها (/community)",
        badge: { text: "۴ نظر", bg: "#eff6ff", color: "#2563eb" },
      },
    ],
  },
  {
    id: "growth",
    title: "فروش و بازاریابی",
    items: [
      {
        id: "finance",
        title: "درآمد و خزانه‌داری",
        shortDesc: "گزارش فروش، فاکتورها و تسویه‌حساب معلمان",
        siteLocation: "جدول قیمت‌ها و درگاه پرداخت شاپرک (/pricing)",
      },
      {
        id: "marketing",
        title: "کدهای تخفیف و کمپین",
        shortDesc: "تعریف کوپن تخفیف و پیشنهادهای ویژه",
        siteLocation: "کادر کد تخفیف در سبد خرید دوره (/checkout)",
      },
      {
        id: "broadcast",
        title: "ارسال پیامک و اعلانات",
        shortDesc: "پیامک گروهی و نوتیفیکیشن همگانی به کاربران",
        siteLocation: "صندوق پیامک موبایل کاربران و اعلانات درون‌برنامه‌ای",
      },
      {
        id: "analytics",
        title: "آمار و رشد پلتفرم",
        shortDesc: "تعداد بازدیدهای امروز و رفتار کاربران",
        siteLocation: "سیستم پایش آمار بازدیدکنندگان سایت",
      },
    ],
  },
  {
    id: "danger_zone",
    title: "تنظیمات زیرساخت و سرور",
    isDangerZone: true,
    items: [
      {
        id: "system-ops",
        title: "عملیات سرور و دیتابیس",
        shortDesc: "بک‌آپ کل سامانه، حالت تعمیرات و موتورخانه سرور",
        siteLocation: "سرور اصلی، حافظه کش و پایگاه داده",
        isSensitive: true,
      },
      {
        id: "ai-engine",
        title: "موتور هوش مصنوعی و پرامپت‌ها",
        shortDesc: "دستورات تصحیح آزمون و تنظیمات مدل‌های زبانی",
        siteLocation: "موتور هوش مصنوعی تصحیح گفتار و رایتینگ",
        isSensitive: true,
      },
      {
        id: "security",
        title: "امنیت و دیوار آتش (Firewall)",
        shortDesc: "شناسایی حملات و مسدودسازی آی‌پی مزاحم",
        siteLocation: "دیوار آتش و سیستم نگهبانی سرور",
        isSensitive: true,
      },
    ],
  },
];

function renderItemIcon(tabId: AdminModuleTab, size = 18) {
  switch (tabId) {
    case "overview":
      return <IconOverview size={size} />;
    case "site-cms":
      return <IconCMS size={size} />;
    case "site-builder":
      return <IconSiteBuilder size={size} />;
    case "forms-webhooks":
      return <IconForms size={size} />;
    case "seo":
      return <IconSEO size={size} />;
    case "academics":
      return <IconAcademics size={size} />;
    case "exam-integrity":
      return <IconExamIntegrity size={size} />;
    case "users":
      return <IconUsers size={size} />;
    case "teacher-verifications":
      return <IconTeachers size={size} />;
    case "teacher-contracts":
      return <IconContracts size={size} />;
    case "support":
      return <IconSupport size={size} />;
    case "community":
      return <IconCommunity size={size} />;
    case "finance":
      return <IconFinance size={size} />;
    case "marketing":
      return <IconMarketing size={size} />;
    case "broadcast":
      return <IconBroadcast size={size} />;
    case "analytics":
      return <IconAnalytics size={size} />;
    case "system-ops":
      return <IconSystemOps size={size} />;
    case "ai-engine":
      return <IconAiEngine size={size} />;
    case "security":
      return <IconSecurity size={size} />;
    default:
      return <IconOverview size={size} />;
  }
}

export function MasterAdminConsole({ onLogout }: { onLogout?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sidebar Collapse state (Expanded = true, Collapsed = false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Category Accordion State (all open by default)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Slide-over Live Preview Drawer State (closed by default for spacious workspace)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState<boolean>(false);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  // Safety Lock State for Category 5 (Sensitive Zone)
  const [isTechnicalZoneUnlocked, setIsTechnicalZoneUnlocked] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingSensitiveTab, setPendingSensitiveTab] = useState<AdminModuleTab | null>(null);

  // Help Modal State
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

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openHelp = (tab: AdminModuleTab, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHelpTab(tab);
    setIsHelpOpen(true);
  };

  const handleSelectTab = (tab: AdminModuleTab, isSensitive?: boolean) => {
    if (isSensitive && !isTechnicalZoneUnlocked) {
      setPendingSensitiveTab(tab);
      setIsPinModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsTechnicalZoneUnlocked(true);
    setToast({
      message: "🔓 قفل تنظیمات زیرساخت با موفقیت باز شد.",
      isVisible: true,
    });
    if (pendingSensitiveTab) {
      setActiveTab(pendingSensitiveTab);
      setPendingSensitiveTab(null);
    }
  };

  const handleLockZone = () => {
    setIsTechnicalZoneUnlocked(false);
    if (["system-ops", "ai-engine", "security"].includes(activeTab)) {
      setActiveTab("overview");
    }
    setToast({
      message: "🔒 بخش‌های حساس مجدداً در حالت امن قفل شدند.",
      isVisible: true,
    });
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
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

  const isCurrentTabSensitive = ["system-ops", "ai-engine", "security"].includes(activeTab);

  return (
    <div className={styles.adminWrapper} dir="rtl">
      {/* 1. Compact Top Bar (54px) */}
      <header className={styles.masterHeader}>
        {/* Right side: Brand & Sidebar toggle */}
        <div className={styles.brandArea}>
          <button
            type="button"
            className={styles.btnSidebarToggle}
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            title={isSidebarCollapsed ? "باز کردن سایدبار" : "جمع کردن سایدبار"}
            aria-label="تاگل سایدبار"
          >
            <IconSidebarToggle isCollapsed={isSidebarCollapsed} size={18} />
          </button>

          <div className={styles.brandLogo}>E</div>

          <div className={styles.brandTitle}>
            <span>ایندورا</span>
            <span className={styles.brandTag}>مدیریت</span>
          </div>
        </div>

        {/* Center: Sleek Quick Search Bar */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <IconSearch size={15} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="جستجوی سریع امکانات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {!searchQuery && <span className={styles.searchKbd}>Ctrl+K</span>}
          {searchQuery && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setSearchQuery("")}
              title="پاک کردن"
            >
              ✕
            </button>
          )}
        </div>

        {/* Left side: System status & action controls */}
        <div className={styles.headerControls}>
          {/* Subtle System Status Pill */}
          <div className={styles.statusPill} title="همه سرویس‌ها با ضریب ۱۰۰٪ فعال هستند">
            <span className={styles.statusDot} />
            <span>سامانه ۱۰۰٪ پایدار</span>
          </div>

          {/* Admin Profile Badge */}
          <div className={styles.adminProfileBadge} title="مدیر ارشد سامانه ایندورا">
            <div className={styles.adminAvatar}>A</div>
            <span className={styles.adminProfileName}>مدیر ارشد</span>
          </div>

          {/* Live Preview Toggle Button */}
          <button
            type="button"
            className={`${styles.btnHeaderAction} ${
              isPreviewOpen ? styles.btnHeaderActionActive : ""
            }`}
            onClick={() => setIsPreviewOpen((prev) => !prev)}
            title="مشاهده پیش‌نمایش زنده دراور سایت"
          >
            <IconEye size={16} />
            <span>پیش‌نمایش سایت</span>
          </button>

          {/* Quick Help Modal Trigger */}
          <button
            type="button"
            className={styles.btnHeaderAction}
            onClick={() => openHelp(activeTab)}
            title="راهنمای ساده این بخش"
          >
            <IconHelp size={16} />
            <span>راهنما</span>
          </button>

          {/* Sensitive Zone PIN Lock Toggle */}
          <button
            type="button"
            className={`${styles.btnSafety} ${
              isTechnicalZoneUnlocked ? styles.btnSafetyUnlocked : ""
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
                ? "قفل منطقه فنی باز است. برای ایمنی کلیک کنید تا قفل شود."
                : "بخش‌های حساس سرور و هوش مصنوعی قفل محافظ دارند."
            }
          >
            {isTechnicalZoneUnlocked ? <IconUnlock size={15} /> : <IconLock size={15} />}
            <span>{isTechnicalZoneUnlocked ? "زیرساخت باز" : "محافظ فعال"}</span>
          </button>

          {/* Visit Public Site */}
          <Link
            href="/"
            target="_blank"
            className={styles.btnVisit}
            title="مشاهده وب‌سایت عمومی در تب جدید"
          >
            <span>سایت</span>
            <IconExternalLink size={13} />
          </Link>

          {/* Logout Button */}
          {onLogout && (
            <button
              type="button"
              className={styles.btnLogout}
              onClick={onLogout}
              title="خروج امن از پنل"
            >
              <IconLogout size={14} />
              <span>خروج</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Master Layout: Sidebar + Main Content */}
      <div className={styles.masterLayout}>
        {/* Modern Collapsible Sidebar */}
        <aside
          className={`${styles.sidebar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}
          aria-label="منوی بخش‌های مدیریت"
        >
          {filteredCategories.map((category) => {
            const isCatCollapsed = Boolean(collapsedCategories[category.id]);

            return (
              <div key={category.id} className={styles.categoryGroup}>
                {/* Category Header (Accordion) - only shown when sidebar is expanded */}
                {!isSidebarCollapsed && (
                  <div
                    className={styles.categoryHeader}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className={styles.categoryTitle}>{category.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span className={styles.categoryBadge}>{category.items.length}</span>
                      <span
                        className={`${styles.categoryChevron} ${
                          isCatCollapsed
                            ? styles.categoryChevronClosed
                            : styles.categoryChevronOpen
                        }`}
                      >
                        <IconChevronDown size={13} />
                      </span>
                    </div>
                  </div>
                )}

                {/* Items in Category */}
                {(!isCatCollapsed || isSidebarCollapsed) && (
                  <div className={styles.categoryList}>
                    {category.items.map((item) => {
                      const isActive = activeTab === item.id;

                      const buttonElement = (
                        <button
                          type="button"
                          className={`${styles.sidebarBtn} ${
                            isActive ? styles.sidebarBtnActive : ""
                          } ${isSidebarCollapsed ? styles.sidebarBtnCollapsed : ""}`}
                          onClick={() => handleSelectTab(item.id, item.isSensitive)}
                        >
                          <div className={styles.sidebarBtnContent}>
                            <span className={styles.sidebarItemIcon}>
                              {renderItemIcon(item.id, isSidebarCollapsed ? 19 : 17)}
                            </span>
                            {!isSidebarCollapsed && (
                              <span className={styles.sidebarItemTitle}>{item.title}</span>
                            )}
                          </div>

                          {!isSidebarCollapsed && item.badge && (
                            <span
                              style={{
                                background: item.badge.bg,
                                color: item.badge.color,
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                                padding: "0.1rem 0.45rem",
                                borderRadius: "999px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </button>
                      );

                      return (
                        <div key={item.id} className={styles.sidebarItemWrapper}>
                          <AdminHoverTooltip
                            itemTitle={item.title}
                            whatIsIt={item.shortDesc}
                            siteLocation={item.siteLocation}
                            sensitivity={
                              item.isSensitive
                                ? "critical"
                                : category.id === "content"
                                ? "medium"
                                : "safe"
                            }
                            highlightKey={item.id}
                            isCollapsed={isSidebarCollapsed}
                            onHoverTarget={setHoveredTarget}
                          >
                            {buttonElement}
                          </AdminHoverTooltip>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Link Footer */}
          {!isSidebarCollapsed && (
            <div className={styles.sidebarFooter}>
              <Link
                href="/high-school/grade-12/tamrin20"
                target="_blank"
                className={styles.sidebarFooterLink}
              >
                <IconAcademics size={14} />
                <span>تمرین تا ۲۰ (دوازدهم)</span>
              </Link>
            </div>
          )}
        </aside>

        {/* Dynamic Main Workspace */}
        <main className={styles.mainContent}>
          {/* Subtle Sensitive Zone Notice */}
          {isCurrentTabSensitive && (
            <div className={styles.subtleDangerNotice}>
              <div className={styles.subtleDangerLeft}>
                <IconLock size={16} />
                <span>منطقه حساس و فنی: تغییرات مستقیماً بر عملکرد سرور و دیتابیس اثر می‌گذارد.</span>
              </div>
              <button
                type="button"
                className={styles.btnLockInline}
                onClick={handleLockZone}
              >
                قفل کردن این بخش
              </button>
            </div>
          )}

          {/* ==============================================================================
              TAB: OVERVIEW (HIGH-DENSITY MODERN 4-KPI + 2-COLUMN DASHBOARD)
              ============================================================================== */}
          {activeTab === "overview" && (
            <div className={styles.overviewContainer}>
              {/* Row 1: 4 Key Metric Cards (KPIs - Luxury Bento Grid) */}
              <div className={styles.kpiGrid}>
                {/* KPI 1: Users */}
                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>کل زبان‌آموزان ثبت‌نامی</span>
                    <div
                      className={styles.kpiIconWrapper}
                      style={{
                        background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                        color: "#4338ca",
                      }}
                    >
                      <IconUsers size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue}>۱٬۴۲۰</div>
                  <div className={styles.kpiBottom}>
                    <span className={styles.kpiTrendUp}>
                      <IconTrendingUp size={13} /> +۱۲٪
                    </span>
                    <span style={{ color: "#64748b" }}>رشد اعضا در ماه جاری</span>
                  </div>
                </div>

                {/* KPI 2: Teachers (Interactive) */}
                <div
                  className={styles.kpiCard}
                  onClick={() => setActiveTab("teacher-verifications")}
                  style={{ cursor: "pointer" }}
                  title="کلیک برای مشاهده اساتید منتظر تایید"
                >
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>اساتید فعال پلتفرم</span>
                    <div
                      className={styles.kpiIconWrapper}
                      style={{
                        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        color: "#b45309",
                      }}
                    >
                      <IconTeachers size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue}>۳۸</div>
                  <div className={styles.kpiBottom}>
                    <span className={styles.kpiTrendWarning}>
                      <span>۳ متقاضی جدید در صف</span>
                      <IconArrowLeft size={11} />
                    </span>
                  </div>
                </div>

                {/* KPI 3: Academics & Courses (Interactive) */}
                <div
                  className={styles.kpiCard}
                  onClick={() => setActiveTab("academics")}
                  style={{ cursor: "pointer" }}
                  title="کلیک برای مشاهده لیست دوره‌ها و پایه‌ها"
                >
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>دوره‌ها و بسته‌های فعال</span>
                    <div
                      className={styles.kpiIconWrapper}
                      style={{
                        background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        color: "#047857",
                      }}
                    >
                      <IconAcademics size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue}>۲۴</div>
                  <div className={styles.kpiBottom}>
                    <span className={styles.kpiTrendNeutral}>
                      <span>پایه‌ها، آیلتس و مکالمه</span>
                      <IconArrowLeft size={11} />
                    </span>
                  </div>
                </div>

                {/* KPI 4: Security & Stability */}
                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>ضریب پایداری و امنیت سرور</span>
                    <div
                      className={styles.kpiIconWrapper}
                      style={{
                        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                        color: "#15803d",
                      }}
                    >
                      <IconCheckCircle size={18} />
                    </div>
                  </div>
                  <div className={styles.kpiValue} style={{ color: "#059669" }}>
                    ۱۰۰٪
                  </div>
                  <div className={styles.kpiBottom}>
                    <span className={styles.kpiTrendUp}>
                      <span className={styles.statusDot} style={{ width: 6, height: 6 }} />
                      <span>پایش ۲۴ ساعته تهدیدات</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Balanced 2-Column Section */}
              <div className={styles.twoColLayout}>
                {/* Column 1: Action Task Queue (Smart Priority Triage Deck) */}
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>
                      <IconClock size={17} style={{ color: "#4f46e5" }} />
                      <span>کارهای فوری منتظر اقدام</span>
                    </h3>
                    <span className={styles.panelCount}>۴ مورد معلق</span>
                  </div>

                  <div className={styles.taskQueueList}>
                    {/* Task 1: Teacher Verification */}
                    <div className={`${styles.taskQueueItem} ${styles.taskQueueItemAmber}`}>
                      <div className={styles.taskInfo}>
                        <div
                          className={styles.taskIconBox}
                          style={{
                            color: "#d97706",
                            borderColor: "#fde68a",
                            background: "#fffbeb",
                          }}
                        >
                          <IconTeachers size={18} />
                        </div>
                        <div className={styles.taskTexts}>
                          <div className={styles.taskMetaRow}>
                            <span
                              className={styles.taskPriorityBadge}
                              style={{ background: "#fef3c7", color: "#b45309" }}
                            >
                              فوری - ارزیابی اساتید
                            </span>
                            <span className={styles.taskTimeTag}>۱۰ دقیقه پیش</span>
                          </div>
                          <span className={styles.taskTitle}>۳ متقاضی تدریس جدید در صف احراز صلاحیت</span>
                          <span className={styles.taskDesc}>
                            نمونه ویدیوهای تدریس ارسالی اساتید نیازمند بررسی کیفی و تایید صلاحیت هستند.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.taskActionBtn}
                        onClick={() => setActiveTab("teacher-verifications")}
                      >
                        <span>بررسی مدارک</span>
                        <IconArrowLeft size={13} />
                      </button>
                    </div>

                    {/* Task 2: Support Tickets */}
                    <div className={`${styles.taskQueueItem} ${styles.taskQueueItemRose}`}>
                      <div className={styles.taskInfo}>
                        <div
                          className={styles.taskIconBox}
                          style={{
                            color: "#dc2626",
                            borderColor: "#fecdd3",
                            background: "#fff1f2",
                          }}
                        >
                          <IconSupport size={18} />
                        </div>
                        <div className={styles.taskTexts}>
                          <div className={styles.taskMetaRow}>
                            <span
                              className={styles.taskPriorityBadge}
                              style={{ background: "#fee2e2", color: "#dc2626" }}
                            >
                              پشتیبانی و ثبت‌نام
                            </span>
                            <span className={styles.taskTimeTag}>۲۵ دقیقه پیش</span>
                          </div>
                          <span className={styles.taskTitle}>۲ پیام پشتیبانی پاسخ‌داده‌نشده</span>
                          <span className={styles.taskDesc}>
                            دانش‌آموزان در مورد اتصال درگاه و دسترسی به ویدیوهای درس سوال دارند.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.taskActionBtn}
                        onClick={() => setActiveTab("support")}
                      >
                        <span>پاسخگویی</span>
                        <IconArrowLeft size={13} />
                      </button>
                    </div>

                    {/* Task 3: Community Comments */}
                    <div className={`${styles.taskQueueItem} ${styles.taskQueueItemBlue}`}>
                      <div className={styles.taskInfo}>
                        <div
                          className={styles.taskIconBox}
                          style={{
                            color: "#2563eb",
                            borderColor: "#bfdbfe",
                            background: "#eff6ff",
                          }}
                        >
                          <IconCommunity size={18} />
                        </div>
                        <div className={styles.taskTexts}>
                          <div className={styles.taskMetaRow}>
                            <span
                              className={styles.taskPriorityBadge}
                              style={{ background: "#dbeafe", color: "#1d4ed8" }}
                            >
                              تالار گفتگو و تعامل
                            </span>
                            <span className={styles.taskTimeTag}>۱ ساعت پیش</span>
                          </div>
                          <span className={styles.taskTitle}>۴ نظر جدید در تالار گفتگو</span>
                          <span className={styles.taskDesc}>
                            نظرات ارسالی زیر درس‌های دوازدهم برای حفظ کیفیت گفتگو منتظر تاییدند.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.taskActionBtn}
                        onClick={() => setActiveTab("community")}
                      >
                        <span>تایید نظرات</span>
                        <IconArrowLeft size={13} />
                      </button>
                    </div>

                    {/* Task 4: Exam Integrity */}
                    <div className={`${styles.taskQueueItem} ${styles.taskQueueItemPurple}`}>
                      <div className={styles.taskInfo}>
                        <div
                          className={styles.taskIconBox}
                          style={{
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                            background: "#f5f3ff",
                          }}
                        >
                          <IconExamIntegrity size={18} />
                        </div>
                        <div className={styles.taskTexts}>
                          <div className={styles.taskMetaRow}>
                            <span
                              className={styles.taskPriorityBadge}
                              style={{ background: "#ede9fe", color: "#6d28d9" }}
                            >
                              سنجش و نمره‌دهی
                            </span>
                            <span className={styles.taskTimeTag}>۲ ساعت پیش</span>
                          </div>
                          <span className={styles.taskTitle}>درخواست بازبینی نمره رایتینگ آیلتس</span>
                          <span className={styles.taskDesc}>
                            زبان‌آموز درخواست بازنگری تحلیل هوش مصنوعی توسط سرگروه آموزشی دارد.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.taskActionBtn}
                        onClick={() => setActiveTab("exam-integrity")}
                      >
                        <span>بازبینی کارنامه</span>
                        <IconArrowLeft size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick Shortcuts & Realtime Telemetry (Right) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Shortcuts Card */}
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <h3 className={styles.panelTitle}>
                        <span>دسترسی‌های سریع</span>
                      </h3>
                      <span style={{ fontSize: "0.725rem", color: "#94a3b8", fontWeight: 600 }}>
                        پرتکرارترین‌ها
                      </span>
                    </div>

                    <div className={styles.shortcutGrid}>
                      <div
                        className={styles.shortcutBtn}
                        onClick={() => setActiveTab("site-cms")}
                        title="ویرایش متون، عناوین و بنرهای صفحه نخست"
                      >
                        <div
                          className={styles.shortcutIconWrap}
                          style={{ background: "#eef2ff", color: "#4f46e5" }}
                        >
                          <IconCMS size={18} />
                        </div>
                        <div className={styles.shortcutInfo}>
                          <span className={styles.shortcutTitle}>ویرایش متن و بنر</span>
                          <span className={styles.shortcutDesc}>صفحه اصلی سایت</span>
                        </div>
                      </div>

                      <div
                        className={styles.shortcutBtn}
                        onClick={() => setActiveTab("marketing")}
                        title="تعریف کدهای تخفیف، کمپین‌ها و جشنواره‌ها"
                      >
                        <div
                          className={styles.shortcutIconWrap}
                          style={{ background: "#fffbeb", color: "#d97706" }}
                        >
                          <IconMarketing size={18} />
                        </div>
                        <div className={styles.shortcutInfo}>
                          <span className={styles.shortcutTitle}>کد تخفیف جدید</span>
                          <span className={styles.shortcutDesc}>کمپین و جشنواره</span>
                        </div>
                      </div>

                      <div
                        className={styles.shortcutBtn}
                        onClick={() => setActiveTab("broadcast")}
                        title="ارسال پیامک انبوه و اعلانات درون‌برنامه‌ای"
                      >
                        <div
                          className={styles.shortcutIconWrap}
                          style={{ background: "#fef2f2", color: "#dc2626" }}
                        >
                          <IconBroadcast size={18} />
                        </div>
                        <div className={styles.shortcutInfo}>
                          <span className={styles.shortcutTitle}>ارسال پیامک و اعلان</span>
                          <span className={styles.shortcutDesc}>اطلاع‌رسانی همگانی</span>
                        </div>
                      </div>

                      <div
                        className={styles.shortcutBtn}
                        onClick={() => setActiveTab("academics")}
                        title="ایجاد درس، آپلود جزوه و بانک تست جدید"
                      >
                        <div
                          className={styles.shortcutIconWrap}
                          style={{ background: "#ecfdf5", color: "#059669" }}
                        >
                          <IconAcademics size={18} />
                        </div>
                        <div className={styles.shortcutInfo}>
                          <span className={styles.shortcutTitle}>مدیریت دوره‌ها و تست</span>
                          <span className={styles.shortcutDesc}>پایه‌ها و بانک تست</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Infrastructure Telemetry Card */}
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <h3 className={styles.panelTitle}>
                        <IconCheckCircle size={17} style={{ color: "#10b981" }} />
                        <span>پایش سلامت زیرساخت</span>
                      </h3>
                      <span style={{ fontSize: "0.725rem", color: "#059669", fontWeight: 700 }}>
                        آپ‌تایم ۹۹.۹۸٪
                      </span>
                    </div>

                    <div className={styles.systemHealthList}>
                      <div className={styles.systemHealthRow}>
                        <div className={styles.healthItemLeft}>
                          <IconSystemOps size={15} style={{ color: "#4f46e5" }} />
                          <span>سرور و هسته وب‌سایت</span>
                        </div>
                        <div className={styles.healthItemStatus}>
                          <span className={styles.healthLatencyChip}>24ms</span>
                          <span className={styles.statusDot} />
                          <span>۱۰۰٪ آنلاین</span>
                        </div>
                      </div>

                      <div className={styles.systemHealthRow}>
                        <div className={styles.healthItemLeft}>
                          <IconCheckCircle size={15} style={{ color: "#0284c7" }} />
                          <span>پشتیبان‌گیری دیتابیس</span>
                        </div>
                        <div className={styles.healthItemStatus}>
                          <span className={styles.healthFreshnessChip}>موفق (امروز ۰۴:۰۰)</span>
                        </div>
                      </div>

                      <div className={styles.systemHealthRow}>
                        <div className={styles.healthItemLeft}>
                          <IconFinance size={15} style={{ color: "#059669" }} />
                          <span>درگاه پرداخت شاپرک</span>
                        </div>
                        <div className={styles.healthItemStatus}>
                          <span className={styles.healthLatencyChip}>۹۹.۴٪ موفق</span>
                          <span className={styles.statusDot} />
                          <span>متصل و پایدار</span>
                        </div>
                      </div>

                      <div className={styles.systemHealthRow}>
                        <div className={styles.healthItemLeft}>
                          <IconAiEngine size={15} style={{ color: "#7c3aed" }} />
                          <span>موتور هوش مصنوعی تصحیح</span>
                        </div>
                        <div className={styles.healthItemStatus}>
                          <span
                            className={styles.healthFreshnessChip}
                            style={{ color: "#6d28d9", background: "#f5f3ff", borderColor: "#ddd6fe" }}
                          >
                            ۰ در صف انتظار
                          </span>
                          <span className={styles.statusDot} />
                          <span>آماده پردازش</span>
                        </div>
                      </div>
                    </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <ServerOperationsGodMode />

              <div
                style={{
                  background: "#ffffff",
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.4rem 0",
                    fontSize: "1rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  مدیریت کلیدهای ویژگی (Feature Flags) و لاگ‌های ممیزی
                </h3>
                <p
                  style={{
                    margin: "0 0 1.25rem 0",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  تنظیمات پیشرفته ویژگی‌های سامانه و ثبت وقایع ممیزی برای مدیران فنی
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <FeatureFlagsOperations />
                  <AuditLogsOperations />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Interactive Split-Screen Live Preview Drawer */}
      <AdminLiveWebsitePreview
        activeTab={activeTab}
        highlightTarget={hoveredTarget}
        isOpen={isPreviewOpen}
        onToggleOpen={() => setIsPreviewOpen((prev) => !prev)}
        isExpanded={isPreviewExpanded}
        onToggleExpand={() => setIsPreviewExpanded((prev) => !prev)}
      />

      {/* 4. "Explain Like I'm 5" Help Modal */}
      <AdminHelpModal
        tab={helpTab}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 5. Security PIN Modal for unlocking Danger Zone */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        title="تأیید هویت مدیر ارشد"
        description="جهت دسترسی به تنظیمات فنی سرور، پایگاه داده و هوش مصنوعی، لطفاً پین امنیتی مدیر ارشد (پیش‌فرض: ۱۲۳۴۵۶) را وارد نمایید."
        onSuccess={handlePinSuccess}
        onCancel={() => {
          setIsPinModalOpen(false);
          setPendingSensitiveTab(null);
        }}
      />

      {/* 6. Two-Step Danger Confirmation Modal */}
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

      {/* 7. Undo Toast Notification */}
      <AdminUndoToast
        message={toast.message}
        isVisible={toast.isVisible}
        onUndo={toast.onUndo}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
