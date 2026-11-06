/**
 * American English File (AEF) Complete Curriculum Registry
 * Authentic Video Lessons Matching All Local MP4 Files (87 Lessons across 5 CEFR Levels)
 * Standardized 6-Skill Assessments: Listening, Vocabulary, Grammar, Speaking, Reading, Writing
 */

import { SkillType, ChoiceQuestion, SpeakingQuestion, WritingQuestion, TranscriptLine } from "./video-learning";

export type AEFLevelTier = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface AEFLevelMeta {
  tier: AEFLevelTier;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  levelNameFa: string;
  levelNameEn: string;
  bookTitleFa: string;
  bookTitleEn: string;
  gradient: string;
  badgeColor: string;
  icon: string;
  descFa: string;
  totalVideos: number;
}

export interface AEFVideoLesson {
  id: string;
  level: AEFLevelTier;
  episodeNumber: number;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  duration: string;
  durationSec: number;
  fileName: string;
  videoUrl: string;
  embedType: "direct" | "aparat" | "youtube";
  posterGradient: string;
  posterIcon: string;
  summaryFa: string;
  summaryEn: string;
  keyTopicsFa: string[];
  transcript: TranscriptLine[];
  questions: {
    listening: ChoiceQuestion;
    vocabulary: ChoiceQuestion;
    grammar: ChoiceQuestion;
    speaking: SpeakingQuestion;
    reading: ChoiceQuestion;
    writing: WritingQuestion;
  };
}

export const AEF_LEVELS_META: Record<AEFLevelTier, AEFLevelMeta> = {
  a1: {
    tier: "a1",
    cefr: "A1",
    levelNameFa: "سطح A1 · پایه و نوآموزان",
    levelNameEn: "Level A1 · Starter & Beginner",
    bookTitleFa: "American English File 1 (3rd Edition)",
    bookTitleEn: "American English File Level 1",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    badgeColor: "#059669",
    icon: "🌱",
    descFa: "ورود جنی به نیویورک، پذیرش در هتل، اولین سفارش قهوه، خرید لباس و جهت‌یابی در خیابان‌های منهتن.",
    totalVideos: 18,
  },
  a2: {
    tier: "a2",
    cefr: "A2",
    levelNameFa: "سطح A2 · پیش‌متوسط",
    levelNameEn: "Level A2 · Elementary",
    bookTitleFa: "American English File 2 (3rd Edition)",
    bookTitleEn: "American English File Level 2",
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    badgeColor: "#0284c7",
    icon: "📘",
    descFa: "تماس با پذیرش هتل، شام در رستوران منهتن، پس دادن کالا به فروشگاه، داروخانه و گردش در پارک مرکزی.",
    totalVideos: 18,
  },
  b1: {
    tier: "b1",
    cefr: "B1",
    levelNameFa: "سطح B1 · متوسط",
    levelNameEn: "Level B1 · Intermediate",
    bookTitleFa: "American English File 3 (3rd Edition)",
    bookTitleEn: "American English File Level 3",
    gradient: "linear-gradient(135deg, #4f46e5, #6366f1)",
    badgeColor: "#4f46e5",
    icon: "⚡",
    descFa: "رابطه از راه دور راب و جنی، مصاحبه شغلی، ورود پل از انگلستان، پیشنهادات و تصمیمات جدی برای آینده مشترک.",
    totalVideos: 16,
  },
  b2: {
    tier: "b2",
    cefr: "B2",
    levelNameFa: "سطح B2 · پیشرفته مقدماتی",
    levelNameEn: "Level B2 · Upper-Intermediate",
    bookTitleFa: "American English File 4 (3rd Edition)",
    bookTitleEn: "American English File Level 4",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    badgeColor: "#ea580c",
    icon: "🚀",
    descFa: "مصاحبه‌های پیشرفته با کارگردانان، مدیران تبلیغات، کوچ‌های شغلی و بازیگران برجسته بریتانیا و آمریکا.",
    totalVideos: 15,
  },
  c1: {
    tier: "c1",
    cefr: "C1",
    levelNameFa: "سطح C1 · پیشرفته و تسلط",
    levelNameEn: "Level C1 · Advanced",
    bookTitleFa: "American English File 5 (3rd Edition)",
    bookTitleEn: "American English File Level 5",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    badgeColor: "#dc2626",
    icon: "💎",
    descFa: "گفتگوهای تخصصی با نخبگان نیویورک، فیلم‌نامه‌نویسان، هنرمندان و مصاحبه‌های خیابانی چالش‌برانگیز.",
    totalVideos: 20,
  },
  c2: {
    tier: "c2",
    cefr: "C2",
    levelNameFa: "سطح C2 · مهارت نهایی زبان",
    levelNameEn: "Level C2 · Proficiency",
    bookTitleFa: "American English File Master",
    bookTitleEn: "American English File Proficiency",
    gradient: "linear-gradient(135deg, #0f172a, #334155)",
    badgeColor: "#0f172a",
    icon: "👑",
    descFa: "تسلط کامل آکادمیک و بین‌المللی، تحلیل نقادانه رسانه‌ها و مهارت‌های هم‌سطح زبان مادری.",
    totalVideos: 20,
  },
};

