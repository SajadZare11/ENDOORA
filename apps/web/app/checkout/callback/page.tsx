'use client';

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./callback.module.css";
import { verifyCheckoutPayment, CheckoutVerifyResult } from "../../../lib/marketplace";

function CallbackContent() {
  const searchParams = useSearchParams();

  const authority = searchParams.get("Authority") || searchParams.get("authority") || "";
  const initialStatus = searchParams.get("Status") || searchParams.get("status") || "OK";
  const isWallet = searchParams.get("wallet") === "true";
  const isSandbox = searchParams.get("sandbox") === "true";
  const transactionId = searchParams.get("transaction_id") || "";
  const orderType = searchParams.get("order_type") || "";
  const bookingIdParam = searchParams.get("booking_id") || "";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CheckoutVerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (isWallet) {
        // Wallet payment already finalized server-side
        setResult({
          transaction_id: transactionId,
          status: "paid",
          amount_toman: 0,
          order_type: orderType,
          booking_id: bookingIdParam,
          already_verified: true,
        });
        setLoading(false);
        return;
      }

      if (!authority) {
        setError("کد شناسه پرداخت یافت نشد.");
        setLoading(false);
        return;
      }

      try {
        const verifyRes = await verifyCheckoutPayment({
          authority,
          status: initialStatus,
        });
        setResult(verifyRes.result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "خطا در بررسی نتیجه پرداخت.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [authority, initialStatus, isWallet, transactionId, orderType, bookingIdParam]);

  const handleSimulateStatus = async (simulateStatus: string) => {
    if (!authority) return;
    setLoading(true);
    setError(null);
    try {
      const verifyRes = await verifyCheckoutPayment({
        authority,
        status: simulateStatus,
      });
      setResult(verifyRes.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در تست نتیجه پرداخت.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.receiptCard}>
          <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>⏳</div>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>در حال استعلام از شبکه شاپرک...</h1>
            <p className={styles.subtitle}>لطفاً صفحه را نبندید و منتظر دریافت رسید نهایی بمانید.</p>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = result?.status === "paid";
  const refId = result?.ref_id || "پرداخت مستقیم کیف پول";
  const bookingId = result?.booking_id || bookingIdParam;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.receiptCard} ${
          isSuccess ? styles.receiptCardSuccess : styles.receiptCardFailed
        }`}
      >
        <div
          className={`${styles.iconWrapper} ${
            isSuccess ? styles.iconSuccess : styles.iconFailed
          }`}
        >
          {isSuccess ? "✓" : "✕"}
        </div>

        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            {isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
          </h1>
          <p className={styles.subtitle}>
            {isSuccess
              ? "سفارش شما با موفقیت در سیستم اندورا ثبت و فعال گردید."
              : error || result?.error || "تراکنش توسط کاربر لغو شد یا درگاه بانکی تراکنش را تایید نکرد."}
          </p>
        </div>

        {/* Developer Sandbox Switcher */}
        {isSandbox && authority && (
          <div className={styles.sandboxBox}>
            <div className={styles.sandboxHeader}>🛠️ پنل شبیه‌ساز توسعه‌دهندگان (Sandbox Control)</div>
            <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              در محیط سندباکس می‌توانید نتیجه بازگشت از درگاه را تغییر دهید:
            </p>
            <div className={styles.sandboxButtons}>
              <button
                type="button"
                onClick={() => handleSimulateStatus("OK")}
                style={{
                  paddingInline: "var(--space-3)",
                  paddingBlock: "var(--space-1)",
                  fontSize: "var(--font-size-xs)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-success)",
                  color: "var(--color-text-on-primary, var(--color-surface))",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                شبیه‌سازی پرداخت موفق (Status=OK)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateStatus("NOK")}
                style={{
                  paddingInline: "var(--space-3)",
                  paddingBlock: "var(--space-1)",
                  fontSize: "var(--font-size-xs)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-danger)",
                  color: "var(--color-text-on-primary, var(--color-surface))",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                شبیه‌سازی انصراف / خطا (Status=NOK)
              </button>
            </div>
          </div>
        )}

        {/* Details List */}
        <div className={styles.detailsList}>
          {result?.amount_toman ? (
            <div className={styles.detailRow}>
              <span>مبلغ پرداختی:</span>
              <span className={styles.detailValue}>
                {result.amount_toman.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          ) : null}

          <div className={styles.detailRow}>
            <span>شماره پیگیری / مرجع شاپرک (RefID):</span>
            <span className={styles.detailValue} style={{ direction: "ltr" }}>
              {refId}
            </span>
          </div>

          {result?.card_pan && (
            <div className={styles.detailRow}>
              <span>شماره کارت پرداخت‌کننده:</span>
              <span className={styles.detailValue} style={{ direction: "ltr" }}>
                {result.card_pan}
              </span>
            </div>
          )}

          {authority && (
            <div className={styles.detailRow}>
              <span>شناسه یکتای درگاه (Authority):</span>
              <span
                className={styles.detailValue}
                style={{ direction: "ltr", fontSize: "var(--font-size-xs)" }}
              >
                {authority}
              </span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span>وضعیت نهایی:</span>
            <span
              style={{
                fontWeight: 700,
                color: isSuccess ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {isSuccess ? "تایید شده و ثبت در سامانه" : "ناموفق / لغو شده"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {isSuccess && bookingId && (
            <Link href={`/bookings/${bookingId}`} className={styles.primaryButton}>
              <span>مشاهده و ورود به جلسه رزرو شده</span>
              <span>←</span>
            </Link>
          )}

          {isSuccess && !bookingId && (
            <Link href="/account/wallet" className={styles.primaryButton}>
              <span>مشاهده کیف پول و تراکنش‌ها</span>
              <span>←</span>
            </Link>
          )}

          {!isSuccess && (
            <Link href="/checkout" className={styles.primaryButton}>
              <span>تلاش مجدد برای پرداخت</span>
              <span>↻</span>
            </Link>
          )}

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button
              type="button"
              onClick={handlePrint}
              className={styles.secondaryButton}
              style={{ flex: 1 }}
            >
              <span>🖨️ چاپ و ذخیره رسید</span>
            </button>
            <Link
              href="/account/billing"
              className={styles.secondaryButton}
              style={{ flex: 1 }}
            >
              <span>سوابق صورت‌حساب‌ها</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
          در حال بارگذاری رسید پرداخت...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
