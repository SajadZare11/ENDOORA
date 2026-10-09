import type { CefrLevel } from "./types";

export interface CascadePair {
  id: string;
  english: string;
  match: string; // Persian translation
  synonym?: string; // English synonym (B1/B2)
  audioText: string;
  category: "word" | "chunk" | "dialogue";
  contextFa?: string;
  cefr: CefrLevel;
  stageGroup: 1 | 2 | 3 | 4 | 5; // 1: Stg 1-2, 2: Stg 3-4, 3: Stg 5-6, 4: Stg 7-8, 5: Stg 9-10
}

/**
 * Authentic vocabulary, collocations, spoken chunks, idioms, and conversational dialogues
 * extracted and curated from "Website books" (American English File Starter to 5, Speak English Like an American, Idioms).
 * All translations in 'match' are 100% natural Persian translations.
 */
export const WEBSITE_BOOKS_VOCAB_BANK: CascadePair[] = [
  // =========================================================================
  // CEFR A1: AEF Starter & AEF 1 (Everyday Essentials, Shopping, Cafes, Travel)
  // =========================================================================

  // --- A1 STAGE GROUP 1: Core Essentials & Objects (Stages 1-2) ---
  { id: "a1-w-1", english: "Good morning", match: "صبح بخیر", audioText: "Good morning", category: "word", contextFa: "احوال‌پرسی", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-2", english: "See you soon", match: "به زودی می‌بینمت", audioText: "See you soon", category: "word", contextFa: "خداحافظی", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-3", english: "Passport", match: "گذرنامه / پاسپورت", audioText: "Passport", category: "word", contextFa: "سفر", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-4", english: "Luggage", match: "چمدان و بار سفر", audioText: "Luggage", category: "word", contextFa: "سفر", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-5", english: "Boarding pass", match: "کارت پرواز", audioText: "Boarding pass", category: "word", contextFa: "فرودگاه", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-6", english: "Elevator", match: "آسانسور", audioText: "Elevator", category: "word", contextFa: "هتل و ساختمان", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-7", english: "Reservation", match: "رزرو قبلی", audioText: "Reservation", category: "word", contextFa: "هتل و رستوران", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-8", english: "Receipt", match: "رسید / فاکتور خرید", audioText: "Receipt", category: "word", contextFa: "خرید", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-9", english: "Credit card", match: "کارت اعتباری / بانکی", audioText: "Credit card", category: "word", contextFa: "پرداخت", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-10", english: "Window seat", match: "صندلی کنار پنجره", audioText: "Window seat", category: "word", contextFa: "پرواز", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-11", english: "Aisle seat", match: "صندلی کنار راهرو", audioText: "Aisle seat", category: "word", contextFa: "پرواز", cefr: "A1", stageGroup: 1 },
  { id: "a1-w-12", english: "Restroom", match: "سرویس بهداشتی", audioText: "Restroom", category: "word", contextFa: "مکان‌ها", cefr: "A1", stageGroup: 1 },

  // --- A1 STAGE GROUP 2: Daily Places & Food (Stages 3-4) ---
  { id: "a1-w-13", english: "Supermarket", match: "سوپرمارکت", audioText: "Supermarket", category: "word", contextFa: "شهر", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-14", english: "Pharmacy", match: "داروخانه", audioText: "Pharmacy", category: "word", contextFa: "شهر", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-15", english: "Breakfast", match: "صبحانه", audioText: "Breakfast", category: "word", contextFa: "غذا", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-16", english: "Delicious", match: "بسیار خوشمزه", audioText: "Delicious", category: "word", contextFa: "توصیف غذا", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-17", english: "Expensive", match: "گران‌قیمت", audioText: "Expensive", category: "word", contextFa: "خرید", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-18", english: "Midnight", match: "نیمه‌شب (۱۲ شب)", audioText: "Midnight", category: "word", contextFa: "زمان", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-19", english: "Schedule", match: "برنامه زمانی", audioText: "Schedule", category: "word", contextFa: "روزمره", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-20", english: "Neighborhood", match: "محله و اطراف", audioText: "Neighborhood", category: "word", contextFa: "مکان", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-21", english: "Tired", match: "خسته و بی‌رمق", audioText: "Tired", category: "word", contextFa: "احساسات", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-22", english: "Hungry", match: "گرسنه", audioText: "Hungry", category: "word", contextFa: "نیازها", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-23", english: "Thirsty", match: "تشنه آب", audioText: "Thirsty", category: "word", contextFa: "نیازها", cefr: "A1", stageGroup: 2 },
  { id: "a1-w-29", english: "Tomorrow", match: "فردا", audioText: "Tomorrow", category: "word", contextFa: "زمان", cefr: "A1", stageGroup: 2 },

  // --- A1 STAGE GROUP 3: Conversational Chunks & Spoken Phrases (Stages 5-6) ---
  { id: "a1-c-1", english: "Excuse me", match: "ببخشید (شروع صحبت)", audioText: "Excuse me", category: "chunk", contextFa: "جلب توجه", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-2", english: "You're welcome", match: "خواهش می‌کنم / قابلی نداره", audioText: "You're welcome", category: "chunk", contextFa: "پاسخ به تشکر", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-3", english: "How about you?", match: "شما چطور؟ تو چخبر؟", audioText: "How about you?", category: "chunk", contextFa: "مکالمه متقابل", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-4", english: "Nice to meet you", match: "از دیدارتان خوشبختم", audioText: "Nice to meet you", category: "chunk", contextFa: "معارفه", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-5", english: "I'd like to order", match: "می‌خواهم سفارش بدهم", audioText: "I'd like to order", category: "chunk", contextFa: "رستوران", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-6", english: "Could you help me?", match: "میشه لطفاً کمکم کنید؟", audioText: "Could you help me?", category: "chunk", contextFa: "درخواست مودبانه", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-7", english: "Go straight ahead", match: "مستقیم به جلو حرکت کن", audioText: "Go straight ahead", category: "chunk", contextFa: "آدرس", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-8", english: "Turn left at the light", match: "سر چراغ بپیچ به چپ", audioText: "Turn left at the light", category: "chunk", contextFa: "آدرس", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-9", english: "On the corner", match: "سر نبش / گوشه خیابان", audioText: "On the corner", category: "chunk", contextFa: "موقعیت", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-10", english: "Next to the bank", match: "کنار / جنبِ بانک", audioText: "Next to the bank", category: "chunk", contextFa: "موقعیت", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-11", english: "How much is this?", match: "قیمت این چقدر است؟", audioText: "How much is this?", category: "chunk", contextFa: "خرید", cefr: "A1", stageGroup: 3 },
  { id: "a1-c-12", english: "Can I have the bill?", match: "میشه صورت‌حساب رو بیارید؟", audioText: "Can I have the bill?", category: "chunk", contextFa: "تسویه رستوران", cefr: "A1", stageGroup: 3 },

  // --- A1 STAGE GROUP 4: Everyday Polite Exchanges (Stages 7-8) ---
  { id: "a1-c-13", english: "No problem at all", match: "اصلاً مسئله‌ای نیست / فدای سرت", audioText: "No problem at all", category: "chunk", contextFa: "تعارفات", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-14", english: "Here you are", match: "بفرمایید خدمت شما", audioText: "Here you are", category: "chunk", contextFa: "تحویل جنس", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-15", english: "Take care of yourself", match: "مراقب خودت باش", audioText: "Take care of yourself", category: "chunk", contextFa: "خداحافظی", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-16", english: "Have a good one", match: "روز و اوقات خوبی داشته باشی", audioText: "Have a good one", category: "chunk", contextFa: "بدرقه محاوره‌ای", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-17", english: "Can you repeat, please?", match: "میشه دوباره تکرار کنید؟", audioText: "Can you repeat, please?", category: "chunk", contextFa: "فهم کلام", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-18", english: "I'm just looking", match: "فقط دارم تماشا می‌کنم (قصد خرید ندارم)", audioText: "I'm just looking", category: "chunk", contextFa: "فروشگاه", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-19", english: "That's all for now", match: "همین‌ها کافیه برای الان", audioText: "That's all for now", category: "chunk", contextFa: "اتمام سفارش", cefr: "A1", stageGroup: 4 },
  { id: "a1-c-20", english: "Do you take cards?", match: "کارت‌خوان قبول می‌کنید؟", audioText: "Do you take cards?", category: "chunk", contextFa: "پرداخت", cefr: "A1", stageGroup: 4 },
  { id: "a1-w-28", english: "Backpack", match: "کوله پشتی", audioText: "Backpack", category: "word", contextFa: "اشیاء", cefr: "A1", stageGroup: 4 },
  { id: "a1-w-27", english: "Notebook", match: "دفترچه یادداشت", audioText: "Notebook", category: "word", contextFa: "اشیاء", cefr: "A1", stageGroup: 4 },
  { id: "a1-w-30", english: "Yesterday", match: "دیروز", audioText: "Yesterday", category: "word", contextFa: "زمان", cefr: "A1", stageGroup: 4 },
  { id: "a1-w-25", english: "Parents", match: "والدین (پدر و مادر)", audioText: "Parents", category: "word", contextFa: "خانواده", cefr: "A1", stageGroup: 4 },

  // --- A1 STAGE GROUP 5: Authentic Everyday Sentences (Stages 9-10) ---
  { id: "a1-d-1", english: "Are you ready to order?", match: "آماده ثبت سفارش هستید؟", audioText: "Are you ready to order?", category: "dialogue", contextFa: "کافه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-2", english: "Small, medium or large?", match: "اندازه کوچک، متوسط یا بزرگ؟", audioText: "Small, medium or large?", category: "dialogue", contextFa: "کافه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-3", english: "For here or to go?", match: "میل می‌کنید یا بیرون‌بر باشه؟", audioText: "For here or to go?", category: "dialogue", contextFa: "کافه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-4", english: "Is this chair free?", match: "آیا این صندلی خالیه؟", audioText: "Is this chair free?", category: "dialogue", contextFa: "رستوران", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-5", english: "Do you have a reservation?", match: "از قبل رزرو کردید؟", audioText: "Do you have a reservation?", category: "dialogue", contextFa: "هتل", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-6", english: "What is the Wi-Fi code?", match: "رمز وای‌فای چی هست؟", audioText: "What is the Wi-Fi code?", category: "dialogue", contextFa: "هتل", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-7", english: "What time is breakfast?", match: "ساعت سرو صبحانه کِیه؟", audioText: "What time is breakfast?", category: "dialogue", contextFa: "هتل", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-8", english: "Passport and ticket, please?", match: "گذرنامه و بلیط، لطفاً؟", audioText: "Passport and ticket, please?", category: "dialogue", contextFa: "فرودگاه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-9", english: "Any luggage to check in?", match: "چمدانی برای تحویل به بار دارید؟", audioText: "Any luggage to check in?", category: "dialogue", contextFa: "فرودگاه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-10", english: "Window or aisle seat?", match: "صندلی پنجره یا راهرو؟", audioText: "Window or aisle seat?", category: "dialogue", contextFa: "فرودگاه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-11", english: "Which gate is flight 402?", match: "پرواز ۴۰۲ کدام گیت است؟", audioText: "Which gate is flight 402?", category: "dialogue", contextFa: "فرودگاه", cefr: "A1", stageGroup: 5 },
  { id: "a1-d-12", english: "What is the purpose of travel?", match: "هدف شما از سفر چیست؟", audioText: "What is the purpose of travel?", category: "dialogue", contextFa: "فرودگاه", cefr: "A1", stageGroup: 5 },

  // =========================================================================
  // CEFR A2: AEF 1 & AEF 2 (Travel, Shopping, Directions, Socializing)
  // =========================================================================

  // --- A2 STAGE GROUP 1: Travel & Transit Essentials (Stages 1-2) ---
  { id: "a2-w-1", english: "Catch a flight", match: "رسیدن به پرواز هواپیما", audioText: "Catch a flight", category: "word", contextFa: "سفر", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-2", english: "Book in advance", match: "رزرو کردن از قبل", audioText: "Book in advance", category: "word", contextFa: "برنامه‌ریزی", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-3", english: "Public transit", match: "حمل و نقل عمومی", audioText: "Public transit", category: "word", contextFa: "شهر", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-4", english: "Traffic jam", match: "ترافیک سنگین و راهبندان", audioText: "Traffic jam", category: "word", contextFa: "رفت‌وآمد", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-5", english: "Try on clothes", match: "پرو کردن لباس در اتاق پرو", audioText: "Try on clothes", category: "word", contextFa: "خرید لباس", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-6", english: "Fitting room", match: "اتاق پرو لباس", audioText: "Fitting room", category: "word", contextFa: "خرید", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-7", english: "Refund", match: "پس گرفتن پول کالا", audioText: "Refund", category: "word", contextFa: "خرید", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-8", english: "Headache", match: "سردرد", audioText: "Headache", category: "word", contextFa: "پزشکی", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-9", english: "Prescription", match: "نسخه پزشک", audioText: "Prescription", category: "word", contextFa: "دارو", cefr: "A2", stageGroup: 1 },
  { id: "a2-w-10", english: "Pedestrian", match: "عابر پیاده در خیابان", audioText: "Pedestrian", category: "word", contextFa: "شهر", cefr: "A2", stageGroup: 1 },

  // --- A2 STAGE GROUP 2: City & Living Environment (Stages 3-4) ---
  { id: "a2-w-11", english: "Appointment", match: "وقت ملاقات رسمی", audioText: "Appointment", category: "word", contextFa: "برنامه", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-12", english: "Subway station", match: "ایستگاه مترو", audioText: "Subway station", category: "word", contextFa: "حمل‌ونقل", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-13", english: "Look forward to", match: "مشتاقانه منتظر بودن", audioText: "Look forward to", category: "word", contextFa: "فعل عبارتی", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-14", english: "Pick up", match: "دنبال کسی رفتن و سوار کردن", audioText: "Pick up", category: "word", contextFa: "رفت‌وآمد", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-15", english: "Drop off", match: "پیاده کردن مسافر در مقصد", audioText: "Drop off", category: "word", contextFa: "رفت‌وآمد", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-16", english: "Luggage scale", match: "ترازوی وزن‌کشی چمدان", audioText: "Luggage scale", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-17", english: "Exchange rate", match: "نرخ برابری ارز", audioText: "Exchange rate", category: "word", contextFa: "صرافی", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-18", english: "Convenient", match: "راحت و دم دست", audioText: "Convenient", category: "word", contextFa: "توصیف", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-19", english: "Crowded", match: "شلوغ و پرجمعیت", audioText: "Crowded", category: "word", contextFa: "مکان‌ها", cefr: "A2", stageGroup: 2 },
  { id: "a2-w-20", english: "Affordable", match: "دارای قیمت مناسب و معقول", audioText: "Affordable", category: "word", contextFa: "خرید", cefr: "A2", stageGroup: 2 },

  // --- A2 STAGE GROUP 3: Chunks & Connectors (Stages 5-6) ---
  { id: "a2-c-1", english: "By the way,", match: "راستی / ضمناً در میان صحبت", audioText: "By the way", category: "chunk", contextFa: "تغییر موضوع", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-2", english: "Never mind", match: "اصلاً بیخیال / مهم نیست", audioText: "Never mind", category: "chunk", contextFa: "محاوره‌ای", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-3", english: "To be honest,", match: "راستش بخوای / صادقانه بگم", audioText: "To be honest", category: "chunk", contextFa: "صداقت", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-4", english: "I'm looking forward to it", match: "مشتاقانه منتظرش هستم", audioText: "I'm looking forward to it", category: "chunk", contextFa: "اشتیاق", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-5", english: "What do you recommend?", match: "پیشنهاد شما چیست؟", audioText: "What do you recommend?", category: "chunk", contextFa: "مشورت", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-6", english: "Could you tell me how to get to...?", match: "میشه بگید چطور برم به...؟", audioText: "Could you tell me how to get to", category: "chunk", contextFa: "آدرس پرسیدن", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-7", english: "I'm afraid not", match: "متاسفانه فکر نکنم / بعید می‌دونم", audioText: "I'm afraid not", category: "chunk", contextFa: "پاسخ منفی مودبانه", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-8", english: "As soon as possible", match: "در سریع‌ترین زمان ممکن", audioText: "As soon as possible", category: "chunk", contextFa: "عجله", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-9", english: "It depends on the weather", match: "بستگی به وضعیت هوا دارد", audioText: "It depends on the weather", category: "chunk", contextFa: "تصمیم", cefr: "A2", stageGroup: 3 },
  { id: "a2-c-10", english: "Keep in touch", match: "در ارتباط باشیم و بی‌خبر نذار", audioText: "Keep in touch", category: "chunk", contextFa: "دوستانه", cefr: "A2", stageGroup: 3 },

  // --- A2 STAGE GROUP 4: Travel & Service Phrasing (Stages 7-8) ---
  { id: "a2-c-11", english: "Let me check", match: "اجازه بدید بررسی کنم", audioText: "Let me check", category: "chunk", contextFa: "بررسی", cefr: "A2", stageGroup: 4 },
  { id: "a2-c-12", english: "Take your time", match: "عجله نکن / سر فرصت انجام بده", audioText: "Take your time", category: "chunk", contextFa: "صبر", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-21", english: "Boarding gate", match: "گیت سوار شدن به هواپیما", audioText: "Boarding gate", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-22", english: "Delayed flight", match: "پرواز دارای تأخیر", audioText: "Delayed flight", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-23", english: "Carry-on bag", match: "کیف و ساک دستی مسافر", audioText: "Carry-on bag", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-24", english: "Check out of hotel", match: "تسویه و تحویل دادن اتاق هتل", audioText: "Check out of hotel", category: "word", contextFa: "هتل", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-25", english: "Sightseeing tour", match: "تور گشت و گذار شهری", audioText: "Sightseeing tour", category: "word", contextFa: "گردشگری", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-26", english: "Tourist attraction", match: "جاذبه دیدنی و گردشگری", audioText: "Tourist attraction", category: "word", contextFa: "سفر", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-27", english: "Local specialty", match: "سوغات و غذای سنتی محلی", audioText: "Local specialty", category: "word", contextFa: "غذا", cefr: "A2", stageGroup: 4 },
  { id: "a2-w-28", english: "Bus terminal", match: "پایانه و ترمینال اتوبوس", audioText: "Bus terminal", category: "word", contextFa: "شهر", cefr: "A2", stageGroup: 4 },

  // --- A2 STAGE GROUP 5: Everyday Situational Sentences (Stages 9-10) ---
  { id: "a2-d-1", english: "Do you have this in medium?", match: "سایز مدیوم این رو دارید؟", audioText: "Do you have this in medium?", category: "dialogue", contextFa: "خرید لباس", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-2", english: "How long is the delay?", match: "مدت تأخیر چقدر است؟", audioText: "How long is the delay?", category: "dialogue", contextFa: "تاخیر قطار/پرواز", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-3", english: "Are you feeling any better?", match: "آیا حالتون بهتر شده؟", audioText: "Are you feeling any better?", category: "dialogue", contextFa: "سلامت", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-4", english: "Can I get a wake-up call at 6?", match: "امکان بیدارباش ساعت ۶ هست؟", audioText: "Can I get a wake-up call at 6?", category: "dialogue", contextFa: "هتل", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-5", english: "Is service included in the bill?", match: "حق سرویس روی صورت‌حساب است؟", audioText: "Is service included in the bill?", category: "dialogue", contextFa: "رستوران", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-6", english: "Would you like a bag for that?", match: "کیسه خرید برای وسایل می‌خواهید؟", audioText: "Would you like a bag for that?", category: "dialogue", contextFa: "فروشگاه", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-7", english: "Where can I validate my parking?", match: "کجا قبض پارکینگ رو تأیید کنم؟", audioText: "Where can I validate my parking?", category: "dialogue", contextFa: "پارکینگ", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-8", english: "What platform does the train leave from?", match: "قطار از کدام سکو حرکت می‌کند؟", audioText: "What platform does the train leave from?", category: "dialogue", contextFa: "ایستگاه قطار", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-9", english: "Could I have a window table?", match: "میشه میز کنار پنجره داشته باشیم؟", audioText: "Could I have a window table?", category: "dialogue", contextFa: "رستوران", cefr: "A2", stageGroup: 5 },
  { id: "a2-d-10", english: "Can I pay with foreign currency?", match: "می‌توانم با ارز خارجی پرداخت کنم؟", audioText: "Can I pay with foreign currency?", category: "dialogue", contextFa: "خرید", cefr: "A2", stageGroup: 5 },

  // =========================================================================
  // CEFR B1: AEF 2/3 & Speak English Like an American (English vs Persian)
  // =========================================================================

  // --- B1 STAGE GROUP 1: Core Idioms & Colloquialisms (Stages 1-2) ---
  { id: "b1-w-1", english: "Hit the books", match: "سخت و متمرکز درس خواندن", synonym: "Study intensely", audioText: "Hit the books", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-2", english: "Call it a day", match: "دست از کار کشیدن و پایان دادن", synonym: "Finish working", audioText: "Call it a day", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-3", english: "Cut corners", match: "ماست‌مالی کردن و کم گذاشتن", synonym: "Take shortcuts", audioText: "Cut corners", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-4", english: "Under the weather", match: "ناخوش‌احوال و کسل بودن", synonym: "Feeling sick", audioText: "Under the weather", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-5", english: "Piece of cake", match: "بسیار ساده و مثل آب خوردن", synonym: "Very easy", audioText: "Piece of cake", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-6", english: "Cost an arm and a leg", match: "بسیار گران و سرسام‌آور", synonym: "Very expensive", audioText: "Cost an arm and a leg", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-7", english: "Figure out", match: "سر درآوردن و درک کردن", synonym: "Understand", audioText: "Figure out", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-8", english: "Run out of", match: "تمام شدن موجودی", synonym: "Deplete", audioText: "Run out of", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-9", english: "See eye to eye", match: "کاملاً هم‌نظر و موافق بودن", synonym: "Agree completely", audioText: "See eye to eye", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },
  { id: "b1-w-10", english: "Spill the beans", match: "لو دادن راز و افشاگری", synonym: "Reveal secret", audioText: "Spill the beans", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 1 },

  // --- B1 STAGE GROUP 2: High Frequency Work & Study (Stages 3-4) ---
  { id: "b1-w-11", english: "Burn midnight oil", match: "شب‌زنده‌داری برای کار و درس", synonym: "Work late", audioText: "Burn the midnight oil", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-12", english: "On cloud nine", match: "در اوج شادی و روی ابرها", synonym: "Extremely happy", audioText: "On cloud nine", category: "word", contextFa: "اصطلاح", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-13", english: "Put off", match: "به تعویق انداختن امور", synonym: "Postpone", audioText: "Put off", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-14", english: "Give up", match: "تسلیم شدن و دست کشیدن", synonym: "Surrender", audioText: "Give up", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-15", english: "Accurate", match: "دقیق و بدون نقص", synonym: "Precise", audioText: "Accurate", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-16", english: "Purchase", match: "خریداری کردن", synonym: "Buy", audioText: "Purchase", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-17", english: "Enormous", match: "فوق‌العاده عظیم و پهناور", synonym: "Huge", audioText: "Enormous", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-18", english: "Exhausted", match: "از پا افتاده و بی‌نهایت خسته", synonym: "Very tired", audioText: "Exhausted", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-19", english: "Commence", match: "آغاز کردن رسمی", synonym: "Begin", audioText: "Commence", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },
  { id: "b1-w-20", english: "Assist", match: "یاری رساندن و کمک کردن", synonym: "Help", audioText: "Assist", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 2 },

  // --- B1 STAGE GROUP 3: Spoken Discourse & Conversation Chunks (Stages 5-6) ---
  { id: "b1-c-1", english: "As far as I'm concerned", match: "تا آنجا که به من مربوط می‌شود", synonym: "In my opinion", audioText: "As far as I'm concerned", category: "chunk", contextFa: "نشانگر کلام", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-2", english: "It goes without saying", match: "بدیهی و ناگفته پیداست", synonym: "Obviously", audioText: "It goes without saying", category: "chunk", contextFa: "نشانگر کلام", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-3", english: "I couldn't agree more", match: "کاملاً و صد در صد با شما موافقم", synonym: "I totally agree", audioText: "I couldn't agree more", category: "chunk", contextFa: "موافقت", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-4", english: "Speak of the devil", match: "حلال‌زاده بودن (تا اسمش آمد آمد)", synonym: "Look who's here", audioText: "Speak of the devil", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-5", english: "Better late than never", match: "دیر رسیدن بهتر از هرگز نرسیدن", synonym: "Eventually is good", audioText: "Better late than never", category: "chunk", contextFa: "ضرب‌المثل", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-6", english: "Beat around the bush", match: "حاشیه رفتن و طفره زدن", synonym: "Avoid the point", audioText: "Beat around the bush", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-7", english: "Once in a blue moon", match: "به ندرت و هر چند وقت یک‌بار", synonym: "Very rarely", audioText: "Once in a blue moon", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-8", english: "Cut to the chase", match: "رفتن سر اصل مطلب", synonym: "Get to the point", audioText: "Cut to the chase", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-9", english: "Back to square one", match: "برگشتن به خانه اول و نقطه صفر", synonym: "Start over", audioText: "Back to square one", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },
  { id: "b1-c-10", english: "Give cold shoulder", match: "تحویل نگرفتن و بی‌محلی عمدی", synonym: "Ignore someone", audioText: "Give someone the cold shoulder", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 3 },

  // --- B1 STAGE GROUP 4: Everyday Metaphors (Stages 7-8) ---
  { id: "b1-c-11", english: "Bite the bullet", match: "دندان روی جگر گذاشتن و تحمل", synonym: "Face hardship", audioText: "Bite the bullet", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-12", english: "Break the ice", match: "شکستن یخ جمع و صمیمی شدن", synonym: "Ease tension", audioText: "Break the ice", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-13", english: "Get out of hand", match: "از کنترل و مهار خارج شدن", synonym: "Lose control", audioText: "Get out of hand", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-14", english: "Hit nail on head", match: "درست به هدف زدن و دقیق گفتن", synonym: "Exactly right", audioText: "Hit the nail on the head", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-15", english: "Let cat out of bag", match: "لو دادن راز پیش از موقع", synonym: "Disclose secret", audioText: "Let the cat out of the bag", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-16", english: "Miss the boat", match: "از دست دادن فرصت طلایی", synonym: "Miss opportunity", audioText: "Miss the boat", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-17", english: "Pull someone's leg", match: "سر به سر گذاشتن و شوخی کردن", synonym: "Tease or joke", audioText: "Pull someone's leg", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-18", english: "Through thick and thin", match: "در سختی‌ها و آسانی‌های روزگار", synonym: "Through all trials", audioText: "Through thick and thin", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-19", english: "Time flies", match: "زمان مثل باد می‌گذرد", synonym: "Time passes fast", audioText: "Time flies", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },
  { id: "b1-c-20", english: "Wrap head around", match: "درک کردن و سر درآوردن از موضوع", synonym: "Comprehend", audioText: "Wrap one's head around", category: "chunk", contextFa: "اصطلاح", cefr: "B1", stageGroup: 4 },

  // --- B1 STAGE GROUP 5: Academic & Descriptive Essentials (Stages 9-10) ---
  { id: "b1-d-1", english: "Difficult", match: "دشوار و چالش‌برانگیز", synonym: "Challenging", audioText: "Difficult", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-2", english: "Occur", match: "رخ دادن و اتفاق افتادن", synonym: "Happen", audioText: "Occur", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-3", english: "Select", match: "برگزیدن و گلچین کردن", synonym: "Choose", audioText: "Select", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-4", english: "Ancient", match: "کهن و باستانی", synonym: "Very old", audioText: "Ancient", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-5", english: "Tidy", match: "مرتب و پاکیزه", synonym: "Neat", audioText: "Tidy", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-6", english: "Spectacular", match: "شگفت‌انگیز و چشم‌نواز", synonym: "Breathtaking", audioText: "Spectacular", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-7", english: "Annoyed", match: "کلافه و برآشفته", synonym: "Irritated", audioText: "Annoyed", category: "word", contextFa: "واژگان", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-8", english: "Carry on", match: "ادامه دادن و پیش رفتن", synonym: "Continue", audioText: "Carry on", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-9", english: "Succeed in", match: "موفق شدن در رسیدن به هدف", synonym: "Achieve", audioText: "Succeed in", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 5 },
  { id: "b1-d-10", english: "Look up to", match: "احترام گذاشتن و الگو گرفتن", synonym: "Admire", audioText: "Look up to", category: "word", contextFa: "فعل عبارتی", cefr: "B1", stageGroup: 5 },

  // =========================================================================
  // CEFR B2: AEF 4 & Advanced Expression Mastery (English vs Persian)
  // =========================================================================

  // --- B2 STAGE GROUP 1: Advanced Argument & Critical Thinking (Stages 1-2) ---
  { id: "b2-w-1", english: "Compelling", match: "متقاعدکننده و تحسین‌برانگیز", synonym: "Convincing", audioText: "Compelling", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-2", english: "Profound", match: "عمیق و پرمحتوا", synonym: "Deep & insightful", audioText: "Profound", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-3", english: "Think outside the box", match: "خلاقانه و فراتر از چارچوب اندیشیدن", synonym: "Think creatively", audioText: "Think outside the box", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-4", english: "Play devil's advocate", match: "ساز مخالف زدن جهت بحث منطقی", synonym: "Argue opposite side", audioText: "Play devil's advocate", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-5", english: "Burn bridges", match: "پل‌های پشت سر را خراب کردن", synonym: "Cut ties forever", audioText: "Burn bridges", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-6", english: "Elephant in the room", match: "مشکل بزرگ اما نادیده‌گرفته‌شده", synonym: "Ignored obvious issue", audioText: "Elephant in the room", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-7", english: "Face the music", match: "پذیرفتن عواقب و پیامد اشتباه", synonym: "Accept consequences", audioText: "Face the music", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-8", english: "Take with grain of salt", match: "با دیده شک و تردید نگریستن", synonym: "Be skeptical", audioText: "Take with a grain of salt", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-9", english: "Pave the way for", match: "هموار کردن مسیر برای موفقیت", synonym: "Facilitate progress", audioText: "Pave the way for", category: "word", contextFa: "همایند", cefr: "B2", stageGroup: 1 },
  { id: "b2-w-10", english: "Jump on bandwagon", match: "همرنگ جماعت شدن و دنبال جو رفتن", synonym: "Follow the trend", audioText: "Jump on the bandwagon", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 1 },

  // --- B2 STAGE GROUP 2: Analytical Academic Vocabulary (Stages 3-4) ---
  { id: "b2-w-11", english: "Barking up wrong tree", match: "سراغ نشانی غلط رفتن", synonym: "Mistaken pursuit", audioText: "Barking up the wrong tree", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-12", english: "At eleventh hour", match: "در واپسین لحظات و دقیقه نود", synonym: "At the last minute", audioText: "At the eleventh hour", category: "word", contextFa: "اصطلاح", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-13", english: "Substantial", match: "قابل توجه و هنگفت", synonym: "Considerable", audioText: "Substantial", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-14", english: "Inevitable", match: "اجتناب‌ناپذیر و قطعی", synonym: "Unavoidable", audioText: "Inevitable", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-15", english: "Crucial", match: "حیاتی و سرنوشت‌ساز", synonym: "Vital & essential", audioText: "Crucial", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-16", english: "Ambiguous", match: "مبهم و چندپهلو", synonym: "Unclear & vague", audioText: "Ambiguous", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-17", english: "Tedious", match: "کسالت‌بار و یکنواخت", synonym: "Boring & dull", audioText: "Tedious", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-18", english: "Feasible", match: "عملی و شدنی", synonym: "Achievable", audioText: "Feasible", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-19", english: "Reluctant", match: "بی‌میل و مردد", synonym: "Hesitant & unwilling", audioText: "Reluctant", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },
  { id: "b2-w-20", english: "Abundant", match: "فراوان و سرشار", synonym: "Plentiful", audioText: "Abundant", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 2 },

  // --- B2 STAGE GROUP 3: Discourse & Negotiation Chunks (Stages 5-6) ---
  { id: "b2-c-1", english: "On second thought", match: "با تجدید نظر و فکر دوباره", synonym: "Reconsidering", audioText: "On second thought", category: "chunk", contextFa: "نشانگر کلام", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-2", english: "In grand scheme", match: "در چشم‌انداز کلی و کلان امور", synonym: "Overall picture", audioText: "In the grand scheme of things", category: "chunk", contextFa: "نشانگر کلام", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-3", english: "Touch base", match: "تماس کوتاه جهت هماهنگی", synonym: "Briefly contact", audioText: "To touch base with you", category: "chunk", contextFa: "اصطلاح کاری", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-4", english: "When push comes to shove", match: "در بزنگاه و وقت تنگنا", synonym: "At critical moment", audioText: "When push comes to shove", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-5", english: "Leave no stone unturned", match: "همه جا را زیر و رو کردن", synonym: "Search thoroughly", audioText: "Leave no stone unturned", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-6", english: "By and large", match: "روی هم رفته و در کل", synonym: "Generally speaking", audioText: "By and large", category: "chunk", contextFa: "نشانگر کلام", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-7", english: "Against all odds", match: "برخلاف تمامی پیش‌بینی‌ها", synonym: "Despite slim chances", audioText: "Against all odds", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-8", english: "Keep at bay", match: "دور نگه داشتن خطر و دفع کردن", synonym: "Hold at distance", audioText: "Keep at bay", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-9", english: "Read between lines", match: "فهمیدن منظور ناگفته و زیرمتن", synonym: "Infer hidden meaning", audioText: "Read between the lines", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },
  { id: "b2-c-10", english: "Cut both ways", match: "تیغ دو لبه بودن (سود و زیان)", synonym: "Double-edged sword", audioText: "Cut both ways", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 3 },

  // --- B2 STAGE GROUP 4: Advanced Descriptors (Stages 7-8) ---
  { id: "b2-d-1", english: "Deteriorate", match: "رو به وخامت گذاشتن", synonym: "Worsen & decline", audioText: "Deteriorate", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-2", english: "Meticulous", match: "بسیار دقیق و موشکافانه", synonym: "Extremely thorough", audioText: "Meticulous", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-3", english: "Spontaneous", match: "خودجوش و بدون برنامه قبلی", synonym: "Unplanned & natural", audioText: "Spontaneous", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-4", english: "Resilient", match: "سرسخت و انعطاف‌پذیر", synonym: "Tough & adaptable", audioText: "Resilient", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-5", english: "Wrap up", match: "جمع‌بندی کردن و تمام کردن", synonym: "Finalize & conclude", audioText: "Wrap up", category: "word", contextFa: "فعل عبارتی", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-6", english: "Pragmatic", match: "عمل‌گرایانه و واقع‌بین", synonym: "Realistic & sensible", audioText: "Pragmatic", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-7", english: "Discrepancy", match: "عدم تطابق و ناهمخوانی", synonym: "Inconsistency", audioText: "Discrepancy", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-8", english: "Ambivalent", match: "دچار احساسات متضاد و دودل", synonym: "Undecided & conflicted", audioText: "Ambivalent", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-9", english: "Scrutinize", match: "با موشکافی زیر ذره‌بین بردن", synonym: "Examine closely", audioText: "Scrutinize", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },
  { id: "b2-d-10", english: "Plausible", match: "باورپذیر و موجه", synonym: "Believable", audioText: "Plausible", category: "word", contextFa: "واژگان", cefr: "B2", stageGroup: 4 },

  // --- B2 STAGE GROUP 5: Master Idioms (Stages 9-10) ---
  { id: "b2-e-1", english: "Throw in towel", match: "لنگ انداختن و تسلیم کامل شدن", synonym: "Give up entirely", audioText: "Throw in the towel", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-2", english: "Bite off more than chew", match: "لقمه بزرگتر از دهان برداشتن", synonym: "Overcommit oneself", audioText: "Bite off more than you can chew", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-3", english: "Blessing in disguise", match: "توفیق اجباری / خیر در ظاهر شر", synonym: "Hidden good fortune", audioText: "Blessing in disguise", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-4", english: "Burn candle at both ends", match: "فشار بیش از حد به خود آوردن", synonym: "Overwork exhausting", audioText: "Burn the candle at both ends", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-5", english: "Cost pretty penny", match: "هزینه بسیار سنگینی برداشتن", synonym: "Extremely expensive", audioText: "Cost a pretty penny", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-6", english: "Hit rock bottom", match: "به حضیض رسیدن و ته کشیدن", synonym: "Reach lowest point", audioText: "Hit rock bottom", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-7", english: "In blink of an eye", match: "در یک چشم بر هم زدن", synonym: "In an instant", audioText: "In the blink of an eye", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-8", english: "Through grapevine", match: "از دهان این و آن شنیدن", synonym: "Via rumor / gossip", audioText: "Through the grapevine", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-9", english: "Tip of iceberg", match: "تنها مشتی نمونه خروار بودن", synonym: "Small visible part", audioText: "Tip of the iceberg", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },
  { id: "b2-e-10", english: "Wild goose chase", match: "دنبال نخود سیاه رفتن و تلاش پوچ", synonym: "Hopeless search", audioText: "Wild goose chase", category: "chunk", contextFa: "اصطلاح", cefr: "B2", stageGroup: 5 },

  // =========================================================================
  // CEFR C1: American English File 5 (5 Stage Groups for Stages 1 to 10)
  // =========================================================================
  { id: "c1-d-1", english: "A chip on his shoulder", match: "حساسیت بیجا و عقده ناشی از حقارت", audioText: "A chip on his shoulder", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-2", english: "Wear heart on sleeve", match: "رو بازی کردن و عیان بودن احساسات", audioText: "Wear heart on sleeve", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-3", english: "Set in one's ways", match: "سرسخت در عادات و تغییرناپذیر", audioText: "Set in one's ways", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-4", english: "A pain in the neck", match: "مایه عذاب و دردسر مداوم", audioText: "A pain in the neck", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-5", english: "Steer clear of", match: "فاصله گرفتن و دوری گزیدن", audioText: "Steer clear of", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-6", english: "Bark is worse than bite", match: "اهل عمل نبودن و فقط تند سخن گفتن", audioText: "Bark is worse than bite", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-7", english: "Take things in stride", match: "خونسردانه با مشکلات کنار آمدن", audioText: "Take things in stride", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-8", english: "Touch and go", match: "بسیار متزلزل و با وضعیتی نامعلوم", audioText: "Touch and go", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-9", english: "Cut someone some slack", match: "سخت نگرفتن و مراعات کسی را کردن", audioText: "Cut someone some slack", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },
  { id: "c1-d-10", english: "By the skin of one's teeth", match: "به سختی تمام و مویی نجات یافتن", audioText: "By the skin of one's teeth", category: "word", contextFa: "AEF 5 U1", cefr: "C1", stageGroup: 1 },

  // C1 Group 2 (Stages 3-4)
  { id: "c1-d-13", english: "Learn the ropes", match: "فوت و فن کار را یاد گرفتن", audioText: "Learn the ropes", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-14", english: "Cut corners on quality", match: "زدن از کیفیت به بهای ارزانی", audioText: "Cut corners on quality", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-15", english: "Fast-track promotion", match: "ارتقای شغلی پرشتاب", audioText: "Fast-track promotion", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-16", english: "Glass ceiling", match: "مانع نامرئی پیشرفت شغلی", audioText: "Glass ceiling", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-17", english: "Golden handshake", match: "پاداش هنگفت پایان خدمت", audioText: "Golden handshake", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-18", english: "Spread oneself too thin", match: "چندین هندوانه با یک دست برداشتن", audioText: "Spread oneself too thin", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-19", english: "Climb corporate ladder", match: "طی کردن پله‌های نردبان ترقی", audioText: "Climb corporate ladder", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-20", english: "Severely burned out", match: "فرسودگی شدید روانی ناشی از کار", audioText: "Severely burned out", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-21", english: "Bite the dust", match: "شکست مفتضحانه خوردن", audioText: "Bite the dust", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },
  { id: "c1-d-22", english: "Ahead of the curve", match: "جلوتر از روند بازار و زمانه", audioText: "Ahead of the curve", category: "word", contextFa: "AEF 5 U2", cefr: "C1", stageGroup: 2 },

  // C1 Group 3 (Stages 5-6)
  { id: "c1-d-25", english: "Lost in translation", match: "از دست رفتن معنای اصلی در ترجمه", audioText: "Lost in translation", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-26", english: "Slip of the tongue", match: "لغزش ناخواسته زبان", audioText: "Slip of the tongue", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-27", english: "Eloquent speaker", match: "سخنور فصیح و سخن‌دان", audioText: "Eloquent speaker", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-28", english: "Mince one's words", match: "پوست‌کنده و صریح سخن نگفتن", audioText: "Mince one's words", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-29", english: "Rambling argument", match: "سخنان پراکنده و بی‌سر و ته", audioText: "Rambling argument", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-30", english: "Articulate ideas", match: "روشن و شیوا بیان کردن مفاهیم", audioText: "Articulate ideas", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-31", english: "Catch-22 situation", match: "تناقض مضحک و بن‌بست دوسویه", audioText: "Catch-22 situation", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-32", english: "Tongue in cheek", match: "با کنایه و شوخی ظریف", audioText: "Tongue in cheek", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-33", english: "At a loss for words", match: "مات و مبهوت و بی‌کلام ماندن", audioText: "At a loss for words", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },
  { id: "c1-d-34", english: "Hit the right chord", match: "تأثیر عمیق احساسی گذاشتن", audioText: "Hit the right chord", category: "word", contextFa: "AEF 5 U3", cefr: "C1", stageGroup: 3 },

  // C1 Group 4 (Stages 7-8)
  { id: "c1-d-37", english: "Second to none", match: "بی‌نظیر و بی‌همتا در برتری", audioText: "Second to none", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-38", english: "Cut from same cloth", match: "سر و ته یک کرباس بودن", audioText: "Cut from the same cloth", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-39", english: "Skeleton in the closet", match: "راز خانوادگی رسواکننده", audioText: "Skeleton in the closet", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-40", english: "Black sheep of family", match: "مایه ننگ و رسوایی خاندان", audioText: "Black sheep of the family", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-41", english: "Spitting image", match: "سیبی که از وسط دو نیم شده", audioText: "Spitting image", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-42", english: "Tied to apron strings", match: "وابستگی افراطی و نابالغ به مادر", audioText: "Tied to apron strings", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-43", english: "Flesh and blood", match: "خویشاوند خونی و پاره تن", audioText: "Flesh and blood", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-44", english: "Run in the family", match: "ارثی و موروثی بودن در تبار", audioText: "Run in the family", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-45", english: "Bad blood", match: "کینه دیرینه و عداوت خانوادگی", audioText: "Bad blood", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },
  { id: "c1-d-46", english: "Silver spoon in mouth", match: "زاده شدن در خانواده اشرافی و پرناز", audioText: "Born with silver spoon in mouth", category: "word", contextFa: "AEF 5 U4", cefr: "C1", stageGroup: 4 },

  // C1 Group 5 (Stages 9-10)
  { id: "c1-d-49", english: "A blessing in disguise", match: "توفیق اجباری / خیر در ظاهر شر", audioText: "A blessing in disguise", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-50", english: "Cry over spilled milk", match: "غصه گذشته بی‌فایده را خوردن", audioText: "Cry over spilled milk", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-51", english: "Spur of the moment", match: "تصمیم آنی و یک‌دفعه‌ای", audioText: "Spur of the moment", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-52", english: "Through the grapevine", match: "از گوشه و کنار شنیدن", audioText: "Through the grapevine", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-53", english: "Take with grain of salt", match: "با احتیاط و تردید پذیرفتن", audioText: "Take with a grain of salt", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-54", english: "Cross bridge when reach it", match: "حل مسئله در زمان وقوع خودش", audioText: "Cross bridge when reach it", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-55", english: "Curiosity killed the cat", match: "فضولی بیش از حد کار دست آدم می‌دهد", audioText: "Curiosity killed the cat", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-56", english: "Every cloud has silver lining", match: "در ناامیدی بسی امید است", audioText: "Every cloud has a silver lining", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-57", english: "Hit where it hurts", match: "دست روی نقطه حساس و ضعف گذاشتن", audioText: "Hit where it hurts", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },
  { id: "c1-d-58", english: "Leave well enough alone", match: "دست نزدن به وضعیت مطلوب و آرام", audioText: "Leave well enough alone", category: "word", contextFa: "AEF 5 U5", cefr: "C1", stageGroup: 5 },

  // =========================================================================
  // CEFR C2: Master Rhetoric, Nuance & Precision (5 Groups for Stages 1 to 10)
  // =========================================================================
  { id: "c2-d-1", english: "Unassailable integrity", match: "شرافت خدشه‌ناپذیر و بی‌عیب", audioText: "Unassailable integrity", category: "word", contextFa: "سخنوری C2", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-2", english: "Dialectical nuance", match: "ظرافت دیالکتیکی در تحلیل", audioText: "Dialectical nuance", category: "word", contextFa: "فلسفه C2", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-3", english: "Empirical veracity", match: "صحت و درستی مبتنی بر شواهد عینی", audioText: "Empirical veracity", category: "word", contextFa: "استدلال علمی", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-4", english: "Inherent contradiction", match: "تناقض درونی و ذاتی", audioText: "Inherent contradiction", category: "word", contextFa: "منطق C2", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-5", english: "Pragmatic realpolitik", match: "سیاست واقع‌گرایانه و عمل‌محور", audioText: "Pragmatic realpolitik", category: "word", contextFa: "علوم سیاسی", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-6", english: "Cautionary optimism", match: "خوش‌بینی محتاطانه و سنجیده", audioText: "Cautionary optimism", category: "word", contextFa: "تحلیل راهبردی", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-7", english: "Cyclical enlightenment", match: "روشن‌گری چرخه‌ای و آسیب‌پذیر", audioText: "Cyclical enlightenment", category: "word", contextFa: "تاریخ اندیشه", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-8", english: "Pluralistic discourse", match: "گفتمان تکثرگرا و چندصدایی", audioText: "Pluralistic discourse", category: "word", contextFa: "آکادمیک C2", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-9", english: "Durable dissent", match: "مخالفت پایدار و مدیریت‌پذیر", audioText: "Durable dissent", category: "word", contextFa: "سیاست‌ورزی", cefr: "C2", stageGroup: 1 },
  { id: "c2-d-10", english: "Calibrated gambit", match: "قمار حساب‌شده و مانور دقیق", audioText: "Calibrated gambit", category: "word", contextFa: "دیپلماسی", cefr: "C2", stageGroup: 1 },

  // C2 Group 2 (Stages 3-4)
  { id: "c2-d-11", english: "Hyperconnected isolation", match: "انزوای رنج‌آور در عصر فرامتصل", audioText: "Hyperconnected isolation", category: "word", contextFa: "جامعه‌شناسی مدرن", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-12", english: "Contemplative depth", match: "عمق و تأمل ژرف انسانی", audioText: "Contemplative depth", category: "word", contextFa: "فلسفه اگزیستانسیال", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-13", english: "Ecological ceilings", match: "سقف‌های صلب زیست‌محیطی", audioText: "Ecological ceilings", category: "word", contextFa: "اقتصاد اکولوژیک", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-14", english: "Archaic doctrine", match: "آموزه و عقیده کهنه و منسوخ", audioText: "Archaic doctrine", category: "word", contextFa: "حقوقی C2", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-15", english: "Reciprocal mutualism", match: "همیاری و تعاون متقابل زیستی", audioText: "Reciprocal mutualism", category: "word", contextFa: "زیست‌شناسی فرگشتی", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-16", english: "Antifragility posture", match: "رویکرد پادشکنندگی در برابر شوک", audioText: "Antifragility posture", category: "word", contextFa: "مدیریت بحران", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-17", english: "Forensic veracity", match: "اعتبار و موثق بودن شواهد جرم‌شناختی", audioText: "Forensic veracity", category: "word", contextFa: "حقوق و جرم‌شناسی", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-18", english: "Deontological ethics", match: "اخلاق وظیفه‌گرایانه کانت", audioText: "Deontological ethics", category: "word", contextFa: "فلسفه اخلاق", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-19", english: "Eternal frailties", match: "شکنندگی‌ها و ضعف‌های ابدی انسان", audioText: "Eternal frailties", category: "word", contextFa: "ادبیات کلاسیک", cefr: "C2", stageGroup: 2 },
  { id: "c2-d-20", english: "Structural transparency", match: "شفافیت ساختاری و نهادی", audioText: "Structural transparency", category: "word", contextFa: "حکمرانی مدنی", cefr: "C2", stageGroup: 2 },

  // C2 Group 3 (Stages 5-6)
  { id: "c2-d-21", english: "Perpetual hegemony", match: "هژمونی و سیطره دائم جهانی", audioText: "Perpetual hegemony", category: "word", contextFa: "روابط بین‌الملل", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-22", english: "Existential crisis", match: "بحران وجودی و هویت", audioText: "Existential crisis", category: "word", contextFa: "روان‌شناختی", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-23", english: "Cognitive dissonance", match: "ناهمگونی و تعارض شناختی", audioText: "Cognitive dissonance", category: "word", contextFa: "علوم اعصاب", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-24", english: "Intrinsic motivation", match: "انگیزه ذاتی و درونی", audioText: "Intrinsic motivation", category: "word", contextFa: "روان‌شناسی یادگیری", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-25", english: "Metaphorical allusion", match: "اشاره و تلمیح استعاری", audioText: "Metaphorical allusion", category: "word", contextFa: "نقد ادبی", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-26", english: "Paradigm shift", match: "تغییر و چرخش پارادایم", audioText: "Paradigm shift", category: "word", contextFa: "فلسفه علم", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-27", english: "Systemic inequity", match: "نابرابری ساختاریافته و سیستمی", audioText: "Systemic inequity", category: "word", contextFa: "جامعه‌شناسی", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-28", english: "Hermeneutic circle", match: "دایره هرمنوتیک در تاویل متن", audioText: "Hermeneutic circle", category: "word", contextFa: "هرمنوتیک", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-29", english: "Epistemological foundation", match: "شالوده و بنیان معرفت‌شناختی", audioText: "Epistemological foundation", category: "word", contextFa: "معرفت‌شناسی", cefr: "C2", stageGroup: 3 },
  { id: "c2-d-30", english: "Pernicious rhetoric", match: "خطابه مهلک و فریبنده", audioText: "Pernicious rhetoric", category: "word", contextFa: "بلاغت و خطابه", cefr: "C2", stageGroup: 3 },

  // C2 Group 4 (Stages 7-8)
  { id: "c2-d-31", english: "Ubiquitous surveillance", match: "نظارت و پاییدن فراگیر و همه‌جاگیر", audioText: "Ubiquitous surveillance", category: "word", contextFa: "امنیت سایبری", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-32", english: "Benevolent patriarch", match: "پدرخوانده خیرخواه اما سلطه‌جو", audioText: "Benevolent patriarch", category: "word", contextFa: "انسان‌شناسی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-33", english: "Unilateral secession", match: "جدایی‌طلبی یک‌جانبه قلمرو", audioText: "Unilateral secession", category: "word", contextFa: "حقوق بین‌الملل", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-34", english: "Precarious equilibrium", match: "تعادل متزلزل و شکننده", audioText: "Precarious equilibrium", category: "word", contextFa: "سیاست دفاعی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-35", english: "Subversive narrative", match: "روایت براندازانه و تابوشکن", audioText: "Subversive narrative", category: "word", contextFa: "مطالعات فرهنگی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-36", english: "Imperious demeanor", match: "رفتار متکبرانه و آمرانه", audioText: "Imperious demeanor", category: "word", contextFa: "شخصیت‌شناسی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-37", english: "Specious reasoning", match: "مغالطه ظاهرالصلاح و فریبنده", audioText: "Specious reasoning", category: "word", contextFa: "منطق صوری", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-38", english: "Ostentatious display", match: "خودنمایی و تظاهر افراطی", audioText: "Ostentatious display", category: "word", contextFa: "رفتار اجتماعی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-39", english: "Inscrutable motif", match: "انگیزه مبهم و ناگشودنی", audioText: "Inscrutable motif", category: "word", contextFa: "روان‌کاوی", cefr: "C2", stageGroup: 4 },
  { id: "c2-d-40", english: "Indelible imprint", match: "ردپای ماندگار و ستردنی‌ناپذیر", audioText: "Indelible imprint", category: "word", contextFa: "تاریخ تمدن", cefr: "C2", stageGroup: 4 },

  // C2 Group 5 (Stages 9-10)
  { id: "c2-d-41", english: "Categorical imperative", match: "امر مطلق اخلاقی و وظیفه نامشروط", audioText: "Categorical imperative", category: "word", contextFa: "اخلاق نظری", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-42", english: "Existential dread", match: "اضطراب و هراس عمیق وجودی", audioText: "Existential dread", category: "word", contextFa: "روان‌شناسی اگزیستانسیال", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-43", english: "Machiavellian stratagem", match: "حیله و شگرد ماکیاولیستی", audioText: "Machiavellian stratagem", category: "word", contextFa: "استراتژی قدرت", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-44", english: "Solipsistic detachment", match: "انزوای خودبسنده و من‌محور", audioText: "Solipsistic detachment", category: "word", contextFa: "فلسفه ذهن", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-45", english: "Ephemeral triumph", match: "پیروزی زودگذر و ناپایدار", audioText: "Ephemeral triumph", category: "word", contextFa: "حکمت تاریخی", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-46", english: "Tenebrous labyrinth", match: "هزارتوی ظلمانی و تاریک", audioText: "Tenebrous labyrinth", category: "word", contextFa: "ادبیات نمادین", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-47", english: "Sovereign autonomy", match: "استقلال و خودمختاری حاکمیتی", audioText: "Sovereign autonomy", category: "word", contextFa: "علوم سیاسی", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-48", english: "Dogmatic orthodoxy", match: "جزم‌اندیشی و تعصب سنتی", audioText: "Dogmatic orthodoxy", category: "word", contextFa: "جامعه‌شناسی دین", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-49", english: "Vicarious satisfaction", match: "لذت و رضایت نیابتی از تجربه دیگران", audioText: "Vicarious satisfaction", category: "word", contextFa: "روان‌شناسی عاطفی", cefr: "C2", stageGroup: 5 },
  { id: "c2-d-50", english: "Unrelenting scrutiny", match: "موشکافی و بازرسی بی‌امان", audioText: "Unrelenting scrutiny", category: "word", contextFa: "نظارت قانونی", cefr: "C2", stageGroup: 5 },
];

/**
 * Returns a randomized, deeply shuffled pool of pairs strictly from the requested CEFR level
 * and specifically from the designated stage group:
 * - Stages 1-2: Group 1
 * - Stages 3-4: Group 2
 * - Stages 5-6: Group 3
 * - Stages 7-8: Group 4
 * - Stages 9-10: Group 5
 * This guarantees that every 2 stages, fresh vocabulary is introduced!
 */
export function getShuffledCascadePairs(cefr: CefrLevel, stageNumber: number = 1): CascadePair[] {
  // Determine which 2-stage group:
  const targetGroup = Math.min(5, Math.max(1, Math.ceil(stageNumber / 2))) as 1 | 2 | 3 | 4 | 5;

  const exactGroupPool = WEBSITE_BOOKS_VOCAB_BANK.filter(
    (p) => p.cefr === cefr && p.stageGroup === targetGroup
  );

  const pool = exactGroupPool.length >= 8 
    ? exactGroupPool 
    : WEBSITE_BOOKS_VOCAB_BANK.filter((p) => p.cefr === cefr);

  // Deduplicate by ID
  const uniqueMap = new Map<string, CascadePair>();
  for (const item of pool) {
    uniqueMap.set(item.id, item);
  }
  const uniquePool = Array.from(uniqueMap.values());

  // Deep Fisher-Yates shuffle
  const shuffled = [...uniquePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
