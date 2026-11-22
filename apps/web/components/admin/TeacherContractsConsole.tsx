"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useState, useEffect } from "react";
import styles from "./teacher-contracts.module.css";
import {
  type CommissionTierKey,
  type ContractType,
  type ContractStatus,
  type CommissionTierConfig,
  type TeacherCommissionProfile,
  type TeacherContractItem,
  type TeacherContractsStats,
  INITIAL_COMMISSION_TIERS,
  INITIAL_TEACHER_PROFILES,
  INITIAL_TEACHER_CONTRACTS,
} from "@/lib/teacher-contracts-content";

type ActiveSubTab = "tiers" | "contracts" | "compliance";

export function TeacherContractsConsole() {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("tiers");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Core Data
  const [tiers, setTiers] = useState<CommissionTierConfig[]>(INITIAL_COMMISSION_TIERS);
  const [profiles, setProfiles] = useState<TeacherCommissionProfile[]>(INITIAL_TEACHER_PROFILES);
  const [contracts, setContracts] = useState<TeacherContractItem[]>(INITIAL_TEACHER_CONTRACTS);
  const [stats, setStats] = useState<TeacherContractsStats>({
    totalTeachersUnderContract: 4,
    activeContractsCount: 3,
    pendingSignaturesCount: 1,
    activeLegalHoldsCount: 1,
    diamondTierCount: 1,
    avgTeacherCommissionPercent: 78,
  });

  // Modals
  const [customCommTeacher, setCustomCommTeacher] = useState<TeacherCommissionProfile | null>(null);
  const [customPercent, setCustomPercent] = useState<number>(80);
  const [customReason, setCustomReason] = useState<string>("");

  const [newContractModalOpen, setNewContractModalOpen] = useState<boolean>(false);
  const [newContractTeacherId, setNewContractTeacherId] = useState<string>("");
  const [newContractType, setNewContractType] = useState<ContractType>("teaching_agreement");
  const [newContractTitle, setNewContractTitle] = useState<string>("");
  const [newContractTerms, setNewContractTerms] = useState<string>("");
  const [newContractPercent, setNewContractPercent] = useState<number>(75);

  const [otpSignModalContractId, setOtpSignModalContractId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>("849201");

  const [legalHoldTeacher, setLegalHoldTeacher] = useState<TeacherCommissionProfile | null>(null);
  const [legalHoldReason, setLegalHoldReason] = useState<string>("");

  const [taxModalTeacher, setTaxModalTeacher] = useState<TeacherCommissionProfile | null>(null);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/teachers/contracts");
      const json = await res.json();
      if (json.success && json.data) {
        setTiers(json.data.tiers);
        setProfiles(json.data.profiles);
        setContracts(json.data.contracts);
        setStats(json.data.stats);
      }
    } catch (err) {
      console.warn("Could not fetch remote teacher contracts data, using seed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Set Custom Commission
  const handleSaveCustomCommission = async () => {
    if (!customCommTeacher || !customReason.trim()) {
      alert("لطفاً درصد و دلیل توافق را مشخص فرمایید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_custom_commission",
          teacherId: customCommTeacher.teacherId,
          customPercent: Number(customPercent),
          reason: customReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setCustomCommTeacher(null);
        setCustomReason("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "ذخیره نشد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 2. Evaluate Tier Promotion
  const handleEvaluatePromotion = async (teacherId: string) => {
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_tier_promotion",
          teacherId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "خطا در ارزیابی سطح"));
      }
    } catch (err: unknown) {
      alert("خطای ارتباط: " + errorMessage(err));
    }
  };

  // 3. Create Contract Submit
  const handleCreateContractSubmit = async () => {
    if (!newContractTeacherId || !newContractTitle.trim()) {
      alert("لطفاً استاد و عنوان قرارداد را مشخص فرمایید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_contract",
          teacherId: newContractTeacherId,
          contractType: newContractType,
          contractTitle: newContractTitle,
          termsSummary: newContractTerms,
          commissionPercent: Number(newContractPercent),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setNewContractModalOpen(false);
        setNewContractTitle("");
        setNewContractTerms("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "صدور قرارداد با خطا مواجه شد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 4. Send Contract for Signature
  const handleSendContract = async (contractId: string) => {
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_contract",
          contractId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطای ارتباط: " + errorMessage(err));
    }
  };

  // 5. Sign Contract via OTP Simulator
  const handleSignContractOtpSubmit = async () => {
    if (!otpSignModalContractId) return;
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sign_contract_otp",
          contractId: otpSignModalContractId,
          otpCode,
          signerIp: "5.210.14.92",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setOtpSignModalContractId(null);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "امضا ناموفق بود"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 6. Terminate Contract
  const handleTerminateContract = async (contractId: string) => {
    const reason = prompt("علت فسخ قرارداد را وارد فرمایید:", "عدم انطباق با استانداردهای پلتفرم");
    if (!reason) return;
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "terminate_contract",
          contractId,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در فسخ قرارداد: " + errorMessage(err));
    }
  };

  // 7. Toggle Legal Hold Submit
  const handleToggleLegalHoldSubmit = async (nextHoldState: boolean) => {
    if (!legalHoldTeacher) return;
    if (nextHoldState && !legalHoldReason.trim()) {
      alert("لطفاً دلیل فعال‌سازی فریز حقوقی را بنویسید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_legal_hold",
          teacherId: legalHoldTeacher.teacherId,
          isHoldActive: nextHoldState,
          reason: nextHoldState ? legalHoldReason : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setLegalHoldTeacher(null);
        setLegalHoldReason("");
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 8. Update Tax Rate Submit
  const handleUpdateTaxRateSubmit = async () => {
    if (!taxModalTeacher) return;
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_tax_rate",
          teacherId: taxModalTeacher.teacherId,
          taxPercent: Number(taxPercent),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setTaxModalTeacher(null);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 9. Reset Seed
  const handleResetSeed = async () => {
    if (!confirm("آیا از بازنشانی داده‌های تستی قراردادها به وضعیت اولیه مطمئن هستید؟")) return;
    try {
      const res = await fetch("/api/admin/teachers/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nationalId.includes(searchQuery) ||
      p.currentTier.includes(searchQuery.toLowerCase())
  );

  const filteredContracts = contracts.filter(
    (c) =>
      c.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadgeStyle = (tier: CommissionTierKey) => {
    switch (tier) {
      case "bronze":
        return { color: "#cd7f32", border: "1px solid #cd7f32" };
      case "silver":
        return { color: "#94a3b8", border: "1px solid #94a3b8" };
      case "gold":
        return { color: "#eab308", border: "1px solid #eab308" };
      case "diamond":
        return { color: "#38bdf8", border: "1px solid #38bdf8" };
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#9333ea",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Custom Commission Modal */}
      {customCommTeacher && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>
              تنظیم سهم اختصاصی کارمزد برای {customCommTeacher.teacherName}
            </h3>
            <p className={styles.modalDesc}>
              سطح فعلی: <strong>{customCommTeacher.currentTier}</strong> (سهم استاندارد:{" "}
              {tiers.find((t) => t.key === customCommTeacher.currentTier)?.teacherSharePercent}٪)
            </p>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>درصد سهم توافقی مدرس:</label>
              <input
                type="number"
                min="50"
                max="95"
                value={customPercent}
                onChange={(e) => setCustomPercent(parseInt(e.target.value, 10))}
                className={styles.formInput}
                style={{ marginTop: "0.3rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>توجیه حقوقی / علت توافق:</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className={styles.modalTextarea}
                placeholder="مثال: توافق ویژه بابت تدریس انحصاری دوره‌های حضوری و آنلاین آیلتس..."
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => setCustomCommTeacher(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnActionPrimary}
                onClick={handleSaveCustomCommission}
              >
                ذخیره سهم توافقی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      {newContractModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>صدور قرارداد جدید برای مدرس</h3>
            <p className={styles.modalDesc}>
              انتخاب نوع قرارداد، مفاد حقوقی و درصد کارمزد تدریس جهت ارسال برای امضا
            </p>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>انتخاب مدرس:</label>
              <select
                value={newContractTeacherId}
                onChange={(e) => {
                  setNewContractTeacherId(e.target.value);
                  const p = profiles.find((prof) => prof.teacherId === e.target.value);
                  if (p) setNewContractPercent(p.effectiveCommissionPercent);
                }}
                className={styles.formInput}
                style={{ marginTop: "0.3rem" }}
              >
                <option value="">-- انتخاب مدرس --</option>
                {profiles.map((p) => (
                  <option key={p.teacherId} value={p.teacherId}>
                    {p.teacherName} ({p.currentTier} - سهم {p.effectiveCommissionPercent}٪)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>نوع قرارداد:</label>
              <select
                value={newContractType}
                onChange={(e) => setNewContractType(e.target.value as ContractType)}
                className={styles.formInput}
                style={{ marginTop: "0.3rem" }}
              >
                <option value="teaching_agreement">قرارداد همکاری آموزشی و برگزاری کلاس (Teaching Agreement)</option>
                <option value="content_ip_assignment">قرارداد واگذاری حقوق مادی و معنوی محتوا (IP Rights)</option>
                <option value="nda_confidentiality">توافق‌نامه حفظ محرمانگی و عدم افشا (NDA)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>عنوان رسمی قرارداد:</label>
              <input
                type="text"
                placeholder="مثال: قرارداد همکاری تدریس مسترکلاس آیلتس سال ۱۴۰۵"
                value={newContractTitle}
                onChange={(e) => setNewContractTitle(e.target.value)}
                className={styles.formInput}
                style={{ marginTop: "0.3rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>خلاصه تعهدات و مفاد کلیدی:</label>
              <textarea
                value={newContractTerms}
                onChange={(e) => setNewContractTerms(e.target.value)}
                className={styles.modalTextarea}
                placeholder="مفاد آموزشی، حداقل ساعات تعهد در هفته، درصد کارمزد و جرایم تاخیر..."
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => setNewContractModalOpen(false)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnActionPrimary}
                onClick={handleCreateContractSubmit}
              >
                صدور و آماده‌سازی قرارداد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Sign Simulator Modal */}
      {otpSignModalContractId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>شبیه‌ساز ثبت امضای دیجیتال OTP پیامکی</h3>
            <p className={styles.modalDesc}>
              ثبت امضای معتبر متصل به کدملی استاد و شماره ثبت‌شده در سامانه شاپرک/خزانه‌داری
            </p>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>کد ۶ رقمی پیامک‌شده (OTP):</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className={styles.formInput}
                style={{ marginTop: "0.3rem", letterSpacing: "4px", fontSize: "1.1rem", textAlign: "center" }}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => setOtpSignModalContractId(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnActionPrimary}
                style={{ background: "#10b981" }}
                onClick={handleSignContractOtpSubmit}
              >
                ثبت امضای دیجیتال و رسمیت قرارداد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Hold Modal */}
      {legalHoldTeacher && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>
              {legalHoldTeacher.isLegalHoldActive ? "لغو فریز حقوقی تسویه‌حساب" : "فعال‌سازی فریز حقوقی تسویه‌حساب"}
            </h3>
            <p className={styles.modalDesc}>
              مدرس: <strong>{legalHoldTeacher.teacherName}</strong> (کدملی: {legalHoldTeacher.nationalId})
            </p>
            {!legalHoldTeacher.isLegalHoldActive ? (
              <div>
                <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>علت فریز تسویه‌حساب:</label>
                <textarea
                  value={legalHoldReason}
                  onChange={(e) => setLegalHoldReason(e.target.value)}
                  className={styles.modalTextarea}
                  placeholder="علت اختلاف حقوقی، شکایت زبان‌آموزان یا نقض کپی‌رایت..."
                />
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                علت فریز فعلی: {legalHoldTeacher.legalHoldReason || "تحت بررسی حقوقی"}
                <br />
                با لغو این فریز، امکان تسویه‌حساب مجدد در سامانه خزانه‌داری آزاد خواهد شد.
              </p>
            )}
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => setLegalHoldTeacher(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnActionDanger}
                style={{ background: legalHoldTeacher.isLegalHoldActive ? "#10b981" : "#ef4444", color: "#ffffff" }}
                onClick={() => handleToggleLegalHoldSubmit(!legalHoldTeacher.isLegalHoldActive)}
              >
                {legalHoldTeacher.isLegalHoldActive ? "لغو فریز حقوقی" : "اعمال فریز حقوقی و مسدودسازی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Rate Modal */}
      {taxModalTeacher && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>تنظیم نرخ مالیات تکلیفی برای {taxModalTeacher.teacherName}</h3>
            <p className={styles.modalDesc}>
              درصد مالیات تکلیفی مصوب که در زمان تسویه‌حساب از منبع کسر و به حساب دارایی منظور می‌شود.
            </p>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>نرخ مالیات تکلیفی (درصد):</label>
              <input
                type="number"
                min="0"
                max="25"
                value={taxPercent}
                onChange={(e) => setTaxPercent(parseInt(e.target.value, 10))}
                className={styles.formInput}
                style={{ marginTop: "0.3rem" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem", display: "block" }}>
                برای دوره‌های دارای مجوز معافیت رسمی از سازمان پژوهش عدد ۰ وارد شود.
              </span>
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => setTaxModalTeacher(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnActionPrimary}
                onClick={handleUpdateTaxRateSubmit}
              >
                ذخیره نرخ مالیات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>
            <span>📜</span>
            <span>سامانه قراردادها، سطوح کارمزد و اسناد حقوقی اساتید (Legal & Commission Studio)</span>
          </h1>
          <p className={styles.headerDesc}>
            مدیریت نظام پله‌ای کارمزدها (برنزی ۷۰٪ تا الماسی ۸۵٪)، چرخه حیات و امضای دیجیتال OTP قراردادها،
            گاردریل مسدودسازی تسویه‌حساب (Hard Payout Gate) و مدیریت مالیات تکلیفی
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.btnResetSeed} onClick={handleResetSeed}>
            <span>🔄</span>
            <span>بازنشانی پیش‌فرض</span>
          </button>
          <button type="button" className={styles.btnRefresh} onClick={fetchData}>
            <span>⚡</span>
            <span>بروزرسانی داده‌ها</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(147, 51, 234, 0.15)", color: "#c084fc" }}>
            👥
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>اساتید طرف قرارداد</span>
            <span className={styles.statValue}>{stats.totalTeachersUnderContract} مدرس</span>
            <span className={styles.statSubtext}>میانگین سهم: ٪{stats.avgTeacherCommissionPercent}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            📜
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>قراردادهای رسمی فعال</span>
            <span className={styles.statValue}>{stats.activeContractsCount} سند</span>
            <span className={styles.statSubtext}>امضاشده با OTP معتبر</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            ⏳
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>در انتظار امضای دیجیتال</span>
            <span className={styles.statValue}>{stats.pendingSignaturesCount} قرارداد</span>
            <span className={styles.statSubtext}>تسویه‌حساب موقتاً مسدود</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
            🛑
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>فریز حقوقی فعال</span>
            <span className={styles.statValue}>{stats.activeLegalHoldsCount} پرونده</span>
            <span className={styles.statSubtext}>تحت بررسی انضباطی</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "tiers" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("tiers")}
        >
          <span>🎖️</span>
          <span>ماتریس سطوح کارمزد و اساتید (Commission Tiers)</span>
          <span className={styles.tabBadge}>{profiles.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "contracts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("contracts")}
        >
          <span>✍️</span>
          <span>کارتابل قراردادها و امضای دیجیتال (Contract Hub)</span>
          <span className={styles.tabBadge}>{contracts.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "compliance" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("compliance")}
        >
          <span>⚖️</span>
          <span>انطباق قانونی و گاردریل تسویه‌حساب (Payout Gate)</span>
          <span className={styles.tabBadge}>{stats.activeLegalHoldsCount} فریز</span>
        </button>
      </div>

      {/* DESK 1: TIERS MATRIX & TEACHER PROFILES */}
      {activeTab === "tiers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Tiers Cards Grid */}
          <div className={styles.tierCardsGrid}>
            {tiers.map((t) => (
              <div
                key={t.key}
                className={`${styles.tierCard} ${
                  t.key === "bronze"
                    ? styles.tierBronze
                    : t.key === "silver"
                    ? styles.tierSilver
                    : t.key === "gold"
                    ? styles.tierGold
                    : styles.tierDiamond
                }`}
              >
                <div className={styles.tierHeader}>
                  <h3 className={styles.tierName}>{t.name}</h3>
                  <span style={{ fontSize: "0.8rem", color: t.badgeColor, fontWeight: "700" }}>
                    پلتفرم: ٪{t.platformSharePercent}
                  </span>
                </div>
                <div className={styles.tierSplitBig}>٪{t.teacherSharePercent} سهم مدرس</div>
                <div className={styles.tierConditionList}>
                  <span>حداقل تدریس: {t.minTeachingHours} ساعت</span>
                  <span>حداقل فروش دوره: {t.minCourseSales} ثبت‌نام</span>
                  <span>میانگین رضایت: {t.minRating > 0 ? `${t.minRating}★` : "بدون پیش‌نیاز"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Profiles Table */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span>👥</span>
                <span>فهرست اساتید، سطوح کارمزد موثر و ارزیابی ارتقا</span>
              </h2>

              <input
                type="text"
                placeholder="جستجو بر اساس نام، کدملی یا سطح..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.formInput}
                style={{ width: "260px" }}
              />
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>استاد</th>
                    <th>کدملی</th>
                    <th>سطح فعلی</th>
                    <th>کارمزد موثر</th>
                    <th>ساعات تدریس</th>
                    <th>فروش دوره‌ها</th>
                    <th>میانگین رضایت</th>
                    <th>وضعیت قرارداد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((p) => (
                    <tr key={p.teacherId}>
                      <td style={{ fontWeight: "700" }}>{p.teacherName}</td>
                      <td style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{p.nationalId}</td>
                      <td>
                        <span
                          style={{
                            padding: "0.2rem 0.55rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: "800",
                            ...getTierBadgeStyle(p.currentTier),
                          }}
                        >
                          {p.currentTier.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#f3f4f6" }}>
                          ٪{p.effectiveCommissionPercent}
                        </span>
                        {p.isCustomOverride && (
                          <span className={styles.customOverrideBadge} title={p.customOverrideReason}>
                            سفارشی
                          </span>
                        )}
                      </td>
                      <td>{p.totalTeachingHours} ساعت</td>
                      <td>{p.totalCourseSales} عدد</td>
                      <td style={{ color: "#facc15", fontWeight: "700" }}>{p.averageRating} ★</td>
                      <td>
                        {p.hasSignedActiveContract ? (
                          <span className={styles.statusActive}>معتبر و امضاشده</span>
                        ) : (
                          <span className={styles.statusPending}>امضا نشده</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            className={styles.btnActionPrimary}
                            onClick={() => handleEvaluatePromotion(p.teacherId)}
                          >
                            سنجش ارتقا
                          </button>
                          <button
                            type="button"
                            className={styles.btnActionSecondary}
                            onClick={() => {
                              setCustomCommTeacher(p);
                              setCustomPercent(p.effectiveCommissionPercent);
                            }}
                          >
                            سهم اختصاصی
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DESK 2: CONTRACTS LIFECYCLE & OTP SIGNING */}
      {activeTab === "contracts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span>✍️</span>
                <span>کارتابل چرخه حیات قراردادها و بایگانی امضای دیجیتال OTP</span>
              </h2>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.825rem", color: "#9ca3af" }}>
                صدور قراردادهای آموزشی، واگذاری محتوا و توافق‌نامه‌های محرمانگی با استناد حقوقی
              </p>
            </div>

            <button
              type="button"
              className={styles.btnActionPrimary}
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
              onClick={() => setNewContractModalOpen(true)}
            >
              + صدور قرارداد جدید
            </button>
          </div>

          <div className={styles.contractsList}>
            {filteredContracts.map((cnt) => (
              <div key={cnt.id} className={styles.contractCard}>
                <div className={styles.contractHeader}>
                  <div>
                    <h3 className={styles.contractTitle}>{cnt.contractTitle}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.35rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#c084fc", fontWeight: "700" }}>
                        طرف اول: {cnt.teacherName}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>| نگارش: {cnt.version}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>| سهم مدرس: ٪{cnt.teacherCommissionPercent}</span>
                    </div>
                  </div>

                  <div>
                    {cnt.status === "active_signed" && (
                      <span className={styles.statusActive}>امضاشده و معتبر</span>
                    )}
                    {cnt.status === "pending_signature" && (
                      <span className={styles.statusPending}>در انتظار امضای مدرس</span>
                    )}
                    {cnt.status === "terminated" && (
                      <span className={styles.statusTerminated}>فسخ شده</span>
                    )}
                  </div>
                </div>

                <p className={styles.contractTerms}>{cnt.termsSummary}</p>

                {cnt.digitalSignature && (
                  <div className={styles.digitalSignatureSeal}>
                    <div>
                      <strong>مهر امضای دیجیتال معتبر شاپرک/اینسافت:</strong> شماره:{" "}
                      <code>{cnt.digitalSignature.signerPhone}</code> | کد رهگیری:{" "}
                      <code>{cnt.digitalSignature.otpTrackingCode}</code>
                    </div>
                    <div>
                      <span>آدرس IP: {cnt.digitalSignature.signerIp}</span> |{" "}
                      <span>تاریخ امضا: {new Date(cnt.signedAt!).toLocaleString("fa-IR")}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>
                    تاریخ صدور: {new Date(cnt.createdAt).toLocaleDateString("fa-IR")} | انقضا:{" "}
                    {cnt.expiresAt ? new Date(cnt.expiresAt).toLocaleDateString("fa-IR") : "نامحدود"}
                  </span>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {cnt.status === "pending_signature" && (
                      <>
                        <button
                          type="button"
                          className={styles.btnActionSecondary}
                          onClick={() => handleSendContract(cnt.id)}
                        >
                          ارسال مجدد پیامک امضا
                        </button>
                        <button
                          type="button"
                          className={styles.btnActionPrimary}
                          style={{ background: "#10b981" }}
                          onClick={() => {
                            setOtpSignModalContractId(cnt.id);
                            setOtpCode(Math.floor(100000 + Math.random() * 900000).toString());
                          }}
                        >
                          ثبت امضای دیجیتال OTP (شبیه‌ساز)
                        </button>
                      </>
                    )}

                    {cnt.status === "active_signed" && (
                      <button
                        type="button"
                        className={styles.btnActionDanger}
                        onClick={() => handleTerminateContract(cnt.id)}
                      >
                        فسخ زودهنگام قرارداد
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESK 3: COMPLIANCE, TAX & HARD PAYOUT GATE */}
      {activeTab === "compliance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Payout Gate Banner */}
          <div className={styles.payoutGateBanner}>
            <div className={styles.gateIcon}>⚖️</div>
            <div>
              <h3 style={{ margin: "0 0 0.3rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                گاردریل سخت‌گیرانه تسویه‌حساب خزانه‌داری (Hard Payout Gate)
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.6 }}>
                سیستم خزانه‌داری پلتفرم به صورت خودکار مانع از واریز درآمد به مدرسانی می‌شود که فاقد
                قرارداد معتبر امضاشده دیجیتالی هستند یا پرونده فریز حقوقی فعال دارند.
              </p>
            </div>
          </div>

          {/* Compliance Table */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span>🛡️</span>
                <span>جدول انطباق حقوقی اساتید و وضعیت مجوز تسویه‌حساب</span>
              </h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>مدرس</th>
                    <th>کدملی</th>
                    <th>قرارداد فعال</th>
                    <th>فریز حقوقی (Dispute Hold)</th>
                    <th>مالیات تکلیفی</th>
                    <th>مجوز تسویه‌حساب (Payout Gate)</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => {
                    const isAllowed = p.hasSignedActiveContract && !p.isLegalHoldActive;
                    return (
                      <tr key={p.teacherId}>
                        <td style={{ fontWeight: "700" }}>{p.teacherName}</td>
                        <td style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{p.nationalId}</td>
                        <td>
                          {p.hasSignedActiveContract ? (
                            <span style={{ color: "#34d399", fontWeight: "700" }}>✓ دارای قرارداد فعال</span>
                          ) : (
                            <span style={{ color: "#ef4444", fontWeight: "700" }}>✗ فاقد قرارداد امضاشده</span>
                          )}
                        </td>
                        <td>
                          {p.isLegalHoldActive ? (
                            <span className={styles.legalHoldActiveTag}>
                              🛑 فریز فعال ({p.legalHoldReason || "مسدود"})
                            </span>
                          ) : (
                            <span className={styles.legalHoldNormalTag}>✓ بدون مشکل حقوقی</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: "700" }}>٪{p.withholdingTaxPercent}</span>
                          {p.withholdingTaxPercent === 0 && (
                            <span style={{ fontSize: "0.7rem", color: "#38bdf8", marginRight: "0.3rem" }}>
                              (معاف)
                            </span>
                          )}
                        </td>
                        <td>
                          {isAllowed ? (
                            <span className={styles.gateAllowedBadge}>✓ مجاز به دریافت واریز</span>
                          ) : (
                            <span className={styles.gateBlockedBadge}>🛑 مسدود شده</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button
                              type="button"
                              className={p.isLegalHoldActive ? styles.btnActionPrimary : styles.btnActionDanger}
                              onClick={() => {
                                setLegalHoldTeacher(p);
                                setLegalHoldReason(p.legalHoldReason || "");
                              }}
                            >
                              {p.isLegalHoldActive ? "لغو فریز" : "اعمال فریز حقوقی"}
                            </button>
                            <button
                              type="button"
                              className={styles.btnActionSecondary}
                              onClick={() => {
                                setTaxModalTeacher(p);
                                setTaxPercent(p.withholdingTaxPercent);
                              }}
                            >
                              تنظیم مالیات
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
