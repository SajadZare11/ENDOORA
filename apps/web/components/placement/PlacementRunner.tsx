"use client";

import { Button } from "@endoora/ui";

import Link from "next/link";
import { useEffect, useState } from "react";
import { endooraApi } from "@/lib/endoora-api";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import LearnerTwinPreview from "@/components/placement/LearnerTwinPreview";
import { AudioWaveformPlayer } from "./AudioWaveformPlayer";
import { AudioRecorder } from "./AudioRecorder";
import { WritingEditor } from "./WritingEditor";
import styles from "@/components/placement/placement.module.css";

type Locale = "fa" | "en";

type SessionAccount = {
  email?: string;
  first_name?: string;
  full_name?: string;
  role?: string;
};

type AuthState =
  | { kind: "checking" }
  | { kind: "anonymous" }
  | { account: SessionAccount; kind: "authenticated" };

interface PlacementQuestionItem {
  id: string;
  section: string;
  question_type: string;
  title_fa?: string;
  title_en?: string;
  prompt_fa?: string;
  prompt_en: string;
  instructions_fa?: string;
  instructions_en?: string;
  cefr_level?: string;
  difficulty?: string;
  passage?: string;
  audio_url?: string;
  play_limit?: number;
  recording_time_limit_sec?: number;
  min_words_expected?: number;
  max_words_expected?: number;
  options: string[];
  question_version_id?: string | null;
}

