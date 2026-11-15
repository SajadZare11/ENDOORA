"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./treasury-operations.module.css";
import {
  type TeacherPayoutRecord,
  type EscrowRecord,
  type TreasuryStats,
  type TeacherPayoutStatus,
  type EscrowStatus,
  validateIranianSheba,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_ESCROW_RECORDS,
  INITIAL_REVENUE_STATS,
} from "@/lib/treasury-content";

type ActiveDesk = "payouts" | "escrow" | "revenue";

export default function TreasuryOperationsConsole() {
  const [activeDesk, setActiveDesk] = useState<ActiveDesk>("payouts");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [payouts, setPayouts] = useState<TeacherPayoutRecord[]>(INITIAL_PAYOUT_REQUESTS);
  const [escrows, setEscrows] = useState<EscrowRecord[]>(INITIAL_ESCROW_RECORDS);
  const [stats, setStats] = useState<TreasuryStats>(INITIAL_REVENUE_STATS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<TeacherPayoutStatus | "all">("all");
  const [escrowStatusFilter, setEscrowStatusFilter] = useState<EscrowStatus | "all">("all");

  // Modals state
  const [disburseModalPayout, setDisburseModalPayout] = useState<TeacherPayoutRecord | null>(null);
  const [disburseBankRef, setDisburseBankRef] = useState("");
  const [disburseAdminNotes, setDisburseAdminNotes] = useState("");

  const [rejectModalPayout, setRejectModalPayout] = useState<TeacherPayoutRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectAdminNotes, setRejectAdminNotes] = useState("");

  const [arbitrateModalEscrow, setArbitrateModalEscrow] = useState<EscrowRecord | null>(null);
  const [arbitrationDecision, setArbitrationDecision] = useState<
    "release_to_teacher" | "refund_to_learner" | "split"
  >("release_to_teacher");
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [verdictMessage, setVerdictMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch live treasury data
  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/treasury");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.payouts) setPayouts(json.payouts);
          if (json.escrows) setEscrows(json.escrows);
          if (json.stats) setStats(json.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch treasury data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered Payouts
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      if (payoutStatusFilter !== "all" && p.status !== payoutStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTeacher = p.teacherName.toLowerCase().includes(q);
        const matchesEmail = p.teacherEmail.toLowerCase().includes(q);
        const matchesPhone = p.teacherPhone.includes(q);
        const matchesHolder = p.accountHolderName.toLowerCase().includes(q);
        const matchesSheba = p.bankShabaNumber.toLowerCase().includes(q);
        const matchesTracking = p.bankTrackingCode && p.bankTrackingCode.toLowerCase().includes(q);
        if (!matchesTeacher && !matchesEmail && !matchesPhone && !matchesHolder && !matchesSheba && !matchesTracking) {
          return false;
        }
      }
      return true;
    });
  }, [payouts, payoutStatusFilter, searchQuery]);

  // Filtered Escrows
  const filteredEscrows = useMemo(() => {
    return escrows.filter((e) => {
      if (escrowStatusFilter !== "all" && e.status !== escrowStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTopic = e.sessionTopic.toLowerCase().includes(q);
        const matchesLearner = e.learnerName.toLowerCase().includes(q);
        const matchesTeacher = e.teacherName.toLowerCase().includes(q);
        const matchesBooking = e.bookingId.toLowerCase().includes(q);
        if (!matchesTopic && !matchesLearner && !matchesTeacher && !matchesBooking) return false;
      }
      return true;
    });
  }, [escrows, escrowStatusFilter, searchQuery]);

  // Actions: Disburse Payout
  const handleConfirmDisburse = async () => {
    if (!disburseModalPayout) return;
    if (!disburseBankRef.trim()) {
      showToast("❌ ثبت شماره ارجاع بانکی (کد پیگیری پایا یا ساتنا) الزامی است.");
      return;
    }

    try {
      const res = await fetch("/api/admin/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "disburse_payout",
          payoutId: disburseModalPayout.id,
          bankTrackingCode: disburseBankRef.trim(),
          adminNotes: disburseAdminNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.message}`);
        setDisburseModalPayout(null);
        setDisburseBankRef("");
        setDisburseAdminNotes("");
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Reject Payout
  const handleConfirmReject = async () => {
    if (!rejectModalPayout) return;
    if (!rejectionReason.trim()) {
      showToast("❌ درج دلیل رد درخواست تسویه الزامی است.");
      return;
    }

    try {
      const res = await fetch("/api/admin/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_payout",
          payoutId: rejectModalPayout.id,
          rejectionReason: rejectionReason.trim(),
          adminNotes: rejectAdminNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.message}`);
        setRejectModalPayout(null);
        setRejectionReason("");
        setRejectAdminNotes("");
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Mark Processing
  const handleMarkProcessing = async (payoutId: string) => {
    try {
      const res = await fetch("/api/admin/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_payout_processing",
          payoutId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ وضعیت تسویه به در حال پردازش بانکی تغییر یافت.");
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Arbitrate Escrow
  const handleConfirmArbitration = async () => {
    if (!arbitrateModalEscrow) return;
    if (!verdictMessage.trim()) {
      showToast("❌ درج شرح و دلایل مستند رأی داوری الزامی است.");
      return;
    }

    try {
      const res = await fetch("/api/admin/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "arbitrate_escrow",
          escrowId: arbitrateModalEscrow.id,
          decision: arbitrationDecision,
          verdictMessage: verdictMessage.trim(),
          splitLearnerPercent: arbitrationDecision === "split" ? splitPercent : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`⚖️ ${data.message}`);
        setArbitrateModalEscrow(null);
        setVerdictMessage("");
        setSplitPercent(50);
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Reset Seed Data
  const handleResetSeed = async () => {
    if (!window.confirm("آیا از بازنشانی داده‌های نمونه خزانه‌داری به حالت اولیه اطمینان دارید؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🔄 داده‌های خزانه‌داری بازنشانی شدند.");
        refreshData();
      }
    } catch {
      showToast("❌ خطا در بازنشانی داده‌ها");
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = "\uFEFF"; // BOM for Excel UTF-8
    if (activeDesk === "payouts") {
      csvContent += "شناسه,استاد,ایمیل,شماره تماس,مبلغ (تومان),شماره شبا,بانک,نام صاحب حساب,وضعیت,کد رهگیری بانکی,تاریخ درخواست\n";
      payouts.forEach((p) => {
        csvContent += `"${p.id}","${p.teacherName}","${p.teacherEmail}","${p.teacherPhone}",${p.amountToman},"${p.bankShabaNumber}","${p.bankName}","${p.accountHolderName}","${p.status}","${p.bankTrackingCode || ""}","${p.createdAt}"\n`;
      });
    } else if (activeDesk === "escrow") {
      csvContent += "شناسه پرونده,موضوع جلسه,شناسه رزرو,زبان‌آموز,استاد,مبلغ کل (تومان),کارمزد پلتفرم,سهم خالص استاد,وضعیت,تاریخ جلسه\n";
      escrows.forEach((e) => {
        csvContent += `"${e.id}","${e.sessionTopic}","${e.bookingId}","${e.learnerName}","${e.teacherName}",${e.totalAmountToman},${e.commissionAmountToman},${e.teacherNetToman},"${e.status}","${e.sessionDate}"\n`;
      });
    } else {
      csvContent += "نوع محصول,عنوان,گردش ناخالص (تومان),کارمزد پلتفرم (تومان),تعداد تراکنش\n";
      stats.revenueBreakdown.forEach((r) => {
        csvContent += `"${r.productType}","${r.labelFa}",${r.grossAmountToman},${r.commissionAmountToman},${r.transactionsCount}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `endoora-treasury-${activeDesk}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 گزارش مالی در قالب فایل CSV دانلود شد.");
  };

  return (
    <div className={styles.container}>
      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            background: "#0f172a",
            color: "#ffffff",
            padding: "0.85rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 9999,
            fontSize: "0.9rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🏛️</span>
            خزانه‌داری، کارتابل تسویه اساتید و مرکز داوری اسکرو
          </h2>
          <p className={styles.headerDesc}>
            مدیریت یکپارچه جریانات مالی، اعتبارسنجی خودکار شماره شبا و کد بانک، صدور حواله پایا/ساتنا و حل‌وفصل سه‌طرفه اختلافات ضمانت کلاس‌ها
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnExportCsv} onClick={handleExportCsv} title="خروجی فایل اکسل">
            <span>📊</span> خروجی CSV
          </button>
          <button className={styles.btnResetSeed} onClick={handleResetSeed} title="تنظیم مجدد داده‌های نمونه">
            <span>🔄</span> بازنشانی داده‌ها
          </button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>حجم ناخالص تراکنش‌های پلتفرم</span>
            <span className={styles.kpiIcon}>💳</span>
          </div>
          <div className={styles.kpiValue}>
            {stats.totalGrossVolumeToman.toLocaleString()}
            <span className={styles.moneyCurrency}>تومان</span>
          </div>
          <div className={styles.kpiSub}>
            <span className={styles.kpiGoodBadge}>+۱۸.۴٪ رشد ماهانه</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>کارمزد سهم پلتفرم (تحقق‌یافته)</span>
            <span className={styles.kpiIcon}>📈</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#047857" }}>
            {stats.totalPlatformCommissionToman.toLocaleString()}
            <span className={styles.moneyCurrency}>تومان</span>
          </div>
          <div className={styles.kpiSub}>میانگین نرخ کارمزد مؤثر: ۲۰٪</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>تسویه‌حساب‌های در انتظار اساتید</span>
            <span className={styles.kpiIcon}>⏳</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#b45309" }}>
            {stats.pendingPayoutsToman.toLocaleString()}
            <span className={styles.moneyCurrency}>تومان</span>
          </div>
          <div className={styles.kpiSub}>
            {stats.pendingPayoutsCount > 0 ? (
              <span className={styles.kpiAlertBadge}>{stats.pendingPayoutsCount} درخواست نیازمند اقدام</span>
            ) : (
              <span className={styles.kpiGoodBadge}>کارتابل تسویه به‌روز است</span>
            )}
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>وجوه امانی اسکرو (Escrow Float)</span>
            <span className={styles.kpiIcon}>🛡️</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#4338ca" }}>
            {stats.activeEscrowFloatToman.toLocaleString()}
            <span className={styles.moneyCurrency}>تومان</span>
          </div>
          <div className={styles.kpiSub}>
            {stats.disputedEscrowCount > 0 ? (
              <span className={styles.kpiAlertBadge}>{stats.disputedEscrowCount} پرونده اختلافی نیازمند رأی داوری</span>
            ) : (
              <span className={styles.kpiGoodBadge}>بدون اختلاف باز</span>
            )}
          </div>
        </div>
      </div>

      {/* Desk Switcher Bar */}
      <div className={styles.deskNavCard}>
        <button
          className={`${styles.deskNavBtn} ${activeDesk === "payouts" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("payouts")}
        >
          <span>💸</span>
          کارتابل تسویه‌حساب اساتید
          <span className={styles.deskBadge}>{payouts.filter((p) => p.status === "pending").length} در انتظار</span>
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "escrow" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("escrow")}
        >
          <span>⚖️</span>
          میز نظارت و داوری اسکرو
          {stats.disputedEscrowCount > 0 && (
            <span className={styles.deskBadge} style={{ background: "#fee2e2", color: "#b91c1c" }}>
              {stats.disputedEscrowCount} اختلاف باز
            </span>
          )}
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "revenue" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("revenue")}
        >
          <span>📊</span>
          دفتر کل درآمد و تفکیک محصولات
        </button>
      </div>

      {/* DESK 1: TEACHER PAYOUTS QUEUE */}
      {activeDesk === "payouts" && (
        <>
          <div className={styles.toolbarCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="جستجو بر اساس نام استاد، شماره شبا، ایمیل، تلفن یا کد پیگیری..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.statusTabsRow}>
              <button
                className={`${styles.statusTabBtn} ${payoutStatusFilter === "all" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPayoutStatusFilter("all")}
              >
                همه درخواست‌ها ({payouts.length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${payoutStatusFilter === "pending" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPayoutStatusFilter("pending")}
              >
                در انتظار بررسی ({payouts.filter((p) => p.status === "pending").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${payoutStatusFilter === "processing" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPayoutStatusFilter("processing")}
              >
                در حال پردازش بانکی ({payouts.filter((p) => p.status === "processing").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${payoutStatusFilter === "completed" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPayoutStatusFilter("completed")}
              >
                واریز موفق ({payouts.filter((p) => p.status === "completed").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${payoutStatusFilter === "rejected" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPayoutStatusFilter("rejected")}
              >
                رد شده ({payouts.filter((p) => p.status === "rejected").length})
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>استاد متقاضی</th>
                    <th>مبلغ تسویه (تومان)</th>
                    <th>شماره شبا و حساب مقصد</th>
                    <th>وضعیت</th>
                    <th>تاریخ ثبت</th>
                    <th>عملیات و واریز</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.map((payout) => {
                    const shebaInfo = validateIranianSheba(payout.bankShabaNumber);
                    // Check if accountHolderName matches verifiedTeacherName or teacherName
                    const isNameMismatch =
                      payout.accountHolderName.trim() !== payout.verifiedTeacherName.trim() &&
                      payout.accountHolderName.trim() !== payout.teacherName.trim();

                    return (
                      <tr key={payout.id}>
                        <td>
                          <div className={styles.personCell}>
                            <div className={styles.avatar}>{payout.teacherName[0]}</div>
                            <div className={styles.personMeta}>
                              <span className={styles.personName}>{payout.teacherName}</span>
                              <span className={styles.personContact}>
                                {payout.teacherEmail} | {payout.teacherPhone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.moneyAmount}>
                            {payout.amountToman.toLocaleString()}
                            <span className={styles.moneyCurrency}>تومان</span>
                          </span>
                        </td>
                        <td>
                          <div className={styles.bankBox}>
                            <div className={styles.bankHeader}>
                              <span className={styles.bankBadge}>{shebaInfo.bankName || payout.bankName}</span>
                              {shebaInfo.isValid ? (
                                <span className={styles.shebaValidBadge} title="الگوریتم ISO 7064 معتبر است">
                                  ✓ شبا معتبر
                                </span>
                              ) : (
                                <span className={styles.shebaInvalidBadge} title={shebaInfo.error}>
                                  ✕ خطای شبا
                                </span>
                              )}
                            </div>
                            <span className={styles.shebaCode}>{payout.bankShabaNumber}</span>
                            <div className={styles.accountHolderRow}>
                              <span>صاحب حساب:</span>
                              <strong>{payout.accountHolderName}</strong>
                            </div>
                            {isNameMismatch && (
                              <div className={styles.mismatchWarning}>
                                <span>⚠️</span>
                                مغایرت: نام هویتی «{payout.verifiedTeacherName}» است!
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {payout.status === "pending" && (
                            <span className={`${styles.statusBadge} ${styles.statusPending}`}>در انتظار بررسی</span>
                          )}
                          {payout.status === "processing" && (
                            <span className={`${styles.statusBadge} ${styles.statusProcessing}`}>در حال پرداخت</span>
                          )}
                          {payout.status === "completed" && (
                            <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>واریز شد</span>
                          )}
                          {payout.status === "rejected" && (
                            <span className={`${styles.statusBadge} ${styles.statusRejected}`}>رد شده</span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {new Date(payout.createdAt).toLocaleDateString("fa-IR")}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionBtnsRow}>
                            {payout.status === "pending" && (
                              <>
                                <button
                                  className={styles.btnPrimary}
                                  onClick={() => setDisburseModalPayout(payout)}
                                  title="ثبت شماره ارجاع پایا/ساتنا و تکمیل تسویه"
                                >
                                  <span>💳</span> پرداخت و واریز
                                </button>
                                <button
                                  className={styles.btnSecondary}
                                  onClick={() => handleMarkProcessing(payout.id)}
                                  title="انتقال به صف پرداخت"
                                >
                                  در حال پردازش
                                </button>
                                <button
                                  className={styles.btnDanger}
                                  onClick={() => setRejectModalPayout(payout)}
                                  title="رد درخواست تسویه"
                                >
                                  رد
                                </button>
                              </>
                            )}

                            {payout.status === "processing" && (
                              <>
                                <button
                                  className={styles.btnPrimary}
                                  onClick={() => setDisburseModalPayout(payout)}
                                  title="ثبت کد رهگیری بانکی و مختومه کردن"
                                >
                                  <span>✓</span> ثبت کد رهگیری
                                </button>
                                <button
                                  className={styles.btnDanger}
                                  onClick={() => setRejectModalPayout(payout)}
                                  title="رد درخواست"
                                >
                                  رد
                                </button>
                              </>
                            )}

                            {payout.status === "completed" && (
                              <div className={styles.trackingCodeTag} title={`توسط: ${payout.disbursedBy || "مدیر"}`}>
                                <span>کد پیگیری:</span>
                                <strong>{payout.bankTrackingCode}</strong>
                              </div>
                            )}

                            {payout.status === "rejected" && (
                              <div style={{ fontSize: "0.75rem", color: "#b91c1c" }}>
                                <strong>دلیل:</strong> {payout.rejectionReason}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPayouts.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className={styles.emptyState}>
                          <span className={styles.emptyIcon}>📭</span>
                          <strong>هیچ درخواست تسویه‌ای با فیلتر انتخابی یافت نشد.</strong>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DESK 2: ESCROW SETTLEMENT & DISPUTES */}
      {activeDesk === "escrow" && (
        <>
          <div className={styles.toolbarCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="جستجو در پرونده‌های اسکرو بر اساس موضوع، شناسه رزرو، زبان‌آموز یا استاد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.statusTabsRow}>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "all" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("all")}
              >
                همه پرونده‌ها ({escrows.length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "disputed" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("disputed")}
              >
                نیازمند داوری و اختلاف ({escrows.filter((e) => e.status === "disputed").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "held" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("held")}
              >
                در امانت خزانه‌داری ({escrows.filter((e) => e.status === "held").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "released" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("released")}
              >
                آزاد شده به استاد ({escrows.filter((e) => e.status === "released").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "refunded" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("refunded")}
              >
                استرداد به زبان‌آموز ({escrows.filter((e) => e.status === "refunded").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${escrowStatusFilter === "split" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setEscrowStatusFilter("split")}
              >
                تسویه توافقی ({escrows.filter((e) => e.status === "split").length})
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>جلسه آموزشی و پرونده</th>
                    <th>طرفین تراکنش</th>
                    <th>مبالغ و تسهیم</th>
                    <th>وضعیت اسکرو</th>
                    <th>جزئیات ادعا یا رأی</th>
                    <th>عملیات داوری</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEscrows.map((escrow) => (
                    <tr key={escrow.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <strong style={{ color: "#0f172a" }}>{escrow.sessionTopic}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            کد رزرو: #{escrow.bookingId} | تاریخ: {escrow.sessionDate}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.82rem" }}>
                          <div>
                            <span style={{ color: "#64748b" }}>زبان‌آموز: </span>
                            <strong>{escrow.learnerName}</strong>
                          </div>
                          <div>
                            <span style={{ color: "#64748b" }}>استاد: </span>
                            <strong>{escrow.teacherName}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.82rem" }}>
                          <div>
                            <span style={{ color: "#64748b" }}>مبلغ کل: </span>
                            <strong style={{ color: "#0f172a" }}>{escrow.totalAmountToman.toLocaleString()} ت</strong>
                          </div>
                          <div>
                            <span style={{ color: "#047857" }}>سهم استاد: </span>
                            {escrow.teacherNetToman.toLocaleString()} ت
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            کارمزد پلتفرم: {escrow.commissionAmountToman.toLocaleString()} ت
                          </div>
                        </div>
                      </td>
                      <td>
                        {escrow.status === "held" && (
                          <span className={`${styles.statusBadge} ${styles.statusHeld}`}>در امانت اسکرو</span>
                        )}
                        {escrow.status === "disputed" && (
                          <span className={`${styles.statusBadge} ${styles.statusDisputed}`}>⚠️ اختلاف و شکایت</span>
                        )}
                        {escrow.status === "released" && (
                          <span className={`${styles.statusBadge} ${styles.statusReleased}`}>آزاد شده به استاد</span>
                        )}
                        {escrow.status === "refunded" && (
                          <span className={`${styles.statusBadge} ${styles.statusRefunded}`}>استرداد به دانشجو</span>
                        )}
                        {escrow.status === "split" && (
                          <span className={`${styles.statusBadge} ${styles.statusSplit}`}>تسویه توافقی</span>
                        )}
                      </td>
                      <td>
                        <div style={{ maxWidth: "260px", fontSize: "0.78rem" }}>
                          {escrow.disputeReason && (
                            <div style={{ color: "#be123c", marginBottom: "0.3rem" }}>
                              <strong>شرح اختلاف:</strong> {escrow.disputeReason}
                            </div>
                          )}
                          {escrow.arbitrationVerdict && (
                            <div style={{ color: "#0f172a", background: "#f8fafc", padding: "0.3rem", borderRadius: "6px" }}>
                              <strong>رأی داور:</strong> {escrow.arbitrationVerdict}
                            </div>
                          )}
                          {!escrow.disputeReason && !escrow.arbitrationVerdict && (
                            <span style={{ color: "#94a3b8" }}>جلسه طبق برنامه و بدون ادعا در جریان است.</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {escrow.status === "disputed" || escrow.status === "held" ? (
                          <button
                            className={styles.btnPrimary}
                            onClick={() => {
                              setArbitrateModalEscrow(escrow);
                              setArbitrationDecision("release_to_teacher");
                              setVerdictMessage("");
                            }}
                          >
                            <span>⚖️</span> داوری پرونده
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>پرونده مختومه شده</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredEscrows.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className={styles.emptyState}>
                          <span className={styles.emptyIcon}>🛡️</span>
                          <strong>هیچ پرونده اسکرویی با فیلتر انتخابی یافت نشد.</strong>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DESK 3: REVENUE LEDGER & PRODUCT BREAKDOWN */}
      {activeDesk === "revenue" && (
        <>
          <div className={styles.revenueOverviewGrid}>
            {stats.revenueBreakdown.map((item) => (
              <div key={item.productType} className={styles.revenueCard}>
                <div className={styles.revenueCardHeader}>
                  <span>{item.labelFa}</span>
                  <span className={styles.bankBadge}>{item.transactionsCount} تراکنش</span>
                </div>
                <div className={styles.revenueCardGross}>
                  {item.grossAmountToman.toLocaleString()}
                  <span className={styles.moneyCurrency}>تومان</span>
                </div>
                <div className={styles.revenueCardCommission}>
                  سهم کارمزد پلتفرم: {item.commissionAmountToman.toLocaleString()} تومان (
                  {Math.round((item.commissionAmountToman / item.grossAmountToman) * 100)}٪)
                </div>
              </div>
            ))}
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>دسته‌بندی محصول و خدمت</th>
                    <th>حجم ناخالص تراکنش‌ها</th>
                    <th>کارمزد سهم پلتفرم ایندورا</th>
                    <th>سهم خالص پرداخت‌شده به اساتید</th>
                    <th>تعداد تراکنش</th>
                    <th>درصد وزنی از کل گردش</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.revenueBreakdown.map((item) => {
                    const teacherNet = item.grossAmountToman - item.commissionAmountToman;
                    const weightPercent = Math.round((item.grossAmountToman / stats.totalGrossVolumeToman) * 100);
                    return (
                      <tr key={item.productType}>
                        <td>
                          <strong>{item.labelFa}</strong>
                        </td>
                        <td>
                          <span className={styles.moneyAmount}>
                            {item.grossAmountToman.toLocaleString()} <span className={styles.moneyCurrency}>تومان</span>
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "#047857", fontWeight: 700 }}>
                            {item.commissionAmountToman.toLocaleString()} تومان
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "#334155", fontWeight: 600 }}>{teacherNet.toLocaleString()} تومان</span>
                        </td>
                        <td>
                          <strong>{item.transactionsCount}</strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              style={{
                                width: "60px",
                                height: "6px",
                                background: "#e2e8f0",
                                borderRadius: "999px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${weightPercent}%`,
                                  height: "100%",
                                  background: "#047857",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{weightPercent}٪</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL: DISBURSE PAYOUT */}
      {disburseModalPayout && (
        <div className={styles.modalBackdrop} onClick={() => setDisburseModalPayout(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>💳</span> تأیید پرداخت و واریز بانکی (پایا / ساتنا)
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setDisburseModalPayout(null)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.summaryCallout}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>استاد متقاضی:</span>
                  <span className={styles.summaryValue}>{disburseModalPayout.teacherName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>مبلغ تسویه حساب:</span>
                  <span className={styles.summaryValue} style={{ color: "#047857", fontSize: "1.1rem" }}>
                    {disburseModalPayout.amountToman.toLocaleString()} تومان
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>بانک و شماره شبا:</span>
                  <span className={styles.summaryValue}>
                    {disburseModalPayout.bankName} - {disburseModalPayout.bankShabaNumber}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>نام صاحب حساب:</span>
                  <span className={styles.summaryValue}>{disburseModalPayout.accountHolderName}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>*</span> شماره ارجاع / کد رهگیری حواله بانکی (پایا / ساتنا):
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: PAYA-98234710293 یا SATNA-481923"
                  value={disburseBankRef}
                  onChange={(e) => setDisburseBankRef(e.target.value)}
                  dir="ltr"
                />
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  ثبت کد پیگیری بانکی جهت استناد مالیاتی و اطلاع‌رسانی پیامکی به استاد الزامی است.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>یادداشت اختیاری خزانه‌داری:</label>
                <textarea
                  className={styles.textarea}
                  placeholder="توضیحات تکمیلی یا شماره فیش جهت بایگانی..."
                  value={disburseAdminNotes}
                  onChange={(e) => setDisburseAdminNotes(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setDisburseModalPayout(null)}>
                انصراف
              </button>
              <button className={styles.btnPrimary} onClick={handleConfirmDisburse}>
                تأیید و ثبت نهایی سند واریز
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT PAYOUT */}
      {rejectModalPayout && (
        <div className={styles.modalBackdrop} onClick={() => setRejectModalPayout(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#b91c1c" }}>
                <span>✕</span> رد درخواست تسویه‌حساب استاد
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setRejectModalPayout(null)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.summaryCallout}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>استاد:</span>
                  <span className={styles.summaryValue}>{rejectModalPayout.teacherName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>مبلغ:</span>
                  <span className={styles.summaryValue}>{rejectModalPayout.amountToman.toLocaleString()} تومان</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>*</span> دلیل رسمی رد درخواست تسویه (نمایش به استاد):
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="مثال: مغایرت نام صاحب حساب با هویت احرازشده استاد، لطفا شماره شبای جدید ثبت نمایید."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>یادداشت محرمانه خزانه‌داری (اختیاری):</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="یادداشت داخلی..."
                  value={rejectAdminNotes}
                  onChange={(e) => setRejectAdminNotes(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setRejectModalPayout(null)}>
                انصراف
              </button>
              <button className={styles.btnDanger} onClick={handleConfirmReject}>
                رد قطعی درخواست تسویه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARBITRATE ESCROW */}
      {arbitrateModalEscrow && (
        <div className={styles.modalBackdrop} onClick={() => setArbitrateModalEscrow(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>⚖️</span> داوری پرونده ضمانت اسکرو (#{arbitrateModalEscrow.bookingId})
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setArbitrateModalEscrow(null)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.summaryCallout}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>موضوع و تاریخ جلسه:</span>
                  <span className={styles.summaryValue}>
                    {arbitrateModalEscrow.sessionTopic} ({arbitrateModalEscrow.sessionDate})
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>زبان‌آموز:</span>
                  <span className={styles.summaryValue}>{arbitrateModalEscrow.learnerName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>استاد:</span>
                  <span className={styles.summaryValue}>{arbitrateModalEscrow.teacherName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>مبلغ کل وثیقه اسکرو:</span>
                  <span className={styles.summaryValue} style={{ color: "#047857" }}>
                    {arbitrateModalEscrow.totalAmountToman.toLocaleString()} تومان
                  </span>
                </div>
                {arbitrateModalEscrow.disputeReason && (
                  <div style={{ marginTop: "0.4rem", color: "#be123c", fontSize: "0.8rem" }}>
                    <strong>شرح ادعای اختلاف:</strong> {arbitrateModalEscrow.disputeReason}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>رأی و نحوه تخصیص وثیقه اسکرو:</label>
                <div className={styles.decisionOptionsGrid}>
                  <label
                    className={`${styles.decisionCard} ${arbitrationDecision === "release_to_teacher" ? styles.decisionCardSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="arbitrationDecision"
                      className={styles.decisionRadio}
                      checked={arbitrationDecision === "release_to_teacher"}
                      onChange={() => setArbitrationDecision("release_to_teacher")}
                    />
                    <div className={styles.decisionInfo}>
                      <span className={styles.decisionTitle}>آزادسازی ۱۰۰٪ به نفع استاد (جلسه معتبر)</span>
                      <span className={styles.decisionDesc}>
                        حق‌التدریس به موجودی قابل برداشت استاد منظور می‌شود. این گزینه در صورت برگزاری مطلوب کلاس و رفع ادعا انتخاب می‌شود.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`${styles.decisionCard} ${arbitrationDecision === "refund_to_learner" ? styles.decisionCardSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="arbitrationDecision"
                      className={styles.decisionRadio}
                      checked={arbitrationDecision === "refund_to_learner"}
                      onChange={() => setArbitrationDecision("refund_to_learner")}
                    />
                    <div className={styles.decisionInfo}>
                      <span className={styles.decisionTitle}>استرداد ۱۰۰٪ به کیف پول زبان‌آموز (عدم برگزاری / غیبت استاد)</span>
                      <span className={styles.decisionDesc}>
                        مبلغ کل {arbitrateModalEscrow.totalAmountToman.toLocaleString()} تومان مستقیماً به کیف پول کاربری زبان‌آموز عودت داده می‌شود.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`${styles.decisionCard} ${arbitrationDecision === "split" ? styles.decisionCardSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="arbitrationDecision"
                      className={styles.decisionRadio}
                      checked={arbitrationDecision === "split"}
                      onChange={() => setArbitrationDecision("split")}
                    />
                    <div className={styles.decisionInfo}>
                      <span className={styles.decisionTitle}>تسهیم توافقی وجه (Split Settlement)</span>
                      <span className={styles.decisionDesc}>
                        تسهیم درصدی مبلغ به دلیل اختلال فنی یا قطعی کلاس در بخشی از زمان جلسه.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {arbitrationDecision === "split" && (
                <div className={styles.splitBox}>
                  <div className={styles.splitSliderRow}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>سهم استرداد به دانشجو: {splitPercent}٪</span>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      step={5}
                      className={styles.slider}
                      value={splitPercent}
                      onChange={(e) => setSplitPercent(Number(e.target.value))}
                    />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>سهم استاد: {100 - splitPercent}٪</span>
                  </div>
                  <div className={styles.splitCalculatedRow}>
                    <span style={{ color: "#1d4ed8" }}>
                      مبلغ عودت به کیف پول دانشجو:{" "}
                      {Math.round((arbitrateModalEscrow.totalAmountToman * splitPercent) / 100).toLocaleString()} تومان
                    </span>
                    <span style={{ color: "#047857" }}>
                      مبلغ تسویه با استاد:{" "}
                      {Math.round((arbitrateModalEscrow.totalAmountToman * (100 - splitPercent)) / 100).toLocaleString()}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>*</span> شرح و مستندات قانونی رأی داوری (ابلاغ به طرفین):
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="شرح مستندات، بررسی گزارش لاگ ارتباطی سرور کلاس و نتیجه داوری نهایی..."
                  value={verdictMessage}
                  onChange={(e) => setVerdictMessage(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setArbitrateModalEscrow(null)}>
                انصراف
              </button>
              <button className={styles.btnPrimary} onClick={handleConfirmArbitration}>
                ابلاغ و اجرای رأی داوری
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
