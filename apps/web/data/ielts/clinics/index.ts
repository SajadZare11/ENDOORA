import type { IeltsClinicData, ClinicSkill } from "@endoora/contracts";

import { READING_TFNG_CLINIC } from "./reading-tfng-mastery.ts";
import { READING_MATCHING_HEADINGS_CLINIC } from "./reading-matching-headings.ts";
import { READING_SUMMARY_DIAGRAMS_CLINIC } from "./reading-summary-diagrams.ts";
import { WRITING_TASK1_OVERVIEW_CLINIC } from "./writing-task1-overview.ts";
import { WRITING_TASK2_THESIS_COHESION_CLINIC } from "./writing-task2-thesis-cohesion.ts";
import { LISTENING_DISTRACTORS_SPELLING_CLINIC } from "./listening-distractors-spelling.ts";
import { LISTENING_MAP_LABELLING_CLINIC } from "./listening-map-labelling.ts";
import { SPEAKING_PART2_PPF_CLINIC } from "./speaking-part2-ppf-formula.ts";
import { SPEAKING_PERSIAN_L1_PHONOLOGY_CLINIC } from "./speaking-persian-l1-phonology.ts";

export const ALL_IELTS_CLINICS: IeltsClinicData[] = [
  READING_TFNG_CLINIC,
  READING_MATCHING_HEADINGS_CLINIC,
  READING_SUMMARY_DIAGRAMS_CLINIC,
  WRITING_TASK1_OVERVIEW_CLINIC,
  WRITING_TASK2_THESIS_COHESION_CLINIC,
  LISTENING_DISTRACTORS_SPELLING_CLINIC,
  LISTENING_MAP_LABELLING_CLINIC,
  SPEAKING_PART2_PPF_CLINIC,
  SPEAKING_PERSIAN_L1_PHONOLOGY_CLINIC,
];

export function getClinicById(id: string): IeltsClinicData | undefined {
  return ALL_IELTS_CLINICS.find((c) => c.id === id);
}

export function getClinicsBySkill(skill: ClinicSkill | "all"): IeltsClinicData[] {
  if (skill === "all") return ALL_IELTS_CLINICS;
  return ALL_IELTS_CLINICS.filter((c) => c.skill === skill);
}

export const CLINIC_SKILL_META: Record<
  ClinicSkill,
  { labelFa: string; labelEn: string; icon: string; count: number; descriptionFa: string }
> = {
  reading: {
    labelFa: "ریدینگ (Reading)",
    labelEn: "Reading",
    icon: "📖",
    count: 3,
    descriptionFa: "تله‌شناسی Not Given، انتخاب هوشمندانه هدینگ‌ها و استخراج دقیق واژگان در خلاصه‌ها.",
  },
  writing: {
    labelFa: "رایتینگ (Writing)",
    labelEn: "Writing",
    icon: "✍️",
    count: 2,
    descriptionFa: "فرمول اورویوهای بند ۸ در تسک ۱ و معماری تز استیتمنت‌های بدون لرزش در تسک ۲.",
  },
  listening: {
    labelFa: "لیسنینگ (Listening)",
    labelEn: "Listening",
    icon: "🎧",
    count: 2,
    descriptionFa: "شکار تغییر نظرهای گوینده، پیش‌گیری از خطاهای املایی و جهت‌یابی بی‌نقص در نقشه‌ها.",
  },
  speaking: {
    labelFa: "اسپیکینگ (Speaking)",
    labelEn: "Speaking",
    icon: "🎙️",
    count: 2,
    descriptionFa: "تکنیک ۲ دقیقه‌ای PPF در کیوکارت و اصلاح ساختاری تداخل‌های آوایی زبان فارسی.",
  },
};
