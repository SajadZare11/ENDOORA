"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VisualSkillTree } from "@/components/learner/path";
import styles from "./learn.module.css";

export function LearnHubView() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "video") {
        router.replace("/learn/video");
      }
    }
  }, [router]);

  return (
    <div className={styles.hubWrapper}>
      {/* Visual CEFR Skill Tree & Serpentine Learning Path */}
      <section aria-label="درخت مهارت‌های جامع CEFR">
        <VisualSkillTree />
      </section>
    </div>
  );
}
