import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { LearnHubView } from "./LearnHubView";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "مرکز یادگیری | ایندورا",
  description: "دسترسی جامع و دسته‌بندی‌شده به دوره‌های آموزشی، پایگاه مهارت‌ها، مسیر یادگیری شخصی، واژگان و ابزارهای تعاملی.",
};

export default function LearnHubPage() {
  return (
    <PublicShell locale="fa" currentPath="/learn">
      <div className={styles.container} dir="rtl">
        <header className={styles.heroHeader}>
          <div className={styles.badgeRow}>
            <span className={styles.heroBadge}>مرکز یادگیری</span>
            <span className={styles.badgeMotto}>۱۲ بخش در ۳ حوزه آموزشی</span>
          </div>
          <h1 className={styles.title}>مرکز یادگیری ایندورا</h1>
          <p className={styles.subtitle}>
            دوره‌ها، مهارت‌ها و ابزارهای تمرینی در ۳ دسته‌بندی تفکیک‌شده. بخش مورد نیاز خود را برای شروع یادگیری انتخاب کنید.
          </p>
        </header>

        <LearnHubView />
      </div>
    </PublicShell>
  );
}