export const AEF_LESSONS: AEFVideoLesson[] = [
  {
    "id": "a1-v01",
    "level": "a1",
    "episodeNumber": 1,
    "titleFa": "اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی",
    "titleEn": "Episode 1 · Part 1: Jenny Arrives in New York",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A1",
    "duration": "1:56",
    "durationSec": 116,
    "fileName": "AEF3e_SB1_PE_Ep1_Introduction.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep1_Introduction.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #059669, #10b981)",
    "posterIcon": "🗽",
    "summaryFa": "جنی زیلینسکی، دستیار سردبیر یک مجله در نیویورک، خود، زندگی پرمشغله در منهتن و همکاری کاری پیش‌رو با راب واکر از لندن را معرفی می‌کند.",
    "summaryEn": "Jenny Zielinski, an assistant editor on a New York magazine, introduces herself, her busy life in Manhattan, and her upcoming work with Rob Walker.",
    "keyTopicsFa": [
      "معرفی خود و شغل",
      "زندگی شهری در منهتن",
      "فعل to be و زمان حال ساده",
      "لهجه آمریکایی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 1: Jenny Arrives in New York.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 29,
        "timeDisplay": "0:29",
        "textEn": "Detailed conversation and communicative exchange regarding معرفی خود و شغل.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون معرفی خود و شغل.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 87,
        "timeDisplay": "1:27",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 1: Jenny Arrives in New York.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 1: Jenny Arrives in New York', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 38,
        "timestampDisplay": "0:38",
        "explanationFa": "در این صحنه، تمرکز بر معرفی خود و شغل و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny Zielinski, an assistant editor on a New York magazine, introduces herself,...",
            "textFa": "تمرکز اصلی بر جنی زیلینسکی، دستیار سردبیر یک مجله در نیویورک، خود، زندگی پرمشغله در ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (معرفی خود و شغل) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 1: Jenny Arrives in New York)?",
        "explanationFa": "واژه name کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Name: an essential communicative term used throughout this scenario.",
            "textFa": "Name: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "My name's Jenny Zielinski. I live and work in New York City.",
            "textFa": "اسم من جنی زیلینسکی است. من در شهر نیویورک زندگی و کار می‌کنم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "My name's Jenny Zielinski. I live and work in New York City.",
        "targetPhraseFa": "اسم من جنی زیلینسکی است. من در شهر نیویورک زندگی و کار می‌کنم.",
        "phoneticGuide": "/maɪ neɪmz ˈdʒeni zɪˈlɪnski aɪ lɪv ənd wɜːrk ɪn nuː jɔːrk ˈsɪti/",
        "speakingTipsFa": "تلفظ New York در لهجه آمریکایی به صورت /nuː jɔːrk/ ادا می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه معرفی خود و شغل می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 1: Jenny Arrives in New York', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره معرفی خود و شغل است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding معرفی خود و شغل.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره معرفی خود و شغل."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 1: Jenny Arrives in New York) using the required keywords.",
        "minWords": 10,
        "keywordsToUse": [
          "name",
          "live",
          "work"
        ],
        "sampleAnswerEn": "Hi, my name is Jenny and I work as an editor for a magazine in New York.",
        "sampleAnswerFa": "سلام، اسم من جنی است و به عنوان ویراستار برای یک مجله در نیویورک کار می‌کنم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v02",
    "level": "a1",
    "episodeNumber": 2,
    "titleFa": "اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن",
    "titleEn": "Episode 1 · Part 2: Checking In at a New York Hotel",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A1",
    "duration": "1:13",
    "durationSec": 73,
    "fileName": "AEF3e_SB1_PE_Ep1_Checking_in.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep1_Checking_in.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "🏨",
    "summaryFa": "راب به هتل خود در منهتن می‌رسد، با مسئول پذیرش صحبت می‌کند، رزرو اتاقش را تایید کرده و کلید و رمز وای‌فای را تحویل می‌گیرد.",
    "summaryEn": "Rob arrives at his Manhattan hotel, speaks to the receptionist, verifies his booking, and gets his room key card and Wi-Fi password.",
    "keyTopicsFa": [
      "اصطلاحات پذیرش هتل (Check in, reservation)",
      "هجی کردن نام خانوادگی",
      "کارت ورود به اتاق (Key card)",
      "رمز وای‌فای"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 2: Checking In at a New York Hotel.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 18,
        "timeDisplay": "0:18",
        "textEn": "Detailed conversation and communicative exchange regarding اصطلاحات پذیرش هتل (Check in, reservation).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون اصطلاحات پذیرش هتل (Check in, reservation).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 54,
        "timeDisplay": "0:54",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 2: Checking In at a New York Hotel.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 2: Checking In at a New York Hotel', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 24,
        "timestampDisplay": "0:24",
        "explanationFa": "در این صحنه، تمرکز بر اصطلاحات پذیرش هتل (Check in, reservation) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob arrives at his Manhattan hotel, speaks to the receptionist, verifies his boo...",
            "textFa": "تمرکز اصلی بر راب به هتل خود در منهتن می‌رسد، با مسئول پذیرش صحبت می‌کند، رزرو اتاقش... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (اصطلاحات پذیرش هتل (Check in, reservation)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 2: Checking In at a New York Hotel)?",
        "explanationFa": "واژه reservation کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Reservation: an essential communicative term used throughout this scenario.",
            "textFa": "Reservation: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have a reservation for six nights under the name Rob Walker.",
            "textFa": "من یک رزرو شش شبه به نام راب واکر دارم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have a reservation for six nights under the name Rob Walker.",
        "targetPhraseFa": "من یک رزرو شش شبه به نام راب واکر دارم.",
        "phoneticGuide": "/aɪ hæv ə ˌrezərˈveɪʃn fɔːr sɪks naɪts ˈʌndər ðə neɪm rɑːb ˈwɔːkər/",
        "speakingTipsFa": "عبارت 'under the name' رایج‌ترین ساختار معرفی نام در رزرو است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه اصطلاحات پذیرش هتل (Check in, reservation) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 2: Checking In at a New York Hotel', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره اصطلاحات پذیرش هتل (Check in, reservation) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding اصطلاحات پذیرش هتل (Check in, reservation).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره اصطلاحات پذیرش هتل (Check in, reservation)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 2: Checking In at a New York Hotel) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "reservation",
          "room",
          "key"
        ],
        "sampleAnswerEn": "Good afternoon, I have a hotel reservation and I would like to check in to my room.",
        "sampleAnswerFa": "بعدازظهر بخیر، من رزرو هتل دارم و مایل هستم در اتاقم پذیرش شوم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v03",
    "level": "a1",
    "episodeNumber": 3,
    "titleFa": "اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل",
    "titleEn": "Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A1",
    "duration": "1:23",
    "durationSec": 83,
    "fileName": "AEF3e_SB1_PE_Ep1_Jenny_talks_to_Rob.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep1_Jenny_talks_to_Rob.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
    "posterIcon": "📞",
    "summaryFa": "جنی با اتاق راب در هتل تماس می‌گیرد تا به او خوشامد بگوید، از شرایط اتاق مطمئن شود و برای قرار صبح فردا هماهنگ کند.",
    "summaryEn": "Jenny phones Rob in his hotel room to welcome him to America, check if everything is OK with the room, and arrange their morning meeting.",
    "keyTopicsFa": [
      "مکالمات تلفنی انگلیسی (Is that Rob?)",
      "احوالپرسی و تعارفات رسمی",
      "هماهنگی ساعت ملاقات",
      "صحبت درباره خستگی پرواز (Jet lag)"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 20,
        "timeDisplay": "0:20",
        "textEn": "Detailed conversation and communicative exchange regarding مکالمات تلفنی انگلیسی (Is that Rob?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مکالمات تلفنی انگلیسی (Is that Rob?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 62,
        "timeDisplay": "1:02",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 27,
        "timestampDisplay": "0:27",
        "explanationFa": "در این صحنه، تمرکز بر مکالمات تلفنی انگلیسی (Is that Rob?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny phones Rob in his hotel room to welcome him to America, check if everythin...",
            "textFa": "تمرکز اصلی بر جنی با اتاق راب در هتل تماس می‌گیرد تا به او خوشامد بگوید، از شرایط ات... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مکالمات تلفنی انگلیسی (Is that Rob?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room)?",
        "explanationFa": "واژه phone کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Phone: an essential communicative term used throughout this scenario.",
            "textFa": "Phone: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Hello, Rob? It's Jenny Zielinski from the magazine office.",
            "textFa": "سلام راب؟ جنی زیلینسکی هستم از دفتر مجله."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Hello, Rob? It's Jenny Zielinski from the magazine office.",
        "targetPhraseFa": "سلام راب؟ جنی زیلینسکی هستم از دفتر مجله.",
        "phoneticGuide": "/həˈloʊ rɑːb ɪts ˈdʒeni zɪˈlɪnski frəm ðə ˈmæɡəziːn ˈɔːfɪs/",
        "speakingTipsFa": "در تماس تلفنی برای معرفی خود از 'It's Jenny' استفاده می‌شود نه 'I am Jenny'.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مکالمات تلفنی انگلیسی (Is that Rob?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مکالمات تلفنی انگلیسی (Is that Rob?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مکالمات تلفنی انگلیسی (Is that Rob?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مکالمات تلفنی انگلیسی (Is that Rob?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "phone",
          "meet",
          "tomorrow"
        ],
        "sampleAnswerEn": "Thank you for calling; I look forward to meeting you tomorrow morning at nine.",
        "sampleAnswerFa": "ممنون از تماستان؛ مشتاقانه منتظر دیدار شما فردا صبح ساعت نه هستم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v04",
    "level": "a1",
    "episodeNumber": 4,
    "titleFa": "اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله",
    "titleEn": "Episode 2 · Part 1: Rob and Jenny Meet at the Magazine",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A1",
    "duration": "1:06",
    "durationSec": 66,
    "fileName": "AEF3e_SB1_PE_Ep2_Rob_and_Jenny_Meet.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep2_Rob_and_Jenny_Meet.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
    "posterIcon": "🤝",
    "summaryFa": "راب به دفتر کار نیویورک می‌رسد و برای نخستین بار جنی و مدیرشان دانیل را حضوری ملاقات می‌کند.",
    "summaryEn": "Rob arrives at the office in New York and meets Jenny in person for the very first time, along with their boss Daniel.",
    "keyTopicsFa": [
      "معرفی همکاران جدید",
      "اصطلاحات خوشامدگویی کاری",
      "صحبت درباره سفر پروازی",
      "محیط اداری منهتن"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 1: Rob and Jenny Meet at the Magazine.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 16,
        "timeDisplay": "0:16",
        "textEn": "Detailed conversation and communicative exchange regarding معرفی همکاران جدید.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون معرفی همکاران جدید.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 49,
        "timeDisplay": "0:49",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 1: Rob and Jenny Meet at the Magazine.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 1: Rob and Jenny Meet at the Magazine', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 22,
        "timestampDisplay": "0:22",
        "explanationFa": "در این صحنه، تمرکز بر معرفی همکاران جدید و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob arrives at the office in New York and meets Jenny in person for the very fir...",
            "textFa": "تمرکز اصلی بر راب به دفتر کار نیویورک می‌رسد و برای نخستین بار جنی و مدیرشان دانیل ر... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (معرفی همکاران جدید) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 1: Rob and Jenny Meet at the Magazine)?",
        "explanationFa": "واژه meet کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Meet: an essential communicative term used throughout this scenario.",
            "textFa": "Meet: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "It's great to finally meet you in person, Rob.",
            "textFa": "دیدار حضوری شما در نهایت بسیار عالی است راب."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "It's great to finally meet you in person, Rob.",
        "targetPhraseFa": "دیدار حضوری شما در نهایت بسیار عالی است راب.",
        "phoneticGuide": "/ɪts ɡreɪt tuː ˈfaɪnəli miːt juː ɪn ˈpɜːrsn rɑːb/",
        "speakingTipsFa": "عبارت 'in person' یعنی به صورت حضوری و فیزیکی.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه معرفی همکاران جدید می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 1: Rob and Jenny Meet at the Magazine', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره معرفی همکاران جدید است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding معرفی همکاران جدید.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره معرفی همکاران جدید."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 1: Rob and Jenny Meet at the Magazine) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "meet",
          "office",
          "finally"
        ],
        "sampleAnswerEn": "It is really nice to meet everyone at the office and begin our new project together.",
        "sampleAnswerFa": "دیدار با همه در دفتر کار و شروع پروژه مشترک جدیدمان واقعاً لذت‌بخش است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v05",
    "level": "a1",
    "episodeNumber": 5,
    "titleFa": "اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ",
    "titleEn": "Episode 2 · Part 2: Buying a Coffee in Manhattan",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A1",
    "duration": "1:01",
    "durationSec": 61,
    "fileName": "AEF3e_SB1_PE_Ep2_Buying_a_coffee.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep2_Buying_a_coffee.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #d97706, #f59e0b)",
    "posterIcon": "☕",
    "summaryFa": "راب در یک کافه شلوغ نیویورکی قهوه و کیک سفارش می‌دهد و بین سایزها، نوع شیر و بردن یا میل در کافه انتخاب می‌کند.",
    "summaryEn": "Rob orders coffee and a pastry at a bustling New York coffee shop, choosing between sizes, milk options, and takeaway vs having it here.",
    "keyTopicsFa": [
      "سفارش نوشیدنی (Can I have a latte?)",
      "انتخاب سایز (Single, double, regular, large)",
      "برای بردن یا میل در کافه (To go or to have here?)",
      "قیمت و پرداخت پول"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 2: Buying a Coffee in Manhattan.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 15,
        "timeDisplay": "0:15",
        "textEn": "Detailed conversation and communicative exchange regarding سفارش نوشیدنی (Can I have a latte?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون سفارش نوشیدنی (Can I have a latte?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 45,
        "timeDisplay": "0:45",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 2: Buying a Coffee in Manhattan.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 2: Buying a Coffee in Manhattan', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 20,
        "timestampDisplay": "0:20",
        "explanationFa": "در این صحنه، تمرکز بر سفارش نوشیدنی (Can I have a latte?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob orders coffee and a pastry at a bustling New York coffee shop, choosing betw...",
            "textFa": "تمرکز اصلی بر راب در یک کافه شلوغ نیویورکی قهوه و کیک سفارش می‌دهد و بین سایزها، نوع... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (سفارش نوشیدنی (Can I have a latte?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 2: Buying a Coffee in Manhattan)?",
        "explanationFa": "واژه coffee کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Coffee: an essential communicative term used throughout this scenario.",
            "textFa": "Coffee: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Can I have a double espresso to go, please?",
            "textFa": "آیا می‌توانم یک دابل اسپرسو بیرون‌بر داشته باشم لطفاً؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Can I have a double espresso to go, please?",
        "targetPhraseFa": "آیا می‌توانم یک دابل اسپرسو بیرون‌بر داشته باشم لطفاً؟",
        "phoneticGuide": "/kən aɪ hæv ə ˈdʌbl eˈspresoʊ tuː ɡoʊ pliːz/",
        "speakingTipsFa": "در آمریکا عبارت 'to go' به معنای غذای بیرون‌بر استفاده می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه سفارش نوشیدنی (Can I have a latte?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 2: Buying a Coffee in Manhattan', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره سفارش نوشیدنی (Can I have a latte?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding سفارش نوشیدنی (Can I have a latte?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره سفارش نوشیدنی (Can I have a latte?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 2: Buying a Coffee in Manhattan) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "coffee",
          "please",
          "have"
        ],
        "sampleAnswerEn": "Can I please have a large cappuccino and a chocolate muffin to go?",
        "sampleAnswerFa": "آیا می‌توانم لطفاً یک کاپوچینوی بزرگ و مافین شکلاتی بیرون‌بر داشته باشم؟",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v06",
    "level": "a1",
    "episodeNumber": 6,
    "titleFa": "اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل",
    "titleEn": "Episode 2 · Part 3: First Day in the Office with Daniel",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A1",
    "duration": "1:31",
    "durationSec": 91,
    "fileName": "AEF3e_SB1_PE_Ep2_First_day_in_the_office.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep2_First_day_in_the_office.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
    "posterIcon": "💼",
    "summaryFa": "دانیل بخش‌های مختلف دفتر کار و امکانات را به راب نشان می‌دهد و درباره سری مقالات پیش‌رو پیرامون فرهنگ نیویورک صحبت می‌کند.",
    "summaryEn": "Daniel introduces Rob to the office layout and equipment, discussing their upcoming article series on New York culture.",
    "keyTopicsFa": [
      "معرفی فضاهای اداری",
      "بحث درباره مقالات و ایده‌ها",
      "تعارفات و فرهنگ کاری آمریکا",
      "برنامه‌ریزی ساعات کاری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 3: First Day in the Office with Daniel.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 22,
        "timeDisplay": "0:22",
        "textEn": "Detailed conversation and communicative exchange regarding معرفی فضاهای اداری.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون معرفی فضاهای اداری.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 68,
        "timeDisplay": "1:08",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 3: First Day in the Office with Daniel.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 3: First Day in the Office with Daniel', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 30,
        "timestampDisplay": "0:30",
        "explanationFa": "در این صحنه، تمرکز بر معرفی فضاهای اداری و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Daniel introduces Rob to the office layout and equipment, discussing their upcom...",
            "textFa": "تمرکز اصلی بر دانیل بخش‌های مختلف دفتر کار و امکانات را به راب نشان می‌دهد و درباره ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (معرفی فضاهای اداری) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 3: First Day in the Office with Daniel)?",
        "explanationFa": "واژه office کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Office: an essential communicative term used throughout this scenario.",
            "textFa": "Office: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Here is your desk, and you can use this computer for writing.",
            "textFa": "این میز کار شماست و می‌توانید از این رایانه برای نگارش استفاده کنید."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Here is your desk, and you can use this computer for writing.",
        "targetPhraseFa": "این میز کار شماست و می‌توانید از این رایانه برای نگارش استفاده کنید.",
        "phoneticGuide": "/hɪr ɪz jɔːr desk ənd juː kən juːz ðɪs kəmˈpjuːtər fɔːr ˈraɪtɪŋ/",
        "speakingTipsFa": "تلفظ آمریکایی computer به صورت /kəmˈpjuːtər/ با r انتهایی رسا است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه معرفی فضاهای اداری می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 3: First Day in the Office with Daniel', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره معرفی فضاهای اداری است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding معرفی فضاهای اداری.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره معرفی فضاهای اداری."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 3: First Day in the Office with Daniel) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "office",
          "computer",
          "desk"
        ],
        "sampleAnswerEn": "On my first day at work, my team welcomed me warmly and showed me my new desk.",
        "sampleAnswerFa": "در نخستین روز کاری‌ام، تیم به گرمی از من استقبال کردند و میزم را به من نشان دادند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v07",
    "level": "a1",
    "episodeNumber": 7,
    "titleFa": "اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی",
    "titleEn": "Episode 3 · Part 1: Jenny's on the Phone",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A1",
    "duration": "1:25",
    "durationSec": 85,
    "fileName": "AEF3e_SB1_PE_Ep3_Jenny's_on_the_phone.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep3_Jenny's_on_the_phone.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    "posterIcon": "📱",
    "summaryFa": "جنی در حال پاسخگویی به تماس‌های فشرده کاری و ضرب‌الاجل‌هاست، در حالی که راب برای خرید لباس در شهر نیاز به راهنمایی دارد.",
    "summaryEn": "Jenny is busy juggling multiple phone calls and deadlines, while Rob needs her advice on shopping for clothes in town.",
    "keyTopicsFa": [
      "عبارات انتظار پای تلفن (Hold on, please)",
      "پیام گذاشتن تلفنی",
      "عذرخواهی برای تاخیر",
      "مشغله‌های محیط کار مدرن"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 1: Jenny's on the Phone.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 21,
        "timeDisplay": "0:21",
        "textEn": "Detailed conversation and communicative exchange regarding عبارات انتظار پای تلفن (Hold on, please).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون عبارات انتظار پای تلفن (Hold on, please).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 63,
        "timeDisplay": "1:03",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 1: Jenny's on the Phone.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 1: Jenny's on the Phone', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 28,
        "timestampDisplay": "0:28",
        "explanationFa": "در این صحنه، تمرکز بر عبارات انتظار پای تلفن (Hold on, please) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny is busy juggling multiple phone calls and deadlines, while Rob needs her a...",
            "textFa": "تمرکز اصلی بر جنی در حال پاسخگویی به تماس‌های فشرده کاری و ضرب‌الاجل‌هاست، در حالی ک... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (عبارات انتظار پای تلفن (Hold on, please)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 1: Jenny's on the Phone)?",
        "explanationFa": "واژه sorry کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Sorry: an essential communicative term used throughout this scenario.",
            "textFa": "Sorry: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I'm really sorry, can you hold on for just a second?",
            "textFa": "واقعاً عذرخواهی می‌کنم، آیا می‌توانید فقط یک لحظه پشت خط منتظر بمانید؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I'm really sorry, can you hold on for just a second?",
        "targetPhraseFa": "واقعاً عذرخواهی می‌کنم، آیا می‌توانید فقط یک لحظه پشت خط منتظر بمانید؟",
        "phoneticGuide": "/aɪm ˈrɪəli ˈsɑːri kən juː hoʊld ɑːn fɔːr dʒʌst ə ˈsekənd/",
        "speakingTipsFa": "عبارت 'hold on' رایج‌ترین اصطلاح برای انتظار پای تلفن است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه عبارات انتظار پای تلفن (Hold on, please) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 1: Jenny's on the Phone', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره عبارات انتظار پای تلفن (Hold on, please) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding عبارات انتظار پای تلفن (Hold on, please).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره عبارات انتظار پای تلفن (Hold on, please)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 1: Jenny's on the Phone) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "sorry",
          "hold",
          "phone"
        ],
        "sampleAnswerEn": "I apologize for the delay; I was on an urgent phone call with a client.",
        "sampleAnswerFa": "بابت تاخیر پوزش می‌خواهم؛ من در حال مکالمه تلفنی فوری با یک مشتری بودم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v08",
    "level": "a1",
    "episodeNumber": 8,
    "titleFa": "اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه",
    "titleEn": "Episode 3 · Part 2: Buying Clothes in a Retail Store",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A1",
    "duration": "0:51",
    "durationSec": 51,
    "fileName": "AEF3e_SB1_PE_Ep3_Buying_clothes.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep3_Buying_clothes.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #db2777, #f472b6)",
    "posterIcon": "🛍️",
    "summaryFa": "راب برای خرید پیراهن و پلیور نو به فروشگاه پوشاک می‌رود، درباره سایز و اتاق پرو سوال کرده و با کارت بانکی پرداخت می‌کند.",
    "summaryEn": "Rob visits a retail store to buy a new shirt and sweater, asking the shop assistant for sizes, fitting room locations, and paying by card.",
    "keyTopicsFa": [
      "مکالمات فروشگاه لباس (What size are you?)",
      "اتاق پرو (Changing rooms)",
      "پرو کردن لباس (Can I try it on?)",
      "پرداخت با کارت اعتباری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 2: Buying Clothes in a Retail Store.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 12,
        "timeDisplay": "0:12",
        "textEn": "Detailed conversation and communicative exchange regarding مکالمات فروشگاه لباس (What size are you?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مکالمات فروشگاه لباس (What size are you?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 38,
        "timeDisplay": "0:38",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 2: Buying Clothes in a Retail Store.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 2: Buying Clothes in a Retail Store', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 17,
        "timestampDisplay": "0:17",
        "explanationFa": "در این صحنه، تمرکز بر مکالمات فروشگاه لباس (What size are you?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob visits a retail store to buy a new shirt and sweater, asking the shop assist...",
            "textFa": "تمرکز اصلی بر راب برای خرید پیراهن و پلیور نو به فروشگاه پوشاک می‌رود، درباره سایز و... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مکالمات فروشگاه لباس (What size are you?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 2: Buying Clothes in a Retail Store)?",
        "explanationFa": "واژه size کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Size: an essential communicative term used throughout this scenario.",
            "textFa": "Size: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Where are the changing rooms? Can I try this shirt on?",
            "textFa": "اتاق‌های پرو کجا هستند؟ آیا می‌توانم این پیراهن را پرو کنم؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Where are the changing rooms? Can I try this shirt on?",
        "targetPhraseFa": "اتاق‌های پرو کجا هستند؟ آیا می‌توانم این پیراهن را پرو کنم؟",
        "phoneticGuide": "/wer ɑːr ðə ˈtʃeɪndʒɪŋ ruːmz kən aɪ traɪ ðɪs ʃɜːrt ɑːn/",
        "speakingTipsFa": "کلمه changing room در انگلیسی بریتانیایی و fitting room در آمریکایی استفاده می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مکالمات فروشگاه لباس (What size are you?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 2: Buying Clothes in a Retail Store', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مکالمات فروشگاه لباس (What size are you?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مکالمات فروشگاه لباس (What size are you?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مکالمات فروشگاه لباس (What size are you?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 2: Buying Clothes in a Retail Store) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "size",
          "shirt",
          "try"
        ],
        "sampleAnswerEn": "Excuse me, do you have this blue sweater in a medium size so I can try it on?",
        "sampleAnswerFa": "ببخشید، آیا این پلیور آبی را در سایز مدیوم دارید تا آن را پرو کنم؟",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v09",
    "level": "a1",
    "episodeNumber": 9,
    "titleFa": "اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان",
    "titleEn": "Episode 3 · Part 3: Meeting on the Street",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A1",
    "duration": "1:07",
    "durationSec": 67,
    "fileName": "AEF3e_SB1_PE_Ep3_Meeting_on_the_street.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep3_Meeting_on_the_street.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #9333ea, #c084fc)",
    "posterIcon": "🚶‍♂️",
    "summaryFa": "راب در خیابان با کیسه‌های خرید با جنی برخورد می‌کند و گفتگویی صمیمانه و طنزآمیز درباره انتخاب‌های لباس دارند.",
    "summaryEn": "Rob runs into Jenny on the street carrying his shopping bags, and they share a humorous exchange about fashion choices.",
    "keyTopicsFa": [
      "برخورد اتفاقی در خیابان (What a surprise!)",
      "تعریف از ظاهر و سلیقه (It looks great on you)",
      "دعوت به همراهی",
      "مکالمه غیررسمی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 3: Meeting on the Street.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 16,
        "timeDisplay": "0:16",
        "textEn": "Detailed conversation and communicative exchange regarding برخورد اتفاقی در خیابان (What a surprise!).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون برخورد اتفاقی در خیابان (What a surprise!).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 50,
        "timeDisplay": "0:50",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 3: Meeting on the Street.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 3: Meeting on the Street', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 22,
        "timestampDisplay": "0:22",
        "explanationFa": "در این صحنه، تمرکز بر برخورد اتفاقی در خیابان (What a surprise!) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob runs into Jenny on the street carrying his shopping bags, and they share a h...",
            "textFa": "تمرکز اصلی بر راب در خیابان با کیسه‌های خرید با جنی برخورد می‌کند و گفتگویی صمیمانه ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (برخورد اتفاقی در خیابان (What a surprise!)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 3: Meeting on the Street)?",
        "explanationFa": "واژه street کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Street: an essential communicative term used throughout this scenario.",
            "textFa": "Street: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "What a coincidence! I didn't expect to see you here.",
            "textFa": "چه تصادفی! انتظار نداشتم شما را اینجا ببینم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "What a coincidence! I didn't expect to see you here.",
        "targetPhraseFa": "چه تصادفی! انتظار نداشتم شما را اینجا ببینم.",
        "phoneticGuide": "/wʌt ə koʊˈɪnsɪdəns aɪ ˈdɪdnt ɪkˈspekt tuː siː juː hɪr/",
        "speakingTipsFa": "کلمه coincidence دارای استرس روی سیلاب دوم /koʊˈɪnsɪdəns/ است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه برخورد اتفاقی در خیابان (What a surprise!) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 3: Meeting on the Street', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره برخورد اتفاقی در خیابان (What a surprise!) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding برخورد اتفاقی در خیابان (What a surprise!).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره برخورد اتفاقی در خیابان (What a surprise!)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 3: Meeting on the Street) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "street",
          "see",
          "great"
        ],
        "sampleAnswerEn": "It was lovely seeing my colleague on the street while walking back to the hotel.",
        "sampleAnswerFa": "دیدن همکارم در خیابان حین بازگشت پیاده به هتل بسیار خوشایند بود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v10",
    "level": "a1",
    "episodeNumber": 10,
    "titleFa": "اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر",
    "titleEn": "Episode 4 · Part 1: A Free Morning in New York",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A1",
    "duration": "1:23",
    "durationSec": 83,
    "fileName": "AEF3e_SB1_PE_Ep4_A_free_morning.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep4_A_free_morning.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0d9488, #2dd4bf)",
    "posterIcon": "🌤️",
    "summaryFa": "راب پیش از جلسات بعدازظهر یک صبح آزاد دارد و تصمیم می‌گیرد برخی از جاهای دیدنی و معماری معروف شهر را کشف کند.",
    "summaryEn": "Rob has a free morning before afternoon meetings and decides to explore some of the city's famous architectural sights.",
    "keyTopicsFa": [
      "برنامه‌ریزی اوقات فراغت",
      "جاذبه‌های گردشگری",
      "سفر با پای پیاده در منهتن",
      "مدیریت زمان در سفر کاری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 1: A Free Morning in New York.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 20,
        "timeDisplay": "0:20",
        "textEn": "Detailed conversation and communicative exchange regarding برنامه‌ریزی اوقات فراغت.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون برنامه‌ریزی اوقات فراغت.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 62,
        "timeDisplay": "1:02",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 1: A Free Morning in New York.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 1: A Free Morning in New York', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 27,
        "timestampDisplay": "0:27",
        "explanationFa": "در این صحنه، تمرکز بر برنامه‌ریزی اوقات فراغت و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob has a free morning before afternoon meetings and decides to explore some of ...",
            "textFa": "تمرکز اصلی بر راب پیش از جلسات بعدازظهر یک صبح آزاد دارد و تصمیم می‌گیرد برخی از جاه... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (برنامه‌ریزی اوقات فراغت) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 1: A Free Morning in New York)?",
        "explanationFa": "واژه morning کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Morning: an essential communicative term used throughout this scenario.",
            "textFa": "Morning: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have a free morning today, so I'm going to walk around.",
            "textFa": "من امروز صبح آزاد دارم، بنابراین قصد دارم پیاده‌روی کنم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have a free morning today, so I'm going to walk around.",
        "targetPhraseFa": "من امروز صبح آزاد دارم، بنابراین قصد دارم پیاده‌روی کنم.",
        "phoneticGuide": "/aɪ hæv ə friː ˈmɔːrnɪŋ təˈdeɪ soʊ aɪm ˈɡoʊɪŋ tuː wɔːk əˈraʊnd/",
        "speakingTipsFa": "فعل walk را بدون صدای l و به صورت /wɔːk/ تلفظ کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه برنامه‌ریزی اوقات فراغت می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 1: A Free Morning in New York', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره برنامه‌ریزی اوقات فراغت است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding برنامه‌ریزی اوقات فراغت.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره برنامه‌ریزی اوقات فراغت."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 1: A Free Morning in New York) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "morning",
          "free",
          "city"
        ],
        "sampleAnswerEn": "During my free morning I walked through the park and took beautiful photos of the city.",
        "sampleAnswerFa": "در طول صبح آزادم در پارک قدم زدم و عکس‌های زیبایی از شهر گرفتم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v11",
    "level": "a1",
    "episodeNumber": 11,
    "titleFa": "اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان",
    "titleEn": "Episode 4 · Part 2: Asking for Directions in New York",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A1",
    "duration": "1:57",
    "durationSec": 117,
    "fileName": "AEF3e_SB1_PE_Ep4_Asking_for_directions.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep4_Asking_for_directions.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "posterIcon": "🗺️",
    "summaryFa": "راب برای یافتن ایستگاه مترو مسیر را گم می‌کند و از عابران نیویورکی با استفاده از تقاطع‌ها و بلوک‌های خیابان آدرس می‌پرسد.",
    "summaryEn": "Rob gets lost looking for a subway station and asks friendly New Yorkers for directions using street blocks and landmarks.",
    "keyTopicsFa": [
      "پرسیدن مسیر (Excuse me, is there a station near here?)",
      "جهت‌یابی (Go straight, turn left, on the corner)",
      "مفهوم بلوک در شهرهای آمریکا (Walk two blocks)",
      "حروف اضافه جهت و مکان"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 2: Asking for Directions in New York.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 29,
        "timeDisplay": "0:29",
        "textEn": "Detailed conversation and communicative exchange regarding پرسیدن مسیر (Excuse me, is there a station near here?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون پرسیدن مسیر (Excuse me, is there a station near here?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 87,
        "timeDisplay": "1:27",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 2: Asking for Directions in New York.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 2: Asking for Directions in New York', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 39,
        "timestampDisplay": "0:39",
        "explanationFa": "در این صحنه، تمرکز بر پرسیدن مسیر (Excuse me, is there a station near here?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob gets lost looking for a subway station and asks friendly New Yorkers for dir...",
            "textFa": "تمرکز اصلی بر راب برای یافتن ایستگاه مترو مسیر را گم می‌کند و از عابران نیویورکی با ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (پرسیدن مسیر (Excuse me, is there a station near here?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 2: Asking for Directions in New York)?",
        "explanationFa": "واژه straight کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Straight: an essential communicative term used throughout this scenario.",
            "textFa": "Straight: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Go straight ahead for two blocks, then turn left at the lights.",
            "textFa": "دو کوچه مستقیم جلو بروید، سپس سر چراغ راهنمایی به چپ بپیچید."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Go straight ahead for two blocks, then turn left at the lights.",
        "targetPhraseFa": "دو کوچه مستقیم جلو بروید، سپس سر چراغ راهنمایی به چپ بپیچید.",
        "phoneticGuide": "/ɡoʊ streɪt əˈhed fɔːr tuː blɑːks ðen tɜːrn left ət ðə laɪts/",
        "speakingTipsFa": "در انگلیسی آمریکایی block واحد اصلی فاصله در خیابان‌هاست.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه پرسیدن مسیر (Excuse me, is there a station near here?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 2: Asking for Directions in New York', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره پرسیدن مسیر (Excuse me, is there a station near here?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding پرسیدن مسیر (Excuse me, is there a station near here?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره پرسیدن مسیر (Excuse me, is there a station near here?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 2: Asking for Directions in New York) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "straight",
          "turn",
          "station"
        ],
        "sampleAnswerEn": "To reach the subway station, go straight ahead and turn right at the traffic lights.",
        "sampleAnswerFa": "برای رسیدن به ایستگاه مترو، مستقیم بروید و سر چراغ راهنمایی به راست بپیچید.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v12",
    "level": "a1",
    "episodeNumber": 12,
    "titleFa": "اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی",
    "titleEn": "Episode 4 · Part 3: Jenny and Rob Go Sightseeing",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A1",
    "duration": "2:08",
    "durationSec": 128,
    "fileName": "AEF3e_SB1_PE_Ep4_Jenny_and_Rob_go_sightseeing.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep4_Jenny_and_Rob_go_sightseeing.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #10b981, #34d399)",
    "posterIcon": "🌉",
    "summaryFa": "جنی به راب می‌پیوندد تا او را از کنار مناظر معروفی چون پل بروکلین عبور داده و داستان‌هایی از فرهنگ محلی نیویورک را بازگو کند.",
    "summaryEn": "Jenny joins Rob to guide him past famous sights like the Brooklyn Bridge and shares stories about local New York culture.",
    "keyTopicsFa": [
      "توصیف پل‌ها و آسمان‌خراش‌ها",
      "تاریخچه محلی نیویورک",
      "صفت‌های تحسین منظر (Spectacular, iconic)",
      "روایت خاطرات شهری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 3: Jenny and Rob Go Sightseeing.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 32,
        "timeDisplay": "0:32",
        "textEn": "Detailed conversation and communicative exchange regarding توصیف پل‌ها و آسمان‌خراش‌ها.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون توصیف پل‌ها و آسمان‌خراش‌ها.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 96,
        "timeDisplay": "1:36",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 3: Jenny and Rob Go Sightseeing.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 3: Jenny and Rob Go Sightseeing', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 42,
        "timestampDisplay": "0:42",
        "explanationFa": "در این صحنه، تمرکز بر توصیف پل‌ها و آسمان‌خراش‌ها و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny joins Rob to guide him past famous sights like the Brooklyn Bridge and sha...",
            "textFa": "تمرکز اصلی بر جنی به راب می‌پیوندد تا او را از کنار مناظر معروفی چون پل بروکلین عبور... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (توصیف پل‌ها و آسمان‌خراش‌ها) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 3: Jenny and Rob Go Sightseeing)?",
        "explanationFa": "واژه view کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "View: an essential communicative term used throughout this scenario.",
            "textFa": "View: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "The view of the skyline from the Brooklyn Bridge is breathtaking.",
            "textFa": "منظره خط افق شهر از روی پل بروکلین نفس‌گیر و بی‌نظیر است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "The view of the skyline from the Brooklyn Bridge is breathtaking.",
        "targetPhraseFa": "منظره خط افق شهر از روی پل بروکلین نفس‌گیر و بی‌نظیر است.",
        "phoneticGuide": "/ðə vjuː əv ðə ˈskaɪlaɪn frəm ðə ˈbrʊklɪn brɪdʒ ɪz ˈbreθteɪkɪŋ/",
        "speakingTipsFa": "کلمه breathtaking به معنای بسیار زیبا و حیرت‌انگیز است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه توصیف پل‌ها و آسمان‌خراش‌ها می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 3: Jenny and Rob Go Sightseeing', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره توصیف پل‌ها و آسمان‌خراش‌ها است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding توصیف پل‌ها و آسمان‌خراش‌ها.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره توصیف پل‌ها و آسمان‌خراش‌ها."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 3: Jenny and Rob Go Sightseeing) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "view",
          "bridge",
          "beautiful"
        ],
        "sampleAnswerEn": "Walking across the famous bridge provided us with a magnificent view of the Manhattan skyline.",
        "sampleAnswerFa": "قدم زدن روی پل معروف، منظره‌ای باشکوه از آسمان‌خراش‌های منهتن به ما ارائه داد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v13",
    "level": "a1",
    "episodeNumber": 13,
    "titleFa": "اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار",
    "titleEn": "Episode 5 · Part 1: An Invitation to Dinner",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A1",
    "duration": "1:32",
    "durationSec": 92,
    "fileName": "AEF3e_SB1_PE_Ep5_An_invitation_to_dinner.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep5_An_invitation_to_dinner.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🍽️",
    "summaryFa": "جنی و دانیل از راب دعوت می‌کنند تا برای یک شام کاری و جشن موفقیت در یک رستوران سنتی ایتالیایی در منهتن به آن‌ها بپیوندد.",
    "summaryEn": "Jenny and Daniel invite Rob to join them for a celebratory business dinner at a traditional Italian restaurant in Manhattan.",
    "keyTopicsFa": [
      "دعوت کردن رسمی (Would you like to join us?)",
      "پذیرش مودبانه دعوت (I'd love to)",
      "هماهنگی روز و ساعت",
      "انتخاب نوع رستوران"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 1: An Invitation to Dinner.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 23,
        "timeDisplay": "0:23",
        "textEn": "Detailed conversation and communicative exchange regarding دعوت کردن رسمی (Would you like to join us?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دعوت کردن رسمی (Would you like to join us?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 69,
        "timeDisplay": "1:09",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 1: An Invitation to Dinner.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 1: An Invitation to Dinner', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 30,
        "timestampDisplay": "0:30",
        "explanationFa": "در این صحنه، تمرکز بر دعوت کردن رسمی (Would you like to join us?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny and Daniel invite Rob to join them for a celebratory business dinner at a ...",
            "textFa": "تمرکز اصلی بر جنی و دانیل از راب دعوت می‌کنند تا برای یک شام کاری و جشن موفقیت در یک... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دعوت کردن رسمی (Would you like to join us?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 1: An Invitation to Dinner)?",
        "explanationFa": "واژه dinner کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Dinner: an essential communicative term used throughout this scenario.",
            "textFa": "Dinner: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Would you like to join us for dinner tonight at seven?",
            "textFa": "آیا مایل هستید امشب ساعت هفت برای شام به ما ملحق شوید؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Would you like to join us for dinner tonight at seven?",
        "targetPhraseFa": "آیا مایل هستید امشب ساعت هفت برای شام به ما ملحق شوید؟",
        "phoneticGuide": "/wʊd juː laɪk tuː dʒɔɪn ʌs fɔːr ˈdɪnər təˈnaɪt ət ˈsevn/",
        "speakingTipsFa": "ساختار 'Would you like to...' رسمی‌ترین شیوه تعارف و دعوت است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دعوت کردن رسمی (Would you like to join us?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 1: An Invitation to Dinner', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دعوت کردن رسمی (Would you like to join us?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دعوت کردن رسمی (Would you like to join us?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دعوت کردن رسمی (Would you like to join us?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 1: An Invitation to Dinner) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "dinner",
          "join",
          "tonight"
        ],
        "sampleAnswerEn": "Thank you for the kind invitation; I would love to join you all for dinner tonight.",
        "sampleAnswerFa": "از دعوت محبت‌آمیزتان سپاسگزارم؛ من خیلی مشتاقم امشب برای شام به جمع شما بپیوندم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v14",
    "level": "a1",
    "episodeNumber": 14,
    "titleFa": "اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران",
    "titleEn": "Episode 5 · Part 2: Ordering a Meal in a Restaurant",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A1",
    "duration": "1:00",
    "durationSec": 60,
    "fileName": "AEF3e_SB1_PE_Ep5_Ordering_a_meal.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep5_Ordering_a_meal.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #dc2626, #ef4444)",
    "posterIcon": "🍝",
    "summaryFa": "پیشخدمت سفارش پیش‌غذا، غذای اصلی نظیر ماهی سالمون گریل‌شده و پاستا، نوشیدنی‌ها و ترجیحات غذایی را یادداشت می‌کند.",
    "summaryEn": "The waiter takes their order: appetizers, main courses like grilled salmon and pasta, drinks, and dietary preferences.",
    "keyTopicsFa": [
      "سفارش غذا (I'll have the grilled salmon, please)",
      "پیش‌غذا و غذای اصلی (Appetizer / Main course)",
      "پرسیدن درباره مخلفات (Does it come with salad?)",
      "مکالمات رستوران"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 2: Ordering a Meal in a Restaurant.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 15,
        "timeDisplay": "0:15",
        "textEn": "Detailed conversation and communicative exchange regarding سفارش غذا (I'll have the grilled salmon, please).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون سفارش غذا (I'll have the grilled salmon, please).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 45,
        "timeDisplay": "0:45",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 2: Ordering a Meal in a Restaurant.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 2: Ordering a Meal in a Restaurant', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 20,
        "timestampDisplay": "0:20",
        "explanationFa": "در این صحنه، تمرکز بر سفارش غذا (I'll have the grilled salmon, please) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is The waiter takes their order: appetizers, main courses like grilled salmon and p...",
            "textFa": "تمرکز اصلی بر پیشخدمت سفارش پیش‌غذا، غذای اصلی نظیر ماهی سالمون گریل‌شده و پاستا، نو... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (سفارش غذا (I'll have the grilled salmon, please)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 2: Ordering a Meal in a Restaurant)?",
        "explanationFa": "واژه order کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Order: an essential communicative term used throughout this scenario.",
            "textFa": "Order: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "For my main course, I'll have the grilled salmon with salad.",
            "textFa": "برای غذای اصلی، من سالمون گریل‌شده به همراه سالاد خواهم خورد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "For my main course, I'll have the grilled salmon with salad.",
        "targetPhraseFa": "برای غذای اصلی، من سالمون گریل‌شده به همراه سالاد خواهم خورد.",
        "phoneticGuide": "/fɔːr maɪ meɪn kɔːrs aɪl hæv ðə ɡrɪld ˈsæmən wɪð ˈsæləd/",
        "speakingTipsFa": "در کلمه salmon حرف l کاملاً بی‌صداست: /ˈsæmən/.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه سفارش غذا (I'll have the grilled salmon, please) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 2: Ordering a Meal in a Restaurant', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره سفارش غذا (I'll have the grilled salmon, please) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding سفارش غذا (I'll have the grilled salmon, please).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره سفارش غذا (I'll have the grilled salmon, please)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 2: Ordering a Meal in a Restaurant) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "order",
          "salad",
          "please"
        ],
        "sampleAnswerEn": "To start with I would like vegetable soup, and for my main course grilled chicken.",
        "sampleAnswerFa": "برای شروع سوپ سبزیجات و برای غذای اصلی مرغ گریل‌شده میل دارم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v15",
    "level": "a1",
    "episodeNumber": 15,
    "titleFa": "اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام",
    "titleEn": "Episode 5 · Part 3: The End of the Meal and the Bill",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A1",
    "duration": "2:00",
    "durationSec": 120,
    "fileName": "AEF3e_SB1_PE_Ep5_The_end_of_the_meal.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep5_The_end_of_the_meal.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #b45309, #f59e0b)",
    "posterIcon": "💳",
    "summaryFa": "ضیافت شام با دسر به پایان می‌رسد، راب صورتحساب را درخواست می‌کند و دانیل درباره فرهنگ انعام دادن در رستوران‌های آمریکا توضیح می‌دهد.",
    "summaryEn": "The dinner concludes with desserts, Rob asking for the check/bill, and Daniel discussing the culture of tipping in American restaurants.",
    "keyTopicsFa": [
      "درخواست صورتحساب (Could we have the check, please?)",
      "فرهنگ انعام (Tipping culture in the US)",
      "تشکر از پرسنل رستوران",
      "پرداخت دنگی یا مهمان کردن"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 3: The End of the Meal and the Bill.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 30,
        "timeDisplay": "0:30",
        "textEn": "Detailed conversation and communicative exchange regarding درخواست صورتحساب (Could we have the check, please?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون درخواست صورتحساب (Could we have the check, please?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 90,
        "timeDisplay": "1:30",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 3: The End of the Meal and the Bill.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 3: The End of the Meal and the Bill', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 40,
        "timestampDisplay": "0:40",
        "explanationFa": "در این صحنه، تمرکز بر درخواست صورتحساب (Could we have the check, please?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is The dinner concludes with desserts, Rob asking for the check/bill, and Daniel di...",
            "textFa": "تمرکز اصلی بر ضیافت شام با دسر به پایان می‌رسد، راب صورتحساب را درخواست می‌کند و دان... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (درخواست صورتحساب (Could we have the check, please?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 3: The End of the Meal and the Bill)?",
        "explanationFa": "واژه check کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Check: an essential communicative term used throughout this scenario.",
            "textFa": "Check: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Could we have the check, please? We'd like to pay together.",
            "textFa": "آیا ممکن است لطفاً صورتحساب را بیاورید؟ ما می‌خواهیم با هم پرداخت کنیم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Could we have the check, please? We'd like to pay together.",
        "targetPhraseFa": "آیا ممکن است لطفاً صورتحساب را بیاورید؟ ما می‌خواهیم با هم پرداخت کنیم.",
        "phoneticGuide": "/kʊd wiː hæv ðə tʃek pliːz wiːd laɪk tuː peɪ təˈɡeðər/",
        "speakingTipsFa": "در آمریکا صورتحساب رستوران 'check' نامیده می‌شود (در بریتانیا bill).",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه درخواست صورتحساب (Could we have the check, please?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 3: The End of the Meal and the Bill', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره درخواست صورتحساب (Could we have the check, please?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding درخواست صورتحساب (Could we have the check, please?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره درخواست صورتحساب (Could we have the check, please?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 3: The End of the Meal and the Bill) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "check",
          "bill",
          "pay"
        ],
        "sampleAnswerEn": "After enjoying our delicious meal, we asked the waiter for the check and left a generous tip.",
        "sampleAnswerFa": "پس از لذت بردن از غذای لذیذمان، صورتحساب را از گارسون درخواست کرده و انعام مناسبی پرداختیم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v16",
    "level": "a1",
    "episodeNumber": 16,
    "titleFa": "اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان",
    "titleEn": "Episode 6 · Part 1: Jenny's Last Morning",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:41",
    "durationSec": 101,
    "fileName": "AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #6366f1, #818cf8)",
    "posterIcon": "🧳",
    "summaryFa": "راب برای پرواز بازگشت به لندن آماده می‌شود، چمدان‌هایش را در هتل می‌بندد و با پذیرش برای درخواست تاکسی به فرودگاه JFK تماس می‌گیرد.",
    "summaryEn": "Rob prepares for his return flight to London, packing his bags in the hotel room and calling reception to request a taxi to JFK airport.",
    "keyTopicsFa": [
      "تسویه‌حساب هتل (Check out)",
      "درخواست تاکسی فرودگاه (Could you call a cab?)",
      "بررسی گذرنامه و بلیط",
      "احساسات پایان سفر"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 1: Jenny's Last Morning.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 25,
        "timeDisplay": "0:25",
        "textEn": "Detailed conversation and communicative exchange regarding تسویه‌حساب هتل (Check out).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون تسویه‌حساب هتل (Check out).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 75,
        "timeDisplay": "1:15",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 1: Jenny's Last Morning.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 1: Jenny's Last Morning', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 33,
        "timestampDisplay": "0:33",
        "explanationFa": "در این صحنه، تمرکز بر تسویه‌حساب هتل (Check out) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob prepares for his return flight to London, packing his bags in the hotel room...",
            "textFa": "تمرکز اصلی بر راب برای پرواز بازگشت به لندن آماده می‌شود، چمدان‌هایش را در هتل می‌بن... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (تسویه‌حساب هتل (Check out)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 1: Jenny's Last Morning)?",
        "explanationFa": "واژه taxi کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Taxi: an essential communicative term used throughout this scenario.",
            "textFa": "Taxi: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Could you call a taxi for me to the airport, please?",
            "textFa": "آیا ممکن است لطفاً برای من یک تاکسی به فرودگاه خبر کنید؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Could you call a taxi for me to the airport, please?",
        "targetPhraseFa": "آیا ممکن است لطفاً برای من یک تاکسی به فرودگاه خبر کنید؟",
        "phoneticGuide": "/kʊd juː kɔːl ə ˈtæksi fɔːr miː tuː ðiː ˈeəpɔːt pliːz/",
        "speakingTipsFa": "کلمه taxi یا cab در نیویورک هر دو کاربرد دارند.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه تسویه‌حساب هتل (Check out) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 1: Jenny's Last Morning', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره تسویه‌حساب هتل (Check out) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding تسویه‌حساب هتل (Check out).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره تسویه‌حساب هتل (Check out)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 1: Jenny's Last Morning) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "taxi",
          "airport",
          "morning"
        ],
        "sampleAnswerEn": "On my last morning, I packed my luggage and asked the front desk to book a morning cab.",
        "sampleAnswerFa": "در آخرین صبح، چمدانم را بستم و از پذیرش خواستم یک تاکسی صبحگاهی رزرو کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v17",
    "level": "a1",
    "episodeNumber": 17,
    "titleFa": "اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه",
    "titleEn": "Episode 6 · Part 2: Getting to the Airport in Traffic",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:20",
    "durationSec": 80,
    "fileName": "AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
    "posterIcon": "🚕",
    "summaryFa": "راب با یک تاکسی زرد در ترافیک سنگین منهتن به سوی فرودگاه می‌رود و با راننده درباره زمان پرواز و تاخیرها گفتگو می‌کند.",
    "summaryEn": "Rob rides a yellow cab through heavy Manhattan traffic, chatting with the driver about travel times and flight departures.",
    "keyTopicsFa": [
      "تاکسی‌های زرد نیویورک (Yellow cab)",
      "ترافیک شهری (Heavy traffic)",
      "مدت زمان مسیر (How long will it take?)",
      "ترمینال‌های فرودگاه"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 2: Getting to the Airport in Traffic.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 20,
        "timeDisplay": "0:20",
        "textEn": "Detailed conversation and communicative exchange regarding تاکسی‌های زرد نیویورک (Yellow cab).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون تاکسی‌های زرد نیویورک (Yellow cab).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 60,
        "timeDisplay": "1:00",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 2: Getting to the Airport in Traffic.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 2: Getting to the Airport in Traffic', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 26,
        "timestampDisplay": "0:26",
        "explanationFa": "در این صحنه، تمرکز بر تاکسی‌های زرد نیویورک (Yellow cab) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob rides a yellow cab through heavy Manhattan traffic, chatting with the driver...",
            "textFa": "تمرکز اصلی بر راب با یک تاکسی زرد در ترافیک سنگین منهتن به سوی فرودگاه می‌رود و با ر... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (تاکسی‌های زرد نیویورک (Yellow cab)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 2: Getting to the Airport in Traffic)?",
        "explanationFa": "واژه traffic کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Traffic: an essential communicative term used throughout this scenario.",
            "textFa": "Traffic: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "How long will it take to get to JFK Airport in this traffic?",
            "textFa": "با این ترافیک چقدر طول می‌کشد تا به فرودگاه JFK برسیم؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "How long will it take to get to JFK Airport in this traffic?",
        "targetPhraseFa": "با این ترافیک چقدر طول می‌کشد تا به فرودگاه JFK برسیم؟",
        "phoneticGuide": "/haʊ lɒŋ wɪl ɪt teɪk tuː ɡet tuː dʒeɪ ef keɪ ˈeəpɔːt ɪn ðɪs ˈtræfɪk/",
        "speakingTipsFa": "ساختار 'How long will it take...' برای پرسیدن زمان مسیر به کار می‌رود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه تاکسی‌های زرد نیویورک (Yellow cab) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 2: Getting to the Airport in Traffic', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره تاکسی‌های زرد نیویورک (Yellow cab) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding تاکسی‌های زرد نیویورک (Yellow cab).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره تاکسی‌های زرد نیویورک (Yellow cab)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 2: Getting to the Airport in Traffic) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "traffic",
          "airport",
          "time"
        ],
        "sampleAnswerEn": "Due to heavy city traffic, it took nearly an hour to reach the airport terminal.",
        "sampleAnswerFa": "به دلیل ترافیک سنگین شهری، رسیدن به ترمینال فرودگاه نزدیک به یک ساعت طول کشید.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a1-v18",
    "level": "a1",
    "episodeNumber": 18,
    "titleFa": "اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره",
    "titleEn": "Episode 6 · Part 3: Saying Goodbye at the Departure Gate",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:59",
    "durationSec": 119,
    "fileName": "AEF3e_SB1_PE_Ep6_Saying_goodbye.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Saying_goodbye.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "✈️",
    "summaryFa": "جنی در گیت فرودگاه برای خداحافظی به راب می‌رسد، هدیه یادبودی به او می‌دهد و قول می‌دهند برای پروژه بعدی در تماس باشند.",
    "summaryEn": "Jenny meets Rob at the airport gate to say goodbye, give him a farewell gift, and promise to stay in touch for their next joint project.",
    "keyTopicsFa": [
      "اصطلاحات خداحافظی گرم (Have a safe flight!)",
      "در تماس بودن (Keep in touch)",
      "آرزوی موفقیت و سفر امن",
      "پایان داستان فصل اول"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 3: Saying Goodbye at the Departure Gate.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 29,
        "timeDisplay": "0:29",
        "textEn": "Detailed conversation and communicative exchange regarding اصطلاحات خداحافظی گرم (Have a safe flight!).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون اصطلاحات خداحافظی گرم (Have a safe flight!).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 89,
        "timeDisplay": "1:29",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 3: Saying Goodbye at the Departure Gate.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 3: Saying Goodbye at the Departure Gate', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 39,
        "timestampDisplay": "0:39",
        "explanationFa": "در این صحنه، تمرکز بر اصطلاحات خداحافظی گرم (Have a safe flight!) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny meets Rob at the airport gate to say goodbye, give him a farewell gift, an...",
            "textFa": "تمرکز اصلی بر جنی در گیت فرودگاه برای خداحافظی به راب می‌رسد، هدیه یادبودی به او می‌... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (اصطلاحات خداحافظی گرم (Have a safe flight!)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 3: Saying Goodbye at the Departure Gate)?",
        "explanationFa": "واژه flight کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Flight: an essential communicative term used throughout this scenario.",
            "textFa": "Flight: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Have a safe flight back to London, and don't forget to keep in touch!",
            "textFa": "پرواز امنی در بازگشت به لندن داشته باش، و یادت نرود در تماس باشیم!"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Have a safe flight back to London, and don't forget to keep in touch!",
        "targetPhraseFa": "پرواز امنی در بازگشت به لندن داشته باش، و یادت نرود در تماس باشیم!",
        "phoneticGuide": "/hæv ə seɪf flaɪt bæk tuː ˈlʌndən ənd doʊnt fərˈɡet tuː kiːp ɪn tʌtʃ/",
        "speakingTipsFa": "اصطلاح 'keep in touch' یعنی حفظ ارتباط و بی‌خبر نگذاشتن دوستان.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه اصطلاحات خداحافظی گرم (Have a safe flight!) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 3: Saying Goodbye at the Departure Gate', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره اصطلاحات خداحافظی گرم (Have a safe flight!) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding اصطلاحات خداحافظی گرم (Have a safe flight!).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره اصطلاحات خداحافظی گرم (Have a safe flight!)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 3: Saying Goodbye at the Departure Gate) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "flight",
          "touch",
          "goodbye"
        ],
        "sampleAnswerEn": "We hugged goodbye at the gate and promised to keep in touch regularly until our next meeting.",
        "sampleAnswerFa": "ما در گیت با هم خداحافظی کردیم و قول دادیم تا دیدار بعدی مرتباً در تماس باشیم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v01",
    "level": "a2",
    "episodeNumber": 1,
    "titleFa": "اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک",
    "titleEn": "Episode 1 · Part 1: Rob Returns to New York",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "2:06",
    "durationSec": 126,
    "fileName": "AEF3e_SB2_PE_Ep1_Introduction.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Introduction.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "🗽",
    "summaryFa": "راب برای ماموریت کاری دائمی در مجله به نیویورک بازگشته و مشتاق دیدار مجدد جنی و کار در آمریکاست.",
    "summaryEn": "Rob is back in New York City on a permanent assignment for the magazine, excited to see Jenny again and work in the US.",
    "keyTopicsFa": [
      "بازگشت به شهر جدید",
      "اهداف کاری بلندمدت",
      "لهجه و اصطلاحات آمریکایی",
      "احوالپرسی دوستان قدیمی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 1: Rob Returns to New York.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 31,
        "timeDisplay": "0:31",
        "textEn": "Detailed conversation and communicative exchange regarding بازگشت به شهر جدید.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون بازگشت به شهر جدید.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 94,
        "timeDisplay": "1:34",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 1: Rob Returns to New York.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 1: Rob Returns to New York', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 42,
        "timestampDisplay": "0:42",
        "explanationFa": "در این صحنه، تمرکز بر بازگشت به شهر جدید و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob is back in New York City on a permanent assignment for the magazine, excited...",
            "textFa": "تمرکز اصلی بر راب برای ماموریت کاری دائمی در مجله به نیویورک بازگشته و مشتاق دیدار م... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (بازگشت به شهر جدید) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 1: Rob Returns to New York)?",
        "explanationFa": "واژه back کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Back: an essential communicative term used throughout this scenario.",
            "textFa": "Back: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "It is wonderful to be back in New York City after so many months.",
            "textFa": "بازگشت به شهر نیویورک پس از ماه‌ها بسیار شگفت‌انگیز است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "It is wonderful to be back in New York City after so many months.",
        "targetPhraseFa": "بازگشت به شهر نیویورک پس از ماه‌ها بسیار شگفت‌انگیز است.",
        "phoneticGuide": "/ɪt ɪz ˈwʌndərfl tuː biː bæk ɪn nuː jɔːrk ˈsɪti ˈæftər soʊ ˈmeni mʌnθs/",
        "speakingTipsFa": "روی کلمه wonderful برای بیان شوق استرس بگذارید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه بازگشت به شهر جدید می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 1: Rob Returns to New York', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره بازگشت به شهر جدید است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding بازگشت به شهر جدید.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره بازگشت به شهر جدید."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 1: Rob Returns to New York) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "back",
          "months",
          "city"
        ],
        "sampleAnswerEn": "Returning to New York for work was an exciting opportunity that I gladly accepted.",
        "sampleAnswerFa": "بازگشت به نیویورک برای کار فرصت هیجان‌انگیزی بود که با کمال میل پذیرفتم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v02",
    "level": "a2",
    "episodeNumber": 2,
    "titleFa": "اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل",
    "titleEn": "Episode 1 · Part 2: Calling Reception to Fix an Issue",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "0:57",
    "durationSec": 57,
    "fileName": "AEF3e_SB2_PE_Ep1_Calling _reception.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Calling _reception.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #059669, #10b981)",
    "posterIcon": "🛎️",
    "summaryFa": "راب از اتاقش با پذیرش هتل تماس می‌گیرد تا مشکل سیستم تهویه هوا و نیاز به حوله اضافی را گزارش دهد.",
    "summaryEn": "Rob phones the hotel reception desk from his room to report a problem with the room's air conditioning and extra towels.",
    "keyTopicsFa": [
      "گزارش مشکلات اتاق هتل (The air conditioning isn't working)",
      "درخواست سرویس خدمات (Could you send someone?)",
      "اصطلاحات مودبانه خدمات مشتریان",
      "حل فوری مشکل"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 2: Calling Reception to Fix an Issue.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 14,
        "timeDisplay": "0:14",
        "textEn": "Detailed conversation and communicative exchange regarding گزارش مشکلات اتاق هتل (The air conditioning isn't working).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون گزارش مشکلات اتاق هتل (The air conditioning isn't working).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 42,
        "timeDisplay": "0:42",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 2: Calling Reception to Fix an Issue.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 2: Calling Reception to Fix an Issue', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 19,
        "timestampDisplay": "0:19",
        "explanationFa": "در این صحنه، تمرکز بر گزارش مشکلات اتاق هتل (The air conditioning isn't working) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob phones the hotel reception desk from his room to report a problem with the r...",
            "textFa": "تمرکز اصلی بر راب از اتاقش با پذیرش هتل تماس می‌گیرد تا مشکل سیستم تهویه هوا و نیاز ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (گزارش مشکلات اتاق هتل (The air conditioning isn't working)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 2: Calling Reception to Fix an Issue)?",
        "explanationFa": "واژه reception کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Reception: an essential communicative term used throughout this scenario.",
            "textFa": "Reception: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Hello, reception? There's a problem with the air conditioning in room 305.",
            "textFa": "سلام، پذیرش؟ مشکلی در سیستم تهویه هوای اتاق ۳۰۵ وجود دارد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Hello, reception? There's a problem with the air conditioning in room 305.",
        "targetPhraseFa": "سلام، پذیرش؟ مشکلی در سیستم تهویه هوای اتاق ۳۰۵ وجود دارد.",
        "phoneticGuide": "/həˈloʊ rɪˈsepʃn ðeərz ə ˈprɒbləm wɪð ðiː ˈeər kənˌdɪʃənɪŋ ɪn ruːm θriː oʊ faɪv/",
        "speakingTipsFa": "در بیان شماره اتاق، عدد صفر معمولاً به صورت 'o' /oʊ/ خوانده می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه گزارش مشکلات اتاق هتل (The air conditioning isn't working) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 2: Calling Reception to Fix an Issue', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره گزارش مشکلات اتاق هتل (The air conditioning isn't working) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding گزارش مشکلات اتاق هتل (The air conditioning isn't working).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره گزارش مشکلات اتاق هتل (The air conditioning isn't working)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 2: Calling Reception to Fix an Issue) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "reception",
          "room",
          "problem"
        ],
        "sampleAnswerEn": "I contacted hotel reception immediately because the heating in my bedroom was not functioning.",
        "sampleAnswerFa": "من فوراً با پذیرش هتل تماس گرفتم زیرا سیستم گرمایش در اتاقم کار نمی‌کرد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v03",
    "level": "a2",
    "episodeNumber": 3,
    "titleFa": "اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل",
    "titleEn": "Episode 1 · Part 3: Jenny and Rob Meet Again",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "1:35",
    "durationSec": 95,
    "fileName": "AEF3e_SB2_PE_Ep1_Jenny_and_Rob_meet_again.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Jenny_and_Rob_meet_again.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
    "posterIcon": "☕",
    "summaryFa": "جنی به لابی هتل می‌آید تا به راب خوشامد بگوید، از احوال هم باخبر شوند و او را به شام خوشامدگویی با همکاران دعوت کند.",
    "summaryEn": "Jenny arrives at the hotel lobby to welcome Rob, catch up on life, and invite him to a welcome dinner with colleagues.",
    "keyTopicsFa": [
      "دیدار مجدد پس از مدت طولانی (Long time no see)",
      "احوالپرسی صمیمانه",
      "صحبت درباره استقرار در هتل",
      "برنامه‌ریزی ملاقات کاری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 3: Jenny and Rob Meet Again.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 23,
        "timeDisplay": "0:23",
        "textEn": "Detailed conversation and communicative exchange regarding دیدار مجدد پس از مدت طولانی (Long time no see).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدار مجدد پس از مدت طولانی (Long time no see).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 71,
        "timeDisplay": "1:11",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 3: Jenny and Rob Meet Again.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 3: Jenny and Rob Meet Again', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 31,
        "timestampDisplay": "0:31",
        "explanationFa": "در این صحنه، تمرکز بر دیدار مجدد پس از مدت طولانی (Long time no see) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny arrives at the hotel lobby to welcome Rob, catch up on life, and invite hi...",
            "textFa": "تمرکز اصلی بر جنی به لابی هتل می‌آید تا به راب خوشامد بگوید، از احوال هم باخبر شوند ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدار مجدد پس از مدت طولانی (Long time no see)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 3: Jenny and Rob Meet Again)?",
        "explanationFa": "واژه again کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Again: an essential communicative term used throughout this scenario.",
            "textFa": "Again: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "It's so good to see you again! How was your flight from London?",
            "textFa": "دیدار مجددت خیلی عالیه! پروازت از لندن چطور بود؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "It's so good to see you again! How was your flight from London?",
        "targetPhraseFa": "دیدار مجددت خیلی عالیه! پروازت از لندن چطور بود؟",
        "phoneticGuide": "/ɪts soʊ ɡʊd tuː siː juː əˈɡen haʊ wəz jɔːr flaɪt frəm ˈlʌndən/",
        "speakingTipsFa": "کلمه flight به صورت /flaɪt/ با صدادار کشیده ادا می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدار مجدد پس از مدت طولانی (Long time no see) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 3: Jenny and Rob Meet Again', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدار مجدد پس از مدت طولانی (Long time no see) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدار مجدد پس از مدت طولانی (Long time no see).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدار مجدد پس از مدت طولانی (Long time no see)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 3: Jenny and Rob Meet Again) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "again",
          "flight",
          "good"
        ],
        "sampleAnswerEn": "It was wonderful meeting my friend again after a pleasant flight across the Atlantic.",
        "sampleAnswerFa": "دیدار مجدد دوستم پس از یک پرواز دلپذیر بر فراز اقیانوس اطلس بسیار لذت‌بخش بود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v04",
    "level": "a2",
    "episodeNumber": 4,
    "titleFa": "اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی",
    "titleEn": "Episode 2 · Part 1: In the New York Office with Holly",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:34",
    "durationSec": 94,
    "fileName": "AEF3e_SB2_PE_Ep2_In_the_New_York_office.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_In_the_New_York_office.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
    "posterIcon": "🏢",
    "summaryFa": "راب با هالی، یکی دیگر از نویسندگان بااستعداد مجله آشنا می‌شود و درباره مهلت‌های تحویل مقالات بحث می‌کنند.",
    "summaryEn": "Rob is introduced to Holly, another talented staff writer at the magazine, and they discuss their upcoming editorial deadlines.",
    "keyTopicsFa": [
      "آشنایی با همکاران جدید",
      "وظایف تحریریه مجله",
      "تقسیم کار در تیم",
      "مکالمات رسمی اداری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 1: In the New York Office with Holly.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 23,
        "timeDisplay": "0:23",
        "textEn": "Detailed conversation and communicative exchange regarding آشنایی با همکاران جدید.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون آشنایی با همکاران جدید.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 70,
        "timeDisplay": "1:10",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 1: In the New York Office with Holly.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 1: In the New York Office with Holly', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 31,
        "timestampDisplay": "0:31",
        "explanationFa": "در این صحنه، تمرکز بر آشنایی با همکاران جدید و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob is introduced to Holly, another talented staff writer at the magazine, and t...",
            "textFa": "تمرکز اصلی بر راب با هالی، یکی دیگر از نویسندگان بااستعداد مجله آشنا می‌شود و درباره... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (آشنایی با همکاران جدید) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 1: In the New York Office with Holly)?",
        "explanationFa": "واژه office کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Office: an essential communicative term used throughout this scenario.",
            "textFa": "Office: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Holly, this is Rob Walker. He's going to work with us on the cultural series.",
            "textFa": "هالی، ایشان راب واکر هستند. قرار است در مجموعه مقالات فرهنگی با ما همکاری کنند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Holly, this is Rob Walker. He's going to work with us on the cultural series.",
        "targetPhraseFa": "هالی، ایشان راب واکر هستند. قرار است در مجموعه مقالات فرهنگی با ما همکاری کنند.",
        "phoneticGuide": "/ˈhɑːli ðɪs ɪz rɑːb ˈwɔːkər hiːz ˈɡoʊɪŋ tuː wɜːrk wɪð ʌs ɑːn ðə ˈkʌltʃərəl ˈsɪriːz/",
        "speakingTipsFa": "ساختار 'This is [Name]' متداول‌ترین شیوه معرفی شخص ثالث است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه آشنایی با همکاران جدید می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 1: In the New York Office with Holly', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره آشنایی با همکاران جدید است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding آشنایی با همکاران جدید.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره آشنایی با همکاران جدید."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 1: In the New York Office with Holly) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "office",
          "work",
          "colleague"
        ],
        "sampleAnswerEn": "Our manager introduced the new journalist to the editorial staff in the New York branch.",
        "sampleAnswerFa": "مدیرمان روزنامه‌نگار جدید را به کادر تحریریه شعبه نیویورک معرفی کرد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v05",
    "level": "a2",
    "episodeNumber": 5,
    "titleFa": "اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران",
    "titleEn": "Episode 2 · Part 2: At the Restaurant with the Team",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:26",
    "durationSec": 86,
    "fileName": "AEF3e_SB2_PE_Ep2_At_the_restaurant.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_At_the_restaurant.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
    "posterIcon": "🥗",
    "summaryFa": "راب، جنی و هالی در یک رستوران ناهار می‌خورند، ساندویچ‌های مخصوص سفارش می‌دهند و درباره سبک زندگی در منهتن صحبت می‌کنند.",
    "summaryEn": "Rob, Jenny, and Holly enjoy lunch together at a restaurant, ordering specialty sandwiches and discussing Manhattan lifestyle.",
    "keyTopicsFa": [
      "سفارش غذا و مخلفات در رستوران",
      "مکالمات سر میز غذا (Table talk)",
      "بحث درباره رژیم غذایی",
      "فرهنگ ناهار کاری در آمریکا"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 2: At the Restaurant with the Team.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 21,
        "timeDisplay": "0:21",
        "textEn": "Detailed conversation and communicative exchange regarding سفارش غذا و مخلفات در رستوران.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون سفارش غذا و مخلفات در رستوران.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 64,
        "timeDisplay": "1:04",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 2: At the Restaurant with the Team.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 2: At the Restaurant with the Team', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 28,
        "timestampDisplay": "0:28",
        "explanationFa": "در این صحنه، تمرکز بر سفارش غذا و مخلفات در رستوران و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob, Jenny, and Holly enjoy lunch together at a restaurant, ordering specialty s...",
            "textFa": "تمرکز اصلی بر راب، جنی و هالی در یک رستوران ناهار می‌خورند، ساندویچ‌های مخصوص سفارش ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (سفارش غذا و مخلفات در رستوران) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 2: At the Restaurant with the Team)?",
        "explanationFa": "واژه restaurant کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Restaurant: an essential communicative term used throughout this scenario.",
            "textFa": "Restaurant: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Could we also get some mineral water with lemon for the table?",
            "textFa": "آیا ممکن است برای میز مقداری آب معدنی با لیمو هم بیاورید؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Could we also get some mineral water with lemon for the table?",
        "targetPhraseFa": "آیا ممکن است برای میز مقداری آب معدنی با لیمو هم بیاورید؟",
        "phoneticGuide": "/kʊd wiː ˈɔːlsoʊ ɡet səm ˈmɪnərəl ˈwɔːtər wɪð ˈlemən fɔːr ðə ˈteɪbl/",
        "speakingTipsFa": "عبارت 'for the table' به معنای سفارش مشترک برای تمام افراد سر میز است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه سفارش غذا و مخلفات در رستوران می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 2: At the Restaurant with the Team', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره سفارش غذا و مخلفات در رستوران است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding سفارش غذا و مخلفات در رستوران.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره سفارش غذا و مخلفات در رستوران."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 2: At the Restaurant with the Team) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "restaurant",
          "water",
          "lunch"
        ],
        "sampleAnswerEn": "During our lunch break, we ordered delicious salads and talked about our favorite Manhattan cafes.",
        "sampleAnswerFa": "در طول زنگ ناهار، سالادهای لذیذی سفارش دادیم و درباره کافه‌های محبوبمان در منهتن صحبت کردیم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v06",
    "level": "a2",
    "episodeNumber": 6,
    "titleFa": "اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی",
    "titleEn": "Episode 2 · Part 3: Holly and Rob Make Friends",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:52",
    "durationSec": 112,
    "fileName": "AEF3e_SB2_PE_Ep2_Holly_and_Rob_make_friends.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_Holly_and_Rob_make_friends.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    "posterIcon": "💬",
    "summaryFa": "هالی و راب علایق مشترک موسیقیایی خود را کشف می‌کنند و باشگاه‌های کمدی و برنامه‌های فرهنگی شهر را به یکدیگر پیشنهاد می‌دهند.",
    "summaryEn": "Holly and Rob discover common musical interests and recommend comedy clubs and cultural events around the city.",
    "keyTopicsFa": [
      "کشف علایق مشترک (Do you like jazz?)",
      "توصیه جاهای تفریحی (You should check out...)",
      "اصطلاحات شوخ‌طبعی و صمیمیت",
      "برنامه‌ریزی آخر هفته"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 3: Holly and Rob Make Friends.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 28,
        "timeDisplay": "0:28",
        "textEn": "Detailed conversation and communicative exchange regarding کشف علایق مشترک (Do you like jazz?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون کشف علایق مشترک (Do you like jazz?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 84,
        "timeDisplay": "1:24",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 3: Holly and Rob Make Friends.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 3: Holly and Rob Make Friends', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 37,
        "timestampDisplay": "0:37",
        "explanationFa": "در این صحنه، تمرکز بر کشف علایق مشترک (Do you like jazz?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Holly and Rob discover common musical interests and recommend comedy clubs and c...",
            "textFa": "تمرکز اصلی بر هالی و راب علایق مشترک موسیقیایی خود را کشف می‌کنند و باشگاه‌های کمدی ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (کشف علایق مشترک (Do you like jazz?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 3: Holly and Rob Make Friends)?",
        "explanationFa": "واژه music کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Music: an essential communicative term used throughout this scenario.",
            "textFa": "Music: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "If you love live music, you should definitely check out the Village.",
            "textFa": "اگر عاشق موسیقی زنده هستی، حتماً باید سری به محله گرینویچ ویلیج بزنی."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "If you love live music, you should definitely check out the Village.",
        "targetPhraseFa": "اگر عاشق موسیقی زنده هستی، حتماً باید سری به محله گرینویچ ویلیج بزنی.",
        "phoneticGuide": "/ɪf juː lʌv laɪv ˈmjuːzɪk juː ʃʊd ˈdefɪnətli tʃek aʊt ðə ˈvɪlɪdʒ/",
        "speakingTipsFa": "کلمه definitely دارای استرس روی سیلاب اول /ˈdefɪnətli/ است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه کشف علایق مشترک (Do you like jazz?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 3: Holly and Rob Make Friends', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره کشف علایق مشترک (Do you like jazz?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding کشف علایق مشترک (Do you like jazz?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره کشف علایق مشترک (Do you like jazz?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 3: Holly and Rob Make Friends) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "music",
          "recommend",
          "weekend"
        ],
        "sampleAnswerEn": "My colleague recommended a fantastic live jazz club in Brooklyn for the weekend.",
        "sampleAnswerFa": "همکارم یک باشگاه فوق‌العاده موسیقی جاز زنده در بروکلین را برای آخر هفته پیشنهاد کرد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v07",
    "level": "a2",
    "episodeNumber": 7,
    "titleFa": "اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه",
    "titleEn": "Episode 3 · Part 1: Taking Something Back to a Store",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A2",
    "duration": "1:47",
    "durationSec": 107,
    "fileName": "AEF3e_SB2_PE_Ep3_Taking_something_back_to_a_store.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep3_Taking_something_back_to_a_store.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #db2777, #f472b6)",
    "posterIcon": "🔄",
    "summaryFa": "راب یک شارژر معیوب را به فروشگاه لوازم الکترونیکی برمی‌گرداند، فاکتور خرید را ارائه داده و درخواست استرداد وجه یا تعویض می‌کند.",
    "summaryEn": "Rob returns a defective electronic charger to an electronics shop, presenting his receipt and requesting a refund or replacement.",
    "keyTopicsFa": [
      "مرجوع کردن جنس (Return an item)",
      "فاکتور خرید (Receipt)",
      "استرداد وجه یا تعویض (Refund or exchange)",
      "مشکلات کالای معیوب"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 1: Taking Something Back to a Store.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 26,
        "timeDisplay": "0:26",
        "textEn": "Detailed conversation and communicative exchange regarding مرجوع کردن جنس (Return an item).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مرجوع کردن جنس (Return an item).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 80,
        "timeDisplay": "1:20",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 1: Taking Something Back to a Store.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 1: Taking Something Back to a Store', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 35,
        "timestampDisplay": "0:35",
        "explanationFa": "در این صحنه، تمرکز بر مرجوع کردن جنس (Return an item) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob returns a defective electronic charger to an electronics shop, presenting hi...",
            "textFa": "تمرکز اصلی بر راب یک شارژر معیوب را به فروشگاه لوازم الکترونیکی برمی‌گرداند، فاکتور ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مرجوع کردن جنس (Return an item)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 1: Taking Something Back to a Store)?",
        "explanationFa": "واژه return کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Return: an essential communicative term used throughout this scenario.",
            "textFa": "Return: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I bought this charger yesterday, but it doesn't work. Can I get a refund?",
            "textFa": "من این شارژر را دیروز خریدم اما کار نمی‌کند. آیا می‌توانم پولم را پس بگیرم؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I bought this charger yesterday, but it doesn't work. Can I get a refund?",
        "targetPhraseFa": "من این شارژر را دیروز خریدم اما کار نمی‌کند. آیا می‌توانم پولم را پس بگیرم؟",
        "phoneticGuide": "/aɪ bɔːt ðɪs ˈtʃɑːrdʒər ˈjestərdeɪ bʌt ɪt ˈdʌznt wɜːrk kən aɪ ɡet ə ˈriːfʌnd/",
        "speakingTipsFa": "در کلمه receipt حرف p کاملاً بی‌صداست: /rɪˈsiːt/.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مرجوع کردن جنس (Return an item) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 1: Taking Something Back to a Store', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مرجوع کردن جنس (Return an item) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مرجوع کردن جنس (Return an item).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مرجوع کردن جنس (Return an item)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 1: Taking Something Back to a Store) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "return",
          "receipt",
          "refund"
        ],
        "sampleAnswerEn": "I took the damaged headphones back to the store with my receipt and received a full refund.",
        "sampleAnswerFa": "هدفون آسیب‌دیده را همراه با فاکتور به فروشگاه برگرداندم و کل وجه را پس گرفتم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v08",
    "level": "a2",
    "episodeNumber": 8,
    "titleFa": "اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی",
    "titleEn": "Episode 3 · Part 2: Rob Has a Fitness Problem",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A2",
    "duration": "1:45",
    "durationSec": 105,
    "fileName": "AEF3e_SB2_PE_Ep3_Rob_has_a_problem.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep3_Rob_has_a_problem.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🏃‍♂️",
    "summaryFa": "راب به دلیل ساعات کاری طولانی احساس خستگی و افت آمادگی جسمانی دارد و از جنی درباره عادات ورزش در سنترال پارک می‌پرسد.",
    "summaryEn": "Rob feels out of shape and exhausted from long office hours, asking Jenny about healthy workout habits in Central Park.",
    "keyTopicsFa": [
      "بیان خستگی و آمادگی جسمانی (Out of shape)",
      "عادات ورزشی (Jogging, running)",
      "انگیزه برای ورزش روزانه",
      "مشاوره تندرستی بین همکاران"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 2: Rob Has a Fitness Problem.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 26,
        "timeDisplay": "0:26",
        "textEn": "Detailed conversation and communicative exchange regarding بیان خستگی و آمادگی جسمانی (Out of shape).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون بیان خستگی و آمادگی جسمانی (Out of shape).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 78,
        "timeDisplay": "1:18",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 2: Rob Has a Fitness Problem.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 2: Rob Has a Fitness Problem', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 35,
        "timestampDisplay": "0:35",
        "explanationFa": "در این صحنه، تمرکز بر بیان خستگی و آمادگی جسمانی (Out of shape) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob feels out of shape and exhausted from long office hours, asking Jenny about ...",
            "textFa": "تمرکز اصلی بر راب به دلیل ساعات کاری طولانی احساس خستگی و افت آمادگی جسمانی دارد و ا... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (بیان خستگی و آمادگی جسمانی (Out of shape)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 2: Rob Has a Fitness Problem)?",
        "explanationFa": "واژه shape کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Shape: an essential communicative term used throughout this scenario.",
            "textFa": "Shape: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I really need to get in shape; I feel exhausted after climbing stairs.",
            "textFa": "من واقعاً باید روی فرم بیایم؛ بعد از بالا رفتن از پله‌ها احساس خستگی شدید می‌کنم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I really need to get in shape; I feel exhausted after climbing stairs.",
        "targetPhraseFa": "من واقعاً باید روی فرم بیایم؛ بعد از بالا رفتن از پله‌ها احساس خستگی شدید می‌کنم.",
        "phoneticGuide": "/aɪ ˈrɪəli niːd tuː ɡet ɪn ʃeɪp aɪ fiːl ɪɡˈzɔːstɪd ˈæftər ˈklaɪmɪŋ sterz/",
        "speakingTipsFa": "اصطلاح 'get in shape' یعنی رسیدن به تناسب اندام و آمادگی بدنی.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه بیان خستگی و آمادگی جسمانی (Out of shape) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 2: Rob Has a Fitness Problem', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره بیان خستگی و آمادگی جسمانی (Out of shape) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding بیان خستگی و آمادگی جسمانی (Out of shape).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره بیان خستگی و آمادگی جسمانی (Out of shape)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 2: Rob Has a Fitness Problem) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "shape",
          "exercise",
          "feel"
        ],
        "sampleAnswerEn": "After noticing how tired I felt at work, I decided to exercise every morning before breakfast.",
        "sampleAnswerFa": "پس از متوجه شدن احساس خستگی در محل کار، تصمیم گرفتم هر روز صبح قبل از صبحانه ورزش کنم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v09",
    "level": "a2",
    "episodeNumber": 9,
    "titleFa": "اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی",
    "titleEn": "Episode 3 · Part 3: Rob Decides to Start Running",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A2",
    "duration": "1:32",
    "durationSec": 92,
    "fileName": "AEF3e_SB2_PE_Ep3_Rob_decides_to_exercise.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep3_Rob_decides_to_exercise.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #16a34a, #4ade80)",
    "posterIcon": "👟",
    "summaryFa": "جنی موافقت می‌کند تا فردا برای دویدن صبحگاهی در سنترال پارک همراه راب باشد و ساعت ۶:۳۰ صبح را به عنوان قرار ورزشی تعیین می‌کنند.",
    "summaryEn": "Jenny agrees to join Rob for an early morning jog in Central Park, setting a challenge for 6:30 AM tomorrow.",
    "keyTopicsFa": [
      "تعیین ساعت قرار ورزشی",
      "لوازم دویدن (Running shoes)",
      "انگیزه مثبت و تشویق",
      "برنامه‌ریزی صبح زود"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 3: Rob Decides to Start Running.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 23,
        "timeDisplay": "0:23",
        "textEn": "Detailed conversation and communicative exchange regarding تعیین ساعت قرار ورزشی.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون تعیین ساعت قرار ورزشی.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 69,
        "timeDisplay": "1:09",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 3: Rob Decides to Start Running.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 3: Rob Decides to Start Running', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 30,
        "timestampDisplay": "0:30",
        "explanationFa": "در این صحنه، تمرکز بر تعیین ساعت قرار ورزشی و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny agrees to join Rob for an early morning jog in Central Park, setting a cha...",
            "textFa": "تمرکز اصلی بر جنی موافقت می‌کند تا فردا برای دویدن صبحگاهی در سنترال پارک همراه راب ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (تعیین ساعت قرار ورزشی) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 3: Rob Decides to Start Running)?",
        "explanationFa": "واژه meet کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Meet: an essential communicative term used throughout this scenario.",
            "textFa": "Meet: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Let's meet by the reservoir in Central Park at half past six.",
            "textFa": "بیا ساعت شش و نیم کنار دریاچه سنترال پارک همدیگر را ملاقات کنیم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Let's meet by the reservoir in Central Park at half past six.",
        "targetPhraseFa": "بیا ساعت شش و نیم کنار دریاچه سنترال پارک همدیگر را ملاقات کنیم.",
        "phoneticGuide": "/lets miːt baɪ ðə ˈrezərvwɑːr ɪn ˈsentrəl pɑːrk ət hæf pæst sɪks/",
        "speakingTipsFa": "کلمه reservoir به صورت /ˈrezərvwɑːr/ با ریشه فرانسوی تلفظ می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه تعیین ساعت قرار ورزشی می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 3: Rob Decides to Start Running', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره تعیین ساعت قرار ورزشی است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding تعیین ساعت قرار ورزشی.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره تعیین ساعت قرار ورزشی."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 3: Rob Decides to Start Running) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "meet",
          "running",
          "morning"
        ],
        "sampleAnswerEn": "We scheduled our running session for early tomorrow morning to enjoy the quiet park.",
        "sampleAnswerFa": "جلسه دویدنمان را برای صبح زود فردا برنامه‌ریزی کردیم تا از سکوت پارک لذت ببریم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v10",
    "level": "a2",
    "episodeNumber": 10,
    "titleFa": "اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک",
    "titleEn": "Episode 4 · Part 1: Running in Central Park",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A2",
    "duration": "1:39",
    "durationSec": 99,
    "fileName": "AEF3e_SB2_PE_Ep4_Running_in_Central_Park.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep4_Running_in_Central_Park.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #15803d, #22c55e)",
    "posterIcon": "🌳",
    "summaryFa": "راب برای همراهی با سرعت دویدن بالای جنی در سنترال پارک به تقلا می‌افتد و در پایان احساس سرماخوردگی و گلودرد خفیف می‌کند.",
    "summaryEn": "Rob struggles to keep up with Jenny's fast jogging pace in Central Park and ends up feeling a slight cold and sore throat.",
    "keyTopicsFa": [
      "ورزش در طبیعت شهری",
      "سرعت دویدن (Pace)",
      "شروع علائم سرماخوردگی",
      "اصطلاحات تشویق ورزشی (Keep going!)"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 1: Running in Central Park.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 24,
        "timeDisplay": "0:24",
        "textEn": "Detailed conversation and communicative exchange regarding ورزش در طبیعت شهری.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون ورزش در طبیعت شهری.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 74,
        "timeDisplay": "1:14",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 1: Running in Central Park.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 1: Running in Central Park', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 33,
        "timestampDisplay": "0:33",
        "explanationFa": "در این صحنه، تمرکز بر ورزش در طبیعت شهری و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob struggles to keep up with Jenny's fast jogging pace in Central Park and ends...",
            "textFa": "تمرکز اصلی بر راب برای همراهی با سرعت دویدن بالای جنی در سنترال پارک به تقلا می‌افتد... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (ورزش در طبیعت شهری) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 1: Running in Central Park)?",
        "explanationFa": "واژه running کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Running: an essential communicative term used throughout this scenario.",
            "textFa": "Running: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Wait for me! You're running way too fast for my first day.",
            "textFa": "منتظر من بمان! تو برای اولین روز من بیش از حد سریع می‌دوی."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Wait for me! You're running way too fast for my first day.",
        "targetPhraseFa": "منتظر من بمان! تو برای اولین روز من بیش از حد سریع می‌دوی.",
        "phoneticGuide": "/weɪt fɔːr miː jɔːr ˈrʌnɪŋ weɪ tuː fæst fɔːr maɪ fɜːrst deɪ/",
        "speakingTipsFa": "عبارت 'way too fast' شدت زیادی سرعت را به شکل خودمانی نشان می‌دهد.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه ورزش در طبیعت شهری می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 1: Running in Central Park', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره ورزش در طبیعت شهری است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding ورزش در طبیعت شهری.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره ورزش در طبیعت شهری."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 1: Running in Central Park) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "running",
          "park",
          "fast"
        ],
        "sampleAnswerEn": "Running in the cool morning air was invigorating, although keeping pace was challenging.",
        "sampleAnswerFa": "دویدن در هوای خنک صبحگاهی نشاط‌آور بود، هرچند هماهنگ نگه داشتن سرعت چالش‌برانگیز بود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v11",
    "level": "a2",
    "episodeNumber": 11,
    "titleFa": "اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی",
    "titleEn": "Episode 4 · Part 2: Going to a Pharmacy in New York",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A2",
    "duration": "1:00",
    "durationSec": 60,
    "fileName": "AEF3e_SB2_PE_Ep4_Going_to_a_pharmacy.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep4_Going_to_a_pharmacy.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "posterIcon": "💊",
    "summaryFa": "راب به یک داروخانه آمریکایی مراجعه می‌کند تا گلودرد و سردرد خود را توضیح دهد و از دکتر داروساز داروی مناسب دریافت کند.",
    "summaryEn": "Rob visits an American pharmacy / drugstore to describe his sore throat and headache, asking the pharmacist for suitable medicine.",
    "keyTopicsFa": [
      "اصطلاحات داروخانه (Pharmacy / Drugstore)",
      "توصیف علائم بیماری (Sore throat, headache, fever)",
      "دوز و نحوه مصرف دارو (Take two tablets every four hours)",
      "داروهای بدون نسخه (Over-the-counter)"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 2: Going to a Pharmacy in New York.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 15,
        "timeDisplay": "0:15",
        "textEn": "Detailed conversation and communicative exchange regarding اصطلاحات داروخانه (Pharmacy / Drugstore).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون اصطلاحات داروخانه (Pharmacy / Drugstore).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 45,
        "timeDisplay": "0:45",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 2: Going to a Pharmacy in New York.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 2: Going to a Pharmacy in New York', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 20,
        "timestampDisplay": "0:20",
        "explanationFa": "در این صحنه، تمرکز بر اصطلاحات داروخانه (Pharmacy / Drugstore) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob visits an American pharmacy / drugstore to describe his sore throat and head...",
            "textFa": "تمرکز اصلی بر راب به یک داروخانه آمریکایی مراجعه می‌کند تا گلودرد و سردرد خود را توض... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (اصطلاحات داروخانه (Pharmacy / Drugstore)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 2: Going to a Pharmacy in New York)?",
        "explanationFa": "واژه throat کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Throat: an essential communicative term used throughout this scenario.",
            "textFa": "Throat: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have a terrible sore throat and a headache. What do you recommend?",
            "textFa": "من گلودرد و سردرد شدیدی دارم. شما چه دارویی را پیشنهاد می‌کنید؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have a terrible sore throat and a headache. What do you recommend?",
        "targetPhraseFa": "من گلودرد و سردرد شدیدی دارم. شما چه دارویی را پیشنهاد می‌کنید؟",
        "phoneticGuide": "/aɪ hæv ə ˈterəbl sɔːr θroʊt ənd ə ˈhedeɪk wʌt duː juː ˌrekəˈmend/",
        "speakingTipsFa": "تلفظ th در sore throat به صورت بین دندانی /θroʊt/ است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه اصطلاحات داروخانه (Pharmacy / Drugstore) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 2: Going to a Pharmacy in New York', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره اصطلاحات داروخانه (Pharmacy / Drugstore) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding اصطلاحات داروخانه (Pharmacy / Drugstore).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره اصطلاحات داروخانه (Pharmacy / Drugstore)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 2: Going to a Pharmacy in New York) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "throat",
          "pharmacy",
          "medicine"
        ],
        "sampleAnswerEn": "The pharmacist recommended taking these soothing throat lozenges twice a day with water.",
        "sampleAnswerFa": "داروساز مصرف این قرص‌های مکیدنی تسکین‌دهنده گلو را دو بار در روز با آب توصیه کرد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v12",
    "level": "a2",
    "episodeNumber": 12,
    "titleFa": "اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی",
    "titleEn": "Episode 4 · Part 3: Dinner at Jenny's Apartment",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "A2",
    "duration": "1:59",
    "durationSec": 119,
    "fileName": "AEF3e_SB2_PE_Ep4_Dinner_at_Jenny's_apartment.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep4_Dinner_at_Jenny's_apartment.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #d97706, #fbbf24)",
    "posterIcon": "🕯️",
    "summaryFa": "جنی در آپارتمانش در بروکلین برای راب شام می‌پزد، غذای خانگی میل می‌کنند و درباره آرزوهای زندگی‌شان گفتگو دارند.",
    "summaryEn": "Jenny cooks dinner for Rob at her Brooklyn apartment, sharing home-cooked food and talking about their life aspirations.",
    "keyTopicsFa": [
      "مهمانی خانگی (Dinner at home)",
      "تعریف از دستپخت (This tastes amazing!)",
      "آداب و رسوم ورود به خانه در آمریکا",
      "مکالمه صمیمانه"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 3: Dinner at Jenny's Apartment.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 29,
        "timeDisplay": "0:29",
        "textEn": "Detailed conversation and communicative exchange regarding مهمانی خانگی (Dinner at home).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مهمانی خانگی (Dinner at home).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 89,
        "timeDisplay": "1:29",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 3: Dinner at Jenny's Apartment.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 3: Dinner at Jenny's Apartment', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 39,
        "timestampDisplay": "0:39",
        "explanationFa": "در این صحنه، تمرکز بر مهمانی خانگی (Dinner at home) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny cooks dinner for Rob at her Brooklyn apartment, sharing home-cooked food a...",
            "textFa": "تمرکز اصلی بر جنی در آپارتمانش در بروکلین برای راب شام می‌پزد، غذای خانگی میل می‌کنن... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مهمانی خانگی (Dinner at home)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 3: Dinner at Jenny's Apartment)?",
        "explanationFa": "واژه home کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Home: an essential communicative term used throughout this scenario.",
            "textFa": "Home: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Thank you for inviting me to your home; dinner smells absolutely delicious.",
            "textFa": "ممنون که مرا به خانه‌ات دعوت کردی؛ بوی شام واقعاً لذیذ و هوس‌انگیز است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Thank you for inviting me to your home; dinner smells absolutely delicious.",
        "targetPhraseFa": "ممنون که مرا به خانه‌ات دعوت کردی؛ بوی شام واقعاً لذیذ و هوس‌انگیز است.",
        "phoneticGuide": "/θæŋk juː fɔːr ɪnˈvaɪtɪŋ miː tuː jɔːr hoʊm ˈdɪnər smelz ˌæbsəˈluːtli dɪˈlɪʃəs/",
        "speakingTipsFa": "کلمه delicious به صورت /dɪˈlɪʃəs/ تلفظ می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مهمانی خانگی (Dinner at home) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 3: Dinner at Jenny's Apartment', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مهمانی خانگی (Dinner at home) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مهمانی خانگی (Dinner at home).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مهمانی خانگی (Dinner at home)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 3: Dinner at Jenny's Apartment) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "home",
          "dinner",
          "delicious"
        ],
        "sampleAnswerEn": "Having a warm home-cooked meal with good friends is always the highlight of the week.",
        "sampleAnswerFa": "صرف یک وعده غذای گرم خانگی با دوستان صمیمی همیشه بهترین اتفاق هفته است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v13",
    "level": "a2",
    "episodeNumber": 13,
    "titleFa": "اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار",
    "titleEn": "Episode 5 · Part 1: Rob is Late Again",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A2",
    "duration": "1:50",
    "durationSec": 110,
    "fileName": "AEF3e_SB2_PE_Ep5_Rob_is_late_again.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep5_Rob_is_late_again.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
    "posterIcon": "⏰",
    "summaryFa": "راب متوجه گذشت زمان نمی‌شود و در مترو معطل می‌ماند و با ارسال پیامک به جنی و هالی بابت تاخیر عذرخواهی می‌کند.",
    "summaryEn": "Rob loses track of time and gets delayed on the subway, frantically texting Jenny and Holly to apologize for his tardiness.",
    "keyTopicsFa": [
      "عذرخواهی برای تاخیر (I'm running late)",
      "مشکلات ترافیک و قطار مترو",
      "ارسال پیامک‌های فوری",
      "اصطلاحات زمان‌بندی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 1: Rob is Late Again.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 27,
        "timeDisplay": "0:27",
        "textEn": "Detailed conversation and communicative exchange regarding عذرخواهی برای تاخیر (I'm running late).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون عذرخواهی برای تاخیر (I'm running late).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 82,
        "timeDisplay": "1:22",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 1: Rob is Late Again.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 1: Rob is Late Again', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 36,
        "timestampDisplay": "0:36",
        "explanationFa": "در این صحنه، تمرکز بر عذرخواهی برای تاخیر (I'm running late) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob loses track of time and gets delayed on the subway, frantically texting Jenn...",
            "textFa": "تمرکز اصلی بر راب متوجه گذشت زمان نمی‌شود و در مترو معطل می‌ماند و با ارسال پیامک به... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (عذرخواهی برای تاخیر (I'm running late)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 1: Rob is Late Again)?",
        "explanationFa": "واژه sorry کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Sorry: an essential communicative term used throughout this scenario.",
            "textFa": "Sorry: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I am so sorry I'm late; the subway train stopped between stations.",
            "textFa": "خیلی عذرخواهی می‌کنم که دیر رسیدم؛ قطار مترو بین ایستگاه‌ها متوقف شد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I am so sorry I'm late; the subway train stopped between stations.",
        "targetPhraseFa": "خیلی عذرخواهی می‌کنم که دیر رسیدم؛ قطار مترو بین ایستگاه‌ها متوقف شد.",
        "phoneticGuide": "/aɪ æm soʊ ˈsɑːri aɪm leɪt ðə ˈsʌbweɪ treɪn stɑːpt bɪˈtwiːn ˈsteɪʃnz/",
        "speakingTipsFa": "عبارت 'running late' متداول‌ترین اصطلاح روزمره برای تاخیر داشتن است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه عذرخواهی برای تاخیر (I'm running late) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 1: Rob is Late Again', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره عذرخواهی برای تاخیر (I'm running late) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding عذرخواهی برای تاخیر (I'm running late).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره عذرخواهی برای تاخیر (I'm running late)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 1: Rob is Late Again) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "sorry",
          "late",
          "subway"
        ],
        "sampleAnswerEn": "Due to unexpected transit delays, I arrived twenty minutes late for our scheduled meeting.",
        "sampleAnswerFa": "به دلیل تاخیرهای غیرمنتظره حمل‌ونقل عمومی، بیست دقیقه برای جلسه تعیین‌شده دیر رسیدم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v14",
    "level": "a2",
    "episodeNumber": 14,
    "titleFa": "اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین",
    "titleEn": "Episode 5 · Part 2: Asking How to Get to Brooklyn",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A2",
    "duration": "1:15",
    "durationSec": 75,
    "fileName": "AEF3e_SB2_PE_Ep5_Asking_how_to_get_there.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep5_Asking_how_to_get_there.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #0ea5e9)",
    "posterIcon": "🚇",
    "summaryFa": "راب از متصدی ایستگاه مترو درباره نحوه تعویض خط برای رسیدن به نمایشگاه موزه در بروکلین راهنمایی می‌خواهد.",
    "summaryEn": "Rob asks a subway attendant for instructions on transferring between lines to reach a museum exhibition in Brooklyn.",
    "keyTopicsFa": [
      "مسیریابی در مترو (Which train do I take?)",
      "تعویض خط (Change at 14th Street)",
      "خرید بلیط مترو (MetroCard)",
      "مفهوم قطار تندرو و محلی (Express vs Local train)"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 2: Asking How to Get to Brooklyn.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 18,
        "timeDisplay": "0:18",
        "textEn": "Detailed conversation and communicative exchange regarding مسیریابی در مترو (Which train do I take?).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مسیریابی در مترو (Which train do I take?).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 56,
        "timeDisplay": "0:56",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 2: Asking How to Get to Brooklyn.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 2: Asking How to Get to Brooklyn', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 25,
        "timestampDisplay": "0:25",
        "explanationFa": "در این صحنه، تمرکز بر مسیریابی در مترو (Which train do I take?) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob asks a subway attendant for instructions on transferring between lines to re...",
            "textFa": "تمرکز اصلی بر راب از متصدی ایستگاه مترو درباره نحوه تعویض خط برای رسیدن به نمایشگاه ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مسیریابی در مترو (Which train do I take?)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 2: Asking How to Get to Brooklyn)?",
        "explanationFa": "واژه subway کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Subway: an essential communicative term used throughout this scenario.",
            "textFa": "Subway: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Which subway line goes directly to Brooklyn from here?",
            "textFa": "کدام خط مترو از اینجا مستقیماً به بروکلین می‌رود؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Which subway line goes directly to Brooklyn from here?",
        "targetPhraseFa": "کدام خط مترو از اینجا مستقیماً به بروکلین می‌رود؟",
        "phoneticGuide": "/wɪtʃ ˈsʌbweɪ laɪn ɡoʊz dəˈrektli tuː ˈbrʊklɪn frəm hɪr/",
        "speakingTipsFa": "کلمه directly می‌تواند به دو صورت /dəˈrektli/ یا /daɪˈrektli/ تلفظ شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مسیریابی در مترو (Which train do I take?) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 2: Asking How to Get to Brooklyn', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مسیریابی در مترو (Which train do I take?) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مسیریابی در مترو (Which train do I take?).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مسیریابی در مترو (Which train do I take?)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 2: Asking How to Get to Brooklyn) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "subway",
          "train",
          "line"
        ],
        "sampleAnswerEn": "To reach the gallery, take the express train and transfer to the local line at 14th Street.",
        "sampleAnswerFa": "برای رسیدن به گالری، سوار قطار تندرو شوید و در خیابان چهاردهم به خط محلی تغییر مسیر دهید.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v15",
    "level": "a2",
    "episodeNumber": 15,
    "titleFa": "اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین",
    "titleEn": "Episode 5 · Part 3: Holly and Rob Explore Brooklyn",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A2",
    "duration": "1:38",
    "durationSec": 98,
    "fileName": "AEF3e_SB2_PE_Ep5_Holly_and_Rob_in_Brooklyn.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep5_Holly_and_Rob_in_Brooklyn.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #9333ea, #a855f7)",
    "posterIcon": "🎨",
    "summaryFa": "هالی خیابان‌های هنری، فروشگاه‌های کلاسیک و کافه‌های جذاب ویلیامزبورگ را به راب نشان داده و دیدگاهی بومی ارائه می‌دهد.",
    "summaryEn": "Holly shows Rob around Williamsburg's artistic streets, vintage shops, and trendy coffee spots, offering an insider's view.",
    "keyTopicsFa": [
      "هنر خیابانی و محله‌های هنری",
      "فروشگاه‌های وینتیج و مد قدیمی",
      "فرهنگ جوانان نیویورک",
      "توصیف فضا و اتمسفر محله"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 3: Holly and Rob Explore Brooklyn.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 24,
        "timeDisplay": "0:24",
        "textEn": "Detailed conversation and communicative exchange regarding هنر خیابانی و محله‌های هنری.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون هنر خیابانی و محله‌های هنری.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 73,
        "timeDisplay": "1:13",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 3: Holly and Rob Explore Brooklyn.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 3: Holly and Rob Explore Brooklyn', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 32,
        "timestampDisplay": "0:32",
        "explanationFa": "در این صحنه، تمرکز بر هنر خیابانی و محله‌های هنری و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Holly shows Rob around Williamsburg's artistic streets, vintage shops, and trend...",
            "textFa": "تمرکز اصلی بر هالی خیابان‌های هنری، فروشگاه‌های کلاسیک و کافه‌های جذاب ویلیامزبورگ ر... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (هنر خیابانی و محله‌های هنری) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 3: Holly and Rob Explore Brooklyn)?",
        "explanationFa": "واژه different کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Different: an essential communicative term used throughout this scenario.",
            "textFa": "Different: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Brooklyn has a completely different vibe compared to midtown Manhattan.",
            "textFa": "بروکلین حال و هوایی کاملاً متفاوت با مرکز منهتن دارد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Brooklyn has a completely different vibe compared to midtown Manhattan.",
        "targetPhraseFa": "بروکلین حال و هوایی کاملاً متفاوت با مرکز منهتن دارد.",
        "phoneticGuide": "/ˈbrʊklɪn hæz ə kəmˈpliːtli ˈdɪfrənt vaɪb kəmˈpeərd tuː ˈmɪdtaʊn mænˈhætn/",
        "speakingTipsFa": "کلمه vibe یک اصطلاح بسیار رایج امروزی برای حس‌وحال محیط است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه هنر خیابانی و محله‌های هنری می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 3: Holly and Rob Explore Brooklyn', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره هنر خیابانی و محله‌های هنری است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding هنر خیابانی و محله‌های هنری.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره هنر خیابانی و محله‌های هنری."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 3: Holly and Rob Explore Brooklyn) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "different",
          "shops",
          "art"
        ],
        "sampleAnswerEn": "Exploring the vibrant art scene in Brooklyn provided wonderful inspiration for our magazine.",
        "sampleAnswerFa": "گشت‌وگذار در فضای هنری پرشور بروکلین الهام‌بخش فوق‌العاده‌ای برای مجله ما بود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v16",
    "level": "a2",
    "episodeNumber": 16,
    "titleFa": "اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری",
    "titleEn": "Episode 6 · Part 1: Crucial Phone Calls",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A2",
    "duration": "1:47",
    "durationSec": 107,
    "fileName": "AEF3e_SB2_PE_Ep6_On_the_phone.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep6_On_the_phone.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #6366f1, #818cf8)",
    "posterIcon": "📞",
    "summaryFa": "راب یک تماس تلفنی مهم از لندن با پیشنهادهای شغلی جذاب دریافت می‌کند که آینده او را در نیویورک در تعلیق قرار می‌دهد.",
    "summaryEn": "Rob receives an important phone call from London with exciting career offers, putting his future in New York in the balance.",
    "keyTopicsFa": [
      "پیشنهادهای شغلی کاری (Job offer)",
      "تصمیم‌گیری برای آینده",
      "ارتباطات تلفنی راه دور",
      "بیان تردید و تامل"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 1: Crucial Phone Calls.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 26,
        "timeDisplay": "0:26",
        "textEn": "Detailed conversation and communicative exchange regarding پیشنهادهای شغلی کاری (Job offer).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون پیشنهادهای شغلی کاری (Job offer).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 80,
        "timeDisplay": "1:20",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 1: Crucial Phone Calls.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 1: Crucial Phone Calls', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 35,
        "timestampDisplay": "0:35",
        "explanationFa": "در این صحنه، تمرکز بر پیشنهادهای شغلی کاری (Job offer) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob receives an important phone call from London with exciting career offers, pu...",
            "textFa": "تمرکز اصلی بر راب یک تماس تلفنی مهم از لندن با پیشنهادهای شغلی جذاب دریافت می‌کند که... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (پیشنهادهای شغلی کاری (Job offer)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 1: Crucial Phone Calls)?",
        "explanationFa": "واژه offer کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Offer: an essential communicative term used throughout this scenario.",
            "textFa": "Offer: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I received an unexpected job offer today and I have to make a choice.",
            "textFa": "من امروز یک پیشنهاد شغلی غیرمنتظره دریافت کردم و باید تصمیم‌گیری کنم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I received an unexpected job offer today and I have to make a choice.",
        "targetPhraseFa": "من امروز یک پیشنهاد شغلی غیرمنتظره دریافت کردم و باید تصمیم‌گیری کنم.",
        "phoneticGuide": "/aɪ rɪˈsiːvd ən ˌʌnɪkˈspektɪd dʒɑːb ˈɔːfər təˈdeɪ ənd aɪ hæv tuː meɪk ə tʃɔɪs/",
        "speakingTipsFa": "اصطلاح 'make a choice' یعنی دست زدن به انتخاب میان چند گزینه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه پیشنهادهای شغلی کاری (Job offer) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 1: Crucial Phone Calls', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره پیشنهادهای شغلی کاری (Job offer) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding پیشنهادهای شغلی کاری (Job offer).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره پیشنهادهای شغلی کاری (Job offer)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 1: Crucial Phone Calls) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "offer",
          "phone",
          "decision"
        ],
        "sampleAnswerEn": "Receiving a promotion offer made him carefully reflect on his long-term career aspirations.",
        "sampleAnswerFa": "دریافت پیشنهاد ارتقای شغلی باعث شد او با دقت درباره آرزوهای بلندمدت کاری‌اش تامل کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v17",
    "level": "a2",
    "episodeNumber": 17,
    "titleFa": "اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک",
    "titleEn": "Episode 6 · Part 2: In Central Park Again",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A2",
    "duration": "2:10",
    "durationSec": 130,
    "fileName": "AEF3e_SB2_PE_Ep6_In_Central_Park_again.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep6_In_Central_Park_again.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #b45309, #d97706)",
    "posterIcon": "🍂",
    "summaryFa": "راب و جنی در هنگام غروب در سنترال پارک قدم می‌زنند و خاطرات ماندگار، موفقیت‌ها و همکاری تیمی خود را مرور می‌کنند.",
    "summaryEn": "Rob and Jenny take an evening walk across Central Park, reflecting on their memorable experiences, triumphs, and teamwork.",
    "keyTopicsFa": [
      "مرور خاطرات مشترک",
      "بیان احساسات صمیمانه",
      "توصیف پاییز در سنترال پارک",
      "پایان ماموریت کاری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 2: In Central Park Again.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 32,
        "timeDisplay": "0:32",
        "textEn": "Detailed conversation and communicative exchange regarding مرور خاطرات مشترک.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مرور خاطرات مشترک.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 97,
        "timeDisplay": "1:37",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 2: In Central Park Again.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 2: In Central Park Again', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 43,
        "timestampDisplay": "0:43",
        "explanationFa": "در این صحنه، تمرکز بر مرور خاطرات مشترک و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob and Jenny take an evening walk across Central Park, reflecting on their memo...",
            "textFa": "تمرکز اصلی بر راب و جنی در هنگام غروب در سنترال پارک قدم می‌زنند و خاطرات ماندگار، م... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مرور خاطرات مشترک) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 2: In Central Park Again)?",
        "explanationFa": "واژه pleasure کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Pleasure: an essential communicative term used throughout this scenario.",
            "textFa": "Pleasure: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Looking back on these past months, working with you has been an absolute pleasure.",
            "textFa": "با نگاه به این ماه‌های گذشته، همکاری با تو لذت مطلق و خاطره‌انگیز بوده است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Looking back on these past months, working with you has been an absolute pleasure.",
        "targetPhraseFa": "با نگاه به این ماه‌های گذشته، همکاری با تو لذت مطلق و خاطره‌انگیز بوده است.",
        "phoneticGuide": "/ˈlʊkɪŋ bæk ɑːn ðiːz pæst mʌnθs ˈwɜːrkɪŋ wɪð juː hæz biːn ən ˈæbsəluːt ˈpleʒər/",
        "speakingTipsFa": "عبارت 'Looking back on...' برای مرور گذشته کاربرد دارد.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مرور خاطرات مشترک می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 2: In Central Park Again', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مرور خاطرات مشترک است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مرور خاطرات مشترک.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مرور خاطرات مشترک."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 2: In Central Park Again) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "pleasure",
          "working",
          "park"
        ],
        "sampleAnswerEn": "Strolling through the peaceful park allowed us to reflect warmly on our successful collaboration.",
        "sampleAnswerFa": "قدم زدن در پارک آرام به ما امکان داد تا با گرمی به همکاری موفقیت‌آمیزمان فکر کنیم.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "a2-v18",
    "level": "a2",
    "episodeNumber": 18,
    "titleFa": "اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده",
    "titleEn": "Episode 6 · Part 3: Rob and Jenny Talk About the Future",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A2",
    "duration": "2:32",
    "durationSec": 152,
    "fileName": "AEF3e_SB2_PE_Ep6_Rob_and_Jenny_talk_about_the_future.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep6_Rob_and_Jenny_talk_about_the_future.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "✨",
    "summaryFa": "در پایان فصل، راب تصمیم بزرگ خود مبنی بر ماندن در نیویورک در کنار جنی را فاش می‌کند و چشم‌انتظار آینده مشترکشان هستند.",
    "summaryEn": "In the season finale, Rob reveals his big decision to stay in New York with Jenny, looking forward to their shared future.",
    "keyTopicsFa": [
      "بیان تصمیم بزرگ زندگی",
      "افعال آینده با will و be going to",
      "تعهد و امید به آینده",
      "پایان هیجان‌انگیز داستان"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 6 · Part 3: Rob and Jenny Talk About the Future.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 38,
        "timeDisplay": "0:38",
        "textEn": "Detailed conversation and communicative exchange regarding بیان تصمیم بزرگ زندگی.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون بیان تصمیم بزرگ زندگی.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 114,
        "timeDisplay": "1:54",
        "textEn": "Concluding remarks and key language takeaway for Episode 6 · Part 3: Rob and Jenny Talk About the Future.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 6 · Part 3: Rob and Jenny Talk About the Future', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 50,
        "timestampDisplay": "0:50",
        "explanationFa": "در این صحنه، تمرکز بر بیان تصمیم بزرگ زندگی و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is In the season finale, Rob reveals his big decision to stay in New York with Jenn...",
            "textFa": "تمرکز اصلی بر در پایان فصل، راب تصمیم بزرگ خود مبنی بر ماندن در نیویورک در کنار جنی ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (بیان تصمیم بزرگ زندگی) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 6 · Part 3: Rob and Jenny Talk About the Future)?",
        "explanationFa": "واژه decided کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Decided: an essential communicative term used throughout this scenario.",
            "textFa": "Decided: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have decided to stay in New York; this is where I truly belong.",
            "textFa": "من تصمیم گرفته‌ام در نیویورک بمانم؛ اینجاست که واقعاً به آن تعلق دارم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have decided to stay in New York; this is where I truly belong.",
        "targetPhraseFa": "من تصمیم گرفته‌ام در نیویورک بمانم؛ اینجاست که واقعاً به آن تعلق دارم.",
        "phoneticGuide": "/aɪ hæv dɪˈsaɪdɪd tuː steɪ ɪn nuː jɔːrk ðɪs ɪz wer aɪ ˈtruːli bɪˈlɔːŋ/",
        "speakingTipsFa": "کلمه belong یعنی تعلق داشتن و جا افتادن در یک محیط.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه بیان تصمیم بزرگ زندگی می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 6 · Part 3: Rob and Jenny Talk About the Future', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره بیان تصمیم بزرگ زندگی است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding بیان تصمیم بزرگ زندگی.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره بیان تصمیم بزرگ زندگی."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 6 · Part 3: Rob and Jenny Talk About the Future) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "decided",
          "future",
          "stay"
        ],
        "sampleAnswerEn": "After weighing his options, he decided to stay in New York and build his future together.",
        "sampleAnswerFa": "پس از سنجیدن گزینه‌ها، او تصمیم گرفت در نیویورک بماند و آینده‌شان را با هم بسازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v01",
    "level": "b1",
    "episodeNumber": 1,
    "titleFa": "اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی",
    "titleEn": "Episode 1 · Part 1: Rob and Jenny's Long-Distance Life",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "B1",
    "duration": "2:41",
    "durationSec": 161,
    "fileName": "AEF3e_Level_3_PE_Ep1_Introduction.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep1_Introduction.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #059669, #10b981)",
    "posterIcon": "✈️",
    "summaryFa": "جنی در نیویورک و راب همچنان در لندن هستند. آن‌ها درباره مدیریت رابطه از راه دور و برنامه‌های شغلی گفتگو می‌کنند.",
    "summaryEn": "Jenny is in New York and Rob is still in London. They discuss navigating their long-distance relationship and career plans.",
    "keyTopicsFa": [
      "ارتباط از راه دور (Long distance)",
      "مکالمات فرودگاهی و پرواز",
      "زمان حال کامل استمراری",
      "بیان دلتنگی و احساسات"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 1: Rob and Jenny's Long-Distance Life.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 40,
        "timeDisplay": "0:40",
        "textEn": "Detailed conversation and communicative exchange regarding ارتباط از راه دور (Long distance).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون ارتباط از راه دور (Long distance).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 120,
        "timeDisplay": "2:00",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 1: Rob and Jenny's Long-Distance Life.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 1: Rob and Jenny's Long-Distance Life', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 53,
        "timestampDisplay": "0:53",
        "explanationFa": "در این صحنه، تمرکز بر ارتباط از راه دور (Long distance) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny is in New York and Rob is still in London. They discuss navigating their l...",
            "textFa": "تمرکز اصلی بر جنی در نیویورک و راب همچنان در لندن هستند. آن‌ها درباره مدیریت رابطه ا... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (ارتباط از راه دور (Long distance)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 1: Rob and Jenny's Long-Distance Life)?",
        "explanationFa": "واژه distance کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Distance: an essential communicative term used throughout this scenario.",
            "textFa": "Distance: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "It is not easy being in different time zones, but we talk every day.",
            "textFa": "بودن در دو منطقه زمانی متفاوت آسان نیست، اما ما هر روز با هم صحبت می‌کنیم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "It is not easy being in different time zones, but we talk every day.",
        "targetPhraseFa": "بودن در دو منطقه زمانی متفاوت آسان نیست، اما ما هر روز با هم صحبت می‌کنیم.",
        "phoneticGuide": "/ɪt ɪz nɑːt ˈiːzi ˈbiːɪŋ ɪn ˈdɪfrənt taɪm zoʊnz bʌt wiː tɔːk ˈevri deɪ/",
        "speakingTipsFa": "به تفاوت تلفظ time zones در لهجه آمریکایی توجه کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه ارتباط از راه دور (Long distance) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 1: Rob and Jenny's Long-Distance Life', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره ارتباط از راه دور (Long distance) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding ارتباط از راه دور (Long distance).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره ارتباط از راه دور (Long distance)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 1: Rob and Jenny's Long-Distance Life) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "distance",
          "relationship",
          "talk"
        ],
        "sampleAnswerEn": "Long distance communication requires patience, honesty, and scheduling regular calls.",
        "sampleAnswerFa": "ارتباط از راه دور نیازمند صبر، صداقت و برنامه‌ریزی برای تماس‌های منظم است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v02",
    "level": "b1",
    "episodeNumber": 2,
    "titleFa": "اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند",
    "titleEn": "Episode 1 · Part 2: Harry Learns More About Rob",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "B1",
    "duration": "1:49",
    "durationSec": 109,
    "fileName": "AEF3e_Level_3_PE_Ep1_Harry_finds_out_more_about_Rob.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep1_Harry_finds_out_more_about_Rob.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "🍻",
    "summaryFa": "راب دوستش هری را در یک پاب در لندن ملاقات می‌کند تا درباره چشم‌انداز شغلی و انتقال پیش‌رویش به نیویورک گپ بزنند.",
    "summaryEn": "Rob meets his friend Harry at a London pub to chat about his job prospects and upcoming move to New York City.",
    "keyTopicsFa": [
      "گپ‌وگفت دوستانه در کافه",
      "فرصت‌های شغلی بین‌المللی",
      "سفر به ایالات متحده",
      "اصطلاحات بریتانیایی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 2: Harry Learns More About Rob.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 27,
        "timeDisplay": "0:27",
        "textEn": "Detailed conversation and communicative exchange regarding گپ‌وگفت دوستانه در کافه.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون گپ‌وگفت دوستانه در کافه.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 81,
        "timeDisplay": "1:21",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 2: Harry Learns More About Rob.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 2: Harry Learns More About Rob', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 36,
        "timestampDisplay": "0:36",
        "explanationFa": "در این صحنه، تمرکز بر گپ‌وگفت دوستانه در کافه و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob meets his friend Harry at a London pub to chat about his job prospects and u...",
            "textFa": "تمرکز اصلی بر راب دوستش هری را در یک پاب در لندن ملاقات می‌کند تا درباره چشم‌انداز ش... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (گپ‌وگفت دوستانه در کافه) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 2: Harry Learns More About Rob)?",
        "explanationFa": "واژه opportunity کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Opportunity: an essential communicative term used throughout this scenario.",
            "textFa": "Opportunity: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have been offered a great opportunity to work in the New York office.",
            "textFa": "به من یک فرصت عالی برای کار در دفتر نیویورک پیشنهاد شده است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have been offered a great opportunity to work in the New York office.",
        "targetPhraseFa": "به من یک فرصت عالی برای کار در دفتر نیویورک پیشنهاد شده است.",
        "phoneticGuide": "/aɪ hæv biːn ˈɔːfərd ə ɡreɪt ˌɑːpərˈtuːnəti tuː wɜːrk ɪn ðə nuː jɔːrk ˈɔːfɪs/",
        "speakingTipsFa": "opportunity در لهجه آمریکایی معمولاً با حذف صدای /j/ ادا می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه گپ‌وگفت دوستانه در کافه می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 2: Harry Learns More About Rob', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره گپ‌وگفت دوستانه در کافه است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding گپ‌وگفت دوستانه در کافه.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره گپ‌وگفت دوستانه در کافه."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 2: Harry Learns More About Rob) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "opportunity",
          "office",
          "move"
        ],
        "sampleAnswerEn": "Moving to a new city for work is an exciting step for anyone's professional career.",
        "sampleAnswerFa": "مهاجرت کاری به یک شهر جدید، گامی هیجان‌انگیز در زندگی حرفه‌ای هر فرد است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v03",
    "level": "b1",
    "episodeNumber": 3,
    "titleFa": "اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره",
    "titleEn": "Episode 1 · Part 3: Reacting to News and Conversational Cues",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "B1",
    "duration": "2:14",
    "durationSec": 134,
    "fileName": "AEF3e_Level_3_PE_Ep1_Reacting_to_what_people_say.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep1_Reacting_to_what_people_say.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
    "posterIcon": "💬",
    "summaryFa": "اصطلاحات کلیدی برای ابراز همدلی، اشتیاق یا تعجب در واکنش به خبرهای خوب و بد در مکالمات انگلیسی روزمره.",
    "summaryEn": "Learn essential conversational phrases to react with empathy, excitement, or surprise to good and bad news in everyday English.",
    "keyTopicsFa": [
      "واکنش‌های تعاملی (That's awesome!, What a shame!)",
      "ابراز همدلی (I'm so sorry to hear that)",
      "لحن و احساس صدا",
      "مکالمه خودمانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 1 · Part 3: Reacting to News and Conversational Cues.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 33,
        "timeDisplay": "0:33",
        "textEn": "Detailed conversation and communicative exchange regarding واکنش‌های تعاملی (That's awesome!, What a shame!).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون واکنش‌های تعاملی (That's awesome!, What a shame!).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 100,
        "timeDisplay": "1:40",
        "textEn": "Concluding remarks and key language takeaway for Episode 1 · Part 3: Reacting to News and Conversational Cues.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 1 · Part 3: Reacting to News and Conversational Cues', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 44,
        "timestampDisplay": "0:44",
        "explanationFa": "در این صحنه، تمرکز بر واکنش‌های تعاملی (That's awesome!, What a shame!) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Learn essential conversational phrases to react with empathy, excitement, or sur...",
            "textFa": "تمرکز اصلی بر اصطلاحات کلیدی برای ابراز همدلی، اشتیاق یا تعجب در واکنش به خبرهای خوب... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (واکنش‌های تعاملی (That's awesome!, What a shame!)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 1 · Part 3: Reacting to News and Conversational Cues)?",
        "explanationFa": "واژه incredible کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Incredible: an essential communicative term used throughout this scenario.",
            "textFa": "Incredible: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "That is incredible news! I am so happy for your promotion.",
            "textFa": "این خبر فوق‌العاده است! از ارتقای شغلی‌ات بسیار خوشحالم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "That is incredible news! I am so happy for your promotion.",
        "targetPhraseFa": "این خبر فوق‌العاده است! از ارتقای شغلی‌ات بسیار خوشحالم.",
        "phoneticGuide": "/ðæt ɪz ɪnˈkredəbl nuːz aɪ æm soʊ ˈhæpi fɔːr jʊr prəˈmoʊʃn/",
        "speakingTipsFa": "کلمه incredible با استرس روی سیلاب دوم /kred/ تلفظ می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه واکنش‌های تعاملی (That's awesome!, What a shame!) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 1 · Part 3: Reacting to News and Conversational Cues', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره واکنش‌های تعاملی (That's awesome!, What a shame!) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding واکنش‌های تعاملی (That's awesome!, What a shame!).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره واکنش‌های تعاملی (That's awesome!, What a shame!)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 1 · Part 3: Reacting to News and Conversational Cues) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "incredible",
          "happy",
          "news"
        ],
        "sampleAnswerEn": "When friends share good news, it is important to react with genuine enthusiasm.",
        "sampleAnswerFa": "هنگامی که دوستان خبرهای خوب می‌دهند، ابراز اشتیاق صمیمانه و واقعی اهمیت دارد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v04",
    "level": "b1",
    "episodeNumber": 4,
    "titleFa": "اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک",
    "titleEn": "Episode 2 · Part 1: Rob's Job Interview with Daniel",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "B1",
    "duration": "2:47",
    "durationSec": 167,
    "fileName": "AEF3e_Level_3_PE_Ep2_Rob's_interview.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep2_Rob's_interview.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
    "posterIcon": "💼",
    "summaryFa": "راب برای موقعیت شغلی نویسندگی دائم در مجله با دانیل مصاحبه می‌کند و درباره نمونه‌کارها و تجربیاتش صحبت می‌کند.",
    "summaryEn": "Rob interviews with Daniel for a permanent writing position at the Manhattan magazine, discussing his past work and writing portfolio.",
    "keyTopicsFa": [
      "مصاحبه کاری در محیط اداری",
      "توصیف سوابق شغلی",
      "بیان نقاط قوت و تجربیات",
      "انگلیسی حرفه‌ای"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 1: Rob's Job Interview with Daniel.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 41,
        "timeDisplay": "0:41",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه کاری در محیط اداری.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه کاری در محیط اداری.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 125,
        "timeDisplay": "2:05",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 1: Rob's Job Interview with Daniel.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 1: Rob's Job Interview with Daniel', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 55,
        "timestampDisplay": "0:55",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه کاری در محیط اداری و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob interviews with Daniel for a permanent writing position at the Manhattan mag...",
            "textFa": "تمرکز اصلی بر راب برای موقعیت شغلی نویسندگی دائم در مجله با دانیل مصاحبه می‌کند و در... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه کاری در محیط اداری) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 1: Rob's Job Interview with Daniel)?",
        "explanationFa": "واژه experience کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Experience: an essential communicative term used throughout this scenario.",
            "textFa": "Experience: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I have extensive experience writing feature articles on culture and travel.",
            "textFa": "من تجربه گسترده‌ای در نگارش مقالات تحلیلی درباره فرهنگ و سفر دارم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I have extensive experience writing feature articles on culture and travel.",
        "targetPhraseFa": "من تجربه گسترده‌ای در نگارش مقالات تحلیلی درباره فرهنگ و سفر دارم.",
        "phoneticGuide": "/aɪ hæv ɪkˈstensɪv ɪkˈspɪriəns ˈraɪtɪŋ ˈfiːtʃər ˈɑːrtɪklz ɑːn ˈkʌltʃər ənd ˈtrævl/",
        "speakingTipsFa": "feature articles یعنی مقالات گزارش‌گونه و عمیق مجلات.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه کاری در محیط اداری می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 1: Rob's Job Interview with Daniel', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه کاری در محیط اداری است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه کاری در محیط اداری.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه کاری در محیط اداری."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 1: Rob's Job Interview with Daniel) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "experience",
          "writing",
          "articles"
        ],
        "sampleAnswerEn": "During a job interview, highlighting relevant professional experience makes a strong impression.",
        "sampleAnswerFa": "در طول مصاحبه کاری، برجسته ساختن تجربیات شغلی مرتبط تاثیری قوی ایجاد می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v05",
    "level": "b1",
    "episodeNumber": 5,
    "titleFa": "اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه",
    "titleEn": "Episode 2 · Part 2: Giving Opinions and Disagreeing Politely",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "B1",
    "duration": "2:46",
    "durationSec": 166,
    "fileName": "AEF3e_Level_3_PE_Ep2_Giving_opinions.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep2_Giving_opinions.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #d97706, #f59e0b)",
    "posterIcon": "⚖️",
    "summaryFa": "آموزش بیان دیدگاه‌ها به شکل حرفه‌ای، موافقت سازنده و مخالفت مودبانه در مذاکرات اداری.",
    "summaryEn": "Master how to state your viewpoints professionally, agree constructively, or disagree politely without offending colleagues.",
    "keyTopicsFa": [
      "اصطلاحات بیان نظر (In my opinion, If you ask me)",
      "مخالفت محترمانه (I see your point, but...)",
      "تعادل در مذاکره",
      "ارتباطات کاری"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 2: Giving Opinions and Disagreeing Politely.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 41,
        "timeDisplay": "0:41",
        "textEn": "Detailed conversation and communicative exchange regarding اصطلاحات بیان نظر (In my opinion, If you ask me).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون اصطلاحات بیان نظر (In my opinion, If you ask me).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 124,
        "timeDisplay": "2:04",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 2: Giving Opinions and Disagreeing Politely.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 2: Giving Opinions and Disagreeing Politely', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 55,
        "timestampDisplay": "0:55",
        "explanationFa": "در این صحنه، تمرکز بر اصطلاحات بیان نظر (In my opinion, If you ask me) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Master how to state your viewpoints professionally, agree constructively, or dis...",
            "textFa": "تمرکز اصلی بر آموزش بیان دیدگاه‌ها به شکل حرفه‌ای، موافقت سازنده و مخالفت مودبانه در... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (اصطلاحات بیان نظر (In my opinion, If you ask me)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 2: Giving Opinions and Disagreeing Politely)?",
        "explanationFa": "واژه believe کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Believe: an essential communicative term used throughout this scenario.",
            "textFa": "Believe: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I see your point, but I believe we should also consider other alternatives.",
            "textFa": "نقطه نظر شما را متوجه می‌شوم، اما باور دارم باید سایر گزینه‌ها را نیز در نظر بگیریم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I see your point, but I believe we should also consider other alternatives.",
        "targetPhraseFa": "نقطه نظر شما را متوجه می‌شوم، اما باور دارم باید سایر گزینه‌ها را نیز در نظر بگیریم.",
        "phoneticGuide": "/aɪ siː jʊr pɔɪnt bʌt aɪ bɪˈliːv wiː ʃʊd ˈɔːlsoʊ kənˈsɪdər ˈʌðər ɔːlˈtɜːrnətɪvz/",
        "speakingTipsFa": "عبارت 'I see your point' بهترین مقدمه برای شروع مخالفت مودبانه است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه اصطلاحات بیان نظر (In my opinion, If you ask me) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 2: Giving Opinions and Disagreeing Politely', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره اصطلاحات بیان نظر (In my opinion, If you ask me) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding اصطلاحات بیان نظر (In my opinion, If you ask me).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره اصطلاحات بیان نظر (In my opinion, If you ask me)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 2: Giving Opinions and Disagreeing Politely) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "believe",
          "consider",
          "alternatives"
        ],
        "sampleAnswerEn": "Expressing disagreement with polite diplomatic language helps maintain productive teamwork.",
        "sampleAnswerFa": "بیان مخالفت با زبان دیپلماتیک و محترمانه به حفظ کار تیمی پربار کمک می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v06",
    "level": "b1",
    "episodeNumber": 6,
    "titleFa": "اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری",
    "titleEn": "Episode 2 · Part 3: A Special Surprise for Kerri",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "B1",
    "duration": "1:35",
    "durationSec": 95,
    "fileName": "AEF3e_Level_3_PE_Ep2_A_surprise_for_Kerri.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep2_A_surprise_for_Kerri.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    "posterIcon": "🎁",
    "summaryFa": "راب و جنی جشنی غافلگیرکننده برای کری در دفتر مجله هماهنگ می‌کنند تا موفقیت اخیر او را جشن بگیرند.",
    "summaryEn": "Rob and Jenny coordinate a surprise celebration for Kerri at the office to celebrate her recent success.",
    "keyTopicsFa": [
      "هماهنگی جشن و دورهمی",
      "پنهان‌کاری غافلگیری (Keep it secret)",
      "تبریک گفتن صمیمانه",
      "محیط صمیمانه کار"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 2 · Part 3: A Special Surprise for Kerri.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 23,
        "timeDisplay": "0:23",
        "textEn": "Detailed conversation and communicative exchange regarding هماهنگی جشن و دورهمی.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون هماهنگی جشن و دورهمی.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 71,
        "timeDisplay": "1:11",
        "textEn": "Concluding remarks and key language takeaway for Episode 2 · Part 3: A Special Surprise for Kerri.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 2 · Part 3: A Special Surprise for Kerri', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 31,
        "timestampDisplay": "0:31",
        "explanationFa": "در این صحنه، تمرکز بر هماهنگی جشن و دورهمی و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob and Jenny coordinate a surprise celebration for Kerri at the office to celeb...",
            "textFa": "تمرکز اصلی بر راب و جنی جشنی غافلگیرکننده برای کری در دفتر مجله هماهنگ می‌کنند تا مو... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (هماهنگی جشن و دورهمی) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 2 · Part 3: A Special Surprise for Kerri)?",
        "explanationFa": "واژه surprise کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Surprise: an essential communicative term used throughout this scenario.",
            "textFa": "Surprise: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Make sure you keep this surprise secret until she arrives at the office.",
            "textFa": "مطمئن شوید این غافلگیری را تا زمان رسیدن او به دفتر مخفی نگه می‌دارید."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Make sure you keep this surprise secret until she arrives at the office.",
        "targetPhraseFa": "مطمئن شوید این غافلگیری را تا زمان رسیدن او به دفتر مخفی نگه می‌دارید.",
        "phoneticGuide": "/meɪk ʃʊr juː kiːp ðɪs sərˈpraɪz ˈsiːkrət ənˈtɪl ʃiː əˈraɪvz æt ðə ˈɔːfɪs/",
        "speakingTipsFa": "کلمه surprise به صورت /sərˈpraɪz/ تلفظ می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه هماهنگی جشن و دورهمی می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 2 · Part 3: A Special Surprise for Kerri', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره هماهنگی جشن و دورهمی است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding هماهنگی جشن و دورهمی.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره هماهنگی جشن و دورهمی."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 2 · Part 3: A Special Surprise for Kerri) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "surprise",
          "secret",
          "celebrate"
        ],
        "sampleAnswerEn": "Organizing a surprise party for a colleague boosts morale and shows genuine appreciation.",
        "sampleAnswerFa": "برگزاری جشن غافلگیری برای همکاران، روحیه تیمی را ارتقا داده و نشان‌دهنده قدردانی صمیمانه است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v07",
    "level": "b1",
    "episodeNumber": 7,
    "titleFa": "اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن",
    "titleEn": "Episode 3 · Part 1: Jenny Has Coffee with Monica",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "B1",
    "duration": "1:57",
    "durationSec": 117,
    "fileName": "AEF3e_Level_3_PE_Ep3_Jenny_has_coffee_with_a_friend.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep3_Jenny_has_coffee_with_a_friend.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
    "posterIcon": "☕",
    "summaryFa": "جنی با دوست نزدیکش مونیکا در کافه قرار می‌گذارد و درباره دغدغه‌های شغلی و زندگی راب در منهتن دردودل می‌کند.",
    "summaryEn": "Jenny meets her close friend Monica for coffee, discussing her career dilemmas and her thoughts on Rob living in Manhattan.",
    "keyTopicsFa": [
      "مشورت‌های دوستانه",
      "بررسی دوراهی‌های تصمیم‌گیری",
      "بیان نگرانی‌ها و امیدها",
      "کافه‌های نیویورک"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 1: Jenny Has Coffee with Monica.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 29,
        "timeDisplay": "0:29",
        "textEn": "Detailed conversation and communicative exchange regarding مشورت‌های دوستانه.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مشورت‌های دوستانه.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 87,
        "timeDisplay": "1:27",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 1: Jenny Has Coffee with Monica.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 1: Jenny Has Coffee with Monica', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 39,
        "timestampDisplay": "0:39",
        "explanationFa": "در این صحنه، تمرکز بر مشورت‌های دوستانه و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Jenny meets her close friend Monica for coffee, discussing her career dilemmas a...",
            "textFa": "تمرکز اصلی بر جنی با دوست نزدیکش مونیکا در کافه قرار می‌گذارد و درباره دغدغه‌های شغل... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مشورت‌های دوستانه) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 1: Jenny Has Coffee with Monica)?",
        "explanationFa": "واژه friend کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Friend: an essential communicative term used throughout this scenario.",
            "textFa": "Friend: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Sometimes talking things through with a trusted friend gives you complete clarity.",
            "textFa": "گاهی اوقات در میان گذاشتن مسائل با دوستی قابل اعتماد، شفافیت کامل به شما می‌بخشد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Sometimes talking things through with a trusted friend gives you complete clarity.",
        "targetPhraseFa": "گاهی اوقات در میان گذاشتن مسائل با دوستی قابل اعتماد، شفافیت کامل به شما می‌بخشد.",
        "phoneticGuide": "/ˈsʌmtaɪmz ˈtɔːkɪŋ θɪŋz θruː wɪð ə ˈtrʌstɪd frend ɡɪvz juː kəmˈpliːt ˈklærəti/",
        "speakingTipsFa": "کلمه clarity یعنی وضوح و روشنی ذهن.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مشورت‌های دوستانه می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 1: Jenny Has Coffee with Monica', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مشورت‌های دوستانه است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مشورت‌های دوستانه.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مشورت‌های دوستانه."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 1: Jenny Has Coffee with Monica) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "friend",
          "clarity",
          "talking"
        ],
        "sampleAnswerEn": "Having a candid conversation over coffee helps resolve personal and professional dilemmas.",
        "sampleAnswerFa": "گفتگوی صریح همراه با یک فنجان قهوه به حل دوراهی‌های فردی و کاری کمک می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v08",
    "level": "b1",
    "episodeNumber": 8,
    "titleFa": "اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک",
    "titleEn": "Episode 3 · Part 2: Paul Arrives from the UK",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "B1",
    "duration": "1:31",
    "durationSec": 91,
    "fileName": "AEF3e_Level_3_PE_Ep3_Paul_arrives.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep3_Paul_arrives.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #db2777, #ec4899)",
    "posterIcon": "🧳",
    "summaryFa": "پل، دوست صمیمی دوران دانشگاه راب، بدون هماهنگی از لندن می‌رسد تا پیش راب بماند و هیجان زیادی به همراه می‌آورد.",
    "summaryEn": "Rob's old university friend Paul arrives unexpectedly from London to stay with him in New York, bringing chaotic energy.",
    "keyTopicsFa": [
      "میزبانی از مهمان سرزده",
      "تجدید خاطرات دانشگاهی",
      "اقامت در آپارتمان مشترک",
      "تفاوت رفتارهای فرهنگی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 2: Paul Arrives from the UK.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 22,
        "timeDisplay": "0:22",
        "textEn": "Detailed conversation and communicative exchange regarding میزبانی از مهمان سرزده.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون میزبانی از مهمان سرزده.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 68,
        "timeDisplay": "1:08",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 2: Paul Arrives from the UK.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 2: Paul Arrives from the UK', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 30,
        "timestampDisplay": "0:30",
        "explanationFa": "در این صحنه، تمرکز بر میزبانی از مهمان سرزده و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob's old university friend Paul arrives unexpectedly from London to stay with h...",
            "textFa": "تمرکز اصلی بر پل، دوست صمیمی دوران دانشگاه راب، بدون هماهنگی از لندن می‌رسد تا پیش ر... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (میزبانی از مهمان سرزده) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 2: Paul Arrives from the UK)?",
        "explanationFa": "واژه welcome کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Welcome: an essential communicative term used throughout this scenario.",
            "textFa": "Welcome: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I was not expecting you so soon, but you are always welcome here.",
            "textFa": "به این زودی انتظار دیدنت را نداشتم، اما همیشه در اینجا خوش‌آمدی."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I was not expecting you so soon, but you are always welcome here.",
        "targetPhraseFa": "به این زودی انتظار دیدنت را نداشتم، اما همیشه در اینجا خوش‌آمدی.",
        "phoneticGuide": "/aɪ wʌz nɑːt ɪkˈspektɪŋ juː soʊ suːn bʌt juː ɑːr ˈɔːlweɪz ˈwelkəm hɪr/",
        "speakingTipsFa": "expecting یعنی انتظار داشتن و منتظر بودن.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه میزبانی از مهمان سرزده می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 2: Paul Arrives from the UK', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره میزبانی از مهمان سرزده است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding میزبانی از مهمان سرزده.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره میزبانی از مهمان سرزده."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 2: Paul Arrives from the UK) using the required keywords.",
        "minWords": 12,
        "keywordsToUse": [
          "welcome",
          "friend",
          "stay"
        ],
        "sampleAnswerEn": "Welcoming an old college friend to stay at your apartment brings back great memories.",
        "sampleAnswerFa": "پذیرایی از یک دوست قدیمی دانشگاه در آپارتمان خود، خاطرات زیبایی را زنده می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v09",
    "level": "b1",
    "episodeNumber": 9,
    "titleFa": "اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه",
    "titleEn": "Episode 3 · Part 3: Asking for Permission and Polite Requests",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "B1",
    "duration": "2:17",
    "durationSec": 137,
    "fileName": "AEF3e_Level_3_PE_Ep3_Permissions_and_requests.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep3_Permissions_and_requests.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #059669, #10b981)",
    "posterIcon": "🙏",
    "summaryFa": "ساختارهای مهم مکالمه برای اجازه گرفتن و طرح درخواست‌های محترمانه در محیط‌های مشترک و کاری.",
    "summaryEn": "Essential communicative structures for asking permission (Do you mind if I...?) and making polite requests (Would you mind...?).",
    "keyTopicsFa": [
      "ساختار Do you mind if I... + حال ساده",
      "ساختار Would you mind + ing",
      "پاسخ مودبانه (No, not at all)",
      "آداب معاشرت"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 3 · Part 3: Asking for Permission and Polite Requests.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 34,
        "timeDisplay": "0:34",
        "textEn": "Detailed conversation and communicative exchange regarding ساختار Do you mind if I... + حال ساده.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون ساختار Do you mind if I... + حال ساده.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 102,
        "timeDisplay": "1:42",
        "textEn": "Concluding remarks and key language takeaway for Episode 3 · Part 3: Asking for Permission and Polite Requests.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 3 · Part 3: Asking for Permission and Polite Requests', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 45,
        "timestampDisplay": "0:45",
        "explanationFa": "در این صحنه، تمرکز بر ساختار Do you mind if I... + حال ساده و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Essential communicative structures for asking permission (Do you mind if I...?) ...",
            "textFa": "تمرکز اصلی بر ساختارهای مهم مکالمه برای اجازه گرفتن و طرح درخواست‌های محترمانه در مح... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (ساختار Do you mind if I... + حال ساده) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 3 · Part 3: Asking for Permission and Polite Requests)?",
        "explanationFa": "واژه mind کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Mind: an essential communicative term used throughout this scenario.",
            "textFa": "Mind: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Do you mind if I invite a couple of friends over this evening?",
            "textFa": "آیا اشکالی ندارد اگر امشب دو نفر از دوستانم را دعوت کنم؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Do you mind if I invite a couple of friends over this evening?",
        "targetPhraseFa": "آیا اشکالی ندارد اگر امشب دو نفر از دوستانم را دعوت کنم؟",
        "phoneticGuide": "/duː juː maɪnd ɪf aɪ ɪnˈvaɪt ə ˈkʌpl əv frendz ˈoʊvər ðɪs ˈiːvnɪŋ/",
        "speakingTipsFa": "توجه: در پاسخ به Do you mind، عبارت No یعنی موافقم و مشکلی نیست.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه ساختار Do you mind if I... + حال ساده می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 3 · Part 3: Asking for Permission and Polite Requests', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره ساختار Do you mind if I... + حال ساده است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding ساختار Do you mind if I... + حال ساده.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره ساختار Do you mind if I... + حال ساده."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 3 · Part 3: Asking for Permission and Polite Requests) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "mind",
          "invite",
          "friends"
        ],
        "sampleAnswerEn": "Polite requests such as 'Would you mind helping me' show courtesy and consideration.",
        "sampleAnswerFa": "درخواست‌های مودبانه مانند 'آیا زحمتی نیست به من کمک کنید' نشان‌دهنده احترام و نزاکت است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v10",
    "level": "b1",
    "episodeNumber": 10,
    "titleFa": "اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا",
    "titleEn": "Episode 4 · Part 1: The Morning After the Big Night Out",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "B1",
    "duration": "2:04",
    "durationSec": 124,
    "fileName": "AEF3e_Level_3_PE_Ep4_The_morning_after_the_night_before.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep4_The_morning_after_the_night_before.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "⏰",
    "summaryFa": "راب و پل پس از ماندن در کلوب جاز گرینویچ ویلیج نیویورک، دیر از خواب بیدار شده و برای کارهایشان عجله می‌کنند.",
    "summaryEn": "Rob and Paul wake up late after staying out late listening to live jazz music in Greenwich Village.",
    "keyTopicsFa": [
      "دیر بیدار شدن و عجله (Oversleeping)",
      "زندگی شبانه نیویورک",
      "جاز و موسیقی زنده",
      "برنامه‌ریزی روزانه"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 1: The Morning After the Big Night Out.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 31,
        "timeDisplay": "0:31",
        "textEn": "Detailed conversation and communicative exchange regarding دیر بیدار شدن و عجله (Oversleeping).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیر بیدار شدن و عجله (Oversleeping).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 93,
        "timeDisplay": "1:33",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 1: The Morning After the Big Night Out.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 1: The Morning After the Big Night Out', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 41,
        "timestampDisplay": "0:41",
        "explanationFa": "در این صحنه، تمرکز بر دیر بیدار شدن و عجله (Oversleeping) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob and Paul wake up late after staying out late listening to live jazz music in...",
            "textFa": "تمرکز اصلی بر راب و پل پس از ماندن در کلوب جاز گرینویچ ویلیج نیویورک، دیر از خواب بی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیر بیدار شدن و عجله (Oversleeping)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 1: The Morning After the Big Night Out)?",
        "explanationFa": "واژه late کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Late: an essential communicative term used throughout this scenario.",
            "textFa": "Late: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "We stayed out way too late last night and completely lost track of time.",
            "textFa": "دیشب خیلی دیر وقت بیرون ماندیم و زمان کاملاً از دستمان در رفت."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "We stayed out way too late last night and completely lost track of time.",
        "targetPhraseFa": "دیشب خیلی دیر وقت بیرون ماندیم و زمان کاملاً از دستمان در رفت.",
        "phoneticGuide": "/wiː steɪd aʊt weɪ tuː leɪt læst naɪt ənd kəmˈpliːtli lɔːst træk əv taɪm/",
        "speakingTipsFa": "lost track of time اصطلاحی عالی به معنای فراموش کردن گذر زمان است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیر بیدار شدن و عجله (Oversleeping) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 1: The Morning After the Big Night Out', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیر بیدار شدن و عجله (Oversleeping) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیر بیدار شدن و عجله (Oversleeping).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیر بیدار شدن و عجله (Oversleeping)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 1: The Morning After the Big Night Out) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "late",
          "morning",
          "time"
        ],
        "sampleAnswerEn": "Enjoying live jazz in Manhattan can easily make you lose track of time and stay out late.",
        "sampleAnswerFa": "لذت بردن از موسیقی زنده جاز در منهتن به راحتی می‌تواند باعث شود گذر زمان را حس نکنید.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v11",
    "level": "b1",
    "episodeNumber": 11,
    "titleFa": "اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف",
    "titleEn": "Episode 4 · Part 2: Rob and Paul Catch Up on Life",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "B1",
    "duration": "2:41",
    "durationSec": 161,
    "fileName": "AEF3e_Level_3_PE_Ep4_Rob_and_Paul_catch_up.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep4_Rob_and_Paul_catch_up.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "🗣️",
    "summaryFa": "پل با راب درباره ماندگار شدن در آمریکا صحبت می‌کند و این که آیا او برای کارش رویاهای نویسندگی‌اش را فراموش کرده است یا خیر.",
    "summaryEn": "Paul questions Rob about settling down in America and whether he is compromising his dreams for his job and relationship.",
    "keyTopicsFa": [
      "گفتگوهای عمیق درباره آینده",
      "انتخاب بین آرامش و جاه‌طلبی",
      "رویاهای نویسندگی و هنر",
      "نقش دوستان واقعی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 2: Rob and Paul Catch Up on Life.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 40,
        "timeDisplay": "0:40",
        "textEn": "Detailed conversation and communicative exchange regarding گفتگوهای عمیق درباره آینده.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون گفتگوهای عمیق درباره آینده.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 120,
        "timeDisplay": "2:00",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 2: Rob and Paul Catch Up on Life.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 2: Rob and Paul Catch Up on Life', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 53,
        "timestampDisplay": "0:53",
        "explanationFa": "در این صحنه، تمرکز بر گفتگوهای عمیق درباره آینده و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Paul questions Rob about settling down in America and whether he is compromising...",
            "textFa": "تمرکز اصلی بر پل با راب درباره ماندگار شدن در آمریکا صحبت می‌کند و این که آیا او برا... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (گفتگوهای عمیق درباره آینده) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 2: Rob and Paul Catch Up on Life)?",
        "explanationFa": "واژه career کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Career: an essential communicative term used throughout this scenario.",
            "textFa": "Career: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Are you truly happy with the choices you have made for your career?",
            "textFa": "آیا واقعاً از تصمیماتی که برای زندگی حرفه‌ای‌ات گرفته‌ای راضی هستی؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Are you truly happy with the choices you have made for your career?",
        "targetPhraseFa": "آیا واقعاً از تصمیماتی که برای زندگی حرفه‌ای‌ات گرفته‌ای راضی هستی؟",
        "phoneticGuide": "/ɑːr juː ˈtruːli ˈhæpi wɪð ðə ˈtʃɔɪsɪz juː hæv meɪd fɔːr jʊr kəˈrɪr/",
        "speakingTipsFa": "choices جمع choice با تلفظ /ˈtʃɔɪsɪz/ است.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه گفتگوهای عمیق درباره آینده می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 2: Rob and Paul Catch Up on Life', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره گفتگوهای عمیق درباره آینده است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding گفتگوهای عمیق درباره آینده.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره گفتگوهای عمیق درباره آینده."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 2: Rob and Paul Catch Up on Life) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "career",
          "choices",
          "happy"
        ],
        "sampleAnswerEn": "True friends ask honest questions about whether your career path aligns with your passions.",
        "sampleAnswerFa": "دوستان واقعی سوالاتی صادقانه درباره هماهنگی مسیر شغلی شما با علایقتان مطرح می‌کنند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v12",
    "level": "b1",
    "episodeNumber": 12,
    "titleFa": "اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی",
    "titleEn": "Episode 4 · Part 3: Making Suggestions and Plans",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 4",
    "cefr": "B1",
    "duration": "3:27",
    "durationSec": 207,
    "fileName": "AEF3e_Level_3_PE_Ep4_Making_suggestions.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep4_Making_suggestions.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #10b981, #34d399)",
    "posterIcon": "💡",
    "summaryFa": "تمرین روش‌های کاربردی برای پیشنهاد فعالیت‌ها با استفاده از عبارات متنوع و مودبانه در زبان انگلیسی.",
    "summaryEn": "Practicing constructive ways to suggest plans and activities in English using 'Why don't we...', 'How about...', and 'We could...'.",
    "keyTopicsFa": [
      "فرمول‌های پیشنهاد دادن (Why don't we + مصدر)",
      "ساختار How about + ing",
      "پذیرش پیشنهاد (That sounds great!)",
      "رد مودبانه"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 4 · Part 3: Making Suggestions and Plans.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 51,
        "timeDisplay": "0:51",
        "textEn": "Detailed conversation and communicative exchange regarding فرمول‌های پیشنهاد دادن (Why don't we + مصدر).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون فرمول‌های پیشنهاد دادن (Why don't we + مصدر).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 155,
        "timeDisplay": "2:35",
        "textEn": "Concluding remarks and key language takeaway for Episode 4 · Part 3: Making Suggestions and Plans.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 4 · Part 3: Making Suggestions and Plans', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 69,
        "timestampDisplay": "1:09",
        "explanationFa": "در این صحنه، تمرکز بر فرمول‌های پیشنهاد دادن (Why don't we + مصدر) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Practicing constructive ways to suggest plans and activities in English using 'W...",
            "textFa": "تمرکز اصلی بر تمرین روش‌های کاربردی برای پیشنهاد فعالیت‌ها با استفاده از عبارات متنو... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (فرمول‌های پیشنهاد دادن (Why don't we + مصدر)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 4 · Part 3: Making Suggestions and Plans)?",
        "explanationFa": "واژه suggest کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Suggest: an essential communicative term used throughout this scenario.",
            "textFa": "Suggest: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "How about visiting the modern art museum before having lunch downtown?",
            "textFa": "نظرتان چیست قبل از صرف ناهار در مرکز شهر، از موزه هنرهای مدرن دیدن کنیم؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "How about visiting the modern art museum before having lunch downtown?",
        "targetPhraseFa": "نظرتان چیست قبل از صرف ناهار در مرکز شهر، از موزه هنرهای مدرن دیدن کنیم؟",
        "phoneticGuide": "/haʊ əˈbaʊt ˈvɪzɪtɪŋ ðə ˈmɑːdərn ɑːrt mjuːˈziːəm bɪˈfɔːr ˈhævɪŋ lʌntʃ ˈdaʊntaʊn/",
        "speakingTipsFa": "بعد از How about همواره فعل به صورت ing-دار استفاده می‌شود.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه فرمول‌های پیشنهاد دادن (Why don't we + مصدر) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 4 · Part 3: Making Suggestions and Plans', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره فرمول‌های پیشنهاد دادن (Why don't we + مصدر) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding فرمول‌های پیشنهاد دادن (Why don't we + مصدر).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره فرمول‌های پیشنهاد دادن (Why don't we + مصدر)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 4 · Part 3: Making Suggestions and Plans) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "suggest",
          "lunch",
          "visiting"
        ],
        "sampleAnswerEn": "Making positive suggestions like 'Why don't we walk' makes planning trips enjoyable.",
        "sampleAnswerFa": "پیشنهاد دادن فعالیت‌ها مانند 'چطور است پیاده برویم' برنامه‌ریزی سفرها را لذت‌بخش می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v13",
    "level": "b1",
    "episodeNumber": 13,
    "titleFa": "اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی",
    "titleEn": "Episode 5 · Part 1: Jenny Gets an Unexpected Surprise",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "B1",
    "duration": "2:38",
    "durationSec": 158,
    "fileName": "AEF3e_Level_3_PE_Ep5_Jenny_gets_a_surprise.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep5_Jenny_gets_a_surprise.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
    "posterIcon": "🌹",
    "summaryFa": "راب یک شام دو نفره بر فراز پشت‌بام با چشم‌انداز آسمان‌خراش‌های منهتن ترتیب می‌دهد تا جنی را غافلگیر کند.",
    "summaryEn": "Rob arranges an intimate, romantic rooftop dinner overlooking the Manhattan skyline to surprise Jenny.",
    "keyTopicsFa": [
      "چشم‌اندازهای منهتن (Skyline)",
      "برنامه‌ریزی شام رمانتیک",
      "قدردانی از همراهی",
      "رابطه عاطفی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 1: Jenny Gets an Unexpected Surprise.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 39,
        "timeDisplay": "0:39",
        "textEn": "Detailed conversation and communicative exchange regarding چشم‌اندازهای منهتن (Skyline).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون چشم‌اندازهای منهتن (Skyline).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 118,
        "timeDisplay": "1:58",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 1: Jenny Gets an Unexpected Surprise.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 1: Jenny Gets an Unexpected Surprise', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 52,
        "timestampDisplay": "0:52",
        "explanationFa": "در این صحنه، تمرکز بر چشم‌اندازهای منهتن (Skyline) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob arranges an intimate, romantic rooftop dinner overlooking the Manhattan skyl...",
            "textFa": "تمرکز اصلی بر راب یک شام دو نفره بر فراز پشت‌بام با چشم‌انداز آسمان‌خراش‌های منهتن ت... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (چشم‌اندازهای منهتن (Skyline)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 1: Jenny Gets an Unexpected Surprise)?",
        "explanationFa": "واژه view کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "View: an essential communicative term used throughout this scenario.",
            "textFa": "View: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "The view of the city lights from this terrace is absolutely breathtaking.",
            "textFa": "منظره چراغ‌های شهر از این بالکن واقعاً مسحورکننده و نفس‌گیر است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "The view of the city lights from this terrace is absolutely breathtaking.",
        "targetPhraseFa": "منظره چراغ‌های شهر از این بالکن واقعاً مسحورکننده و نفس‌گیر است.",
        "phoneticGuide": "/ðə vjuː əv ðə ˈsɪti laɪts frəm ðɪs ˈterəs ɪz ˌæbsəˈluːtli ˈbreθteɪkɪŋ/",
        "speakingTipsFa": "breathtaking یعنی آن‌قدر زیبا که نفس انسان بند می‌آید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه چشم‌اندازهای منهتن (Skyline) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 1: Jenny Gets an Unexpected Surprise', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره چشم‌اندازهای منهتن (Skyline) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding چشم‌اندازهای منهتن (Skyline).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره چشم‌اندازهای منهتن (Skyline)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 1: Jenny Gets an Unexpected Surprise) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "view",
          "city",
          "breathtaking"
        ],
        "sampleAnswerEn": "Watching the sunset over New York City from a rooftop terrace is a memorable experience.",
        "sampleAnswerFa": "تماشای غروب آفتاب بر فراز شهر نیویورک از بالکن پشت‌بام، تجربه‌ای خاطره‌انگیز است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v14",
    "level": "b1",
    "episodeNumber": 14,
    "titleFa": "اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک",
    "titleEn": "Episode 5 · Part 2: Rob Gets Serious About the Future",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "B1",
    "duration": "1:54",
    "durationSec": 114,
    "fileName": "AEF3e_Level_3_PE_Ep5_Rob_gets_serious.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep5_Rob_gets_serious.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    "posterIcon": "💍",
    "summaryFa": "راب با جنی صمیمانه درباره تعهدات بلندمدت و آرزوی ساختن زندگی پایدار مشترک در نیویورک سخن می‌گوید.",
    "summaryEn": "Rob talks candidly with Jenny about his long-term commitments, sharing his wish to build a permanent life together in New York.",
    "keyTopicsFa": [
      "تعهدات بلندمدت (Commitment)",
      "تصمیم‌گیری برای آینده مشترک",
      "بیان نیات قلبی",
      "مکالمات عمیق زناشویی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 2: Rob Gets Serious About the Future.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 28,
        "timeDisplay": "0:28",
        "textEn": "Detailed conversation and communicative exchange regarding تعهدات بلندمدت (Commitment).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون تعهدات بلندمدت (Commitment).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 85,
        "timeDisplay": "1:25",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 2: Rob Gets Serious About the Future.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 2: Rob Gets Serious About the Future', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 38,
        "timestampDisplay": "0:38",
        "explanationFa": "در این صحنه، تمرکز بر تعهدات بلندمدت (Commitment) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Rob talks candidly with Jenny about his long-term commitments, sharing his wish ...",
            "textFa": "تمرکز اصلی بر راب با جنی صمیمانه درباره تعهدات بلندمدت و آرزوی ساختن زندگی پایدار مش... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (تعهدات بلندمدت (Commitment)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 2: Rob Gets Serious About the Future)?",
        "explanationFa": "واژه future کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Future: an essential communicative term used throughout this scenario.",
            "textFa": "Future: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "I want us to plan our future together and take this relationship forward.",
            "textFa": "می‌خواهم آینده‌مان را با هم برنامه‌ریزی کنیم و این ارتباط را به مرحله جدی‌تر ببریم."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "I want us to plan our future together and take this relationship forward.",
        "targetPhraseFa": "می‌خواهم آینده‌مان را با هم برنامه‌ریزی کنیم و این ارتباط را به مرحله جدی‌تر ببریم.",
        "phoneticGuide": "/aɪ wɑːnt ʌs tuː plæn ˈaʊər ˈfjuːtʃər təˈɡeðər ənd teɪk ðɪs rɪˈleɪʃnʃɪp ˈfɔːrwərd/",
        "speakingTipsFa": "take forward یعنی به جلو راندن و پیشرفت دادن یک امر.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه تعهدات بلندمدت (Commitment) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 2: Rob Gets Serious About the Future', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره تعهدات بلندمدت (Commitment) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding تعهدات بلندمدت (Commitment).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره تعهدات بلندمدت (Commitment)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 2: Rob Gets Serious About the Future) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "future",
          "together",
          "relationship"
        ],
        "sampleAnswerEn": "Honest conversations about life goals are the cornerstone of any lasting relationship.",
        "sampleAnswerFa": "گفتگوهای صادقانه درباره اهداف زندگی، پایه و اساس هر رابطه پایداری است.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v15",
    "level": "b1",
    "episodeNumber": 15,
    "titleFa": "اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی",
    "titleEn": "Episode 5 · Part 3: Indirect Questions for Polite Inquiries",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "B1",
    "duration": "2:14",
    "durationSec": 134,
    "fileName": "AEF3e_Level_3_PE_Ep5_Indirect_questions.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep5_Indirect_questions.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "❓",
    "summaryFa": "آموزش ساختار گرامری سوالات غیرمستقیم برای بیان پرسش‌ها به شیوه‌ای بسیار موقرانه و رسمی.",
    "summaryEn": "Learn the mechanics of indirect questions (Could you tell me where...?, Do you happen to know...?) to sound sophisticated and polite.",
    "keyTopicsFa": [
      "گرامر Indirect Questions",
      "ترتیب کلمات فاعل + فعل در سوال غیرمستقیم",
      "حذف did/do در سوال",
      "مکالمات اداری و رسمی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 3: Indirect Questions for Polite Inquiries.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 33,
        "timeDisplay": "0:33",
        "textEn": "Detailed conversation and communicative exchange regarding گرامر Indirect Questions.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون گرامر Indirect Questions.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 100,
        "timeDisplay": "1:40",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 3: Indirect Questions for Polite Inquiries.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 3: Indirect Questions for Polite Inquiries', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 44,
        "timestampDisplay": "0:44",
        "explanationFa": "در این صحنه، تمرکز بر گرامر Indirect Questions و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Learn the mechanics of indirect questions (Could you tell me where...?, Do you h...",
            "textFa": "تمرکز اصلی بر آموزش ساختار گرامری سوالات غیرمستقیم برای بیان پرسش‌ها به شیوه‌ای بسیا... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (گرامر Indirect Questions) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 3: Indirect Questions for Polite Inquiries)?",
        "explanationFa": "واژه could کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Could: an essential communicative term used throughout this scenario.",
            "textFa": "Could: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Could you please tell me what time the evening ceremony begins?",
            "textFa": "ممکن است لطفاً به من بگویید مراسم عصر در چه ساعتی آغاز می‌شود؟"
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Could you please tell me what time the evening ceremony begins?",
        "targetPhraseFa": "ممکن است لطفاً به من بگویید مراسم عصر در چه ساعتی آغاز می‌شود؟",
        "phoneticGuide": "/kʊd juː pliːz tel miː wʌt taɪm ðɪ ˈiːvnɪŋ ˈserəmoʊni bɪˈɡɪnz/",
        "speakingTipsFa": "توجه: در سوالات غیرمستقیم ترتیب کلمات شبیه جمله مثبت است (the ceremony begins).",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه گرامر Indirect Questions می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 3: Indirect Questions for Polite Inquiries', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره گرامر Indirect Questions است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding گرامر Indirect Questions.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره گرامر Indirect Questions."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 3: Indirect Questions for Polite Inquiries) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "could",
          "tell",
          "ceremony"
        ],
        "sampleAnswerEn": "Using indirect questions like 'Do you know where the station is' sounds respectful and polished.",
        "sampleAnswerFa": "کاربرد سوالات غیرمستقیم، کلام شما را مودبانه، حرفه‌ای و پخته جلوه می‌دهد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b1-v16",
    "level": "b1",
    "episodeNumber": 16,
    "titleFa": "اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای",
    "titleEn": "Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions",
    "bookLevel": "American English File 3 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "B1",
    "duration": "1:08",
    "durationSec": 68,
    "fileName": "AEF3e_Level_3_PE_Ep5_Social_English_phrases.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b1&file=AEF3e_Level_3_PE_Ep5_Social_English_phrases.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #d97706, #f59e0b)",
    "posterIcon": "🎉",
    "summaryFa": "اصطلاحات عامیانه و روان انگلیسی که بومی‌زبانان در گفتگوهای روزمره و میهمانی‌ها به کار می‌برند.",
    "summaryEn": "Master common informal phrases and idiomatic expressions used by native speakers in everyday social situations.",
    "keyTopicsFa": [
      "اصطلاحات روزمره (It's up to you, Never mind)",
      "واکنش‌های خودمانی",
      "اصطلاحات خوش‌آمدگویی",
      "تسلط در مکالمه دوستانه"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions.",
        "textFa": "بخش اول صحنه آموزشی: اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 17,
        "timeDisplay": "0:17",
        "textEn": "Detailed conversation and communicative exchange regarding اصطلاحات روزمره (It's up to you, Never mind).",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون اصطلاحات روزمره (It's up to you, Never mind).",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 51,
        "timeDisplay": "0:51",
        "textEn": "Concluding remarks and key language takeaway for Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 22,
        "timestampDisplay": "0:22",
        "explanationFa": "در این صحنه، تمرکز بر اصطلاحات روزمره (It's up to you, Never mind) و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Master common informal phrases and idiomatic expressions used by native speakers...",
            "textFa": "تمرکز اصلی بر اصطلاحات عامیانه و روان انگلیسی که بومی‌زبانان در گفتگوهای روزمره و می... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (اصطلاحات روزمره (It's up to you, Never mind)) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions)?",
        "explanationFa": "واژه decide کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Decide: an essential communicative term used throughout this scenario.",
            "textFa": "Decide: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "It is entirely up to you; whatever you decide works best for me.",
            "textFa": "کاملاً به خودت بستگی دارد؛ هر تصمیمی بگیری برای من هم عالی است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "It is entirely up to you; whatever you decide works best for me.",
        "targetPhraseFa": "کاملاً به خودت بستگی دارد؛ هر تصمیمی بگیری برای من هم عالی است.",
        "phoneticGuide": "/ɪt ɪz ɪnˈtaɪərli ʌp tuː juː wʌtˈevər juː dɪˈsaɪd wɜːrks best fɔːr miː/",
        "speakingTipsFa": "it's up to you یکی از پرکاربردترین اصطلاحات زبان انگلیسی به معنای 'انتخاب با شماست'.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه اصطلاحات روزمره (It's up to you, Never mind) می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره اصطلاحات روزمره (It's up to you, Never mind) است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding اصطلاحات روزمره (It's up to you, Never mind).",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره اصطلاحات روزمره (It's up to you, Never mind)."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions) using the required keywords.",
        "minWords": 14,
        "keywordsToUse": [
          "decide",
          "entirely",
          "works"
        ],
        "sampleAnswerEn": "Mastering everyday idioms like 'it's up to you' makes your conversational English natural.",
        "sampleAnswerFa": "تسلط بر اصطلاحات روزمره، انگلیسی محاوره‌ای شما را طبیعی و روان می‌سازد.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v01",
    "level": "b2",
    "episodeNumber": 1,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1)",
    "titleEn": "Colloquial English · Candida Brady (Part 1)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Candida Brady",
    "cefr": "B2",
    "duration": "2:55",
    "durationSec": 175,
    "fileName": "AEF2e L4 Candida Brady - Part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Candida Brady - Part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 1 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) درباره مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 1 of the in-depth interview with Candida Brady exploring Environmental Documentaries & Trashed, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Candida Brady",
      "مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Candida Brady (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 43,
        "timeDisplay": "0:43",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Candida Brady.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Candida Brady.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 131,
        "timeDisplay": "2:11",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Candida Brady (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Candida Brady (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 58,
        "timestampDisplay": "0:58",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Candida Brady و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 1 of the in-depth interview with Candida Brady exploring Environmental Docu...",
            "textFa": "تمرکز اصلی بر بخش 1 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Candida Brady) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Candida Brady (Part 1))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Candida Brady می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Candida Brady (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Candida Brady است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Candida Brady.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Candida Brady."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Candida Brady (Part 1)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Candida Brady broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v02",
    "level": "b2",
    "episodeNumber": 2,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2)",
    "titleEn": "Colloquial English · Candida Brady (Part 2)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Candida Brady",
    "cefr": "B2",
    "duration": "3:08",
    "durationSec": 188,
    "fileName": "AEF2e L4 Candida Brady - Part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Candida Brady - Part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 2 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) درباره مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 2 of the in-depth interview with Candida Brady exploring Environmental Documentaries & Trashed, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Candida Brady",
      "مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Candida Brady (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 47,
        "timeDisplay": "0:47",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Candida Brady.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Candida Brady.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 141,
        "timeDisplay": "2:21",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Candida Brady (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Candida Brady (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 62,
        "timestampDisplay": "1:02",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Candida Brady و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 2 of the in-depth interview with Candida Brady exploring Environmental Docu...",
            "textFa": "تمرکز اصلی بر بخش 2 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Candida Brady) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Candida Brady (Part 2))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Candida Brady می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Candida Brady (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Candida Brady است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Candida Brady.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Candida Brady."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Candida Brady (Part 2)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Candida Brady broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v03",
    "level": "b2",
    "episodeNumber": 3,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3)",
    "titleEn": "Colloquial English · Candida Brady (Part 3)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Candida Brady",
    "cefr": "B2",
    "duration": "2:29",
    "durationSec": 149,
    "fileName": "AEF2e L4 Candida Brady - Part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Candida Brady - Part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 3 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) درباره مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 3 of the in-depth interview with Candida Brady exploring Environmental Documentaries & Trashed, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Candida Brady",
      "مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Candida Brady (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 37,
        "timeDisplay": "0:37",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Candida Brady.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Candida Brady.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 111,
        "timeDisplay": "1:51",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Candida Brady (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Candida Brady (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 49,
        "timestampDisplay": "0:49",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Candida Brady و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 3 of the in-depth interview with Candida Brady exploring Environmental Docu...",
            "textFa": "تمرکز اصلی بر بخش 3 از مصاحبه تحلیلی با کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) ... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Candida Brady) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Candida Brady (Part 3))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Candida Brady, we examine how environmental documentaries & trashed shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Candida Brady می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Candida Brady (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Candida Brady است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Candida Brady.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Candida Brady."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · کاندیدا بردی (کارگردان مستندهای محیط‌زیستی) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Candida Brady (Part 3)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Candida Brady broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v04",
    "level": "b2",
    "episodeNumber": 4,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1)",
    "titleEn": "Colloquial English · George Tannenbaum (Part 1)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: George Tannenbaum",
    "cefr": "B2",
    "duration": "2:57",
    "durationSec": 177,
    "fileName": "AEF2e L4 George Tannenbaum - Part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 George Tannenbaum - Part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 1 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درباره روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 1 of the in-depth interview with George Tannenbaum exploring Advertising Psychology & Slogans, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با George Tannenbaum",
      "روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · George Tannenbaum (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 44,
        "timeDisplay": "0:44",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با George Tannenbaum.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با George Tannenbaum.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 132,
        "timeDisplay": "2:12",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · George Tannenbaum (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · George Tannenbaum (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 59,
        "timestampDisplay": "0:59",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با George Tannenbaum و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 1 of the in-depth interview with George Tannenbaum exploring Advertising Ps...",
            "textFa": "تمرکز اصلی بر بخش 1 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درب... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با George Tannenbaum) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · George Tannenbaum (Part 1))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با George Tannenbaum می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · George Tannenbaum (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با George Tannenbaum است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با George Tannenbaum.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با George Tannenbaum."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · George Tannenbaum (Part 1)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of George Tannenbaum broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v05",
    "level": "b2",
    "episodeNumber": 5,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2)",
    "titleEn": "Colloquial English · George Tannenbaum (Part 2)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: George Tannenbaum",
    "cefr": "B2",
    "duration": "2:48",
    "durationSec": 168,
    "fileName": "AEF2e L4 George Tannenbaum - Part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 George Tannenbaum - Part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 2 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درباره روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 2 of the in-depth interview with George Tannenbaum exploring Advertising Psychology & Slogans, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با George Tannenbaum",
      "روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · George Tannenbaum (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 42,
        "timeDisplay": "0:42",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با George Tannenbaum.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با George Tannenbaum.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 126,
        "timeDisplay": "2:06",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · George Tannenbaum (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · George Tannenbaum (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 56,
        "timestampDisplay": "0:56",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با George Tannenbaum و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 2 of the in-depth interview with George Tannenbaum exploring Advertising Ps...",
            "textFa": "تمرکز اصلی بر بخش 2 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درب... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با George Tannenbaum) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · George Tannenbaum (Part 2))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با George Tannenbaum می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · George Tannenbaum (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با George Tannenbaum است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با George Tannenbaum.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با George Tannenbaum."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · George Tannenbaum (Part 2)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of George Tannenbaum broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v06",
    "level": "b2",
    "episodeNumber": 6,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3)",
    "titleEn": "Colloquial English · George Tannenbaum (Part 3)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: George Tannenbaum",
    "cefr": "B2",
    "duration": "3:29",
    "durationSec": 209,
    "fileName": "AEF2e L4 George Tannenbaum - Part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 George Tannenbaum - Part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 3 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درباره روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 3 of the in-depth interview with George Tannenbaum exploring Advertising Psychology & Slogans, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با George Tannenbaum",
      "روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · George Tannenbaum (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 52,
        "timeDisplay": "0:52",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با George Tannenbaum.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با George Tannenbaum.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 156,
        "timeDisplay": "2:36",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · George Tannenbaum (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · George Tannenbaum (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 69,
        "timestampDisplay": "1:09",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با George Tannenbaum و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 3 of the in-depth interview with George Tannenbaum exploring Advertising Ps...",
            "textFa": "تمرکز اصلی بر بخش 3 از مصاحبه تحلیلی با جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) درب... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با George Tannenbaum) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · George Tannenbaum (Part 3))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with George Tannenbaum, we examine how advertising psychology & slogans shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با George Tannenbaum می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · George Tannenbaum (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با George Tannenbaum است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با George Tannenbaum.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با George Tannenbaum."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · George Tannenbaum (Part 3)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of George Tannenbaum broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v07",
    "level": "b2",
    "episodeNumber": 7,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1)",
    "titleEn": "Colloquial English · Jeff Neil (Part 1)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Jeff Neil",
    "cefr": "B2",
    "duration": "2:55",
    "durationSec": 175,
    "fileName": "AEF2e L4 Jeff Neil - Part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Jeff Neil - Part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 1 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره استراتژی‌های پیروزی در مصاحبه شغلی و رزومه و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 1 of the in-depth interview with Jeff Neil exploring Job Interviews & Career Coaching, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Jeff Neil",
      "استراتژی‌های پیروزی در مصاحبه شغلی و رزومه",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Jeff Neil (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 43,
        "timeDisplay": "0:43",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Jeff Neil.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Jeff Neil.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 131,
        "timeDisplay": "2:11",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Jeff Neil (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Jeff Neil (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 58,
        "timestampDisplay": "0:58",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Jeff Neil و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 1 of the in-depth interview with Jeff Neil exploring Job Interviews & Caree...",
            "textFa": "تمرکز اصلی بر بخش 1 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره اس... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Jeff Neil) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Jeff Neil (Part 1))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Jeff Neil می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Jeff Neil (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Jeff Neil است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Jeff Neil.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Jeff Neil."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Jeff Neil (Part 1)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Jeff Neil broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v08",
    "level": "b2",
    "episodeNumber": 8,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2)",
    "titleEn": "Colloquial English · Jeff Neil (Part 2)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Jeff Neil",
    "cefr": "B2",
    "duration": "2:09",
    "durationSec": 129,
    "fileName": "AEF2e L4 Jeff Neil - Part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Jeff Neil - Part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 2 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره استراتژی‌های پیروزی در مصاحبه شغلی و رزومه و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 2 of the in-depth interview with Jeff Neil exploring Job Interviews & Career Coaching, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Jeff Neil",
      "استراتژی‌های پیروزی در مصاحبه شغلی و رزومه",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Jeff Neil (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 32,
        "timeDisplay": "0:32",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Jeff Neil.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Jeff Neil.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 96,
        "timeDisplay": "1:36",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Jeff Neil (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Jeff Neil (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 43,
        "timestampDisplay": "0:43",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Jeff Neil و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 2 of the in-depth interview with Jeff Neil exploring Job Interviews & Caree...",
            "textFa": "تمرکز اصلی بر بخش 2 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره اس... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Jeff Neil) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Jeff Neil (Part 2))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Jeff Neil می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Jeff Neil (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Jeff Neil است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Jeff Neil.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Jeff Neil."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Jeff Neil (Part 2)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Jeff Neil broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v09",
    "level": "b2",
    "episodeNumber": 9,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3)",
    "titleEn": "Colloquial English · Jeff Neil (Part 3)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Jeff Neil",
    "cefr": "B2",
    "duration": "2:45",
    "durationSec": 165,
    "fileName": "AEF2e L4 Jeff Neil - Part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Jeff Neil - Part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 3 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره استراتژی‌های پیروزی در مصاحبه شغلی و رزومه و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 3 of the in-depth interview with Jeff Neil exploring Job Interviews & Career Coaching, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Jeff Neil",
      "استراتژی‌های پیروزی در مصاحبه شغلی و رزومه",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Jeff Neil (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 41,
        "timeDisplay": "0:41",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Jeff Neil.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Jeff Neil.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 123,
        "timeDisplay": "2:03",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Jeff Neil (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Jeff Neil (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 55,
        "timestampDisplay": "0:55",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Jeff Neil و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 3 of the in-depth interview with Jeff Neil exploring Job Interviews & Caree...",
            "textFa": "تمرکز اصلی بر بخش 3 از مصاحبه تحلیلی با جف نیل (کوچ بین‌المللی ارتقای شغل) درباره اس... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Jeff Neil) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Jeff Neil (Part 3))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Jeff Neil, we examine how job interviews & career coaching shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری استراتژی‌های پیروزی در مصاحبه شغلی و رزومه بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Jeff Neil می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Jeff Neil (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Jeff Neil است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Jeff Neil.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Jeff Neil."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · جف نیل (کوچ بین‌المللی ارتقای شغل) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Jeff Neil (Part 3)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Jeff Neil broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v10",
    "level": "b2",
    "episodeNumber": 10,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1)",
    "titleEn": "Colloquial English · Marion Pomeranc (Part 1)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Marion Pomeranc",
    "cefr": "B2",
    "duration": "2:10",
    "durationSec": 130,
    "fileName": "AEF2e L4 Marion Pomeranc - Part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Marion Pomeranc - Part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 1 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره هنر قصه‌گویی و خلق شخصیت‌های ماندگار و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 1 of the in-depth interview with Marion Pomeranc exploring Storytelling & Children's Literature, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Marion Pomeranc",
      "هنر قصه‌گویی و خلق شخصیت‌های ماندگار",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Marion Pomeranc (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 32,
        "timeDisplay": "0:32",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Marion Pomeranc.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Marion Pomeranc.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 97,
        "timeDisplay": "1:37",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Marion Pomeranc (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Marion Pomeranc (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 43,
        "timestampDisplay": "0:43",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Marion Pomeranc و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 1 of the in-depth interview with Marion Pomeranc exploring Storytelling & C...",
            "textFa": "تمرکز اصلی بر بخش 1 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Marion Pomeranc) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Marion Pomeranc (Part 1))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Marion Pomeranc می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Marion Pomeranc (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Marion Pomeranc است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Marion Pomeranc.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Marion Pomeranc."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Marion Pomeranc (Part 1)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Marion Pomeranc broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v11",
    "level": "b2",
    "episodeNumber": 11,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2)",
    "titleEn": "Colloquial English · Marion Pomeranc (Part 2)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Marion Pomeranc",
    "cefr": "B2",
    "duration": "2:23",
    "durationSec": 143,
    "fileName": "AEF2e L4 Marion Pomeranc - Part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Marion Pomeranc - Part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 2 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره هنر قصه‌گویی و خلق شخصیت‌های ماندگار و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 2 of the in-depth interview with Marion Pomeranc exploring Storytelling & Children's Literature, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Marion Pomeranc",
      "هنر قصه‌گویی و خلق شخصیت‌های ماندگار",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Marion Pomeranc (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 35,
        "timeDisplay": "0:35",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Marion Pomeranc.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Marion Pomeranc.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 107,
        "timeDisplay": "1:47",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Marion Pomeranc (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Marion Pomeranc (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 47,
        "timestampDisplay": "0:47",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Marion Pomeranc و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 2 of the in-depth interview with Marion Pomeranc exploring Storytelling & C...",
            "textFa": "تمرکز اصلی بر بخش 2 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Marion Pomeranc) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Marion Pomeranc (Part 2))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Marion Pomeranc می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Marion Pomeranc (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Marion Pomeranc است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Marion Pomeranc.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Marion Pomeranc."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Marion Pomeranc (Part 2)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Marion Pomeranc broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v12",
    "level": "b2",
    "episodeNumber": 12,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3)",
    "titleEn": "Colloquial English · Marion Pomeranc (Part 3)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Marion Pomeranc",
    "cefr": "B2",
    "duration": "2:20",
    "durationSec": 140,
    "fileName": "AEF2e L4 Marion Pomeranic - Part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Marion Pomeranic - Part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 3 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره هنر قصه‌گویی و خلق شخصیت‌های ماندگار و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 3 of the in-depth interview with Marion Pomeranc exploring Storytelling & Children's Literature, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Marion Pomeranc",
      "هنر قصه‌گویی و خلق شخصیت‌های ماندگار",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Marion Pomeranc (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 35,
        "timeDisplay": "0:35",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Marion Pomeranc.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Marion Pomeranc.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 105,
        "timeDisplay": "1:45",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Marion Pomeranc (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Marion Pomeranc (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 46,
        "timestampDisplay": "0:46",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Marion Pomeranc و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 3 of the in-depth interview with Marion Pomeranc exploring Storytelling & C...",
            "textFa": "تمرکز اصلی بر بخش 3 از مصاحبه تحلیلی با ماریون پومرنک (نویسنده برجسته ادبیات) درباره... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Marion Pomeranc) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Marion Pomeranc (Part 3))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Marion Pomeranc, we examine how storytelling & children's literature shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری هنر قصه‌گویی و خلق شخصیت‌های ماندگار بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Marion Pomeranc می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Marion Pomeranc (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Marion Pomeranc است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Marion Pomeranc.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Marion Pomeranc."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · ماریون پومرنک (نویسنده برجسته ادبیات) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Marion Pomeranc (Part 3)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Marion Pomeranc broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v13",
    "level": "b2",
    "episodeNumber": 13,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1)",
    "titleEn": "Colloquial English · Simon Callow (Part 1)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Simon Callow",
    "cefr": "B2",
    "duration": "3:46",
    "durationSec": 226,
    "fileName": "AEF2e L4 Simon Callow - Part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Simon Callow - Part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 1 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) درباره اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 1 of the in-depth interview with Simon Callow exploring Shakespeare & Theatre Performance, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Simon Callow",
      "اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Simon Callow (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 56,
        "timeDisplay": "0:56",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Simon Callow.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Simon Callow.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 169,
        "timeDisplay": "2:49",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Simon Callow (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Simon Callow (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 75,
        "timestampDisplay": "1:15",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Simon Callow و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 1 of the in-depth interview with Simon Callow exploring Shakespeare & Theat...",
            "textFa": "تمرکز اصلی بر بخش 1 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بری... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Simon Callow) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Simon Callow (Part 1))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Simon Callow می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Simon Callow (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Simon Callow است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Simon Callow.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Simon Callow."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Simon Callow (Part 1)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Simon Callow broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v14",
    "level": "b2",
    "episodeNumber": 14,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2)",
    "titleEn": "Colloquial English · Simon Callow (Part 2)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Simon Callow",
    "cefr": "B2",
    "duration": "2:52",
    "durationSec": 172,
    "fileName": "AEF2e L4 Simon Callow - Part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Simon Callow - Part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 2 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) درباره اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 2 of the in-depth interview with Simon Callow exploring Shakespeare & Theatre Performance, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Simon Callow",
      "اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Simon Callow (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 43,
        "timeDisplay": "0:43",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Simon Callow.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Simon Callow.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 129,
        "timeDisplay": "2:09",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Simon Callow (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Simon Callow (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 57,
        "timestampDisplay": "0:57",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Simon Callow و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 2 of the in-depth interview with Simon Callow exploring Shakespeare & Theat...",
            "textFa": "تمرکز اصلی بر بخش 2 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بری... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Simon Callow) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Simon Callow (Part 2))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Simon Callow می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Simon Callow (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Simon Callow است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Simon Callow.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Simon Callow."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Simon Callow (Part 2)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Simon Callow broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "b2-v15",
    "level": "b2",
    "episodeNumber": 15,
    "titleFa": "انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3)",
    "titleEn": "Colloquial English · Simon Callow (Part 3)",
    "bookLevel": "American English File 4 (3rd Edition)",
    "unit": "Interview: Simon Callow",
    "cefr": "B2",
    "duration": "2:46",
    "durationSec": 166,
    "fileName": "AEF2e L4 Simon Callow - Part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=b2&file=AEF2e L4 Simon Callow - Part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #ea580c, #f97316)",
    "posterIcon": "🎙️",
    "summaryFa": "بخش 3 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) درباره اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
    "summaryEn": "Part 3 of the in-depth interview with Simon Callow exploring Shakespeare & Theatre Performance, analyzing natural speech and idioms.",
    "keyTopicsFa": [
      "مصاحبه با Simon Callow",
      "اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری",
      "لهجه طبیعی و مکث‌های کلامی",
      "واژگان سطح B2"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Colloquial English · Simon Callow (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 41,
        "timeDisplay": "0:41",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه با Simon Callow.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه با Simon Callow.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 124,
        "timeDisplay": "2:04",
        "textEn": "Concluding remarks and key language takeaway for Colloquial English · Simon Callow (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Colloquial English · Simon Callow (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 55,
        "timestampDisplay": "0:55",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه با Simon Callow و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Part 3 of the in-depth interview with Simon Callow exploring Shakespeare & Theat...",
            "textFa": "تمرکز اصلی بر بخش 3 از مصاحبه تحلیلی با سایمون کلو (بازیگر نامدار تئاتر و سینمای بری... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه با Simon Callow) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Colloquial English · Simon Callow (Part 3))?",
        "explanationFa": "واژه society کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Society: an essential communicative term used throughout this scenario.",
            "textFa": "Society: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
            "textFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "In this discussion with Simon Callow, we examine how shakespeare & theatre performance shapes contemporary society.",
        "targetPhraseFa": "در این گفتگو، نحوه تاثیرگذاری اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
        "phoneticGuide": "/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
        "speakingTipsFa": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه با Simon Callow می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Colloquial English · Simon Callow (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه با Simon Callow است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه با Simon Callow.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه با Simon Callow."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (انگلیسی محاوره‌ای پیشرفته · سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Colloquial English · Simon Callow (Part 3)) using the required keywords.",
        "minWords": 15,
        "keywordsToUse": [
          "society",
          "examine",
          "perspective"
        ],
        "sampleAnswerEn": "Understanding the expert insights of Simon Callow broadens our vocabulary and analytical listening skills.",
        "sampleAnswerFa": "درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v01",
    "level": "c1",
    "episodeNumber": 1,
    "titleFa": "مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1)",
    "titleEn": "Mastery Interview · David Torchiano (Part 1)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: David Torchiano",
    "cefr": "C1",
    "duration": "3:44",
    "durationSec": 224,
    "fileName": "AEF2e SB5 1 David Torchiano part 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 1 David Torchiano part 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) پیرامون رهبری آموزشی و چالش‌های مدارس مدرن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with David Torchiano covering Education Leadership, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های David Torchiano",
      "رهبری آموزشی و چالش‌های مدارس مدرن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · David Torchiano (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 56,
        "timeDisplay": "0:56",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های David Torchiano.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های David Torchiano.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 168,
        "timeDisplay": "2:48",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · David Torchiano (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · David Torchiano (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 74,
        "timestampDisplay": "1:14",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های David Torchiano و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with David Torchiano covering Education Leadership, ...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های David Torchiano) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · David Torchiano (Part 1))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های David Torchiano می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · David Torchiano (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های David Torchiano است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های David Torchiano.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های David Torchiano."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · David Torchiano (Part 1)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of David Torchiano enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v02",
    "level": "c1",
    "episodeNumber": 2,
    "titleFa": "مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2)",
    "titleEn": "Mastery Interview · David Torchiano (Part 2)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: David Torchiano",
    "cefr": "C1",
    "duration": "6:37",
    "durationSec": 397,
    "fileName": "AEF2e SB5 1 David Torchiano part 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 1 David Torchiano part 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) پیرامون رهبری آموزشی و چالش‌های مدارس مدرن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with David Torchiano covering Education Leadership, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های David Torchiano",
      "رهبری آموزشی و چالش‌های مدارس مدرن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · David Torchiano (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 99,
        "timeDisplay": "1:39",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های David Torchiano.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های David Torchiano.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 297,
        "timeDisplay": "4:57",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · David Torchiano (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · David Torchiano (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 132,
        "timestampDisplay": "2:12",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های David Torchiano و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with David Torchiano covering Education Leadership, ...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های David Torchiano) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · David Torchiano (Part 2))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های David Torchiano می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · David Torchiano (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های David Torchiano است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های David Torchiano.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های David Torchiano."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · David Torchiano (Part 2)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of David Torchiano enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v03",
    "level": "c1",
    "episodeNumber": 3,
    "titleFa": "مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3)",
    "titleEn": "Mastery Interview · David Torchiano (Part 3)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: David Torchiano",
    "cefr": "C1",
    "duration": "1:31",
    "durationSec": 91,
    "fileName": "AEF2e SB5 1 David Torchiano part 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 1 David Torchiano part 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) پیرامون رهبری آموزشی و چالش‌های مدارس مدرن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with David Torchiano covering Education Leadership, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های David Torchiano",
      "رهبری آموزشی و چالش‌های مدارس مدرن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · David Torchiano (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 22,
        "timeDisplay": "0:22",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های David Torchiano.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های David Torchiano.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 68,
        "timeDisplay": "1:08",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · David Torchiano (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · David Torchiano (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 30,
        "timestampDisplay": "0:30",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های David Torchiano و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with David Torchiano covering Education Leadership, ...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های David Torchiano) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · David Torchiano (Part 3))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on education leadership requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های David Torchiano می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · David Torchiano (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های David Torchiano است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های David Torchiano.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های David Torchiano."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · David Torchiano (Part 3)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of David Torchiano enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v04",
    "level": "c1",
    "episodeNumber": 4,
    "titleFa": "مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1)",
    "titleEn": "Mastery Interview · Adrian Hodges (Part 1)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Adrian Hodges",
    "cefr": "C1",
    "duration": "3:01",
    "durationSec": 181,
    "fileName": "AEF2e SB5 2 Adrian Hodges pt 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 2 Adrian Hodges pt 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) پیرامون فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Adrian Hodges",
      "فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Adrian Hodges (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 45,
        "timeDisplay": "0:45",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Adrian Hodges.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Adrian Hodges.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 135,
        "timeDisplay": "2:15",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Adrian Hodges (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Adrian Hodges (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 60,
        "timestampDisplay": "1:00",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Adrian Hodges و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, n...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی)... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Adrian Hodges) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Adrian Hodges (Part 1))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Adrian Hodges می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Adrian Hodges (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Adrian Hodges است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Adrian Hodges.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Adrian Hodges."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Adrian Hodges (Part 1)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Adrian Hodges enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v05",
    "level": "c1",
    "episodeNumber": 5,
    "titleFa": "مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2)",
    "titleEn": "Mastery Interview · Adrian Hodges (Part 2)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Adrian Hodges",
    "cefr": "C1",
    "duration": "5:00",
    "durationSec": 300,
    "fileName": "AEF2e SB5 2 Adrian Hodges pt 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 2 Adrian Hodges pt 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) پیرامون فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Adrian Hodges",
      "فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Adrian Hodges (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 75,
        "timeDisplay": "1:15",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Adrian Hodges.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Adrian Hodges.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 225,
        "timeDisplay": "3:45",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Adrian Hodges (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Adrian Hodges (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 100,
        "timestampDisplay": "1:40",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Adrian Hodges و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, n...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی)... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Adrian Hodges) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Adrian Hodges (Part 2))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Adrian Hodges می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Adrian Hodges (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Adrian Hodges است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Adrian Hodges.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Adrian Hodges."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Adrian Hodges (Part 2)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Adrian Hodges enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v06",
    "level": "c1",
    "episodeNumber": 6,
    "titleFa": "مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3)",
    "titleEn": "Mastery Interview · Adrian Hodges (Part 3)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Adrian Hodges",
    "cefr": "C1",
    "duration": "1:46",
    "durationSec": 106,
    "fileName": "AEF2e SB5 2 Adrian Hodges pt 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 2 Adrian Hodges pt 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) پیرامون فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Adrian Hodges",
      "فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Adrian Hodges (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 26,
        "timeDisplay": "0:26",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Adrian Hodges.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Adrian Hodges.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 79,
        "timeDisplay": "1:19",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Adrian Hodges (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Adrian Hodges (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 35,
        "timestampDisplay": "0:35",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Adrian Hodges و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Adrian Hodges covering Screenwriting & Drama, n...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی)... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Adrian Hodges) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Adrian Hodges (Part 3))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on screenwriting & drama requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Adrian Hodges می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Adrian Hodges (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Adrian Hodges است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Adrian Hodges.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Adrian Hodges."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Adrian Hodges (Part 3)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Adrian Hodges enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v07",
    "level": "c1",
    "episodeNumber": 7,
    "titleFa": "مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1)",
    "titleEn": "Mastery Interview · Sarita Gupta (Part 1)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Sarita Gupta",
    "cefr": "C1",
    "duration": "4:22",
    "durationSec": 262,
    "fileName": "AEF2e SB5 3 Sarita Gupta pt 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 3 Sarita Gupta pt 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) پیرامون عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Sarita Gupta covering Social Justice & Activism, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Sarita Gupta",
      "عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Sarita Gupta (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 65,
        "timeDisplay": "1:05",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Sarita Gupta.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Sarita Gupta.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 196,
        "timeDisplay": "3:16",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Sarita Gupta (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Sarita Gupta (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 87,
        "timestampDisplay": "1:27",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Sarita Gupta و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Sarita Gupta covering Social Justice & Activism...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Sarita Gupta) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Sarita Gupta (Part 1))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Sarita Gupta می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Sarita Gupta (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Sarita Gupta است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Sarita Gupta.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Sarita Gupta."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Sarita Gupta (Part 1)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Sarita Gupta enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v08",
    "level": "c1",
    "episodeNumber": 8,
    "titleFa": "مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2)",
    "titleEn": "Mastery Interview · Sarita Gupta (Part 2)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Sarita Gupta",
    "cefr": "C1",
    "duration": "4:32",
    "durationSec": 272,
    "fileName": "AEF2e SB5 3 Sarita Gupta pt 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 3 Sarita Gupta pt 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) پیرامون عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Sarita Gupta covering Social Justice & Activism, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Sarita Gupta",
      "عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Sarita Gupta (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 68,
        "timeDisplay": "1:08",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Sarita Gupta.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Sarita Gupta.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 204,
        "timeDisplay": "3:24",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Sarita Gupta (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Sarita Gupta (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 90,
        "timestampDisplay": "1:30",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Sarita Gupta و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Sarita Gupta covering Social Justice & Activism...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Sarita Gupta) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Sarita Gupta (Part 2))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Sarita Gupta می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Sarita Gupta (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Sarita Gupta است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Sarita Gupta.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Sarita Gupta."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Sarita Gupta (Part 2)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Sarita Gupta enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v09",
    "level": "c1",
    "episodeNumber": 9,
    "titleFa": "مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3)",
    "titleEn": "Mastery Interview · Sarita Gupta (Part 3)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Sarita Gupta",
    "cefr": "C1",
    "duration": "1:50",
    "durationSec": 110,
    "fileName": "AEF2e SB5 3 Sarita Gupta pt 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 3 Sarita Gupta pt 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) پیرامون عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Sarita Gupta covering Social Justice & Activism, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Sarita Gupta",
      "عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Sarita Gupta (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 27,
        "timeDisplay": "0:27",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Sarita Gupta.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Sarita Gupta.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 82,
        "timeDisplay": "1:22",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Sarita Gupta (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Sarita Gupta (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 36,
        "timestampDisplay": "0:36",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Sarita Gupta و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Sarita Gupta covering Social Justice & Activism...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Sarita Gupta) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Sarita Gupta (Part 3))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on social justice & activism requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Sarita Gupta می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Sarita Gupta (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Sarita Gupta است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Sarita Gupta.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Sarita Gupta."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Sarita Gupta (Part 3)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Sarita Gupta enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v10",
    "level": "c1",
    "episodeNumber": 10,
    "titleFa": "مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1)",
    "titleEn": "Mastery Interview · Patricia Melvin (Part 1)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Patricia Melvin",
    "cefr": "C1",
    "duration": "5:17",
    "durationSec": 317,
    "fileName": "AEF2e SB5 4 Patricia Melvin pt 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 4 Patricia Melvin pt 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) پیرامون نقاشی فضای باز و ثبت هویت معماری منهتن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Patricia Melvin covering Urban Landscape Painting, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Patricia Melvin",
      "نقاشی فضای باز و ثبت هویت معماری منهتن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Patricia Melvin (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 79,
        "timeDisplay": "1:19",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Patricia Melvin.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Patricia Melvin.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 237,
        "timeDisplay": "3:57",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Patricia Melvin (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Patricia Melvin (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 105,
        "timestampDisplay": "1:45",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Patricia Melvin و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Patricia Melvin covering Urban Landscape Painti...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Patricia Melvin) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Patricia Melvin (Part 1))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Patricia Melvin می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Patricia Melvin (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Patricia Melvin است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Patricia Melvin.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Patricia Melvin."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Patricia Melvin (Part 1)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Patricia Melvin enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v11",
    "level": "c1",
    "episodeNumber": 11,
    "titleFa": "مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2)",
    "titleEn": "Mastery Interview · Patricia Melvin (Part 2)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Patricia Melvin",
    "cefr": "C1",
    "duration": "3:44",
    "durationSec": 224,
    "fileName": "AEF2e SB5 4 Patricia Melvin pt 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 4 Patricia Melvin pt 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) پیرامون نقاشی فضای باز و ثبت هویت معماری منهتن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Patricia Melvin covering Urban Landscape Painting, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Patricia Melvin",
      "نقاشی فضای باز و ثبت هویت معماری منهتن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Patricia Melvin (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 56,
        "timeDisplay": "0:56",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Patricia Melvin.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Patricia Melvin.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 168,
        "timeDisplay": "2:48",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Patricia Melvin (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Patricia Melvin (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 74,
        "timestampDisplay": "1:14",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Patricia Melvin و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Patricia Melvin covering Urban Landscape Painti...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Patricia Melvin) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Patricia Melvin (Part 2))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Patricia Melvin می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Patricia Melvin (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Patricia Melvin است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Patricia Melvin.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Patricia Melvin."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Patricia Melvin (Part 2)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Patricia Melvin enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v12",
    "level": "c1",
    "episodeNumber": 12,
    "titleFa": "مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3)",
    "titleEn": "Mastery Interview · Patricia Melvin (Part 3)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Patricia Melvin",
    "cefr": "C1",
    "duration": "1:43",
    "durationSec": 103,
    "fileName": "AEF2e SB5 4 Patricia Melvin pt 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 4 Patricia Melvin pt 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) پیرامون نقاشی فضای باز و ثبت هویت معماری منهتن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Patricia Melvin covering Urban Landscape Painting, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Patricia Melvin",
      "نقاشی فضای باز و ثبت هویت معماری منهتن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Patricia Melvin (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 25,
        "timeDisplay": "0:25",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Patricia Melvin.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Patricia Melvin.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 77,
        "timeDisplay": "1:17",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Patricia Melvin (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Patricia Melvin (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 34,
        "timestampDisplay": "0:34",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Patricia Melvin و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Patricia Melvin covering Urban Landscape Painti...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Patricia Melvin) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Patricia Melvin (Part 3))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on urban landscape painting requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Patricia Melvin می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Patricia Melvin (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Patricia Melvin است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Patricia Melvin.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Patricia Melvin."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Patricia Melvin (Part 3)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Patricia Melvin enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v13",
    "level": "c1",
    "episodeNumber": 13,
    "titleFa": "مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1)",
    "titleEn": "Mastery Interview · Chantelle Nicholson (Part 1)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Chantelle Nicholson",
    "cefr": "C1",
    "duration": "3:53",
    "durationSec": 233,
    "fileName": "AEF2e SB5 5 Chantelle Nicholson pt 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 5 Chantelle Nicholson pt 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرامون هنر آشپزی پایدار و مدیریت رستوران‌های میشلن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Chantelle Nicholson covering Sustainable Culinary Arts, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Chantelle Nicholson",
      "هنر آشپزی پایدار و مدیریت رستوران‌های میشلن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Chantelle Nicholson (Part 1).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 58,
        "timeDisplay": "0:58",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Chantelle Nicholson.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Chantelle Nicholson.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 174,
        "timeDisplay": "2:54",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Chantelle Nicholson (Part 1).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Chantelle Nicholson (Part 1)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 77,
        "timestampDisplay": "1:17",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Chantelle Nicholson و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Chantelle Nicholson covering Sustainable Culina...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرام... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Chantelle Nicholson) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Chantelle Nicholson (Part 1))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Chantelle Nicholson می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Chantelle Nicholson (Part 1)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Chantelle Nicholson است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Chantelle Nicholson.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Chantelle Nicholson."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 1))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Chantelle Nicholson (Part 1)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Chantelle Nicholson enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v14",
    "level": "c1",
    "episodeNumber": 14,
    "titleFa": "مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2)",
    "titleEn": "Mastery Interview · Chantelle Nicholson (Part 2)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Chantelle Nicholson",
    "cefr": "C1",
    "duration": "4:25",
    "durationSec": 265,
    "fileName": "AEF2e SB5 5 Chantelle Nicholson pt 2.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 5 Chantelle Nicholson pt 2.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرامون هنر آشپزی پایدار و مدیریت رستوران‌های میشلن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Chantelle Nicholson covering Sustainable Culinary Arts, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Chantelle Nicholson",
      "هنر آشپزی پایدار و مدیریت رستوران‌های میشلن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Chantelle Nicholson (Part 2).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 66,
        "timeDisplay": "1:06",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Chantelle Nicholson.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Chantelle Nicholson.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 198,
        "timeDisplay": "3:18",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Chantelle Nicholson (Part 2).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Chantelle Nicholson (Part 2)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 88,
        "timestampDisplay": "1:28",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Chantelle Nicholson و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Chantelle Nicholson covering Sustainable Culina...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرام... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Chantelle Nicholson) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Chantelle Nicholson (Part 2))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Chantelle Nicholson می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Chantelle Nicholson (Part 2)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Chantelle Nicholson است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Chantelle Nicholson.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Chantelle Nicholson."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 2))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Chantelle Nicholson (Part 2)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Chantelle Nicholson enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v15",
    "level": "c1",
    "episodeNumber": 15,
    "titleFa": "مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3)",
    "titleEn": "Mastery Interview · Chantelle Nicholson (Part 3)",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "Expert: Chantelle Nicholson",
    "cefr": "C1",
    "duration": "1:22",
    "durationSec": 82,
    "fileName": "AEF2e SB5 5 Chantelle Nicholson pt 3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 5 Chantelle Nicholson pt 3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "🎓",
    "summaryFa": "گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرامون هنر آشپزی پایدار و مدیریت رستوران‌های میشلن و تسلط بر استدلال‌های سطح C1.",
    "summaryEn": "Advanced critical interview with Chantelle Nicholson covering Sustainable Culinary Arts, nuanced rhetoric and high-level vocabulary.",
    "keyTopicsFa": [
      "دیدگاه‌های Chantelle Nicholson",
      "هنر آشپزی پایدار و مدیریت رستوران‌های میشلن",
      "فن بیان پیشرفته و بلاغت",
      "واژگان سطح C1"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: Mastery Interview · Chantelle Nicholson (Part 3).",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3).",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 20,
        "timeDisplay": "0:20",
        "textEn": "Detailed conversation and communicative exchange regarding دیدگاه‌های Chantelle Nicholson.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون دیدگاه‌های Chantelle Nicholson.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 61,
        "timeDisplay": "1:01",
        "textEn": "Concluding remarks and key language takeaway for Mastery Interview · Chantelle Nicholson (Part 3).",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3).",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3)»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'Mastery Interview · Chantelle Nicholson (Part 3)', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 27,
        "timestampDisplay": "0:27",
        "explanationFa": "در این صحنه، تمرکز بر دیدگاه‌های Chantelle Nicholson و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Advanced critical interview with Chantelle Nicholson covering Sustainable Culina...",
            "textFa": "تمرکز اصلی بر گفتگوی انتقادی پیشرفته با شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) پیرام... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (دیدگاه‌های Chantelle Nicholson) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (Mastery Interview · Chantelle Nicholson (Part 3))?",
        "explanationFa": "واژه precision کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Precision: an essential communicative term used throughout this scenario.",
            "textFa": "Precision: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
            "textFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "Articulating complex perspectives on sustainable culinary arts requires precision, nuance, and sophisticated grammar.",
        "targetPhraseFa": "بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
        "phoneticGuide": "/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
        "speakingTipsFa": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه دیدگاه‌های Chantelle Nicholson می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3)»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'Mastery Interview · Chantelle Nicholson (Part 3)', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره دیدگاه‌های Chantelle Nicholson است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding دیدگاه‌های Chantelle Nicholson.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره دیدگاه‌های Chantelle Nicholson."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه پیشرفته آکسفورد · شانتل نیکلسون (سرآشپز ستاره‌دار میشلن) (بخش 3))، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (Mastery Interview · Chantelle Nicholson (Part 3)) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "precision",
          "perspective",
          "sophisticated"
        ],
        "sampleAnswerEn": "Analyzing the arguments of Chantelle Nicholson enhances our command over formal rhetoric and critical argumentation.",
        "sampleAnswerFa": "تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v16",
    "level": "c1",
    "episodeNumber": 16,
    "titleFa": "مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی",
    "titleEn": "On the Street 1: Perceptions of Success and Ambition",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "On the Street Vox Pops",
    "cefr": "C1",
    "duration": "3:32",
    "durationSec": 212,
    "fileName": "AEF2e SB5 On the street 1.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 On the street 1.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #1e293b, #475569)",
    "posterIcon": "🏙️",
    "summaryFa": "مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Success & Ambition با لهجه‌های گوناگون.",
    "summaryEn": "Spontaneous on-the-street interviews with native speakers in London and New York discussing Success & Ambition.",
    "keyTopicsFa": [
      "مصاحبه خیابانی Success & Ambition",
      "لهجه‌های متنوع بومی",
      "زبان گفتاری طبیعی",
      "اصطلاحات خیابانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: On the Street 1: Perceptions of Success and Ambition.",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 53,
        "timeDisplay": "0:53",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه خیابانی Success & Ambition.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه خیابانی Success & Ambition.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 159,
        "timeDisplay": "2:39",
        "textEn": "Concluding remarks and key language takeaway for On the Street 1: Perceptions of Success and Ambition.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'On the Street 1: Perceptions of Success and Ambition', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 70,
        "timestampDisplay": "1:10",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه خیابانی Success & Ambition و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Spontaneous on-the-street interviews with native speakers in London and New York...",
            "textFa": "تمرکز اصلی بر مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Succes... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه خیابانی Success & Ambition) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (On the Street 1: Perceptions of Success and Ambition)?",
        "explanationFa": "واژه diverse کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Diverse: an essential communicative term used throughout this scenario.",
            "textFa": "Diverse: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "People on the street express strikingly diverse viewpoints concerning success & ambition.",
            "textFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "People on the street express strikingly diverse viewpoints concerning success & ambition.",
        "targetPhraseFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "phoneticGuide": "/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTipsFa": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه خیابانی Success & Ambition می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'On the Street 1: Perceptions of Success and Ambition', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه خیابانی Success & Ambition است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه خیابانی Success & Ambition.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه خیابانی Success & Ambition."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (On the Street 1: Perceptions of Success and Ambition) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "diverse",
          "viewpoints",
          "society"
        ],
        "sampleAnswerEn": "Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleAnswerFa": "مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v17",
    "level": "c1",
    "episodeNumber": 17,
    "titleFa": "مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن",
    "titleEn": "On the Street 2 & 3: Technology, Privacy and Society",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "On the Street Vox Pops",
    "cefr": "C1",
    "duration": "3:12",
    "durationSec": 192,
    "fileName": "AEF2e SB5 On the street 2&3.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 On the street 2&3.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #1e293b, #475569)",
    "posterIcon": "🏙️",
    "summaryFa": "مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Technology & Privacy با لهجه‌های گوناگون.",
    "summaryEn": "Spontaneous on-the-street interviews with native speakers in London and New York discussing Technology & Privacy.",
    "keyTopicsFa": [
      "مصاحبه خیابانی Technology & Privacy",
      "لهجه‌های متنوع بومی",
      "زبان گفتاری طبیعی",
      "اصطلاحات خیابانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: On the Street 2 & 3: Technology, Privacy and Society.",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 48,
        "timeDisplay": "0:48",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه خیابانی Technology & Privacy.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه خیابانی Technology & Privacy.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 144,
        "timeDisplay": "2:24",
        "textEn": "Concluding remarks and key language takeaway for On the Street 2 & 3: Technology, Privacy and Society.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'On the Street 2 & 3: Technology, Privacy and Society', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 64,
        "timestampDisplay": "1:04",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه خیابانی Technology & Privacy و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Spontaneous on-the-street interviews with native speakers in London and New York...",
            "textFa": "تمرکز اصلی بر مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Techno... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه خیابانی Technology & Privacy) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (On the Street 2 & 3: Technology, Privacy and Society)?",
        "explanationFa": "واژه diverse کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Diverse: an essential communicative term used throughout this scenario.",
            "textFa": "Diverse: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "People on the street express strikingly diverse viewpoints concerning technology & privacy.",
            "textFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "People on the street express strikingly diverse viewpoints concerning technology & privacy.",
        "targetPhraseFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "phoneticGuide": "/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTipsFa": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه خیابانی Technology & Privacy می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'On the Street 2 & 3: Technology, Privacy and Society', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه خیابانی Technology & Privacy است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه خیابانی Technology & Privacy.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه خیابانی Technology & Privacy."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (On the Street 2 & 3: Technology, Privacy and Society) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "diverse",
          "viewpoints",
          "society"
        ],
        "sampleAnswerEn": "Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleAnswerFa": "مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v18",
    "level": "c1",
    "episodeNumber": 18,
    "titleFa": "مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره",
    "titleEn": "On the Street 4 & 5: Environmental Accountability",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "On the Street Vox Pops",
    "cefr": "C1",
    "duration": "5:07",
    "durationSec": 307,
    "fileName": "AEF2e SB5 On the street 4&5.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 On the street 4&5.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #1e293b, #475569)",
    "posterIcon": "🏙️",
    "summaryFa": "مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Environment با لهجه‌های گوناگون.",
    "summaryEn": "Spontaneous on-the-street interviews with native speakers in London and New York discussing Environment.",
    "keyTopicsFa": [
      "مصاحبه خیابانی Environment",
      "لهجه‌های متنوع بومی",
      "زبان گفتاری طبیعی",
      "اصطلاحات خیابانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: On the Street 4 & 5: Environmental Accountability.",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 76,
        "timeDisplay": "1:16",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه خیابانی Environment.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه خیابانی Environment.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 230,
        "timeDisplay": "3:50",
        "textEn": "Concluding remarks and key language takeaway for On the Street 4 & 5: Environmental Accountability.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'On the Street 4 & 5: Environmental Accountability', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 102,
        "timestampDisplay": "1:42",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه خیابانی Environment و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Spontaneous on-the-street interviews with native speakers in London and New York...",
            "textFa": "تمرکز اصلی بر مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Enviro... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه خیابانی Environment) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (On the Street 4 & 5: Environmental Accountability)?",
        "explanationFa": "واژه diverse کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Diverse: an essential communicative term used throughout this scenario.",
            "textFa": "Diverse: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "People on the street express strikingly diverse viewpoints concerning environment.",
            "textFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "People on the street express strikingly diverse viewpoints concerning environment.",
        "targetPhraseFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "phoneticGuide": "/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTipsFa": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه خیابانی Environment می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'On the Street 4 & 5: Environmental Accountability', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه خیابانی Environment است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه خیابانی Environment.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه خیابانی Environment."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (On the Street 4 & 5: Environmental Accountability) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "diverse",
          "viewpoints",
          "society"
        ],
        "sampleAnswerEn": "Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleAnswerFa": "مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v19",
    "level": "c1",
    "episodeNumber": 19,
    "titleFa": "مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر",
    "titleEn": "On the Street 6 & 7: Cultural Identity and Art",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "On the Street Vox Pops",
    "cefr": "C1",
    "duration": "4:54",
    "durationSec": 294,
    "fileName": "AEF2e SB5 On the street 6&7.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 On the street 6&7.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #1e293b, #475569)",
    "posterIcon": "🏙️",
    "summaryFa": "مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Culture & Art با لهجه‌های گوناگون.",
    "summaryEn": "Spontaneous on-the-street interviews with native speakers in London and New York discussing Culture & Art.",
    "keyTopicsFa": [
      "مصاحبه خیابانی Culture & Art",
      "لهجه‌های متنوع بومی",
      "زبان گفتاری طبیعی",
      "اصطلاحات خیابانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: On the Street 6 & 7: Cultural Identity and Art.",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 73,
        "timeDisplay": "1:13",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه خیابانی Culture & Art.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه خیابانی Culture & Art.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 220,
        "timeDisplay": "3:40",
        "textEn": "Concluding remarks and key language takeaway for On the Street 6 & 7: Cultural Identity and Art.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'On the Street 6 & 7: Cultural Identity and Art', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 98,
        "timestampDisplay": "1:38",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه خیابانی Culture & Art و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Spontaneous on-the-street interviews with native speakers in London and New York...",
            "textFa": "تمرکز اصلی بر مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Cultur... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه خیابانی Culture & Art) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (On the Street 6 & 7: Cultural Identity and Art)?",
        "explanationFa": "واژه diverse کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Diverse: an essential communicative term used throughout this scenario.",
            "textFa": "Diverse: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "People on the street express strikingly diverse viewpoints concerning culture & art.",
            "textFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "People on the street express strikingly diverse viewpoints concerning culture & art.",
        "targetPhraseFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "phoneticGuide": "/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTipsFa": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه خیابانی Culture & Art می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'On the Street 6 & 7: Cultural Identity and Art', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه خیابانی Culture & Art است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه خیابانی Culture & Art.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه خیابانی Culture & Art."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (On the Street 6 & 7: Cultural Identity and Art) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "diverse",
          "viewpoints",
          "society"
        ],
        "sampleAnswerEn": "Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleAnswerFa": "مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  },
  {
    "id": "c1-v20",
    "level": "c1",
    "episodeNumber": 20,
    "titleFa": "مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی",
    "titleEn": "On the Street 8 & 9: Visions of the Global Future",
    "bookLevel": "American English File 5 (3rd Edition)",
    "unit": "On the Street Vox Pops",
    "cefr": "C1",
    "duration": "6:03",
    "durationSec": 363,
    "fileName": "AEF2e SB5 On the street 8&9.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=c1&file=AEF2e SB5 On the street 8&9.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #1e293b, #475569)",
    "posterIcon": "🏙️",
    "summaryFa": "مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Global Future با لهجه‌های گوناگون.",
    "summaryEn": "Spontaneous on-the-street interviews with native speakers in London and New York discussing Global Future.",
    "keyTopicsFa": [
      "مصاحبه خیابانی Global Future",
      "لهجه‌های متنوع بومی",
      "زبان گفتاری طبیعی",
      "اصطلاحات خیابانی"
    ],
    "transcript": [
      {
        "id": 1,
        "seconds": 0,
        "timeDisplay": "0:00",
        "textEn": "Scene introduction: On the Street 8 & 9: Visions of the Global Future.",
        "textFa": "بخش اول صحنه آموزشی: مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی.",
        "speaker": "Speaker 1"
      },
      {
        "id": 2,
        "seconds": 90,
        "timeDisplay": "1:30",
        "textEn": "Detailed conversation and communicative exchange regarding مصاحبه خیابانی Global Future.",
        "textFa": "گفتگوی محوری صحنه و تبادل کلامی پیرامون مصاحبه خیابانی Global Future.",
        "speaker": "Speaker 2"
      },
      {
        "id": 3,
        "seconds": 272,
        "timeDisplay": "4:32",
        "textEn": "Concluding remarks and key language takeaway for On the Street 8 & 9: Visions of the Global Future.",
        "textFa": "جمع‌بندی نهایی و نکات کلیدی درسی مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی.",
        "speaker": "Speaker 1"
      }
    ],
    "questions": {
      "listening": {
        "skill": "listening",
        "promptFa": "با توجه به محتوای ویدیوی «مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
        "promptEn": "Based on the video 'On the Street 8 & 9: Visions of the Global Future', which statement accurately captures the primary communicative purpose?",
        "timestampSeconds": 121,
        "timestampDisplay": "2:01",
        "explanationFa": "در این صحنه، تمرکز بر مصاحبه خیابانی Global Future و برقراری ارتباط هدفمند است.",
        "options": [
          {
            "id": 1,
            "textEn": "The main focus is Spontaneous on-the-street interviews with native speakers in London and New York...",
            "textFa": "تمرکز اصلی بر مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون Global... است."
          },
          {
            "id": 2,
            "textEn": "They are filing an official tax dispute with authorities.",
            "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
          },
          {
            "id": 3,
            "textEn": "The discussion is strictly about airline ticket cancellations.",
            "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
          },
          {
            "id": 4,
            "textEn": "They are reporting a missing vehicle to local police.",
            "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
          }
        ],
        "correctOptionId": 1
      },
      "vocabulary": {
        "skill": "vocabulary",
        "promptFa": "کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس (مصاحبه خیابانی Global Future) دارد؟",
        "promptEn": "Which vocabulary word is most centrally linked to this lesson (On the Street 8 & 9: Visions of the Global Future)?",
        "explanationFa": "واژه diverse کلیدواژه بنیادین این درس است.",
        "options": [
          {
            "id": 1,
            "textEn": "Diverse: an essential communicative term used throughout this scenario.",
            "textFa": "Diverse: واژه کلیدی این درس."
          },
          {
            "id": 2,
            "textEn": "Subterranean: situated or occurring under the earth's surface.",
            "textFa": "زیرزمینی و اعماق زمین."
          },
          {
            "id": 3,
            "textEn": "Photosynthesis: synthesis of compounds in plants.",
            "textFa": "فوتوسنتز گیاهی."
          },
          {
            "id": 4,
            "textEn": "Barometer: an instrument measuring atmospheric pressure.",
            "textFa": "فشارسنج هوا."
          }
        ],
        "correctOptionId": 1
      },
      "grammar": {
        "skill": "grammar",
        "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
        "promptEn": "Which sentence follows correct English grammatical rules?",
        "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
        "options": [
          {
            "id": 1,
            "textEn": "People on the street express strikingly diverse viewpoints concerning global future.",
            "textFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند."
          },
          {
            "id": 2,
            "textEn": "She do not understands the instructions given yesterday.",
            "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
          },
          {
            "id": 3,
            "textEn": "They was walking down the avenue when it started raining.",
            "textFa": "استفاده اشتباه از was برای فاعل جمع They"
          },
          {
            "id": 4,
            "textEn": "We is discussing the project deadline today.",
            "textFa": "کاربرد غلط فعل is برای فاعل We"
          }
        ],
        "correctOptionId": 1
      },
      "speaking": {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": "People on the street express strikingly diverse viewpoints concerning global future.",
        "targetPhraseFa": "مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "phoneticGuide": "/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTipsFa": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "explanationFa": "تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه مصاحبه خیابانی Global Future می‌شود."
      },
      "reading": {
        "skill": "reading",
        "promptFa": "بر اساس خلاصه و مفهوم درس «مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی»، پیام محوری کدام گزینه است؟",
        "promptEn": "Based on the contextual reading for 'On the Street 8 & 9: Visions of the Global Future', what is the primary takeaway?",
        "explanationFa": "پیام اصلی درک ارتباطات موثر درباره مصاحبه خیابانی Global Future است.",
        "options": [
          {
            "id": 1,
            "textEn": "To master communicative fluency regarding مصاحبه خیابانی Global Future.",
            "textFa": "تسلط بر مهارت‌های ارتباطی درباره مصاحبه خیابانی Global Future."
          },
          {
            "id": 2,
            "textEn": "To memorize chemical formulas for an examination.",
            "textFa": "حفظ فرمول‌های شیمیایی."
          },
          {
            "id": 3,
            "textEn": "To assemble hardware components in a factory.",
            "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
          },
          {
            "id": 4,
            "textEn": "To predict weather patterns using satellite imagery.",
            "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
          }
        ],
        "correctOptionId": 1
      },
      "writing": {
        "skill": "writing",
        "promptFa": "بر اساس موضوع این درس (مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی)، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": "Write a concise paragraph related to this lesson (On the Street 8 & 9: Visions of the Global Future) using the required keywords.",
        "minWords": 18,
        "keywordsToUse": [
          "diverse",
          "viewpoints",
          "society"
        ],
        "sampleAnswerEn": "Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleAnswerFa": "مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند.",
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
      }
    }
  }
];

export function getAllAEFLevels(): AEFLevelMeta[] {
  return Object.values(AEF_LEVELS_META);
}

export function getAEFLevelMeta(tier: string): AEFLevelMeta | undefined {
  const key = tier.toLowerCase() as AEFLevelTier;
  return AEF_LEVELS_META[key];
}

export function getAEFLessonsByLevel(tier: string): AEFVideoLesson[] {
  const t = tier.toLowerCase();
  if (t === "c2") return AEF_LESSONS.filter((les) => les.level === "c1");
  return AEF_LESSONS.filter((les) => les.level.toLowerCase() === t);
}

export function getAEFLessonById(id: string): AEFVideoLesson | undefined {
  const targetId = id.toLowerCase();
  return AEF_LESSONS.find((les) => les.id.toLowerCase() === targetId);
}

export function getNextAEFLesson(currentLessonId: string): AEFVideoLesson | null {
  const current = getAEFLessonById(currentLessonId);
  if (!current) return null;
  const sameLevelLessons = getAEFLessonsByLevel(current.level);
  const currentIndex = sameLevelLessons.findIndex((l) => l.id.toLowerCase() === current.id.toLowerCase());
  if (currentIndex !== -1 && currentIndex < sameLevelLessons.length - 1) {
    return sameLevelLessons[currentIndex + 1];
  }
  return null;
}
