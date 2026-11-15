"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import styles from "./teacher-verification.module.css";
import {
  type TeacherApplicationRecord,
  type VerificationStats,
  type CommissionTier,
  type TeachingPermissions,
  type ReviewDecisionPayload,
  OFFICIAL_BADGE_CATALOG,
  INITIAL_TEACHER_APPLICATIONS,
} from "@/lib/teacher-verifications-content";

export function TeacherVerificationHub() {
  const [applications, setApplications] = useState<TeacherApplicationRecord[]>(INITIAL_TEACHER_APPLICATIONS);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modal State
  const [selectedApp, setSelectedApp] = useState<TeacherApplicationRecord | null>(null);
  const [activeModalStep, setActiveModalStep] = useState<1 | 2 | 3 | 4>(1);

  // Editable fields in modal
  const [modalAdminNotes, setModalAdminNotes] = useState<string>("");
  const [modalCommissionRate, setModalCommissionRate] = useState<number>(20);
  const [modalCommissionTier, setModalCommissionTier] = useState<CommissionTier>("standard_bronze");
  const [modalAssignedBadges, setModalAssignedBadges] = useState<string[]>([]);
  const [modalCustomBadges, setModalCustomBadges] = useState<string[]>([]);
  const [newCustomBadgeInput, setNewCustomBadgeInput] = useState<string>("");
  const [modalPermissions, setModalPermissions] = useState<TeachingPermissions>({
    privateVideo1on1: true,
    asyncReview: true,
    groupWebinars: false,
    courseCreation: false,
  });
  const [modalIsFeatured, setModalIsFeatured] = useState<boolean>(false);
  const [modalRejectionReason, setModalRejectionReason] = useState<string>("");
  const [modalRevisionChecklist, setModalRevisionChecklist] = useState<string[]>([]);
  const [modalRevisionInstructions, setModalRevisionInstructions] = useState<string>("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/teachers/verifications");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setApplications(json.applications);
          setStats(json.stats);
        }
      }
    } catch {
      // Fallback in-memory
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetSeed = async () => {
    if (!confirm("آیا از بازنشانی داده‌های متقاضیان به مقادیر اولیه کارخانه اطمینان دارید؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/teachers/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const json = await res.json();
      if (json.success) {
        setApplications(json.applications);
        setStats(json.stats);
        showToast("فهرست متقاضیان به حالت اولیه بازنشانی شد.");
      }
    } catch {
      showToast("خطا در بازنشانی داده‌ها", "error");
    }
  };

  const handleOpenDossier = (app: TeacherApplicationRecord, initialStep: 1 | 2 | 3 | 4 = 1) => {
    setSelectedApp(app);
    setActiveModalStep(initialStep);
    setModalAdminNotes(app.adminNotes || "");
    setModalCommissionRate(app.commissionRatePercent || 20);
    setModalCommissionTier(app.commissionTier || "standard_bronze");
    setModalAssignedBadges(app.assignedBadges || []);
    setModalCustomBadges(app.customBadges || []);
    setModalPermissions({
      privateVideo1on1: app.teachingPermissions?.privateVideo1on1 ?? true,
      asyncReview: app.teachingPermissions?.asyncReview ?? true,
      groupWebinars: app.teachingPermissions?.groupWebinars ?? false,
      courseCreation: app.teachingPermissions?.courseCreation ?? false,
    });
    setModalIsFeatured(app.isFeatured || false);
    setModalRejectionReason(app.rejectionReason || "");
    setModalRevisionChecklist(
      app.revisionChecklist && app.revisionChecklist.length > 0
        ? [...app.revisionChecklist]
        : ["تصویر واضح و باکیفیت از پشت و روی کارت ملی", "ارسال ویدیوی معرفی و تدریس نمونه حداقل ۳ دقیقه"]
    );
    setModalRevisionInstructions(app.revisionInstructions || "");
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  const handleTierSelect = (tier: CommissionTier) => {
    setModalCommissionTier(tier);
    if (tier === "vip_gold") setModalCommissionRate(10);
    else if (tier === "senior_silver") setModalCommissionRate(15);
    else if (tier === "standard_bronze") setModalCommissionRate(20);
  };

  const handleToggleBadge = (badgeKey: string) => {
    setModalAssignedBadges((prev) =>
      prev.includes(badgeKey) ? prev.filter((k) => k !== badgeKey) : [...prev, badgeKey]
    );
  };

  const handleAddCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newCustomBadgeInput.trim();
    if (!tag) return;
    if (!modalCustomBadges.includes(tag)) {
      setModalCustomBadges((prev) => [...prev, tag]);
    }
    setNewCustomBadgeInput("");
  };

  const handleRemoveCustomBadge = (tag: string) => {
    setModalCustomBadges((prev) => prev.filter((t) => t !== tag));
  };

  const handleToggleRevisionChecklistItem = (item: string) => {
    setModalRevisionChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmitDecision = async (
    decision: "approve" | "request_revision" | "reject" | "suspend" | "update_privileges"
  ) => {
    if (!selectedApp) return;

    if (decision === "reject" && !modalRejectionReason.trim()) {
      alert("لطفاً دلیل رد درخواست را برای ثبت در سوابق مشخص نمایید.");
      return;
    }

    if (decision === "request_revision" && modalRevisionChecklist.length === 0) {
      alert("حداقل یک مورد را در چک‌لیست اصلاح مدارک علامت بزنید.");
      return;
    }

    const payload: ReviewDecisionPayload = {
      decision,
      actor: "مدیر ارشد ایندورا",
      adminNotes: modalAdminNotes,
      commissionRatePercent: modalCommissionRate,
      commissionTier: modalCommissionTier,
      assignedBadges: modalAssignedBadges,
      customBadges: modalCustomBadges,
      teachingPermissions: modalPermissions,
      isFeatured: modalIsFeatured,
      rejectionReason: modalRejectionReason,
      revisionChecklist: modalRevisionChecklist,
      revisionInstructions: modalRevisionInstructions,
    };

    try {
      const res = await fetch("/api/admin/teachers/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_decision",
          applicationId: selectedApp.id,
          payload,
        }),
      });

      const json = await res.json();
      if (json.success && json.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === json.application.id ? json.application : a))
        );
        if (json.stats) setStats(json.stats);
        showToast(json.message);
        handleCloseModal();
      } else {
        showToast(json.error || "خطا در ثبت عملیات", "error");
      }
    } catch {
      showToast("خطا در برقراری ارتباط با سرور", "error");
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.nationalId.includes(q) ||
        app.city.toLowerCase().includes(q) ||
        app.degree.toLowerCase().includes(q) ||
        app.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || app.status === statusFilter;

      const matchesBadge =
        badgeFilter === "all" ||
        app.assignedBadges.includes(badgeFilter) ||
        app.customBadges.includes(badgeFilter);

      return matchesSearch && matchesStatus && matchesBadge;
    });
  }, [applications, searchQuery, statusFilter, badgeFilter]);

  const pendingCount = stats?.pendingCount ?? applications.filter((a) => a.status === "pending").length;
  const inReviewCount = stats?.inReviewCount ?? applications.filter((a) => a.status === "in_review").length;
  const revisionCount =
    stats?.revisionRequestedCount ?? applications.filter((a) => a.status === "revision_requested").length;
  const approvedCount = stats?.approvedCount ?? applications.filter((a) => a.status === "approved").length;
  const avgCommission = stats?.averageCommissionPercent ?? 18.5;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className={`${styles.statusBadge} ${styles.statusPending}`}>⏳ در انتظار بررسی</span>;
      case "in_review":
        return <span className={`${styles.statusBadge} ${styles.statusInReview}`}>🔍 در حال ارزیابی تخصصی</span>;
      case "approved":
        return <span className={`${styles.statusBadge} ${styles.statusApproved}`}>✅ تایید صلاحیت شده</span>;
      case "revision_requested":
        return <span className={`${styles.statusBadge} ${styles.statusRevision}`}>⚠️ نیازمند اصلاح مدارک</span>;
      case "rejected":
        return <span className={`${styles.statusBadge} ${styles.statusRejected}`}>❌ رد درخواست</span>;
      case "suspended":
        return <span className={`${styles.statusBadge} ${styles.statusSuspended}`}>⏸️ تعلیق موقت</span>;
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {toast.text}
        </div>
      )}

      {/* 1. Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🏅</span>
            <span>کارتابل تخصصی بررسی، اعتبارسنجی و احراز هویت اساتید</span>
          </h2>
          <p className={styles.headerDesc}>
            مرکز نظارت و مدیریت مدرسان: بازبینی گواهینامه‌های بین‌المللی (CELTA/DELTA)، ارزیابی نمونه تدریس،
            تعیین نرخ کارمزد اختصاصی پلتفرم و اعطای نشان‌های شایستگی
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی اطلاعات نمونه متقاضیان">
            <span>🔄 بازنشانی داده‌های نمونه</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>در انتظار بررسی اولیه</span>
            <span className={styles.kpiIcon}>⏳</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#d97706" }}>
            {pendingCount}
          </div>
          <div className={styles.kpiSub}>
            {pendingCount > 0 ? (
              <span className={styles.pulseBadge}>نیازمند اقدام مدیر</span>
            ) : (
              <span>صف بررسی خالی است</span>
            )}
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>در حال ارزیابی ویدیو و مدارک</span>
            <span className={styles.kpiIcon}>🔍</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#0284c7" }}>
            {inReviewCount}
          </div>
          <div className={styles.kpiSub}>در مرحله بررسی تکنیک تدریس</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>نیازمند بازنگری و اصلاح</span>
            <span className={styles.kpiIcon}>⚠️</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#ea580c" }}>
            {revisionCount}
          </div>
          <div className={styles.kpiSub}>منتظر ارسال مدارک تکمیلی استاد</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>اساتید تایید صلاحیت شده</span>
            <span className={styles.kpiIcon}>✅</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#16a34a" }}>
            {approvedCount}
          </div>
          <div className={styles.kpiSub}>فعال در دایرکتوری عمومی ایندورا</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>میانگین سهم کارمزد پلتفرم</span>
            <span className={styles.kpiIcon}>📊</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#4f46e5" }}>
            {avgCommission}٪
          </div>
          <div className={styles.kpiSub}>بر اساس رتبه‌بندی و نشان‌های کیفی</div>
        </div>
      </div>

      {/* 3. Toolbar & Filters */}
      <div className={styles.toolbarCard}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="جستجو بر اساس نام استاد، کد ملی، شماره تماس، ایمیل یا تخصص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            aria-label="فیلتر بر اساس نشان شایستگی"
          >
            <option value="all">همه نشان‌های شایستگی</option>
            {OFFICIAL_BADGE_CATALOG.map((b) => (
              <option key={b.key} value={b.key}>
                {b.icon} {b.titleFa}
              </option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className={styles.statusTabsRow}>
          {[
            { key: "all", label: "همه متقاضیان", count: applications.length },
            { key: "pending", label: "در انتظار بررسی", count: pendingCount },
            { key: "in_review", label: "در حال ارزیابی", count: inReviewCount },
            { key: "revision_requested", label: "نیازمند اصلاح", count: revisionCount },
            { key: "approved", label: "تایید شده", count: approvedCount },
            { key: "rejected", label: "رد شده", count: stats?.rejectedCount ?? 0 },
            { key: "suspended", label: "معلق", count: stats?.suspendedCount ?? 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.statusTabBtn} ${statusFilter === tab.key ? styles.statusTabBtnActive : ""}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              <span>{tab.label}</span>
              <span className={styles.tabCountBadge}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Applicants Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>مشخصات مدرس</th>
                <th>تحصیلات و دانشگاه</th>
                <th>تخصص‌ها و حوزه‌های تدریس</th>
                <th>وضعیت احراز هویت</th>
                <th>کارمزد و نشان‌ها</th>
                <th>عملیات ارزیابی</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>📂</span>
                      <p className={styles.emptyTitle}>هیچ پرونده‌ای با فیلترهای انتخابی یافت نشد.</p>
                      <p className={styles.emptyDesc}>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className={styles.tableRow}>
                    {/* User Info Cell */}
                    <td>
                      <div className={styles.userCell}>
                        {app.avatarUrl ? (
                          <Image
                            src={app.avatarUrl}
                            alt={app.fullName}
                            width={44}
                            height={44}
                            className={styles.userAvatar}
                            unoptimized
                          />
                        ) : (
                          <div className={styles.userAvatarFallback}>{app.fullName.charAt(0)}</div>
                        )}
                        <div>
                          <div className={styles.userName}>
                            <span>{app.fullName}</span>
                            {app.isFeatured && <span className={styles.featuredPill}>ویژه</span>}
                          </div>
                          <div className={styles.userSub}>
                            <span>📍 {app.city}</span>
                            <span>•</span>
                            <span>{app.experienceYears} سال سابقه</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Education */}
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{app.degree}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{app.university}</div>
                    </td>

                    {/* Specialties */}
                    <td>
                      <div className={styles.specialtyChips}>
                        {app.specialties.map((spec, i) => (
                          <span key={i} className={styles.chip}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td>{getStatusBadge(app.status)}</td>

                    {/* Commission & Badges */}
                    <td>
                      <div className={styles.commissionCell}>
                        <div className={styles.commissionBadge}>{app.commissionRatePercent}٪ کارمزد</div>
                        <div className={styles.commissionTierTag}>
                          {app.commissionTier === "vip_gold"
                            ? "👑 طلایی VIP"
                            : app.commissionTier === "senior_silver"
                            ? "🥈 نقره‌ای ارشد"
                            : app.commissionTier === "standard_bronze"
                            ? "🥉 برنزی استاندارد"
                            : "⚙️ سفارشی"}
                        </div>
                        {app.assignedBadges.length > 0 && (
                          <div className={styles.badgesList}>
                            {app.assignedBadges.slice(0, 3).map((bKey) => {
                              const bDef = OFFICIAL_BADGE_CATALOG.find((b) => b.key === bKey);
                              return (
                                <span key={bKey} className={styles.badgeIconPill} title={bDef?.titleFa}>
                                  {bDef?.icon || "🏅"}
                                </span>
                              );
                            })}
                            {app.assignedBadges.length > 3 && (
                              <span className={styles.badgeIconPill}>+{app.assignedBadges.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div className={styles.actionBtns}>
                        <button
                          type="button"
                          className={styles.btnReview}
                          onClick={() => handleOpenDossier(app, 1)}
                        >
                          <span>📋</span>
                          <span>بررسی پرونده</span>
                        </button>
                        <button
                          type="button"
                          className={styles.btnQuickAction}
                          onClick={() => handleOpenDossier(app, 3)}
                          title="تنظیم کارمزد و نشان‌ها"
                        >
                          <span>⚙️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 4-Step Review Dossier Modal / Drawer */}
      {selectedApp && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Top Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalApplicantTitle}>
                {selectedApp.avatarUrl ? (
                  <Image
                    src={selectedApp.avatarUrl}
                    alt={selectedApp.fullName}
                    width={52}
                    height={52}
                    className={styles.modalAvatar}
                    unoptimized
                  />
                ) : (
                  <div className={styles.userAvatarFallback}>{selectedApp.fullName.charAt(0)}</div>
                )}
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    پرونده ارزیابی صلاحیت: {selectedApp.fullName}
                  </h3>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    {getStatusBadge(selectedApp.status)}
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      کد ملی: {selectedApp.nationalId} | تماس: {selectedApp.phone}
                    </span>
                  </div>
                </div>
              </div>

              <button type="button" className={styles.modalCloseBtn} onClick={handleCloseModal} title="بستن پنجره">
                ✕
              </button>
            </div>

            {/* 4-Step Nav Stepper */}
            <div className={styles.stepperNav}>
              <button
                type="button"
                className={`${styles.stepTab} ${activeModalStep === 1 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveModalStep(1)}
              >
                <span className={styles.stepNumberBadge}>۱</span>
                <span>اطلاعات هویتی و سوابق</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeModalStep === 2 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveModalStep(2)}
              >
                <span className={styles.stepNumberBadge}>۲</span>
                <span>ویدئوی تدریس و گواهی‌ها</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeModalStep === 3 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveModalStep(3)}
              >
                <span className={styles.stepNumberBadge}>۳</span>
                <span>کارمزد، نشان‌ها و دسترسی‌ها</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeModalStep === 4 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveModalStep(4)}
              >
                <span className={styles.stepNumberBadge}>۴</span>
                <span>تصمیم‌گیری نهایی و لاگ ممیزی</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className={styles.modalBody}>
              {/* STEP 1: IDENTITY & EDUCATION */}
              {activeModalStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                    👤 مشخصات هویتی و سوابق آکادمیک متقاضی
                  </h4>

                  <div className={styles.dossierGrid}>
                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>نام و نام خانوادگی</span>
                      <span className={styles.dossierValue}>{selectedApp.fullName}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>کد ملی</span>
                      <span className={styles.dossierValue}>{selectedApp.nationalId}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>شماره تماس همراه</span>
                      <span className={styles.dossierValue} dir="ltr" style={{ textAlign: "right" }}>
                        {selectedApp.phone}
                      </span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>پست الکترونیک (ایمیل)</span>
                      <span className={styles.dossierValue} dir="ltr" style={{ textAlign: "right" }}>
                        {selectedApp.email}
                      </span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>شهر سکونت</span>
                      <span className={styles.dossierValue}>{selectedApp.city}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>مقطع و رشته تحصیلی</span>
                      <span className={styles.dossierValue}>{selectedApp.degree}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>دانشگاه محل تحصیل</span>
                      <span className={styles.dossierValue}>{selectedApp.university}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>سابقه تدریس تخصصی</span>
                      <span className={styles.dossierValue}>{selectedApp.experienceYears} سال سابقه</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>نرخ پیشنهادی هر جلسه (تومان)</span>
                      <span className={styles.dossierValue} style={{ color: "#2563eb" }}>
                        {selectedApp.hourlyRateToman.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className={styles.dossierField} style={{ width: "100%", boxSizing: "border-box" }}>
                    <span className={styles.dossierLabel}>بیوگرافی و معرفی شخصی</span>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", lineHeight: 1.7, color: "#334155" }}>
                      {selectedApp.bio}
                    </p>
                  </div>

                  {/* Documents Verification Links */}
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className={styles.dossierLabel} style={{ display: "block", marginBottom: "0.5rem" }}>
                      اسناد و مدارک بارگذاری شده جهت احراز هویت:
                    </span>
                    <div className={styles.docsGrid}>
                      <div className={styles.docCard}>
                        <div className={styles.docHeader}>
                          <span>🪪</span>
                          <span>تصویر کارت ملی هوشمند</span>
                        </div>
                        {selectedApp.idDocumentUrl ? (
                          <a
                            href={selectedApp.idDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.docActionBtn}
                          >
                            <span>مشاهده سند هویتی</span>
                            <span>↗</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>بارگذاری نشده است</span>
                        )}
                      </div>

                      <div className={styles.docCard}>
                        <div className={styles.docHeader}>
                          <span>🎓</span>
                          <span>دانشنامه / مدرک دانشگاهی</span>
                        </div>
                        {selectedApp.degreeDocumentUrl ? (
                          <a
                            href={selectedApp.degreeDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.docActionBtn}
                          >
                            <span>مشاهده مدرک تحصیلی</span>
                            <span>↗</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>بارگذاری نشده است</span>
                        )}
                      </div>

                      <div className={styles.docCard}>
                        <div className={styles.docHeader}>
                          <span>📜</span>
                          <span>گواهینامه‌های تخصصی تدریس</span>
                        </div>
                        {selectedApp.certificationsDocumentUrl ? (
                          <a
                            href={selectedApp.certificationsDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.docActionBtn}
                          >
                            <span>مشاهده گواهی‌ها (CELTA/TTC)</span>
                            <span>↗</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>بارگذاری نشده است</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className={styles.btnReview}
                      onClick={() => setActiveModalStep(2)}
                      style={{ padding: "0.75rem 1.5rem" }}
                    >
                      <span>ادامه: مشاهده ویدیوی تدریس و گواهی‌ها</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TEACHING VIDEO DEMO */}
              {activeModalStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                    🎬 نمونه ویدیوی تدریس و ارزیابی مهارت گفتاری
                  </h4>

                  <div className={styles.videoPreviewBox}>
                    <div className={styles.videoHeader}>
                      <span className={styles.videoTitle}>
                        <span>🎥</span>
                        <span>ویدیوی معرفی و تدریس نمونه استاد به زبان انگلیسی</span>
                      </span>
                      {selectedApp.sampleTeachingVideoUrl && (
                        <a
                          href={selectedApp.sampleTeachingVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#38bdf8", fontSize: "0.8rem", textDecoration: "none" }}
                        >
                          مشاهده در صفحه مجزا ↗
                        </a>
                      )}
                    </div>

                    {selectedApp.sampleTeachingVideoUrl ? (
                      <div className={styles.videoPlayerPlaceholder}>
                        <a
                          href={selectedApp.sampleTeachingVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.playBtnCircle}
                          title="پخش ویدیو"
                        >
                          ▶
                        </a>
                        <span style={{ fontSize: "0.9rem", color: "#e2e8f0", fontWeight: 600 }}>
                          کلیک کنید تا ویدئوی تدریس استاد باز شود
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          سنجش تسلط، روانی کلام (Fluency)، وضوح بیان، لهجه و انگیزش‌بخشی به زبان‌آموز
                        </span>
                      </div>
                    ) : (
                      <div className={styles.videoPlayerPlaceholder} style={{ borderColor: "#ef4444" }}>
                        <span style={{ fontSize: "2rem" }}>⚠️</span>
                        <span style={{ color: "#f87171", fontWeight: 700 }}>
                          ویدیوی نمونه تدریس توسط متقاضی آپلود نشده است!
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          می‌توانید در مرحله ۴ از استاد درخواست بازنگری و آپلود ویدیو نمایید.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Evaluator Confidential Notes */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                      📝 یادداشت‌های محرمانه ارزیاب در پرونده استاد (فقط مدیران می‌بینند):
                    </label>
                    <textarea
                      rows={3}
                      value={modalAdminNotes}
                      onChange={(e) => setModalAdminNotes(e.target.value)}
                      placeholder="کیفیت لهجه، میزان تسلط بر گرامر، شیوه ارائه، لحن تعاملی، نکات قوت و ضعف..."
                      style={{
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className={styles.btnQuickAction}
                      onClick={() => setActiveModalStep(1)}
                    >
                      <span>→ بازگشت به مشخصات</span>
                    </button>
                    <button
                      type="button"
                      className={styles.btnReview}
                      onClick={() => setActiveModalStep(3)}
                      style={{ padding: "0.75rem 1.5rem" }}
                    >
                      <span>ادامه: تنظیم کارمزد و نشان‌های شایستگی</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: COMMISSION & BADGES CONFIGURATION */}
              {activeModalStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      💰 ۱. تعیین نرخ کارمزد پلتفرم ایندورا
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                      درصد کسری کارمزد از درآمد هر جلسه کلاس. اساتید ممتاز نرخ‌های کارمزد تشویقی دریافت می‌کنند.
                    </p>
                  </div>

                  {/* Commission Tiers Grid */}
                  <div className={styles.tiersGrid}>
                    <div
                      className={`${styles.tierCard} ${modalCommissionTier === "vip_gold" ? styles.tierCardSelected : ""}`}
                      onClick={() => handleTierSelect("vip_gold")}
                    >
                      <div className={styles.tierTitle}>
                        <span>👑 طلایی VIP</span>
                        <span>۱۰٪</span>
                      </div>
                      <div className={styles.tierPercent} style={{ color: "#d97706" }}>
                        ۱۰٪ کارمزد
                      </div>
                      <div className={styles.tierDesc}>اساتید برند و برجسته، اگزمینرها و شرکای استراتژیک ایندورا</div>
                    </div>

                    <div
                      className={`${styles.tierCard} ${modalCommissionTier === "senior_silver" ? styles.tierCardSelected : ""}`}
                      onClick={() => handleTierSelect("senior_silver")}
                    >
                      <div className={styles.tierTitle}>
                        <span>🥈 نقره‌ای ارشد</span>
                        <span>۱۵٪</span>
                      </div>
                      <div className={styles.tierPercent} style={{ color: "#2563eb" }}>
                        ۱۵٪ کارمزد
                      </div>
                      <div className={styles.tierDesc}>مدرسان دارای مدارک بین‌المللی CELTA و سابقه تدریس بالای ۵ سال</div>
                    </div>

                    <div
                      className={`${styles.tierCard} ${modalCommissionTier === "standard_bronze" ? styles.tierCardSelected : ""}`}
                      onClick={() => handleTierSelect("standard_bronze")}
                    >
                      <div className={styles.tierTitle}>
                        <span>🥉 برنزی استاندارد</span>
                        <span>۲۰٪</span>
                      </div>
                      <div className={styles.tierPercent} style={{ color: "#16a34a" }}>
                        ۲۰٪ کارمزد
                      </div>
                      <div className={styles.tierDesc}>نرخ استاندارد برای اساتید جدیدالورود و تایید صلاحیت شده عمومی</div>
                    </div>

                    <div
                      className={`${styles.tierCard} ${modalCommissionTier === "custom" ? styles.tierCardSelected : ""}`}
                      onClick={() => handleTierSelect("custom")}
                    >
                      <div className={styles.tierTitle}>
                        <span>⚙️ نرخ سفارشی</span>
                        <span>سفارشی</span>
                      </div>
                      <div style={{ marginTop: "0.25rem" }}>
                        <input
                          type="number"
                          min={5}
                          max={35}
                          value={modalCommissionRate}
                          onChange={(e) => {
                            setModalCommissionTier("custom");
                            setModalCommissionRate(Number(e.target.value));
                          }}
                          style={{
                            width: "70px",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontWeight: 800,
                          }}
                        />
                        <span style={{ fontSize: "0.8rem", marginRight: "0.25rem" }}>٪</span>
                      </div>
                      <div className={styles.tierDesc}>تعیین درصد دلخواه بر اساس توافق اختصاصی مدیریت</div>
                    </div>
                  </div>

                  {/* 2. Official Badge Matrix */}
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      🏅 ۲. اعطای نشان‌های رسمی شایستگی (Official Badges)
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "#64748b" }}>
                      نشان‌های انتخاب‌شده به شکل برجسته در پروفایل عمومی استاد و کارت‌های رزرو نمایش داده می‌شوند:
                    </p>

                    <div className={styles.badgesMatrix}>
                      {OFFICIAL_BADGE_CATALOG.map((badge) => {
                        const isAssigned = modalAssignedBadges.includes(badge.key);
                        return (
                          <div
                            key={badge.key}
                            className={`${styles.badgeCard} ${isAssigned ? styles.badgeCardActive : ""}`}
                            onClick={() => handleToggleBadge(badge.key)}
                          >
                            <span className={styles.badgeIconBox}>{badge.icon}</span>
                            <div className={styles.badgeInfo}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span className={styles.badgeCardTitle}>{badge.titleFa}</span>
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={() => {}}
                                  aria-label={badge.titleFa}
                                  style={{ accentColor: "#2563eb" }}
                                />
                              </div>
                              <span className={styles.badgeCardDesc}>{badge.descriptionFa}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Badge Add */}
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="افزودن نشان یا برچسب مهارتی اختصاصی (مثلاً: مدرس زبان پزشکی)..."
                        value={newCustomBadgeInput}
                        onChange={(e) => setNewCustomBadgeInput(e.target.value)}
                        style={{ maxWidth: "340px", padding: "0.5rem 0.85rem" }}
                      />
                      <button type="button" className={styles.btnQuickAction} onClick={handleAddCustomBadge}>
                        + افزودن برچسب
                      </button>
                    </div>

                    {modalCustomBadges.length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        {modalCustomBadges.map((tag) => (
                          <span
                            key={tag}
                            className={styles.chip}
                            style={{ background: "#ede9fe", color: "#6d28d9", fontWeight: 700 }}
                          >
                            🏷️ {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomBadge(tag)}
                              style={{
                                background: "none",
                                border: "none",
                                marginRight: "0.3rem",
                                cursor: "pointer",
                                color: "#9333ea",
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Teaching Permissions & Spotlight */}
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      🔒 ۳. مجوزهای تدریس و اولویت نمایش در پلتفرم
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "#64748b" }}>
                      تعیین قالب‌های مجاز تدریس و فعال‌سازی قابلیت تبلیغ ویژه در نتایج جستجو:
                    </p>

                    <div className={styles.permissionsGrid}>
                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={modalPermissions.privateVideo1on1}
                          onChange={(e) =>
                            setModalPermissions((p) => ({ ...p, privateVideo1on1: e.target.checked }))
                          }
                        />
                        <span>کلاس‌های خصوصی ۱-به-۱ زنده</span>
                      </label>

                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={modalPermissions.asyncReview}
                          onChange={(e) =>
                            setModalPermissions((p) => ({ ...p, asyncReview: e.target.checked }))
                          }
                        />
                        <span>تصحیح و تحلیل آفلاین رایتینگ و اسپیکینگ</span>
                      </label>

                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={modalPermissions.groupWebinars}
                          onChange={(e) =>
                            setModalPermissions((p) => ({ ...p, groupWebinars: e.target.checked }))
                          }
                        />
                        <span>برگزاری کلاس‌ها و وبینارهای گروهی</span>
                      </label>

                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={modalPermissions.courseCreation}
                          onChange={(e) =>
                            setModalPermissions((p) => ({ ...p, courseCreation: e.target.checked }))
                          }
                        />
                        <span>انتشار و فروش دوره‌های اختصاصی</span>
                      </label>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      <label
                        className={styles.permissionLabel}
                        style={{
                          background: modalIsFeatured ? "#fef3c7" : "#f8fafc",
                          borderColor: modalIsFeatured ? "#f59e0b" : "#e2e8f0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={modalIsFeatured}
                          onChange={(e) => setModalIsFeatured(e.target.checked)}
                        />
                        <span>
                          ⭐ <strong>مدرس برگزیده در ویترین (Featured Teacher Boost):</strong> نمایش با اولویت بالا در
                          صفحه اصلی و صدر جستجوی اساتید
                        </span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className={styles.btnQuickAction}
                      onClick={() => setActiveModalStep(2)}
                    >
                      <span>→ بازگشت به ویدیوی تدریس</span>
                    </button>
                    <button
                      type="button"
                      className={styles.btnReview}
                      onClick={() => setActiveModalStep(4)}
                      style={{ padding: "0.75rem 1.5rem" }}
                    >
                      <span>ادامه: ثبت تصمیم نهایی ارزیابی</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DECISION DISPATCH & AUDIT */}
              {activeModalStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                    ⚖️ تصمیم‌گیری نهایی مدیر و ارسال نتیجه
                  </h4>

                  {/* Summary Recap Box */}
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#166534", fontSize: "0.9rem" }}>
                      خلاصه بسته صلاحیتی آماده ثبت برای {selectedApp.fullName}:
                    </span>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#14532d" }}>
                      <span>
                        🔹 کارمزد تعیین‌شده: <strong>{modalCommissionRate}٪</strong>
                      </span>
                      <span>
                        🔹 تعداد نشان‌های اعطایی: <strong>{modalAssignedBadges.length} نشان رسمی</strong>
                      </span>
                      <span>
                        🔹 وضعیت ویترین:{" "}
                        <strong>{modalIsFeatured ? "استاد ویژه (Featured)" : "عادی"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Revision Checklist Box (visible if revision needed) */}
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#92400e", fontSize: "0.85rem" }}>
                      چک‌لیست نقص‌های پرونده (در صورت نیاز به اصلاح مدارک):
                    </span>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {[
                        "تصویر واضح و باکیفیت از روی کارت ملی",
                        "تصویر خوانا از پشت کارت ملی",
                        "ارسال ویدیوی معرفی و تدریس نمونه حداقل ۳ دقیقه به زبان انگلیسی",
                        "بارگذاری مدرک تحصیلی یا گواهی معتبر TTC/CELTA",
                        "تکمیل رزومه و سال‌های سابقه تدریس",
                      ].map((item) => (
                        <label
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            color: "#78350f",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={modalRevisionChecklist.includes(item)}
                            onChange={() => handleToggleRevisionChecklistItem(item)}
                            style={{ accentColor: "#d97706" }}
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={modalRevisionInstructions}
                      onChange={(e) => setModalRevisionInstructions(e.target.value)}
                      placeholder="توضیحات راهنمایی به متقاضی برای ارسال مجدد مدارک..."
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #fcd34d",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  {/* Rejection Reason Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b" }}>
                      علت عدم پذیرش یا رد درخواست (در صورت رد):
                    </label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="علت رد درخواست (مثلاً: عدم تطابق مدارک ارائه‌شده با استانداردهای پلتفرم)..."
                      value={modalRejectionReason}
                      onChange={(e) => setModalRejectionReason(e.target.value)}
                    />
                  </div>

                  {/* Decision Action Buttons */}
                  <div className={styles.decisionActionsPanel}>
                    <button
                      type="button"
                      className={styles.btnApproveAction}
                      onClick={() => handleSubmitDecision("approve")}
                    >
                      <span>✅</span>
                      <span>تایید صلاحیت نهایی و فعال‌سازی</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnRevisionAction}
                      onClick={() => handleSubmitDecision("request_revision")}
                    >
                      <span>⚠️</span>
                      <span>درخواست اصلاح مدارک</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnRejectAction}
                      onClick={() => handleSubmitDecision("reject")}
                    >
                      <span>❌</span>
                      <span>رد درخواست</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnSuspendAction}
                      onClick={() => handleSubmitDecision("suspend")}
                    >
                      <span>⏸️</span>
                      <span>تعلیق موقت فعالیت</span>
                    </button>
                  </div>

                  {/* Audit Trail History */}
                  {selectedApp.history && selectedApp.history.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                        📜 تاریخچه ارزیابی و سوابق ممیزی پرونده:
                      </span>
                      <div className={styles.historyList}>
                        {selectedApp.history.map((hist) => (
                          <div key={hist.id} className={styles.historyItem}>
                            <span className={styles.historyItemDate}>
                              {new Date(hist.timestamp).toLocaleDateString("fa-IR")}
                            </span>
                            <div className={styles.historyItemBody}>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <span className={styles.historyItemActor}>{hist.actor}:</span>
                                <span>{hist.action}</span>
                              </div>
                              {hist.notes && (
                                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{hist.notes}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className={styles.btnQuickAction}
                      onClick={() => setActiveModalStep(3)}
                    >
                      <span>→ بازگشت به تنظیم کارمزد و نشان‌ها</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
