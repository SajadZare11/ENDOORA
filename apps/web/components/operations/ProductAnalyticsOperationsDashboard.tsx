"use client";

import { Button, Table } from "@endoora/ui";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type AnalyticsEventRecord,
  type AnalyticsOverviewData,
  type FunnelDetail,
  type RetentionCohort,
  fetchAnalyticsEvents,
  fetchAnalyticsOverview,
  fetchFunnelDetail,
  fetchRetentionCohorts,
  MOCK_ANALYTICS_OVERVIEW,
  MOCK_FUNNEL_DETAILS,
  MOCK_RECENT_EVENTS,
  MOCK_RETENTION_COHORTS,
  trackProductEvent,
} from "../../lib/analytics-ops";
import styles from "./product-analytics.module.css";

export function ProductAnalyticsOperationsDashboard() {
  const [overview, setOverview] = useState<AnalyticsOverviewData>(MOCK_ANALYTICS_OVERVIEW);
  const [activeFunnelSlug, setActiveFunnelSlug] = useState<string>("onboarding-funnel");
  const [funnelDetail, setFunnelDetail] = useState<FunnelDetail>(
    MOCK_FUNNEL_DETAILS["onboarding-funnel"]
  );
  const [cohorts, setCohorts] = useState<RetentionCohort[]>(MOCK_RETENTION_COHORTS);
  const [events, setEvents] = useState<AnalyticsEventRecord[]>(MOCK_RECENT_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [timeWindowDays, setTimeWindowDays] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [drillSuccessMsg, setDrillSuccessMsg] = useState<string | null>(null);

  // Load initial dashboard telemetry
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [ovData, fnData, chData, evData] = await Promise.all([
          fetchAnalyticsOverview(timeWindowDays),
          fetchFunnelDetail(activeFunnelSlug, timeWindowDays),
          fetchRetentionCohorts(6),
          fetchAnalyticsEvents({ category: selectedCategory, limit: 10 }),
        ]);
        if (isMounted) {
          setOverview(ovData);
          setFunnelDetail(fnData);
          setCohorts(chData);
          setEvents(evData);
        }
      } catch (err) {
        console.error("Failed to load analytics dashboard data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeFunnelSlug, selectedCategory, timeWindowDays]);

  const handleFunnelChange = async (slug: string) => {
    setActiveFunnelSlug(slug);
    try {
      const detail = await fetchFunnelDetail(slug, timeWindowDays);
      setFunnelDetail(detail);
    } catch (err) {
      console.error(`Failed to fetch funnel ${slug}:`, err);
    }
  };

  const handleTriggerTestTelemetry = async () => {
    setDrillSuccessMsg("در حال ارسال سیگنال آزمایشی تلمتری محصول...");
    await trackProductEvent("route_view_ops_007", {
      source: "ops_console_drill",
      timestamp: new Date().toISOString(),
    });
    // Refresh event stream
    const freshEvents = await fetchAnalyticsEvents({ category: selectedCategory, limit: 10 });
    setEvents(freshEvents);
    setDrillSuccessMsg("سیگنال تلمتری با موفقیت در صف امن رویدادها ثبت شد.");
    setTimeout(() => setDrillSuccessMsg(null), 4000);
  };

  const getHeatmapClass = (val: number | null) => {
    if (val === null) return styles.heatPending;
    if (val >= 60) return `${styles.cellHeatmap} ${styles.heatHigh}`;
    if (val >= 35) return `${styles.cellHeatmap} ${styles.heatMed}`;
    return `${styles.cellHeatmap} ${styles.heatLow}`;
  };

  const getCategoryChipClass = (cat: string) => {
    switch (cat) {
      case "auth":
        return `${styles.categoryChip} ${styles.categoryChipAuth}`;
      case "learning":
        return `${styles.categoryChip} ${styles.categoryChipLearning}`;
      case "placement":
        return `${styles.categoryChip} ${styles.categoryChipPlacement}`;
      case "teacher":
        return `${styles.categoryChip} ${styles.categoryChipTeacher}`;
      case "commerce":
        return `${styles.categoryChip} ${styles.categoryChipCommerce}`;
      default:
        return `${styles.categoryChip} ${styles.categoryChipRoute}`;
    }
  };

  const kpis = overview.kpis;

  return (
    <div className={styles.container}>
      {/* 1. 14-Tab Synchronized Operations Ribbon */}
      <nav className={styles.ribbon} aria-label="ناوبری عملیات ایندورا">
        <Link href="/operations/taxonomy" className={styles.opsTab}>
          تاکسونومی (CONTENT-001)
        </Link>
        <Link href="/operations/questions" className={styles.opsTab}>
          بانک سوالات (CONTENT-002)
        </Link>
        <Link href="/operations/courses" className={styles.opsTab}>
          دوره‌ها (CONTENT-003)
        </Link>
        <Link href="/operations/content" className={styles.opsTab}>
          محتوا و فرهنگ (CONTENT-004)
        </Link>
        <Link href="/admin" className={styles.opsTab}>
          مدیریت عملیات (OPS-001)
        </Link>
        <Link href="/operations/flags" className={styles.opsTab}>
          پرچم‌های قابلیت (OPS-002)
        </Link>
        <Link href="/operations/audit" className={styles.opsTab}>
          ردپای ممیزی (OPS-003)
        </Link>
        <Link href="/operations/security" className={styles.opsTab}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (SEC-002)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (SEC-003)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
        <Link href="/operations/ai" className={styles.opsTab}>
          🤖 مدل‌ها و پرامپت‌ها (OPS-005)
        </Link>
        <Link href="/operations/monitoring" className={styles.opsTab}>
          📊 پایش و لاگ‌ها (OPS-006)
        </Link>
        <Link
          href="/operations/analytics"
          className={`${styles.opsTab} ${styles.opsTabActive}`}
        >
          📈 تحلیل محصول و فانل (OPS-007)
        </Link>
        <Link href="/operations/pwa" className={styles.opsTab}>
          📱 PWA و تاب‌آوری آفلاین (OPS-008)
        </Link>
        <Link href="/operations/incidents" className={styles.opsTab}>
          🚨 مدیریت بحران و ران‌بوک‌ها (OPS-009)
        </Link>
        <Link href="/operations/launch" className={styles.opsTab}>
          🚀 پروداکشن و لانچ نهایی (LAUNCH-001)
        </Link>
      </nav>

      {/* 2. Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.headerTitle}>
            <span>📈 تحلیل محصول، نرخ تبدیل و تلمتری رویدادها</span>
            <span className={styles.statusBadge}>
              <span className={styles.liveDot} />
              {isLoading ? "در حال به‌روزرسانی..." : "OPS-007 فعال"}
            </span>
          </h1>
          <p className={styles.headerSubtitle}>
            پایش رفتاری و قیف‌های تبدیل (Conversion Funnels)، نرخ نگه‌داشت کوهورت‌ها و شاخص‌های سلامت محصول با پایبندی به حریم خصوصی SEC-002
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.filterControls}>
            <select
              className={styles.selectInput}
              value={timeWindowDays}
              onChange={(e) => setTimeWindowDays(Number(e.target.value))}
              aria-label="بازه زمانی"
            >
              <option value={7}>۷ روز گذشته</option>
              <option value={14}>۱۴ روز گذشته</option>
              <option value={30}>۳۰ روز گذشته</option>
              <option value={90}>۹۰ روز گذشته</option>
            </select>

            <Button
              type="button"
              className={styles.btnAction}
              onClick={handleTriggerTestTelemetry}
            >
              🚀 آزمون ارسال تلمتری
            </Button>
          </div>
        </div>
      </header>

      {drillSuccessMsg && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: "var(--color-success-subtle)",
            color: "var(--color-success)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-xs)",
            border: "1px solid var(--color-success-border)",
          }}
        >
          {drillSuccessMsg}
        </div>
      )}

      {/* 3. Privacy Compliance Banner */}
      <div className={styles.privacyBanner}>
        <div className={styles.privacyBannerContent}>
          <div className={styles.privacyBannerTitle}>
            🔒 استاندارد حفاظت از داده‌ها و تلمتری بدون افشای محتوا (SEC-002 Verified)
          </div>
          <div className={styles.privacyBannerText}>
            تمامی رویدادها بر اساس تاکسونومی کران‌دار (Bounded Event Taxonomy) ثبت می‌شوند. هیچ متن نوشته، صدای ضبط‌شده یا چت زبان‌آموز در خصوصیات رویدادها ذخیره نمی‌شود. آدرس‌های IP با SHA-256 هش شده و عدم تمایل کاربر (Opt-out) به‌طور سیستمی لحاظ می‌گردد.
          </div>
        </div>
        <span className={styles.privacyBadge}>🛡️ بدون PII و محتوای خام</span>
      </div>

      {/* 4. Posture KPI Cards */}
      <section className={styles.kpiGrid} aria-label="شاخص‌های کلیدی محصول">
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>کاربران فعال روزانه (DAU)</span>
            <span className={styles.kpiTrendUp}>+۱۲.۴٪ ↑</span>
          </div>
          <div className={styles.kpiValue}>{kpis.dau.toLocaleString("fa-IR")}</div>
          <div className={styles.kpiFooter}>فعالیت در ۲۴ ساعت گذشته</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>کاربران فعال هفتگی (WAU)</span>
            <span className={styles.kpiTrendUp}>+۸.۷٪ ↑</span>
          </div>
          <div className={styles.kpiValue}>{kpis.wau.toLocaleString("fa-IR")}</div>
          <div className={styles.kpiFooter}>فعالیت در ۷ روز گذشته</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>کاربران فعال ماهانه (MAU)</span>
            <span className={styles.kpiTrendUp}>+۱۵.۲٪ ↑</span>
          </div>
          <div className={styles.kpiValue}>{kpis.mau.toLocaleString("fa-IR")}</div>
          <div className={styles.kpiFooter}>مبنای ۳۰ روز اخیر</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>چسبندگی محصول (Stickiness)</span>
            <span className={styles.kpiTrendUp}>DAU / MAU</span>
          </div>
          <div className={styles.kpiValue}>{kpis.stickiness_percent}%</div>
          <div className={styles.kpiFooter}>هدف سلامت آموزشی: بالای ۲۰٪</div>
        </div>
      </section>

      {/* 5. Interactive Funnel Analysis Visualizer */}
      <section className={styles.section} aria-label="تحلیل قیف‌های تبدیل">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              📊 تحلیل قیف‌های تبدیل کلیدی (Conversion Funnels)
            </h2>
            <span className={styles.sectionSubtitle}>
              ردیابی نقطه به نقطه گام‌های سفر کاربر و شناسایی گلوگاه‌های ریزش (Drop-off Rate)
            </span>
          </div>
        </div>

        {/* Funnel Selector Tabs */}
        <div className={styles.funnelSelector}>
          {overview.funnels_summary.map((fn) => (
            <Button
              key={fn.slug}
              type="button"
              className={`${styles.funnelTab} ${
                activeFunnelSlug === fn.slug ? styles.funnelTabActive : ""
              }`}
              onClick={() => handleFunnelChange(fn.slug)}
            >
              {fn.name_fa} ({fn.overall_conversion_rate}٪)
            </Button>
          ))}
        </div>

        {/* Funnel Summary Ribbon */}
        <div className={styles.funnelOverviewBar}>
          <div className={styles.funnelOverviewItem}>
            <span className={styles.funnelOverviewLbl}>عنوان فانل</span>
            <span className={styles.funnelOverviewVal}>{funnelDetail.funnel.name_fa}</span>
          </div>
          <div className={styles.funnelOverviewItem}>
            <span className={styles.funnelOverviewLbl}>تعداد کل گام‌ها</span>
            <span className={styles.funnelOverviewVal}>
              {funnelDetail.funnel.total_steps} گام
            </span>
          </div>
          <div className={styles.funnelOverviewItem}>
            <span className={styles.funnelOverviewLbl}>ورودی مرحله نخست</span>
            <span className={styles.funnelOverviewVal}>
              {funnelDetail.total_entries.toLocaleString("fa-IR")}
            </span>
          </div>
          <div className={styles.funnelOverviewItem}>
            <span className={styles.funnelOverviewLbl}>تکمیل‌کنندگان نهایی</span>
            <span className={styles.funnelOverviewVal}>
              {funnelDetail.total_completions.toLocaleString("fa-IR")}
            </span>
          </div>
          <div className={styles.funnelOverviewItem}>
            <span className={styles.funnelOverviewLbl}>نرخ تبدیل کلی</span>
            <span
              className={styles.funnelOverviewVal}
              style={{ color: "var(--color-primary)" }}
            >
              {funnelDetail.overall_conversion_rate}٪
            </span>
          </div>
        </div>

        {/* Step-by-Step Waterfall */}
        <div className={styles.funnelVisualizer}>
          {funnelDetail.steps.map((st) => (
            <div key={st.step_index} className={styles.funnelStepCard}>
              <div className={styles.funnelStepMeta}>
                <div className={styles.stepTitleGroup}>
                  <span className={styles.stepBadge}>{st.step_index}</span>
                  <div>
                    <span className={styles.stepNameFa}>{st.name_fa}</span>
                    <span
                      style={{
                        marginInlineStart: "var(--space-2)",
                        color: "var(--color-text-tertiary)",
                        fontSize: "11px",
                      }}
                    >
                      ({st.name_en})
                    </span>
                  </div>
                  <span className={styles.stepEventCode}>{st.event_name}</span>
                </div>

                <div className={styles.stepStatsGroup}>
                  <span>
                    کاربران:{" "}
                    <strong className={styles.stepActorsCount}>
                      {st.actors_count.toLocaleString("fa-IR")}
                    </strong>
                  </span>
                  <span className={styles.stepCRBadge}>
                    تبدیل مرحله: {st.step_conversion_rate}٪
                  </span>
                  <span>تراکمی: {st.cumulative_conversion_rate}٪</span>
                  {st.drop_off_count > 0 && (
                    <span className={styles.stepDropoffText}>
                      ریزش: {st.drop_off_count.toLocaleString("fa-IR")} ({st.drop_off_rate}٪)
                    </span>
                  )}
                  {st.median_time_seconds > 0 && (
                    <span style={{ color: "var(--color-text-tertiary)" }}>
                      میانگین گذار: {st.median_time_seconds} ثانیه
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.stepBarOuter}>
                <div
                  className={styles.stepBarInner}
                  style={{ width: `${Math.max(5, st.cumulative_conversion_rate)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Two Column Grid: Trends & Category Distribution */}
      <div className={styles.gridTwoCol}>
        {/* Trendline */}
        <section className={styles.section} aria-label="روند رویدادهای ۱۴ روز اخیر">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>📅 فعالیت و رویدادهای ۱۴ روز گذشته</h2>
              <span className={styles.sectionSubtitle}>حجم رویدادهای ثبت‌شده در مقایسه با کاربران فعال</span>
            </div>
          </div>

          <div className={styles.trendChart}>
            {overview.daily_trend.map((pt) => {
              const heightPercent = Math.min(
                100,
                Math.max(15, Math.round((pt.events_count / 4500) * 100))
              );
              return (
                <div key={pt.date} className={styles.trendCol}>
                  <div
                    className={styles.trendBar}
                    style={{ height: `${heightPercent}%` }}
                    title={`${pt.date_fa}: ${pt.events_count.toLocaleString("fa-IR")} رویداد (${pt.active_users.toLocaleString("fa-IR")} کاربر فعال)`}
                  />
                  <span className={styles.trendDate}>{pt.date_fa}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            <span>مجموع رویدادهای ۳۰ روز: {kpis.total_events_30d.toLocaleString("fa-IR")}</span>
            <span>میانگین رویداد روزانه به ازای کاربر: {kpis.avg_events_per_user}</span>
          </div>
        </section>

        {/* Category Distribution */}
        <section className={styles.section} aria-label="توزیع رویدادها بر حسب دسته‌بندی">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>🏷️ توزیع رویدادها بر اساس دسته‌بندی</h2>
              <span className={styles.sectionSubtitle}>سهم هر دامنه محصول از فعالیت کل</span>
            </div>
          </div>

          <div className={styles.categoryList}>
            {overview.category_breakdown.map((cat) => (
              <div key={cat.category} className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.label_fa}</span>
                  <span className={styles.categoryStats}>
                    {cat.events_count.toLocaleString("fa-IR")} رویداد ({cat.percentage}٪)
                  </span>
                </div>
                <div className={styles.categoryBarOuter}>
                  <div
                    className={styles.categoryBarInner}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. Retention Cohorts Heatmap Matrix */}
      <section className={styles.section} aria-label="ماتریس نرخ نگه‌داشت کوهورت‌ها">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>🔄 ماتریس نگه‌داشت کوهورت‌ها (Retention Cohorts)</h2>
            <span className={styles.sectionSubtitle}>
              درصد بازگشت و فعالیت کاربران در روزهای ۱، ۷، ۱۴ و ۳۰ پس از ثبت‌نام اولیه
            </span>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <Table className={styles.cohortTable}>
            <thead>
              <tr>
                <th>کوهورت هفتگی</th>
                <th>بازه زمانی</th>
                <th>کاربران جدید</th>
                <th style={{ textAlign: "center" }}>روز ۱ (D1)</th>
                <th style={{ textAlign: "center" }}>روز ۷ (D7)</th>
                <th style={{ textAlign: "center" }}>روز ۱۴ (D14)</th>
                <th style={{ textAlign: "center" }}>روز ۳۰ (D30)</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((ch) => (
                <tr key={ch.cohort_week}>
                  <td style={{ fontWeight: "var(--font-weight-semibold)" }}>
                    {ch.cohort_label_fa}
                    <span style={{ marginInlineStart: "var(--space-2)", color: "var(--color-text-tertiary)", fontSize: "10px" }}>
                      ({ch.cohort_week})
                    </span>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {ch.week_start} تا {ch.week_end}
                  </td>
                  <td>
                    <strong>{ch.new_users.toLocaleString("fa-IR")}</strong> نفر
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={getHeatmapClass(ch.retention_d1)}>
                      {ch.retention_d1 !== null ? `${ch.retention_d1}٪` : "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={getHeatmapClass(ch.retention_d7)}>
                      {ch.retention_d7 !== null ? `${ch.retention_d7}٪` : "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={getHeatmapClass(ch.retention_d14)}>
                      {ch.retention_d14 !== null ? `${ch.retention_d14}٪` : "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className={getHeatmapClass(ch.retention_d30)}>
                      {ch.retention_d30 !== null ? `${ch.retention_d30}٪` : "در جریان"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>

      {/* 8. Live Privacy-Aware Telemetry Stream */}
      <section className={styles.section} aria-label="جریان زنده رویدادهای تلمتری">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>📡 جریان زنده رویدادهای تلمتری (Privacy-Safe Event Stream)</h2>
            <span className={styles.sectionSubtitle}>
              ثبت بی‌درنگ رویدادهای کران‌دار با شناسه‌های ناشناس‌سازی‌شده
            </span>
          </div>

          <div className={styles.filterControls}>
            <select
              className={styles.selectInput}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="فیلتر دسته‌بندی رویداد"
            >
              <option value="">همه دسته‌ها</option>
              <option value="learning">یادگیری (learning)</option>
              <option value="placement">تعیین سطح (placement)</option>
              <option value="onboarding">آنبوردینگ (onboarding)</option>
              <option value="auth">ورود و هویت (auth)</option>
              <option value="teacher">تدریس (teacher)</option>
              <option value="commerce">تراکنش (commerce)</option>
              <option value="route">ناوبری (route)</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <Table className={styles.eventsTable}>
            <thead>
              <tr>
                <th>نام رویداد (Event Name)</th>
                <th>دسته‌بندی</th>
                <th>شناسه جلسه / کاربر</th>
                <th>هش امنیتی IP</th>
                <th>نوع دستگاه</th>
                <th>زمان ثبت</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className={styles.codeCell}>
                    <strong>{ev.event_name}</strong>
                  </td>
                  <td>
                    <span className={getCategoryChipClass(ev.category)}>
                      {ev.category}
                    </span>
                  </td>
                  <td className={styles.codeCell}>
                    {ev.user_id ? `usr_${ev.user_id.slice(0, 8)}` : `sess_${ev.session_id.slice(0, 8)}`}
                  </td>
                  <td className={styles.codeCell} style={{ color: "var(--color-text-tertiary)" }}>
                    {ev.client_ip_hash ? `sha256:${ev.client_ip_hash.slice(0, 10)}...` : "—"}
                  </td>
                  <td>{ev.user_agent_category}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{ev.created_at}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  );
}
