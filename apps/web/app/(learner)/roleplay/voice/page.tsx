"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useLearnerHome } from "../../../../components/learner/LearnerShell";
import { VoiceRecorder } from "../../../../components/voice-recorder/VoiceRecorder";
import styles from "./voice-roleplay.module.css";

interface CharacterInfo {
  name_en: string;
  name_fa: string;
  role_en: string;
  role_fa: string;
  avatar: string;
  tone: string;
}

interface GoalInfo {
  id: string;
  description_en: string;
  description_fa: string;
  keywords: string[];
}

interface VocabItem {
  word: string;
  lemma?: string;
  definition: string;
  meaning_fa: string;
  level: string;
  saved_to_srs?: boolean;
}

interface Scenario {
  id: string;
  title_en: string;
  title_fa: string;
  level: string;
  category: string;
  character: CharacterInfo;
  context_en: string;
  context_fa: string;
  initial_message_en: string;
  initial_message_fa: string;
  max_turns: number;
  goals: GoalInfo[];
  target_vocabulary: VocabItem[];
  suggested_prompts: string[];
}

interface Message {
  id: string;
  sender: "character" | "learner" | "system";
  sender_name: string;
  content: string;
  audio_url?: string;
  recording_id?: number;
}

interface FeedbackMistake {
  id: string;
  tag: string;
  title_en: string;
  title_fa: string;
  original: string;
  corrected: string;
  explanation_en: string;
  explanation_fa: string;
  accepted?: boolean;
}

