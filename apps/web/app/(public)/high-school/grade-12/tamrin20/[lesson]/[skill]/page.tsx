import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Tamrin20Skill } from "@endoora/contracts";
import {
  getTamrin20Lesson,
  getTamrin20SkillBatch,
  ALL_SKILLS,
  SKILL_TITLES_FA,
  SKILL_TITLES_EN,
} from "@/lib/tamrin20-data";
import { Tamrin20Player } from "@/components/highschool/tamrin20";

interface PageParams {
  lesson: string;
  skill: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

function parseLessonNumber(param: string): 1 | 2 | 3 | null {
  const clean = param.toLowerCase().replace("lesson-", "").trim();
  const num = Number.parseInt(clean, 10);
  if (num === 1 || num === 2 || num === 3) return num;
  return null;
}

function parseSkill(param: string): Tamrin20Skill | null {
  const clean = param.toLowerCase().trim() as Tamrin20Skill;
  if (ALL_SKILLS.includes(clean)) return clean;
  return null;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lessonNum = parseLessonNumber(params.lesson);
  const skill = parseSkill(params.skill);

  if (!lessonNum || !skill) {
    return { title: "تمرین تا ۲۰ | ایندورا" };
  }

  const lesson = getTamrin20Lesson(lessonNum);
  const skillTitleFa = SKILL_TITLES_FA[skill];
  const skillTitleEn = SKILL_TITLES_EN[skill];

  return {
    title: `تمرین تا ۲۰ - درس ${lessonNum} (${skillTitleFa}) | ایندورا`,
    description: `بانک سوالات نهایی درس ${lessonNum} (${lesson?.titleFa || ""}) در بخش ${skillTitleFa} (${skillTitleEn}) با تصحیح آنی، توضیحات تکمیلی و کلید رسمی.`,
  };
}

export function generateStaticParams(): PageParams[] {
  const params: PageParams[] = [];
  for (const lessonNum of [1, 2, 3]) {
    for (const skill of ALL_SKILLS) {
      params.push({
        lesson: `lesson-${lessonNum}`,
        skill,
      });
    }
  }
  return params;
}

export default async function Tamrin20PracticePage(props: PageProps) {
  const params = await props.params;
  const lessonNum = parseLessonNumber(params.lesson);
  const skill = parseSkill(params.skill);

  if (!lessonNum || !skill) {
    notFound();
  }

  const lesson = getTamrin20Lesson(lessonNum);
  const batch = getTamrin20SkillBatch(lessonNum, skill);

  if (!lesson || !batch) {
    notFound();
  }

  return (
    <Tamrin20Player
      lesson={lesson}
      skill={skill}
      batch={batch}
    />
  );
}
