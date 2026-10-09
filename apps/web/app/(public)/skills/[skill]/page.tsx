import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicShell } from "@/components/marketing/PublicShell";
import {
  SKILLS_CONTENT,
  type SkillKey,
} from "@/data/skills/skills-content";
import {
  SkillHeroSection,
  SkillQuickToolkit,
  SkillMiniPractice,
  SkillL1FixesSection,
  SkillActionPlanSection,
  SkillRelatedLinks,
  SkillGameBanner,
} from "@/components/skills";

export function generateStaticParams() {
  return (Object.keys(SKILLS_CONTENT) as SkillKey[])
    .filter((skill) => skill !== "listening")
    .map((skill) => ({
      skill,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>;
}): Promise<Metadata> {
  const { skill } = await params;
  const data = SKILLS_CONTENT[skill as SkillKey];
  if (!data) return {};

  return {
    title: `${data.titleFa} | مهارت‌های ایندورا`,
    description: `${data.heroCatchphraseFa} - ${data.heroDescriptionFa.slice(0, 140)}...`,
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill } = await params;
  if (skill === "listening") {
    redirect("/skills/listening");
  }
  const data = SKILLS_CONTENT[skill as SkillKey];
  if (!data) {
    notFound();
  }

  return (
    <PublicShell locale="fa" currentPath={`/skills/${skill}`}>
      <div
        style={{
          maxInlineSize: "var(--content-width)",
          marginInline: "auto",
          paddingInline: "var(--space-4)",
          paddingBlock: "var(--space-6) var(--space-16)",
        }}
        dir="rtl"
      >
        {/* Hero Section with Anchor Links */}
        <SkillHeroSection data={data} />

        {/* 10-Level CEFR Interactive Game Arena Banner */}
        <SkillGameBanner skill={skill as SkillKey} skillTitleFa={data.titleFa} />

        {/* Pillar 1: Quick Toolkit */}
        <SkillQuickToolkit
          sectionTitleFa={data.quickToolkit.sectionTitleFa}
          sectionDescFa={data.quickToolkit.sectionDescFa}
          items={data.quickToolkit.items}
        />

        {/* Pillar 2: Interactive Mini-Practice */}
        <SkillMiniPractice
          sectionTitleFa={data.miniPractice.sectionTitleFa}
          sectionDescFa={data.miniPractice.sectionDescFa}
          questions={data.miniPractice.questions}
        />

        {/* Pillar 3: Persian L1 Fixes */}
        <SkillL1FixesSection
          sectionTitleFa={data.l1Fixes.sectionTitleFa}
          sectionDescFa={data.l1Fixes.sectionDescFa}
          fixes={data.l1Fixes.fixes}
        />

        {/* Pillar 4: Action Plan & Milestones */}
        <SkillActionPlanSection
          sectionTitleFa={data.actionPlan.sectionTitleFa}
          sectionDescFa={data.actionPlan.sectionDescFa}
          milestones={data.actionPlan.milestones}
        />

        {/* Bridges & Related Modules */}
        <SkillRelatedLinks modules={data.relatedModules} />
      </div>
    </PublicShell>
  );
}
