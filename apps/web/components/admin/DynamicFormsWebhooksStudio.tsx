"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./dynamic-forms-studio.module.css";
import {
  CustomDynamicForm,
  FormSubmissionRecord,
  FormField,
  FormFieldType,
  INITIAL_FORMS,
  INITIAL_SUBMISSIONS,
} from "@/lib/admin-forms-webhooks-store";

type FormStudioTab = "forms" | "submissions" | "automations" | "analytics";

export function DynamicFormsWebhooksStudio() {
  const [activeTab, setActiveTab] = useState<FormStudioTab>("forms");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Forms State
  const [forms, setForms] = useState<CustomDynamicForm[]>(INITIAL_FORMS);
  const [formsLoading, setFormsLoading] = useState<boolean>(false);

  // Selected Form for Editing / Viewing
  const [editingForm, setEditingForm] = useState<CustomDynamicForm | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [embedModalForm, setEmbedModalForm] = useState<CustomDynamicForm | null>(null);

  // Submissions State
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>(INITIAL_SUBMISSIONS);
  const [selectedFormFilter, setSelectedFormFilter] = useState<string>("all");
  const [inspectSubmission, setInspectSubmission] = useState<FormSubmissionRecord | null>(null);

  // Automations Form Selector & State
  const [selectedAutoFormId, setSelectedAutoFormId] = useState<string>(INITIAL_FORMS[0]?.id || "");
  const [autoFormState, setAutoFormState] = useState<CustomDynamicForm["automations"]>(
    INITIAL_FORMS[0]?.automations || {
      telegramEnabled: false,
      telegramChatId: "",
      smsEnabled: false,
      smsTemplate: "",
      webhookEnabled: false,
      webhookUrl: "",
    }
  );
  const [testingWebhook, setTestingWebhook] = useState<boolean>(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    statusCode: number;
    latencyMs: number;
    message: string;
  } | null>(null);

  // Notification helper
  const notify = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fetch Forms
  const fetchForms = useCallback(async () => {
    try {
      setFormsLoading(true);
      const res = await fetch("/api/admin/forms");
      const data = await res.json();
      if (data.success && data.forms) {
        setForms(data.forms);
      }
    } catch {
      // fallback smoothly
    } finally {
      setFormsLoading(false);
    }
  }, []);

  // Fetch Submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      const url = `/api/admin/forms/submissions?formId=${selectedFormFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch {
      // fallback
    }
  }, [selectedFormFilter]);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, [fetchForms, fetchSubmissions]);

  // Sync selected form for automations tab
  useEffect(() => {
    const target = forms.find((f) => f.id === selectedAutoFormId);
    if (target) {
      setAutoFormState({ ...target.automations });
    }
  }, [selectedAutoFormId, forms]);

  // Save Form Handler
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;

    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", form: editingForm }),
      });
      const data = await res.json();
      if (data.success && data.form) {
        notify(data.message);
        setShowFormModal(false);
        setEditingForm(null);
        fetchForms();
      } else {
        notify(data.error || "خطا در ذخیره فرم", true);
      }
    } catch {
      notify("خطا در برقراری ارتباط با سرور", true);
    }
  };

  // Delete Form Handler
  const handleDeleteForm = async (formId: string) => {
    if (!confirm("آیا از حذف این فرم و تمامی پاسخ‌های ثبت‌شده آن اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: formId }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        fetchForms();
      } else {
        notify(data.error || "خطا در حذف فرم", true);
      }
    } catch {
      notify("خطا در حذف فرم", true);
    }
  };

  // Add Field to Editing Form
  const handleAddField = (type: FormFieldType) => {
    if (!editingForm) return;
    const newField: FormField = {
      id: `fld_${Date.now()}`,
      type,
      label: `فیلد جدید (${type})`,
      placeholder: "",
      isRequired: true,
      options: type === "radio" || type === "checkbox" || type === "select" ? ["گزینه ۱", "گزینه ۲"] : undefined,
    };
    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField],
    });
  };

  // Remove Field from Editing Form
  const handleRemoveField = (fieldId: string) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.filter((f) => f.id !== fieldId),
    });
  };

  // Update Field property
  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    });
  };

  // Save Automations
  const handleSaveAutomations = async () => {
    const target = forms.find((f) => f.id === selectedAutoFormId);
    if (!target) return;

    try {
      const updatedForm = { ...target, automations: autoFormState };
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", form: updatedForm }),
      });
      const data = await res.json();
      if (data.success) {
        notify("تنظیمات خط لوله وب‌هوک و اعلان‌ها با موفقیت ذخیره شد.");
        fetchForms();
      } else {
        notify(data.error || "خطا در ذخیره اتوماسیون", true);
      }
    } catch {
      notify("خطا در ذخیره اتوماسیون", true);
    }
  };

  // Test Webhook Ping
  const handleTestWebhook = async () => {
    if (!autoFormState.webhookUrl || !autoFormState.webhookUrl.startsWith("http")) {
      alert("لطفاً یک آدرس اینترنتی معتبر (شروع شده با https://) وارد نمایید.");
      return;
    }

    try {
      setTestingWebhook(true);
      setWebhookTestResult(null);
      const res = await fetch("/api/admin/forms/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: autoFormState.webhookUrl }),
      });
      const data = await res.json();
      setWebhookTestResult({
        success: data.success,
        statusCode: data.statusCode,
        latencyMs: data.latencyMs,
        message: data.message,
      });
      notify(data.message, !data.success);
    } catch {
      notify("خطا در اتصال به وب‌هوک آزمایشی", true);
    } finally {
      setTestingWebhook(false);
    }
  };

  // Export Submissions CSV
  const handleExportCSV = () => {
    if (!submissions.length) return;
    const headers = ["شناسه", "فرم", "تاریخ", "شماره تماس", "ایمیل", "وضعیت وب‌هوک", "پاسخ‌ها"];
    const rows = submissions.map((s) => [
      s.id,
      s.formSlug,
      s.submittedAt,
      s.respondentPhone || "",
      s.respondentEmail || "",
      s.webhookStatus,
      JSON.stringify(s.answers).replace(/"/g, '""'),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `endoora_form_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Submissions JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `endoora_form_submissions_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

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
            <h2>استودیو فرم‌ساز پویا و اتوماسیون وب‌هوک‌ها (Forms & Webhooks Studio)</h2>
            <p>
              طراحی انواع پرسشنامه، آزمون‌های تعیین سطح با ضبط صوت، فرم‌های استخدام و نظرسنجی با اتصال خودکار به تلگرام، پیامک و CRM
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                setEditingForm({
                  id: `frm_${Date.now()}`,
                  slug: `form-${Date.now().toString().slice(-4)}`,
                  titleFa: "فرم جدید ایندورا",
                  titleEn: "New Dynamic Form",
                  descriptionFa: "توضیحات راهنمای تکمیل فرم...",
                  status: "published",
                  submissionCount: 0,
                  viewCount: 0,
                  successMessageFa: "پاسخ شما با موفقیت ثبت شد.",
                  createdAt: new Date().toLocaleDateString("fa-IR"),
                  updatedAt: new Date().toLocaleDateString("fa-IR"),
                  createdBy: "مدیر ارشد",
                  fields: [
                    { id: "f_name", type: "text", label: "نام کامل", isRequired: true },
                    { id: "f_phone", type: "phone", label: "شماره تماس", isRequired: true },
                  ],
                  automations: {
                    telegramEnabled: false,
                    telegramChatId: "",
                    smsEnabled: false,
                    smsTemplate: "",
                    webhookEnabled: false,
                    webhookUrl: "",
                  },
                });
                setShowFormModal(true);
              }}
            >
              ➕ ساخت فرم پویای جدید
            </button>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <nav className={styles.subTabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "forms" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("forms")}
          >
            🎨 مدیریت و طراح فرم‌ها
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "submissions" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            📥 صندوق ورودی پاسخ‌ها ({submissions.length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "automations" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("automations")}
          >
            ⚡ وب‌هوک‌ها و پایپ‌لاین تلگرام/SMS
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "analytics" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            📊 تحلیل و نرخ تبدیل فرم‌ها
          </button>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 1. Sub-Tab: Forms Manager & Visual Builder */}
      {/* ===================================================================== */}
      {activeTab === "forms" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>لیست فرم‌های فعال و منتشرشده پلتفرم</h3>
              <p>هر فرم دارای آدرس مستقل در `/f/[slug]` و کد امبد اختصاصی جهت تعبیه درون لندینگ‌پیج‌ها است.</p>
            </div>
          </div>

          <div className={styles.formsGrid}>
            {forms.map((form) => (
              <div key={form.id} className={styles.formCard}>
                <div>
                  <div className={styles.formCardTop}>
                    <div>
                      <h4 className={styles.formTitleFa}>{form.titleFa}</h4>
                      <p className={styles.formSlugBadge}>/f/{form.slug}</p>
                    </div>
                    <span
                      className={
                        form.status === "published"
                          ? styles.badgePublished
                          : form.status === "draft"
                          ? styles.badgeDraft
                          : styles.badgeClosed
                      }
                    >
                      {form.status === "published" ? "منتشر شده" : form.status === "draft" ? "پیش‌نویس" : "بسته شده"}
                    </span>
                  </div>
                  <p className={styles.formDesc}>{form.descriptionFa}</p>
                </div>

                <div className={styles.formMetaRow}>
                  <span>تعداد فیلدها: <strong>{form.fields.length}</strong></span>
                  <span>پاسخ‌های دریافتی: <strong>{form.submissionCount}</strong></span>
                  <span>بازدید: <strong>{form.viewCount}</strong></span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <a
                    href={`/f/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnSecondary}
                    style={{ flex: 1, textDecoration: "none", justifyContent: "center", fontSize: "0.8rem" }}
                  >
                    👁️ مشاهده زنده
                  </a>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => setEmbedModalForm(form)}
                  >
                    🔗 کد امبد
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => {
                      setEditingForm({ ...form });
                      setShowFormModal(true);
                    }}
                  >
                    ✏️ ویرایش فیلدها
                  </button>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
                    onClick={() => handleDeleteForm(form.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Sub-Tab: Submissions Inbox */}
      {/* ===================================================================== */}
      {activeTab === "submissions" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>صندوق ورودی پاسخ‌ها و داده‌های ارسالی مخاطبان</h3>
              <p>مشاهده متن پاسخ‌ها، پخش آنلاین وویس‌های ضبط شده اسپیکینگ و برون‌بری اکسل</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={handleExportCSV}>
                📥 خروجی CSV (اکسل)
              </button>
              <button type="button" className={styles.btnSecondary} onClick={handleExportJSON}>
                📥 خروجی JSON
              </button>
            </div>
          </div>

          {/* Form Filter Selector */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>فیلتر بر اساس فرم:</span>
            <select
              className={styles.formSelect}
              style={{ width: "auto", minWidth: "250px" }}
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
            >
              <option value="all">همه فرم‌ها (نمایش کلی)</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titleFa}
                </option>
              ))}
            </select>
          </div>

          {/* Submissions Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>شناسه ثبت</th>
                  <th>نام فرم</th>
                  <th>مشخصات متقاضی</th>
                  <th>زمان ثبت</th>
                  <th>وضعیت وب‌هوک</th>
                  <th>وضعیت تلگرام</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                      پاسخی برای این فرم ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontFamily: "monospace", color: "#64748b" }}>{sub.id}</td>
                      <td style={{ fontWeight: "700" }}>{sub.formSlug}</td>
                      <td>
                        <div>{sub.respondentPhone || sub.respondentEmail || "کاربر مهمان"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>IP: {sub.respondentIp}</div>
                      </td>
                      <td>{sub.submittedAt}</td>
                      <td>
                        <span
                          className={
                            sub.webhookStatus === "success"
                              ? styles.badgePublished
                              : sub.webhookStatus === "failed"
                              ? styles.badgeClosed
                              : styles.badgeDraft
                          }
                        >
                          {sub.webhookStatus === "success" ? "ارسال شد" : sub.webhookStatus === "failed" ? "ناموفق" : "ندارد"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            sub.telegramStatus === "sent"
                              ? styles.badgePublished
                              : sub.telegramStatus === "failed"
                              ? styles.badgeClosed
                              : styles.badgeDraft
                          }
                        >
                          {sub.telegramStatus === "sent" ? "ارسال شد" : sub.telegramStatus === "failed" ? "ناموفق" : "ندارد"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                          onClick={() => setInspectSubmission(sub)}
                        >
                          مشاهده پاسخ‌ها 👁️
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
      {/* 3. Sub-Tab: Webhooks & Automations Pipeline */}
      {/* ===================================================================== */}
      {activeTab === "automations" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>تنظیم خط لوله اتوماسیون، وب‌هوک و اعلان‌های بلادرنگ</h3>
              <p>تعیین کنید پس از ثبت هر فرم، چه پیامک، اعلان تلگرام یا دیسپچ وب‌هوکی به سیستم‌های خارجی انجام شود.</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className={styles.btnPrimary} onClick={handleSaveAutomations}>
                💾 ذخیره تنظیمات اتوماسیون
              </button>
            </div>
          </div>

          {/* Select Target Form */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>انتخاب فرم هدف:</span>
            <select
              className={styles.formSelect}
              style={{ width: "auto", minWidth: "280px" }}
              value={selectedAutoFormId}
              onChange={(e) => setSelectedAutoFormId(e.target.value)}
            >
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titleFa} (/f/{f.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Automations Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Telegram Automation */}
            <div className={styles.automationCard}>
              <div className={styles.automationHeader}>
                <div>
                  <h4>📢 ارسال فوری خلاصه پاسخ به تلگرام (Telegram Bot Notification)</h4>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                    ارسال خلاصه نام، شماره و لینک فایل صوتی/رزومه به گروه یا کانال اختصاصی مدیران
                  </p>
                </div>
                <label className={styles.toggleSwitch} style={{ transform: "scale(0.85)" }}>
                  <input
                    type="checkbox"
                    checked={autoFormState.telegramEnabled}
                    onChange={(e) => setAutoFormState({ ...autoFormState, telegramEnabled: e.target.checked })}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              {autoFormState.telegramEnabled && (
                <div className={styles.formGroup}>
                  <label>شناسه کانال یا چت تلگرام (Chat ID):</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    placeholder="@endoora_admissions_bot or -100123456789"
                    value={autoFormState.telegramChatId}
                    onChange={(e) => setAutoFormState({ ...autoFormState, telegramChatId: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Kavenegar SMS Automation */}
            <div className={styles.automationCard}>
              <div className={styles.automationHeader}>
                <div>
                  <h4>📱 ارسال پیامک خودکار تایید به مخاطب (Kavenegar OTP & Pattern)</h4>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                    ارسال آنی پیامک تشکر و کد پیگیری به شماره همراه وارد شده در فرم
                  </p>
                </div>
                <label className={styles.toggleSwitch} style={{ transform: "scale(0.85)" }}>
                  <input
                    type="checkbox"
                    checked={autoFormState.smsEnabled}
                    onChange={(e) => setAutoFormState({ ...autoFormState, smsEnabled: e.target.checked })}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              {autoFormState.smsEnabled && (
                <div className={styles.formGroup}>
                  <label>نام الگوی کاوه‌نگار (Pattern Template):</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    placeholder="e.g. ielts_placement_received"
                    value={autoFormState.smsTemplate}
                    onChange={(e) => setAutoFormState({ ...autoFormState, smsTemplate: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* External Webhook */}
            <div className={styles.automationCard}>
              <div className={styles.automationHeader}>
                <div>
                  <h4>🌐 دیسپچ وب‌هوک به سیستم خارجی (Outbound POST JSON Webhook)</h4>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                    ارسال بلادرنگ کل بدنه پاسخ‌ها به آدرس CRM، اتوماسیون Zapier یا سرور اختصاصی شما
                  </p>
                </div>
                <label className={styles.toggleSwitch} style={{ transform: "scale(0.85)" }}>
                  <input
                    type="checkbox"
                    checked={autoFormState.webhookEnabled}
                    onChange={(e) => setAutoFormState({ ...autoFormState, webhookEnabled: e.target.checked })}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              {autoFormState.webhookEnabled && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label>آدرس وب‌هوک مقصد (Endpoint URL):</label>
                    <input
                      type="text"
                      dir="ltr"
                      className={styles.formInput}
                      placeholder="https://api.yourcrm.com/v1/leads"
                      value={autoFormState.webhookUrl}
                      onChange={(e) => setAutoFormState({ ...autoFormState, webhookUrl: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={handleTestWebhook}
                      disabled={testingWebhook}
                    >
                      {testingWebhook ? "در حال ارسال پینگ..." : "⚡ تست زنده ارسال وب‌هوک"}
                    </button>
                    {webhookTestResult && (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: webhookTestResult.success ? "#10b981" : "#ef4444",
                        }}
                      >
                        {webhookTestResult.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. Sub-Tab: Form Analytics & Conversion Insights */}
      {/* ===================================================================== */}
      {activeTab === "analytics" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>شاخص‌ها و آمار تعاملات فرم‌های پلتفرم</h3>
              <p>بررسی تعداد بازدید، تعداد تکمیل نهایی و نرخ تبدیل (Conversion Rate)</p>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>نام فرم</th>
                  <th>آدرس اسلاگ</th>
                  <th>تعداد بازدید (Views)</th>
                  <th>پاسخ‌های ثبت‌شده (Submissions)</th>
                  <th>نرخ تبدیل (CR%)</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((f) => {
                  const cr = f.viewCount > 0 ? ((f.submissionCount / f.viewCount) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={f.id}>
                      <td style={{ fontWeight: "700" }}>{f.titleFa}</td>
                      <td style={{ fontFamily: "monospace", color: "#64748b" }}>/f/{f.slug}</td>
                      <td>{f.viewCount.toLocaleString()}</td>
                      <td>{f.submissionCount.toLocaleString()}</td>
                      <td>
                        <strong style={{ color: Number(cr) > 15 ? "#10b981" : "#2563eb" }}>{cr}%</strong>
                      </td>
                      <td>
                        <span
                          className={
                            f.status === "published"
                              ? styles.badgePublished
                              : f.status === "draft"
                              ? styles.badgeDraft
                              : styles.badgeClosed
                          }
                        >
                          {f.status === "published" ? "فعال" : f.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Modals */}
      {/* ===================================================================== */}

      {/* Form Fields & Editor Modal */}
      {showFormModal && editingForm && (
        <div className={styles.modalBackdrop} onClick={() => setShowFormModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "750px" }}>
            <div className={styles.modalHeader}>
              <h3>طراحی و ویرایش فیلدهای فرم: {editingForm.titleFa}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setShowFormModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label>عنوان فارسی فرم:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    required
                    value={editingForm.titleFa}
                    onChange={(e) => setEditingForm({ ...editingForm, titleFa: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>نامک انگلیسی (Slug):</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    required
                    value={editingForm.slug}
                    onChange={(e) => setEditingForm({ ...editingForm, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>توضیحات و راهنمای فرم:</label>
                <textarea
                  rows={2}
                  className={styles.formTextarea}
                  value={editingForm.descriptionFa}
                  onChange={(e) => setEditingForm({ ...editingForm, descriptionFa: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label>وضعیت انتشار:</label>
                  <select
                    className={styles.formSelect}
                    value={editingForm.status}
                    onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value as typeof editingForm.status })}
                  >
                    <option value="published">منتشر شده (Published)</option>
                    <option value="draft">پیش‌نویس (Draft)</option>
                    <option value="closed">بسته شده (Closed)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>پیام پس از ثبت موفقیت‌آمیز:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editingForm.successMessageFa}
                    onChange={(e) => setEditingForm({ ...editingForm, successMessageFa: e.target.value })}
                  />
                </div>
              </div>

              {/* Fields List */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                    فیلدهای فرم ({editingForm.fields.length} فیلد):
                  </strong>
                </div>

                {/* Add Field Buttons Bar */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("text")} style={{ fontSize: "0.75rem" }}>
                    + متن تک‌خطی
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("textarea")} style={{ fontSize: "0.75rem" }}>
                    + متن چندخطی
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("select")} style={{ fontSize: "0.75rem" }}>
                    + منوی کشویی
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("radio")} style={{ fontSize: "0.75rem" }}>
                    + رادیویی
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("rating")} style={{ fontSize: "0.75rem" }}>
                    + ریتینگ ستاره‌ای
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("voice_recording")} style={{ fontSize: "0.75rem", background: "#fef2f2", color: "#dc2626" }}>
                    🎙️ ضبط وویس زنده
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => handleAddField("file_upload")} style={{ fontSize: "0.75rem" }}>
                    📁 آپلود فایل / PDF
                  </button>
                </div>

                {/* Fields Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
                  {editingForm.fields.map((field, idx) => (
                    <div
                      key={field.id}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#64748b" }}>#{idx + 1}</span>
                          <span className={styles.badgeDraft}>{field.type}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.closeBtn}
                          style={{ fontSize: "1.1rem" }}
                          onClick={() => handleRemoveField(field.id)}
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="عنوان فیلد..."
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                        />
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="متن نگهدارنده (Placeholder)..."
                          value={field.placeholder || ""}
                          onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={field.isRequired}
                            onChange={(e) => handleUpdateField(field.id, { isRequired: e.target.checked })}
                          />
                          <span>تکمیل این فیلد اجباری است</span>
                        </label>

                        {field.options && (
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            گزینه‌ها: {field.options.join("، ")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowFormModal(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  💾 ذخیره و انتشار فرم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {embedModalForm && (
        <div className={styles.modalBackdrop} onClick={() => setEmbedModalForm(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <div className={styles.modalHeader}>
              <h3>کد امبد و لینک اشتراک‌گذاری فرم</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setEmbedModalForm(null)}>
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label>لینک عمومی مستقل فرم:</label>
                <input
                  type="text"
                  dir="ltr"
                  readOnly
                  className={styles.formInput}
                  value={`https://endoora.ir/f/${embedModalForm.slug}`}
                />
              </div>

              <div className={styles.formGroup}>
                <label>کد قرارگیری درون صفحات لندینگ (IFrame Embed):</label>
                <textarea
                  rows={3}
                  dir="ltr"
                  readOnly
                  className={styles.formTextarea}
                  value={`<iframe src="https://endoora.ir/f/${embedModalForm.slug}" width="100%" height="700" frameborder="0"></iframe>`}
                />
              </div>

              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                می‌توانید این کد را مستقیماً درون بلوک‌های ماژول «استودیو صفحات و ناوبری (Site Builder)» قرار دهید.
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => {
                    navigator.clipboard.writeText(`<iframe src="https://endoora.ir/f/${embedModalForm.slug}" width="100%" height="700" frameborder="0"></iframe>`);
                    notify("کد امبد در کلیپ‌بورد کپی شد.");
                    setEmbedModalForm(null);
                  }}
                >
                  📋 کپی کد امبد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Submission Modal */}
      {inspectSubmission && (
        <div className={styles.modalBackdrop} onClick={() => setInspectSubmission(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className={styles.modalHeader}>
              <h3>جزییات پاسخ ارسالی {inspectSubmission.id}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setInspectSubmission(null)}>
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>زمان ثبت: <strong>{inspectSubmission.submittedAt}</strong></div>
                <div>آی‌پی: <strong style={{ fontFamily: "monospace" }}>{inspectSubmission.respondentIp}</strong></div>
              </div>

              <h4 style={{ margin: "0.5rem 0 0 0", fontSize: "0.95rem", color: "#0f172a" }}>پاسخ‌های ثبت‌شده:</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {Object.entries(inspectSubmission.answers).map(([key, val]) => (
                  <div key={key} style={{ background: "#f8fafc", padding: "0.6rem 0.85rem", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>فیلد: {key}</div>
                    {typeof val === "string" && val.endsWith(".mp3") ? (
                      <div style={{ marginTop: "0.4rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: "700" }}>🎙️ فایل صوتی ضبط‌شده:</span>
                        <audio src={val} controls style={{ width: "100%", marginTop: "0.25rem" }} />
                      </div>
                    ) : typeof val === "string" && val.endsWith(".pdf") ? (
                      <div style={{ marginTop: "0.25rem" }}>
                        <a href={val} download style={{ color: "#2563eb", textDecoration: "underline", fontSize: "0.85rem" }}>
                          📄 دانلود فایل رزومه / کارنامه ({val})
                        </a>
                      </div>
                    ) : (
                      <strong style={{ color: "#0f172a", fontSize: "0.9rem" }}>{String(val ?? "—")}</strong>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => setInspectSubmission(null)}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
