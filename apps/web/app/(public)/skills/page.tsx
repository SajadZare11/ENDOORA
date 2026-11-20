import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { GameHubArcade } from "@/components/skills/game/GameHubArcade";
import { buildMetadata } from "@/lib/public-site";
import styles from "./skills.module.css";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/skills",
  "آرکید و بازی‌های مهارت‌های زبان انگلیسی | ایندورا",
  "آموزش تعاملی و پرانرژی مهارت‌های زبان انگلیسی در سطوح A1 تا C2 همراه با چالش‌های واژگان، مترادف‌ها، مکالمه سرعتی و لیدربورد کشوری."
);

export default function SkillsHubPage() {
  return (
    <PublicShell locale="fa" currentPath="/skills">
      <div className={styles.container} dir="rtl">
        {/* Interactive Skills Games & CEFR Arcade */}
        <GameHubArcade />
      </div>
    </PublicShell>
  );
}
