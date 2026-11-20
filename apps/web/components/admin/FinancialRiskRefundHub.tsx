"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./financial-risk-hub.module.css";
import {
  RefundRecord,
  RiskAlertRecord,
  EligibleTransaction,
  RefundMethod,
  INITIAL_REFUNDS,
  INITIAL_RISK_ALERTS,
  INITIAL_TRANSACTIONS,
} from "@/lib/admin-financial-risk-store";

type FinanceRiskTab = "refunds" | "anti-fraud" | "reversal-ledger";

export function FinancialRiskRefundHub() {
  const [activeTab, setActiveTab] = useState<FinanceRiskTab>("refunds");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Refunds & Transactions State
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);
  const [eligibleTransactions, setEligibleTransactions] = useState<EligibleTransaction[]>(INITIAL_TRANSACTIONS);
  const [txSearch, setTxSearch] = useState<string>("");

  // Refund Modal State
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<EligibleTransaction | null>(null);
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("wallet_credit");
  const [refundCustomAmount, setRefundCustomAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>("");
  const [issuingRefund, setIssuingRefund] = useState<boolean>(false);

  // Risk Alerts State
  const [riskAlerts, setRiskAlerts] = useState<RiskAlertRecord[]>(INITIAL_RISK_ALERTS);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [mitigatingId, setMitigatingId] = useState<string | null>(null);

  // Voucher Print Modal
  const [selectedVoucherRefund, setSelectedVoucherRefund] = useState<RefundRecord | null>(null);

  // Notification helper
  const notify = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fetch Refunds & Transactions
  const fetchRefunds = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/finance/refunds");
      const data = await res.json();
      if (data.success) {
        if (data.refunds) setRefunds(data.refunds);
        if (data.eligibleTransactions) setEligibleTransactions(data.eligibleTransactions);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch Risk Alerts
  const fetchRiskAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/finance/risk-alerts");
      const data = await res.json();
      if (data.success && data.alerts) {
        setRiskAlerts(data.alerts);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
    fetchRiskAlerts();
  }, [fetchRefunds, fetchRiskAlerts]);

  // Open Refund Modal for a transaction
  const handleOpenRefundModal = (tx: EligibleTransaction) => {
    setSelectedTxForRefund(tx);
    setRefundCustomAmount(tx.amountToman);
    setRefundMethod("wallet_credit");
    setRefundReason("درخواست استرداد وجه با تایید مدیر ارشد");
  };

  // Submit Refund
  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxForRefund) return;
    if (!refundReason.trim()) {
      alert("وارد کردن علت استرداد وجه الزامی است.");
      return;
    }

    try {
      setIssuingRefund(true);
      const res = await fetch("/api/admin/finance/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "issue_refund",
          transactionId: selectedTxForRefund.id,
          refundMethod,
          customAmountToman: refundCustomAmount,
          reason: refundReason,
        }),
      });
      const data = await res.json();
      if (data.success && data.refund) {
        notify(data.message);
        setRefunds((prev) => [data.refund, ...prev]);
        setEligibleTransactions((prev) => prev.filter((t) => t.id !== selectedTxForRefund.id));
        setSelectedTxForRefund(null);
      } else {
        notify(data.error || "خطا در صدور استرداد وجه", true);
      }
    } catch {
      notify("خطا در برقراری ارتباط با درگاه استرداد", true);
    } finally {
      setIssuingRefund(false);
    }
  };

  // Mitigate Risk Alert
  const handleMitigateAlert = async (
    alertId: string,
    mitigationAction: "force_logout" | "freeze_account" | "revoke_enrollment" | "blacklist_ip" | "whitelist"
  ) => {
    try {
      setMitigatingId(alertId);
      const res = await fetch("/api/admin/finance/risk-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mitigate", alertId, mitigationAction }),
      });
      const data = await res.json();
      if (data.success && data.alert) {
        notify(data.message);
        setRiskAlerts((prev) => prev.map((a) => (a.id === alertId ? data.alert : a)));
      } else {
        notify(data.error || "خطا در اعمال اقدام واکنشی", true);
      }
    } catch {
      notify("خطا در اتصال به سرور ریسک", true);
    } finally {
      setMitigatingId(null);
    }
  };

  // Filtered transactions
  const filteredTransactions = eligibleTransactions.filter((tx) => {
    if (!txSearch.trim()) return true;
    const q = txSearch.toLowerCase();
    return (
      tx.learnerName.toLowerCase().includes(q) ||
      tx.learnerPhone.includes(q) ||
      tx.courseTitle.toLowerCase().includes(q) ||
      tx.trackingCode.toLowerCase().includes(q)
    );
  });

  // Filtered risk alerts
  const filteredAlerts = riskAlerts.filter((a) => {
    if (riskFilter === "all") return true;
    return a.status === riskFilter;
  });

  // Metric sums
  const totalRefundedSum = refunds.reduce((acc, r) => acc + r.amountToman, 0);
  const activeAlertsCount = riskAlerts.filter((a) => a.status === "active").length;

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            zIndex: 10000,
            padding: "0.85rem 1.5rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "700",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            background: statusMessage.isError ? "#ef4444" : "#10b981",
            color: "#ffffff",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2>مرکز عودت وجه و اتاق ریسک مالی و ضدتقلب (Risk & Refund Room)</h2>
              <span style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.75rem", fontWeight: "800", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                Financial Defense
              </span>
            </div>
            <p>
              استرداد وجه مستقیم با ۱ کلیک (ریورس شاپرک یا شارژ کیف پول با ۵٪ پاداش)، کسر خودکار از سهم استاد، رصد اشتراک اکانت‌ها و واکنش به حملات کارتینگ
            </p>
          </div>
        </div>

        {/* Financial Metrics Summary */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>کل مبالغ استرداد شده</span>
              <span>تومان</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#ef4444" }}>
              {totalRefundedSum.toLocaleString()} تومان
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>هشدارهای ریسک فعال و مشکوک</span>
              <span>نیازمند اقدام</span>
            </div>
            <div className={styles.metricValue} style={{ color: activeAlertsCount > 0 ? "#f59e0b" : "#10b981" }}>
              {activeAlertsCount} مورد
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>اسناد ابطال مالیاتی صادرشده</span>
              <span>Reversal Vouchers</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#2563eb" }}>
              {refunds.length} سند رسمی
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>نرخ حفظ درآمد خالص پلتفرم</span>
              <span>Retention</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#10b981" }}>
              ۹۸.۴٪
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <nav className={styles.subTabsNav} style={{ marginTop: "1.25rem" }}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "refunds" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("refunds")}
          >
            💸 صدور آنی استرداد وجه (1-Click Refund)
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "anti-fraud" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("anti-fraud")}
          >
            🚨 سپر ضدتقلب و اشتراک اکانت ({activeAlertsCount} فعال)
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "reversal-ledger" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("reversal-ledger")}
          >
            📜 دفتر کل اسناد ابطال و عودت ({refunds.length})
          </button>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 1. Sub-Tab: 1-Click Refund Console */}
      {/* ===================================================================== */}
      {activeTab === "refunds" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>تراکنش‌های اخیر و صدور استرداد با ۱ کلیک</h3>
              <p>شما دارای اختیار تام برای استرداد هر تراکنش در هر زمان، به کارت مبدا یا کیف پول کاربر هستید.</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="جستجو در نام، شماره یا کد رهگیری شاپرک..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                style={{ padding: "0.5rem 0.85rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.85rem", minWidth: "250px" }}
              />
            </div>
          </div>

          {/* Eligible Transactions Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>کد رهگیری</th>
                  <th>زبان‌آموز</th>
                  <th>دوره آموزشی</th>
                  <th>مبلغ پرداختی</th>
                  <th>سهم مدرس (۷۰٪)</th>
                  <th>تاریخ پرداخت</th>
                  <th style={{ textAlign: "center" }}>عملیات استرداد</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                      تراکنش قابل استردادی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: "monospace", color: "#2563eb", fontWeight: "700" }}>{tx.trackingCode}</td>
                      <td>
                        <div style={{ fontWeight: "700" }}>{tx.learnerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{tx.learnerPhone}</div>
                      </td>
                      <td>{tx.courseTitle}</td>
                      <td style={{ fontWeight: "700", color: "#0f172a" }}>{tx.amountToman.toLocaleString()} تومان</td>
                      <td style={{ color: "#64748b" }}>{tx.teacherCommissionToman.toLocaleString()} تومان ({tx.teacherName})</td>
                      <td>{tx.paidAt}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                          onClick={() => handleOpenRefundModal(tx)}
                        >
                          💸 صدور استرداد وجه
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Sub-Tab: Anti-Fraud Shield & Account Sharing Monitor */}
      {/* ===================================================================== */}
      {activeTab === "anti-fraud" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>سپر ضدتقلب و پایش بلادرنگ ریسک‌های امنیتی حساب‌ها</h3>
              <p>شناسایی هوشمند اشتراک همزمان اکانت با دوستان، جهش‌های غیرعادی جغرافیایی و تست کارت‌های بانکی</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["all", "active", "mitigated", "whitelisted"].map((flt) => (
                <button
                  key={flt}
                  type="button"
                  className={`${styles.tabBtn} ${riskFilter === flt ? styles.tabBtnActive : ""}`}
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                  onClick={() => setRiskFilter(flt)}
                >
                  {flt === "all" ? "همه" : flt === "active" ? "فعال" : flt === "mitigated" ? "مهار شده" : "مجاز"}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Alerts Cards List */}
          <div className={styles.riskAlertsList}>
            {filteredAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "#10b981", background: "#f0fdf4", borderRadius: "8px" }}>
                ✅ هیچ هشدار امنیتی و ریسک مالی در این وضعیت وجود ندارد.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`${styles.riskCard} ${
                    alert.severity === "critical"
                      ? styles.riskCritical
                      : alert.severity === "high"
                      ? styles.riskHigh
                      : styles.riskMedium
                  }`}
                >
                  <div className={styles.riskTopRow}>
                    <div>
                      <div className={styles.riskUserTitle}>
                        <span>{alert.userEmail} ({alert.userPhone})</span>
                        <span
                          className={
                            alert.severity === "critical"
                              ? styles.badgeFailed
                              : alert.severity === "high"
                              ? styles.badgeProcessing
                              : styles.badgeCompleted
                          }
                        >
                          {alert.severity.toUpperCase()} RISK
                        </span>
                        <span
                          className={
                            alert.status === "active"
                              ? styles.badgeFailed
                              : alert.status === "mitigated"
                              ? styles.badgeCompleted
                              : styles.badgeProcessing
                          }
                        >
                          {alert.status === "active" ? "هشدار فعال" : alert.status === "mitigated" ? "مهار شده" : "مجاز شناخته شده"}
                        </span>
                      </div>
                      <p className={styles.riskDesc}>{alert.descriptionFa}</p>
                    </div>

                    {/* Quick Reaction Action Buttons */}
                    {alert.status === "active" && (
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.7rem" }}
                          onClick={() => handleMitigateAlert(alert.id, "force_logout")}
                          disabled={mitigatingId === alert.id}
                        >
                          ⚡ قطع فوری سشن‌ها (Force Logout)
                        </button>
                        <button
                          type="button"
                          className={styles.btnWarning}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.7rem" }}
                          onClick={() => handleMitigateAlert(alert.id, "freeze_account")}
                          disabled={mitigatingId === alert.id}
                        >
                          🔒 مسدودسازی موقت
                        </button>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.7rem" }}
                          onClick={() => handleMitigateAlert(alert.id, "whitelist")}
                          disabled={mitigatingId === alert.id}
                        >
                          ✓ تایید فعالیت مجاز
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Indicators Details */}
                  <div className={styles.riskIndicatorsBox}>
                    {alert.indicators.concurrentIps && (
                      <div>
                        <strong>آی‌پی‌های همزمان متصل: </strong>
                        {alert.indicators.concurrentIps.map((ip) => (
                          <span key={ip} className={styles.tagChip}>
                            {ip}
                          </span>
                        ))}
                      </div>
                    )}

                    {alert.indicators.deviceFingerprints && (
                      <div>
                        <strong>دستگاه‌های استفاده شده: </strong>
                        {alert.indicators.deviceFingerprints.join(" | ")}
                      </div>
                    )}

                    {alert.indicators.failedAttemptsCount && (
                      <div>
                        <strong>تعداد تلاش‌های ناموفق درگاه: </strong>
                        <span style={{ color: "#ef4444", fontWeight: "700" }}>{alert.indicators.failedAttemptsCount} مرتبه</span>
                      </div>
                    )}

                    {alert.indicators.associatedCourse && (
                      <div>
                        <strong>دوره مرتبط: </strong>
                        <span>{alert.indicators.associatedCourse}</span>
                      </div>
                    )}
                  </div>

                  {alert.mitigationActionTaken && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#166534" }}>
                      اقدام انجام‌شده: {alert.mitigationActionTaken} (توسط {alert.mitigatedBy} در {alert.mitigatedAt})
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. Sub-Tab: Reversal Ledger & Tax Vouchers */}
      {/* ===================================================================== */}
      {activeTab === "reversal-ledger" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>دفتر کل اسناد ابطال، اصلاح کارمزد و اسناد رسمی مالیاتی</h3>
              <p>سوابق کلیه استردادهای صادرشده با جزئیات کسر از سهم استاد، تراز بانکی و کدهای یکتای مالیاتی</p>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>شناسه استرداد</th>
                  <th>کد سند مالیاتی</th>
                  <th>زبان‌آموز</th>
                  <th>مبلغ عودت</th>
                  <th>روش پرداخت</th>
                  <th>کسر از سهم استاد</th>
                  <th>علت استرداد</th>
                  <th>تاریخ صدور</th>
                  <th>سند</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((ref) => (
                  <tr key={ref.id}>
                    <td style={{ fontFamily: "monospace", color: "#dc2626", fontWeight: "700" }}>{ref.id}</td>
                    <td style={{ fontFamily: "monospace", color: "#2563eb" }}>{ref.taxVoucherCode}</td>
                    <td>
                      <div style={{ fontWeight: "700" }}>{ref.learnerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{ref.learnerPhone}</div>
                    </td>
                    <td style={{ fontWeight: "700", color: "#0f172a" }}>
                      {ref.amountToman.toLocaleString()} تومان
                      {ref.bonusAmountToman > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>
                          (+{ref.bonusAmountToman.toLocaleString()} تومان پاداش کیف پول)
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={ref.refundMethod === "wallet_credit" ? styles.badgeCompleted : styles.badgeProcessing}>
                        {ref.refundMethod === "wallet_credit" ? "کیف پول داخلی" : "ریورس کارت شاپرک"}
                      </span>
                    </td>
                    <td style={{ color: "#dc2626" }}>
                      -{ref.teacherCommissionReversedToman.toLocaleString()} تومان ({ref.teacherName})
                    </td>
                    <td style={{ fontSize: "0.85rem", maxWidth: "200px" }}>{ref.reason}</td>
                    <td>{ref.createdAt}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                        onClick={() => setSelectedVoucherRefund(ref)}
                      >
                        سند رسمی 📄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Modals */}
      {/* ===================================================================== */}

      {/* 1-Click Refund Execution Modal */}
      {selectedTxForRefund && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedTxForRefund(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#dc2626" }}>💸 صدور آنی استرداد وجه تراکنش</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedTxForRefund(null)}>
                ×
              </button>
            </div>

            <form onSubmit={handleExecuteRefund} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <div>خریدار: <strong>{selectedTxForRefund.learnerName}</strong></div>
                  <div>شماره تماس: <strong>{selectedTxForRefund.learnerPhone}</strong></div>
                  <div>دوره: <strong>{selectedTxForRefund.courseTitle}</strong></div>
                  <div>کد تراکنش: <strong style={{ fontFamily: "monospace" }}>{selectedTxForRefund.trackingCode}</strong></div>
                </div>
              </div>

              {/* Refund Method Selection */}
              <div className={styles.formGroup}>
                <label>روش بازپرداخت و انتقال وجه:</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${refundMethod === "wallet_credit" ? "#2563eb" : "#cbd5e1"}`,
                      background: refundMethod === "wallet_credit" ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="refundMethod"
                      value="wallet_credit"
                      checked={refundMethod === "wallet_credit"}
                      onChange={() => setRefundMethod("wallet_credit")}
                    />
                    <div>
                      <strong style={{ color: "#1e40af" }}>شارژ آنی کیف پول داخلی با ۵٪ پاداش هدیه (پیشنهادی)</strong>
                      <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.785rem", color: "#64748b" }}>
                        مبلغ فوراً به اعتبار کاربری واریز شده و ۵٪ مبلغ اضافی جهت ترغیب به ثبت‌نام در سایر دوره‌ها اضافه می‌گردد.
                      </p>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${refundMethod === "shaparak_card_reversal" ? "#dc2626" : "#cbd5e1"}`,
                      background: refundMethod === "shaparak_card_reversal" ? "#fef2f2" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="refundMethod"
                      value="shaparak_card_reversal"
                      checked={refundMethod === "shaparak_card_reversal"}
                      onChange={() => setRefundMethod("shaparak_card_reversal")}
                    />
                    <div>
                      <strong style={{ color: "#991b1b" }}>استرداد مستقیم به کارت بانکی مبدا خریدار (ریورس شاپرک)</strong>
                      <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.785rem", color: "#64748b" }}>
                        ارسال دستور Reverse Payment به درگاه شاپرک/زرین‌پال و واریز مستقیم به کارت شتابی متقاضی.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div className={styles.formGroup}>
                <label>مبلغ استرداد (تومان):</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={refundCustomAmount}
                  onChange={(e) => setRefundCustomAmount(Number(e.target.value))}
                />
              </div>

              {/* Reason */}
              <div className={styles.formGroup}>
                <label>علت و توجیه استرداد (جهت ثبت در ممیزی و حسابداری):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  placeholder="مثال: اعلام عدم رضایت کاربر و درخواست تعویض به دوره دیگر..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              {/* Financial Impact Summary */}
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "0.75rem", borderRadius: "8px", fontSize: "0.8rem", color: "#92400e" }}>
                <div>• کسر از سهم آینده مدرس ({selectedTxForRefund.teacherName}): <strong>{Math.round(refundCustomAmount * 0.7).toLocaleString()} تومان</strong></div>
                <div>• صدور خودکار سند ابطال مالیاتی با شناسه یکتا REV-TAX</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setSelectedTxForRefund(null)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnDanger} disabled={issuingRefund}>
                  {issuingRefund ? "در حال ارسال دستور به شاپرک..." : "تایید و صدور قطعی استرداد"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tax Reversal Voucher Modal */}
      {selectedVoucherRefund && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedVoucherRefund(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3>سند رسمی ابطال مالیاتی و عودت وجه</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedVoucherRefund(null)}>
                ×
              </button>
            </div>

            <div style={{ border: "2px solid #0f172a", borderRadius: "10px", padding: "1.25rem", background: "#ffffff", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>آکادمی بین‌المللی ایندورا</h4>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>سند رسمی ابطال فاکتور و بازپرداخت وجه (Tax Reversal Voucher)</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
                <div>شماره سند: <strong style={{ fontFamily: "monospace" }}>{selectedVoucherRefund.taxVoucherCode}</strong></div>
                <div>کد استرداد: <strong style={{ fontFamily: "monospace" }}>{selectedVoucherRefund.id}</strong></div>
                <div>مشتری: <strong>{selectedVoucherRefund.learnerName}</strong></div>
                <div>موبایل: <strong>{selectedVoucherRefund.learnerPhone}</strong></div>
                <div>دوره: <strong>{selectedVoucherRefund.courseTitle}</strong></div>
                <div>مبلغ عودت: <strong>{selectedVoucherRefund.amountToman.toLocaleString()} تومان</strong></div>
                <div>روش عودت: <strong>{selectedVoucherRefund.refundMethod}</strong></div>
                <div>تاریخ: <strong>{selectedVoucherRefund.createdAt}</strong></div>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#475569", borderTop: "1px dashed #cbd5e1", paddingTop: "0.5rem" }}>
                علت: {selectedVoucherRefund.reason}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                <span>صادرکننده: {selectedVoucherRefund.issuedBy}</span>
                <span>سیستم حسابداری ایندورا</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ چاپ سند رسمی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
