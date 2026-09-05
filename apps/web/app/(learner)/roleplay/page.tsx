"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./roleplay.module.css";

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
  id: string | number;
  sender: "character" | "learner" | "system";
  sender_name: string;
  content: string;
  timestamp?: string;
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

const FALLBACK_SCENARIOS: Scenario[] = [
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
    id: "travel",
    title_en: "Public Transit & Asking for Directions",
    title_fa: "مسیریابی شهری و حمل‌ونقل عمومی",
    level: "A2",
    category: "travel",
    character: {
      name_en: "Julian",
      name_fa: "جولین",
      role_en: "Station Attendant",
      role_fa: "راهنمای ایستگاه مترو",
      avatar: "🚇",
      tone: "clear, patient, encouraging",
    },
    context_en: "You are at a busy subway station in downtown Toronto trying to find the connecting train to the National Art Gallery.",
    context_fa: "در ایستگاه متروی مرکزی هستید و می‌خواهید به گالری ملی هنر بروید و مسیر انتقال را پیدا کنید.",
    initial_message_en: "Hello there! You look like you might need some transit directions. Where are you heading today?",
    initial_message_fa: "سلام! به نظر می‌رسد نیاز به راهنمایی مسیر دارید. امروز قصد رفتن به کجا را دارید؟",
    max_turns: 8,
    goals: [
      { id: "specify_destination", description_en: "Tell the attendant where you want to go", description_fa: "مقصد مورد نظر خود را بگویید", keywords: ["gallery", "art gallery", "museum", "downtown", "heading to"] },
      { id: "ask_platform_transfer", description_en: "Ask which line, platform, or transfer to take", description_fa: "درباره خط مترو یا سکو سوال کنید", keywords: ["line", "platform", "transfer", "train", "stop"] },
      { id: "inquire_fare_ticket", description_en: "Ask about ticket fare or payment options", description_fa: "درباره قیمت بلیط یا نحوه پرداخت سوال بپرسید", keywords: ["ticket", "fare", "card", "cost", "buy", "contactless"] },
    ],
    target_vocabulary: [
      { word: "transfer", definition: "Change from one vehicle to another during a journey", meaning_fa: "تعویض خط و ایستگاه انتقال", level: "A2" },
      { word: "platform", definition: "A raised level surface where passengers wait for a train", meaning_fa: "سکوی سوار شدن به قطار", level: "A2" },
      { word: "commute", definition: "Travel regularly between home and place of work", meaning_fa: "تردد روزانه شهری", level: "B1" },
      { word: "fare", definition: "The money a passenger has to pay for public transit", meaning_fa: "کرایه و بهای بلیط", level: "B1" },
    ],
    suggested_prompts: [
      "Hi! I am trying to reach the National Art Gallery. Which line should I take?",
      "Do I need to make a transfer at Union Station, and which platform is it?",
      "Can I pay using my contactless credit card or do I need to purchase a ticket?",
    ],
  },
  {
    id: "university",
    title_en: "Academic Advising & Course Selection",
    title_fa: "مشاوره تحصیلی و انتخاب واحد دانشگاهی",
    level: "B2",
    category: "academic",
    character: {
      name_en: "Dr. Sterling",
      name_fa: "دکتر استرلینگ",
      role_en: "Academic Advisor",
      role_fa: "مشاور تحصیلی و استاد راهنما",
      avatar: "🎓",
      tone: "academic, thoughtful, supportive",
    },
    context_en: "You are sitting in Dr. Sterling's faculty office to plan courses for the upcoming semester.",
    context_fa: "در دفتر کار دکتر استرلینگ برای انتخاب واحدهای ترم آینده نشسته‌اید.",
    initial_message_en: "Come in and have a seat! I see you are finalizing your course schedule for next semester. What academic focus or electives are you leaning towards?",
    initial_message_fa: "بفرمایید داخل و بنشینید! می‌بینم که در حال انتخاب واحدهای ترم آینده هستید. بیشتر به چه گرایش یا دروس اختیاری تمایل دارید؟",
    max_turns: 10,
    goals: [
      { id: "discuss_core_electives", description_en: "Mention intended major courses or research interests", description_fa: "دروس اصلی یا حوزه‌های پژوهشی مورد نظر را بیان کنید", keywords: ["major", "elective", "course", "research", "seminar", "credits"] },
      { id: "raise_workload_concern", description_en: "Ask about managing workload or prerequisites", description_fa: "درباره پیش‌نیازها یا حجم تکالیف سوال مطرح کنید", keywords: ["prerequisite", "workload", "manage", "demanding", "assignments"] },
      { id: "agree_on_plan", description_en: "Agree on a balanced course plan for registration", description_fa: "بر روی یک ترکیب واحد متعادل به توافق برسید", keywords: ["enroll", "register", "balance", "plan", "finalize"] },
    ],
    target_vocabulary: [
      { word: "prerequisite", definition: "A thing required as a prior condition for something else", meaning_fa: "پیش‌نیاز تحصیلی", level: "B2" },
      { word: "syllabus", definition: "An outline of the subjects in a course of study", meaning_fa: "سربرگ سرفصل‌های آموزشی", level: "B2" },
      { word: "curriculum", definition: "The subjects comprising a course of study", meaning_fa: "برنامه درسی مصوب", level: "B2" },
      { word: "workload", definition: "The amount of work to be done in a given period", meaning_fa: "حجم کار و تکالیف", level: "B1" },
    ],
    suggested_prompts: [
      "Thank you Dr. Sterling. I am hoping to take the Advanced Data Analysis seminar alongside Cognitive Linguistics.",
      "Do you think the workload for those two courses will be manageable with my research assistantship?",
      "That makes total sense. I will prioritize the prerequisite seminar this term and register tomorrow.",
    ],
  },
  {
    id: "job_interview",
    title_en: "Professional Job Interview",
    title_fa: "مصاحبه شغلی تخصصی",
    level: "B2",
    category: "professional",
    character: {
      name_en: "Sarah Lin",
      name_fa: "سارا لین",
      role_en: "Engineering Hiring Manager",
      role_fa: "مدیر استخدام و تیم فنی",
      avatar: "💼",
      tone: "sharp, structured, inquisitive",
    },
    context_en: "You are interviewing for a software engineering position at a global tech firm. Sarah Lin begins by exploring technical problem-solving background.",
    context_fa: "در مصاحبه شغلی برای یک شرکت بین‌المللی فناوری حاضر شده‌اید. سارا مصاحبه را با سنجش مهارت حل مسئله آغاز می‌کند.",
    initial_message_en: "Good afternoon! Thanks for joining us today. To start off, could you walk me through a complex technical challenge you recently tackled, and how your team resolved it?",
    initial_message_fa: "بعدازظهر بخیر! ممنون از حضور شما. برای شروع، می‌توانید یک چالش فنی پیچیده که اخیراً پشت سر گذاشته‌اید را توضیح دهید؟",
    max_turns: 10,
    goals: [
      { id: "describe_star_situation", description_en: "Describe a concrete project challenge or bottleneck", description_fa: "یک چالش فنی یا گلوگاه عملکردی را شرح دهید", keywords: ["challenge", "problem", "bottleneck", "database", "latency", "scale"] },
      { id: "explain_action_strategy", description_en: "Explain your specific actions, trade-offs, or leadership", description_fa: "اقدامات عملی یا تصمیمات فنی خود را توضیح دهید", keywords: ["refactored", "implemented", "optimized", "collaborated", "designed"] },
      { id: "quantify_result_ask_team", description_en: "Highlight the measurable outcome and ask about company culture", description_fa: "نتیجه ملموس را بیان کرده و سوالی درباره فرهنگ تیم بپرسید", keywords: ["percent", "reduced", "improved", "faster", "culture", "practices"] },
    ],
    target_vocabulary: [
      { word: "bottleneck", definition: "A point of congestion in a system that restricts throughput", meaning_fa: "گلوگاه عملکردی سیستم", level: "B2" },
      { word: "trade-off", definition: "A compromise achieved between two desirable outcomes", meaning_fa: "موازنه و بده‌بستان فنی", level: "B2" },
      { word: "scalable", definition: "Able to accommodate increased growth or workload", meaning_fa: "مقیاس‌پذیر", level: "B2" },
      { word: "initiative", definition: "The ability to assess and initiate action independently", meaning_fa: "ابتکار عمل و پیش‌قدمی", level: "B2" },
    ],
    suggested_prompts: [
      "In our previous project, our API latency spiked under peak loads due to redundant database joins.",
      "I led the initiative to implement caching and restructured indexes, which brought latency down by 65%.",
      "What architectural standards does your team follow when scaling services across multiple regions?",
    ],
  },
  {
    id: "business",
    title_en: "Project Deadline & Scope Negotiation",
    title_fa: "مذاکره زمان‌بندی و محدوده پروژه تجاری",
    level: "B2",
    category: "professional",
    character: {
      name_en: "Marcus Vance",
      name_fa: "مارکوس ونس",
      role_en: "Senior Product Director",
      role_fa: "مدیر ارشد محصول",
      avatar: "📊",
      tone: "pragmatic, assertive, collaborative",
    },
    context_en: "You are leading a major frontend launch. Marcus asks for an early release date, but you need to negotiate between feature scope and quality assurance.",
    context_fa: "مدیریت انتشار نسخه جدید را بر عهده دارید. مارکوس خواستار تسریع در رونمایی است و شما باید بین زمان‌بندی و حفظ کیفیت مذاکره کنید.",
    initial_message_en: "Good morning. Stakeholders are pushing to move our launch milestone forward by two weeks. Can we ship the entire feature roadmap ahead of schedule?",
    initial_message_fa: "صبح بخیر. ذی‌نفعان اصرار دارند تاریخ رونمایی را دو هفته جلو بیندازیم. آیا امکان انتشار تمام قابلیت‌ها زودتر از موعد وجود دارد؟",
    max_turns: 10,
    goals: [
      { id: "assess_feasibility", description_en: "Clarify risks to code quality or regression testing", description_fa: "ریسک‌های مربوط به کیفیت و آزمون‌ها را شفاف کنید", keywords: ["risk", "quality", "testing", "timeline", "burnout", "compromise"] },
      { id: "propose_staged_rollout", description_en: "Propose a phased release (MVP first, secondary later)", description_fa: "پیشنهاد انتشار فازبندی شده ارائه دهید", keywords: ["phased", "mvp", "core features", "phase 1", "stage", "split"] },
      { id: "reach_alignment", description_en: "Finalize commitment on adjusted scope and date", description_fa: "بر روی محدوده اصلاح‌شده و زمان توافق کنید", keywords: ["agree", "commit", "milestone", "aligned", "deliver"] },
    ],
    target_vocabulary: [
      { word: "feasibility", definition: "The state or degree of being easily or conveniently done", meaning_fa: "امکان‌پذیری و سنجش عملی", level: "B2" },
      { word: "stakeholder", definition: "A person with an interest or concern in a business or project", meaning_fa: "ذی‌نفع و سهام‌دار", level: "B2" },
      { word: "milestone", definition: "A significant stage in the development of a project", meaning_fa: "نقطه عطف و گام کلیدی", level: "B1" },
      { word: "contingency", definition: "A future event which is possible but cannot be predicted with certainty", meaning_fa: "برنامه پیش‌بینی بحران", level: "C1" },
    ],
    suggested_prompts: [
      "Moving the date by two weeks without adjusting scope would severely compromise our QA testing and stability.",
      "I propose we ship the core roleplay universe on the expedited date, and rollout advanced speech analytics in a fast follow-up.",
      "If we agree on that phased milestone, our engineering team can confidently meet the deadline with zero critical defects.",
    ],
  },
  {
    id: "friendly_chat",
    title_en: "Weekend Catch-up with a Friend",
    title_fa: "گپ‌وگفت دوستانه آخر هفته",
    level: "B1",
    category: "social",
    character: {
      name_en: "Sam",
      name_fa: "سَم",
      role_en: "Close Friend",
      role_fa: "دوست صمیمی",
      avatar: "☕",
      tone: "casual, warm, expressive",
    },
    context_en: "You and your close friend Sam meet up at your favorite neighborhood coffee shop on a sunny Saturday afternoon.",
    context_fa: "شما و دوست صمیمیتان سَم در یک بعدازظهر آفتابی شنبه در کافه محله دیدار کرده‌اید.",
    initial_message_en: "Hey! It feels like ages since we caught up properly. How have you been holding up with work and everything?",
    initial_message_fa: "سلام! خیلی وقته درست و حسابی با هم حرف نزدیم. اوضاع کار و زندگی چطور پیش میره؟",
    max_turns: 8,
    goals: [
      { id: "share_personal_update", description_en: "Share how you've been doing or mention a recent hobby/project", description_fa: "از احوال خود یا یک فعالیت جدید بگویید", keywords: ["busy", "good", "learning", "project", "coding", "reading", "tired", "excited"] },
      { id: "ask_friend_life", description_en: "Inquire about Sam's week, plans, or family", description_fa: "درباره برنامه‌ها یا حال و روز سَم سوال بپرسید", keywords: ["how about you", "what about you", "how's your", "plans", "weekend"] },
      { id: "suggest_weekend_activity", description_en: "Suggest doing an activity together", description_fa: "پیشنهاد یک فعالیت مشترک برای آخر هفته بدهید", keywords: ["grab food", "dinner", "movie", "hiking", "walk", "hang out"] },
    ],
    target_vocabulary: [
      { word: "catch up", definition: "To talk to someone you have not seen for a while", meaning_fa: "دیدار تازه کردن و احوال‌پرسی", level: "B1" },
      { word: "hectic", definition: "Full of incessant activity; very busy", meaning_fa: "بسیار شلوغ و پرمشغله", level: "B1" },
      { word: "unwind", definition: "To relax after a period of tension or work", meaning_fa: "استراحت کردن و تمدد اعصاب", level: "B2" },
      { word: "spontaneous", definition: "Occurring as a result of sudden impulse without premeditation", meaning_fa: "خودجوش و بی‌برنامه قبلی", level: "B2" },
    ],
    suggested_prompts: [
      "I've been quite busy building an AI language learning app, but it's really exciting!",
      "How have things been on your end? Are you still planning that trip to Vancouver?",
      "We should definitely go hiking in the nature reserve tomorrow to unwind!",
    ],
  },
  {
    id: "ielts_speaking",
    title_en: "IELTS Speaking Part 2 & 3 Simulation",
    title_fa: "شبیه‌سازی مصاحبه شفاهی آیلتس (بخش ۲ و ۳)",
    level: "B2 - C1",
    category: "exam_prep",
    character: {
      name_en: "Examiner Henderson",
      name_fa: "ممتحن هندرسون",
      role_en: "Certified IELTS Examiner",
      role_fa: "ممتحن رسمی آزمون آیلتس",
      avatar: "🎙️",
      tone: "objective, professional, standard British/International",
    },
    context_en: "You are taking the IELTS Speaking test. Examiner Henderson presents a topic card regarding environmental conservation.",
    context_fa: "در جلسه آزمون شفاهی آیلتس هستید. ممتحن هندرسون موضوع حفظ محیط‌زیست را مطرح می‌کند.",
    initial_message_en: "Good afternoon. Welcome to Part 2 and 3 of the Speaking module. Today's topic centers on environmental initiatives. Could you describe a policy or technological effort that helps protect our natural resources?",
    initial_message_fa: "بعدازظهر بخیر. به بخش‌های ۲ و ۳ آزمون شفاهی خوش آمدید. موضوع امروز اقدامات زیست‌محیطی است. می‌توانید یک فناوری یا سیاست حامی منابع طبیعی را تشریح کنید؟",
    max_turns: 10,
    goals: [
      { id: "elaborate_example", description_en: "Describe an environmental initiative with details", description_fa: "یک اقدام زیست‌محیطی را با ذکر جزئیات تشریح کنید", keywords: ["solar", "renewable", "recycling", "initiative", "carbon", "policy", "clean energy"] },
      { id: "analyze_societal_impact", description_en: "Analyze the societal benefits and challenges", description_fa: "اثرات اجتماعی یا چالش‌های پیاده‌سازی را تحلیل کنید", keywords: ["society", "economic", "cost", "government", "challenges", "benefits"] },
      { id: "hypothesize_future", description_en: "Give a nuanced future projection with speculative language", description_fa: "یک پیش‌بینی آینده‌نگرانه با ساختارهای شرطی بیان کنید", keywords: ["long run", "potentially", "likely to", "provided that", "sustainable"] },
    ],
    target_vocabulary: [
      { word: "sustainable", definition: "Able to be maintained without exhausting natural resources", meaning_fa: "پایدار و سازگار با محیط‌زیست", level: "B2" },
      { word: "mitigate", definition: "Make less severe, serious, or painful", meaning_fa: "کاهش دادن و تعدیل کردن", level: "C1" },
      { word: "infrastructure", definition: "Basic physical and organizational structures needed for operation", meaning_fa: "زیرساخت‌های اساسی", level: "B2" },
      { word: "imperative", definition: "Of vital importance; crucial", meaning_fa: "امری حیاتی و ضروری", level: "C1" },
    ],
    suggested_prompts: [
      "A prominent example is the widespread adoption of municipal solar power and localized smart grids.",
      "While initial installation costs are high, the long-term mitigation of fossil fuel reliance provides immense dividends.",
      "Provided that governments invest in battery storage infrastructure, renewable sources will likely dominate within two decades.",
    ],
  },
];

