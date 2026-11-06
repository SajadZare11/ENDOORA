"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { LeitnerShelf, LeitnerCardsTable } from "@/components/learner/leitner";
import styles from "../learner-subpages.module.css";

export default function LeitnerPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Leitner Spaced Repetition System Shelf */}
      <section aria-label={isFa ? "جعبه ۵ خانه‌ای لایتنر خطاهای یادگیری" : "Leitner SRS Mistake Box"}>
        <LeitnerShelf />
      </section>

      {/* Leitner Cards Management & History Table */}
      <LeitnerCardsTable />
    </div>
  );
}
