import type {
  CEFRLevel,
  ListeningLesson,
  ListeningSkillTag,
  ListeningTopic,
  ListeningContentType,
  EnglishAccent,
} from "@endoora/contracts";

import { A1_LESSONS } from "./a1-lessons";
import { A2_LESSONS } from "./a2-lessons";
import { B1_LESSONS } from "./b1-lessons";
import { B2_LESSONS } from "./b2-lessons";
import { C1_LESSONS } from "./c1-lessons";
import { C2_LESSONS } from "./c2-lessons";

export const ALL_LISTENING_LESSONS: ListeningLesson[] = [
  ...A1_LESSONS,
  ...A2_LESSONS,
  ...B1_LESSONS,
  ...B2_LESSONS,
  ...C1_LESSONS,
  ...C2_LESSONS,
];

export const CEFR_LEVELS_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const CEFR_DESCRIPTIONS: Record<
  CEFRLevel,
  {
    titleFa: string;
    titleEn: string;
    badge: string;
    speedWpm: string;
    descriptionFa: string;
    targetFocusFa: string;
  }
> = {
  A1: {
    titleFa: "سطح آغازین (مقدماتی)",
    titleEn: "Breakthrough / Beginner",
    badge: "A1",
    speedWpm: "۱۰۰ تا ۱۱۵ کلمه در دقیقه",
    descriptionFa: "درک مکالمات بسیار کوتاه، سفارشات روزمره، آدرس‌های سرراست و برنامه روزانه.",
    targetFocusFa: "شناخت اسامی، اعداد، جهت‌ها و ایده کلی مکالمه بدون اضطراب.",
  },
  A2: {
    titleFa: "سطح پایه‌ای (پیش‌متوسط)",
    titleEn: "Waystage / Elementary",
    badge: "A2",
    speedWpm: "۱۲۰ تا ۱۳۰ کلمه در دقیقه",
    descriptionFa: "درک مکالمات خرید، اعلانات ایستگاه قطار، پیام‌های صوتی و نوبت‌گیری درمانگاه.",
    targetFocusFa: "استخراج جزییات مشخص، درک منظور اولیه و دنبال کردن توالی رویدادها.",
  },
  B1: {
    titleFa: "سطح متوسط (مستقل)",
    titleEn: "Threshold / Intermediate",
    badge: "B1",
    speedWpm: "۱۳۵ تا ۱۵۰ کلمه در دقیقه",
    descriptionFa: "درک حوادث فرودگاهی، مصاحبه‌های استخدامی، پادکست‌های روتین و حل مشکلات فنی.",
    targetFocusFa: "رمزگشایی گفتار متصل (gonna, wanna)، استنباط لحن و ادراک استدلال‌های اصلی.",
  },
  B2: {
    titleFa: "سطح فرامتوسط (پیشرفته کاربردی)",
    titleEn: "Vantage / Upper Intermediate",
    badge: "B2",
    speedWpm: "۱۵۰ تا ۱۶۵ کلمه در دقیقه",
    descriptionFa: "دنبال کردن مناظره‌های جدی کاری، گزارش‌های مستند علمی و تحولات فناوری.",
    targetFocusFa: "فهمیدن پیام‌های غیرمستقیم، پارافریز، تحلیل تعارضات تیمی و دیدگاه‌های متضاد.",
  },
  C1: {
    titleFa: "سطح پیشرفته (تخصصی و دانشگاهی)",
    titleEn: "Effective Operational / Advanced",
    badge: "C1",
    speedWpm: "۱۶۵ تا ۱۸۵ کلمه در دقیقه",
    descriptionFa: "سخنرانی‌های دانشگاهی پیچیده، سمپوزیوم‌های تخصصی و کاربردشناسی ظریف بین‌فرهنگی.",
    targetFocusFa: "ادراک ساختار گفتمان، ظرایف تعارف و رد غیرمستقیم و تحلیل نقادانه فرضیات.",
  },
  C2: {
    titleFa: "سطح تسلط کامل (بومی و فاخر)",
    titleEn: "Mastery / Near-Native",
    badge: "C2",
    speedWpm: "۱۸۵ تا ۲۱۰ کلمه در دقیقه",
    descriptionFa: "تحلیل ادبی ساختارشکنانه، جلسات دیپلماتیک پرمخاطره و مناظرات بنیادهای فلسفه و فیزیک.",
    targetFocusFa: "رمزگشایی کنایه‌های عمیق روایی، ابهام راهبردی و درک سریع هرگونه لهجه با سرعت طبیعی بومی.",
  },
};

export function getAllListeningLessons(): ListeningLesson[] {
  return ALL_LISTENING_LESSONS;
}

export function getListeningLessonById(id: string): ListeningLesson | undefined {
  return ALL_LISTENING_LESSONS.find((l) => l.id === id || l.slug === id);
}

export function getListeningLessonsByLevel(level: CEFRLevel): ListeningLesson[] {
  return ALL_LISTENING_LESSONS.filter((l) => l.level === level);
}

export interface ListeningFilterOptions {
  level?: CEFRLevel | "all";
  topic?: ListeningTopic | "all";
  contentType?: ListeningContentType | "all";
  accent?: EnglishAccent | "all";
  skillTag?: ListeningSkillTag | "all";
  searchQuery?: string;
}

export function filterListeningLessons(options: ListeningFilterOptions): ListeningLesson[] {
  const { level, topic, contentType, accent, skillTag, searchQuery } = options;

  return ALL_LISTENING_LESSONS.filter((lesson) => {
    if (level && level !== "all" && lesson.level !== level) return false;
    if (topic && topic !== "all" && lesson.topic !== topic) return false;
    if (contentType && contentType !== "all" && lesson.contentType !== contentType) return false;
    if (accent && accent !== "all" && lesson.accent !== accent) return false;
    if (skillTag && skillTag !== "all" && !lesson.skillTags.includes(skillTag)) return false;

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = lesson.titleEn.toLowerCase().includes(q) || lesson.titleFa.toLowerCase().includes(q);
      const matchSubtitle = lesson.subtitleFa.toLowerCase().includes(q);
      const matchTopic = lesson.topic.toLowerCase().includes(q);
      const matchVocab = lesson.vocabulary.some(
        (v) => v.wordOrPhrase.toLowerCase().includes(q) || v.meaningFa.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchSubtitle && !matchTopic && !matchVocab) return false;
    }

    return true;
  });
}
