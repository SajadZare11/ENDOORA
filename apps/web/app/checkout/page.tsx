"use client";

import { Button, Input } from "@endoora/ui";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./checkout.module.css";
import {
  fetchUserWallet,
  initiateCheckout,
  UserWallet,
  SessionBooking,
  PlatformPricingPlan,
  fetchPublicPricingPlans,
  formatTehranDateOnly,
  formatTehranTimeOnly,
} from "../../lib/marketplace";
import { endooraApi } from "../../lib/endoora-api";

const FALLBACK_GOLDEN_PLANS: Record<string, PlatformPricingPlan> = {
  golden_1m: {
    id: "golden_1m",
    code: "golden_1m",
    name_fa: "اشتراک طلایی ۱ ماهه",
    name_en: "1-Month Golden Plan",
    duration_days: 30,
    price_toman: 299000,
    price_toman_number: 299000,
    is_active: true,
    is_featured: false,
    features_fa: ["دسترسی کامل و نامحدود به تمامی امکانات پلتفرم"],
    note_fa: "دسترسی نامحدود ۳۰ روزه به تمام بخش‌های سایت",
    note_en: "30-day full access to all platform features",
    created_at: "2026-11-12T00:00:00Z",
    updated_at: "2026-11-12T00:00:00Z",
  },
  golden_3m: {
    id: "golden_3m",
    code: "golden_3m",
    name_fa: "اشتراک طلایی ۳ ماهه (پیشنهاد ویژه)",
    name_en: "3-Month Golden Plan",
    duration_days: 90,
    price_toman: 799000,
    price_toman_number: 799000,
    is_active: true,
    is_featured: true,
    features_fa: ["دسترسی کامل و نامحدود به تمامی امکانات پلتفرم", "۱۱٪ صرفه‌جویی اقتصادی"],
    note_fa: "محبوب‌ترین پلن با ۱۱٪ تخفیف",
    note_en: "Most popular 90-day plan with 11% savings",
    created_at: "2026-11-12T00:00:00Z",
    updated_at: "2026-11-12T00:00:00Z",
  },
  golden_6m: {
    id: "golden_6m",
    code: "golden_6m",
    name_fa: "اشتراک طلایی ۶ ماهه (بیشترین صرفه)",
    name_en: "6-Month Golden Plan",
    duration_days: 180,
    price_toman: 1699000,
    price_toman_number: 1699000,
    is_active: true,
    is_featured: false,
    features_fa: ["دسترسی کامل و نامحدود به تمامی امکانات پلتفرم", "بیشترین صرفه اقتصادی"],
    note_fa: "بیشترین صرفه اقتصادی با ۱۵٪ تخفیف کل دوره",
    note_en: "Best value 180-day plan with 15% savings",
    created_at: "2026-11-12T00:00:00Z",
    updated_at: "2026-11-12T00:00:00Z",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderType = (searchParams.get("order_type") || "booking_session") as
    | "booking_session"
    | "subscription_plan"
    | "wallet_topup";
  const orderId = searchParams.get("order_id") || "";
  const planId = searchParams.get("plan_id") || orderId;
  const initialAmount = parseInt(searchParams.get("amount") || "0", 10);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [booking, setBooking] = useState<SessionBooking | null>(null);
  const [plan, setPlan] = useState<PlatformPricingPlan | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(initialAmount || 100000);

  const [selectedGateway, setSelectedGateway] = useState<"wallet" | "zarinpal" | "sandbox">("sandbox");

  // Coupon & Promo state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmountToman: number;
    description?: string;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch user wallet
        try {
          const wRes = await fetchUserWallet();
          setWallet(wRes.wallet);
        } catch {
          // If not logged in or wallet not initialized yet
        }

        // 2. Fetch order context
        if (orderType === "booking_session" && orderId) {
          try {
            const bRes = await endooraApi<SessionBooking>(`/api/marketplace/bookings/${orderId}/`);
            setBooking(bRes);
          } catch {
            setError("اطلاعات جلسه رزرو شده یافت نشد یا دسترسی غیرمجاز است.");
          }
        } else if (orderType === "subscription_plan") {
          try {
            const plansRes = await fetchPublicPricingPlans();
            const found = plansRes.plans.find((p) => p.id === planId || p.code === planId);
            if (found) {
              setPlan(found);
            } else if (FALLBACK_GOLDEN_PLANS[planId]) {
              setPlan(FALLBACK_GOLDEN_PLANS[planId]);
            } else if (plansRes.plans.length > 0) {
              setPlan(plansRes.plans[0]);
            }
          } catch {
            if (FALLBACK_GOLDEN_PLANS[planId]) {
              setPlan(FALLBACK_GOLDEN_PLANS[planId]);
            } else {
              setError("اطلاعات پلن اشتراک دریافت نشد.");
            }
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات سفارش.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [orderType, orderId, planId]);

  // Compute base and final payable amount
  let baseAmountToman = 0;
  let itemName = "سفارش ایندورا";
  let itemDescription = "";

  if (orderType === "booking_session") {
    baseAmountToman = booking ? parseInt(String(booking.rate_toman), 10) : 0;
    itemName = booking
      ? `رزرو جلسه ${booking.duration_minutes} دقیقه‌ای ${booking.target_skill}`
      : "رزرو جلسه آموزشی";
    itemDescription = booking
      ? `زمان: ${formatTehranDateOnly(booking.scheduled_start)} ساعت ${formatTehranTimeOnly(booking.scheduled_start)}`
      : "";
  } else if (orderType === "subscription_plan") {
    baseAmountToman = plan ? plan.price_toman_number : 420000;
    itemName = plan ? plan.name_fa : "اشتراک پرمیوم پلتفرم";
    itemDescription = plan ? `${plan.duration_days} روز دسترسی نامحدود به تمامی امکانات هوشمند` : "";
  } else if (orderType === "wallet_topup") {
    baseAmountToman = topupAmount;
    itemName = "شارژ کیف پول کاربری ایندورا";
    itemDescription = "مبلغ بلافاصله پس از پرداخت به موجودی حساب شما افزوده می‌شود.";
  }

  const discountAmountToman = appliedCoupon ? appliedCoupon.discountAmountToman : 0;
  const payableAmountToman = Math.max(0, baseAmountToman - discountAmountToman);
  const payableAmountRial = payableAmountToman * 10;
  const walletBalance = wallet ? wallet.available_balance_toman : 0;
  const hasSufficientWallet = walletBalance >= payableAmountToman && payableAmountToman > 0;

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const scope =
        orderType === "subscription_plan"
          ? "subscription"
          : orderType === "booking_session"
          ? "session_1on1"
          : "all";
      const res = await fetch("/api/marketing/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          basketAmountToman: baseAmountToman,
          scope,
          userPhone: (wallet as { phone?: string })?.phone || undefined,
        }),
      });
      const json = await res.json();
      if (json.valid) {
        setAppliedCoupon({
          code: json.couponCode,
          discountAmountToman: json.discountAmountToman,
          description: json.description,
        });
        setCouponMessage({
          type: "success",
          text: `کد تخفیف ${json.couponCode} با موفقیت اعمال شد (${json.discountAmountToman.toLocaleString(
            "fa-IR"
          )} تومان تخفیف)`,
        });
      } else {
        setAppliedCoupon(null);
        setCouponMessage({ type: "error", text: json.error || "کد تخفیف وارد شده نامعتبر است." });
      }
    } catch {
      setCouponMessage({ type: "error", text: "خطا در برقراری ارتباط با سامانه اعتبارسنجی تخفیف." });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponMessage(null);
  };

  const handlePay = async () => {
    if (payableAmountToman <= 0) {
      setError("مبلغ قابل پرداخت معتبر نیست.");
      return;
    }

    setPaying(true);
    setError(null);

    try {
      const res = await initiateCheckout({
        order_type: orderType,
        order_id: orderType === "booking_session" ? orderId : orderType === "subscription_plan" ? (plan?.id || planId) : undefined,
        amount_toman: payableAmountToman,
        gateway_provider: selectedGateway,
        callback_url: "/checkout/callback",
      });

      const { checkout } = res;

      if (checkout.paid_via_wallet) {
        // 1-Click pay succeeded immediately
        router.push(
          `/checkout/callback?status=OK&wallet=true&transaction_id=${checkout.transaction_id}&order_type=${orderType}&booking_id=${orderId}`
        );
      } else if (checkout.payment_url) {
        // Redirect to gateway or sandbox callback
        window.location.assign(checkout.payment_url);
      } else {
        router.push(
          `/checkout/callback?Authority=${checkout.authority}&Status=OK&sandbox=true`
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با درگاه پرداخت.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
            در حال بارگذاری اطلاعات سبد خرید و درگاه پرداخت...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>تسویه حساب و پرداخت امن</h1>
        <p className={styles.subtitle}>
          انتخاب شیوه پرداخت با تضمین حساب امانی و اتصال به شبکه پرداخت شاپرک
        </p>
      </header>

      {error && <div className={styles.alertBox}>{error}</div>}

      <div className={styles.grid}>
        {/* Order Details & Summary Column */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span>
            <span>مشخصات سفارش</span>
          </h2>

          <div className={styles.orderItem}>
            <div className={styles.itemHeader}>
              <h3 className={styles.itemName}>{itemName}</h3>
            </div>
            {itemDescription && <p className={styles.itemMeta}>{itemDescription}</p>}
          </div>

          {orderType === "wallet_topup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <label style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                مبلغ شارژ (تومان):
              </label>
              <Input
                type="number"
                min={10000}
                step={50000}
                value={topupAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopupAmount(Math.max(10000, parseInt(e.target.value || "0", 10)))}
                style={{
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-base)",
                  direction: "ltr",
                  textAlign: "end",
                }}
              />
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {[100000, 200000, 500000, 1000000].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={topupAmount === preset ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setTopupAmount(preset)}
                  >
                    {preset.toLocaleString("fa-IR")} تومان
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          {orderType !== "wallet_topup" && (
            <div style={{ marginTop: "1rem", marginBottom: "1rem", padding: "1rem", background: "var(--color-bg-subtle, #f8fafc)", borderRadius: "10px", border: "1px dashed var(--color-border, #cbd5e1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text, #0f172a)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>🎟️</span> کد تخفیف یا معرف دارید؟
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{ background: "transparent", border: "none", color: "#b91c1c", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    ✕ حذف کوپن
                  </button>
                )}
              </div>

              {!appliedCoupon ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="مثال: GOLDEN30 یا ALI-FRIEND"
                    dir="ltr"
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                    }}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={couponLoading || !couponCodeInput.trim()}
                    onClick={handleApplyCoupon}
                  >
                    {couponLoading ? "بررسی..." : "اعمال کد"}
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.5rem 0.75rem", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: "#047857", fontWeight: 800 }}>✓ کد {appliedCoupon.code}</span>
                    <span style={{ fontSize: "0.75rem", color: "#065f46" }}>({appliedCoupon.discountAmountToman.toLocaleString("fa-IR")} تومان کسر شد)</span>
                  </div>
                </div>
              )}

              {couponMessage && (
                <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.75rem", color: couponMessage.type === "success" ? "#047857" : "#b91c1c", fontWeight: 600 }}>
                  {couponMessage.text}
                </p>
              )}
            </div>
          )}

          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>مبلغ پایه سفارش:</span>
              <span className={styles.priceValue}>{baseAmountToman.toLocaleString("fa-IR")} تومان</span>
            </div>

            {appliedCoupon && (
              <div className={styles.priceRow} style={{ color: "#047857" }}>
                <span>تخفیف اعمال‌شده ({appliedCoupon.code}):</span>
                <span className={styles.priceValue} style={{ color: "#047857", fontWeight: 700 }}>
                  -{appliedCoupon.discountAmountToman.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            )}

            <div className={styles.priceRow}>
              <span>معادل ریالی درگاه شاپرک:</span>
              <span className={styles.priceValue}>{payableAmountRial.toLocaleString("fa-IR")} ریال</span>
            </div>
            <div className={styles.priceRow}>
              <span>مالیات و کارمزد درگاه:</span>
              <span style={{ color: "var(--color-success)", fontWeight: 700 }}>رایگان (به عهده پلتفرم)</span>
            </div>
            <div className={styles.priceRowBold}>
              <span>مبلغ نهایی قابل پرداخت:</span>
              <span style={{ color: "var(--color-primary)" }}>
                {payableAmountToman.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <p className={styles.currencyNote}>
              * کلیه مبالغ در پلتفرم ایندورا به تومان است. ارسال مبالغ به درگاه‌های بانکی شاپرک طبق قانون به ریال محاسبه می‌شود.
            </p>
          </div>

          {/* Escrow Trust Guarantee */}
          {orderType === "booking_session" && (
            <div className={styles.escrowBanner}>
              <span className={styles.escrowIcon}>🛡️</span>
              <div className={styles.escrowText}>
                <h4 className={styles.escrowTitle}>تضمین امن پرداخت امانی (Escrow Settlement)</h4>
                <p className={styles.escrowDesc}>
                  مبلغ پرداختی شما تا اتمام موفقیت‌آمیز جلسه آموزشی و اعلام رضایت در حساب امن امانی ایندورا نگهداری می‌شود و سپس به استاد تسویه خواهد شد. در صورت بروز هرگونه مشکل یا لغو کلاس، وجه بلافاصله مسترد می‌گردد.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Selector Column */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <span>💳</span>
            <span>انتخاب روش پرداخت</span>
          </h2>

          <div className={styles.paymentOptions}>
            {/* Wallet 1-Click Pay Option */}
            {orderType !== "wallet_topup" && (
              <label
                className={`${styles.methodCard} ${
                  selectedGateway === "wallet" ? styles.methodCardSelected : ""
                } ${!hasSufficientWallet ? styles.methodCardDisabled : ""}`}
              >
                <Input
                  type="radio"
                  name="gateway"
                  value="wallet"
                  disabled={!hasSufficientWallet}
                  checked={selectedGateway === "wallet"}
                  onChange={() => setSelectedGateway("wallet")}
                  className={styles.methodRadio}
                />
                <div className={styles.methodBody}>
                  <div className={styles.methodTitle}>
                    <span>کیف پول کاربری ایندورا</span>
                    <span
                      className={`${styles.walletBadge} ${
                        hasSufficientWallet ? styles.walletBadgeOk : styles.walletBadgeLow
                      }`}
                    >
                      موجودی: {walletBalance.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <p className={styles.methodDesc}>
                    {hasSufficientWallet
                      ? "پرداخت آنی ۱ کلیکه بدون نیاز به ورود به درگاه بانکی و دریافت رمز پویا."
                      : "موجودی کیف پول برای این پرداخت کافی نیست. می‌توانید ابتدا کیف پول خود را شارژ کنید."}
                  </p>
                </div>
              </label>
            )}

            {/* Sandbox Developer Gateway */}
            <label
              className={`${styles.methodCard} ${
                selectedGateway === "sandbox" ? styles.methodCardSelected : ""
              }`}
            >
              <Input
                type="radio"
                name="gateway"
                value="sandbox"
                checked={selectedGateway === "sandbox"}
                onChange={() => setSelectedGateway("sandbox")}
                className={styles.methodRadio}
              />
              <div className={styles.methodBody}>
                <div className={styles.methodTitle}>
                  <span>درگاه آزمایشی توسعه‌دهندگان (Sandbox)</span>
                  <span className={styles.walletBadge}>تست فوری</span>
                </div>
                <p className={styles.methodDesc}>
                  شبیه‌سازی کامل فرآیند خرید، پرداخت موفق و برگشت رسید شاپرک بدون کسر واقعی پول از حساب بانکی.
                </p>
              </div>
            </label>

            {/* ZarinPal Gateway */}
            <label
              className={`${styles.methodCard} ${
                selectedGateway === "zarinpal" ? styles.methodCardSelected : ""
              }`}
            >
              <Input
                type="radio"
                name="gateway"
                value="zarinpal"
                checked={selectedGateway === "zarinpal"}
                onChange={() => setSelectedGateway("zarinpal")}
                className={styles.methodRadio}
              />
              <div className={styles.methodBody}>
                <div className={styles.methodTitle}>
                  <span>درگاه زرین‌پال / شاپرک</span>
                  <span className={styles.walletBadge}>کارت‌های عضو شتاب</span>
                </div>
                <p className={styles.methodDesc}>
                  پرداخت مستقیم آنلاین از طریق کلیه کارت‌های بانکی کشور با اتصال امن SSL به سوئیچ شاپرک.
                </p>
              </div>
            </label>
          </div>

          <Button type="button" variant="primary" loading={paying} onClick={handlePay} disabled={paying || payableAmountToman <= 0} className={styles.payButton}>
            {paying ? (
              <span>در حال اتصال به درگاه...</span>
            ) : selectedGateway === "wallet" ? (
              <span>تایید و کسر از موجودی کیف پول</span>
            ) : (
              <span>انتقال به درگاه امن پرداخت</span>
            )}
          </Button>

          <div className={styles.securityNote}>
            <span>🔒</span>
            <span>پرداخت تحت بستر پروتکل رمزنگاری امن SSL و مطابق استانداردهای شاپرک بانک مرکزی</span>
          </div>

          <div style={{ textAlign: "center", marginBlockStart: "var(--space-2)" }}>
            <Link
              href={orderType === "booking_session" && orderId ? `/bookings/${orderId}` : "/account"}
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-secondary)",
                textDecoration: "underline",
              }}
            >
              انصراف و بازگشت به صفحه قبلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
          در حال بارگذاری صفحه پرداخت...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}