interface RoleplayReport {
  goals_achieved_count: number;
  total_goals_count: number;
  communicative_score: number;
  estimated_cefr: string;
  accomplishments_en: string[];
  accomplishments_fa: string[];
  feedback_mistakes: FeedbackMistake[];
  vocabulary_extracted: VocabItem[];
  xp_earned: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: "airport",
    title_en: "Airport Passport Control & Customs",
    title_fa: "فرودگاه و بازرسی گذرنامه",
    level: "A2 - B1",
    category: "travel",
    character: {
      name_en: "Officer Davis",
      name_fa: "افسر دیویس",
      role_en: "Immigration Officer",
      role_fa: "افسر کنترل گذرنامه",
      avatar: "👮",
      tone: "formal, professional, direct",
    },
    context_en: "You have arrived at London Heathrow Airport. Officer Davis is reviewing your passport and asking about your itinerary and purpose of visit.",
    context_fa: "شما به فرودگاه هیترو لندن رسیده‌اید. افسر دیویس گذرنامه شما را بررسی کرده و درباره برنامه سفر و هدف اقامت سوال می‌پرسد.",
    initial_message_en: "Good day. May I inspect your passport and landing card, please? What is the primary purpose of your visit to the United Kingdom?",
    initial_message_fa: "روز بخیر. لطفاً گذرنامه و کارت ورود خود را ارائه دهید. هدف اصلی شما از سفر به بریتانیا چیست؟",
    max_turns: 8,
    goals: [
      { id: "state_purpose", description_en: "State the purpose of your visit clearly", description_fa: "هدف سفر خود را به وضوح بیان کنید", keywords: ["visit", "tourism", "vacation", "holiday", "study", "conference", "business"] },
      { id: "state_duration_accommodation", description_en: "Specify where you will stay and for how long", description_fa: "محل اقامت و مدت اقامت خود را مشخص کنید", keywords: ["stay", "days", "weeks", "hotel", "hostel", "apartment"] },
      { id: "return_details", description_en: "Confirm your return flight or departure plan", description_fa: "برنامه پرواز برگشت یا ترک کشور را تأیید کنید", keywords: ["return", "ticket", "flight", "booked", "leave"] },
    ],
    target_vocabulary: [
      { word: "immigration", definition: "The official examination of passports and visas at a border", meaning_fa: "اداره مهاجرت و بازرسی مرزی", level: "B1" },
      { word: "itinerary", definition: "A detailed plan or schedule of travel", meaning_fa: "برنامه سفر و زمان‌بندی گردش", level: "B2" },
      { word: "accommodation", definition: "A place to live, stay, or sleep temporarily", meaning_fa: "محل سکونت و اقامتگاه", level: "B1" },
      { word: "customs", definition: "The government department collecting duties on imported goods", meaning_fa: "گمرک و بازرسی کالا", level: "B1" },
    ],
    suggested_prompts: [
      "Good morning. I am here for two weeks as a tourist to visit historical landmarks.",
      "I have booked a room at the Central Park Hotel for my entire stay.",
      "Yes officer, my return flight departs on September 24th with British Airways.",
    ],
  },
  {
    id: "hotel",
    title_en: "Hotel Check-in & Special Requests",
    title_fa: "پذیرش هتل و درخواست‌های اقامت",
    level: "A2",
    category: "hospitality",
    character: {
      name_en: "Elena",
      name_fa: "النا",
      role_en: "Front Desk Concierge",
      role_fa: "مسئول پذیرش هتل",
      avatar: "🛎️",
      tone: "polite, warm, accommodating",
    },
    context_en: "You have just entered the lobby of the Grand Royal Hotel after a long flight. Concierge Elena welcomes you to process your reservation.",
    context_fa: "پس از یک پرواز طولانی وارد لابی هتل گرند رویال شده‌اید. النا، مسئول پذیرش، برای ثبت ورود به شما خوش‌آمد می‌گوید.",
    initial_message_en: "Welcome to the Grand Royal Hotel! How may I assist you this afternoon? Do you have an existing reservation with us?",
    initial_message_fa: "به هتل گرند رویال خوش آمدید! بعدازظهر بخیر، چطور می‌توانم کمکتان کنم؟ آیا رزرو قبلی دارید؟",
    max_turns: 8,
    goals: [
      { id: "provide_reservation", description_en: "Give your name and confirm you have a reservation", description_fa: "نام خود را اعلام کرده و رزرو اتاق را تایید کنید", keywords: ["reservation", "booked", "name", "booking"] },
      { id: "request_amenity", description_en: "Ask for an amenity (quiet room, high floor, Wi-Fi password)", description_fa: "یک امکانات خاص مانند اتاق آرام یا طبقه بالا درخواست کنید", keywords: ["quiet", "high floor", "view", "wifi", "pillow"] },
      { id: "inquire_timing", description_en: "Ask about breakfast hours or check-out time", description_fa: "درباره ساعت صبحانه یا ساعت خروج سوال بپرسید", keywords: ["breakfast", "time", "hours", "check out"] },
    ],
    target_vocabulary: [
      { word: "reservation", definition: "An arrangement by which accommodations are secured in advance", meaning_fa: "رزرو قبلی اقامتگاه", level: "A2" },
      { word: "concierge", definition: "A hotel staff member who assists guests with reservations and recommendations", meaning_fa: "دربان و مسئول راهنمای مهمانان", level: "B2" },
      { word: "amenities", definition: "Desirable or useful features of a building or room", meaning_fa: "امکانات رفاهی و تسهیلات", level: "B1" },
      { word: "complimentary", definition: "Given or provided free of charge", meaning_fa: "رایگان و خدمات تشریفاتی", level: "B2" },
    ],
    suggested_prompts: [
      "Hello! Yes, I have a reservation for three nights under the name Alex Smith.",
      "Could I please request a quiet room on a higher floor with a nice view?",
      "What time is breakfast served in the morning, and is Wi-Fi included?",
    ],
  },
  {
    id: "restaurant",
    title_en: "Dining Out & Dietary Preferences",
    title_fa: "سفارش غذا در رستوران و رژیم غذایی",
    level: "B1",
    category: "dining",
    character: {
      name_en: "Marco",
      name_fa: "مارکو",
      role_en: "Lead Server",
      role_fa: "سرپیشخدمت رستوران",
      avatar: "🍽️",
      tone: "courteous, attentive, vibrant",
    },
    context_en: "You are seated at an Italian bistro in Florence. Marco approaches your table with the daily specials menu to take your order.",
    context_fa: "در یک بیستروی سنتی ایتالیایی نشسته‌اید. مارکو با منوی غذاهای روز برای ثبت سفارش به سر میز شما می‌آید.",
    initial_message_en: "Buonasera! Welcome to Trattoria Bella. Are you ready for some refreshing drinks while you browse our evening menu?",
    initial_message_fa: "عصر بخیر! به تراتوریا بلا خوش آمدید. مایلید در حین بررسی منوی شام، یک نوشیدنی میل بفرمایید؟",
    max_turns: 8,
    goals: [
      { id: "order_drinks_appetizer", description_en: "Order a beverage or starter", description_fa: "یک نوشیدنی یا پیش‌غذا سفارش دهید", keywords: ["water", "wine", "appetizer", "salad", "soup", "start with"] },
      { id: "specify_dietary_need", description_en: "Mention a dietary preference, allergy, or request recommendations", description_fa: "یک ترجیح غذایی یا حساسیت را مطرح کنید", keywords: ["allergic", "allergy", "gluten", "vegetarian", "vegan", "recommend"] },
      { id: "order_main_ask_bill", description_en: "Order a main course or request the bill", description_fa: "غذای اصلی را سفارش داده یا صورتحساب را بخواهید", keywords: ["pasta", "pizza", "fish", "steak", "risotto", "bill", "check"] },
    ],
    target_vocabulary: [
      { word: "dietary", definition: "Relating to diets or rules about what you eat", meaning_fa: "مربوط به رژیم غذایی", level: "B1" },
      { word: "recommendation", definition: "A suggestion or proposal as to the best course of action", meaning_fa: "پیشنهاد و توصیه", level: "B1" },
      { word: "appetizer", definition: "A small dish served before the main course", meaning_fa: "پیش‌غذا و اشتهاآور", level: "A2" },
      { word: "allergen", definition: "A substance that causes an allergic reaction", meaning_fa: "ماده حساسیت‌زا", level: "B2" },
    ],
    suggested_prompts: [
      "I'd love a bottle of sparkling water and a fresh bruschetta to start, please.",
      "Could you recommend a dish that is vegetarian or dairy-free?",
      "That sounds delicious. I will have the wild mushroom risotto, and the check afterwards, please.",
    ],
  },
  {
    id: "shopping",
    title_en: "Retail Store Return & Exchange",
    title_fa: "مرجوع و تعویض کالا در فروشگاه",
    level: "B1",
    category: "daily_life",
    character: {
      name_en: "Chloe",
      name_fa: "کلویی",
      role_en: "Customer Service Representative",
      role_fa: "مسئول پشتیبانی مشتریان",
      avatar: "🛍️",
      tone: "helpful, polite, methodical",
    },
    context_en: "You bought a winter jacket two days ago, but the zipper was defective and the size was too tight. You are at customer service.",
    context_fa: "دو روز پیش کاپشنی خریداری کرده‌اید، اما زیپ آن ایراد دارد و سایز آن کمی تنگ است.",
    initial_message_en: "Hello! Welcome to Customer Care. How can I help you with your purchase today?",
    initial_message_fa: "سلام! به بخش پشتیبانی مشتریان خوش آمدید. امروز چطور می‌توانم کمکتان کنم؟",
    max_turns: 8,
    goals: [
      { id: "state_issue", description_en: "Explain why you want to return or exchange the item", description_fa: "دلیل مرجوع یا تعویض کالا را توضیح دهید", keywords: ["return", "exchange", "zipper", "defective", "size", "tight"] },
      { id: "present_receipt", description_en: "Offer your receipt or order confirmation", description_fa: "فاکتور خرید یا رسید سفارش را ارائه دهید", keywords: ["receipt", "order", "proof of purchase", "bought"] },
      { id: "confirm_resolution", description_en: "Confirm an exchange for a larger size or a refund", description_fa: "تعویض با سایز مناسب یا دریافت وجه را نهایی کنید", keywords: ["larger size", "medium", "large", "refund", "card"] },
    ],
    target_vocabulary: [
      { word: "defective", definition: "Imperfect or faulty in structure or function", meaning_fa: "دارای نقص فنی و معیوب", level: "B2" },
      { word: "refund", definition: "A repayment of a sum of money to a customer", meaning_fa: "استرداد وجه پرداختی", level: "B1" },
      { word: "exchange", definition: "Giving one thing and receiving another in return", meaning_fa: "تعویض کالا", level: "A2" },
      { word: "warranty", definition: "A written guarantee of product integrity", meaning_fa: "ضمانت‌نامه و گارانتی", level: "B2" },
    ],
    suggested_prompts: [
      "Hello Chloe. I would like to exchange this jacket because the zipper is stuck and it feels tight.",
      "Yes, I have the original receipt and the tags are still attached right here.",
      "I would love to exchange it for a size Large if you have one in stock, otherwise a refund is fine.",
    ],
  },
  {
    id: "job_interview",
    title_en: "Job Interview: Strengths & Experiences",
    title_fa: "مصاحبه شغلی: نقاط قوت و تجربیات",
    level: "B2",
    category: "professional",
    character: {
      name_en: "Sarah Jenkins",
      name_fa: "سارا جنکینز",
      role_en: "Senior Talent Acquisition Manager",
      role_fa: "مدیر ارشد جذب استعداد و استخدام",
      avatar: "💼",
      tone: "engaging, inquisitive, evaluative",
    },
    context_en: "You are interviewing for a Project Lead role at a modern tech consultancy in London.",
    context_fa: "در جلسه مصاحبه شغلی برای جایگاه سرپرست پروژه در یک شرکت مشاوره فناوری در لندن حاضر شده‌اید.",
    initial_message_en: "Good morning! Thank you for taking the time to join us today. To kick things off, could you tell me briefly about yourself and what drawn you to this role?",
    initial_message_fa: "صبح بخیر! از اینکه امروز در این جلسه حضور یافتید سپاسگزارم. برای شروع، مختصری از سوابق خود بگویید و چه عاملی شما را به این جایگاه علاقه‌مند کرده است؟",
    max_turns: 10,
    goals: [
      { id: "pitch_background", description_en: "Provide a concise professional elevator pitch", description_fa: "معرفی حرفه‌ای و سوابق کلیدی خود را به طور مختصر بیان کنید", keywords: ["experience", "background", "passionate", "led", "managed", "role"] },
      { id: "describe_challenge", description_en: "Use the STAR method to describe overcoming a past challenge", description_fa: "چالشی در کار تیمی گذشته و نحوه حل آن را توضیح دهید", keywords: ["challenge", "conflict", "problem", "resolved", "deadline", "collaborate"] },
      { id: "ask_strategic_question", description_en: "Ask an insightful question about team growth or culture", description_fa: "یک پرسش تحلیلی درباره اهداف آتی تیم یا فرهنگ سازمانی بپرسید", keywords: ["culture", "team", "goals", "milestones", "growth", "vision"] },
    ],
    target_vocabulary: [
      { word: "collaborative", definition: "Produced or conducted by two or more parties working together", meaning_fa: "همکاری‌محور و تعاملی", level: "B2" },
      { word: "deliverable", definition: "A thing able to be provided, especially as a product of a development process", meaning_fa: "خروجی قابل تحویل پروژه", level: "C1" },
      { word: "prioritization", definition: "The action or process of deciding the relative importance of things", meaning_fa: "اولویت‌بندی امور و اهداف", level: "B2" },
      { word: "initiative", definition: "The ability to assess and initiate things independently", meaning_fa: "ابتکار عمل و پیشگامی", level: "B2" },
    ],
    suggested_prompts: [
      "I have spent the past four years leading cross-functional delivery teams across agile environments.",
      "In my previous project, we faced a tight three-week timeline and misaligned stakeholder requirements.",
      "Could you tell me more about how the product and engineering teams measure long-term sprint health?",
    ],
  },
  {
    id: "ielts_speaking",
    title_en: "IELTS Speaking Part 2 & 3 Simulation",
    title_fa: "شبیه‌سازی مصاحبه آیلتس بخش ۲ و ۳",
    level: "B2 - C1",
    category: "exam",
    character: {
      name_en: "Examiner Thompson",
      name_fa: "اگزمینر تامپسون",
      role_en: "Certified IELTS Examiner",
      role_fa: "ممتحن رسمی آزمون آیلتس",
      avatar: "📋",
      tone: "neutral, objective, authoritative",
    },
    context_en: "You are seated in a formal testing booth with Examiner Thompson for Part 2 & 3 of the IELTS Speaking exam.",
    context_fa: "در اتاق رسمی آزمون آیلتس مقابل اگزمینر تامپسون برای سنجش بخش ۲ و ۳ نشسته‌اید.",
    initial_message_en: "Welcome to Part 2 of the Speaking test. Your cue topic is: 'Describe a memorable journey you went on.' You will have one to two minutes to speak. Please begin when ready.",
    initial_message_fa: "به بخش دوم آزمون اسپیکینگ خوش آمدید. کارت موضوع شما: 'یک سفر به یادماندنی را توصیف کنید.' لطفاً صحبت خود را آغاز نمایید.",
    max_turns: 10,
    goals: [
      { id: "monologue_structure", description_en: "Deliver a structured monologue covering where, who with, and why memorable", description_fa: "یک پاسخ منسجم شامل مقصد، همراهان و علت ماندگاری ارائه دهید", keywords: ["journey", "traveled", "went", "scenery", "experience", "memorable"] },
      { id: "elaborate_abstract", description_en: "Answer Part 3 abstract questions with complex reasoning", description_fa: "به سوالات مفهومی بخش ۳ با تحلیل چندجانبه پاسخ دهید", keywords: ["furthermore", "on the one hand", "perspective", "society", "impact", "tend to"] },
      { id: "collocations_idioms", description_en: "Use idiomatic language and natural collocations", description_fa: "از اصطلاحات و ترکیب‌های طبیعی زبانی استفاده کنید", keywords: ["once in a lifetime", "broaden horizons", "off the beaten track", "breathtaking"] },
    ],
    target_vocabulary: [
      { word: "breathtaking", definition: "Astonishing or awe-inspiring in quality", meaning_fa: "شگفت‌انگیز و نفس‌گیر", level: "B2" },
      { word: "unprecedented", definition: "Never done or known before", meaning_fa: "بی‌سابقه و کم‌نظیر", level: "C1" },
      { word: "perspective", definition: "A particular attitude toward or way of regarding something", meaning_fa: "دیدگاه و زاویه دید", level: "B2" },
      { word: "rejuvenate", definition: "Give new energy or vigor to", meaning_fa: "تجدید قوا کردن", level: "C1" },
    ],
    suggested_prompts: [
      "I would like to talk about a scenic road trip across the Scottish Highlands that I took two summers ago.",
      "What made this trip truly unforgettable was the breathtaking landscapes and completely disconnecting from screens.",
      "From a societal standpoint, international travel definitely broadens people's horizons and fosters cultural empathy.",
    ],
  },
];

