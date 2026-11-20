import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { GameHubArcade } from "@/components/skills/game/GameHubArcade";
import { buildMetadata } from "@/lib/public-site";
import styles from "../../(public)/skills/skills.module.css";

export const metadata: Metadata = buildMetadata(
  "en",
  "/skills",
  "English Skills Arcade & Interactive Games | Endoora",
  "High-energy interactive English skills practice across CEFR A1-C2 with vocabulary challenges, speed dialogues, idioms, and national leaderboards."
);

export default function EnglishSkillsHubPage() {
  return (
    <PublicShell locale="en" currentPath="/en/skills">
      <div className={styles.container} dir="ltr">
        {/* Interactive Skills Games & CEFR Arcade */}
        <GameHubArcade />
      </div>
    </PublicShell>
  );
}
