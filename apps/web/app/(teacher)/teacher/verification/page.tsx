"use client";

import React, { useState, useEffect, useTransition } from "react";
import styles from "./verification.module.css";
import {
  fetchTeacherOnboardingApplication,
  submitTeacherOnboardingApplication,
  TeacherOnboardingApplication,
} from "@/lib/marketplace";

export default function TeacherVerificationPage() {
  const [app, setApp] = useState<TeacherOnboardingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [nationalId, setNationalId] = useState("");
  const [idDocUrl, setIdDocUrl] = useState("");
  const [degreeDocUrl, setDegreeDocUrl] = useState("");
  const [celtaDocUrl, setCeltaDocUrl] = useState("");
  const [sampleTeachingUrl, setSampleTeachingUrl] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTeacherOnboardingApplication();
        setApp(data);
        if (data) {
          setNationalId(data.national_id_number || "");
          setIdDocUrl(data.id_document_url || "");
          setDegreeDocUrl(data.degree_document_url || "");
          setCeltaDocUrl(data.celta_tesol_document_url || "");
          setSampleTeachingUrl(data.sample_teaching_url || "");
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "خطا در دریافت اطلاعات احراز هویت.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed && app?.status !== "approved") {
      alert("لطفاً قوانین و استانداردهای پلتفرم را تایید فرمایید.");
      return;
    }

    startTransition(async () => {
      setError(null);
      setSuccessMsg(null);
      try {
        const res = await submitTeacherOnboardingApplication({
          national_id_number: nationalId.trim(),
          id_document_url: idDocUrl.trim(),
          degree_document_url: degreeDocUrl.trim(),
          celta_tesol_document_url: celtaDocUrl.trim(),
          sample_teaching_url: sampleTeachingUrl.trim(),
        });
        setApp(res.application);
        setSuccessMsg(res.message || "اطلاعات با موفقیت ثبت شد و در صف ارزیابی قرار گرفت.");
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "خطا در ارسال اطلاعات احراز هویت.");
      }
    });
  };

  const getStatusBadge = () => {
    if (!app) return null;
    switch (app.status) {
      case "approved":
        return <span className={`${styles.statusBadge} ${styles.statusApproved}`}>✓ تایید شده و فعال در بازارگاه</span>;
      case "pending":
        return <span className={`${styles.statusBadge} ${styles.statusPending}`}>⏳ در انتظار بررسی مدارک</span>;
      case "in_review":
        return <span className={`${styles.statusBadge} ${styles.statusInReview}`}>🔍 در حال بررسی کارشناسی</span>;
      case "revision_requested":
        return <span className={`${styles.statusBadge} ${styles.statusRevision}`}>⚠️ نیازمند اصلاح مدارک</span>;
      case "rejected":
        return <span className={`${styles.statusBadge} ${styles.statusRejected}`}>✕ تایید نشده</span>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>احراز هویت و تایید علمی اساتید</h1>
          {getStatusBadge()}
        </div>
        <p className={styles.description}>
          برای برگزاری جلسات آموزشی خصوصی، دریافت رزرو از زبان‌آموزان و نمایش در فهرست اساتید برتر اندورا،
          احراز هویت فردی و بررسی مدارک علمی و سوابق تدریس الزامی است.
        </p>
      </div>

      {/* Dynamic Status Banners */}
      {app?.status === "approved" && (
        <div className={`${styles.bannerCard} ${styles.bannerApproved}`}>
          <h2 className={styles.bannerTitle}>🎉 تبریک! حساب تدریس شما با موفقیت تایید شد</h2>
          <p className={styles.bannerText}>
            شما دارای نشان «مدرس تایید‌شده» هستید و پروفایل شما به عنوان استاد واجد شرایط در بازارگاه به زبان‌آموزان نمایش داده می‌شود.
            می‌توانید در بخش «تنظیم تقویم دسترسی» بازه‌های زمانی تدریس خود را مشخص فرمایید.
          </p>
        </div>
      )}

      {app?.status === "revision_requested" && (
        <div className={`${styles.bannerCard} ${styles.bannerRevision}`}>
          <h2 className={styles.bannerTitle}>⚠️ نیاز به بارگذاری مجدد یا اصلاح مدارک</h2>
          <p className={styles.bannerText}>
            کارشناس ارزیابی اندورا توضیح داده است: <strong>{app.rejection_reason || "لطفاً مدارک خواناتری ارائه دهید."}</strong>
          </p>
          <p className={styles.bannerText}>
            لطفاً لینک یا مدارک اصلاح‌شده را در فرم زیر وارد کرده و مجدداً ارسال نمایید.
          </p>
        </div>
      )}

      {app?.status === "rejected" && (
        <div className={`${styles.bannerCard} ${styles.bannerRejected}`}>
          <h2 className={styles.bannerTitle}>✕ درخواست احراز هویت تایید نشد</h2>
          <p className={styles.bannerText}>
            دلیل کارشناس: <strong>{app.rejection_reason || "مدارک ارائه شده مطابق با استانداردهای پلتفرم نیست."}</strong>
          </p>
          <p className={styles.bannerText}>
            در صورت بروز اشتباه یا داشتن مدارک تکمیلی، می‌توانید اطلاعات فرم را به‌روزرسانی کرده و مجدداً جهت بررسی ارسال کنید.
          </p>
        </div>
      )}

      {(app?.status === "pending" || app?.status === "in_review") && (
        <div className={`${styles.bannerCard} ${styles.bannerPending}`}>
          <h2 className={styles.bannerTitle}>⏳ مدارک شما با موفقیت دریافت شد</h2>
          <p className={styles.bannerText}>
            مدارک و اطلاعات ارسالی شما در صف ارزیابی دپارتمان آموزش اندورا قرار دارد.
            نتیجه بررسی حداکثر ظرف ۴۸ ساعت کاری از طریق پیامک و پنل کاربری اعلام خواهد شد.
          </p>
        </div>
      )}

      {/* Process Steps */}
      <div className={styles.stepsGrid}>
        <div className={styles.stepCard}>
          <span className={styles.stepNumber}>۱</span>
          <h3 className={styles.stepTitle}>بارگذاری مدارک هویتی</h3>
          <p className={styles.stepDesc}>ثبت کد ملی و تصویر کارت ملی یا شناسنامه جهت احراز هویت قانونی.</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepNumber}>۲</span>
          <h3 className={styles.stepTitle}>مدارک علمی و بین‌المللی</h3>
          <p className={styles.stepDesc}>دانشنامه دانشگاهی مرتبط یا مدارک رسمی بین‌المللی تدریس نظیر CELTA، TESOL، DELTA یا TTC.</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepNumber}>۳</span>
          <h3 className={styles.stepTitle}>نمونه ویدیوی تدریس</h3>
          <p className={styles.stepDesc}>ارائه لینک نمونه تدریس (۳ تا ۵ دقیقه) جهت ارزیابی فن بیان، روش تدریس و لهجه.</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepNumber}>۴</span>
          <h3 className={styles.stepTitle}>فعال‌سازی در بازارگاه</h3>
          <p className={styles.stepDesc}>پس از تایید کارشناس، پروفایل شما با نشان تایید منتشر شده و رزرو مستقیم فعال می‌شود.</p>
        </div>
      </div>

      {/* Main Submission Form */}
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h2 className={styles.formSectionTitle}>فرم اطلاعات و مدارک احراز صلاحیت</h2>

        {error && (
          <div className={`${styles.bannerCard} ${styles.bannerRejected}`} role="alert">
            <p className={styles.bannerText}>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className={`${styles.bannerCard} ${styles.bannerApproved}`} role="status">
            <p className={styles.bannerText}>{successMsg}</p>
          </div>
        )}

        <div className={styles.formGrid}>
          {/* National ID */}
          <div className={styles.inputGroup}>
            <label htmlFor="national-id-input" className={styles.label}>کد ملی (۱۰ رقم):</label>
            <input
              id="national-id-input"
              type="text"
              required
              maxLength={10}
              placeholder="مثال: 0012345678"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className={styles.input}
              disabled={loading || isPending}
            />
            <span className={styles.inputHelper}>کد ملی صرفاً جهت احراز هویت است و به زبان‌آموزان نمایش داده نمی‌شود.</span>
          </div>

          {/* ID Card Doc URL */}
          <div className={styles.inputGroup}>
            <label htmlFor="id-doc-input" className={styles.label}>لینک تصویر کارت ملی / شناسنامه:</label>
            <input
              id="id-doc-input"
              type="url"
              required
              placeholder="https://drive.google.com/... یا لینک فایل امن"
              value={idDocUrl}
              onChange={(e) => setIdDocUrl(e.target.value)}
              className={styles.input}
              disabled={loading || isPending}
            />
            <span className={styles.inputHelper}>لینک مشاهده مستقیم فایل یا تصویر در گوگل درایو یا سرور ابری.</span>
          </div>

          {/* Degree Doc URL */}
          <div className={styles.inputGroup}>
            <label htmlFor="degree-doc-input" className={styles.label}>لینک مدرک تحصیلی دانشگاهی (اختیاری):</label>
            <input
              id="degree-doc-input"
              type="url"
              placeholder="https://..."
              value={degreeDocUrl}
              onChange={(e) => setDegreeDocUrl(e.target.value)}
              className={styles.input}
              disabled={loading || isPending}
            />
            <span className={styles.inputHelper}>تصویر دانشنامه زبان انگلیسی، آموزش، ترجمه یا ادبیات.</span>
          </div>

          {/* CELTA / TESOL URL */}
          <div className={styles.inputGroup}>
            <label htmlFor="celta-doc-input" className={styles.label}>لینک مدارک بین‌المللی CELTA / TESOL / TTC:</label>
            <input
              id="celta-doc-input"
              type="url"
              placeholder="https://..."
              value={celtaDocUrl}
              onChange={(e) => setCeltaDocUrl(e.target.value)}
              className={styles.input}
              disabled={loading || isPending}
            />
            <span className={styles.inputHelper}>تصویر سرتیفیکیت معتبر با شماره استعلام.</span>
          </div>

          {/* Sample Teaching Video */}
          <div className={styles.inputGroupFull}>
            <label htmlFor="sample-teaching-input" className={styles.label}>لینک ویدیو یا پادکست نمونه تدریس (۳ تا ۵ دقیقه):</label>
            <input
              id="sample-teaching-input"
              type="url"
              placeholder="https://aparat.com/v/... یا https://youtube.com/watch?v=..."
              value={sampleTeachingUrl}
              onChange={(e) => setSampleTeachingUrl(e.target.value)}
              className={styles.input}
              disabled={loading || isPending}
            />
            <span className={styles.inputHelper}>
              ویدیوی کوتاه با موضوع تدریس یک نکته گرامری یا تکنیک اسپیکینگ به زبان انگلیسی جهت سنجش تسلط و تعامل.
            </span>
          </div>

          {/* Honor code acknowledgment */}
          <div className={styles.inputGroupFull}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                disabled={loading || isPending}
              />
              <span className={styles.inputHelper}>
                صحت تمامی اطلاعات و اصالت مدارک بارگذاری‌شده را تایید می‌کنم و متعهد به رعایت قوانین اخلاقی،
                پایبندی به زمان‌بندی جلسات و اصول حرفه‌ای تدریس در اندورا هستم.
              </span>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={loading || isPending || (!termsAgreed && app?.status !== "approved")}
            className={styles.submitBtn}
          >
            {isPending ? "در حال ارسال و ثبت..." : "ارسال مدارک جهت بررسی کارشناسی 📤"}
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div className={styles.guidelinesCard}>
        <h3 className={styles.guidelinesTitle}>نکات مهم جهت تسریع در فرایند احراز صلاحیت:</h3>
        <ul className={styles.guidelinesList}>
          <li>تصاویر ارسالی باید دارای وضوح کافی، بدون برش و بدون انعکاس نور باشند.</li>
          <li>لینک‌های گوگل درایو باید در حالت دسترسی عمومی (Anyone with the link can view) تنظیم شده باشند.</li>
          <li>در ویدیوی نمونه، صحبت به زبان انگلیسی با روانی، تلفظ صحیح و انرژی مثبت امتیاز ارزیابی شما را افزایش می‌دهد.</li>
          <li>پس از تایید مدارک، نشان تایید در پروفایل شما درج شده و می‌توانید بلافاصله در آزمون‌ها و جلسات تعیین سطح تدریس کنید.</li>
        </ul>
      </div>
    </div>
  );
}
