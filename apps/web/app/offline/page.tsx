"use client";

import Link from "next/link";
import styles from "./offline.module.css";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.iconWrapper} aria-hidden="true">
        📡
      </div>

      <h1 className={styles.title}>ارتباط با اینترنت برقرار نیست</h1>
      <p className={styles.description}>
        به نظر می‌رسد دسترسی دستگاه شما به شبکه اینترنت قطع شده است. جای نگرانی نیست؛
        تمامی پیش‌نویس‌ها و اطلاعات وارد‌شده شما در حافظه محلی ذخیره شده‌اند و به محض
        اتصال مجدد همگام‌سازی خواهند شد.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleRetry}
          className={styles.primaryButton}
        >
          🔄 تلاش مجدد برای اتصال
        </button>

        <Link href="/account/drafts" className={styles.secondaryLink}>
          📝 مدیریت پیش‌نویس‌های آفلاین
        </Link>

        <Link href="/" className={styles.secondaryLink}>
          🏠 صفحه اصلی
        </Link>
      </div>

      <div className={styles.tipsBox}>
        <div className={styles.tipsTitle}>💡 نکات تاب‌آوری در حالت آفلاین:</div>
        <ul className={styles.tipsList}>
          <li>
            می‌توانید به نوشتن مقالات، ثبت پاسخ‌های تمرین و یادداشت‌های آموزشی ادامه
            دهید.
          </li>
          <li>
            صفحات و منابعی که قبلاً مشاهده کرده‌اید از حافظه کش مرورگر قابل دسترسی
            هستند.
          </li>
          <li>
            عملیات مالی، آزمون‌های قطعی نهایی و ارسال‌های حساس تا اتصال ایمن به سرور
            منتظر می‌مانند.
          </li>
        </ul>
      </div>
    </main>
  );
}
