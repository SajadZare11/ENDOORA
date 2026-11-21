"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./admin-live-website-preview.module.css";
import { AdminModuleTab } from "./MasterAdminConsole";

export interface AdminLiveWebsitePreviewProps {
  activeTab: AdminModuleTab;
  highlightTarget: string | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const TARGET_DESCRIPTIONS: Record<
  string,
  { title: string; location: string; defaultPath: string; selector?: string }
> = {
  banner: {
    title: "نوار اعلان و پیام بالای صفحه",
    location: "بالاترین قسمت صفحه اصلی سایت (قبل از منوی اصلی)",
    defaultPath: "/",
    selector: "header, [class*='banner'], [class*='announcement']",
  },
  hero: {
    title: "بخش خوش‌آمدگویی و تیتر اصلی (Hero)",
    location: "بالای صفحه اول، تیتر بزرگ و دکمه‌های شروع",
    defaultPath: "/",
    selector: "section:first-of-type, [class*='hero']",
  },
  skills: {
    title: "کارت‌های مهارت‌های ۶گانه انگلیسی",
    location: "بخش میانی صفحه اول (شنیداری، گفتار، رایتینگ، ریدینگ)",
    defaultPath: "/",
    selector: "[class*='skill'], [class*='matrix']",
  },
  academics: {
    title: "دوره‌های آموزشی و تمرین تا ۲۰ دوازدهم",
    location: "صفحه تمرین تا ۲۰ پایه دوازدهم (/high-school/grade-12/tamrin20)",
    defaultPath: "/high-school/grade-12/tamrin20",
    selector: "[class*='course'], [class*='lesson']",
  },
  "exam-integrity": {
    title: "صفحه آزمون‌های آنلاین و ممیزی سنجش",
    location: "اتاق برگزاری آزمون و تعیین سطح (/placement)",
    defaultPath: "/placement",
  },
  teachers: {
    title: "ویترین اساتید و رزومه مدرسان",
    location: "صفحه لیست اساتید منتخب ایندورا (/teachers)",
    defaultPath: "/teachers",
    selector: "[class*='teacher']",
  },
  "teacher-verifications": {
    title: "ویترین اساتید و اعتبارسنجی مدارک",
    location: "صفحه عمومی اساتید (/teachers)",
    defaultPath: "/teachers",
  },
  "teacher-contracts": {
    title: "قراردادها و کارمزد تدریس",
    location: "صفحه عمومی معرفی اساتید (/teachers)",
    defaultPath: "/teachers",
  },
  pricing: {
    title: "جدول تعرفه‌ها و قیمت بسته‌های آموزشی",
    location: "صفحه قیمت‌ها و اشتراک‌ها (/pricing)",
    defaultPath: "/pricing",
    selector: "[class*='pricing'], [class*='plan']",
  },
  finance: {
    title: "قیمت‌ها و درگاه خرید دوره",
    location: "صفحه تعرفه‌ها و اشتراک‌های ویژه (/pricing)",
    defaultPath: "/pricing",
  },
  marketing: {
    title: "کدهای تخفیف و جشنواره‌ها",
    location: "صفحه تعرفه‌ها و بسته‌ها (/pricing)",
    defaultPath: "/pricing",
  },
  support: {
    title: "پشتیبانی و تیکت‌ها",
    location: "صفحه پشتیبانی و گفتگوی آنلاین (/support)",
    defaultPath: "/support",
  },
  community: {
    title: "نظرات و تالار گفتگوی کاربران",
    location: "تالار گفتگوی عمومی دانش‌آموزان (/community)",
    defaultPath: "/community",
    selector: "[class*='comment'], [class*='discussion']",
  },
  footer: {
    title: "پاورقی سایت، اطلاعات تماس و نمادها",
    location: "انتهای تمام صفحات سایت (پایین صفحه)",
    defaultPath: "/",
    selector: "footer",
  },
  seo: {
    title: "نقشه سایت و آدرس‌های سئو",
    location: "نقشه سایت (sitemap.xml)",
    defaultPath: "/sitemap.xml",
  },
  "site-cms": {
    title: "ویترین صفحه اصلی سایت",
    location: "صفحه اول وب‌سایت ایندورا (/)",
    defaultPath: "/",
  },
  "site-builder": {
    title: "صفحات فرود و جشنواره‌ها",
    location: "نمونه صفحه اختصاصی لندینگ (/p/exam-cram-1403)",
    defaultPath: "/p/exam-cram-1403",
  },
  "forms-webhooks": {
    title: "فرم‌های سایت",
    location: "صفحه پشتیبانی و ارتباط با ما (/support)",
    defaultPath: "/support",
  },
  users: {
    title: "پروفایل و بخش کاربران",
    location: "صفحه اساتید و کاربران (/teachers)",
    defaultPath: "/teachers",
  },
  broadcast: {
    title: "اعلانات و پیام‌ها",
    location: "صفحه اصلی سایت (/)",
    defaultPath: "/",
  },
  analytics: {
    title: "آمار بازدیدها",
    location: "صفحه اصلی سایت (/)",
    defaultPath: "/",
  },
  "system-ops": {
    title: "موتورخانه سرور و پایگاه داده",
    location: "پشت‌صحنه فنی سرور (بدون صفحه ظاهری عمومی)",
    defaultPath: "/",
  },
  "ai-engine": {
    title: "مغز ربات هوش مصنوعی",
    location: "سیستم ارزیابی و تصحیح هوشمند گفتار و رایتینگ",
    defaultPath: "/",
  },
  security: {
    title: "دیوار آتش و اتاق امنیت",
    location: "پشت صحنه: فایروال و امنیت سرور",
    defaultPath: "/",
  },
};

export function AdminLiveWebsitePreview({
  activeTab,
  highlightTarget,
  isOpen,
  onToggleOpen,
  isExpanded,
  onToggleExpand,
}: AdminLiveWebsitePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [addressBarInput, setAddressBarInput] = useState<string>("/");
  const [viewMode, setViewMode] = useState<"iframe" | "diagram">("iframe");
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isTechnicalZone = ["system-ops", "ai-engine", "security"].includes(activeTab);

  // Synchronize target path when activeTab changes
  useEffect(() => {
    let target = "/";
    switch (activeTab) {
      case "site-cms":
      case "overview":
        target = "/";
        break;
      case "site-builder":
        target = "/p/exam-cram-1403";
        break;
      case "seo":
        target = "/sitemap.xml";
        break;
      case "academics":
        target = "/high-school/grade-12/tamrin20";
        break;
      case "exam-integrity":
        target = "/placement";
        break;
      case "teacher-verifications":
      case "teacher-contracts":
      case "users":
        target = "/teachers";
        break;
      case "support":
      case "community":
        target = "/community";
        break;
      case "finance":
      case "marketing":
        target = "/pricing";
        break;
      case "system-ops":
      case "ai-engine":
      case "security":
        target = "/";
        setViewMode("diagram");
        break;
      default:
        target = "/";
        break;
    }

    if (!isTechnicalZone) {
      setViewMode("iframe");
    }

    setCurrentPath(target);
    setAddressBarInput(target);
    setIsLoadingIframe(true);
  }, [activeTab, isTechnicalZone]);

  // Attempt smart in-frame highlight / scroll on same-origin iframe
  useEffect(() => {
    if (!highlightTarget || viewMode !== "iframe") return;

    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc) {
        const config = TARGET_DESCRIPTIONS[highlightTarget];
        if (config?.selector) {
          const targetEl = iframeDoc.querySelector(config.selector);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
            targetEl.classList.add("endoora-live-highlight-target");
            setTimeout(() => {
              targetEl.classList.remove("endoora-live-highlight-target");
            }, 3000);
          }
        }
      }
    } catch {
      // Cross-origin fallback (ignore silently)
    }
  }, [highlightTarget, viewMode]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressBarInput.trim();
    if (!url.startsWith("/")) {
      url = "/" + url;
    }
    setCurrentPath(url);
    setIsLoadingIframe(true);
  };

  const handleReload = () => {
    setIsLoadingIframe(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentPath;
    }
  };

  const handleBack = () => {
    try {
      iframeRef.current?.contentWindow?.history.back();
    } catch {
      // fallback
    }
  };

  const handleForward = () => {
    try {
      iframeRef.current?.contentWindow?.history.forward();
    } catch {
      // fallback
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.collapsedFloatingBtn}
        onClick={onToggleOpen}
        title="باز کردن پیش‌نمایش زنده و واقعی سایت (Split Screen)"
      >
        <span>👁️ پیش‌نمایش زنده سایت</span>
      </button>
    );
  }

  const activeTargetInfo = highlightTarget ? TARGET_DESCRIPTIONS[highlightTarget] : null;

  return (
    <div
      className={`${styles.previewPane} ${isExpanded ? styles.previewExpanded : ""}`}
      dir="rtl"
    >
      {/* 1. Real Browser Header Toolbar */}
      <div className={styles.browserHeader}>
        {/* Navigation Buttons: Back, Forward, Reload */}
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleBack}
            title="صفحه قبل (Back)"
          >
            ←
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleForward}
            title="صفحه بعد (Forward)"
          >
            →
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleReload}
            title="بارگذاری مجدد (Reload)"
          >
            🔄
          </button>
        </div>

        {/* Real Address Bar */}
        <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
          <span className={styles.secureBadge}>🟢 زنده</span>
          <span className={styles.domainPrefix}>endoora.ir</span>
          <input
            type="text"
            dir="ltr"
            className={styles.addressInput}
            value={addressBarInput}
            onChange={(e) => setAddressBarInput(e.target.value)}
            placeholder="/"
          />
          <a
            href={currentPath}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnExternal}
            title="باز کردن این صفحه واقعی در تب جدید مرورگر"
          >
            ↗
          </a>
        </form>

        {/* View Switchers: Desktop/Mobile + Diagram/Live */}
        <div className={styles.headerTools}>
          {isTechnicalZone && (
            <div className={styles.modeToggleGroup}>
              <button
                type="button"
                className={`${styles.modeBtn} ${viewMode === "iframe" ? styles.modeBtnActive : ""}`}
                onClick={() => setViewMode("iframe")}
                title="مشاهده سایت عمومی"
              >
                🌐 سایت
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${viewMode === "diagram" ? styles.modeBtnActive : ""}`}
                onClick={() => setViewMode("diagram")}
                title="مشاهده نقشه کارتونی پشت‌صحنه"
              >
                🏗️ نقشه فنی
              </button>
            </div>
          )}

          <div className={styles.deviceSwitcher}>
            <button
              type="button"
              className={`${styles.deviceBtn} ${deviceMode === "desktop" ? styles.deviceBtnActive : ""}`}
              onClick={() => setDeviceMode("desktop")}
              title="نمای دسکتاپ (عرض متوازن)"
            >
              💻
            </button>
            <button
              type="button"
              className={`${styles.deviceBtn} ${deviceMode === "mobile" ? styles.deviceBtnActive : ""}`}
              onClick={() => setDeviceMode("mobile")}
              title="نمای قاب گوشی (موبایل)"
            >
              📱
            </button>
          </div>

          <button
            type="button"
            className={styles.btnTool}
            onClick={onToggleExpand}
            title={isExpanded ? "حجم استاندارد ۵۰-۵۰" : "تمام‌صفحه کردن پیش‌نمایش"}
          >
            {isExpanded ? "🗗" : "⛶"}
          </button>

          <button
            type="button"
            className={styles.btnClose}
            onClick={onToggleOpen}
            title="بستن موقت پیش‌نمایش"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Interactive Location Guidance Banner */}
      {activeTargetInfo && (
        <div className={styles.highlightBanner}>
          <div className={styles.highlightBannerLeft}>
            <span className={styles.pulseDot} />
            <strong>مکان در سایت واقعی:</strong>
            <span className={styles.highlightTitle}>{activeTargetInfo.title}</span>
            <span className={styles.highlightLocation}>({activeTargetInfo.location})</span>
          </div>
          <button
            type="button"
            className={styles.btnGoToSection}
            onClick={() => {
              if (currentPath !== activeTargetInfo.defaultPath) {
                setCurrentPath(activeTargetInfo.defaultPath);
                setAddressBarInput(activeTargetInfo.defaultPath);
              }
            }}
          >
            رفتن به صفحه این بخش ←
          </button>
        </div>
      )}

      {/* 3. Main Live Frame Container */}
      <div className={styles.frameWrapper}>
        {viewMode === "diagram" ? (
          /* Cartoon Engine Architecture Diagram */
          <div className={styles.architectureDiagram}>
            <div className={styles.diagHeader}>
              <span className={styles.diagIcon}>🏗️</span>
              <div>
                <h4 className={styles.diagTitle}>نقشه کارتونی و ساده پشت‌صحنه سایت ایندورا</h4>
                <p className={styles.diagSubtitle}>
                  این بخش صفحه عمومی در سایت ندارد؛ در تصویر زیر ببینید اطلاعات چطور حرکت می‌کنند:
                </p>
              </div>
            </div>

            <div className={styles.nodesFlow}>
              <div
                className={`${styles.diagNode} ${
                  highlightTarget === "users" ? styles.diagNodeActive : ""
                }`}
              >
                <div className={styles.nodeIcon}>👥</div>
                <div className={styles.nodeName}>کاربران و دانش‌آموزان</div>
                <div className={styles.nodeDesc}>ارسال درخواست باز کردن صفحه یا شرکت در آزمون</div>
              </div>

              <div className={styles.flowArrow}>⬇️</div>

              <div
                className={`${styles.diagNode} ${styles.securityNode} ${
                  highlightTarget === "security" || activeTab === "security"
                    ? styles.diagNodeActive
                    : ""
                }`}
              >
                <div className={styles.nodeIcon}>🛡️</div>
                <div className={styles.nodeName}>اتاق امنیت و دیوار آتش (Firewall)</div>
                <div className={styles.nodeDesc}>بررسی حملات، مسدودسازی روبات‌های خرابکار و فیلتر آی‌پی</div>
              </div>

              <div className={styles.flowArrow}>⬇️</div>

              <div
                className={`${styles.diagNode} ${styles.serverNode} ${
                  highlightTarget === "system-ops" || activeTab === "system-ops"
                    ? styles.diagNodeActive
                    : ""
                }`}
              >
                <div className={styles.nodeIcon}>⚙️</div>
                <div className={styles.nodeName}>موتورخانه سرور (Server & Next.js)</div>
                <div className={styles.nodeDesc}>اجرای کدهای سایت، کنترل وضعیت آنلاین و حالت تعمیرات</div>
              </div>

              <div className={styles.flowArrow}>⬇️</div>

              <div
                className={`${styles.diagNode} ${styles.dbNode} ${
                  highlightTarget === "database" || highlightTarget === "cache"
                    ? styles.diagNodeActive
                    : ""
                }`}
              >
                <div className={styles.nodeIcon}>🗄️</div>
                <div className={styles.nodeName}>پایگاه داده و حافظه موقت (Database & Cache)</div>
                <div className={styles.nodeDesc}>ذخیره نمرات، اطلاعات کاربران، تراکنش‌ها و بک‌آپ‌ها</div>
              </div>

              <div className={styles.flowArrow}>⬇️</div>

              <div
                className={`${styles.diagNode} ${styles.aiNode} ${
                  highlightTarget === "ai-engine" || activeTab === "ai-engine"
                    ? styles.diagNodeActive
                    : ""
                }`}
              >
                <div className={styles.nodeIcon}>🧠</div>
                <div className={styles.nodeName}>مغز هوش مصنوعی (AI & Gemini LLM)</div>
                <div className={styles.nodeDesc}>تحلیل صدای زبان‌آموزان و تصحیح هوشمند آزمون‌های آیلتس</div>
              </div>
            </div>

            <div className={styles.diagFooterNote}>
              💡 نگران نباشید: تمام اتصالات بالا به صورت خودکار برقرار هستند و نیازی به تغییر دستی ندارند.
            </div>
          </div>
        ) : (
          /* TRUE LIVE IFRAME */
          <div
            className={`${styles.iframeContainer} ${
              deviceMode === "mobile" ? styles.mobilePhoneMockup : styles.desktopIframeWrapper
            }`}
          >
            {deviceMode === "mobile" && (
              <div className={styles.phoneSpeakerNotch}>
                <div className={styles.cameraDot} />
                <div className={styles.speakerPill} />
              </div>
            )}

            {isLoadingIframe && (
              <div className={styles.iframeLoadingOverlay}>
                <div className={styles.spinner} />
                <span>در حال بارگذاری صفحه واقعی سایت...</span>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={currentPath}
              className={styles.realSiteIframe}
              title="صفحه واقعی و زنده وب‌سایت ایندورا"
              onLoad={() => setIsLoadingIframe(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
