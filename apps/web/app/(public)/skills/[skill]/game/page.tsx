import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/marketing/PublicShell";
import { DedicatedSkillGameClient } from "@/components/skills/game/DedicatedSkillGameClient";
import { SkillKey } from "@/data/skills/games/types";

const VALID_SKILLS: SkillKey[] = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "vocabulary",
  "grammar",
];

const SKILL_TITLES: Record<SkillKey, string> = {
  vocabulary: "واژگان و اصطلاحات",
  grammar: "گرامر و ساختار",
  listening: "شنیداری و صوت",
  reading: "درک مطلب و خواندن",
  writing: "نگارش و رایتینگ",
  speaking: "مکالمه و گفتار",
};

export function generateStaticParams() {
  return VALID_SKILLS.map((skill) => ({ skill }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>;
}): Promise<Metadata> {
  const { skill } = await params;
  if (!VALID_SKILLS.includes(skill as SkillKey)) return {};

  const titleFa = SKILL_TITLES[skill as SkillKey];
  return {
    title: `بازی تعاملی ${titleFa} (نردبان ۱۰ مرحله‌ای CEFR) | ایندورا`,
    description: `مراحل بازی تعاملی آموزش ${titleFa} از A1 تا C2 همراه با جدول امتیازات و رده‌بندی.`,
  };
}

export default async function SkillGamePage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill } = await params;

  if (!VALID_SKILLS.includes(skill as SkillKey)) {
    notFound();
  }

  return (
    <PublicShell locale="fa" currentPath={`/skills/${skill}/game`}>
      <main style={{ minHeight: "80vh", paddingBlock: "1.5rem", width: "100%" }}>
        <DedicatedSkillGameClient skill={skill as SkillKey} />
      </main>
    </PublicShell>
  );
}
