"use client";

import React, { useState } from "react";
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

export type AdminModuleTab =
  | "overview"
  | "site-cms"
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

export function MasterAdminConsole({ onLogout }: { onLogout?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>("overview");
  const [activeDevRole, setActiveDevRole] = useState<string>("administrator");

  return (
    <div className={styles.adminWrapper} dir="rtl">
      {/* 1. Master Top Header */}
      <header className={styles.masterHeader}>
        <div className={styles.brandArea}>
          <div className={styles.brandLogo}>E</div>
          <div className={styles.brandInfo}>
            <h1 className={styles.brandTitle}>سامانه مدیریت ارشد ایندورا (Master Admin Console)</h1>
            <p className={styles.brandSubtitle}>مرکز فرماندهی، مدیریت جامع محتوای سایت، کاربران، آموزش و عملیات</p>
          </div>
        </div>

        <div className={styles.headerControls}>
          {/* Dev Mode Role Switcher */}
          <div className={styles.devSwitcher}>
            <span className={styles.devLabel}>شبیه‌ساز نقش (Dev):</span>
            <button
              type="button"
              className={`${styles.devBtn} ${activeDevRole === "administrator" ? styles.devBtnActive : ""}`}
              onClick={() => setActiveDevRole("administrator")}
            >
              👑 مدیر کل
            </button>
            <button
              type="button"
              className={`${styles.devBtn} ${activeDevRole === "teacher" ? styles.devBtnActive : ""}`}
              onClick={() => setActiveDevRole("teacher")}
            >
              🧑‍🏫 مدرس
            </button>
            <button
              type="button"
              className={`${styles.devBtn} ${activeDevRole === "editor" ? styles.devBtnActive : ""}`}
              onClick={() => setActiveDevRole("editor")}
            >
              ✍️ محتوا
            </button>
            <button
              type="button"
              className={`${styles.devBtn} ${activeDevRole === "learner" ? styles.devBtnActive : ""}`}
              onClick={() => setActiveDevRole("learner")}
            >
              🎒 زبان‌آموز
            </button>
          </div>

          <div className={styles.statusIndicator}>
            <span>●</span>
            <span>سامانه عملیاتی (Live)</span>
          </div>

          <Link href="/" target="_blank" className={styles.btnVisitSite}>
            <span>🌐 مشاهده سایت عمومی</span>
            <span style={{ fontSize: "0.7rem" }}>↗</span>
          </Link>

          {onLogout && (
            <button
              type="button"
              className={styles.btnVisitSite}
              style={{ color: "#dc2626", borderColor: "#fca5a5", cursor: "pointer" }}
              onClick={onLogout}
              title="قفل کردن و خروج امن از پنل مدیریت"
            >
              <span>🔒 خروج امن</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Layout (Sidebar + Content View) */}
      <div className={styles.masterLayout}>
        {/* Modular Sidebar */}
        <aside className={styles.sidebar} aria-label="منوی اصلی مدیریت">
          <p className={styles.navGroupTitle}>ارکان مدیریتی</p>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "overview" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span>📊</span>
            <span>نمای کلی و شاخص‌ها</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "site-cms" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("site-cms")}
          >
            <span>📝</span>
            <span>مدیریت محتوا و بخش‌های سایت</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "seo" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("seo")}
          >
            <span>🌐</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>سئو، متادیتا و ریدایرکت‌ها</span>
              <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                SEO
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "ai-engine" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("ai-engine")}
          >
            <span>🧠</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>هوش مصنوعی و مدل‌های زبانی</span>
              <span style={{ background: "#f3e8ff", color: "#7e22ce", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                LLM Ops
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "teacher-verifications" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("teacher-verifications")}
          >
            <span>🏅</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>بررسی و احراز اساتید</span>
              <span style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                صف فعال
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "teacher-contracts" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("teacher-contracts")}
          >
            <span>📜</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>قراردادها و کارمزد اساتید</span>
              <span style={{ background: "#ede9fe", color: "#6b21a8", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                Legal
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "exam-integrity" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("exam-integrity")}
          >
            <span>🛡️</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>ممیزی آزمون‌ها و پروکتورینگ</span>
              <span style={{ background: "#ccfbf1", color: "#0f766e", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                Integrity
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "users" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span>👥</span>
            <span>مدیریت کاربران و دسترسی‌ها</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "marketing" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("marketing")}
          >
            <span>🚀</span>
            <span>بازاریابی، تخفیف‌ها و رشد</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "support" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("support")}
          >
            <span>🎧</span>
            <span>پشتیبانی، تیکت‌ها و بازخورد</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "community" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("community")}
          >
            <span>💬</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>نظارت بر تعاملات و کامیونیتی</span>
              <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                Mod Ops
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "security" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <span>🛡️</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>اتاق امنیت و فایروال</span>
              <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                SOC
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "analytics" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span>📊</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>هوش تجاری و تحلیل قیف</span>
              <span style={{ background: "#e0f2fe", color: "#0284c7", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                BI
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "broadcast" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("broadcast")}
          >
            <span>📢</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <span>مرکز اعلان و پیامک</span>
              <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "0.68rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: "bold" }}>
                ارسال
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "academics" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("academics")}
          >
            <span>🎓</span>
            <span>آموزش، دوره‌ها و بانک سوالات</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "finance" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("finance")}
          >
            <span>💳</span>
            <span>مالی، خزانه‌داری و پلن‌ها</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarBtn} ${activeTab === "system-ops" ? styles.sidebarBtnActive : ""}`}
            onClick={() => setActiveTab("system-ops")}
          >
            <span>⚙️</span>
            <span>عملیات سیستم و کلیدهای اضطراری</span>
          </button>

          <div style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
            <p className={styles.navGroupTitle}>میانبرهای سریع عملیاتی</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <Link
                href="/high-school/grade-12/tamrin20"
                target="_blank"
                className={styles.sidebarBtn}
                style={{ fontSize: "0.8rem", color: "#64748b" }}
              >
                <span>🎯</span>
                <span>تمرین تا ۲۰ (دوازدهم)</span>
              </Link>
              <Link
                href="/skills"
                target="_blank"
                className={styles.sidebarBtn}
                style={{ fontSize: "0.8rem", color: "#64748b" }}
              >
                <span>⚡</span>
                <span>هاب ۶ مهارت</span>
              </Link>
              <Link
                href="/operations/flags"
                className={styles.sidebarBtn}
                style={{ fontSize: "0.8rem", color: "#64748b" }}
              >
                <span>🛑</span>
                <span>کیل‌سوئیچ‌ها</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Content View Area */}
        <main className={styles.mainContent}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* KPI Cards */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>کل کاربران پلتفرم</span>
                    <span className={styles.kpiIcon}>👥</span>
                  </div>
                  <div className={styles.kpiValue}>۱٬۴۲۰</div>
                  <div className={styles.kpiSub}>+۱۲٪ رشد در ماه جاری</div>
                </div>

                <div
                  className={styles.kpiCard}
                  onClick={() => setActiveTab("teacher-verifications")}
                  style={{ cursor: "pointer" }}
                  title="کلیک برای ورود به کارتابل احراز اساتید"
                >
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>اساتید تایید صلاحیت شده</span>
                    <span className={styles.kpiIcon}>🧑‍🏫</span>
                  </div>
                  <div className={styles.kpiValue}>۳۸</div>
                  <div className={styles.kpiSub} style={{ color: "#dc2626", fontWeight: "bold" }}>
                    ۳ متقاضی جدید در صف بررسی ←
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>دوره‌ها و پکیج‌های فعال</span>
                    <span className={styles.kpiIcon}>📚</span>
                  </div>
                  <div className={styles.kpiValue}>۲۴</div>
                  <div className={styles.kpiSub}>شامل آیلتس، کنکور و مکالمه</div>
                </div>

                <div
                  className={styles.kpiCard}
                  onClick={() => setActiveTab("security")}
                  style={{ cursor: "pointer" }}
                  title="کلیک برای ورود به اتاق عملیات امنیت و فایروال"
                >
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiTitle}>اتاق امنیت، نشست‌ها و فایروال</span>
                    <span className={styles.kpiIcon}>🛡️</span>
                  </div>
                  <div className={styles.kpiValue} style={{ fontSize: "1.3rem", color: "#16a34a" }}>
                    ۱۰۰٪ تحت حفاظت
                  </div>
                  <div className={styles.kpiSub} style={{ color: "#2563eb", fontWeight: "bold" }}>
                    پایش نشست‌های زنده و تهدیدات ←
                  </div>
                </div>
              </div>

              {/* Quick Actions & Shortcut Modules */}
              <div className={styles.quickGrid}>
                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>📝 مدیریت محتوا و ویترین عمومی سایت</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    ویرایش آنلاین بنر اعلان بالای صفحه، بخش هیرو، مراحل یادگیری، مهارت‌ها و قیمت‌گذاری‌ها
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("site-cms")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به ویرایشگر دیداری بخش‌های سایت (CMS)</span>
                      <span>←</span>
                    </button>
                    <Link href="/" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده صفحه اصلی عمومی</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>🌐 استودیو سئو، متادیتا و ریدایرکت‌های ۳۰۱/۳۰۲</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    شبیه‌ساز SERP گوگل، کارت‌های اشتراک شبکه‌های اجتماعی، شیلد ریدایرکت با ضدحلقه و داده‌های ساختاریافته Schema.org
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("seo")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به استودیو مدیریت سئو و متادیتا</span>
                      <span>←</span>
                    </button>
                    <Link href="/sitemap.xml" target="_blank" className={styles.quickLinkItem}>
                      <span>نقشه سایت (sitemap.xml)</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>🧠 مرکز فرماندهی هوش مصنوعی و مدل‌های زبانی (LLM Ops)</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    مهندسی زنده پرامپت‌ها، پرسونای دوقلوی هوش مصنوعی، بنچمارک کالیبراسیون نمرات آیلتس، روتینگ و کلید قطع اضطراری
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("ai-engine")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به مرکز مدیریت هوش مصنوعی و پرامپت‌ها</span>
                      <span>←</span>
                    </button>
                    <Link href="/twin" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده دوقلوی هوش مصنوعی (Twin)</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>💬 نظارت بر تعاملات، کامیونیتی و ضد هرزنامه</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    پایش صف نظرات و سوالات با سمیت‌سنجی AI، ارسال پاسخ‌های رسمی مدیریت، مسدودسازی نامحسوس (Shadowban) و شیلد هرزنامه
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("community")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به کارتابل نظارت بر کامیونیتی (Mod Ops)</span>
                      <span>←</span>
                    </button>
                    <Link href="/community" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده تالارهای گفتگوی عمومی</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>👥 کاربران، اساتید و دسترسی‌ها</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    مدیریت نقش‌های کاربری، تایید مدارک تدریس مدرسان و مسدودسازی حساب‌های مشکوک
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("users")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>مشاهده و مدیریت فهرست کاربران</span>
                      <span>←</span>
                    </button>
                    <Link href="/teachers" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده دایرکتوری عمومی اساتید</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>🏅 کارتابل بررسی، احراز هویت و کارمزد اساتید</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    ارزیابی نمونه ویدئوی تدریس، اعتبارسنجی مدارک CELTA/DELTA، تعیین نرخ کارمزد پلتفرم و اعطای نشان‌های شایستگی
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("teacher-verifications")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به کارتابل ارزیابی اساتید (۳ پرونده در انتظار)</span>
                      <span>←</span>
                    </button>
                    <Link href="/teachers" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده ویترین عمومی اساتید</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>📜 سامانه قراردادها، کارمزد پله‌ای و اسناد حقوقی اساتید</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    نظام پله‌ای کارمزد (برنزی ۷۰٪ تا الماسی ۸۵٪)، چرخه حیات قراردادها، امضای دیجیتال پیامکی OTP و گاردریل تسویه‌حساب
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("teacher-contracts")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به کارتابل قراردادها و کارمزد اساتید (Legal)</span>
                      <span>←</span>
                    </button>
                    <Link href="/teacher" target="_blank" className={styles.quickLinkItem}>
                      <span>مشاهده داشبورد اساتید</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>🛡️ مرکز ممیزی آزمون‌ها، تقلب‌یابی و سلامت سنجش</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    پایش زنده جلسات آزمون آنلاین، اخطار و تعلیق پروکتورینگ، کالیبراسیون نمرات هوش مصنوعی، روان‌سنجی سوالات و داوری اعتراضات نمره
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("exam-integrity")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>ورود به رصدخانه آزمون‌ها و ممیزی هوش مصنوعی</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>

                <div className={styles.quickCard}>
                  <h3 className={styles.quickTitle}>
                    <span>🎓 آموزش و بانک سوالات</span>
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    مدیریت دوره‌های آموزشی، سوالات آزمون‌های نهایی، متون آیلتس و درخت مهارت‌ها
                  </p>
                  <div className={styles.quickLinkRow}>
                    <button
                      type="button"
                      className={styles.quickLinkItem}
                      onClick={() => setActiveTab("academics")}
                      style={{ cursor: "pointer", border: "none", width: "100%", textAlign: "right" }}
                    >
                      <span>مرکز مدیریت دوره‌ها و سوالات</span>
                      <span>←</span>
                    </button>
                    <Link href="/operations/questions" className={styles.quickLinkItem}>
                      <span>بانک سوالات و آزمون‌ها (QUESTION-001)</span>
                      <span>←</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITE CMS */}
          {activeTab === "site-cms" && <SiteContentCMSEditor />}

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

          {/* TAB 6: SYSTEM OPS & SECURITY */}
          {activeTab === "system-ops" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "800" }}>
                  عملیات سیستم، کلیدهای اضطراری و ردپای ممیزی
                </h2>
                <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem", color: "#64748b" }}>
                  مدیریت فوری کلیدهای ویژگی (Feature Flags)، کیل‌سوئیچ‌ها و لاگ‌های امنیتی سیستم
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
    </div>
  );
}
