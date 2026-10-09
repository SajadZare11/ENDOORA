import type { Metadata } from "next";
import { LearnHubView } from "./LearnHubView";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "دوره‌ها و مسیرهای آموزشی | ایندورا",
  description: "یادگیری با ویدیوهای استاندارد Family and Friends و American English File و آموزش کامل زبان انگلیسی دبیرستان همراه با سنجش تعاملی.",
};

export default function LearnHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <header className={styles.heroHeader}>
        <div className={styles.badgeRow}>
          <span className={styles.heroBadge}>مسیرهای آموزشی ایندورا</span>
          <span className={styles.badgeMotto}>۲ شیوه یادگیری هدفمند</span>
        </div>
        <h1 className={styles.title}>مسیرهای آموزشی ایندورا</h1>
        <p className={styles.subtitle}>
          انتخاب بین یادگیری چندرسانه‌ای با ویدیوهای کتب معتبر همراه با سنجش کوتاه هر ۶ مهارت زبانی، یا آموزش خط‌به‌خط و استقرایی زبان دبیرستان.
        </p>
      </header>

      <LearnHubView />
    </div>
  );
}
