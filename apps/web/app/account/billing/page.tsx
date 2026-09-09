'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./billing.module.css";
import {
  fetchBillingInvoices,
  PaymentTransaction,
  formatTehranDateOnly,
  formatTehranTimeOnly,
} from "../../../lib/marketplace";

export default function AccountBillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<PaymentTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Selected receipt modal
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentTransaction | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBillingInvoices();
      setInvoices(res.invoices);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت لیست صورت‌حساب‌ها.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>صورت‌حساب‌ها و رسیدهای رسمی</h1>
        <p className={styles.subtitle}>
          سوابق پرداخت‌های آنلاین شاپرک، فاکتورهای رزرو جلسات و خرید اشتراک
        </p>
      </header>

      {error && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-danger-light, rgba(239, 68, 68, 0.1))", color: "var(--color-danger)", borderRadius: "var(--radius-card)" }}>
          {error}
        </div>
      )}

      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 800, margin: 0 }}>
            فهرست فاکتورها و پرداخت‌ها
          </h2>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link
              href="/account/wallet"
              style={{
                paddingInline: "var(--space-3)",
                paddingBlock: "var(--space-1)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                fontSize: "var(--font-size-xs)",
                textDecoration: "none",
                color: "var(--color-text-primary)",
              }}
            >
              مشاهده کیف پول →
            </Link>
            <button
              type="button"
              onClick={loadInvoices}
              style={{
                paddingInline: "var(--space-3)",
                paddingBlock: "var(--space-1)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                fontSize: "var(--font-size-xs)",
                cursor: "pointer",
              }}
            >
              بروزرسانی ↻
            </button>
          </div>
        </div>

        {loading ? (
          <p className={styles.emptyState}>در حال بارگذاری صورت‌حساب‌ها...</p>
        ) : invoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هنوز فاکتور یا پرداختی برای حساب کاربری شما ثبت نشده است.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>نوع سفارش</th>
                  <th className={styles.th}>درگاه / شیوه</th>
                  <th className={styles.th}>مبلغ (تومان)</th>
                  <th className={styles.th}>وضعیت</th>
                  <th className={styles.th}>شماره مرجع (RefID)</th>
                  <th className={styles.th}>تاریخ ثبت</th>
                  <th className={styles.th}>رسید رسمی</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>
                      {inv.order_type_display || inv.order_type}
                    </td>
                    <td className={styles.td}>
                      {inv.gateway_provider_display || inv.gateway_provider}
                      {inv.is_sandbox && " (سندباکس)"}
                    </td>
                    <td className={styles.td} style={{ direction: "ltr", textAlign: "end", fontWeight: 700 }}>
                      {inv.amount_toman.toLocaleString("fa-IR")}
                    </td>
                    <td className={styles.td}>
                      {inv.status === "paid" ? (
                        <span className={styles.badgeSuccess}>پرداخت موفق</span>
                      ) : inv.status === "pending" ? (
                        <span className={styles.badgePending}>در انتظار</span>
                      ) : (
                        <span className={styles.badgeFailed}>ناموفق</span>
                      )}
                    </td>
                    <td className={styles.td} style={{ direction: "ltr", fontSize: "var(--font-size-xs)" }}>
                      {inv.ref_id || "-"}
                    </td>
                    <td className={styles.td} style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                      {formatTehranDateOnly(inv.created_at)}
                    </td>
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className={styles.viewReceiptBtn}
                      >
                        مشاهده فاکتور 🧾
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formal Receipt Modal */}
      {selectedInvoice && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBlockEnd: "1px solid var(--color-border)", paddingBlockEnd: "var(--space-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span style={{ fontSize: "1.5rem" }}>🧾</span>
                <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: 800 }}>
                  رسید دیجیتال پلتفرم اندورا
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--font-size-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>شناسه تراکنش:</span>
                <span style={{ direction: "ltr", fontWeight: 600 }}>{selectedInvoice.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>نوع سفارش:</span>
                <span style={{ fontWeight: 700 }}>{selectedInvoice.order_type_display}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>مبلغ پرداخت شده:</span>
                <span style={{ fontWeight: 800, color: "var(--color-primary)" }}>
                  {selectedInvoice.amount_toman.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>شماره مرجع شاپرک (RefID):</span>
                <span style={{ direction: "ltr", fontWeight: 700 }}>{selectedInvoice.ref_id || "-"}</span>
              </div>
              {selectedInvoice.card_pan && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>شماره کارت:</span>
                  <span style={{ direction: "ltr" }}>{selectedInvoice.card_pan}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>زمان ثبت:</span>
                <span>
                  {formatTehranDateOnly(selectedInvoice.created_at)} ساعت {formatTehranTimeOnly(selectedInvoice.created_at)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>وضعیت:</span>
                <span style={{ fontWeight: 700, color: selectedInvoice.status === "paid" ? "var(--color-success)" : "var(--color-danger)" }}>
                  {selectedInvoice.status_display}
                </span>
              </div>
              {selectedInvoice.description && (
                <p style={{ margin: 0, padding: "var(--space-2)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-sm)", fontSize: "var(--font-size-xs)" }}>
                  {selectedInvoice.description}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  flex: 1,
                  paddingBlock: "var(--space-2)",
                  borderRadius: "var(--radius-card)",
                  border: "none",
                  background: "var(--color-primary)",
                  color: "var(--color-text-on-primary, var(--color-surface))",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                چاپ فاکتور 🖨️
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                style={{
                  paddingInline: "var(--space-4)",
                  paddingBlock: "var(--space-2)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  cursor: "pointer",
                }}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
