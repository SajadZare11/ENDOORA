"use client";

import { Button, Input, Table } from "@endoora/ui";
import React, { useEffect, useState } from "react";
import styles from "./finance.module.css";
import {
  fetchAdminReconciliationReport,
  fetchAdminPayoutQueue,
  processAdminPayoutAction,
  fetchCommissionRules,
  createCommissionRule,
  updateCommissionRule,
  ReconciliationReport,
  LedgerPayoutRequestItem,
  CommissionRule,
  AdminPayoutActionPayload,
  formatTehranDateOnly,
} from "../../../lib/marketplace";

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState<"reconciliation" | "payouts" | "commission" | "refunds">("reconciliation");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [reconciliation, setReconciliation] = useState<ReconciliationReport | null>(null);
  const [payouts, setPayouts] = useState<LedgerPayoutRequestItem[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [payoutFilter, setPayoutFilter] = useState<string>("all");

  // Payout Action Modal state
  const [selectedPayout, setSelectedPayout] = useState<LedgerPayoutRequestItem | null>(null);
  const [actionType, setActionType] = useState<"review" | "approve" | "dual_signoff" | "pay" | "reject">("approve");
  const [showActionModal, setShowActionModal] = useState(false);
  const [bankRefInput, setBankRefInput] = useState("");
  const [transferDateInput, setTransferDateInput] = useState(new Date().toISOString().split("T")[0]);
  const [notesInput, setNotesInput] = useState("");
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionModalError, setActionModalError] = useState<string | null>(null);

  // View Audit Trail Modal
  const [auditPayout, setAuditPayout] = useState<LedgerPayoutRequestItem | null>(null);

  // Commission Rule Modal state
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleProductType, setRuleProductType] = useState("session_1on1");
  const [ruleRate, setRuleRate] = useState<number>(15);
  const [ruleFixedFee, setRuleFixedFee] = useState<number>(0);
  const [rulePriority, setRulePriority] = useState<number>(1);
  const [ruleDescription, setRuleDescription] = useState("");
  const [submittingRule, setSubmittingRule] = useState(false);
  const [ruleModalError, setRuleModalError] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reconRes, payoutsRes, rulesRes] = await Promise.all([
        fetchAdminReconciliationReport(),
        fetchAdminPayoutQueue({ status: payoutFilter !== "all" ? payoutFilter : undefined }),
        fetchCommissionRules(),
      ]);
      setReconciliation(reconRes);
      setPayouts(payoutsRes);
      setCommissionRules(rulesRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات مالی پلتفرم.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetchAdminReconciliationReport(),
      fetchAdminPayoutQueue({ status: payoutFilter !== "all" ? payoutFilter : undefined }),
      fetchCommissionRules(),
    ])
      .then(([reconRes, payoutsRes, rulesRes]) => {
        if (!ignore) {
          setReconciliation(reconRes);
          setPayouts(payoutsRes);
          setCommissionRules(rulesRes);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات مالی پلتفرم.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [payoutFilter]);

  const openActionModal = (payout: LedgerPayoutRequestItem, action: "review" | "approve" | "dual_signoff" | "pay" | "reject") => {
    setSelectedPayout(payout);
    setActionType(action);
    setBankRefInput("");
    setNotesInput("");
    setRejectionReasonInput("");
    setActionModalError(null);
    setShowActionModal(true);
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    setActionModalError(null);

    if (actionType === "pay" && (!bankRefInput || bankRefInput.trim().length < 4)) {
      setActionModalError("ثبت کد رهگیری حواله پایا یا شماره مرجع بانکی الزامی است.");
      return;
    }

    if (actionType === "reject" && (!rejectionReasonInput || rejectionReasonInput.trim().length < 4)) {
      setActionModalError("ثبت علت رد درخواست تسویه برای اطلاع مدرس الزامی است.");
      return;
    }

    setSubmittingAction(true);
    try {
      const payload: AdminPayoutActionPayload = {
        action: actionType,
        bank_transfer_reference: bankRefInput.trim(),
        transfer_date: actionType === "pay" ? transferDateInput : undefined,
        notes: notesInput.trim(),
        rejection_reason: rejectionReasonInput.trim(),
      };

      await processAdminPayoutAction(selectedPayout.id, payload);
      setSuccessMsg(`عملیات ${actionType} با موفقیت در دفتر کل و سیستم کنترل داخلی ثبت شد.`);
      setShowActionModal(false);
      await loadAllData();
    } catch (err: unknown) {
      setActionModalError(err instanceof Error ? err.message : "خطا در پردازش عملیات تسویه.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const openNewRuleModal = () => {
    setEditingRule(null);
    setRuleName("");
    setRuleProductType("session_1on1");
    setRuleRate(15);
    setRuleFixedFee(0);
    setRulePriority(1);
    setRuleDescription("");
    setRuleModalError(null);
    setShowRuleModal(true);
  };

  const openEditRuleModal = (rule: CommissionRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleProductType(rule.product_type);
    setRuleRate(Number(rule.rate_percentage));
    setRuleFixedFee(rule.fixed_fee_toman);
    setRulePriority(rule.priority);
    setRuleDescription(rule.description || "");
    setRuleModalError(null);
    setShowRuleModal(true);
  };

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRuleModalError(null);
    setSubmittingRule(true);
    try {
      const payload = {
        name: ruleName.trim(),
        product_type: ruleProductType,
        rate_percentage: ruleRate,
        fixed_fee_toman: ruleFixedFee,
        priority: rulePriority,
        description: ruleDescription.trim(),
        is_active: true,
      };

      if (editingRule) {
        await updateCommissionRule(editingRule.id, payload);
        setSuccessMsg("تعرفه کارمزد با موفقیت به‌روزرسانی شد.");
      } else {
        await createCommissionRule(payload);
        setSuccessMsg("تعرفه کارمزد جدید با موفقیت ایجاد شد.");
      }
      setShowRuleModal(false);
      await loadAllData();
    } catch (err: unknown) {
      setRuleModalError(err instanceof Error ? err.message : "خطا در ذخیره قانون کارمزد.");
    } finally {
      setSubmittingRule(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className={`${styles.badge} ${styles.badgePending}`}>در انتظار بررسی</span>;
      case "approved":
        return <span className={`${styles.badge} ${styles.badgeApproved}`}>تایید مرحله اول (صف حواله)</span>;
      case "paid":
        return <span className={`${styles.badge} ${styles.badgePaid}`}>حواله شد (موفق)</span>;
      case "rejected":
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>رد شده</span>;
      default:
        return <span className={styles.badge}>{status}</span>;
    }
  };

  if (loading && !reconciliation) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>در حال بارگذاری درگاه خزانه‌داری و عملیات مالی ایندورا...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.title}>خزانه‌داری، تسویه و عملیات مالی پلتفرم</h1>
          <p className={styles.subtitle}>
            ترازسنجی حساب‌های امانی، صف کنترل دو مرحله‌ای تسویه‌ها، مدیریت قوانین کارمزد و نظارت بر استردادها
          </p>
        </div>
        <div className={styles.headerBadgeRow}>
          <span className={styles.systemBadge}>
            وضعیت تراز حسابداری: {reconciliation?.reconciliation_status === "BALANCED" ? "تراز و منطبق ✓" : "دارای مغایرت"}
          </span>
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

      {/* Tabs */}
      <div className={styles.tabNav}>
        <Button type="button" variant="secondary" className={`${styles.tabBtn} ${activeTab === "reconciliation" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("reconciliation")}>
          ترازنامه و تطبیق مالی
        </Button>
        <Button type="button" variant="secondary" className={`${styles.tabBtn} ${activeTab === "payouts" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("payouts")}>
          صف تسویه حساب و کنترل دو مرحله‌ای
        </Button>
        <Button type="button" variant="secondary" className={`${styles.tabBtn} ${activeTab === "commission" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("commission")}>
          تعرفه‌های کارمزد محصولات
        </Button>
        <Button type="button" variant="secondary" className={`${styles.tabBtn} ${activeTab === "refunds" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("refunds")}>
          تسهیم خسارت و استردادها
        </Button>
      </div>

      {/* TAB 1: Reconciliation & Balance Sheet */}
      {activeTab === "reconciliation" && reconciliation && (
        <div className={styles.tabContent}>
          {/* Top Balance Sheet Metrics */}
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
              <span className={styles.metricLabel}>کل موجودی حساب امانی پلتفرم</span>
              <p className={styles.metricValue}>
                {reconciliation.escrow_metrics.total_held_toman.toLocaleString("fa-IR")}
                <span className={styles.unit}>تومان</span>
              </p>
              <span className={styles.metricHint}>وجوه نزد پلتفرم برای جلسات آتی</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>مطالبات قطعی قابل تسویه مدرسان</span>
              <p className={styles.metricValue}>
                {reconciliation.ledger_metrics.current_teacher_payable_liability_toman.toLocaleString("fa-IR")}
                <span className={styles.unit}>تومان</span>
              </p>
              <span className={styles.metricHint}>تعهد مالی پلتفرم پس از انقضای دوره بازبینی</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>درآمد کارمزد شناسایی‌شده پلتفرم</span>
              <p className={styles.metricValue}>
                {reconciliation.ledger_metrics.total_platform_commission_toman.toLocaleString("fa-IR")}
                <span className={styles.unit}>تومان</span>
              </p>
              <span className={styles.metricHint}>سهم خالص ایندورا از جلسات برگزارشده</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>حواله‌های در گردش (در صف پرداخت)</span>
              <p className={styles.metricValue}>
                {reconciliation.ledger_metrics.total_payouts_in_flight_toman.toLocaleString("fa-IR")}
                <span className={styles.unit}>تومان</span>
              </p>
              <span className={styles.metricHint}>درخواست‌های تاییدشده در انتظار پایا</span>
            </div>
          </div>

          {/* Detailed Ledger vs Escrow Audit Section */}
          <div className={styles.sectionGrid}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>گزارش تطبیق حساب‌های امانی (Escrow Audit)</h2>
              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span>مجموع وجوه مسدودی در امانی:</span>
                  <strong>{reconciliation.escrow_metrics.total_held_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
                <div className={styles.statRow}>
                  <span>مجموع وجوه تسویه‌شده به مدرسان:</span>
                  <strong>{reconciliation.escrow_metrics.total_settled_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
                <div className={styles.statRow}>
                  <span>مجموع وجوه مستردشده به زبان‌آموزان:</span>
                  <strong>{reconciliation.escrow_metrics.total_refunded_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>گزارش دفتر کل تعهدات (Payables Ledger)</h2>
              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span>درآمدهای معلق در دوره بازبینی شکایات:</span>
                  <strong>{reconciliation.ledger_metrics.total_pending_payables_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
                <div className={styles.statRow}>
                  <span>درآمدهای قطعی و سررسیدشده:</span>
                  <strong>{reconciliation.ledger_metrics.total_matured_payables_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
                <div className={styles.statRow}>
                  <span>کل تسویه‌های پرداختی انجام‌شده:</span>
                  <strong>{reconciliation.ledger_metrics.total_payouts_completed_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
                <div className={styles.statRow}>
                  <span>برگشت درآمدهای ناشی از لغو و استرداد:</span>
                  <strong className={styles.textRed}>-{reconciliation.ledger_metrics.total_refund_reversals_toman.toLocaleString("fa-IR")} تومان</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Payouts Queue & Dual-Control */}
      {activeTab === "payouts" && (
        <section className={styles.sectionCard}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>فیلتر وضعیت:</label>
              <select
                value={payoutFilter}
                onChange={(e) => setPayoutFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">همه درخواست‌ها</option>
                <option value="pending">در انتظار بررسی اولیه</option>
                <option value="approved">تایید شده (در صف پایا)</option>
                <option value="paid">واریز شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>
            <span className={styles.recordCount}>
              تعداد درخواست‌ها: {payouts.length.toLocaleString("fa-IR")}
            </span>
          </div>

          <div className={styles.tableResponsive}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>مدرس متقاضی</th>
                  <th>مبلغ درخواستی</th>
                  <th>شماره شبا بانکی</th>
                  <th>وضعیت</th>
                  <th>کد پیگیری پایا / یادداشت</th>
                  <th>تاریخ ثبت</th>
                  <th>عملیات کنترل داخلی</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>درخواستی در این وضعیت یافت نشد.</td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.teacher_name || "مدرس ایندورا"}</strong>
                        <div className={styles.subText}>{p.account_holder_name} ({p.bank_name || "بانک عامل"})</div>
                      </td>
                      <td className={styles.numCell}>
                        {p.amount_toman.toLocaleString("fa-IR")} تومان
                      </td>
                      <td className={styles.monoCell}>
                        {p.bank_shaba_masked || p.bank_shaba_number}
                      </td>
                      <td>{getStatusBadge(p.status)}</td>
                      <td className={styles.notesCell}>
                        {p.status === "rejected" ? (
                          <span className={styles.textRed}>{p.rejection_reason}</span>
                        ) : (
                          p.admin_notes || "—"
                        )}
                      </td>
                      <td className={styles.dateCell}>
                        {formatTehranDateOnly(p.created_at)}
                      </td>
                      <td>
                        <div className={styles.actionBtnGroup}>
                          {p.status === "pending" && (
                            <>
                              <Button type="button" variant="primary" size="sm" className={styles.btnApprove}
                                onClick={() => openActionModal(p, "approve")}
                              >
                                تایید مرحله ۱
                              </Button>
                              <Button type="button" variant="destructive" size="sm" className={styles.btnReject}
                                onClick={() => openActionModal(p, "reject")}
                              >
                                رد درخواست
                              </Button>
                            </>
                          )}
                          {p.status === "approved" && (
                            <>
                              <Button type="button" variant="primary" size="sm" className={styles.btnPay}
                                onClick={() => openActionModal(p, "pay")}
                              >
                                ثبت حواله پایا
                              </Button>
                              <Button type="button" variant="destructive" size="sm" className={styles.btnReject}
                                onClick={() => openActionModal(p, "reject")}
                              >
                                انصراف و رد
                              </Button>
                            </>
                          )}
                          <Button type="button" variant="secondary" size="sm" className={styles.btnAudit}
                            onClick={() => setAuditPayout(p)}
                          >
                            زنجیره حسابرسی
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* TAB 3: Commission Rules */}
      {activeTab === "commission" && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>قوانین و تعرفه‌های پویای کارمزد ایندورا</h2>
              <p className={styles.sectionSubtitle}>
                تعیین نرخ کارمزد به تفکیک محصولات آموزشی، تاریخ شروع و اولویت اعمال در بازارگاه
              </p>
            </div>
            <Button type="button" variant="primary" className={styles.payoutButton}
              onClick={openNewRuleModal}
            >
              افزودن تعرفه جدید
            </Button>
          </div>

          <div className={styles.tableResponsive}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>نام تعرفه</th>
                  <th>نوع محصول مشمول</th>
                  <th>درصد کارمزد پلتفرم</th>
                  <th>کارمزد ثابت (تومان)</th>
                  <th>اولویت اعمال</th>
                  <th>تاریخ اجرا</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {commissionRules.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.name}</strong>
                      <div className={styles.subText}>{r.description || "بدون توضیحات"}</div>
                    </td>
                    <td>{r.product_type_display}</td>
                    <td className={styles.numCell}>{r.rate_percentage}٪</td>
                    <td className={styles.numCell}>
                      {r.fixed_fee_toman > 0 ? `${r.fixed_fee_toman.toLocaleString("fa-IR")} تومان` : "ندارد"}
                    </td>
                    <td>{r.priority}</td>
                    <td className={styles.dateCell}>
                      از {formatTehranDateOnly(r.effective_from)}
                    </td>
                    <td>
                      <span className={r.is_active ? styles.verifiedBadge : styles.unverifiedBadge}>
                        {r.is_active ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td>
                      <Button type="button" variant="secondary" size="sm" className={styles.btnEdit}
                        onClick={() => openEditRuleModal(r)}
                      >
                        ویرایش
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* TAB 4: Refunds & Dispute Allocations Policy */}
      {activeTab === "refunds" && (
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>سازوکار تسهیم استرداد و جبران خسارت داوری</h2>
          <p className={styles.sectionSubtitle}>
            منطق رسمی کسر و تخصیص مالی در صورت استرداد ۱۰۰٪ یا آرای درصدی شورای داوری
          </p>

          <div className={styles.refundPolicyGrid}>
            <div className={styles.policyCard}>
              <h3 className={styles.policyTitle}>استرداد ۱۰۰٪ (لغو موجه یا غیبت مدرس)</h3>
              <ul className={styles.policyList}>
                <li>۱۰۰٪ کل بهای جلسه فوراً به کیف پول زبان‌آموز بازگردانده می‌شود.</li>
                <li>کارمزد پلتفرم ایندورا کسر نشده و کل درآمد بازگشت داده می‌شود (`COMMISSION_REVERSAL`).</li>
                <li>سند برگشت درآمد به مبلغ خالص سهم مدرس در دفتر کل مطالبات ثبت می‌شود (`REFUND_REVERSAL`).</li>
                <li>مانده در دسترس مدرس هرگز منفی نخواهد شد و کسری از درآمدهای بعدی تسویه می‌شود.</li>
              </ul>
            </div>

            <div className={styles.policyCard}>
              <h3 className={styles.policyTitle}>استرداد درصدی داوری (مثلاً ۵۰٪ یا ۷۵٪)</h3>
              <ul className={styles.policyList}>
                <li>درصد تعیین‌شده در رای داوری به زبان‌آموز مسترد می‌گردد.</li>
                <li>کارمزد پلتفرم به نسبت درصد لغو شده کاهش و برگشت داده می‌شود.</li>
                <li>سهم خالص باقی‌مانده (مثلاً ۵۰٪ بقیه) به مدرس تعلق گرفته و پس از انقضای مهلت اعتراض قطعی می‌شود.</li>
                <li>تمام اسناد مالی همراه با کد پیگیری یکتا در دفتر کل ثبت می‌شوند.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Action Modal (Approve, Pay, Reject) */}
      {showActionModal && selectedPayout && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {actionType === "approve" && "تأیید مرحله اول درخواست تسویه (کنترل داخلی)"}
                {actionType === "pay" && "ثبت حواله بانکی پایا و تسویه نهایی"}
                {actionType === "reject" && "رد درخواست تسویه حساب مدرس"}
              </h3>
              <Button type="button" variant="tertiary" size="sm" className={styles.modalClose}
                onClick={() => setShowActionModal(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleActionSubmit} className={styles.modalForm}>
              {actionModalError && (
                <div className={styles.modalError}>{actionModalError}</div>
              )}

              <div className={styles.payoutSummaryBox}>
                <div><strong>مدرس: </strong> {selectedPayout.teacher_name}</div>
                <div><strong>مبلغ تسویه: </strong> {selectedPayout.amount_toman.toLocaleString("fa-IR")} تومان</div>
                <div><strong>شماره شبا: </strong> <span className={styles.monoCell}>{selectedPayout.bank_shaba_masked || selectedPayout.bank_shaba_number}</span></div>
                <div><strong>صاحب حساب: </strong> {selectedPayout.account_holder_name} ({selectedPayout.bank_name || "بانک عامل"})</div>
              </div>

              {actionType === "pay" && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>شماره پیگیری حواله پایا / ساتنا (الزامی)</label>
                    <Input type="text" value={bankRefInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankRefInput(e.target.value)} placeholder="مثال: PAYA-1403-98765432" className={`${styles.formInput} ${styles.monoInput}`} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>تاریخ اجرای حواله بانکی</label>
                    <Input type="date" value={transferDateInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferDateInput(e.target.value)} className={styles.formInput} required />
                  </div>
                </>
              )}

              {actionType === "reject" && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دلیل رد درخواست (الزامی)</label>
                  <textarea
                    rows={3}
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    placeholder="علت رد درخواست را جهت اطلاع مدرس و ثبت در گزارش حسابرسی بنویسید (مانند: مسدودی حساب یا عدم تطابق شبا)..."
                    className={styles.formInput}
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>یادداشت کنترل داخلی (اختیاری)</label>
                <Input type="text" value={notesInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotesInput(e.target.value)} placeholder="ملاحظات مالی..." className={styles.formInput} />
              </div>

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" className={styles.buttonCancel}
                  onClick={() => setShowActionModal(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant={actionType === "reject" ? "destructive" : "primary"} className={actionType === "reject" ? styles.buttonRejectSubmit : styles.buttonSubmit}
                  disabled={submittingAction}
                >
                  {submittingAction ? "در حال ثبت سند..." : "تایید و اعمال اقدام مالی"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail Drawer / Modal */}
      {auditPayout && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>زنجیره حسابرسی و کنترل داخلی تسویه</h3>
              <Button type="button" variant="tertiary" size="sm" className={styles.modalClose}
                onClick={() => setAuditPayout(null)}
              >
                ✕
              </Button>
            </div>

            <div className={styles.auditList}>
              {auditPayout.audit_trail && auditPayout.audit_trail.length > 0 ? (
                auditPayout.audit_trail.map((log) => (
                  <div key={log.id} className={styles.auditItem}>
                    <div className={styles.auditAction}>{log.action_display}</div>
                    <div className={styles.auditMeta}>
                      توسط: {log.performed_by_name} | {formatTehranDateOnly(log.created_at)}
                    </div>
                    {log.bank_transfer_reference && (
                      <div className={styles.auditRef}>
                        کد پیگیری پایا: {log.bank_transfer_reference}
                      </div>
                    )}
                    {log.notes && <div className={styles.auditNotes}>یادداشت: {log.notes}</div>}
                  </div>
                ))
              ) : (
                <p className={styles.emptyCell}>هنوز عملیات ثبت‌شده‌ای در زنجیره حسابرسی این درخواست وجود ندارد.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Commission Rule Add/Edit Modal */}
      {showRuleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingRule ? "ویرایش تعرفه کارمزد" : "تعریف تعرفه کارمزد جدید"}
              </h3>
              <Button type="button" variant="tertiary" size="sm" className={styles.modalClose}
                onClick={() => setShowRuleModal(false)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleRuleSubmit} className={styles.modalForm}>
              {ruleModalError && (
                <div className={styles.modalError}>{ruleModalError}</div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>عنوان تعرفه</label>
                <Input type="text" value={ruleName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleName(e.target.value)} placeholder="مثال: کارمزد جلسات ماک آیلتس" className={styles.formInput} required />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>نوع محصول</label>
                  <select
                    value={ruleProductType}
                    onChange={(e) => setRuleProductType(e.target.value)}
                    className={styles.formInput}
                  >
                    <option value="session_1on1">جلسه خصوصی ۱ به ۱</option>
                    <option value="group_class">کلاس گروهی</option>
                    <option value="trial_session">جلسه آزمایشی / ارزیابی</option>
                    <option value="ielts_mock">شبیه‌ساز و ماک آیلتس</option>
                    <option value="course_package">بسته آموزشی / دوره</option>
                    <option value="general">عمومی مارکت‌پلیس</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>درصد کارمزد پلتفرم (٪)</label>
                  <Input type="number" min={0} max={100} step={0.5} value={ruleRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleRate(Number(e.target.value))} className={styles.formInput} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>کارمزد ثابت (تومان)</label>
                  <Input type="number" min={0} step={1000} value={ruleFixedFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleFixedFee(Number(e.target.value))} className={styles.formInput} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>اولویت اعمال (عدد بزرگتر)</label>
                  <Input type="number" min={1} max={100} value={rulePriority} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRulePriority(Number(e.target.value))} className={styles.formInput} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>توضیحات و مصوبه مالی</label>
                <textarea
                  rows={2}
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  placeholder="ملاحظات..."
                  className={styles.formInput}
                />
              </div>

              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" className={styles.buttonCancel}
                  onClick={() => setShowRuleModal(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant="primary" className={styles.buttonSubmit}
                  disabled={submittingRule}
                >
                  {submittingRule ? "در حال ذخیره..." : "ذخیره تعرفه کارمزد"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}