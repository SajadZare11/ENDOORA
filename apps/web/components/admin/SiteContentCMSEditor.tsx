"use client";

import React, { useEffect, useState } from "react";
import styles from "./site-cms-editor.module.css";
import {
  DEFAULT_SITE_CONTENT,
  type FaqItemConfig,
  type LearningStepConfig,
  type PricingPlanConfig,
  type SiteContentData,
  type SiteContentVersionRecord,
} from "../../lib/site-cms-content";

type CmsTab =
  | "banner"
  | "hero"
  | "learning"
  | "skills"
  | "pricing"
  | "faqs"
  | "footer"
  | "history";

export function SiteContentCMSEditor() {
  const [content, setContent] = useState<SiteContentData>(DEFAULT_SITE_CONTENT);
  const [liveVersion, setLiveVersion] = useState<number>(1);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [versions, setVersions] = useState<SiteContentVersionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<CmsTab>("banner");
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const fetchCmsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/site-content");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.draft) {
            setContent(json.draft);
            setHasDraft(true);
          } else if (json.live) {
            setContent(json.live);
            setHasDraft(false);
          }
          if (json.live?.version) {
            setLiveVersion(json.live.version);
          }
          if (json.versions) {
            setVersions(json.versions);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch site content API, using local defaults:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const showNotification = (text: string, type: "success" | "error" | "info" = "info") => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          data: content,
          user: "مدیر ارشد ایندورا",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setHasDraft(true);
        showNotification("پیش‌نویس با موفقیت ذخیره شد. هنوز در سایت عمومی منتشر نشده است.", "info");
      } else {
        showNotification(json.error || "خطا در ذخیره پیش‌نویس", "error");
      }
    } catch {
      showNotification("خطا در برقراری ارتباط با سرور", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const summary = prompt("خلاصه تغییرات این نسخه را وارد کنید (اختیاری):", "بروزرسانی محتوای بخش‌های سایت");
    if (summary === null) return;

    setIsSaving(true);
    try {
      // First ensure current edits are saved as draft
      await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_draft", data: content }),
      });

      // Now publish
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          summary: summary.trim() || "انتشار تغییرات جدید",
          user: "مدیر ارشد ایندورا",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setHasDraft(false);
        setLiveVersion(json.published.version);
        showNotification(`نسخه ${json.published.version} با موفقیت در سراسر سایت عمومی منتشر شد! 🎉`, "success");
        fetchCmsData();
      } else {
        showNotification(json.error || "خطا در انتشار", "error");
      }
    } catch {
      showNotification("خطا در ارسال درخواست انتشار", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardDraft = async () => {
    if (!confirm("آیا از لغو پیش‌نویس و بازگشت به نسخه زنده سایت اطمینان دارید؟ تغییرات ذخیره‌نشده پاک خواهند شد.")) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discard_draft" }),
      });
      const json = await res.json();
      if (json.success) {
        setHasDraft(false);
        showNotification("پیش‌نویس لغو شد و نسخه زنده فعلی سایت بارگذاری گردید.", "info");
        fetchCmsData();
      }
    } catch {
      showNotification("خطا در لغو پیش‌نویس", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (targetVer: number) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید سایت را به نسخه شماره ${targetVer} بازگردانید؟`)) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", version: targetVer }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(json.message, "success");
        fetchCmsData();
      } else {
        showNotification(json.error || "خطا در بازگشت به نسخه قبل", "error");
      }
    } catch {
      showNotification("خطا در ارتباط با سرور", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید تمام تنظیمات و متون سایت را به حالت پیش‌فرض کارخانه بازنشانی کنید؟")) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_default" }),
      });
      const json = await res.json();
      if (json.success) {
        setContent(DEFAULT_SITE_CONTENT);
        showNotification(json.message, "success");
        fetchCmsData();
      }
    } catch {
      showNotification("خطا در بازنشانی تنظیمات", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper updater functions for nested state
  const updateBanner = (fields: Partial<typeof content.banner>) => {
    setContent((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...fields },
    }));
    setHasDraft(true);
  };

  const updateHero = (fields: Partial<typeof content.hero>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...fields },
    }));
    setHasDraft(true);
  };

  const updateSkillsHub = (fields: Partial<typeof content.skillsHub>) => {
    setContent((prev) => ({
      ...prev,
      skillsHub: { ...prev.skillsHub, ...fields },
    }));
    setHasDraft(true);
  };

  const updateFooter = (fields: Partial<typeof content.footer>) => {
    setContent((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...fields },
    }));
    setHasDraft(true);
  };

  const updateLearningStep = (index: number, fields: Partial<LearningStepConfig>) => {
    const list = [...content.learningSteps];
    list[index] = { ...list[index], ...fields };
    setContent((prev) => ({ ...prev, learningSteps: list }));
    setHasDraft(true);
  };

  const updatePricingPlan = (index: number, fields: Partial<PricingPlanConfig>) => {
    const list = [...content.pricingPlans];
    list[index] = { ...list[index], ...fields };
    setContent((prev) => ({ ...prev, pricingPlans: list }));
    setHasDraft(true);
  };

  const updateFaq = (index: number, fields: Partial<FaqItemConfig>) => {
    const list = [...content.faqs];
    list[index] = { ...list[index], ...fields };
    setContent((prev) => ({ ...prev, faqs: list }));
    setHasDraft(true);
  };

  const handleAddFaq = () => {
    const newFaq: FaqItemConfig = {
      id: `faq-${Date.now()}`,
      category: "general",
      questionFa: "سوال جدید مدیر...",
      answerFa: "پاسخ تشریحی سوال جدید...",
    };
    setContent((prev) => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    setHasDraft(true);
  };

  const handleDeleteFaq = (index: number) => {
    const list = content.faqs.filter((_, i) => i !== index);
    setContent((prev) => ({ ...prev, faqs: list }));
    setHasDraft(true);
  };

  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-muted)" }}>در حال بارگذاری مرکز محتوای سایت...</div>;
  }

  return (
    <div className={styles.cmsContainer} dir="rtl">
      {/* 1. Header Toolbar */}
      <div className={styles.cmsHeaderBar}>
        <div className={styles.cmsTitleBlock}>
          <div className={styles.cmsTitle}>
            <span>مدیریت و ویرایشگر دیداری بخش‌های سایت (Site CMS)</span>
            {hasDraft ? (
              <span className={styles.badgeDraft}>⚠️ دارای تغییرات پیش‌نویس منتشر نشده</span>
            ) : (
              <span className={styles.badgeLive}>🟢 زنده در سایت (نسخه {liveVersion})</span>
            )}
          </div>
          <p className={styles.cmsSubtitle}>
            تنظیم متون، بنرها، بخش هیرو، مراحل یادگیری، مهارت‌ها و قیمت‌گذاری به صورت لحظه‌ای با پیش‌نمایش درجا
          </p>
        </div>

        <div className={styles.cmsActionsBar}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setShowLivePreview(!showLivePreview)}
          >
            {showLivePreview ? "👁️ پنهان کردن پیش‌نمایش" : "👁️ پیش‌نمایش زنده درجا"}
          </button>

          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            💾 ذخیره پیش‌نویس
          </button>

          {hasDraft && (
            <button
              type="button"
              className={styles.btnDanger}
              onClick={handleDiscardDraft}
              disabled={isSaving}
            >
              لغو پیش‌نویس
            </button>
          )}

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handlePublish}
            disabled={isSaving}
          >
            🚀 انتشار در سایت زنده
          </button>

          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleResetToDefaults}
            disabled={isSaving}
            title="بازنشانی تمام داده‌ها به حالت کارخانه"
          >
            ⚙️ بازنشانی کارخانه
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: "600",
            backgroundColor:
              statusMessage.type === "success"
                ? "#ecfdf5"
                : statusMessage.type === "error"
                ? "#fef2f2"
                : "#eff6ff",
            color:
              statusMessage.type === "success"
                ? "#065f46"
                : statusMessage.type === "error"
                ? "#991b1b"
                : "#1e40af",
            border: `1px solid ${
              statusMessage.type === "success"
                ? "#a7f3d0"
                : statusMessage.type === "error"
                ? "#fecaca"
                : "#bfdbfe"
            }`,
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* 2. Section Tabs */}
      <nav className={styles.sectionTabs} aria-label="تب‌های بخش‌های سایت">
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "banner" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("banner")}
        >
          📢 بنر اعلان بالا
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "hero" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("hero")}
        >
          🌟 بخش هیرو (صفحه اصلی)
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "learning" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("learning")}
        >
          🔄 مسیر یادگیری ۷ مرحله‌ای
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "skills" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          🎯 هاب مهارت‌ها و اسپات‌لایت
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "pricing" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("pricing")}
        >
          💳 پلن‌های اشتراک و قیمت
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "faqs" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("faqs")}
        >
          ❓ سوالات متداول (FAQ)
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "footer" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("footer")}
        >
          📞 فوتر و اطلاعات تماس
        </button>
        <button
          type="button"
          className={`${styles.sectionTab} ${activeTab === "history" ? styles.sectionTabActive : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📜 تاریخچه و بازگشت (Rollback)
        </button>
      </nav>

      {/* 3. Main Form Grid + Live Preview */}
      <div className={`${styles.cmsBodyGrid} ${showLivePreview ? styles.cmsBodyGridWithPreview : ""}`}>
        {/* Form Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* TAB 1: BANNER */}
          {activeTab === "banner" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>تنظیمات بنر اعلان بالای صفحه</h3>
                <p className={styles.formCardDesc}>این بنر به صورت نوار سراسری در بالاترین نقطه کلیه صفحات عمومی سایت نمایش داده می‌شود.</p>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={content.banner.enabled}
                  onChange={(e) => updateBanner({ enabled: e.target.checked })}
                />
                نمایش بنر در بالای سایت فعال باشد
              </label>

              <div className={styles.formGroup}>
                <label className={styles.label}>متن اعلان (فارسی)</label>
                <textarea
                  className={styles.textarea}
                  value={content.banner.textFa}
                  onChange={(e) => updateBanner({ textFa: e.target.value })}
                  placeholder="متن پیام اعلان..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>متن اعلان (انگلیسی)</label>
                <textarea
                  className={styles.textarea}
                  value={content.banner.textEn}
                  onChange={(e) => updateBanner({ textEn: e.target.value })}
                  dir="ltr"
                />
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>برچسب نشانگر (اختیاری)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.banner.badgeFa || ""}
                    onChange={(e) => updateBanner({ badgeFa: e.target.value })}
                    placeholder="مثال: ویژه، خبر خوب"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>متن دکمه اقدام</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.banner.actionLabelFa || ""}
                    onChange={(e) => updateBanner({ actionLabelFa: e.target.value })}
                    placeholder="مثال: مشاهده جزییات"
                  />
                </div>
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک مقصد دکمه اقدام</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.banner.actionHref || ""}
                    onChange={(e) => updateBanner({ actionHref: e.target.value })}
                    placeholder="/high-school/grade-12/tamrin20"
                    dir="ltr"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>رنگ یا گرادیان زمینه بنر</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.banner.bgColor || ""}
                    onChange={(e) => updateBanner({ bgColor: e.target.value })}
                    placeholder="linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO */}
          {activeTab === "hero" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>بخش هیرو و ویترین اصلی (Landing Hero)</h3>
                <p className={styles.formCardDesc}>بخش اصلی و نخستین تصویری که زبان‌آموزان به محض باز کردن صفحه اول مشاهده می‌کنند.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>بج بالای هیرو (Badge)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.hero.badgeFa}
                  onChange={(e) => updateHero({ badgeFa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تیتر اصلی هیرو (H1 Title)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.hero.titleFa}
                  onChange={(e) => updateHero({ titleFa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات و زیرتیتر هیرو</label>
                <textarea
                  className={styles.textarea}
                  value={content.hero.subtitleFa}
                  onChange={(e) => updateHero({ subtitleFa: e.target.value })}
                />
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان دکمه اقدام اصلی (Primary CTA)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.primaryCtaLabelFa}
                    onChange={(e) => updateHero({ primaryCtaLabelFa: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک دکمه اصلی</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.primaryCtaHref}
                    onChange={(e) => updateHero({ primaryCtaHref: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان دکمه ثانویه (Secondary CTA)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.secondaryCtaLabelFa}
                    onChange={(e) => updateHero({ secondaryCtaLabelFa: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک دکمه ثانویه</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.secondaryCtaHref}
                    onChange={(e) => updateHero({ secondaryCtaHref: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>۳ برچسب شاخص اعتماد (Trust Pills)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.trustPill1Fa}
                    onChange={(e) => updateHero({ trustPill1Fa: e.target.value })}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.trustPill2Fa}
                    onChange={(e) => updateHero({ trustPill2Fa: e.target.value })}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={content.hero.trustPill3Fa}
                    onChange={(e) => updateHero({ trustPill3Fa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEARNING STEPS */}
          {activeTab === "learning" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>مسیر یادگیری ۷ مرحله‌ای ایندورا</h3>
                <p className={styles.formCardDesc}>مراحل گام‌به‌گام از ثبت‌نام و تعیین سطح تا کلاس‌های زنده و آزمایشگاه‌های هوش مصنوعی.</p>
              </div>

              <div className={styles.itemList}>
                {content.learningSteps.map((step, idx) => (
                  <div key={step.id || idx} className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <span>
                        {step.icon} گام {step.number}: {step.titleFa}
                      </span>
                    </div>

                    <div className={styles.row2Col}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>آیکون ایموجی</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={step.icon}
                          onChange={(e) => updateLearningStep(idx, { icon: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>عنوان مرحله</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={step.titleFa}
                          onChange={(e) => updateLearningStep(idx, { titleFa: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>توضیحات</label>
                      <textarea
                        className={styles.textarea}
                        value={step.descFa}
                        onChange={(e) => updateLearningStep(idx, { descFa: e.target.value })}
                      />
                    </div>

                    <div className={styles.row2Col}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>عنوان دکمه</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={step.actionLabelFa}
                          onChange={(e) => updateLearningStep(idx, { actionLabelFa: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>لینک دکمه</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={step.actionHref}
                          onChange={(e) => updateLearningStep(idx, { actionHref: e.target.value })}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS HUB */}
          {activeTab === "skills" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>تنظیمات هاب مهارت‌ها و بخش‌های ویژه</h3>
                <p className={styles.formCardDesc}>مدیریت کارت‌های ویژه تمرین تا ۲۰ و Small Talk و متن معرفی مهارت‌های ۶ گانه.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>بج بالای هاب مهارت‌ها</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.skillsHub.badgeFa}
                  onChange={(e) => updateSkillsHub({ badgeFa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>عنوان بخش مهارت‌ها</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.skillsHub.titleFa}
                  onChange={(e) => updateSkillsHub({ titleFa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات هاب مهارت‌ها</label>
                <textarea
                  className={styles.textarea}
                  value={content.skillsHub.descriptionFa}
                  onChange={(e) => updateSkillsHub({ descriptionFa: e.target.value })}
                />
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem" }}>🎯 کارت اسپات‌لایت «تمرین تا ۲۰ - دوازدهم»</h4>
                <label className={styles.checkboxRow} style={{ marginBottom: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={content.skillsHub.tamrin20SpotlightEnabled}
                    onChange={(e) => updateSkillsHub({ tamrin20SpotlightEnabled: e.target.checked })}
                  />
                  کارت اسپات‌لایت تمرین تا ۲۰ فعال باشد
                </label>
                <div className={styles.row2Col}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>بج کارت</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={content.skillsHub.tamrin20BadgeFa}
                      onChange={(e) => updateSkillsHub({ tamrin20BadgeFa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>عنوان کارت</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={content.skillsHub.tamrin20TitleFa}
                      onChange={(e) => updateSkillsHub({ tamrin20TitleFa: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup} style={{ marginTop: "0.5rem" }}>
                  <label className={styles.label}>توضیحات کارت</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.skillsHub.tamrin20DescFa}
                    onChange={(e) => updateSkillsHub({ tamrin20DescFa: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem" }}>💬 کارت اسپات‌لایت «Small Talk و فرهنگ»</h4>
                <label className={styles.checkboxRow} style={{ marginBottom: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={content.skillsHub.smallTalkSpotlightEnabled}
                    onChange={(e) => updateSkillsHub({ smallTalkSpotlightEnabled: e.target.checked })}
                  />
                  کارت اسپات‌لایت Small Talk فعال باشد
                </label>
                <div className={styles.row2Col}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>بج کارت</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={content.skillsHub.smallTalkBadgeFa}
                      onChange={(e) => updateSkillsHub({ smallTalkBadgeFa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>عنوان کارت</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={content.skillsHub.smallTalkTitleFa}
                      onChange={(e) => updateSkillsHub({ smallTalkTitleFa: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup} style={{ marginTop: "0.5rem" }}>
                  <label className={styles.label}>توضیحات کارت</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.skillsHub.smallTalkDescFa}
                    onChange={(e) => updateSkillsHub({ smallTalkDescFa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING */}
          {activeTab === "pricing" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>پلن‌های اشتراک و قیمت‌گذاری پلتفرم</h3>
                <p className={styles.formCardDesc}>قیمت‌ها، دوره‌ها، تخفیف‌ها و لیست مزایای هر بسته اشتراکی.</p>
              </div>

              <div className={styles.itemList}>
                {content.pricingPlans.map((plan, idx) => (
                  <div key={plan.id || idx} className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <span>{plan.nameFa} {plan.isPopular && "⭐ (محبوب‌ترین)"}</span>
                      <span style={{ fontSize: "0.85rem", color: "#4f46e5" }}>
                        {plan.priceToman === 0 ? "رایگان" : `${plan.priceToman.toLocaleString("fa-IR")} تومان`}
                      </span>
                    </div>

                    <div className={styles.row2Col}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>نام پلن (فارسی)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={plan.nameFa}
                          onChange={(e) => updatePricingPlan(idx, { nameFa: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>قیمت (تومان - ۰ برای رایگان)</label>
                        <input
                          type="number"
                          className={styles.input}
                          value={plan.priceToman}
                          onChange={(e) => updatePricingPlan(idx, { priceToman: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className={styles.row2Col}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>دوره زمانی (مثال: ۳ ماهه)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={plan.periodFa}
                          onChange={(e) => updatePricingPlan(idx, { periodFa: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>برچسب (بج)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={plan.badgeFa || ""}
                          onChange={(e) => updatePricingPlan(idx, { badgeFa: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>ویژگی‌ها (هر خط یک ویژگی)</label>
                      <textarea
                        className={styles.textarea}
                        value={plan.featuresFa.join("\n")}
                        onChange={(e) =>
                          updatePricingPlan(idx, {
                            featuresFa: e.target.value.split("\n").filter((l) => l.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FAQS */}
          {activeTab === "faqs" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 className={styles.formCardTitle}>مدیریت سوالات متداول (FAQ)</h3>
                  <p className={styles.formCardDesc}>افزودن و ویرایش سوالات متداول زبان‌آموزان در صفحه اصلی و مرکز راهنما.</p>
                </div>
                <button type="button" className={styles.btnPrimary} onClick={handleAddFaq}>
                  ➕ افزودن سوال جدید
                </button>
              </div>

              <div className={styles.itemList}>
                {content.faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <span>سوال شماره {idx + 1}</span>
                      <button
                        type="button"
                        style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" }}
                        onClick={() => handleDeleteFaq(idx)}
                      >
                        🗑️ حذف
                      </button>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>صورت سوال</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={faq.questionFa}
                        onChange={(e) => updateFaq(idx, { questionFa: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>پاسخ کامل تشریحی</label>
                      <textarea
                        className={styles.textarea}
                        value={faq.answerFa}
                        onChange={(e) => updateFaq(idx, { answerFa: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FOOTER */}
          {activeTab === "footer" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>تنظیمات فوتر، شبکه‌های اجتماعی و کپی‌رایت</h3>
                <p className={styles.formCardDesc}>اطلاعات تماس، کانال‌ها، متن برند و کپی‌رایت پایین صفحات سایت.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات برند در فوتر</label>
                <textarea
                  className={styles.textarea}
                  value={content.footer.brandDescFa}
                  onChange={(e) => updateFooter({ brandDescFa: e.target.value })}
                />
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>تلفن پشتیبانی</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.footer.phone}
                    onChange={(e) => updateFooter({ phone: e.target.value })}
                    dir="ltr"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ایمیل رسمی پشتیبانی</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={content.footer.email}
                    onChange={(e) => updateFooter({ email: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>آدرس فیزیکی دفتر</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.footer.addressFa}
                  onChange={(e) => updateFooter({ addressFa: e.target.value })}
                />
              </div>

              <div className={styles.row2Col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک کانال تلگرام</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.footer.telegramLink || ""}
                    onChange={(e) => updateFooter({ telegramLink: e.target.value })}
                    dir="ltr"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک پیج اینستاگرام</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={content.footer.instagramLink || ""}
                    onChange={(e) => updateFooter({ instagramLink: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>متن کپی‌رایت انتهای فوتر</label>
                <input
                  type="text"
                  className={styles.input}
                  value={content.footer.copyrightTextFa}
                  onChange={(e) => updateFooter({ copyrightTextFa: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAB 8: HISTORY & ROLLBACK */}
          {activeTab === "history" && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>تاریخچه تغییرات و بازگشت به نسخه‌های قبل (Rollback)</h3>
                <p className={styles.formCardDesc}>مشاهده تمام تغییرات منتشر شده و قابلیت بازگشت به هر نسخه دلخواه با یک کلیک.</p>
              </div>

              {versions.length === 0 ? (
                <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                  هنوز نسخه قبلی در تاریخچه ثبت نشده است (نسخه فعلی نخستین نسخه است).
                </div>
              ) : (
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>نسخه</th>
                      <th>تاریخ و زمان</th>
                      <th>تغییر دهنده</th>
                      <th>خلاصه تغییرات</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((rec) => (
                      <tr key={rec.version}>
                        <td><strong>نسخه {rec.version}</strong></td>
                        <td>{new Date(rec.savedAt).toLocaleString("fa-IR")}</td>
                        <td>{rec.savedBy}</td>
                        <td>{rec.changeSummary}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                            onClick={() => handleRollback(rec.version)}
                          >
                            ⏪ بازگشت به این نسخه
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Live Preview Box */}
        {showLivePreview && (
          <aside className={styles.previewBox} aria-label="پیش‌نمایش زنده درجا">
            <div className={styles.previewHeader}>
              <div className={styles.previewTitle}>
                <span>👁️ شبیه‌ساز پیش‌نمایش زنده در سایت</span>
              </div>
              <span className={styles.previewBadge}>
                {hasDraft ? "پیش‌نمایش تغییرات اعمالی" : `نسخه زنده ${liveVersion}`}
              </span>
            </div>

            {/* Banner Preview */}
            {content.banner.enabled && (
              <div
                style={{
                  background: content.banner.bgColor || "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                  color: content.banner.textColor || "#ffffff",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{content.banner.textFa}</span>
                {content.banner.actionLabelFa && (
                  <span style={{ textDecoration: "underline", fontWeight: "700", whiteSpace: "nowrap" }}>
                    {content.banner.actionLabelFa} ←
                  </span>
                )}
              </div>
            )}

            {/* Mock Hero Preview */}
            <div className={styles.mockHero}>
              <div className={styles.mockHeroBadge}>{content.hero.badgeFa}</div>
              <h2 className={styles.mockHeroTitle}>{content.hero.titleFa}</h2>
              <p className={styles.mockHeroSubtitle}>{content.hero.subtitleFa}</p>
              <div className={styles.mockHeroCtas}>
                <span className={styles.btnPrimary} style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem" }}>
                  {content.hero.primaryCtaLabelFa}
                </span>
                <span className={styles.btnSecondary} style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem" }}>
                  {content.hero.secondaryCtaLabelFa}
                </span>
              </div>
              <div className={styles.mockHeroPillRow}>
                <span className={styles.mockPill}>{content.hero.trustPill1Fa}</span>
                <span className={styles.mockPill}>{content.hero.trustPill2Fa}</span>
                <span className={styles.mockPill}>{content.hero.trustPill3Fa}</span>
              </div>
            </div>

            {/* Mock Spotlights Preview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {content.skillsHub.tamrin20SpotlightEnabled && (
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "0.75rem", fontSize: "0.75rem" }}>
                  <span style={{ background: "#2563eb", color: "#fff", padding: "0.15rem 0.4rem", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "700" }}>
                    {content.skillsHub.tamrin20BadgeFa}
                  </span>
                  <div style={{ fontWeight: "700", marginTop: "0.35rem", color: "#1e3a8a" }}>{content.skillsHub.tamrin20TitleFa}</div>
                  <div style={{ color: "#475569", marginTop: "0.2rem" }}>{content.skillsHub.tamrin20DescFa}</div>
                </div>
              )}
              {content.skillsHub.smallTalkSpotlightEnabled && (
                <div style={{ background: "#fdf4ff", border: "1px solid #f0abfc", borderRadius: "8px", padding: "0.75rem", fontSize: "0.75rem" }}>
                  <span style={{ background: "#c026d3", color: "#fff", padding: "0.15rem 0.4rem", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "700" }}>
                    {content.skillsHub.smallTalkBadgeFa}
                  </span>
                  <div style={{ fontWeight: "700", marginTop: "0.35rem", color: "#701a75" }}>{content.skillsHub.smallTalkTitleFa}</div>
                  <div style={{ color: "#475569", marginTop: "0.2rem" }}>{content.skillsHub.smallTalkDescFa}</div>
                </div>
              )}
            </div>

            {/* Mock Pricing Preview */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.75rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "0.5rem" }}>💳 پلن‌های اشتراک فعال</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {content.pricingPlans.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px dashed #f1f5f9", paddingBottom: "0.25rem" }}>
                    <span>{p.nameFa} {p.badgeFa && `(${p.badgeFa})`}</span>
                    <strong style={{ color: "#4f46e5" }}>
                      {p.priceToman === 0 ? "رایگان" : `${p.priceToman.toLocaleString("fa-IR")} ت`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Footer Preview */}
            <div style={{ background: "#1e293b", color: "#e2e8f0", borderRadius: "8px", padding: "0.75rem", fontSize: "0.72rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ fontWeight: "700", color: "#fff" }}>📞 اطلاعات تماس و فوتر</div>
              <div>تلفن: {content.footer.phone} | ایمیل: {content.footer.email}</div>
              <div style={{ color: "#94a3b8" }}>{content.footer.copyrightTextFa}</div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
