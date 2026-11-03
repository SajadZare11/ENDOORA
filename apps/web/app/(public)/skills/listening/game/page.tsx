import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { DedicatedSkillGameClient } from "@/components/skills/game/DedicatedSkillGameClient";

export const metadata: Metadata = {
  title: "اتاق شنود و کدشکنی رترو-نوآر (Wiretap Cipher) | ایندورا",
  description: "مراحل بازی تعاملی شنود و رمزگشایی صوتی از A1 تا C2 همراه با جدول امتیازات و رده‌بندی.",
};

export default function ListeningGamePage() {
  return (
    <PublicShell locale="fa" currentPath="/skills/listening/game">
      <main style={{ minHeight: "80vh", paddingBlock: "1.5rem", width: "100%" }}>
        <DedicatedSkillGameClient skill="listening" />
      </main>
    </PublicShell>
  );
}
