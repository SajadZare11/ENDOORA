"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import styles from "./marketplace-admin.module.css";
import {
  BookingDispute,
  TeacherOnboardingApplication,
  TeacherReview,
  PlatformPricingPlan,
  fetchAdminDisputes,
  resolveAdminDispute,
  fetchAdminTeacherApplications,
  reviewAdminTeacherApplication,
  toggleAdminTeacherEligibility,
  fetchAdminModerationReviews,
  moderateAdminReview,
  fetchAdminPricingPlans,
  updateAdminPricingPlan,
  formatTehranDateTime,
  TeacherPayoutRequest,
  fetchAdminPayoutRequests,
  processAdminPayoutRequest,
} from "@/lib/marketplace";

export default function MarketplaceAdminPage() {
  const [activeTab, setActiveTab] = useState<"disputes" | "onboarding" | "reviews" | "pricing" | "payouts">("disputes");

  // Payouts state (Day 42)
  const [payouts, setPayouts] = useState<TeacherPayoutRequest[]>([]);
  const [payoutFilter, setPayoutFilter] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState<TeacherPayoutRequest | null>(null);
  const [payoutAction, setPayoutAction] = useState<"approve" | "pay" | "reject">("approve");
  const [payoutAdminNotes, setPayoutAdminNotes] = useState("");
  const [payoutRejectionReason, setPayoutRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Disputes state
  const [disputes, setDisputes] = useState<BookingDispute[]>([]);
  const [disputeFilter, setDisputeFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState<BookingDispute | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState("resolved_full_refund");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [refundPercentage, setRefundPercentage] = useState(100);

  // Onboarding state
  const [applications, setApplications] = useState<TeacherOnboardingApplication[]>([]);
  const [onboardingFilter, setOnboardingFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<TeacherOnboardingApplication | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "request_revision">("approve");
  const [adminNotes, setAdminNotes] = useState("");
  const [reviewReason, setReviewReason] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [reviewFilter, setReviewFilter] = useState("all");

  // Pricing state
  const [plans, setPlans] = useState<PlatformPricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlatformPricingPlan | null>(null);
  const [editPriceToman, setEditPriceToman] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editNameFa, setEditNameFa] = useState("");
  const [editDurationDays, setEditDurationDays] = useState(90);

  const [isPending, startTransition] = useTransition();

  // Load data for active tab
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "disputes") {
        const res = await fetchAdminDisputes({ status: disputeFilter === "all" ? undefined : disputeFilter });
        setDisputes(res.disputes || []);
      } else if (activeTab === "onboarding") {
        const res = await fetchAdminTeacherApplications({ status: onboardingFilter === "all" ? undefined : onboardingFilter });
        setApplications(res.applications || []);
      } else if (activeTab === "reviews") {
        const res = await fetchAdminModerationReviews({ status: reviewFilter === "all" ? undefined : reviewFilter });
        setReviews(res.reviews || []);
      } else if (activeTab === "pricing") {
        const res = await fetchAdminPricingPlans();
        setPlans(res.plans || []);
      } else if (activeTab === "payouts") {
        const res = await fetchAdminPayoutRequests({ status: payoutFilter === "all" ? undefined : payoutFilter });
        setPayouts(res.payouts || []);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "خطا در بارگذاری داده‌های مدیریتی بازارگاه.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, disputeFilter, onboardingFilter, reviewFilter, payoutFilter]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (activeTab === "disputes") {
          const res = await fetchAdminDisputes({ status: disputeFilter === "all" ? undefined : disputeFilter });
          if (!cancelled) setDisputes(res.disputes || []);
        } else if (activeTab === "onboarding") {
          const res = await fetchAdminTeacherApplications({ status: onboardingFilter === "all" ? undefined : onboardingFilter });
          if (!cancelled) setApplications(res.applications || []);
        } else if (activeTab === "reviews") {
          const res = await fetchAdminModerationReviews({ status: reviewFilter === "all" ? undefined : reviewFilter });
          if (!cancelled) setReviews(res.reviews || []);
        } else if (activeTab === "pricing") {
          const res = await fetchAdminPricingPlans();
          if (!cancelled) setPlans(res.plans || []);
        } else if (activeTab === "payouts") {
          const res = await fetchAdminPayoutRequests({ status: payoutFilter === "all" ? undefined : payoutFilter });
          if (!cancelled) setPayouts(res.payouts || []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const e = err as { message?: string };
          setError(e?.message || "خطا در بارگذاری داده‌های مدیریتی بازارگاه.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [activeTab, disputeFilter, onboardingFilter, reviewFilter, payoutFilter]);

  // Handle Dispute Resolution
  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    if (!resolutionNotes.trim()) {
      alert("لطفاً دلایل و مستندات رأی داوری را وارد فرمایید.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await resolveAdminDispute(selectedDispute.id, {
          resolution_status: resolutionStatus,
          resolution_notes: resolutionNotes.trim(),
          refund_percentage: resolutionStatus === "resolved_full_refund" ? 100 : refundPercentage,
        });
        setSuccessMsg(res.message || "رأی داوری با موفقیت صادر و پرونده مختومه شد.");
        setSelectedDispute(null);
        setResolutionNotes("");
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در صدور رأی اختلاف.");
      }
    });
  };

  // Handle Teacher Review
  const handleReviewApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    startTransition(async () => {
      try {
        const res = await reviewAdminTeacherApplication(selectedApp.id, {
          action: reviewAction,
          admin_notes: adminNotes.trim(),
          reason: reviewReason.trim(),
        });
        setSuccessMsg(res.message || "وضعیت مدارک مدرس با موفقیت به‌روزرسانی شد.");
        setSelectedApp(null);
        setAdminNotes("");
        setReviewReason("");
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در بررسی پرونده مدرس.");
      }
    });
  };

  // Toggle teacher marketplace eligibility
  const handleToggleEligibility = (teacherId: string, currentEligible: boolean) => {
    startTransition(async () => {
      try {
        await toggleAdminTeacherEligibility(teacherId, !currentEligible, "تغییر دسترسی توسط مدیر سیستم");
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در تغییر دسترسی بازارگاه.");
      }
    });
  };

  // Handle Review Moderation
  const handleModerateReview = (reviewId: string, action: "approve" | "remove") => {
    const notes = action === "remove" ? prompt("دلیل حذف یا مغایرت بازخورد:") || "مغایرت با قوانین نظارتی" : "";
    startTransition(async () => {
      try {
        const res = await moderateAdminReview(reviewId, action, notes);
        setSuccessMsg(res.message || "عملیات نظارت بر بازخورد با موفقیت ثبت شد.");
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در نظارت بر بازخورد.");
      }
    });
  };

  // Handle Pricing Update
  const handleSavePricingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    startTransition(async () => {
      try {
        const res = await updateAdminPricingPlan(selectedPlan.id, {
          price_toman: Number(editPriceToman),
          is_active: editIsActive,
          is_featured: editIsFeatured,
          name_fa: editNameFa,
          duration_days: editDurationDays,
        });
        setSuccessMsg(res.message || "پلن قیمت‌گذاری پلتفرم با موفقیت به‌روزرسانی شد.");
        setSelectedPlan(null);
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در ویرایش پلن قیمت‌گذاری.");
      }
    });
  };


  const handleProcessPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    startTransition(async () => {
      try {
        const res = await processAdminPayoutRequest(selectedPayout.id, {
          action: payoutAction,
          admin_notes: payoutAdminNotes,
          rejection_reason: payoutRejectionReason,
        });
        setSuccessMsg(res.message || "درخواست تسویه با موفقیت پردازش گردید.");
        setSelectedPayout(null);
        setPayoutAdminNotes("");
        setPayoutRejectionReason("");
        loadData();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در پردازش درخواست تسویه.");
      }
    });
  };

  const getDisputeBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className={`${styles.statusBadge} ${styles.badgeOpen}`}>باز / جدید</span>;
      case "under_review":
        return <span className={`${styles.statusBadge} ${styles.badgeUnderReview}`}>در حال داوری</span>;
      case "resolved_full_refund":
        return <span className={`${styles.statusBadge} ${styles.badgeResolved}`}>تکمیل / عودت ۱۰۰٪</span>;
      case "resolved_partial_refund":
        return <span className={`${styles.statusBadge} ${styles.badgeResolved}`}>تکمیل / عودت درصدی</span>;
      case "resolved_pay_teacher":
        return <span className={`${styles.statusBadge} ${styles.badgeResolved}`}>تکمیل / پرداخت به استاد</span>;
      case "dismissed":
        return <span className={`${styles.statusBadge} ${styles.badgeDismissed}`}>رد شکایت</span>;
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>مرکز عملیات و داوری بازارگاه اساتید (Marketplace Operations)</h1>
            <p className={styles.subtitle}>
              مدیریت یکپارچه رسیدگی به اختلاف‌ها، تایید صلاحیت علمی و هویتی اساتید، پالایش بازخوردها و قیمت‌گذاری پایه پلتفرم
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>پرونده‌های داوری فعال</span>
            <span className={styles.statValue}>
              {disputes.filter((d) => d.status === "open" || d.status === "under_review").length}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>مدارک اساتید در صف تایید</span>
            <span className={styles.statValue}>
              {applications.filter((a) => a.status === "pending" || a.status === "in_review").length}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>بازخوردهای نیازمند نظارت</span>
            <span className={styles.statValue}>
              {reviews.filter((r) => r.status === "pending_moderation" || r.status === "flagged").length}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>پلن‌های فعال پلتفرم</span>
            <span className={styles.statValue}>{plans.filter((p) => p.is_active).length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => setActiveTab("disputes")}
          className={`${styles.tabBtn} ${activeTab === "disputes" ? styles.tabActive : ""}`}
        >
          ⚖️ داوری و حل اختلاف جلسات
          {disputes.filter((d) => d.status === "open").length > 0 && (
            <span className={styles.badgePill}>{disputes.filter((d) => d.status === "open").length}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("onboarding")}
          className={`${styles.tabBtn} ${activeTab === "onboarding" ? styles.tabActive : ""}`}
        >
          🎓 تایید صلاحیت و مدارک اساتید
          {applications.filter((a) => a.status === "pending").length > 0 && (
            <span className={styles.badgePill}>{applications.filter((a) => a.status === "pending").length}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`${styles.tabBtn} ${activeTab === "reviews" ? styles.tabActive : ""}`}
        >
          💬 نظارت بر بازخوردها و کامنت‌ها
          {reviews.filter((r) => r.status === "flagged" || r.status === "pending_moderation").length > 0 && (
            <span className={styles.badgePill}>
              {reviews.filter((r) => r.status === "flagged" || r.status === "pending_moderation").length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`${styles.tabBtn} ${activeTab === "pricing" ? styles.tabActive : ""}`}
        >
          💎 تنظیم پلن‌های اشتراک و قیمت
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payouts")}
          className={`${styles.tabBtn} ${activeTab === "payouts" ? styles.tabActive : ""}`}
        >
          💰 تسویه و حواله‌های بانکی مدرسان
          {payouts.filter((p) => p.status === "pending").length > 0 && (
            <span className={styles.badgePill}>{payouts.filter((p) => p.status === "pending").length}</span>
          )}
        </button>
      </div>

      {/* Error & Success Banners */}
      {error && (
        <div style={{ background: "var(--color-danger-subtle)", color: "var(--color-danger)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
          ✕ {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: "var(--color-success-subtle)", color: "var(--color-success)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* TAB 1: DISPUTES */}
      {activeTab === "disputes" && (
        <div className={styles.contentCard}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="dispute-filter-select" className={styles.modalLabel}>فیلتر وضعیت:</label>
              <select
                id="dispute-filter-select"
                value={disputeFilter}
                onChange={(e) => setDisputeFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">همه پرونده‌ها</option>
                <option value="open">فقط باز و بررسی‌نشده</option>
                <option value="under_review">در حال داوری</option>
                <option value="resolved_full_refund">مختومه (استرداد کامل)</option>
                <option value="resolved_partial_refund">مختومه (استرداد درصدی)</option>
                <option value="resolved_pay_teacher">مختومه (پرداخت به استاد)</option>
                <option value="dismissed">رد شکایت</option>
              </select>
            </div>
            <button type="button" onClick={loadData} className={styles.searchBtn}>
              به‌روزرسانی لیست 🔄
            </button>
          </div>

          {loading ? (
            <div className={styles.emptyState}>در حال بارگذاری پرونده‌های اختلاف...</div>
          ) : disputes.length === 0 ? (
            <div className={styles.emptyState}>هیچ پرونده اختلافی در این وضعیت یافت نشد. ✅</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کد رزرو</th>
                    <th>شاکی</th>
                    <th>دلیل اختلاف</th>
                    <th>تاریخ ثبت</th>
                    <th>وضعیت</th>
                    <th>درصد عودت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontFamily: "monospace" }}>{d.booking_id.slice(0, 8)}...</td>
                      <td>{d.opened_by_name}</td>
                      <td>{d.reason_display}</td>
                      <td>{formatTehranDateTime(d.created_at)}</td>
                      <td>{getDisputeBadge(d.status)}</td>
                      <td>{d.refund_percentage}%</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDispute(d);
                            setResolutionStatus(d.status === "open" ? "resolved_full_refund" : d.status);
                            setRefundPercentage(d.refund_percentage || 100);
                            setResolutionNotes(d.resolution_notes || "");
                          }}
                          className={styles.btnPrimary}
                        >
                          بررسی و صدور رأی ⚖️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHER ONBOARDING */}
      {activeTab === "onboarding" && (
        <div className={styles.contentCard}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="onboarding-filter-select" className={styles.modalLabel}>فیلتر مدارک:</label>
              <select
                id="onboarding-filter-select"
                value={onboardingFilter}
                onChange={(e) => setOnboardingFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">همه پرونده‌ها</option>
                <option value="pending">در انتظار بررسی اولیه</option>
                <option value="in_review">در حال ارزیابی کارشناسی</option>
                <option value="approved">تایید شده و فعال</option>
                <option value="revision_requested">نیازمند اصلاح مدارک</option>
                <option value="rejected">تایید نشده</option>
              </select>
            </div>
            <button type="button" onClick={loadData} className={styles.searchBtn}>
              به‌روزرسانی مدارک 🔄
            </button>
          </div>

          {loading ? (
            <div className={styles.emptyState}>در حال دریافت پرونده مدارک اساتید...</div>
          ) : applications.length === 0 ? (
            <div className={styles.emptyState}>هیچ درخواستی در این بخش وجود ندارد.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>نام و ایمیل مدرس</th>
                    <th>کد ملی</th>
                    <th>مدارک ارسالی</th>
                    <th>وضعیت</th>
                    <th>حضور در بازارگاه</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.teacher_name}</strong>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                          {app.teacher_email}
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace" }}>{app.national_id_number || "-"}</td>
                      <td>
                        {app.id_document_url && (
                          <a href={app.id_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                            کارت ملی
                          </a>
                        )}
                        {app.degree_document_url && (
                          <a href={app.degree_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                            دانشنامه
                          </a>
                        )}
                        {app.celta_tesol_document_url && (
                          <a href={app.celta_tesol_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                            مدرک بین‌المللی
                          </a>
                        )}
                        {app.sample_teaching_url && (
                          <a href={app.sample_teaching_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                            نمونه تدریس
                          </a>
                        )}
                      </td>
                      <td>
                        <span className={styles.statusBadge}>{app.status_display}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleEligibility(app.teacher_id, app.marketplace_eligible)}
                          className={app.marketplace_eligible ? styles.btnSuccess : styles.btnSecondary}
                          title="کلیک جهت تغییر وضعیت حضور در بازارگاه"
                        >
                          {app.marketplace_eligible ? "✓ فعال در بازارگاه" : "✕ مسدود"}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewAction(app.status === "approved" ? "approve" : "approve");
                            setAdminNotes(app.admin_notes || "");
                            setReviewReason(app.rejection_reason || "");
                          }}
                          className={styles.btnPrimary}
                        >
                          ارزیابی مدارک 📝
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVIEWS MODERATION */}
      {activeTab === "reviews" && (
        <div className={styles.contentCard}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="review-filter-select" className={styles.modalLabel}>وضعیت نظرات:</label>
              <select
                id="review-filter-select"
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">در انتظار و گزارش‌شده</option>
                <option value="pending_moderation">فقط در انتظار تایید</option>
                <option value="flagged">گزارش‌شده توسط کاربران</option>
                <option value="published">منتشر شده</option>
                <option value="removed">حذف‌شده توسط ناظر</option>
              </select>
            </div>
            <button type="button" onClick={loadData} className={styles.searchBtn}>
              به‌روزرسانی نظرات 🔄
            </button>
          </div>

          {loading ? (
            <div className={styles.emptyState}>در حال دریافت نظرات جهت نظارت...</div>
          ) : reviews.length === 0 ? (
            <div className={styles.emptyState}>هیچ بازخوردی نیازمند نظارت در صف وجود ندارد. 🌟</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>امتیاز</th>
                    <th>زبان‌آموز</th>
                    <th>مدرس</th>
                    <th>متن بازخورد</th>
                    <th>دلیل گزارش / اخطار</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id}>
                      <td>
                        <strong>{rev.overall_rating} ★</strong>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
                          تدریس: {rev.rating_teaching ?? rev.teaching_quality ?? 5} | نظم: {rev.rating_punctuality ?? rev.punctuality ?? 5}
                        </div>
                      </td>
                      <td>{rev.masked_display_name || rev.learner_display_name || "زبان‌آموز"}</td>
                      <td>{rev.teacher_name || rev.teacher_email || "استاد"}</td>
                      <td style={{ maxInlineSize: "280px" }}>{rev.comment}</td>
                      <td style={{ color: "var(--color-danger)", fontSize: "var(--font-size-xs)" }}>
                        {rev.flag_reason || "-"}
                      </td>
                      <td>
                        <span className={styles.statusBadge}>{rev.status}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "var(--space-1)" }}>
                          {rev.status !== "published" && (
                            <button
                              type="button"
                              onClick={() => handleModerateReview(rev.id, "approve")}
                              className={styles.btnSuccess}
                            >
                              تایید و انتشار
                            </button>
                          )}
                          {rev.status !== "removed" && (
                            <button
                              type="button"
                              onClick={() => handleModerateReview(rev.id, "remove")}
                              className={styles.btnDanger}
                            >
                              حذف / پالایش
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRICING PLANS */}
      {activeTab === "pricing" && (
        <div className={styles.contentCard}>
          <div className={styles.filterBar}>
            <div>
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, margin: 0 }}>
                تنظیمات منبع واحد قیمت و اشتراک‌های پلتفرم
              </h2>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
                پلن‌های نمایش داده‌شده در صفحه قیمت عمومی (/pricing) و درگاه پرداخت مستقیماً از این منبع داده خوانده می‌شوند.
              </p>
            </div>
            <button type="button" onClick={loadData} className={styles.searchBtn}>
              به‌روزرسانی پلن‌ها 🔄
            </button>
          </div>

          {loading ? (
            <div className={styles.emptyState}>در حال دریافت پلن‌های قیمت‌گذاری...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کد پلن</th>
                    <th>عنوان فارسی</th>
                    <th>مدت زمان</th>
                    <th>قیمت (تومان)</th>
                    <th>وضعیت فعال</th>
                    <th>پلن ویژه (Featured)</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "monospace" }}>{p.code}</td>
                      <td>{p.name_fa}</td>
                      <td>{p.duration_days} روز</td>
                      <td>
                        <strong>{Number(p.price_toman).toLocaleString("fa-IR")} تومان</strong>
                      </td>
                      <td>
                        <span className={p.is_active ? styles.btnSuccess : styles.btnSecondary}>
                          {p.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td>{p.is_featured ? "⭐ ویژه" : "عادی"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlan(p);
                            setEditPriceToman(String(p.price_toman_number || p.price_toman));
                            setEditIsActive(p.is_active);
                            setEditIsFeatured(p.is_featured);
                            setEditNameFa(p.name_fa);
                            setEditDurationDays(p.duration_days);
                          }}
                          className={styles.btnPrimary}
                        >
                          ویرایش نرخ ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: DISPUTE RESOLUTION */}
      {selectedDispute && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>صدور رأی داوری اختلاف جلسه</h2>
            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>پرونده مربوط به رزرو:</div>
              <div className={styles.modalValue}>{selectedDispute.booking_id}</div>
              <div className={styles.modalLabel}>شاکی:</div>
              <div className={styles.modalValue}>{selectedDispute.opened_by_name}</div>
              <div className={styles.modalLabel}>دلیل ثبت شکایت:</div>
              <div className={styles.modalValue}><strong>{selectedDispute.reason_display}</strong></div>
              <div className={styles.modalLabel}>شرح کامل زبان‌آموز / مدرس:</div>
              <div className={styles.modalValue}>{selectedDispute.description}</div>
              {selectedDispute.evidence_notes && (
                <>
                  <div className={styles.modalLabel}>مستندات و لینک‌های ضمیمه:</div>
                  <div className={styles.modalValue}>{selectedDispute.evidence_notes}</div>
                </>
              )}
            </div>

            <form onSubmit={handleResolveDispute} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div>
                <label htmlFor="dispute-judgment-select" className={styles.modalLabel}>حکم نهایی داوری:</label>
                <select
                  id="dispute-judgment-select"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%", marginBlockStart: "var(--space-1)" }}
                >
                  <option value="resolved_full_refund">استرداد ۱۰۰٪ وجه به زبان‌آموز (غیبت استاد یا نقص فنی اساسی)</option>
                  <option value="resolved_partial_refund">تسویه توافقی درصدی (بخشی استرداد، بخشی به استاد)</option>
                  <option value="resolved_pay_teacher">پرداخت ۱۰۰٪ به مدرس و رد ادعای شاکی (غیبت زبان‌آموز)</option>
                  <option value="dismissed">رد درخواست داوری بدون پرداخت</option>
                </select>
              </div>

              {resolutionStatus === "resolved_partial_refund" && (
                <div>
                  <label htmlFor="refund-percentage-range" className={styles.modalLabel}>درصد بازگشت وجه به زبان‌آموز ({refundPercentage}٪):</label>
                  <input
                    id="refund-percentage-range"
                    type="range"
                    min="1"
                    max="99"
                    value={refundPercentage}
                    onChange={(e) => setRefundPercentage(Number(e.target.value))}
                    style={{ inlineSize: "100%" }}
                  />
                </div>
              )}

              <div>
                <label htmlFor="resolution-notes-input" className={styles.modalLabel}>مستندات و متن رسمی ابلاغ رأی به طرفین (الزامی):</label>
                <textarea
                  id="resolution-notes-input"
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="دلایل کارشناسی، بررسی لاگ‌های ورود و خروج روم جلسه و نتیجه نهایی را شرح دهید..."
                  className={styles.textareaField}
                  style={{ inlineSize: "100%" }}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className={styles.btnSecondary}
                  disabled={isPending}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                  {isPending ? "در حال ثبت رأی..." : "ابلاغ رأی و بستن پرونده ⚖️"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEACHER ONBOARDING REVIEW */}
      {selectedApp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>بررسی مدارک هویتی و علمی مدرس</h2>
            <div className={styles.modalSection}>
              <div className={styles.modalLabel}>مدرس:</div>
              <div className={styles.modalValue}>{selectedApp.teacher_name} ({selectedApp.teacher_email})</div>
              <div className={styles.modalLabel}>کد ملی:</div>
              <div className={styles.modalValue}>{selectedApp.national_id_number || "ثبت نشده"}</div>
              <div className={styles.modalLabel}>مدارک ارسالی:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBlockStart: "var(--space-1)" }}>
                {selectedApp.id_document_url && (
                  <a href={selectedApp.id_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                    مشاهده تصویر کارت ملی ↗
                  </a>
                )}
                {selectedApp.degree_document_url && (
                  <a href={selectedApp.degree_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                    مشاهده دانشنامه ↗
                  </a>
                )}
                {selectedApp.celta_tesol_document_url && (
                  <a href={selectedApp.celta_tesol_document_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                    مشاهده مدرک CELTA/TESOL ↗
                  </a>
                )}
                {selectedApp.sample_teaching_url && (
                  <a href={selectedApp.sample_teaching_url} target="_blank" rel="noreferrer" className={styles.docLink}>
                    مشاهده ویدیوی نمونه تدریس ↗
                  </a>
                )}
              </div>
            </div>

            <form onSubmit={handleReviewApplication} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div>
                <label htmlFor="teacher-approval-action-select" className={styles.modalLabel}>نتیجه بررسی مدارک:</label>
                <select
                  id="teacher-approval-action-select"
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value as "approve" | "reject" | "request_revision")}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%", marginBlockStart: "var(--space-1)" }}
                >
                  <option value="approve">تایید نهایی مدارک و اعطای نشان مدرس تاییدشده (حضور در بازارگاه)</option>
                  <option value="request_revision">درخواست اصلاح مدارک (تصاویر ناخوانا یا نیاز به تکمیل)</option>
                  <option value="reject">رد درخواست احراز صلاحیت</option>
                </select>
              </div>

              {reviewAction !== "approve" && (
                <div>
                  <label htmlFor="review-reason-input" className={styles.modalLabel}>علت رد یا موارد اصلاحی (به مدرس نمایش داده می‌شود):</label>
                  <textarea
                    id="review-reason-input"
                    required
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    placeholder="توضیح دهید مدرس چه مواردی را باید اصلاح فرماید..."
                    className={styles.textareaField}
                    style={{ inlineSize: "100%" }}
                  />
                </div>
              )}

              <div>
                <label htmlFor="admin-internal-notes-input" className={styles.modalLabel}>یادداشت محرمانه ناظر (فقط برای ادمین‌ها):</label>
                <input
                  id="admin-internal-notes-input"
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="مثال: استعلام مدرک دانشگاه تهران انجام شد."
                  className={styles.selectInput}
                  style={{ inlineSize: "100%" }}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className={styles.btnSecondary}
                  disabled={isPending}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                  {isPending ? "در حال ثبت..." : "ثبت نتیجه ارزیابی ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRICING PLAN EDIT */}
      {selectedPlan && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>ویرایش پلن اشتراک پلتفرم ({selectedPlan.code})</h2>
            <form onSubmit={handleSavePricingPlan} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div>
                <label htmlFor="edit-plan-title-input" className={styles.modalLabel}>عنوان پلن:</label>
                <input
                  id="edit-plan-title-input"
                  type="text"
                  value={editNameFa}
                  onChange={(e) => setEditNameFa(e.target.value)}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%" }}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-plan-price-input" className={styles.modalLabel}>قیمت به تومان (منبع رسمی):</label>
                <input
                  id="edit-plan-price-input"
                  type="number"
                  value={editPriceToman}
                  onChange={(e) => setEditPriceToman(e.target.value)}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%" }}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-plan-duration-input" className={styles.modalLabel}>مدت اعتبار (روز):</label>
                <input
                  id="edit-plan-duration-input"
                  type="number"
                  value={editDurationDays}
                  onChange={(e) => setEditDurationDays(Number(e.target.value))}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--font-size-xs)" }}>
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                  />
                  پلن فعال است
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--font-size-xs)" }}>
                  <input
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={(e) => setEditIsFeatured(e.target.checked)}
                  />
                  نمایش به عنوان پلن برتر و پیشنهادی
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className={styles.btnSecondary}
                  disabled={isPending}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                  {isPending ? "در حال ذخیره..." : "ذخیره تنظیمات قیمت 💾"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 5: Payouts Queue (Day 42) */}
      {activeTab === "payouts" && (
        <div className={styles.contentSection}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="admin-payout-filter" className={styles.filterLabel}>فیلتر بر اساس وضعیت:</label>
              <select
                id="admin-payout-filter"
                value={payoutFilter}
                onChange={(e) => setPayoutFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">همه درخواست‌ها</option>
                <option value="pending">در انتظار بررسی</option>
                <option value="approved">تایید شده / نوبت پایا</option>
                <option value="paid">واریز شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>
            <button type="button" onClick={loadData} className={styles.btnSecondary}>
              بروزرسانی لیست ↻
            </button>
          </div>

          {loading ? (
            <div className={styles.emptyCard}><p>در حال بارگذاری درخواست‌های تسویه...</p></div>
          ) : payouts.length === 0 ? (
            <div className={styles.emptyCard}><p>هیچ درخواست تسویه‌ای با فیلتر انتخابی یافت نشد.</p></div>
          ) : (
            <div className={styles.tableCard}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>مدرس</th>
                    <th>مبلغ درخواستی</th>
                    <th>شماره شبا بانکی</th>
                    <th>نام دارنده / بانک</th>
                    <th>وضعیت</th>
                    <th>تاریخ ثبت</th>
                    <th>عملیات مالی</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 700 }}>{p.teacher_name}</span>
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", direction: "ltr", textAlign: "end" }}>
                            {p.teacher_email}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: "var(--color-primary)", direction: "ltr", textAlign: "end" }}>
                        {p.amount_toman.toLocaleString("fa-IR")} تومان
                      </td>
                      <td style={{ direction: "ltr", fontFamily: "monospace", fontSize: "var(--font-size-xs)" }}>
                        {p.bank_shaba_number}
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", fontSize: "var(--font-size-xs)" }}>
                          <span>{p.account_holder_name}</span>
                          <span style={{ color: "var(--color-text-muted)" }}>{p.bank_name || "-"}</span>
                        </div>
                      </td>
                      <td>
                        {p.status === "paid" ? (
                          <span className={`${styles.statusBadge} ${styles.badgeResolved}`}>واریز شد ✓</span>
                        ) : p.status === "approved" ? (
                          <span className={`${styles.statusBadge} ${styles.badgeUnderReview}`}>تایید شده</span>
                        ) : p.status === "rejected" ? (
                          <span className={`${styles.statusBadge} ${styles.badgeDismissed}`}>رد شده ✕</span>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles.badgeOpen}`}>در انتظار</span>
                        )}
                      </td>
                      <td style={{ fontSize: "var(--font-size-xs)" }}>{formatTehranDateTime(p.created_at)}</td>
                      <td>
                        {p.status !== "paid" && p.status !== "rejected" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayout(p);
                              setPayoutAction("pay");
                              setPayoutAdminNotes("");
                              setPayoutRejectionReason("");
                            }}
                            className={styles.btnPrimary}
                            style={{ paddingInline: "var(--space-3)", paddingBlock: "var(--space-1)", fontSize: "var(--font-size-xs)" }}
                          >
                            بررسی و تسویه 💳
                          </button>
                        ) : (
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>نهایی شده</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payout Processing Modal */}
      {selectedPayout && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>پردازش درخواست تسویه مالی</h3>
              <button
                type="button"
                onClick={() => setSelectedPayout(null)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessPayoutSubmit} className={styles.modalBody}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", background: "var(--color-surface-subtle)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", fontSize: "var(--font-size-xs)" }}>
                <div><strong>مدرس:</strong> {selectedPayout.teacher_name} ({selectedPayout.teacher_email})</div>
                <div><strong>مبلغ:</strong> {selectedPayout.amount_toman.toLocaleString("fa-IR")} تومان ({selectedPayout.amount_toman * 10} ریال)</div>
                <div><strong>شماره شبا:</strong> <span style={{ direction: "ltr", fontFamily: "monospace" }}>{selectedPayout.bank_shaba_number}</span></div>
                <div><strong>دارنده حساب:</strong> {selectedPayout.account_holder_name} (بانک {selectedPayout.bank_name || "نامشخص"})</div>
              </div>

              <div>
                <label htmlFor="payout-action-select" className={styles.modalLabel}>اقدام مالی:</label>
                <select
                  id="payout-action-select"
                  value={payoutAction}
                  onChange={(e) => setPayoutAction(e.target.value as "approve" | "pay" | "reject")}
                  className={styles.selectInput}
                  style={{ inlineSize: "100%" }}
                >
                  <option value="pay">واریز شد (ثبت شماره پیگیری پایا و اتمام تسویه)</option>
                  <option value="approve">تایید اولیه (قرار گرفتن در نوبت حواله روزانه)</option>
                  <option value="reject">رد درخواست (استرداد خودکار وجه به کیف پول مدرس)</option>
                </select>
              </div>

              {payoutAction === "reject" ? (
                <div>
                  <label htmlFor="payout-rejection-input" className={styles.modalLabel}>علت رد درخواست (به مدرس پیام داده می‌شود):</label>
                  <textarea
                    id="payout-rejection-input"
                    value={payoutRejectionReason}
                    onChange={(e) => setPayoutRejectionReason(e.target.value)}
                    placeholder="مثال: شماره شبا نامعتبر است یا نام صاحب حساب با هویت مدرس همخوانی ندارد."
                    className={styles.textareaInput}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="payout-notes-input" className={styles.modalLabel}>یادداشت مالی / شماره پیگیری حواله پایا:</label>
                  <input
                    id="payout-notes-input"
                    type="text"
                    value={payoutAdminNotes}
                    onChange={(e) => setPayoutAdminNotes(e.target.value)}
                    placeholder="مثال: شماره حواله پایا ۱۲۳۴۵۶۷۸۹"
                    className={styles.selectInput}
                    style={{ inlineSize: "100%" }}
                  />
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className={styles.btnSecondary}
                  disabled={isPending}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={payoutAction === "reject" ? styles.btnDanger : styles.btnPrimary}
                  disabled={isPending}
                >
                  {isPending ? "در حال پردازش..." : payoutAction === "reject" ? "رد و استرداد وجه به کیف پول ✕" : "تایید و ثبت اقدام مالی ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