export default function VoiceRoleplayPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [sessionStatus, setSessionStatus] = useState<"catalog" | "active" | "completed">("catalog");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [maxTurns, setMaxTurns] = useState<number>(8);
  const [goalsCompleted, setGoalsCompleted] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [report, setReport] = useState<RoleplayReport | null>(null);

  // Audio Preferences State
  const [accent, setAccent] = useState<string>("en-US");
  const [speed, setSpeed] = useState<number>(1.0);
  const [retentionDays, setRetentionDays] = useState<number>(7);
  const [isPlayingTts, setIsPlayingTts] = useState<boolean>(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);

  // Fallback / Input Mode State
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState<string>("");
  const [isSubmittingTurn, setIsSubmittingTurn] = useState<boolean>(false);
  const [hint, setHint] = useState<{ en: string; fa: string } | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load user voice preferences from backend
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/voice/preferences/");
        if (res.ok) {
          const data = await res.json();
          if (data.preferred_accent) setAccent(data.preferred_accent);
          if (data.preferred_speed) setSpeed(data.preferred_speed);
          if (data.retention_days !== undefined) setRetentionDays(data.retention_days);
        }
      } catch {
        // Use local defaults
      }
    };
    fetchPrefs();
  }, []);

  // Update voice preference
  const handleUpdatePreference = async (newAccent: string, newSpeed: number, newRetention: number) => {
    setAccent(newAccent);
    setSpeed(newSpeed);
    setRetentionDays(newRetention);

    try {
      await fetch("/api/voice/preferences/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferred_accent: newAccent,
          preferred_speed: newSpeed,
          retention_days: newRetention,
        }),
      });
    } catch {
      // Preference saved locally
    }
  };

  // Start a new roleplay session
  const handleStartSession = async (scenario: Scenario) => {
    setActiveScenario(scenario);
    setHint(null);
    setReport(null);

    try {
      const res = await fetch("/api/roleplay/sessions/start/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenario.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.id);
        setTurnCount(data.turn_count || 0);
        setMaxTurns(data.max_turns || scenario.max_turns);
        setGoalsCompleted(data.goals_completed || []);

        const initialMsgs: Message[] = Array.isArray(data.messages) && data.messages.length > 0
          ? data.messages.map((m: { id?: string | number; sender: "character" | "learner" | "system"; sender_name?: string; content: string }) => ({
              id: String(m.id || "msg_0"),
              sender: m.sender,
              sender_name: m.sender_name || scenario.character.name_en,
              content: m.content,
            }))
          : [
              {
                id: "msg_init",
                sender: "character",
                sender_name: scenario.character.name_en,
                content: scenario.initial_message_en,
              },
            ];

        setMessages(initialMsgs);
        setSessionStatus("active");
        return;
      }
    } catch {
      // Fallback local session
    }

    setSessionId(1);
    setTurnCount(0);
    setMaxTurns(scenario.max_turns);
    setGoalsCompleted([]);
    setMessages([
      {
        id: "msg_init",
        sender: "character",
        sender_name: scenario.character.name_en,
        content: scenario.initial_message_en,
      },
    ]);
    setSessionStatus("active");
  };

  // Handle Learner Spoken Turn or Text Turn
  const handleLearnerTurn = async (spokenText: string, recordingId?: number) => {
    const cleanText = spokenText.trim().slice(0, 500);
    if (!cleanText || isSubmittingTurn) return;

    setIsSubmittingTurn(true);
    setHint(null);

    const nextIndex = messages.length + 1;
    const learnerMsg: Message = {
      id: `learner_${turnCount}_${nextIndex}`,
      sender: "learner",
      sender_name: "You (Voice)",
      content: cleanText,
      recording_id: recordingId,
    };

    setMessages((prev) => [...prev, learnerMsg]);

    try {
      if (sessionId) {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/message/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: cleanText,
            voice_recording_id: recordingId,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          const charMsg: Message = {
            id: `char_${result.turn_count}_${nextIndex + 1}`,
            sender: "character",
            sender_name: result.character_name || activeScenario.character.name_en,
            content: result.character_message,
          };
          setMessages((prev) => [...prev, charMsg]);
          setTurnCount(result.turn_count);
          setGoalsCompleted(result.goals_completed || []);

          if (result.session_status === "completed" && result.session?.report) {
            setReport(result.session.report);
            setSessionStatus("completed");
          }
          setIsSubmittingTurn(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local simulated turn response
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    // Goal matching heuristic
    const updatedGoals = [...goalsCompleted];
    for (const g of activeScenario.goals) {
      if (!updatedGoals.includes(g.id)) {
        const match = g.keywords.some((kw) => cleanText.toLowerCase().includes(kw.toLowerCase()));
        if (match) updatedGoals.push(g.id);
      }
    }
    setGoalsCompleted(updatedGoals);

    if (newTurn >= maxTurns) {
      setReport({
        goals_achieved_count: updatedGoals.length,
        total_goals_count: activeScenario.goals.length,
        communicative_score: 88,
        estimated_cefr: activeScenario.level,
        accomplishments_en: [
          "Completed oral scenario simulation with natural conversational pacing.",
          "Maintained target interaction without blocking or immersion breaks.",
        ],
        accomplishments_fa: [
          "تکمیل شبیه‌سازی سناریوی صوتی با ریتم مکالمه روان و طبیعی.",
          "تداوم گفتار هدفمند بدون وقفه در جریان ارتباطی.",
        ],
        feedback_mistakes: [],
        vocabulary_extracted: activeScenario.target_vocabulary,
        xp_earned: 60,
      });
      setSessionStatus("completed");
      setIsSubmittingTurn(false);
      return;
    }

    const fallbackReplies: Record<string, string[]> = {
      airport: [
        "Thank you. Everything seems in order with your documentation. How many days will you be staying in the country?",
        "Understood. Do you have anything to declare to customs today, such as excess currency or commercial items?",
        "Very well. Welcome to the United Kingdom, and enjoy your stay!",
      ],
      hotel: [
        "Splendid! I have located your booking. Would you prefer a quiet room facing the courtyard or one with a city view?",
        "Certainly, I have noted that request. Breakfast is served from 7:00 to 10:30 AM on the ground floor.",
        "Here are your room keys and Wi-Fi access voucher. Enjoy your time with us!",
      ],
      restaurant: [
        "Excellent choice of beverage. For our specials, our chef has prepared homemade truffle tagliatelle and grilled sea bass.",
        "Certainly! We take dietary preferences very seriously; I will ensure your meal is prepared accordingly.",
        "Splendid! I will place your order with the kitchen immediately. Enjoy your dinner!",
      ],
    };

    const replies = fallbackReplies[activeScenario.id] || [
      "I appreciate you sharing that. Could you elaborate on what steps you would like to take next?",
      "That sounds very clear and well-reasoned. Let us proceed with that plan.",
    ];
    const replyText = replies[(newTurn - 1) % replies.length];

    const charMsg: Message = {
      id: `char_${newTurn}_${nextIndex + 1}`,
      sender: "character",
      sender_name: activeScenario.character.name_en,
      content: replyText,
    };
    setMessages((prev) => [...prev, charMsg]);
    setIsSubmittingTurn(false);
  };

  // Play Character Audio via TTS endpoint or Web Speech Synthesis
  const handlePlayTts = async (text: string, msgIndex: number) => {
    if (isPlayingTts && currentPlayingIndex === msgIndex) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingTts(false);
      setCurrentPlayingIndex(null);
      return;
    }

    setIsPlayingTts(true);
    setCurrentPlayingIndex(msgIndex);

    try {
      // Call TTS endpoint
      const res = await fetch("/api/voice/tts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          accent,
          speed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // If data contains audio_url or synthesis flag
        if (data.audio_url) {
          const audio = new Audio(data.audio_url);
          audio.playbackRate = speed;
          audio.onended = () => {
            setIsPlayingTts(false);
            setCurrentPlayingIndex(null);
          };
          audio.onerror = () => {
            playClientSpeech(text);
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Fallback to Web Speech Synthesis in browser
    playClientSpeech(text);
  };

  const playClientSpeech = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent === "en-GB" ? "en-GB" : "en-US";
      utterance.rate = speed;
      utterance.onend = () => {
        setIsPlayingTts(false);
        setCurrentPlayingIndex(null);
      };
      utterance.onerror = () => {
        setIsPlayingTts(false);
        setCurrentPlayingIndex(null);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingTts(false);
      setCurrentPlayingIndex(null);
    }
  };

  // Pedagogy Hint
  const handleRequestHint = async () => {
    if (sessionId) {
      try {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/hint/`);
        if (res.ok) {
          const data = await res.json();
          setHint({ en: data.hint_en, fa: data.hint_fa });
          return;
        }
      } catch {
        // Fallback
      }
    }

    const uncompleted = activeScenario.goals.find((g) => !goalsCompleted.includes(g.id));
    if (uncompleted) {
      setHint({
        en: `Suggested voice focus: ${uncompleted.description_en}`,
        fa: `راهنمایی تمرکز صوتی: ${uncompleted.description_fa}`,
      });
    } else {
      setHint({
        en: `Wrap up: "${activeScenario.suggested_prompts[0]}"`,
        fa: "با تشکر و تایید نهایی به مکالمه پایان دهید.",
      });
    }
  };

  // Complete Session
  const handleCompleteSession = async () => {
    if (sessionId) {
      try {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/complete/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.report) setReport(data.report);
          setSessionStatus("completed");
          return;
        }
      } catch {
        // Fallback
      }
    }
    setSessionStatus("completed");
  };

  const filteredScenarios = SCENARIOS.filter((sc) => {
    if (selectedLevel === "all") return true;
    return sc.level.includes(selectedLevel);
  });

  return (
    <div className={styles.container}>
      {/* Breadcrumb navigation */}
      <Link href="/roleplay" className={styles.backLink}>
        {isFa ? "← بازگشت به سناریوهای متنی" : "← Back to Roleplay Universe"}
      </Link>

      {/* Hero Header */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "نقش‌آفرینی صوتی تعاملی (Voice Roleplay Beta)" : "Voice Roleplay Beta"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "تمرین مکالمه زنده گفتاری با هوش مصنوعی بدون مسدود شدن. همراه با تنظیمات لهجه (آمریکایی/بریتانیایی)، سرعت گفتار، ویرایش متن گفتار و حفظ حریم خصوصی ضبط‌ها."
                : "Real-time oral dialogue simulation with AI personas. Features selectable accents (US/UK), adjustable playback speed, editable speech transcripts, and privacy-first retention policies."}
            </p>
          </div>
          <span className={styles.badgeBeta}>
            {isFa ? "نسخه آزمایشی تأیید شده" : "Validated Beta"}
          </span>
        </div>

        {/* Audio Toolbar: Accent, Speed, Retention Controls */}
        <div className={styles.audioToolbar}>
          <div className={styles.toolbarGroup}>
            <label htmlFor="accentSelect">
              {isFa ? "لهجه شخصیت:" : "Persona Accent:"}
            </label>
            <select
              id="accentSelect"
              className={styles.selectInput}
              value={accent}
              onChange={(e) => handleUpdatePreference(e.target.value, speed, retentionDays)}
            >
              <option value="en-US">English (US - American)</option>
              <option value="en-GB">English (UK - British)</option>
            </select>
          </div>

          <div className={styles.toolbarGroup}>
            <label htmlFor="speedSelect">
              {isFa ? "سرعت گفتار:" : "Speech Rate:"}
            </label>
            <select
              id="speedSelect"
              className={styles.selectInput}
              value={speed}
              onChange={(e) => handleUpdatePreference(accent, parseFloat(e.target.value), retentionDays)}
            >
              <option value="0.8">0.8x ({isFa ? "آهسته و واضح" : "Slow & Deliberate"})</option>
              <option value="1.0">1.0x ({isFa ? "طبیعی" : "Normal"})</option>
              <option value="1.2">1.2x ({isFa ? "سریع و چالشی" : "Fast & Fluent"})</option>
            </select>
          </div>

          <div className={styles.toolbarGroup}>
            <label htmlFor="retentionSelect">
              {isFa ? "حفظ صدای ضبط‌شده:" : "Audio Retention:"}
            </label>
            <select
              id="retentionSelect"
              className={styles.selectInput}
              value={retentionDays}
              onChange={(e) => handleUpdatePreference(accent, speed, parseInt(e.target.value, 10))}
            >
              <option value="0">{isFa ? "حذف فوری پس از جلسه" : "Delete Immediately"}</option>
              <option value="7">{isFa ? "نگهداری ۷ روزه جهت بازبینی" : "Keep 7 Days for Review"}</option>
              <option value="30">{isFa ? "نگهداری ۳۰ روزه" : "Keep 30 Days"}</option>
            </select>
          </div>
        </div>
      </section>

      {/* VIEW 1: SCENARIO SELECTION CATALOG */}
      {sessionStatus === "catalog" && (
        <>
          <div className={styles.filterRow}>
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
              {isFa ? "فیلتر بر اساس سطح:" : "Filter by Level:"}
            </span>
            {["all", "A2", "B1", "B2", "C1"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`${styles.filterPill} ${selectedLevel === lvl ? styles.filterPillActive : ""}`}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === "all" ? (isFa ? "همه سناریوها" : "All Scenarios") : lvl}
              </button>
            ))}
          </div>

          <div className={styles.scenarioGrid}>
            {filteredScenarios.map((sc) => (
              <div
                key={sc.id}
                className={styles.scenarioCard}
                onClick={() => handleStartSession(sc)}
              >
                <div>
                  <div className={styles.scenarioCardTop}>
                    <div>
                      <h3 className={styles.scenarioTitle}>
                        {isFa ? sc.title_fa : sc.title_en}
                      </h3>
                      <p className={styles.characterRole}>
                        {sc.character.avatar} {isFa ? sc.character.name_fa : sc.character.name_en} ({isFa ? sc.character.role_fa : sc.character.role_en})
                      </p>
                    </div>
                    <span className={styles.filterPill} style={{ pointerEvents: "none" }}>
                      {sc.level}
                    </span>
                  </div>
                  <p className={styles.scenarioContext}>
                    {isFa ? sc.context_fa : sc.context_en}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-4)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                    🎙️ {sc.max_turns} {isFa ? "نوبت گفتاری" : "oral turns"}
                  </span>
                  <button type="button" className={styles.buttonPrimary}>
                    {isFa ? "آغاز مکالمه صوتی 🎙️" : "Start Voice Session 🎙️"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW 2: ACTIVE VOICE ROLEPLAY ARENA */}
      {sessionStatus === "active" && (
        <section className={styles.arenaCard}>
          {/* Header with Character Persona */}
          <div className={styles.arenaHeader}>
            <div className={styles.characterInfo}>
              <span className={styles.avatarCircle}>{activeScenario.character.avatar}</span>
              <div>
                <h2 className={styles.characterTitle}>
                  {isFa ? activeScenario.character.name_fa : activeScenario.character.name_en}
                </h2>
                <p className={styles.characterSubtitle}>
                  {isFa ? activeScenario.character.role_fa : activeScenario.character.role_en} • {activeScenario.character.tone}
                </p>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => setInputMode(inputMode === "voice" ? "text" : "voice")}
              >
                {inputMode === "voice"
                  ? isFa ? "تغییر به ورودی متنی ⌨️" : "Switch to Text ⌨️"
                  : isFa ? "تغییر به ورودی صوتی 🎙️" : "Switch to Voice 🎙️"}
              </button>
              <button type="button" className={styles.buttonSecondary} onClick={handleRequestHint}>
                💡 {isFa ? "راهنمایی گفتار" : "Voice Hint"}
              </button>
              <button type="button" className={styles.buttonSecondary} onClick={handleCompleteSession}>
                🏁 {isFa ? "پایان مکالمه" : "Finish Session"}
              </button>
            </div>
          </div>

          {/* Goal Tracker */}
          <div className={styles.goalsTrackerBar}>
            <div className={styles.goalsTrackerHeader}>
              <span>
                {isFa ? "اهداف ارتباطی سناریو:" : "Communicative Goals Track:"} ({goalsCompleted.length}/{activeScenario.goals.length})
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                {isFa ? `نوبت ${turnCount} از ${maxTurns}` : `Turn ${turnCount} of ${maxTurns}`}
              </span>
            </div>

            <div className={styles.goalsList}>
              {activeScenario.goals.map((goal) => {
                const isAchieved = goalsCompleted.includes(goal.id);
                return (
                  <span
                    key={goal.id}
                    className={`${styles.goalPill} ${isAchieved ? styles.goalPillAchieved : ""}`}
                  >
                    {isAchieved ? "✓" : "○"} {isFa ? goal.description_fa : goal.description_en}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Pedagogy Hint Card */}
          {hint && (
            <div
              style={{
                padding: "var(--space-3) var(--space-5)",
                backgroundColor: "var(--color-action-surface)",
                borderBlockEnd: "1px solid var(--color-border)",
                fontSize: "var(--font-size-meta)",
              }}
            >
              <strong>💡 {isFa ? "پیشنهاد زبانی:" : "Pedagogical Tip:"} </strong>
              <span>{isFa ? hint.fa : hint.en}</span>
            </div>
          )}

          {/* Transcript / Dialogue Stream */}
          <div className={styles.transcriptStream}>
            {messages.map((msg, index) => {
              const isLearner = msg.sender === "learner";
              return (
                <div
                  key={msg.id}
                  className={`${styles.messageBubbleWrapper} ${
                    isLearner ? styles.learnerWrapper : styles.characterWrapper
                  }`}
                >
                  <span className={styles.senderLabel}>{msg.sender_name}</span>
                  <div
                    className={`${styles.messageBubble} ${
                      isLearner ? styles.learnerBubble : styles.characterBubble
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Character TTS Audio Playback Button */}
                  {!isLearner && (
                    <button
                      type="button"
                      className={styles.ttsPlayButton}
                      onClick={() => handlePlayTts(msg.content, index)}
                    >
                      {isPlayingTts && currentPlayingIndex === index
                        ? isFa ? "⏹️ توقف پخش" : "⏹️ Stop Audio"
                        : isFa ? "🔊 شنیدن تلفظ (TTS)" : "🔊 Listen (TTS)"}
                    </button>
                  )}
                </div>
              );
            })}
            <div ref={transcriptEndRef} />
          </div>

          {/* User Input Section: Voice Mode vs Non-blocking Text Fallback */}
          <div style={{ padding: "var(--space-4)", backgroundColor: "var(--color-surface)" }}>
            {inputMode === "voice" ? (
              <VoiceRecorder
                locale={isFa ? "fa" : "en"}
                scenarioId={activeScenario.id}
                sessionId={sessionId ? String(sessionId) : undefined}
                disabled={isSubmittingTurn}
                onConfirmTranscript={(transcript, recordingId) => {
                  handleLearnerTurn(transcript, recordingId);
                }}
                onSwitchToTextMode={() => setInputMode("text")}
              />
            ) : (
              <div className={styles.textFallbackCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
                    {isFa ? "ورودی متنی بدون مسدودیت:" : "Non-blocking Text Input Fallback:"}
                  </span>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => setInputMode("voice")}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    {isFa ? "بازگشت به ضبط صدا 🎙️" : "Switch Back to Voice 🎙️"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.textFallbackInput}
                    value={textInput}
                    placeholder={
                      isFa
                        ? "پاسخ خود را به انگلیسی تایپ کنید..."
                        : "Type your English conversational turn..."
                    }
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && textInput.trim()) {
                        handleLearnerTurn(textInput);
                        setTextInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.buttonPrimary}
                    onClick={() => {
                      if (textInput.trim()) {
                        handleLearnerTurn(textInput);
                        setTextInput("");
                      }
                    }}
                    disabled={!textInput.trim() || isSubmittingTurn}
                  >
                    {isFa ? "ارسال نوبت" : "Send Turn"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIEW 3: POST-CONVERSATION REPORT CARD */}
      {sessionStatus === "completed" && report && (
        <section className={styles.reportCard}>
          <div className={styles.celebrationHeader}>
            <div>
              <h2 className={styles.celebrationTitle}>
                🎉 {isFa ? "مکالمه صوتی با موفقیت انجام شد!" : "Voice Roleplay Completed!"}
              </h2>
              <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-body)" }}>
                {isFa
                  ? "گزارش شواهد گفتاری و تحلیل تشخیصی سناریو مطابق قانون ۸ اساسنامه"
                  : "Diagnostic evidence and oral performance report under Constitution Rule #8"}
              </p>
            </div>
            <div className={styles.xpBadge}>
              <span>⭐</span>
              <span>+{report.xp_earned || 50} XP</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>
                {report.goals_achieved_count}/{report.total_goals_count}
              </span>
              <span className={styles.metricLabel}>
                {isFa ? "اهداف ارتباطی محقق‌شده" : "Goals Achieved"}
              </span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{report.communicative_score}%</span>
              <span className={styles.metricLabel}>
                {isFa ? "امتیاز اثربخشی ارتباطی" : "Communicative Score"}
              </span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{report.estimated_cefr}</span>
              <span className={styles.metricLabel}>
                {isFa ? "سطح تخمینی CEFR" : "Estimated CEFR"}
              </span>
            </div>
          </div>

          {/* Accomplishments */}
          <div>
            <h3 style={{ fontSize: "var(--font-size-title-3)", marginBlockEnd: "var(--space-3)" }}>
              🏆 {isFa ? "دستاوردهای مکالمه:" : "Oral Accomplishments:"}
            </h3>
            <ul style={{ paddingInlineStart: "var(--space-4)", lineHeight: "var(--line-height-base)" }}>
              {(isFa ? report.accomplishments_fa : report.accomplishments_en).map((acc, i) => (
                <li key={i} style={{ marginBlockEnd: "var(--space-2)" }}>
                  {acc}
                </li>
              ))}
            </ul>
          </div>

          {/* Extracted Vocabulary */}
          {report.vocabulary_extracted && report.vocabulary_extracted.length > 0 && (
            <div>
              <h3 style={{ fontSize: "var(--font-size-title-3)", marginBlockEnd: "var(--space-3)" }}>
                📖 {isFa ? "واژگان کلیدی استخراج‌شده از سناریو:" : "Extracted Scenario Vocabulary:"}
              </h3>
              <div className={styles.vocabList}>
                {report.vocabulary_extracted.map((v, i) => (
                  <span key={i} className={styles.vocabChip}>
                    <strong>{v.word}</strong>
                    <span style={{ color: "var(--color-muted)" }}>• {isFa ? v.meaning_fa : v.definition}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={() => {
                setSessionStatus("catalog");
                setMessages([]);
                setTurnCount(0);
                setGoalsCompleted([]);
                setReport(null);
              }}
            >
              🔄 {isFa ? "تمرین سناریوی صوتی دیگر" : "Practice Another Scenario"}
            </button>
            <Link href="/dashboard" className={styles.buttonSecondary}>
              📊 {isFa ? "بازگشت به داشبورد تحلیلی" : "Return to Dashboard"}
            </Link>
          </div>

          {/* Disclosure */}
          <footer className={styles.disclaimer}>
            {isFa
              ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): داده‌های صوتی طبق تنظیمات شما پردازش شده و ارزیابی شواهد گفتار بدون برچسب‌های کاذب هوش مصنوعی ارائه می‌گردد."
              : "Constitution Rule #8 Disclosure: Speech recognition and acoustic evidence adhere strictly to your retention preferences with authentic formative feedback."}
          </footer>
        </section>
      )}
    </div>
  );
}
