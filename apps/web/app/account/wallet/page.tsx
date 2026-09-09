'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./wallet.module.css";
import {
  fetchUserWallet,
  fetchWalletTransactions,
  UserWallet,
  WalletTransaction,
  formatTehranDateOnly,
  formatTehranTimeOnly,
} from "../../../lib/marketplace";

export default function UserWalletPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Top-up modal state
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(100000);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wRes, txRes] = await Promise.all([
        fetchUserWallet(),
        fetchWalletTransactions(),
      ]);
      setWallet(wRes.wallet);
      setTransactions(txRes.transactions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات کیف پول.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isDepositType = (type: string) => {
    return ["deposit", "refund", "escrow_release"].includes(type);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>کیف پول کاربری</h1>
        <p className={styles.subtitle}>
          مدیریت موجودی ریالی، پرداخت سریع جلسات و مشاهده تاریخچه تراکنش‌های مالی
        </p>
      </header>

      {error && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-danger-light, rgba(239, 68, 68, 0.1))", color: "var(--color-danger)", borderRadius: "var(--radius-card)" }}>
          {error}
        </div>
      )}

      {/* Balance Summary Cards */}
      <div className={styles.balanceGrid}>
        <div className={`${styles.balanceCard} ${styles.balanceCardPrimary}`}>
          <p className={styles.balanceLabel}>موجودی کل کیف پول</p>
          <p className={styles.balanceValue}>
            {(wallet?.balance_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <div className={styles.balanceActions}>
            <button
              type="button"
              onClick={() => setShowTopup(true)}
              className={styles.topupButton}
            >
              <span>+</span>
              <span>افزایش موجودی (شارژ آنلاین)</span>
            </button>
          </div>
        </div>

        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>موجودی در دسترس</p>
          <p className={styles.balanceValue} style={{ color: "var(--color-success)" }}>
            {(wallet?.available_balance_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            قابل استفاده برای رزرو آنی بدون نیاز به درگاه بانکی
          </p>
        </div>

        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>مسدود شده در حساب امانی</p>
          <p className={styles.balanceValue} style={{ color: "var(--color-warning)" }}>
            {(wallet?.locked_toman || 0).toLocaleString("fa-IR")} تومان
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            مبالغ جلسات آینده در انتظار برگزاری
          </p>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 800, margin: 0 }}>
            ریز تراکنش‌های حساب
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
            بروزرسانی لیست ↻
          </button>
        </div>

        {loading ? (
          <p className={styles.emptyState}>در حال دریافت تاریخچه تراکنش‌ها...</p>
        ) : transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هنوز تراکنشی در کیف پول شما ثبت نشده است.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>نوع تراکنش</th>
                  <th className={styles.th}>مبلغ (تومان)</th>
                  <th className={styles.th}>موجودی پس از تراکنش</th>
                  <th className={styles.th}>کد پیگیری</th>
                  <th className={styles.th}>شرح تراکنش</th>
                  <th className={styles.th}>تاریخ و ساعت</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isDeposit = isDepositType(tx.transaction_type);
                  return (
                    <tr key={tx.id}>
                      <td className={styles.td}>
                        <span
                          className={`${styles.badge} ${
                            isDeposit ? styles.badgePositive : styles.badgeNegative
                          }`}
                        >
                          {tx.transaction_type_display || tx.transaction_type}
                        </span>
                      </td>
                      <td
                        className={styles.td}
                        style={{
                          fontWeight: 700,
                          color: isDeposit ? "var(--color-success)" : "var(--color-danger)",
                          direction: "ltr",
                          textAlign: "end",
                        }}
                      >
                        {isDeposit ? "+" : "-"}
                        {tx.amount_toman.toLocaleString("fa-IR")}
                      </td>
                      <td className={styles.td} style={{ direction: "ltr", textAlign: "end" }}>
                        {tx.balance_after_toman.toLocaleString("fa-IR")}
                      </td>
                      <td className={styles.td} style={{ direction: "ltr", fontSize: "var(--font-size-xs)" }}>
                        {tx.tracking_code}
                      </td>
                      <td className={styles.td} style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {tx.description || "-"}
                      </td>
                      <td className={styles.td} style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                        {formatTehranDateOnly(tx.created_at)} ساعت {formatTehranTimeOnly(tx.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Topup Modal */}
      {showTopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: 800 }}>
                شارژ آنلاین کیف پول
              </h3>
              <button
                type="button"
                onClick={() => setShowTopup(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              مبلغ مورد نظر خود را وارد کنید یا یکی از مقادیر پیش‌فرض را انتخاب نمایید:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>مبلغ شارژ (تومان):</label>
              <input
                type="number"
                min={10000}
                step={50000}
                value={topupAmount}
                onChange={(e) => setTopupAmount(Math.max(10000, parseInt(e.target.value || "0", 10)))}
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-lg)",
                  direction: "ltr",
                  textAlign: "end",
                }}
              />
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {[100000, 200000, 500000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTopupAmount(preset)}
                    style={{
                      paddingInline: "var(--space-3)",
                      paddingBlock: "var(--space-1)",
                      fontSize: "var(--font-size-xs)",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--color-border)",
                      background: topupAmount === preset ? "var(--color-primary)" : "var(--color-surface)",
                      color: topupAmount === preset ? "var(--color-text-on-primary, var(--color-surface))" : "var(--color-text-primary)",
                      cursor: "pointer",
                    }}
                  >
                    {preset.toLocaleString("fa-IR")} تومان
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
              <Link
                href={`/checkout?order_type=wallet_topup&amount=${topupAmount}`}
                className={styles.topupButton}
                style={{ flex: 1, justifyContent: "center" }}
              >
                انتقال به درگاه پرداخت
              </Link>
              <button
                type="button"
                onClick={() => setShowTopup(false)}
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
          </div>
        </div>
      )}
    </div>
  );
}
