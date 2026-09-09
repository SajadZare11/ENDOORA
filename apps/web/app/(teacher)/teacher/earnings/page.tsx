'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./earnings.module.css";
import {
  fetchTeacherEarningsSummary,
  fetchTeacherPayoutRequests,
  requestTeacherPayout,
  TeacherEarningsSummary,
  TeacherPayoutRequest,
  formatTehranDateOnly,
  formatTehranTimeOnly,
} from "../../../../lib/marketplace";

export default function TeacherEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<TeacherEarningsSummary | null>(null);
  const [payouts, setPayouts] = useState<TeacherPayoutRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Request Payout Modal state
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<number>(100000);
  const [shaba, setShaba] = useState<string>("IR");
  const [bankName, setBankName] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eRes, pRes] = await Promise.all([
        fetchTeacherEarningsSummary(),
        fetchTeacherPayoutRequests(),
      ]);
      setEarnings(eRes.earnings);
      setPayouts(pRes.payouts);
      if (eRes.earnings.available_to_withdraw_toman > 50000) {
        setAmount(eRes.earnings.available_to_withdraw_toman);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات درآمد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShabaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!val.startsWith("IR")) {
      val = "IR" + val.replace(/^IR/, "");
    }
    // Limit to IR + 24 digits = 26 chars
    if (val.length <= 26) {
      setShaba(val);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!earnings || amount > earnings.available_to_withdraw_toman) {
      setFormError("مبلغ درخواستی بیشتر از موجودی در دسترس است.");
      return;
    }
    if (amount < 50000) {
      setFormError("حداقل مبلغ قابل تسویه ۵۰,۰۰۰ تومان است.");
      return;
    }
    if (!/^IR\d{24}$/.test(shaba)) {
      setFormError("شماره شبا باید با IR شروع شده و دارای ۲۴ رقم عددی باشد.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestTeacherPayout({
        amount_toman: amount,
        bank_shaba_number: shaba,
        bank_name: bankName,
        account_holder_name: accountHolder,
      });

      setSuccessMsg(res.message);
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "خطا در ثبت درخواست تسویه.");
    } finally {
      setSubmitting(false);
    }
  };

  const available = earnings?.available_to_withdraw_toman || 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>درآمدها و تسویه مالی مدرس</h1>
        <p className={styles.subtitle}>
          گزارش درآمدهای جلسات برگزار شده، مبالغ امانی، و مدیریت درخواست‌های تسویه بانکی (پایا)
        </p>
      </header>

      {error && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-danger-light, rgba(239, 68, 68, 0.1))", color: "var(--color-danger)", borderRadius: "var(--radius-card)" }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-success-light, rgba(16, 185, 129, 0.1))", color: "var(--color-success)", borderRadius: "var(--radius-card)" }}>
          {successMsg}
        </div>
      )}

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
          <p className={styles.metricLabel}>موجودی کیف پول (آماده تسویه)</p>
          <p className={styles.metricValue} style={{ color: "var(--color-primary)" }}>
            {available.toLocaleString("fa-IR")} تومان
          </p>
          <button
            type="button"
            disabled={available < 50000}
            onClick={() => setShowModal(true)}
            className={styles.payoutButton}
            style={{ marginBlockStart: "var(--space-2)" }}
          >
            <span>🏦</span>
            <span>درخواست تسویه حساب</span>
          </button>
        </div>

        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>نگهداری در حساب امانی (جلسات آتی)</p>
          <p className={styles.metricValue} style={{ color: "var(--color-warning)" }}>
            {(earnings?.held_in_escrow_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            پس از اتمام موفق جلسه بلافاصله به کیف پول منتقل می‌شود
          </p>
        </div>

        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>کل درآمد خالص تسویه شده</p>
          <p className={styles.metricValue} style={{ color: "var(--color-success)" }}>
            {(earnings?.settled_net_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            از مجموع {(earnings?.completed_session_count || 0).toLocaleString("fa-IR")} جلسه برگزار شده
          </p>
        </div>

        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>کارمزد ۱۵٪ پرداختی به پلتفرم</p>
          <p className={styles.metricValue}>
            {(earnings?.platform_fee_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            شامل زیرساخت ویدئوکنفرانس و تضمین مالی
          </p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 800, margin: 0 }}>
            تاریخچه درخواست‌های تسویه بانکی
          </h2>
          <button
            type="button"
            onClick={loadData}
            style={{
              paddingInline: "var(--space-3)",
              paddingBlock: "var(--space-1)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              cursor: "pointer",
              fontSize: "var(--font-size-xs)",
            }}
          >
            بروزرسانی ↻
          </button>
        </div>

        {loading ? (
          <p className={styles.emptyState}>در حال بارگذاری سوابق تسویه...</p>
        ) : payouts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هنوز درخواست تسویه‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>مبلغ (تومان)</th>
                  <th className={styles.th}>شماره شبا</th>
                  <th className={styles.th}>نام بانک / دارنده</th>
                  <th className={styles.th}>وضعیت</th>
                  <th className={styles.th}>تاریخ درخواست</th>
                  <th className={styles.th}>توضیحات مالی</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.td} style={{ fontWeight: 700, direction: "ltr", textAlign: "end" }}>
                      {p.amount_toman.toLocaleString("fa-IR")}
                    </td>
                    <td className={styles.td} style={{ direction: "ltr", fontSize: "var(--font-size-xs)" }}>
                      {p.bank_shaba_number}
                    </td>
                    <td className={styles.td}>
                      {p.bank_name ? `${p.bank_name} - ` : ""}{p.account_holder_name || "-"}
                    </td>
                    <td className={styles.td}>
                      {p.status === "paid" ? (
                        <span className={styles.badgePaid}>واریز شد ✓</span>
                      ) : p.status === "approved" ? (
                        <span className={styles.badgePaid}>تایید شده / نوبت پایا</span>
                      ) : p.status === "rejected" ? (
                        <span className={styles.badgeRejected}>رد شد ✕</span>
                      ) : (
                        <span className={styles.badgePending}>در نوبت بررسی</span>
                      )}
                    </td>
                    <td className={styles.td} style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                      {formatTehranDateOnly(p.created_at)}
                    </td>
                    <td className={styles.td} style={{ fontSize: "var(--font-size-xs)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.status === "rejected" ? (
                        <span style={{ color: "var(--color-danger)" }}>علت رد: {p.rejection_reason}</span>
                      ) : (
                        p.admin_notes || "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: 800 }}>
                ثبت درخواست تسویه حساب به شماره شبا
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ padding: "var(--space-3)", background: "var(--color-danger-light, rgba(239, 68, 68, 0.1))", color: "var(--color-danger)", borderRadius: "var(--radius-sm)", fontSize: "var(--font-size-xs)" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handlePayoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                  مبلغ درخواستی (تومان):
                </label>
                <input
                  type="number"
                  min={50000}
                  max={available}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))}
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                    direction: "ltr",
                    textAlign: "end",
                  }}
                  required
                />
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  سقف قابل برداشت: {available.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                  شماره شبا حساب بانکی (۲۴ رقم پس از IR):
                </label>
                <input
                  type="text"
                  value={shaba}
                  onChange={handleShabaChange}
                  placeholder="IR000000000000000000000000"
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                    direction: "ltr",
                    fontFamily: "monospace",
                  }}
                  required
                />
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  طول شبا: {shaba.length}/26 کاراکتر
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                  نام و نام خانوادگی دارنده حساب:
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="منطبق با کارت ملی"
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                  نام بانک عامل:
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="مثال: بانک ملی، سامان، ملت، پاسارگاد"
                  style={{
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginBlockStart: "var(--space-2)" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.payoutButton}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {submitting ? "در حال ثبت درخواست..." : "ثبت و ارسال به واحد مالی"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    paddingInline: "var(--space-4)",
                    paddingBlock: "var(--space-2)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    cursor: "pointer",
                  }}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
