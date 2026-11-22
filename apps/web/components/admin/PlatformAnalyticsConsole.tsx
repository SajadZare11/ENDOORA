"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./platform-analytics.module.css";
import {
  type AnalyticsTimeframe,
  type FunnelStageData,
  type AcquisitionChannelMetric,
  type AbandonedCartItem,
  type CohortMonthData,
  type AtRiskLearner,
  type CourseUnitEconomic,
  type PlatformAnalyticsStats,
  TIMEFRAME_LABELS,
  COURSE_HEALTH_LABELS,
} from "@/lib/platform-analytics-content";

export function PlatformAnalyticsConsole() {
  const [activeTimeframe, setActiveTimeframe] = useState<AnalyticsTimeframe>("30d");
  const [activeTab, setActiveTab] = useState<"funnel" | "cohorts" | "economics">("funnel");
  const [funnelStages, setFunnelStages] = useState<FunnelStageData[]>([]);
  const [channels, setChannels] = useState<AcquisitionChannelMetric[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCartItem[]>([]);
  const [cohorts, setCohorts] = useState<CohortMonthData[]>([]);
  const [atRiskLearners, setAtRiskLearners] = useState<AtRiskLearner[]>([]);
  const [courseEconomics, setCourseEconomics] = useState<CourseUnitEconomic[]>([]);
  const [stats, setStats] = useState<PlatformAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async (tf: AnalyticsTimeframe) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?timeframe=${tf}`);
      const json = await res.json();
      if (json.success) {
        setFunnelStages(json.data.funnelStages);
        setChannels(json.data.acquisitionChannels);
        setAbandonedCarts(json.data.abandonedCarts);
        setCohorts(json.data.cohorts);
        setAtRiskLearners(json.data.atRiskLearners);
        setCourseEconomics(json.data.courseEconomics);
        setStats(json.stats);
      } else {
        showToast(json.error || "خطا در واکشی داده‌های تحلیلی", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTimeframe);
  }, [activeTimeframe, loadData]);

  const handleTimeframeChange = (tf: AnalyticsTimeframe) => {
    setActiveTimeframe(tf);
  };

  const handleSendRecoveryCoupon = async (cartId: string, userName: string) => {
    if (!confirm(`آیا مایلید کوپن تخفیف ۲۵٪ اختصاصی بازگشت برای ${userName} پیامک شود؟`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_recovery_coupon", cartId, discountPercent: 25 }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData(activeTimeframe);
      } else {
        showToast(data.error || "خطا در ارسال کوپن نجات", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ارسال کوپن", "error");
    }
  };

  const handleSendMotivationNudge = async (userId: string, userName: string) => {
    if (!confirm(`آیا مایلید تلنگر انگیزشی و یادآوری تمرین برای ${userName} ارسال شود؟`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_motivation_nudge", userId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData(activeTimeframe);
      } else {
        showToast(data.error || "خطا در ارسال تلنگر", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ارتباط با سرور", "error");
    }
  };

  const handleExportCsv = () => {
    try {
      let csv = "Stage,Visitors,DropoffPercent,ConversionRateFromStart\n";
      funnelStages.forEach((s) => {
        csv += `"${s.stageLabel}",${s.visitorCount},${s.dropoffPercentage}%,${s.conversionRateFromStart}%\n`;
      });
      csv += "\nChannel,Visitors,CheckoutStarts,PaidCustomers,RevenueToman,ConversionRate\n";
      channels.forEach((c) => {
        csv += `"${c.channelLabel}",${c.visitors},${c.checkoutStarts},${c.paidCustomers},${c.revenueToman},${c.conversionRate}%\n`;
      });
      csv += "\nCourse,Teacher,Enrolled,GrossRevenueToman,PlatformCommissionToman,CompletionRate,RefundRate\n";
      courseEconomics.forEach((c) => {
        csv += `"${c.courseTitle}","${c.teacherName}",${c.totalEnrolled},${c.grossRevenueToman},${c.platformNetCommissionToman},${c.completionRate}%,${c.refundRate}%\n`;
      });

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `endoora-analytics-report-${activeTimeframe}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("فایل خروجی اکسل/CSV با موفقیت ذخیره گردید.", "success");
    } catch (err: unknown) {
      showToast("خطا در ایجاد فایل گزارش CSV", "error");
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("آیا مایلید تمام داده‌های تحلیلی، سبدهای رهاشده و کوهورت‌ها به حالت اولیه بازنشانی شوند؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData(activeTimeframe);
      } else {
        showToast(data.error || "خطا در بازنشانی داده‌ها", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ارتباط با سرور", "error");
    }
  };

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
            <span>📊</span>
            سامانه هوش تجاری و تحلیل پیشرفته قیف تبدیل (Platform Analytics & BI)
          </h2>
          <p className={styles.headerDesc}>
            تحلیل عمیق رفتار یادگیری زبان‌آموزان، ردگیری ریزش در مراحل خرید، ماتریس ماندگاری کوهورت و بهینه‌سازی اقتصاد دوره‌ها.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی دیتای اولیه">
            <span>🔄</span>
            بازنشانی دیتای اولیه
          </button>
          <button className={styles.btnExportCsv} onClick={handleExportCsv} title="استخراج گزارش اکسل">
            <span>📥</span>
            خروجی CSV / اکسل
          </button>
          <button className={styles.btnRefresh} onClick={() => loadData(activeTimeframe)}>
            <span>⚡</span>
            به‌روزرسانی
          </button>
        </div>
      </div>

      {/* Timeframe Controls Bar */}
      <div className={styles.timeframeBar}>
        <div className={styles.timeframeTitle}>
          <span>⏱️</span>
          <span>بازه زمانی تحلیل داده‌ها:</span>
          <span style={{ color: "#38bdf8", marginRight: "6px" }}>{TIMEFRAME_LABELS[activeTimeframe]}</span>
        </div>

        <div className={styles.timeframeBtnGroup}>
          {(["7d", "30d", "90d", "1y"] as AnalyticsTimeframe[]).map((tf) => (
            <button
              key={tf}
              className={`${styles.timeframeBtn} ${activeTimeframe === tf ? styles.timeframeBtnActive : ""}`}
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf === "7d" && "۷ روز"}
              {tf === "30d" && "۳۰ روز"}
              {tf === "90d" && "۳ ماه"}
              {tf === "1y" && "یک سال"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
            🎯
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>نرخ تبدیل کلی قیف (Funnel Conv.)</p>
            <p className={styles.statValue}>{stats?.overallConversionRate ?? "..."}٪</p>
            <p className={styles.statSubtext}>{stats?.totalPaidOrders?.toLocaleString("fa-IR")} خرید موفق</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            🧲
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>شاخص چسبندگی پلتفرم (DAU/MAU)</p>
            <p className={styles.statValue}>{stats?.dauToMauRatio ?? "..."}٪</p>
            <p className={styles.statSubtext}>سطح بسیار مطلوب در ادتک</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            🛒
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>ارزش سبدهای رهاشده</p>
            <p className={styles.statValue}>{(stats?.abandonedCartValueToman || 0).toLocaleString("fa-IR")}</p>
            <p className={styles.statSubtext}>تومان (پتانسیل بازیابی)</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            ⏱️
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>میانگین مطالعه روزانه</p>
            <p className={styles.statValue}>{stats?.avgDailyLearningMinutes ?? "..."} دقیقه</p>
            <p className={styles.statSubtext}>در هر سشن فعال زبان‌آموز</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>
            💰
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>کل فروش ناخالص دوره‌ها</p>
            <p className={styles.statValue} style={{ fontSize: "1.15rem" }}>
              {((stats?.grossPlatformRevenueToman || 0) / 1000000).toLocaleString("fa-IR")} م
            </p>
            <p className={styles.statSubtext}>تومان در دوره انتخابی</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "funnel" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("funnel")}
        >
          <span>📉</span>
          قیف تبدیل و نجات سبدهای رهاشده
          <span className={styles.tabBadge}>{abandonedCarts.length} سبد باز</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "cohorts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("cohorts")}
        >
          <span>🧬</span>
          ماتریس کوهورت و پایش ریزش
          <span className={styles.tabBadge}>{atRiskLearners.length} در معرض خطر</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "economics" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("economics")}
        >
          <span>💎</span>
          تحلیل اقتصادی دوره‌ها و اساتید
          <span className={styles.tabBadge}>{courseEconomics.length} دوره</span>
        </button>
      </div>

      {/* TAB 1: FUNNEL & CART RECOVERY */}
      {activeTab === "funnel" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Visual Funnel Cards */}
          <div className={styles.funnelGrid}>
            {funnelStages.map((stage, idx) => (
              <div key={stage.stageKey} className={styles.funnelCard}>
                <div className={styles.funnelCardHeader}>
                  <span className={styles.funnelStageTitle}>{stage.stageLabel}</span>
                  {idx > 0 && (
                    <span className={styles.dropoffBadge}>
                      {stage.dropoffPercentage}٪ افت مرحله
                    </span>
                  )}
                </div>

                <div className={styles.funnelCount}>
                  {stage.visitorCount.toLocaleString("fa-IR")}
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginRight: "6px" }}>نفر</span>
                </div>

                <div className={styles.funnelProgressBar}>
                  <div
                    className={styles.funnelProgressFill}
                    style={{ width: `${Math.max(5, stage.conversionRateFromStart)}%` }}
                  />
                </div>

                <div className={styles.funnelMetaRow}>
                  <span>نرخ نسبت به ورودی کل: {stage.conversionRateFromStart}٪</span>
                  <span>میانگین زمان: {stage.avgTimeSpentSeconds} ثانیه</span>
                </div>
              </div>
            ))}
          </div>

          {/* Acquisition Channels Breakdown Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <div>
                <h3 className={styles.tableCardTitle}>
                  <span>🌐</span>
                  عملکرد و نرخ تبدیل کانال‌های ورودی کاربران (Acquisition Channels)
                </h3>
                <p className={styles.tableCardDesc}>
                  ارزیابی بازدهی ترافیک ارگانیک، شبکه‌های اجتماعی، ترافیک مستقیم و شبکه‌های همکار در فروش
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کانال بازاریابی و جذب</th>
                    <th>تعداد کل ورودی‌ها</th>
                    <th>شروع تسویه‌حساب</th>
                    <th>خریداران قطعی</th>
                    <th>نرخ تبدیل نهایی</th>
                    <th>درآمد محقق‌شده</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((c) => (
                    <tr key={c.channelKey}>
                      <td style={{ fontWeight: 700, color: "#f8fafc" }}>{c.channelLabel}</td>
                      <td>{c.visitors.toLocaleString("fa-IR")}</td>
                      <td>{c.checkoutStarts.toLocaleString("fa-IR")}</td>
                      <td style={{ color: "#34d399", fontWeight: 700 }}>
                        {c.paidCustomers.toLocaleString("fa-IR")}
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: "#38bdf8" }}>{c.conversionRate}٪</span>
                      </td>
                      <td style={{ fontWeight: 700, color: "#f3f4f6" }}>
                        {c.revenueToman.toLocaleString("fa-IR")} تومان
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Abandoned Carts Table with 1-Click Win-back */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <div>
                <h3 className={styles.tableCardTitle}>
                  <span>🛒</span>
                  کارتابل سبدهای خرید رهاشده و عملیات نجات مخاطبان (Abandoned Carts Recovery)
                </h3>
                <p className={styles.tableCardDesc}>
                  ارسال بلادرنگ کد تخفیف اختصاصی ۲۵٪ برای کاربرانی که در مرحله تسویه‌حساب متوقف شده‌اند
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>نام کاربر و شماره تماس</th>
                    <th>دوره مورد نظر</th>
                    <th>مبلغ سبد خرید</th>
                    <th>زمان رهاسازی</th>
                    <th>وضعیت بازگشت</th>
                    <th>عملیات بازیابی</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyState}>
                        {loading ? "در حال دریافت سبدها..." : "هیچ سبد خریدی در این وضعیت نیست."}
                      </td>
                    </tr>
                  ) : (
                    abandonedCarts.map((cart) => (
                      <tr key={cart.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            <span style={{ fontWeight: 700, color: "#f8fafc" }}>{cart.userName}</span>
                            <span style={{ fontSize: "0.775rem", color: "#9ca3af", direction: "ltr", textAlign: "right" }}>
                              {cart.userPhone}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{cart.courseTitle}</span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#f59e0b" }}>
                            {cart.cartValueToman.toLocaleString("fa-IR")} تومان
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                            {cart.hoursAgo} ساعت پیش
                          </span>
                        </td>

                        <td>
                          {cart.recoveryStatus === "coupon_sent" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                              <span className={`${styles.badge} ${styles.healthWarning}`}>
                                کوپن نجات ارسال شد
                              </span>
                              <code style={{ fontSize: "0.725rem", color: "#fde047" }}>
                                {cart.discountCouponCode}
                              </code>
                            </div>
                          ) : cart.recoveryStatus === "recovered" ? (
                            <span className={`${styles.badge} ${styles.healthExcellent}`}>
                              خرید موفق و نجات‌یافته
                            </span>
                          ) : (
                            <span className={`${styles.badge} ${styles.healthCritical}`}>
                              در انتظار اقدام
                            </span>
                          )}
                        </td>

                        <td>
                          {cart.recoveryStatus === "uncontacted" ? (
                            <button
                              className={styles.btnActionWinback}
                              onClick={() => handleSendRecoveryCoupon(cart.id, cart.userName)}
                            >
                              🎁 ارسال کوپن نجات ۲۵٪
                            </button>
                          ) : (
                            <button className={styles.btnActionDisabled} disabled>
                              ✓ اقدام انجام شد
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

      {/* TAB 2: COHORTS & CHURN PREVENTION */}
      {activeTab === "cohorts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Cohort Heatmap Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <div>
                <h3 className={styles.tableCardTitle}>
                  <span>🧬</span>
                  ماتریس ماندگاری هم‌گروهی زبان‌آموزان (Monthly Learner Retention Cohort)
                </h3>
                <p className={styles.tableCardDesc}>
                  درصد استمرار و بازگشت زبان‌آموزان ورودی هر ماه در ۶ ماه متوالی پس از ثبت‌نام
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کوهورت ثبت‌نام</th>
                    <th>زبان‌آموزان جدید</th>
                    <th style={{ textAlign: "center" }}>ماه ۱ (M1)</th>
                    <th style={{ textAlign: "center" }}>ماه ۲ (M2)</th>
                    <th style={{ textAlign: "center" }}>ماه ۳ (M3)</th>
                    <th style={{ textAlign: "center" }}>ماه ۴ (M4)</th>
                    <th style={{ textAlign: "center" }}>ماه ۵ (M5)</th>
                    <th style={{ textAlign: "center" }}>ماه ۶ (M6)</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((c) => {
                    const renderCell = (val: number) => {
                      if (val === 0) return <span className={styles.cohortCellEmpty}>-</span>;
                      let cellClass = styles.cohortCellLow;
                      if (val >= 75) cellClass = styles.cohortCellHigh;
                      else if (val >= 55) cellClass = styles.cohortCellMed;
                      return <div className={`${styles.cohortCell} ${cellClass}`}>{val}٪</div>;
                    };

                    return (
                      <tr key={c.cohortMonth}>
                        <td style={{ fontWeight: 700, color: "#f8fafc" }}>{c.cohortMonth}</td>
                        <td style={{ fontWeight: 600 }}>{c.newLearnersCount.toLocaleString("fa-IR")} نفر</td>
                        <td>{renderCell(c.m1Retention)}</td>
                        <td>{renderCell(c.m2Retention)}</td>
                        <td>{renderCell(c.m3Retention)}</td>
                        <td>{renderCell(c.m4Retention)}</td>
                        <td>{renderCell(c.m5Retention)}</td>
                        <td>{renderCell(c.m6Retention)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* At-Risk Learners Table with 1-Click Motivation Nudge */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <div>
                <h3 className={styles.tableCardTitle}>
                  <span>⚠️</span>
                  پایش هوشمند زبان‌آموزان در معرض ریزش (At-Risk Churn Alert)
                </h3>
                <p className={styles.tableCardDesc}>
                  کاربرانی که بیش از ۷ روز هیچ درسی را مطالعه نکرده‌اند؛ ارسال تلنگر و تمرین شخصی‌سازی‌شده
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>زبان‌آموز</th>
                    <th>دوره ثبت‌نامی</th>
                    <th>روزهای عدم فعالیت</th>
                    <th>درصد پیشرفت دوره</th>
                    <th>آخرین درس دیده‌شده</th>
                    <th>امتیاز ریسک ریزش</th>
                    <th>اقدام پیشگیرانه</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskLearners.map((learner) => (
                    <tr key={learner.userId}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <span style={{ fontWeight: 700, color: "#f8fafc" }}>{learner.userName}</span>
                          <span style={{ fontSize: "0.775rem", color: "#9ca3af", direction: "ltr", textAlign: "right" }}>
                            {learner.userEmail}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{learner.courseTitle}</span>
                      </td>

                      <td>
                        <span style={{ color: "#ef4444", fontWeight: 800 }}>
                          {learner.daysInactive} روز عدم مطالعه
                        </span>
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700, color: "#38bdf8" }}>{learner.progressPercentage}٪</span>
                          <div style={{ width: "60px", height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${learner.progressPercentage}%`, height: "100%", background: "#38bdf8" }} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                          {learner.lastLessonCompleted}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            learner.churnRiskScore >= 85 ? styles.healthCritical : styles.healthWarning
                          }`}
                        >
                          ریسک {learner.churnRiskScore}٪
                        </span>
                      </td>

                      <td>
                        {!learner.nudgeSent ? (
                          <button
                            className={styles.btnActionNudge}
                            onClick={() => handleSendMotivationNudge(learner.userId, learner.userName)}
                          >
                            ⚡ ارسال تلنگر انگیزشی
                          </button>
                        ) : (
                          <button className={styles.btnActionDisabled} disabled>
                            ✓ تلنگر ارسال شد
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE UNIT ECONOMICS */}
      {activeTab === "economics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <div>
                <h3 className={styles.tableCardTitle}>
                  <span>💎</span>
                  جدول اقتصاد واحد، بازدهی مالی و سلامت آموزشی دوره‌ها (Unit Economics)
                </h3>
                <p className={styles.tableCardDesc}>
                  تحلیل فروش ناخالص، کارمزد پلتفرم، درصد اتمام دوره‌ها، نرخ بازپرداخت وجه و رضایت‌سنجی
                </p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>دوره و مدرس</th>
                    <th>دسته‌بندی</th>
                    <th>شهریه دوره</th>
                    <th>تعداد ثبت‌نام</th>
                    <th>فروش کل ناخالص</th>
                    <th>سود خالص پلتفرم</th>
                    <th>درصد اتمام دوره</th>
                    <th>نرخ استرداد</th>
                    <th>امتیاز رضایت</th>
                    <th>وضعیت اقتصادی</th>
                  </tr>
                </thead>
                <tbody>
                  {courseEconomics.map((course) => {
                    const healthMeta = COURSE_HEALTH_LABELS[course.healthStatus] || COURSE_HEALTH_LABELS.healthy;
                    return (
                      <tr key={course.courseId}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            <span style={{ fontWeight: 700, color: "#f8fafc" }}>{course.courseTitle}</span>
                            <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>{course.teacherName}</span>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{course.category}</span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600 }}>{course.priceToman.toLocaleString("fa-IR")} تومان</span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#38bdf8" }}>
                            {course.totalEnrolled.toLocaleString("fa-IR")} دانش‌آموز
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#f3f4f6" }}>
                            {(course.grossRevenueToman / 1000000).toLocaleString("fa-IR")} م ت
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#34d399" }}>
                            {(course.platformNetCommissionToman / 1000000).toLocaleString("fa-IR")} م ت
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: course.completionRate >= 60 ? "#34d399" : "#f59e0b" }}>
                            {course.completionRate}٪
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: course.refundRate > 5 ? "#ef4444" : "#9ca3af" }}>
                            {course.refundRate}٪
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: "#facc15" }}>
                            ★ {course.averageRating}
                          </span>
                        </td>

                        <td>
                          <span className={`${styles.badge} ${styles[healthMeta.badgeClass]}`}>
                            {healthMeta.fa}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