export default function RoleplayPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  // Catalog state
  const [scenarios, setScenarios] = useState<Scenario[]>(FALLBACK_SCENARIOS);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeScenario, setActiveScenario] = useState<Scenario>(FALLBACK_SCENARIOS[0]);

  // Session state
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"catalog" | "active" | "completed">("catalog");
  const [messages, setMessages] = useState<Message[]>([]);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [maxTurns, setMaxTurns] = useState<number>(8);
  const [goalsCompleted, setGoalsCompleted] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [hint, setHint] = useState<{ en: string; fa: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [report, setReport] = useState<RoleplayReport | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Load backend scenario catalog if available
  useEffect(() => {
    async function fetchScenarios() {
      try {
        const res = await fetch("/api/roleplay/scenarios/");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setScenarios(data);
            setActiveScenario(data[0]);
          }
        }
      } catch {
        // Use fallback scenarios
      }
    }
    fetchScenarios();
  }, []);

  // Filter scenarios by CEFR level
  const filteredScenarios = scenarios.filter((sc) => {
    if (selectedLevel === "all") return true;
    return sc.level.toLowerCase().includes(selectedLevel.toLowerCase());
  });

  // Start or resume roleplay session
  const handleSelectScenario = async (scenario: Scenario) => {
    setActiveScenario(scenario);
    setMaxTurns(scenario.max_turns || 8);
    setHint(null);
    setActionFeedback(null);
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
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([
            {
              id: "init",
              sender: "character",
              sender_name: scenario.character.name_en,
              content: scenario.initial_message_en,
            },
          ]);
        }
        if (data.status === "completed" && data.report) {
          setReport(data.report);
          setSessionStatus("completed");
          return;
        }
        setSessionStatus("active");
        return;
      }
    } catch {
      // Fallback to local client session
    }

    // Local client session setup
    setSessionId(1);
    setTurnCount(0);
    setGoalsCompleted([]);
    setMessages([
      {
        id: "init",
        sender: "character",
        sender_name: scenario.character.name_en,
        content: scenario.initial_message_en,
      },
    ]);
    setSessionStatus("active");
  };

  // Submit learner message turn
  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    // Immersion rule: cap at 500 characters
    const boundedText = trimmed.slice(0, 500);
    setInputText("");
    setIsSubmitting(true);
    setActionFeedback(null);

    // Optimistic learner message
    const msgIndex = messages.length + 1;
    const learnerMsg: Message = {
      id: `learner_${turnCount}_${msgIndex}`,
      sender: "learner",
      sender_name: "You",
      content: boundedText,
    };
    setMessages((prev) => [...prev, learnerMsg]);

    try {
      if (sessionId) {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/message/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: boundedText }),
        });

        if (res.ok) {
          const result = await res.json();
          const charMsg: Message = {
            id: `char_${result.turn_count}_${msgIndex + 1}`,
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
          setIsSubmitting(false);
          return;
        }
      }
    } catch {
      // Fallback local simulation
    }

    // Local fallback turn evaluation
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    // Evaluate goals locally
    const lowerInput = boundedText.toLowerCase();
    const updatedGoals = new Set(goalsCompleted);
    activeScenario.goals.forEach((g) => {
      if (g.keywords.some((kw) => lowerInput.includes(kw.toLowerCase()))) {
        updatedGoals.add(g.id);
      }
    });
    const completedList = Array.from(updatedGoals);
    setGoalsCompleted(completedList);

    // Simulated character reply
    let replyText = `${activeScenario.character.name_en}: That sounds good. Could you also share a bit more detail about that?`;
    const allDone = completedList.length >= activeScenario.goals.length;

    if (allDone || newTurn >= maxTurns) {
      replyText = `${activeScenario.character.name_en}: Thank you very much! Everything is sorted out. Have a wonderful day! [Scenario Complete!]`;
      const charMsg: Message = {
        id: `char_${newTurn}_${msgIndex + 1}`,
        sender: "character",
        sender_name: activeScenario.character.name_en,
        content: replyText,
      };
      setMessages((prev) => [...prev, charMsg]);

      // Generate client report
      setReport({
        goals_achieved_count: completedList.length,
        total_goals_count: activeScenario.goals.length,
        communicative_score: Math.min(96, 75 + completedList.length * 7),
        estimated_cefr: activeScenario.level,
        accomplishments_en: [
          "Participated actively in conversational turn exchange.",
          `Achieved ${completedList.length} of ${activeScenario.goals.length} target scenario goals.`,
        ],
        accomplishments_fa: [
          "مشارکت فعال در تبادل نوبت‌های مکالمه واقعی.",
          `دستیابی به ${completedList.length} از ${activeScenario.goals.length} هدف تعیین‌شده سناریو.`,
        ],
        feedback_mistakes: [
          {
            id: "mst_look_forward",
            tag: "grammar.gerund_after_to",
            title_en: "Gerund after 'Look forward to'",
            title_fa: "کاربرد اسم مصدر پس از look forward to",
            original: "look forward to meet",
            corrected: "look forward to meeting",
            explanation_en: "Always use the -ing gerund form after 'look forward to'.",
            explanation_fa: "پس از عبارت look forward to همواره از ساختار فعل دارای ing استفاده می‌شود.",
            accepted: false,
          },
        ],
        vocabulary_extracted: activeScenario.target_vocabulary.map((v) => ({
          ...v,
          lemma: v.word.toLowerCase(),
          saved_to_srs: false,
        })),
        xp_earned: 50,
      });
      setSessionStatus("completed");
      setIsSubmitting(false);
      return;
    }

    const charMsg: Message = {
      id: `char_${newTurn}_${msgIndex + 1}`,
      sender: "character",
      sender_name: activeScenario.character.name_en,
      content: replyText,
    };
    setMessages((prev) => [...prev, charMsg]);
    setIsSubmitting(false);
  };

  // Request pedagogical hint
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
        en: `Suggested focus: ${uncompleted.description_en}`,
        fa: `راهنمایی: ${uncompleted.description_fa}`,
      });
    } else {
      setHint({
        en: `Wrap up the conversation: "${activeScenario.suggested_prompts[0]}"`,
        fa: "مکالمه را با تشکر و تایید نهایی به پایان برسانید.",
      });
    }
  };

  // Manually complete session
  const handleManualComplete = async () => {
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

  // Accept deferred mistake -> sync with Mistake Genome
  const handleAcceptMistake = async (mistakeId: string) => {
    if (sessionId) {
      try {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/accept-mistake/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mistake_id: mistakeId }),
        });
        if (res.ok) {
          const updated = await res.json();
          setReport(updated);
          setActionFeedback(
            isFa
              ? "خطا با موفقیت در ژنوم اشتباهات شما ذخیره شد."
              : "Mistake saved to your Mistake Genome."
          );
          return;
        }
      } catch {
        // Fallback
      }
    }

    if (report) {
      const updatedMistakes = report.feedback_mistakes.map((m) =>
        m.id === mistakeId ? { ...m, accepted: true } : m
      );
      setReport({ ...report, feedback_mistakes: updatedMistakes });
      setActionFeedback(
        isFa
          ? "خطا در ژنوم اشتباهات شما ذخیره شد."
          : "Mistake saved to your Mistake Genome."
      );
    }
  };

  // Save target vocabulary word -> sync with SRS Deck
  const handleSaveSrsWord = async (lemma: string) => {
    if (sessionId) {
      try {
        const res = await fetch(`/api/roleplay/sessions/${sessionId}/save-srs-word/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lemma }),
        });
        if (res.ok) {
          const updated = await res.json();
          setReport(updated);
          setActionFeedback(
            isFa
              ? `واژه "${lemma}" به جعبه مرور لغات (SRS) اضافه شد.`
              : `Word "${lemma}" added to your SRS Vocabulary Deck.`
          );
          return;
        }
      } catch {
        // Fallback
      }
    }

    if (report) {
      const updatedVocab = report.vocabulary_extracted.map((v) =>
        (v.lemma || v.word.toLowerCase()) === lemma.toLowerCase()
          ? { ...v, saved_to_srs: true }
          : v
      );
      setReport({ ...report, vocabulary_extracted: updatedVocab });
      setActionFeedback(
        isFa
          ? `واژه "${lemma}" به جعبه مرور لغات (SRS) اضافه شد.`
          : `Word "${lemma}" added to your SRS Vocabulary Deck.`
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation Breadcrumb */}
      <Link href="/dashboard" className={styles.backLink}>
        {isFa ? "← بازگشت به داشبورد یادگیری" : "← Back to Learner Dashboard"}
      </Link>

      {/* Hero Card */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "دنیای نقش‌آفرینی زبانی (Roleplay Universe v1)" : "Roleplay Universe v1"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "مکالمه تعاملی نوبتی با شخصیت‌های شبیه‌سازی‌شده در سناریوهای واقعی (فرودگاه، مصاحبه شغلی، مذاکره، آیلتس) بدون قطع مداوم مکالمه با گزارش تشخیصی جامع پس از مکالمه."
                : "Immersive situational turn-by-turn dialogues with authentic AI personas. Zero mid-turn interruptions—all error analysis and target vocabulary are deferred to your post-conversation diagnostic report."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "۱۰ سناریوی تعاملی معتبر" : "10 Scenario Simulations"}
          </span>
        </div>

        {/* Voice Roleplay Beta Fast-Track Banner */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href="/roleplay/voice"
            className={styles.buttonPrimary}
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <span>🎙️</span>
            <span>{isFa ? "ورود به نقش‌آفرینی صوتی (Voice Roleplay Beta)" : "Enter Voice Roleplay Beta"}</span>
          </Link>
          <span className={styles.heroBadge}>
            🎙️ {isFa ? "مجهز به ضبط زنده و لهجه‌های انتخابی (آزمایشی)" : "Live Audio & Accent Controls (Beta)"}
          </span>
        </div>

        {/* Level Filters */}
        <div className={styles.filterRow}>
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
            {isFa ? "فیلتر بر اساس سطح CEFR:" : "Filter by CEFR Level:"}
          </span>
          {["all", "A2", "B1", "B2", "C1"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`${styles.filterPill} ${selectedLevel === lvl ? styles.filterPillActive : ""}`}
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl === "all" ? (isFa ? "همه سناریوها" : "All Levels") : lvl}
            </button>
          ))}
        </div>
      </section>

      {/* VIEW 1: SCENARIO CATALOG */}
      {sessionStatus === "catalog" && (
        <section className={styles.scenarioGrid}>
          {filteredScenarios.map((sc) => (
            <div
              key={sc.id}
              className={`${styles.scenarioCard} ${activeScenario.id === sc.id ? styles.scenarioCardActive : ""}`}
              onClick={() => handleSelectScenario(sc)}
            >
              <div>
                <div className={styles.scenarioCardTop}>
                  <div className={styles.characterAvatar}>{sc.character.avatar}</div>
                  <span className={styles.heroBadge}>{sc.level}</span>
                </div>
                <h3 className={styles.scenarioTitle}>{isFa ? sc.title_fa : sc.title_en}</h3>
                <p className={styles.characterRole}>
                  {isFa ? `${sc.character.name_fa} (${sc.character.role_fa})` : `${sc.character.name_en} — ${sc.character.role_en}`}
                </p>
                <p className={styles.scenarioContext}>{isFa ? sc.context_fa : sc.context_en}</p>

                {/* Goals Preview */}
                <div className={styles.goalsPreview}>
                  <span className={styles.goalsPreviewTitle}>
                    {isFa ? "اهداف ارتباطی سناریو:" : "Communicative Goals:"}
                  </span>
                  {sc.goals.slice(0, 3).map((g) => (
                    <div key={g.id} className={styles.goalBullet}>
                      <span>🎯</span>
                      <span>{isFa ? g.description_fa : g.description_en}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={styles.buttonPrimary}
                style={{ width: "100%", marginBlockStart: "var(--space-3)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectScenario(sc);
                }}
              >
                {isFa ? "ورود به سناریو و آغاز گفتگو" : "Start Conversation"}
              </button>
            </div>
          ))}
        </section>
      )}

      {/* VIEW 2: ACTIVE LIVE DIALOGUE ARENA */}
      {sessionStatus === "active" && (
        <section className={styles.arenaCard}>
          {/* Header */}
          <div className={styles.arenaHeader}>
            <div className={styles.characterHeaderInfo}>
              <span className={styles.characterHeaderAvatar}>{activeScenario.character.avatar}</span>
              <div>
                <h2 className={styles.characterHeaderTitle}>
                  {isFa ? activeScenario.character.name_fa : activeScenario.character.name_en}
                </h2>
                <p className={styles.characterHeaderSubtitle}>
                  {isFa
                    ? `${activeScenario.character.role_fa} • لحن: ${activeScenario.character.tone}`
                    : `${activeScenario.character.role_en} • Tone: ${activeScenario.character.tone}`}
                </p>
              </div>
            </div>

            <div className={styles.sessionControls}>
              <span className={styles.turnCounterBadge}>
                <span>⏳</span>
                <span>
                  {isFa ? `نوبت ${turnCount} از ${maxTurns}` : `Turn ${turnCount} of ${maxTurns}`}
                </span>
              </span>

              <button type="button" className={styles.buttonSecondary} onClick={handleRequestHint}>
                <span>💡</span>
                <span>{isFa ? "راهنمایی جمله" : "Request Hint"}</span>
              </button>

              <button type="button" className={styles.buttonSecondary} onClick={handleManualComplete}>
                <span>🏁</span>
                <span>{isFa ? "پایان و گزارش" : "Conclude"}</span>
              </button>
            </div>
          </div>

          {/* Goal Checklist Tracker */}
          <div className={styles.goalsTrackerBar}>
            <div className={styles.goalsTrackerHeader}>
              <span>
                {isFa ? "پیشرفت اهداف مکالمه سناریو:" : "Scenario Goal Milestones:"}
              </span>
              <span>
                {goalsCompleted.length} / {activeScenario.goals.length}{" "}
                {isFa ? "هدف تکمیل شده" : "goals achieved"}
              </span>
            </div>
            <div className={styles.goalsList}>
              {activeScenario.goals.map((g) => {
                const isAchieved = goalsCompleted.includes(g.id);
                return (
                  <span
                    key={g.id}
                    className={`${styles.goalPill} ${isAchieved ? styles.goalPillAchieved : ""}`}
                  >
                    <span>{isAchieved ? "✓" : "○"}</span>
                    <span>{isFa ? g.description_fa : g.description_en}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Hint Banner */}
          {hint && (
            <div className={styles.hintBanner}>
              <div>
                <strong>{isFa ? "نکته کمکی: " : "Speaking Hint: "}</strong>
                <span>{isFa ? hint.fa : hint.en}</span>
              </div>
              <button
                type="button"
                className={styles.buttonSecondary}
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                onClick={() => setHint(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Transcript Area */}
          <div className={styles.transcriptArea}>
            {messages.map((m) => {
              const isLearner = m.sender === "learner";
              return (
                <div
                  key={m.id}
                  className={`${styles.messageBubbleWrapper} ${
                    isLearner ? styles.learnerWrapper : styles.characterWrapper
                  }`}
                >
                  <span className={styles.bubbleSenderName}>
                    {isLearner
                      ? isFa ? "شما" : "You"
                      : isFa ? activeScenario.character.name_fa : activeScenario.character.name_en}
                  </span>
                  <div
                    className={`${styles.messageBubble} ${
                      isLearner ? styles.learnerBubble : styles.characterBubble
                    }`}
                    dir="ltr"
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suggested Prompts Shelf */}
          <div className={styles.promptsShelf}>
            <span className={styles.promptsShelfTitle}>
              {isFa ? "جملات پیشنهادی برای پاسخ سریع:" : "Suggested Responses For Your Turn:"}
            </span>
            <div className={styles.promptsButtonsGroup}>
              {activeScenario.suggested_prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  dir="ltr"
                  className={styles.promptChip}
                  onClick={() => handleSendMessage(p)}
                  disabled={isSubmitting}
                >
                  &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Input Toolbar */}
          <div className={styles.inputToolbar}>
            <input
              type="text"
              dir="ltr"
              className={styles.textInput}
              value={inputText}
              maxLength={500}
              placeholder={isFa ? "پاسخ انگلیسی خود را تایپ کنید (حداکثر ۵۰۰ نویسه)..." : "Type your English response (max 500 characters)..."}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isSubmitting}
            >
              {isSubmitting ? (isFa ? "در حال ارسال..." : "Sending...") : isFa ? "ارسال نوبت" : "Send Turn"}
            </button>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => setSessionStatus("catalog")}
            >
              {isFa ? "تغییر سناریو" : "Switch Scenario"}
            </button>
          </div>
        </section>
      )}

      {/* VIEW 3: POST-CONVERSATION DIAGNOSTIC REPORT */}
      {sessionStatus === "completed" && report && (
        <section className={styles.reportCard}>
          {/* Celebration Header */}
          <div className={styles.reportCelebration}>
            <div>
              <h2 className={styles.reportCelebrationTitle}>
                {isFa ? "گزارش جامع تشخیصی مکالمه (Post-Conversation Report)" : "Post-Conversation Diagnostic Report"}
              </h2>
              <p className={styles.reportCelebrationSubtitle}>
                {isFa
                  ? `تمرین سناریوی "${activeScenario.title_fa}" با موفقیت پایان یافت.`
                  : `Roleplay simulation for "${activeScenario.title_en}" concluded successfully.`}
              </p>
            </div>
            <div className={styles.xpBadgeContainer}>
              <span>⭐</span>
              <span>+50 XP</span>
            </div>
          </div>

          {/* Notification feedback if mistake or vocab saved */}
          {actionFeedback && (
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                backgroundColor: "var(--color-success-surface)",
                color: "var(--color-success)",
                borderRadius: "var(--radius-control)",
                fontWeight: 600,
                fontSize: "var(--font-size-meta)",
              }}
            >
              {actionFeedback}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className={styles.reportMetricsGrid}>
            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>
                {isFa ? "نمره روانی و ارتباطی" : "Communicative Score"}
              </span>
              <span className={styles.metricValue}>{report.communicative_score} / 100</span>
            </div>

            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>
                {isFa ? "سطح تقریبی CEFR" : "Estimated CEFR Band"}
              </span>
              <span className={styles.metricValue}>{report.estimated_cefr}</span>
            </div>

            <div className={styles.metricTile}>
              <span className={styles.metricLabel}>
                {isFa ? "اهداف ارتباطی محقق‌شده" : "Goals Achieved"}
              </span>
              <span className={styles.metricValue}>
                {report.goals_achieved_count} / {report.total_goals_count}
              </span>
            </div>
          </div>

          {/* Accomplishments Section */}
          <div className={styles.reportSection}>
            <h3 className={styles.reportSectionTitle}>
              <span>🏆</span>
              <span>{isFa ? "دستاوردهای ارتباطی در این سناریو:" : "Communicative Accomplishments:"}</span>
            </h3>
            <ul style={{ margin: 0, paddingInlineStart: "var(--space-5)", lineHeight: 1.8 }}>
              {(isFa ? report.accomplishments_fa : report.accomplishments_en).map((acc, idx) => (
                <li key={idx} style={{ color: "var(--color-text)", fontSize: "var(--font-size-body)" }}>
                  {acc}
                </li>
              ))}
            </ul>
          </div>

          {/* Deferred Mistakes Section with Genome Ingestion */}
          <div className={styles.reportSection}>
            <h3 className={styles.reportSectionTitle}>
              <span>🧬</span>
              <span>{isFa ? "تحلیل گرامری و خطاهای زبانی (مؤخر)" : "Deferred Grammatical & Structural Feedback:"}</span>
            </h3>
            <p className={styles.reportSectionSubtitle}>
              {isFa
                ? "برای حفظ غوطه‌وری و پیوستگی مکالمه، هیچ خطایی در حین صحبت قطع نشد. خطاهای زیر را می‌توانید به ژنوم اشتباهات خود بیفزایید تا در تمرین‌های آینده تقویت شوند."
                : "Zero mid-turn interruptions occurred during dialogue. Review deferred patterns below and add them to your Mistake Genome for targeted practice."}
            </p>

            {report.feedback_mistakes.length === 0 ? (
              <p style={{ color: "var(--color-success)", fontWeight: 600 }}>
                {isFa ? "✓ هیچ خطای ساختاری تکرارشونده‌ای در این جلسه شناسایی نشد. آفرین!" : "✓ No recurrent grammatical mistakes detected in this session. Well done!"}
              </p>
            ) : (
              <div className={styles.mistakeList}>
                {report.feedback_mistakes.map((mst) => (
                  <div
                    key={mst.id}
                    className={`${styles.mistakeCard} ${mst.accepted ? styles.mistakeCardAccepted : ""}`}
                  >
                    <div className={styles.mistakeCardHeader}>
                      <span className={styles.mistakeTitle}>
                        {isFa ? mst.title_fa : mst.title_en}
                      </span>
                      {mst.accepted ? (
                        <span style={{ color: "var(--color-success)", fontSize: "var(--font-size-meta)", fontWeight: 700 }}>
                          ✓ {isFa ? "در ژنوم ثبت شد" : "Added to Mistake Genome"}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={styles.buttonSecondary}
                          style={{ padding: "0.25rem 0.75rem", fontSize: "var(--font-size-meta)" }}
                          onClick={() => handleAcceptMistake(mst.id)}
                        >
                          {isFa ? "افزودن به ژنوم اشتباهات" : "Add to Mistake Genome"}
                        </button>
                      )}
                    </div>

                    <div className={styles.mistakeComparison}>
                      <span className={mst.original ? styles.mistakeOriginal : ""}>
                        &ldquo;{mst.original}&rdquo;
                      </span>
                      <span>→</span>
                      <span className={styles.mistakeCorrected}>
                        &ldquo;{mst.corrected}&rdquo;
                      </span>
                    </div>

                    <p className={styles.mistakeExplanation}>
                      {isFa ? mst.explanation_fa : mst.explanation_en}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extracted Target Vocabulary Section with SRS Ingestion */}
          <div className={styles.reportSection}>
            <h3 className={styles.reportSectionTitle}>
              <span>📚</span>
              <span>{isFa ? "واژگان کلیدی استخراج‌شده (Target Vocabulary):" : "Extracted Target Vocabulary:"}</span>
            </h3>
            <p className={styles.reportSectionSubtitle}>
              {isFa
                ? "واژگان هدف استفاده‌شده یا توصیه‌شده در این سناریو را مستقیماً به جعبه مرور لغات (SRS) خود منتقل کنید."
                : "Save scenario vocabulary directly into your active Spaced Repetition (SRS) deck."}
            </p>

            <div className={styles.vocabGrid}>
              {report.vocabulary_extracted.map((v, idx) => {
                const lemma = v.lemma || v.word.toLowerCase();
                return (
                  <div key={idx} className={styles.vocabCard}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-2)" }}>
                        <span className={styles.vocabTerm}>{v.word}</span>
                        <span className={styles.vocabLevelBadge}>{v.level}</span>
                      </div>
                      <p className={styles.vocabDefinition}>{v.definition}</p>
                      {v.meaning_fa && <p className={styles.vocabMeaningFa}>{v.meaning_fa}</p>}
                    </div>

                    <div style={{ marginBlockStart: "var(--space-3)" }}>
                      {v.saved_to_srs ? (
                        <span style={{ color: "var(--color-success)", fontSize: "var(--font-size-meta)", fontWeight: 700 }}>
                          ✓ {isFa ? "در جعبه لغات ذخیره شد" : "Saved to SRS Deck"}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={styles.buttonSecondary}
                          style={{ width: "100%", padding: "0.25rem 0.5rem", fontSize: "var(--font-size-meta)" }}
                          onClick={() => handleSaveSrsWord(lemma)}
                        >
                          {isFa ? "ذخیره در جعبه مرور (SRS)" : "Save to SRS Deck"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "var(--space-3)", marginBlockStart: "var(--space-4)", flexWrap: "wrap" }}>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={() => setSessionStatus("catalog")}
            >
              {isFa ? "تمرین یک سناریوی جدید" : "Practice Another Scenario"}
            </button>
            <Link href="/dashboard" className={styles.buttonSecondary}>
              {isFa ? "مشاهده پیشرفت در داشبورد" : "View Dashboard Progress"}
            </Link>
          </div>
        </section>
      )}

      {/* Pedagogical Footer Disclaimer */}
      <footer className={styles.disclaimer}>
        {isFa
          ? "نکته آموزشی: تمرین نقش‌آفرینی زبانی (Roleplay Universe) برای شبیه‌سازی مکالمات پیش‌بینی‌نشده بین‌المللی با تمرکز بر انتقال پیام، افزایش اعتمادبه‌نفس گفتاری و تحلیل مؤخر بدون تخریب روانی طراحی شده است."
          : "Pedagogical Note: Endoora Roleplay Universe prepares learners for spontaneous communication through situational simulation. Turn-by-turn dialogue prioritizes communicative confidence, deferring all diagnostics to protect immersion."}
      </footer>
    </div>
  );
}