interface PlacementAnswerRecord {
  idempotency_key: string;
  question_key: string;
  question_version_id?: string | null;
  answer_value: {
    selected_option?: string;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

interface PlacementSessionData {
  id: string;
  status: "active" | "submitted" | "expired";
  current_section: string;
  started_at: string;
  updated_at: string;
  expires_at: string;
  is_expired: boolean;
  is_active: boolean;
  answers_count: number;
  answers: PlacementAnswerRecord[];
}

const DEFAULT_QUESTIONS: PlacementQuestionItem[] = [
  {
    id: "grammar-a1-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با شکل درست فعل کامل کنید.",
    prompt_en: "She ___ to school every day.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["go", "goes", "going", "gone"],
  },
  {
    id: "grammar-a2-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با زمان گذشته مناسب کامل کنید.",
    prompt_en: "Yesterday, they ___ to the national museum.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A2",
    difficulty: "easy",
    options: ["went", "gone", "go", "goes"],
  },
  {
    id: "grammar-b1-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با ساختار زمان مناسب کامل کنید.",
    prompt_en: "I ___ in this city since 2018.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B1",
    difficulty: "medium",
    options: ["live", "have lived", "lived", "was living"],
  },
  {
    id: "grammar-b2-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جمله شرطی را کامل کنید.",
    prompt_en: "If she had prepared earlier, she ___ the challenging examination.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B2",
    difficulty: "hard",
    options: ["passed", "would pass", "would have passed", "will pass"],
  },
  {
    id: "vocabulary-a1-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "کلمه مناسب با تعریف را انتخاب کنید.",
    prompt_en: "A place where you borrow books is a...",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["library", "kitchen", "station", "garden"],
  },
  {
    id: "vocabulary-a2-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "واژه مناسب سفر بین‌المللی را انتخاب کنید.",
    prompt_en: "You need to present a valid ___ when traveling across international borders.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A2",
    difficulty: "easy",
    options: ["passport", "receipt", "menu", "pillow"],
  },
  {
    id: "vocabulary-b1-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "هم‌آیی واژگانی مناسب را انتخاب کنید.",
    prompt_en: "The research team made an extraordinary ___ that accelerated scientific progress.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B1",
    difficulty: "medium",
    options: ["discovery", "destination", "departure", "discount"],
  },
  {
    id: "vocabulary-b2-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "صفت دقیق متناسب با موقعیت را انتخاب کنید.",
    prompt_en: "The instructions were somewhat ___, leaving team members unsure of next steps.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B2",
    difficulty: "hard",
    options: ["ambiguous", "ancient", "abundant", "accurate"],
  },
  {
    id: "reading-a1-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "متن کوتاه را بخوانید و به سوال پاسخ دهید.",
    prompt_en: "Why does Ali study English?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "Ali studies English every evening because he wants to travel the world next summer.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["Travel", "Work", "Cooking", "Sports"],
  },
  {
    id: "reading-a2-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "بر اساس جدول زمانی متن، به سوال پاسخ دهید.",
    prompt_en: "When can visitors use the library on Saturdays?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "The city library is open from 8:00 AM to 6:00 PM on weekdays, and from 9:00 AM to 1:00 PM on Saturdays. It remains closed on Sundays.",
    cefr_level: "A2",
    difficulty: "medium",
    options: ["9:00 AM to 1:00 PM", "8:00 AM to 6:00 PM", "Closed all day", "Until 8:00 PM"],
  },
  {
    id: "reading-b1-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "بر اساس مفهوم متن، پاسخ صحیح را انتخاب کنید.",
    prompt_en: "According to the text, what is a primary social benefit of community gardens?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "Urban community gardens have expanded across many cities in recent years. Beyond providing fresh produce, they foster meaningful neighborhood connections and offer a calming green environment for residents.",
    cefr_level: "B1",
    difficulty: "hard",
    options: ["Strengthening neighborhood connections", "Lowering property taxes", "Eliminating local markets", "Reducing automobile traffic"],
  },
  {
    id: "listening-a1-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "به فایل صوتی کوتاه گوش دهید و هدف گوینده را انتخاب کنید.",
    prompt_en: "What is the speaker announcing?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-a1-001.wav",
    play_limit: 2,
    cefr_level: "A1",
    difficulty: "easy",
    options: ["A train departure delay", "A library book return", "A dinner invitation", "A weather forecast"],
  },
  {
    id: "listening-a2-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "بر اساس فایل صوتی، زمان شروع جلسه را مشخص کنید.",
    prompt_en: "At what time does the meeting start tomorrow morning?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-a2-001.wav",
    play_limit: 2,
    cefr_level: "A2",
    difficulty: "easy",
    options: ["9:30 AM", "10:00 AM", "8:15 AM", "11:45 AM"],
  },
  {
    id: "listening-b1-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "با توجه به توضیحات گوینده، نگرش او نسبت به شیوه کاری ترکیبی چیست؟",
    prompt_en: "How does the speaker feel about the new hybrid work schedule?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-b1-001.wav",
    play_limit: 2,
    cefr_level: "B1",
    difficulty: "medium",
    options: ["Cautiously optimistic about productivity", "Completely opposed to remote work", "Indifferent to team changes", "Confused about daily commuting"],
  },
  {
    id: "listening-b2-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "نکته اصلی مورد تاکید سخنران در این سخنرانی علمی چیست؟",
    prompt_en: "What main point does the speaker emphasize regarding urban biodiversity?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-b2-001.wav",
    play_limit: 2,
    cefr_level: "B2",
    difficulty: "hard",
    options: ["Green corridors significantly mitigate habitat fragmentation", "Urban expansion has negligible ecological effects", "Rooftop gardens cannot support insect populations", "Artificial lighting replaces natural circadian rhythms"],
  },
  {
    id: "speaking-a1-001",
    section: "speaking",
    question_type: "speaking",
    title_fa: "بخش مهارت گفتاری (Speaking)",
    title_en: "Speaking Section",
    prompt_fa: "خود را معرفی کنید. نام خود، محل زندگی و یکی از سرگرمی‌های مورد علاقه‌تان را بیان نمایید.",
    prompt_en: "Introduce yourself. Mention your name, where you live, and one hobby you enjoy.",
    instructions_fa: "دکمه ضبط صدا را فشار دهید و حداقل ۱۰ کلمه صحبت کنید. در صورت نیاز، می‌توانید پاسخ خود را تایپ نمایید.",
    instructions_en: "Press the record button and speak at least 10 words. Alternatively, type your response if your microphone is unavailable.",
    cefr_level: "A1",
    difficulty: "easy",
    recording_time_limit_sec: 60,
    min_words_expected: 10,
    options: [],
  },
  {
    id: "speaking-a2-001",
    section: "speaking",
    question_type: "speaking",
    title_fa: "بخش مهارت گفتاری (Speaking)",
    title_en: "Speaking Section",
    prompt_fa: "یک صبح معمول در آخر هفته خود را توصیف کنید. چه ساعتی بیدار می‌شوید و معمولاً چه کارهایی انجام می‌دهید؟",
    prompt_en: "Describe your typical weekend morning. What time do you wake up and what activities do you usually do?",
    instructions_fa: "دکمه ضبط را فشار دهید و در حدود ۲۰ تا ۴۰ ثانیه (حداقل ۱۵ کلمه) به انگلیسی صحبت کنید.",
    instructions_en: "Press record and describe your routine in 20 to 40 seconds (at least 15 words).",
    cefr_level: "A2",
    difficulty: "easy",
    recording_time_limit_sec: 60,
    min_words_expected: 15,
    options: [],
  },
  {
    id: "speaking-b1-001",
    section: "speaking",
    question_type: "speaking",
    title_fa: "بخش مهارت گفتاری (Speaking)",
    title_en: "Speaking Section",
    prompt_fa: "درباره یک سفر به‌یادماندنی در گذشته صحبت کنید. به کجا رفتید، با چه کسی بودید و چرا این سفر خاص بود؟",
    prompt_en: "Talk about a memorable trip or journey you took in the past. Where did you go, who were you with, and why was it special?",
    instructions_fa: "دکمه ضبط را فشار دهید و به مدت ۳۰ تا ۶۰ ثانیه (حداقل ۲۵ کلمه) درباره تجربه سفر خود صحبت نمایید.",
    instructions_en: "Speak for 30 to 60 seconds (at least 25 words) about your travel experience using narrative tenses.",
    cefr_level: "B1",
    difficulty: "medium",
    recording_time_limit_sec: 90,
    min_words_expected: 25,
    options: [],
  },
  {
    id: "speaking-b2-001",
    section: "speaking",
    question_type: "speaking",
    title_fa: "بخش مهارت گفتاری (Speaking)",
    title_en: "Speaking Section",
    prompt_fa: "برخی کار از راه دور در منزل را ترجیح می‌دهند، در حالی که برخی دیگر معتقدند کار در دفتر کار بهره‌ورتر است. از کدام دیدگاه حمایت می‌کنید و دلایل اصلی شما چیست؟",
    prompt_en: "Some people prefer remote working from home, while others believe working in an office is more productive. Which viewpoint do you support, and what are the main reasons for your perspective?",
    instructions_fa: "دیدگاه خود را با ارائه دلایل و مثال‌های منسجم در ۴۵ تا ۶۰ ثانیه (حداقل ۴۰ کلمه) بیان نمایید.",
    instructions_en: "Express your reasoned viewpoint with supporting arguments in 45 to 60 seconds (at least 40 words).",
    cefr_level: "B2",
    difficulty: "hard",
    recording_time_limit_sec: 90,
    min_words_expected: 40,
    options: [],
  },
  {
    id: "writing-a1-001",
    section: "writing",
    question_type: "writing",
    title_fa: "بخش مهارت نگارش (Writing)",
    title_en: "Writing Section",
    prompt_fa: "یک یادداشت کوتاه برای معرفی خود بنویسید. نام، شهر یا کشور، و سرگرمی مورد علاقه خود را بیان کنید.",
    prompt_en: "Write a short note introducing yourself. State your name, your city or country, and what you like to do in your free time.",
    instructions_fa: "پاسخ خود را به انگلیسی در کادر متنی بنویسید (حداقل ۱۵ کلمه).",
    instructions_en: "Write your response in English in the editor (at least 15 words).",
    cefr_level: "A1",
    difficulty: "easy",
    min_words_expected: 15,
    max_words_expected: 60,
    options: [],
  },
  {
    id: "writing-a2-001",
    section: "writing",
    question_type: "writing",
    title_fa: "بخش مهارت نگارش (Writing)",
    title_en: "Writing Section",
    prompt_fa: "یک ایمیل کوتاه به یکی از دوستانتان بنویسید و او را برای آخر این هفته دعوت کنید. روز، ساعت و برنامه‌ها یا غذایی که در نظر دارید را بنویسید.",
    prompt_en: "Write a short email to invite a friend to your home this weekend. Mention the day, the time, and what activities or food you have planned.",
    instructions_fa: "متن دعوت خود را به انگلیسی بنویسید (حداقل ۲۵ کلمه).",
    instructions_en: "Write your invitation email in English (at least 25 words).",
    cefr_level: "A2",
    difficulty: "easy",
    min_words_expected: 25,
    max_words_expected: 90,
    options: [],
  },
  {
    id: "writing-b1-001",
    section: "writing",
    question_type: "writing",
    title_fa: "بخش مهارت نگارش (Writing)",
    title_en: "Writing Section",
    prompt_fa: "یک نقد یا مرور کوتاه درباره مکانی به‌یادماندنی که اخیراً دیده‌اید بنویسید. ویژگی‌های خاص آن و علت توصیه به دیگران را شرح دهید.",
    prompt_en: "Write a short review of a memorable place you visited recently (such as a park, café, or city). Describe what made it special and why you would recommend it to others.",
    instructions_fa: "متن مرور خود را با استفاده از افعال توصیفی و کلمات ربط بنویسید (حداقل ۴۵ کلمه).",
    instructions_en: "Write a descriptive review using transitional connectors and personal evaluation (at least 45 words).",
    cefr_level: "B1",
    difficulty: "medium",
    min_words_expected: 45,
    max_words_expected: 140,
    options: [],
  },
  {
    id: "writing-b2-001",
    section: "writing",
    question_type: "writing",
    title_fa: "بخش مهارت نگارش (Writing)",
    title_en: "Writing Section",
    prompt_fa: "آیا مدارس امروزی باید کتاب‌های چاپی را کاملاً با تبلت و کتاب‌های الکترونیکی جایگزین کنند؟ یک پاراگراف تحلیلی بنویسید که هر دو جنبه را بررسی کرده و نتیجه‌گیری کند.",
    prompt_en: "Should modern schools replace physical printed textbooks entirely with digital tablets and e-books? Write a structured opinion paragraph weighing both sides and stating your clear conclusion.",
    instructions_fa: "دیدگاه مستدل خود را با مقایسه مزایا و معایب در یک ساختار منسجم بنویسید (حداقل ۷۵ کلمه).",
    instructions_en: "Write a structured argumentative text evaluating advantages and disadvantages with clear logical links (at least 75 words).",
    cefr_level: "B2",
    difficulty: "hard",
    min_words_expected: 75,
    max_words_expected: 200,
    options: [],
  },
];

const t = {
  fa: {
    heroTag: "موتور هوشمند تعیین سطح ایندورا",
    heroTitle: "شناخت دقیق نقطه شروع یادگیری",
    heroDesc: "این آزمون چندمرحله‌ای (دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری و نگارش) به صورت زنده ذخیره می‌شود و با هر قطعی اینترنت، پاسخ‌های تأییدشده شما حفظ خواهند شد.",
    questionCounter: "سوال",
    of: "از",
    section: "بخش",
    grammar: "دستور زبان",
    vocabulary: "واژگان",
    reading: "درک مطلب",
    listening: "شنیداری",
    speaking: "گفتاری",
    writing: "نگارش",
    next: "سوال بعدی",
    prev: "سوال قبلی",
    submit: "ثبت نهایی آزمون",
    submitting: "در حال ثبت نهایی...",
    savedStatus: "پاسخ‌ها به صورت خودکار با مهر زمانی سرور ذخیره می‌شوند.",
    savedStatusShort: "ذخیره خودکار زنده",
    offlineWarning: "اتصال اینترنت قطع است. آخرین پاسخ تأییدشده حفظ می‌شود؛ نگران از دست رفتن اطلاعات نباشید.",
    expiredAlert: "نشست آزمون شما منقضی شده است. برای حفظ اعتبار آموزشی، لطفا یک نشست جدید شروع کنید.",
    startNewSession: "شروع نشست جدید",
    completedTitle: "آزمون تعیین سطح با موفقیت ثبت شد!",
    completedDesc: "پاسخ‌های شما بررسی شده و شواهد یادگیری برای بخش‌های گرامر، واژگان، درک مطلب، شنیداری، گفتاری و نگارش ثبت گردیدند. اکنون می‌توانید کارنامه مهارتی خود را مشاهده کنید.",
    viewReport: "مشاهده کارنامه مهارتی",
    goToDashboard: "ورود به داشبورد زبان‌آموز",
    authNotice: "برای اتصال این پاسخ‌ها به پروفایل آموزشی خود، در سامانه وارد شده‌اید.",
    pretestKicker: "آزمون جامع تعیین سطح ۶ مهارته ایندورا",
    pretestTitle: "سنجش هوشمند و استاندارد سطح زبان انگلیسی",
    pretestDesc: "این ارزیابی شامل ۲۴ پرسش انطباقی در ۶ مهارت تخصصی است. با تکمیل آزمون، دوقلوی یادگیری شما کالیبره شده و نقشه راه اختصاصی‌تان در داشبورد شکل می‌گیرد.",
    skillsHeader: "مهارت‌های ۶ گانه مورد سنجش در این آزمون",
    skill1: "دستور زبان (Grammar) · ۴ سوال",
    skill2: "واژگان (Vocabulary) · ۴ سوال",
    skill3: "درک مطلب (Reading) · ۴ سوال",
    skill4: "شنیداری (Listening) · ۴ سوال صوتی",
    skill5: "گفتاری (Speaking) · ۴ سوال ضبط صدا",
    skill6: "نگارش (Writing) · ۴ سوال ویرایش متن",
    authChecking: "در حال بررسی وضعیت حساب کاربری...",
    authedNoticeTitle: "حساب کاربری متصل است",
    authedNoticeDesc: "پاسخ‌های شما با مهر زمانی سرور در پروفایلتان ذخیره می‌شوند و کارنامه نهایی به داشبورد شما اضافه خواهد شد.",
    startTestBtn: "شروع آزمون تعیین سطح (۲۴ سوال)",
    unauthedTitle: "برای ذخیره نتایج آزمون در پروفایل، ابتدا وارد شوید یا ثبت‌نام کنید",
    unauthedDesc: "این آزمون ۲۴ سوالی هر ۶ مهارت زبانی را می‌سنجد. برای اینکه پاسخ‌ها، سطح دقیق CEFR و نقشه راه اختصاصی شما در پروفایل ذخیره بماند، پیشنهاد می‌کنیم وارد حساب خود شوید.",
    signInBtn: "ورود به حساب کاربری",
    registerBtn: "ثبت‌نام سریع و رایگان",
    guestBtn: "ادامه به عنوان مهمان (بدون ذخیره در پروفایل)",
    guestPillNotice: "حالت آزمایشی (مهمان): نتایج در پروفایل ذخیره نمی‌شوند.",
    guestPillAction: "ورود یا ثبت‌نام برای ذخیره‌سازی",
    unauthedSubmittedDesc: "آزمون ۲۴ سوالی با موفقیت تکمیل شد! برای ذخیره دائمی این کارنامه در پروفایل و دریافت برنامه یادگیری شخصی، ثبت‌نام کنید یا وارد شوید.",
    registerSaveBtn: "ثبت‌نام و ذخیره کارنامه در پروفایل",
  },
  en: {
    heroTag: "Endoora Adaptive Placement Engine",
    heroTitle: "Discover Your True Starting Point",
    heroDesc: "This multi-stage test (Grammar, Vocabulary, Reading, Listening, Speaking, and Writing) is saved live to the server. Your confirmed answers remain safe even if your connection drops.",
    questionCounter: "Question",
    of: "of",
    section: "Section",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    listening: "Listening",
    speaking: "Speaking",
    writing: "Writing",
    next: "Next question",
    prev: "Previous question",
    submit: "Submit test",
    submitting: "Submitting...",
    savedStatus: "Answers are saved automatically with server timestamps.",
    savedStatusShort: "Live Autosave",
    offlineWarning: "You are currently offline. Your last confirmed answers are preserved.",
    expiredAlert: "Your placement session has expired. Please start a new session to ensure accurate evaluation.",
    startNewSession: "Start new session",
    completedTitle: "Placement test submitted successfully!",
    completedDesc: "Your answers have been securely evaluated for Grammar, Vocabulary, Reading, Listening, Speaking, and Writing. You can now inspect your skill report.",
    viewReport: "View skill report",
    goToDashboard: "Go to learner dashboard",
    authNotice: "You are signed in and your answers are linked to your learning profile.",
    pretestKicker: "Endoora 6-Skill Comprehensive Placement Test",
    pretestTitle: "Adaptive Diagnostic Assessment (CEFR Aligned)",
    pretestDesc: "This assessment contains 24 questions across 6 core skills. Your answers will generate your verified analytical report and calibrate your Learner Twin.",
    skillsHeader: "Evaluated Competencies",
    skill1: "Grammar · 4 items",
    skill2: "Vocabulary · 4 items",
    skill3: "Reading · 4 items",
    skill4: "Listening · 4 audio items",
    skill5: "Speaking · 4 voice recording items",
    skill6: "Writing · 4 written items",
    authChecking: "Checking account status...",
    authedNoticeTitle: "Learner Account Connected",
    authedNoticeDesc: "Your responses are securely autosaved to your profile, and your comprehensive diagnostic report will be accessible in your dashboard.",
    startTestBtn: "Start Placement Test (24 questions)",
    unauthedTitle: "Sign in or register to save your results to your profile",
    unauthedDesc: "This comprehensive test evaluates all 6 skills. To save your results and personalized roadmap in your profile, please sign in or create an account.",
    signInBtn: "Sign in to account",
    registerBtn: "Create free account",
    guestBtn: "Continue as guest (without saving)",
    guestPillNotice: "Guest mode: results are not saved to a profile.",
    guestPillAction: "Sign in / Register to save",
    unauthedSubmittedDesc: "All 24 questions completed! To permanently save this diagnostic report to your profile and launch your adaptive curriculum, create an account or sign in.",
    registerSaveBtn: "Register & save report to profile",
  },
};

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "idem-" + Math.random().toString(36).substring(2, 15);
}

export function PlacementRunner({ initialLocale = "fa" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [questions, setQuestions] = useState<PlacementQuestionItem[]>(DEFAULT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [session, setSession] = useState<PlacementSessionData | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ kind: "checking" });
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const copy = t[locale];
  const question = questions[currentIndex] || DEFAULT_QUESTIONS[0];
  const selectedOption = answers[question.id] || "";

  // Initialize or resume placement session
  useEffect(() => {
    let isMounted = true;

    // 0. Verify learner authentication
    endooraApi<SessionAccount>("/auth/me/")
      .then((account) => {
        if (isMounted) setAuthState({ account, kind: "authenticated" });
      })
      .catch(() => {
        if (isMounted) setAuthState({ kind: "anonymous" });
      });

    // Check query params for immediate start or guest mode
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("start") === "1" || sp.get("guest") === "1" || sp.get("guest") === "true") {
        setHasStarted(true);
      }
    }

    async function initSession() {
      try {
        // 1. Try to fetch or create active session
        const res = await fetch("/api/placement/sessions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const sessionData: PlacementSessionData = await res.json();
          if (!isMounted) return;
          setSession(sessionData);

          if (sessionData.status === "submitted") {
            setIsSubmitted(true);
          } else if (sessionData.is_expired || sessionData.status === "expired") {
            setIsExpired(true);
          }

          // Restore existing saved answers
          if (sessionData.answers && Array.isArray(sessionData.answers) && sessionData.answers.length > 0) {
            const restored: Record<string, string> = {};
            sessionData.answers.forEach((ans) => {
              if (ans.answer_value?.selected_option) {
                restored[ans.question_key] = String(ans.answer_value.selected_option);
              }
            });
            setAnswers((prev) => ({ ...restored, ...prev }));
            setHasStarted(true);
          }
        }
      } catch {
        // Fallback for offline or local preview
      }

      // 2. Fetch server-sanitized questions if available
      try {
        const qRes = await fetch("/api/placement/questions/");
        if (qRes.ok) {
          const fetchedItems: PlacementQuestionItem[] = await qRes.json();
          if (isMounted && fetchedItems.length > 0) {
            setQuestions(fetchedItems);
          }
        }
      } catch {
        // Keep default questions
      }
    }

    initSession();

    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save an answer idempotently
  async function handleSelectOption(option: string) {
    if (isSubmitted || isExpired) return;

    setAnswers((prev) => ({ ...prev, [question.id]: option }));

    if (!session || !session.id) return;

    try {
      const idempotencyKey = generateIdempotencyKey();
      const res = await fetch(`/api/placement/sessions/${session.id}/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          question_key: question.id,
          question_version_id: question.question_version_id || null,
          answer_value: { selected_option: option },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired" || errData.code === "session_inactive") {
          setIsExpired(true);
        }
      }
    } catch {
      // Offline network catch
      setIsOffline(true);
    }
  }

  // Save a speaking answer idempotently
  async function handleSaveSpokenAnswer(spokenText: string) {
    if (isSubmitted || isExpired) return;

    setAnswers((prev) => ({ ...prev, [question.id]: spokenText }));

    if (!session || !session.id) return;

    try {
      const idempotencyKey = generateIdempotencyKey();
      const res = await fetch(`/api/placement/sessions/${session.id}/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          question_key: question.id,
          question_version_id: question.question_version_id || null,
          answer_value: { spoken_text: spokenText },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired" || errData.code === "session_inactive") {
          setIsExpired(true);
        }
      }
    } catch {
      setIsOffline(true);
    }
  }

