import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "./LessonPlayer";

interface LessonStaticData {
  id: string;
  courseSlug: string;
  courseTitleFa: string;
  titleFa: string;
  titleEn: string;
  durationMinutes: number;
  isFreePreview: boolean;
  contentBodyFa: string;
  contentBodyEn: string;
  transcriptFa?: string;
  quiz?: {
    promptFa: string;
    promptEn: string;
    options: string[];
    correctIndex: number;
    explanationFa: string;
  };
  downloads?: Array<{ title: string; size: string }>;
  author: string;
}

const LESSONS_DATABASE: Record<string, LessonStaticData> = {
  // Konkur Course
  "konkur-english-vision-mastery_101": {
    id: "101",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۱: آینده ساده و بیان تصمیمات لحظه‌ای و برنامه‌ریزی‌شده",
    titleEn: "Lesson 1: Future Simple & Pre-arranged Plans",
    durationMinutes: 20,
    isFreePreview: true,
    contentBodyFa: `در این جلسه ساختارهای زمان آینده با Will و Be going to را بر اساس خط‌به‌خط کتاب زبان دهم دبیرستان و تست‌های کنکور بررسی می‌کنیم.
- Will برای تصمیمات ناگهانی و حدس زدن
- Be going to برای برنامه‌های از قبل چیده‌شده و نشانه‌های عینی`,
    contentBodyEn: `Key Distinction:
- I will open the door for you. (Instant spontaneous reaction)
- We are going to paint our house next month. (Prior plan and arrangement)`,
    transcriptFa: "در این ویدئو ۵ تست از کنکورهای ۹۸ تا ۱۴۰۲ درباره افعال زمان آینده به صورت تشریحی حل می‌شود.",
    quiz: {
      promptFa: "کدام گزینه نشان‌دهنده برنامه‌ریزی قبلی است؟",
      promptEn: "Which sentence shows a pre-arranged plan?",
      options: [
        "I think it will snow tonight.",
        "I am going to visit my teacher on Monday.",
        "Wait! I will call a taxi for you.",
        "Perhaps they will arrive late."
      ],
      correctIndex: 1,
      explanationFa: "استفاده از am going to visit دلالت بر برنامه از پیش تعیین‌شده برای روز دوشنبه دارد.",
    },
    downloads: [
      { title: "جزوه خلاصه گرامر زمان آینده Vision 1", size: "1.2 MB" },
      { title: "تست‌های طبقه‌بندی شده کنکور همراه با پاسخ", size: "2.4 MB" },
    ],
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_102": {
    id: "102",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۲: واژگان کلیدی نجات طبیعت و محیط زیست",
    titleEn: "Lesson 2: Saving Nature Vocabulary",
    durationMinutes: 25,
    isFreePreview: false,
    contentBodyFa: "تحلیل ریشه‌شناسی واژه‌های درس اول کتاب دهم (Endangered, Extinct, Protect, Nature). برای مشاهده کامل محتوا اشتراک ویژه را تهیه کنید.",
    contentBodyEn: "Vocabulary roots and derivational affixes for high school exams.",
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_103": {
    id: "103",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۳: گذشته استمراری و کاربرد While",
    titleEn: "Lesson 3: Past Continuous & While",
    durationMinutes: 18,
    isFreePreview: false,
    contentBodyFa: "آموزش گذشته استمراری در ترکیب با گذشته ساده در جملات با While و When.",
    contentBodyEn: "Interrupted past actions using while and when.",
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_201": {
    id: "201",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۱: ساختار و کاربرد حال کامل در آزمون نهایی",
    titleEn: "Lesson 1: Present Perfect in Vision 2",
    durationMinutes: 22,
    isFreePreview: false,
    contentBodyFa: "تحلیل زمان حال کامل با قیدهای Since و For در امتحانات نهایی یازدهم.",
    contentBodyEn: "Present perfect tense with since and for.",
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_202": {
    id: "202",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۲: مجهول زمان حال ساده و گذشته ساده",
    titleEn: "Lesson 2: Passive Voice Basics",
    durationMinutes: 26,
    isFreePreview: false,
    contentBodyFa: "فرمول تبدیل جملات معلوم به مجهول در کتاب یازدهم دبیرستان.",
    contentBodyEn: "Active to passive voice conversion rules.",
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_301": {
    id: "301",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۱: سؤالات ضمیمه (Tag Questions) و شروط آن",
    titleEn: "Lesson 1: Tag Questions & Rules",
    durationMinutes: 19,
    isFreePreview: false,
    contentBodyFa: "نکات انحرافی سؤالات تگ در کنکور و قواعد منفی/مثبت بودن.",
    contentBodyEn: "Tag question traps in national exams.",
    author: "دپارتمان کنکور اندورا",
  },
  "konkur-english-vision-mastery_302": {
    id: "302",
    courseSlug: "konkur-english-vision-mastery",
    courseTitleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleFa: "درس ۲: حل تشریحی ۱۰۰ تست منتخب کنکور",
    titleEn: "Lesson 2: 100 Selected Konkur Tests",
    durationMinutes: 45,
    isFreePreview: false,
    contentBodyFa: "ماراتن تست‌زنی کنکور سراسری همراه با استراتژی‌های مدیریت زمان.",
    contentBodyEn: "Comprehensive test-solving marathon.",
    author: "دپارتمان کنکور اندورا",
  },

  // IELTS Academic Course
  "ielts-academic-speaking-and-writing-mastery_101": {
    id: "101",
    courseSlug: "ielts-academic-speaking-and-writing-mastery",
    courseTitleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleFa: "درس ۱: کالبدشکافی ساختار مقدمه استاندارد در ۴۰ کلمه",
    titleEn: "Lesson 1: Anatomy of a 40-Word Introduction",
    durationMinutes: 18,
    isFreePreview: true,
    contentBodyFa: `در این جلسه فرمول ۲ جمله‌ای نگارش یک مقدمه استاندارد برای رایتینگ تسک ۲ را یاد می‌گیرید:
۱. پارافریز صورت سؤال با واژگان آکادمیک
۲. بیان واضح دیدگاه نویسنده در تز استیتمنت`,
    contentBodyEn: `Introduction Pattern:
- Sentence 1: Background paraphrase without copying verbatim.
- Sentence 2: Direct thesis statement stating your clear position.`,
    transcriptFa: "بررسی نمونه مقالات نمره ۸ آیلتس کمبریج و بررسی نحوه نگارش مقدمه در کمتر از ۵ دقیقه.",
    quiz: {
      promptFa: "کدام بخش در مقدمه تسک ۲ رایتینگ آیلتس اجباری است؟",
      promptEn: "Which part is mandatory in an IELTS Task 2 introduction?",
      options: [
        "Thesis statement (بیان دیدگاه)",
        "آمار و ارقام عددی",
        "سؤال بلاغی از خواننده",
        "نقل قول از کتاب‌های مشهور"
      ],
      correctIndex: 0,
      explanationFa: "بیان دیدگاه شفاف نویسنده (Thesis Statement) برای کسب نمره ۷ و بالاتر الزامی است.",
    },
    downloads: [
      { title: "الگوهای استاندارد مقدمه‌نویسی آیلتس", size: "950 KB" },
    ],
    author: "دپارتمان آیلتس اندورا",
  },
  "ielts-academic-speaking-and-writing-mastery_102": {
    id: "102",
    courseSlug: "ielts-academic-speaking-and-writing-mastery",
    courseTitleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleFa: "درس ۲: نگارش پاراگراف‌های بدنه با استدلال قوی",
    titleEn: "Lesson 2: PEEL Body Paragraphs",
    durationMinutes: 28,
    isFreePreview: false,
    contentBodyFa: "چارچوب استدلالی PEEL و پیاده‌سازی شواهد عینی در مقالات تسک ۲.",
    contentBodyEn: "Developing persuasive body paragraphs using PEEL formula.",
    author: "دپارتمان آیلتس اندورا",
  },
  "ielts-academic-speaking-and-writing-mastery_103": {
    id: "103",
    courseSlug: "ielts-academic-speaking-and-writing-mastery",
    courseTitleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleFa: "درس ۳: کلمات ربط پیشرفته و انسجام متنی",
    titleEn: "Lesson 3: Advanced Cohesion & Transitions",
    durationMinutes: 24,
    isFreePreview: false,
    contentBodyFa: "پرهیز از کاربرد مکانیکی transition words و ارتقای نمره Cohesion.",
    contentBodyEn: "Cohesive devices and logical flow for Band 8.",
    author: "دپارتمان آیلتس اندورا",
  },
  "ielts-academic-speaking-and-writing-mastery_201": {
    id: "201",
    courseSlug: "ielts-academic-speaking-and-writing-mastery",
    courseTitleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleFa: "درس ۱: استراتژی صحبت ۲ دقیقه‌ای در پارت ۲",
    titleEn: "Lesson 1: Part 2 2-Minute Monologue",
    durationMinutes: 20,
    isFreePreview: false,
    contentBodyFa: "مدیریت زمان در یادداشت‌برداری ۱ دقیقه‌ای و ساختاربندی داستان در اسپیکینگ پارت ۲.",
    contentBodyEn: "One-minute note taking strategies for IELTS speaking part 2.",
    author: "دپارتمان آیلتس اندورا",
  },
  "ielts-academic-speaking-and-writing-mastery_202": {
    id: "202",
    courseSlug: "ielts-academic-speaking-and-writing-mastery",
    courseTitleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleFa: "درس ۲: پاسخ به سؤالات انتزاعی در پارت ۳",
    titleEn: "Lesson 2: Abstract Reasoning in Part 3",
    durationMinutes: 25,
    isFreePreview: false,
    contentBodyFa: "تحلیل روندهای اجتماعی، فرضیه‌سازی و تحلیل دیدگاه‌های مخالف در پارت ۳.",
    contentBodyEn: "Discussing abstract societal trends in part 3.",
    author: "دپارتمان آیلتس اندورا",
  },

  // Spoken Fluency Course
  "foundations-of-spoken-fluency_101": {
    id: "101",
    courseSlug: "foundations-of-spoken-fluency",
    courseTitleFa: "دوره جامع روانی مکالمه و بیان محاوره‌ای انگلیسی",
    titleFa: "درس ۱: تکنیک توصیف غیرمستقیم کلمات فراموش‌شده",
    titleEn: "Lesson 1: Paraphrasing & Hesitation Control",
    durationMinutes: 15,
    isFreePreview: true,
    contentBodyFa: `در این جلسه روش حفظ مکالمه بدون توقف و مکث آموزش داده می‌شود.
اگر کلمه‌ای را فراموش کردید، با استفاده از ساختارهای توصیفی جریان صحبت را حفظ کنید:
- It is a kind of place where...
- You use it when you want to...`,
    contentBodyEn: `Paraphrasing Formula:
- General category + Specific function or appearance.
- Example: "It's a kitchen utensil used for slicing vegetables."`,
    transcriptFa: "تمرین عملی جایگزین‌سازی واژگان با ۱۰ موقعیت شبیه‌سازی‌شده روزمره.",
    quiz: {
      promptFa: "اگر واژه microwave را فراموش کنید، کدام توصیف مناسب‌تر است؟",
      promptEn: "If you forget the word 'microwave', which description works best?",
      options: [
        "A device used for heating food quickly in the kitchen",
        "Something that you eat for dinner",
        "A tool for repairing cars",
        "An animal living in the wild"
      ],
      correctIndex: 0,
      explanationFa: "توصیف دسته وسیله (device) و کاربرد آن (heating food quickly) تعریف دقیقی برای microwave است.",
    },
    author: "لابراتوار مکالمه اندورا",
  },
  "foundations-of-spoken-fluency_102": {
    id: "102",
    courseSlug: "foundations-of-spoken-fluency",
    courseTitleFa: "دوره جامع روانی مکالمه و بیان محاوره‌ای انگلیسی",
    titleFa: "درس ۲: گفتگوی کوتاه در احوال‌پرسی‌های روزمره",
    titleEn: "Lesson 2: Everyday Small Talk & Greetings",
    durationMinutes: 20,
    isFreePreview: false,
    contentBodyFa: "روش‌های طبیعی شروع گفتگو در محیط‌های کار، آسانسور، دانشگاه و وسایل نقلیه عمومی.",
    contentBodyEn: "Natural conversational ice-breakers and small talk etiquette.",
    author: "لابراتوار مکالمه اندورا",
  },
};

export function generateStaticParams() {
  const params: Array<{ slug: string; lessonId: string }> = [];
  for (const key of Object.keys(LESSONS_DATABASE)) {
    const lesson = LESSONS_DATABASE[key];
    params.push({
      slug: lesson.courseSlug,
      lessonId: lesson.id,
    });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const key = `${slug}_${lessonId}`;
  const lesson = LESSONS_DATABASE[key];
  if (!lesson) return {};
  return {
    title: `${lesson.titleFa} | ${lesson.courseTitleFa}`,
    description: lesson.titleEn,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const key = `${slug}_${lessonId}`;
  const lesson = LESSONS_DATABASE[key];
  if (!lesson) notFound();

  return <LessonPlayer lesson={lesson} />;
}
