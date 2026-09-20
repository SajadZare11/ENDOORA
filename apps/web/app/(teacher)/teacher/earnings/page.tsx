'use client';

import { Button, Input, Table } from "@endoora/ui";

import React, { useEffect, useState } from "react";
import styles from "./earnings.module.css";
import {
  fetchTeacherLedgerBalances,
  fetchTeacherStatement,
  fetchTeacherLedgerPayouts,
  fetchTeacherTaxIdentity,
  updateTeacherTaxIdentity,
  submitLedgerPayoutRequest,
  TeacherLedgerBalance,
  TeacherStatement,
  TeacherTaxIdentity,
  LedgerPayoutRequestItem,
  formatTehranDateOnly,
  formatTehranTimeOnly,
} from "../../../../lib/marketplace";

export default function TeacherEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"statement" | "payouts" | "tax">("statement");
  const [balances, setBalances] = useState<TeacherLedgerBalance | null>(null);
  const [statement, setStatement] = useState<TeacherStatement | null>(null);
  const [payouts, setPayouts] = useState<LedgerPayoutRequestItem[]>([]);
  const [taxIdentity, setTaxIdentity] = useState<TeacherTaxIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Request Payout Modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(50000);
  const [shaba, setShaba] = useState<string>("IR");
  const [bankName, setBankName] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [payoutFormError, setPayoutFormError] = useState<string | null>(null);

  // Tax Identity Edit Modal state
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [nationalIdInput, setNationalIdInput] = useState("");
  const [taxFileInput, setTaxFileInput] = useState("");
  const [isTaxExemptInput, setIsTaxExemptInput] = useState(false);
  const [taxShabaInput, setTaxShabaInput] = useState("");
  const [taxBankNameInput, setTaxBankNameInput] = useState("");
  const [taxHolderInput, setTaxHolderInput] = useState("");
  const [savingTax, setSavingTax] = useState(false);
  const [taxFormError, setTaxFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [balRes, stmtRes, payRes, taxRes] = await Promise.all([
        fetchTeacherLedgerBalances(),
        fetchTeacherStatement(),
        fetchTeacherLedgerPayouts(),
        fetchTeacherTaxIdentity(),
      ]);

      setBalances(balRes);
      setStatement(stmtRes);
      setPayouts(payRes);
      setTaxIdentity(taxRes);

      if (balRes.available_toman >= 50000) {
        setPayoutAmount(balRes.available_toman);
      }
      if (taxRes.bank_shaba_number) {
        setShaba(taxRes.bank_shaba_number);
        setBankName(taxRes.bank_name);
        setAccountHolder(taxRes.account_holder_name);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات مالی و دفتر کل.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetchTeacherLedgerBalances(),
      fetchTeacherStatement(),
      fetchTeacherLedgerPayouts(),
      fetchTeacherTaxIdentity(),
    ])
      .then(([balRes, stmtRes, payRes, taxRes]) => {
        if (!ignore) {
          setBalances(balRes);
          setStatement(stmtRes);
          setPayouts(payRes);
          setTaxIdentity(taxRes);

          if (balRes.available_toman >= 50000) {
            setPayoutAmount(balRes.available_toman);
          }
          if (taxRes.bank_shaba_number) {
            setShaba(taxRes.bank_shaba_number);
            setBankName(taxRes.bank_name);
            setAccountHolder(taxRes.account_holder_name);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات مالی و دفتر کل.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleShabaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!val.startsWith("IR")) {
      val = "IR" + val.replace(/^IR/, "");
    }
    if (val.length <= 26) {
      setShaba(val);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutFormError(null);

    if (!balances || payoutAmount > balances.available_toman) {
      setPayoutFormError("مبلغ درخواستی بیشتر از موجودی قطعی و قابل تسویه است.");
      return;
    }
    if (payoutAmount < 50000) {
      setPayoutFormError("حداقل مبلغ قابل تسویه ۵۰,۰۰۰ تومان است.");
      return;
    }
    if (!/^IR\d{24}$/.test(shaba)) {
      setPayoutFormError("شماره شبا باید با IR شروع شده و دارای ۲۴ رقم عددی بدون فاصله باشد.");
      return;
    }

    setSubmittingPayout(true);
    try {
      await submitLedgerPayoutRequest({
        amount_toman: payoutAmount,
        bank_shaba_number: shaba,
        bank_name: bankName,
        account_holder_name: accountHolder,
      });

      setSuccessMsg("درخواست تسویه با موفقیت در دفتر کل ثبت شد و وجه به طور امن مسدود گردید.");
      setShowPayoutModal(false);
      await loadData();
    } catch (err: unknown) {
      setPayoutFormError(err instanceof Error ? err.message : "خطا در ثبت درخواست تسویه.");
    } finally {
      setSubmittingPayout(false);
    }
  };

  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaxFormError(null);
    setSavingTax(true);
    try {
      const updated = await updateTeacherTaxIdentity({
        national_id: nationalIdInput || undefined,
        tax_file_number: taxFileInput,
        is_tax_exempt: isTaxExemptInput,
        bank_shaba_number: taxShabaInput || undefined,
        bank_name: taxBankNameInput,
        account_holder_name: taxHolderInput,
      });
      setTaxIdentity(updated);
      setSuccessMsg("اطلاعات هویتی و مالیاتی با موفقیت به‌روزرسانی شد.");
      setShowTaxModal(false);
    } catch (err: unknown) {
      setTaxFormError(err instanceof Error ? err.message : "خطا در ثبت اطلاعات مالیاتی.");
    } finally {
      setSavingTax(false);
    }
  };

  const openTaxModal = () => {
    if (taxIdentity) {
      setTaxFileInput(taxIdentity.tax_file_number || "");
      setIsTaxExemptInput(taxIdentity.is_tax_exempt || false);
      setTaxShabaInput(taxIdentity.bank_shaba_number || "");
      setTaxBankNameInput(taxIdentity.bank_name || "");
      setTaxHolderInput(taxIdentity.account_holder_name || "");
    }
    setTaxFormError(null);
    setShowTaxModal(true);
  };

  const getPayoutStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className={`${styles.badge} ${styles.badgePending}`}>در انتظار بررسی</span>;
      case "approved":
        return <span className={`${styles.badge} ${styles.badgeApproved}`}>تایید شده (در صف پایا)</span>;
      case "paid":
        return <span className={`${styles.badge} ${styles.badgePaid}`}>واریز شد</span>;
      case "rejected":
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>رد شده</span>;
      default:
        return <span className={styles.badge}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>در حال بارگذاری دفتر کل مالی و گزارش درآمدها...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.title}>امور مالی و دفتر کل درآمد تدریس</h1>
          <p className={styles.subtitle}>
            محاسبه شفاف درآمدها، ره‌گیری دوره‌های بازبینی شکایات، مدیریت تسویه‌های بانکی و تکالیف مالیاتی
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="primary"
            className={styles.payoutButton}
            onClick={() => setShowPayoutModal(true)}
            disabled={!balances?.can_request_payout}
          >
            درخواست تسویه حساب
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={styles.printButton}
            onClick={() => window.print()}
          >
            چاپ / خروجی صورت‌حساب
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className={styles.alertSuccess}>
          <span>{successMsg}</span>
          <Button type="button" variant="tertiary" size="sm" onClick={() => setSuccessMsg(null)}>✕</Button>
        </div>
      )}

      {error && (
        <div className={styles.alertError}>
          <span>{error}</span>
          <Button type="button" variant="tertiary" size="sm" onClick={() => setError(null)}>✕</Button>
        </div>
      )}

      {/* 4-Card Double-Entry Ledger Balances Grid */}
      <div className={styles.metricsGrid}>
        {/* Card 1: Available for Payout */}
        <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.metricLabel}>موجودی قطعی و قابل تسویه</span>
            <span className={styles.pillGreen}>آماده برداشت</span>
          </div>
          <p className={styles.metricValue}>
            {balances ? balances.available_toman.toLocaleString("fa-IR") : "۰"}
            <span className={styles.unit}>تومان</span>
          </p>
          <span className={styles.metricHint}>
            حداقل تسویه: ۵۰,۰۰۰ تومان
          </span>
        </div>

        {/* Card 2: Pending in Dispute Window */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.metricLabel}>معلق در دوره بازبینی</span>
            <span className={styles.pillAmber}>پنجره رسیدگی</span>
          </div>
          <p className={styles.metricValue}>
            {balances ? balances.pending_toman.toLocaleString("fa-IR") : "۰"}
            <span className={styles.unit}>تومان</span>
          </p>
          <span className={styles.metricHint}>
            پس از ۲۴ ساعت از اتمام جلسه قطعی می‌شود
          </span>
        </div>

        {/* Card 3: Paid Out to Bank */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.metricLabel}>مجموع واریزهای موفق پایا</span>
            <span className={styles.pillTeal}>تسویه شده</span>
          </div>
          <p className={styles.metricValue}>
            {balances ? balances.paid_toman.toLocaleString("fa-IR") : "۰"}
            <span className={styles.unit}>تومان</span>
          </p>
          <span className={styles.metricHint}>
            واریز قطعی به شماره شبا
          </span>
        </div>

        {/* Card 4: Reversals & Refunds */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.metricLabel}>استردادها و خسارات</span>
            <span className={styles.pillMuted}>کسورات بازگشتی</span>
          </div>
          <p className={styles.metricValue}>
            {balances ? balances.reversed_toman.toLocaleString("fa-IR") : "۰"}
            <span className={styles.unit}>تومان</span>
          </p>
          <span className={styles.metricHint}>
            جلسات لغو شده یا مشمول داوری
          </span>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={styles.summaryBanner}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>کل ارزش ناخالص جلسات:</span>
          <span className={styles.summaryVal}>
            {balances?.total_earned_gross_toman.toLocaleString("fa-IR")} تومان
          </span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>کارمزد تسهیم‌شده پلتفرم:</span>
          <span className={styles.summaryVal}>
            {balances?.total_commission_toman.toLocaleString("fa-IR")} تومان
          </span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>وضعیت هویت مالیاتی:</span>
          <span className={taxIdentity?.is_verified ? styles.verifiedBadge : styles.unverifiedBadge}>
            {taxIdentity?.is_verified ? "تأییدشده و معتبر" : "در انتظار تکمیل مدارک"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNav}>
        <Button
          type="button"
          variant={activeTab === "statement" ? "primary" : "secondary"}
          className={`${styles.tabBtn} ${activeTab === "statement" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("statement")}
        >
          صورت‌حساب و اسناد دفتر کل
        </Button>
        <Button
          type="button"
          variant={activeTab === "payouts" ? "primary" : "secondary"}
          className={`${styles.tabBtn} ${activeTab === "payouts" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("payouts")}
        >
          تاریخچه درخواست‌های تسویه
        </Button>
        <Button
          type="button"
          variant={activeTab === "tax" ? "primary" : "secondary"}
          className={`${styles.tabBtn} ${activeTab === "tax" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("tax")}
        >
          مشخصات مالیاتی و شماره شبا
        </Button>
      </div>

      {/* TAB 1: Statement Explorer */}
      {activeTab === "statement" && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>ریز اسناد مالی و صورت‌حساب رسمی</h2>
              <p className={styles.sectionSubtitle}>
                رکوردهای تغییرناپذیر دفتر کل حسابداری به همراه تفکیک بهای ناخالص، کارمزد و سهم خالص
              </p>
            </div>
            <span className={styles.recordCount}>
              تعداد اسناد: {statement?.items.length.toLocaleString("fa-IR")}
            </span>
          </div>

          <div className={styles.tableResponsive}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>کد سند</th>
                  <th>شرح رویداد مالی</th>
                  <th>بهای ناخالص</th>
                  <th>کارمزد پلتفرم</th>
                  <th>سهم خالص</th>
                  <th>وضعیت سند</th>
                  <th>تاریخ و ساعت</th>
                </tr>
              </thead>
              <tbody>
                {statement?.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      هنوز سندی در دفتر کل ثبت نشده است. پس از اتمام نخستین جلسه، اسناد در این بخش نمایش می‌یابند.
                    </td>
                  </tr>
                ) : (
                  statement?.items.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.monoCell}>{item.reference_code}</td>
                      <td>{item.description}</td>
                      <td className={styles.numCell}>
                        {item.gross_amount_toman > 0
                          ? `${item.gross_amount_toman.toLocaleString("fa-IR")} تومان`
                          : "—"}
                      </td>
                      <td className={styles.feeCell}>
                        {item.commission_amount_toman > 0
                          ? `-${item.commission_amount_toman.toLocaleString("fa-IR")} تومان`
                          : "—"}
                      </td>
                      <td className={`${styles.numCell} ${item.net_amount_toman < 0 ? styles.textRed : styles.textGreen}`}>
                        {item.net_amount_toman > 0 ? "+" : ""}
                        {item.net_amount_toman.toLocaleString("fa-IR")} تومان
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${item.is_matured ? styles.statusMatured : styles.statusPending}`}>
                          {item.status_label}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {formatTehranDateOnly(item.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* TAB 2: Payouts History */}
      {activeTab === "payouts" && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>ره‌گیری درخواست‌های تسویه حساب</h2>
              <p className={styles.sectionSubtitle}>
                فرآیند واریز به حساب بانکی از طریق چرخه پایا بانک مرکزی
              </p>
            </div>
            <Button type="button" variant="primary" size="sm" className={styles.payoutButtonSmall} onClick={() => setShowPayoutModal(true)}
              disabled={!balances?.can_request_payout}
            >
              ثبت تسویه جدید
            </Button>
          </div>

          <div className={styles.tableResponsive}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>مبلغ درخواستی</th>
                  <th>شماره شبا بانکی</th>
                  <th>بانک عامل / صاحب حساب</th>
                  <th>وضعیت</th>
                  <th>یادداشت بانکی / کد پایا</th>
                  <th>تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      تاکنون درخواست تسویه‌ای ثبت نکرده‌اید.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p.id}>
                      <td className={styles.numCell}>
                        {p.amount_toman.toLocaleString("fa-IR")} تومان
                      </td>
                      <td className={styles.monoCell}>
                        {p.bank_shaba_masked || p.bank_shaba_number}
                      </td>
                      <td>
                        {p.bank_name || "بانک نامشخص"} — {p.account_holder_name}
                      </td>
                      <td>{getPayoutStatusBadge(p.status)}</td>
                      <td className={styles.notesCell}>
                        {p.status === "rejected" ? (
                          <span className={styles.textRed}>{p.rejection_reason}</span>
                        ) : (
                          p.admin_notes || "در نوبت پردازش پایا"
                        )}
                      </td>
                      <td className={styles.dateCell}>
                        {formatTehranDateOnly(p.created_at)} {formatTehranTimeOnly(p.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* TAB 3: Tax Identity & Compliance */}
      {activeTab === "tax" && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>مشخصات هویتی، مالیاتی و حساب بانکی</h2>
              <p className={styles.sectionSubtitle}>
                الزامات قانونی سامانه مودیان و احراز هویت شاپرک جهت تسویه بدون تاخیر
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.payoutButtonSmall}
              onClick={openTaxModal}
            >
              ویرایش اطلاعات
            </Button>
          </div>

          <div className={styles.taxGrid}>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>کد ملی احراز هویت شده:</span>
              <span className={styles.taxValue}>{taxIdentity?.national_id_masked || "ثبت نشده"}</span>
            </div>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>شماره شبا پیش‌فرض:</span>
              <span className={styles.taxValue}>{taxIdentity?.bank_shaba_masked || "ثبت نشده"}</span>
            </div>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>بانک عامل:</span>
              <span className={styles.taxValue}>{taxIdentity?.bank_name || "تعیین نشده"}</span>
            </div>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>نام صاحب حساب:</span>
              <span className={styles.taxValue}>{taxIdentity?.account_holder_name || "منطبق بر کد ملی"}</span>
            </div>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>شماره پرونده مالیاتی سامانه مودیان:</span>
              <span className={styles.taxValue}>{taxIdentity?.tax_file_number || "ندارد / معافیت مشاغل"}</span>
            </div>
            <div className={styles.taxItem}>
              <span className={styles.taxLabel}>معافیت آموزشی (ماده ۹۵/۱۳۹):</span>
              <span className={styles.taxValue}>{taxIdentity?.is_tax_exempt ? "بله (معاف)" : "خیر (مشمول)"}</span>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Request Payout */}
      {showPayoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>درخواست تسویه حساب بانکی</h3>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                className={styles.modalClose}
                onClick={() => setShowPayoutModal(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handlePayoutSubmit} className={styles.modalForm}>
              {payoutFormError && (
                <div className={styles.modalError}>{payoutFormError}</div>
              )}

              <div className={styles.infoBanner}>
                <span>موجودی قطعی قابل تسویه شما: </span>
                <strong>{balances?.available_toman.toLocaleString("fa-IR")} تومان</strong>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>مبلغ تسویه (تومان)</label>
                <Input
                  type="number"
                  min={50000}
                  max={balances?.available_toman || 50000}
                  step={10000}
                  value={payoutAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPayoutAmount(Number(e.target.value))}
                  className={styles.formInput}
                  required
                />
                <span className={styles.fieldHint}>حداقل مبلغ ۵۰,۰۰۰ تومان</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شماره شبا (IBAN با پیشوند IR)</label>
                <Input type="text" maxLength={26} value={shaba}
                  onChange={handleShabaChange}
                  placeholder="IR123456789012345678901234"
                  className={`${styles.formInput} ${styles.monoInput}`}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نام بانک</label>
                  <Input type="text" value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="مثال: بانک سامان"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نام صاحب حساب</label>
                  <Input type="text" value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="مطابق با کارت ملی"
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.buttonCancel}
                  onClick={() => setShowPayoutModal(false)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.buttonSubmit}
                  loading={submittingPayout}
                  disabled={submittingPayout}
                >
                  {submittingPayout ? "در حال ثبت سند..." : "تایید و ثبت تسویه"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Tax Identity */}
      {showTaxModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>ویرایش مشخصات مالیاتی و حساب بانکی</h3>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                className={styles.modalClose}
                onClick={() => setShowTaxModal(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleTaxSubmit} className={styles.modalForm}>
              {taxFormError && (
                <div className={styles.modalError}>{taxFormError}</div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>کد ملی (۱۰ رقم)</label>
                <Input type="text" maxLength={10} value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value.replace(/\D/g, ""))}
                  placeholder={taxIdentity?.national_id_masked || "مثال: ۰۰۱۲۳۴۵۶۷۸"}
                  className={styles.formInput}
                />
                <span className={styles.fieldHint}>کد ملی فقط جهت احراز هویت یک‌بار مصرف ثبت شده و به صورت ماسک‌شده نگهداری می‌شود.</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شماره پرونده مالیاتی سامانه مودیان (اختیاری)</label>
                <Input type="text" value={taxFileInput}
                  onChange={(e) => setTaxFileInput(e.target.value)}
                  placeholder="TAX-XXXX-XXXX"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شماره شبا پیش‌فرض</label>
                <Input type="text" maxLength={26} value={taxShabaInput}
                  onChange={(e) => setTaxShabaInput(e.target.value.toUpperCase())}
                  placeholder="IR..."
                  className={`${styles.formInput} ${styles.monoInput}`}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نام بانک</label>
                  <Input type="text" value={taxBankNameInput}
                    onChange={(e) => setTaxBankNameInput(e.target.value)}
                    placeholder="مثال: بانک ملت"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نام صاحب حساب</label>
                  <Input type="text" value={taxHolderInput}
                    onChange={(e) => setTaxHolderInput(e.target.value)}
                    placeholder="نام کامل"
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formCheckboxGroup}>
                <label className={styles.checkboxLabel}>
                  <Input type="checkbox" checked={isTaxExemptInput}
                    onChange={(e) => setIsTaxExemptInput(e.target.checked)}
                  />
                  <span>مشمول معافیت مالیاتی فعالیت‌های آموزشی (ماده ۹۵/۱۳۹)</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.buttonCancel}
                  onClick={() => setShowTaxModal(false)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.buttonSubmit}
                  loading={savingTax}
                  disabled={savingTax}
                >
                  {savingTax ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