  // Save a writing answer idempotently
  async function handleSaveWrittenAnswer(writtenText: string) {
    if (isSubmitted || isExpired) return;

    setAnswers((prev) => ({ ...prev, [question.id]: writtenText }));

    if (!session || !session.id) return;

    try {
      const idempotencyKey = generateIdempotencyKey();
      const res = await fetch(`/api/placement/sessions/${session.id}/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          question_key: question.id,
          question_version_id: question.question_version_id || null,
          answer_value: { written_text: writtenText },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired" || errData.code === "session_inactive") {
          setIsExpired(true);
        }
      }
    } catch {
      setIsOffline(true);
    }
  }

  // Next Question
  async function handleNext() {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const nextQuestion = questions[nextIndex];
      if (session && nextQuestion && nextQuestion.section !== question.section) {
        try {
          await fetch(`/api/placement/sessions/${session.id}/advance/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: nextQuestion.section }),
          });
        } catch {
          // Non-blocking
        }
      }
    }
  }

  // Previous Question
  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // Final Submission
  async function handleSubmit() {
    if (!session || !session.id) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/placement/sessions/${session.id}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired") {
          setIsExpired(true);
        } else {
          setIsSubmitted(true);
        }
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Restart session if expired
  async function handleRestartSession() {
    setIsExpired(false);
    setIsSubmitted(false);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const res = await fetch("/api/placement/sessions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data: PlacementSessionData = await res.json();
        setSession(data);
      }
    } catch {
      // Handled
    }
  }

  return (
    <EndooraBackground>
      <div className={styles.container} dir={locale === "fa" ? "rtl" : "ltr"}>
        {/* Status Alerts */}
        {isOffline && <div className={`${styles.alert} ${styles.alertWarning}`}>{copy.offlineWarning}</div>}

        {isExpired && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <p>{copy.expiredAlert}</p>
            <Button type="button" className={styles.btnPrimary} onClick={handleRestartSession} style={{ marginTop: "1rem" }}>
              {copy.startNewSession}
            </Button>
          </div>
        )}

        {/* Pre-Test Overview & Auth Gate */}
        {!hasStarted && !isSubmitted && !isExpired && (
          <GlassCard>
            <div className={styles.hero}>
              <p className={styles.heroTag}>{copy.pretestKicker}</p>
              <h1>{copy.pretestTitle}</h1>
              <p>{copy.pretestDesc}</p>
            </div>

            <div className={styles.skillsOverview}>
              <h2 className={styles.skillsOverviewTitle}>{copy.skillsHeader}</h2>
              <div className={styles.skillsGrid}>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۱</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "دستور زبان" : "Grammar"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill1}</span>
                </div>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۲</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "واژگان" : "Vocabulary"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill2}</span>
                </div>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۳</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "درک مطلب" : "Reading"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill3}</span>
                </div>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۴</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "شنیداری" : "Listening"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill4}</span>
                </div>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۵</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "گفتاری" : "Speaking"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill5}</span>
                </div>
                <div className={styles.skillCard}>
                  <span className={styles.skillCardNumber}>۰۶</span>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "نگارش" : "Writing"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill6}</span>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            {authState.kind === "checking" ? (
              <div className={styles.authGateBox} aria-busy="true">
                <p className={styles.authGateCheckingText}>{copy.authChecking}</p>
              </div>
            ) : authState.kind === "authenticated" ? (
              <div className={`${styles.authGateBox} ${styles.authGateBoxAuthed}`}>
                <div className={styles.authGateHeader}>
                  <span className={styles.authGateBadgeAuthed}>
                    <span aria-hidden="true">✓</span>
                    {copy.authedNoticeTitle}
                  </span>
                  <span className={styles.authGateUserTag}>
                    {authState.account.first_name || authState.account.email || (locale === "fa" ? "زبان‌آموز گرامی" : "Learner")}
                  </span>
                </div>
                <h3 className={styles.authGateTitle}>{copy.authedNoticeTitle}</h3>
                <p className={styles.authGateDesc}>{copy.authedNoticeDesc}</p>
                <div className={styles.authGateActions}>
                  <Button type="button" className={styles.btnPrimary} onClick={() => setHasStarted(true)}>
                    {copy.startTestBtn}
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`${styles.authGateBox} ${styles.authGateBoxPrompt}`}>
                <div className={styles.authGateHeader}>
                  <span className={styles.authGateBadgePrompt}>
                    <span aria-hidden="true">🔒</span>
                    {locale === "fa" ? "ذخیره‌سازی در پروفایل" : "Save to Profile"}
                  </span>
                </div>
                <h3 className={styles.authGateTitle}>{copy.unauthedTitle}</h3>
                <p className={styles.authGateDesc}>{copy.unauthedDesc}</p>
                <div className={styles.authGateActions}>
                  <Link href="/auth/login?next=/placement/demo?start=1" className={styles.btnPrimary}>
                    {copy.signInBtn}
                  </Link>
                  <Link href="/auth/register?next=/placement/demo?start=1" className={styles.btnPrimaryAlt}>
                    {copy.registerBtn}
                  </Link>
                  <Button type="button" className={styles.btnGhost} onClick={() => setHasStarted(true)}>
                    {copy.guestBtn}
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        )}

        {/* Submission Complete View */}
        {isSubmitted ? (
          <div className={styles.emptyState}>
            <h2>{copy.completedTitle}</h2>
            <p style={{ marginBlock: "1.5rem", maxWidth: "36rem", marginInline: "auto" }}>
              {authState.kind === "anonymous" ? copy.unauthedSubmittedDesc : copy.completedDesc}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {authState.kind === "anonymous" ? (
                <>
                  <Link href="/auth/register?next=/placement/report" className={styles.btnPrimary}>
                    {copy.registerSaveBtn}
                  </Link>
                  <Link href="/auth/login?next=/placement/report" className={styles.btnSecondary}>
                    {copy.signInBtn}
                  </Link>
                  <Link href="/placement/report" className={styles.btnGhost}>
                    {copy.viewReport}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/placement/report" className={styles.btnPrimary}>
                    {copy.viewReport}
                  </Link>
                  <Link href="/dashboard" className={styles.btnSecondary}>
                    {copy.goToDashboard}
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : hasStarted && !isExpired ? (
          <>
              {/* Hero Banner */}
              <GlassCard>
                <div className={styles.hero}>
                  <p className={styles.heroTag}>{copy.heroTag}</p>
                  <h1>{copy.heroTitle}</h1>
                  <p>{copy.heroDesc}</p>
                </div>
              </GlassCard>

              {/* If guest mode, show unobtrusive alert */}
              {authState.kind === "anonymous" && (
                <div className={styles.guestNoticePill}>
                  <span>{copy.guestPillNotice}</span>
                  <Link href="/auth/register?next=/placement/demo?start=1" className={styles.guestNoticeLink}>
                    {copy.guestPillAction}
                  </Link>
                </div>
              )}

              <div className={styles.grid}>
              {/* Question Card */}
              <div className={styles.questionCard}>
                {/* Multi-stage Section Tabs */}
                <div className={styles.sectionNav} role="tablist" aria-label={locale === "fa" ? "مراحل آزمون" : "Test sections"}>
                  <div className={`${styles.sectionPill} ${question.section === "grammar" ? styles.sectionPillActive : styles.sectionPillDone}`}>
                    {locale === "fa" ? "۱. دستور زبان" : "1. Grammar"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "vocabulary" ? styles.sectionPillActive : (["reading", "listening", "speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۲. واژگان" : "2. Vocabulary"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "reading" ? styles.sectionPillActive : (["listening", "speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۳. درک مطلب" : "3. Reading"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "listening" ? styles.sectionPillActive : (["speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۴. شنیداری" : "4. Listening"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "speaking" ? styles.sectionPillActive : (question.section === "writing" ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۵. گفتاری" : "5. Speaking"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "writing" ? styles.sectionPillActive : ""}`}>
                    {locale === "fa" ? "۶. نگارش" : "6. Writing"}
                  </div>
                  <div className={styles.autosaveBadge}>
                    <span className={styles.autosaveDot} />
                    {copy.savedStatusShort}
                  </div>
                </div>

                <div className={styles.counter}>
                  <span>
                    {copy.questionCounter} {currentIndex + 1} {copy.of} {questions.length}
                  </span>
                  <span className={styles.sectionBadge}>
                    {locale === "fa" ? (question.title_fa || question.section) : (question.title_en || question.section)}
                  </span>
                </div>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {question.prompt_fa && (
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-2)" }}>
                    {question.prompt_fa}
                  </p>
                )}

                {question.audio_url && (
                  <AudioWaveformPlayer
                    key={question.id}
                    src={question.audio_url}
                    playLimit={question.play_limit || 2}
                    title_fa={question.title_fa || "فایل صوتی سوال"}
                    title_en={question.title_en || "Question Audio"}
                    locale={locale}
                  />
                )}

                {question.passage && (
                  <div className={styles.passage} dir="ltr">
                    {question.passage}
                  </div>
                )}

                <div className={styles.englishPrompt} dir="ltr">
                  {question.prompt_en}
                </div>

                {question.section === "speaking" ? (
                  <AudioRecorder
                    key={question.id}
                    timeLimitSec={question.recording_time_limit_sec || 60}
                    minWordsExpected={question.min_words_expected || 10}
                    locale={locale}
                    initialSpokenText={answers[question.id] || ""}
                    onConfirmAnswer={(payload) => {
                      if (payload.spoken_text) {
                        handleSaveSpokenAnswer(payload.spoken_text);
                      }
                    }}
                  />
                ) : question.section === "writing" ? (
                  <WritingEditor
                    key={question.id}
                    minWordsExpected={question.min_words_expected || 15}
                    maxWordsExpected={question.max_words_expected || 100}
                    locale={locale}
                    initialText={answers[question.id] || ""}
                    onConfirmAnswer={(payload) => {
                      if (payload.written_text) {
                        handleSaveWrittenAnswer(payload.written_text);
                      }
                    }}
                    onChangeText={(newText) => {
                      setAnswers((prev) => ({ ...prev, [question.id]: newText }));
                    }}
                  />
                ) : (
                  <div className={styles.options}>
                    {question.options.map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        dir="ltr"
                        className={`${styles.option} ${selectedOption === opt ? styles.optionActive : ""}`}
                        onClick={() => handleSelectOption(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}

                <div className={styles.navRow}>
                  <Button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    {copy.prev}
                  </Button>

                  {currentIndex < questions.length - 1 ? (
                    <Button type="button" className={styles.btnPrimary} onClick={handleNext}>
                      {copy.next}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? copy.submitting : copy.submit}
                    </Button>
                  )}
                </div>
              </div>

              {/* Sidebar Preview */}
              <LearnerTwinPreview />
            </div>
          </>
        ) : null}
      </div>
    </EndooraBackground>
  );
}
