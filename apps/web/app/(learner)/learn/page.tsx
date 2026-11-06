import type { Metadata } from "next";
import { LearnHubView } from "./LearnHubView";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "مسیر جامع یادگیری زبان CEFR | ایندورا",
  description: "مسیر استاندارد مهارت‌های استقرایی CEFR از پایه تا استادی به همراه سنجش ۶ مهارت اصلی.",
};

export default function LearnHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <LearnHubView />
    </div>
  );
}
