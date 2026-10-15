import type { CefrLevel } from "./types";

export interface CascadePair {
  id: string;
  english: string;
  match: string; // Persian translation (A1/A2) or English synonym (B1/B2)
  synonym?: string; // English synonym (B1/B2)
  audioText: string;
  category: "word" | "chunk" | "dialogue";
  contextFa?: string;
  cefr: CefrLevel;
  stageGroup: 1 | 2 | 3 | 4 | 5; // 1: Stg 1-2, 2: Stg 3-4, 3: Stg 5-6, 4: Stg 7-8, 5: Stg 9-10
  powerUp?: "bomb" | "freeze" | "star";
}

/**
 * Authentic vocabulary, collocations, spoken chunks, and synonyms
 * curated from "Books and CEFR" (CEFR A1-C2 official wordlists & American English File 3e).
 * - A1 & A2: English word <-> Natural Persian translation
 * - B1 & B2: English word <-> English Synonym
 * - Power-up tiles (bomb, freeze, star) embedded for high-energy arcade gameplay
 */
export const WEBSITE_BOOKS_VOCAB_BANK: CascadePair[] = [
  // =========================================================================
  // CEFR A1: Books & CEFR (5 Stage Groups for Stages 1 to 10)
  // =========================================================================
  { id: "a1-g1-1", english: "Book", match: "کتاب", audioText: "Book", category: "word", contextFa: "اشیاء روزمره", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-2", english: "Pen", match: "خودکار", audioText: "Pen", category: "word", contextFa: "لوازم‌التحریر", cefr: "A1", stageGroup: 1, powerUp: "bomb" },
  { id: "a1-g1-3", english: "Door", match: "درب / در", audioText: "Door", category: "word", contextFa: "خانه و اتاق", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-4", english: "Window", match: "پنجره", audioText: "Window", category: "word", contextFa: "خانه و اتاق", cefr: "A1", stageGroup: 1, powerUp: "freeze" },
  { id: "a1-g1-5", english: "Bag", match: "کیف و کوله", audioText: "Bag", category: "word", contextFa: "وسایل همراه", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-6", english: "Desk", match: "میز کار و تحریر", audioText: "Desk", category: "word", contextFa: "محل کار و کلاس", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-7", english: "Chair", match: "صندلی", audioText: "Chair", category: "word", contextFa: "وسایل خانه", cefr: "A1", stageGroup: 1, powerUp: "star" },
  { id: "a1-g1-8", english: "Clock", match: "ساعت دیواری", audioText: "Clock", category: "word", contextFa: "زمان", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-9", english: "Key", match: "کلید", audioText: "Key", category: "word", contextFa: "اشیاء همراه", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-10", english: "Passport", match: "گذرنامه / پاسپورت", audioText: "Passport", category: "word", contextFa: "سفر", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-11", english: "Good morning", match: "صبح بخیر", audioText: "Good morning", category: "word", contextFa: "احوال‌پرسی", cefr: "A1", stageGroup: 1 },
  { id: "a1-g1-12", english: "See you soon", match: "به زودی می‌بینمت", audioText: "See you soon", category: "word", contextFa: "خداحافظی", cefr: "A1", stageGroup: 1 },
  { id: "a1-g2-1", english: "Airport", match: "فرودگاه", audioText: "Airport", category: "word", contextFa: "شهر و سفر", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-2", english: "Supermarket", match: "سوپرمارکت", audioText: "Supermarket", category: "word", contextFa: "شهر و خرید", cefr: "A1", stageGroup: 2, powerUp: "bomb" },
  { id: "a1-g2-3", english: "Restaurant", match: "رستوران", audioText: "Restaurant", category: "word", contextFa: "غذا و بیرون", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-4", english: "Hospital", match: "بیمارستان", audioText: "Hospital", category: "word", contextFa: "مکان‌های شهر", cefr: "A1", stageGroup: 2, powerUp: "freeze" },
  { id: "a1-g2-5", english: "Breakfast", match: "صبحانه", audioText: "Breakfast", category: "word", contextFa: "وعده غذایی", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-6", english: "Delicious", match: "بسیار خوشمزه", audioText: "Delicious", category: "word", contextFa: "توصیف غذا", cefr: "A1", stageGroup: 2, powerUp: "star" },
  { id: "a1-g2-7", english: "Bread", match: "نان تازه", audioText: "Bread", category: "word", contextFa: "خوراکی‌ها", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-8", english: "Water", match: "آب نوشیدنی", audioText: "Water", category: "word", contextFa: "نوشیدنی‌ها", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-9", english: "Coffee", match: "قهوه", audioText: "Coffee", category: "word", contextFa: "کافه", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-10", english: "Hotel", match: "هتل و اقامتگاه", audioText: "Hotel", category: "word", contextFa: "سفر", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-11", english: "Expensive", match: "گران‌قیمت", audioText: "Expensive", category: "word", contextFa: "خرید", cefr: "A1", stageGroup: 2 },
  { id: "a1-g2-12", english: "Cheap", match: "ارزان و به صرفه", audioText: "Cheap", category: "word", contextFa: "خرید", cefr: "A1", stageGroup: 2 },
  { id: "a1-g3-1", english: "To arrive", match: "رسیدن به مقصد", audioText: "arrive", category: "word", contextFa: "حرکت و سفر", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-2", english: "To leave", match: "ترک کردن / راهی شدن", audioText: "leave", category: "word", contextFa: "حرکت", cefr: "A1", stageGroup: 3, powerUp: "bomb" },
  { id: "a1-g3-3", english: "To listen", match: "گوش سپردن", audioText: "listen", category: "word", contextFa: "حواس و فعالیت", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-4", english: "To speak", match: "صحبت کردن", audioText: "speak", category: "word", contextFa: "ارتباطات", cefr: "A1", stageGroup: 3, powerUp: "freeze" },
  { id: "a1-g3-5", english: "To travel", match: "سفر کردن", audioText: "travel", category: "word", contextFa: "گردشگری", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-6", english: "To buy", match: "خریدن کالا", audioText: "buy", category: "word", contextFa: "خرید", cefr: "A1", stageGroup: 3, powerUp: "star" },
  { id: "a1-g3-7", english: "To sleep", match: "خوابیدن و استراحت", audioText: "sleep", category: "word", contextFa: "فعالیت روزمره", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-8", english: "To wake up", match: "از خواب بیدار شدن", audioText: "wake up", category: "word", contextFa: "شروع روز", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-9", english: "To open", match: "باز کردن", audioText: "open", category: "word", contextFa: "افعال پرکاربرد", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-10", english: "To close", match: "بستن درب یا پنجره", audioText: "close", category: "word", contextFa: "افعال پرکاربرد", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-11", english: "To learn", match: "یاد گرفتن", audioText: "learn", category: "word", contextFa: "آموزش", cefr: "A1", stageGroup: 3 },
  { id: "a1-g3-12", english: "To remember", match: "به خاطر آوردن", audioText: "remember", category: "word", contextFa: "حافظه و ذهن", cefr: "A1", stageGroup: 3 },
  { id: "a1-g4-1", english: "Happy", match: "خوشحال و شادمان", audioText: "Happy", category: "word", contextFa: "احساسات", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-2", english: "Tired", match: "خسته و بی‌رمق", audioText: "Tired", category: "word", contextFa: "حالت جسمی", cefr: "A1", stageGroup: 4, powerUp: "bomb" },
  { id: "a1-g4-3", english: "Hungry", match: "گرسنه برای غذا", audioText: "Hungry", category: "word", contextFa: "نیاز طبیعی", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-4", english: "Thirsty", match: "تشنه آب", audioText: "Thirsty", category: "word", contextFa: "نیاز طبیعی", cefr: "A1", stageGroup: 4, powerUp: "freeze" },
  { id: "a1-g4-5", english: "Afraid", match: "ترسیده و نگران", audioText: "Afraid", category: "word", contextFa: "احساسات", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-6", english: "Friendly", match: "صمیمی و خوش‌برخورد", audioText: "Friendly", category: "word", contextFa: "ویژگی شخصیتی", cefr: "A1", stageGroup: 4, powerUp: "star" },
  { id: "a1-g4-7", english: "Beautiful", match: "زیبا و قشنگ", audioText: "Beautiful", category: "word", contextFa: "توصیف", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-8", english: "Difficult", match: "سخت و دشوار", audioText: "Difficult", category: "word", contextFa: "توصیف کارها", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-9", english: "Easy", match: "آسان و مثل آب خوردن", audioText: "Easy", category: "word", contextFa: "توصیف کارها", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-10", english: "Parents", match: "والدین (پدر و مادر)", audioText: "Parents", category: "word", contextFa: "خانواده", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-11", english: "Family", match: "خانواده", audioText: "Family", category: "word", contextFa: "خانواده", cefr: "A1", stageGroup: 4 },
  { id: "a1-g4-12", english: "Friend", match: "دوست و رفیق صمیمی", audioText: "Friend", category: "word", contextFa: "ارتباطات", cefr: "A1", stageGroup: 4 },
  { id: "a1-g5-1", english: "Excuse me", match: "ببخشید (شروع گفتگو)", audioText: "Excuse me", category: "chunk", contextFa: "جلب توجه محترمانه", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-2", english: "You're welcome", match: "خواهش می‌کنم / قابلی نداره", audioText: "You're welcome", category: "chunk", contextFa: "پاسخ تشکر", cefr: "A1", stageGroup: 5, powerUp: "bomb" },
  { id: "a1-g5-3", english: "How about you?", match: "شما چطور؟ تو چخبر؟", audioText: "How about you?", category: "chunk", contextFa: "مکالمه متقابل", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-4", english: "Nice to meet you", match: "از دیدارتان خوشبختم", audioText: "Nice to meet you", category: "chunk", contextFa: "معارفه", cefr: "A1", stageGroup: 5, powerUp: "freeze" },
  { id: "a1-g5-5", english: "Could you help me?", match: "میشه لطفاً کمکم کنید؟", audioText: "Could you help me?", category: "chunk", contextFa: "درخواست مودبانه", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-6", english: "How much is this?", match: "قیمت این چقدر است؟", audioText: "How much is this?", category: "chunk", contextFa: "خرید کالا", cefr: "A1", stageGroup: 5, powerUp: "star" },
  { id: "a1-g5-7", english: "Here you are", match: "بفرمایید خدمت شما", audioText: "Here you are", category: "chunk", contextFa: "تحویل جنس", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-8", english: "Have a good one", match: "روز و اوقات خوبی داشته باشی", audioText: "Have a good one", category: "chunk", contextFa: "بدرقه محاوره‌ای", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-9", english: "Take care", match: "مراقب خودت باش", audioText: "Take care", category: "chunk", contextFa: "خداحافظی گرم", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-10", english: "For here or to go?", match: "میل می‌کنید یا بیرون‌بر باشه؟", audioText: "For here or to go?", category: "chunk", contextFa: "کافه و فست‌فود", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-11", english: "Can I have the bill?", match: "میشه صورت‌حساب رو بیارید؟", audioText: "Can I have the bill?", category: "chunk", contextFa: "رستوران", cefr: "A1", stageGroup: 5 },
  { id: "a1-g5-12", english: "That's all for now", match: "فعلاً همین‌ها کافی است", audioText: "That's all for now", category: "chunk", contextFa: "اتمام سفارش", cefr: "A1", stageGroup: 5 },

  // =========================================================================
  // CEFR A2: Books & CEFR (5 Stage Groups for Stages 1 to 10)
  // =========================================================================
  { id: "a2-g1-1", english: "Boarding pass", match: "کارت پرواز", audioText: "Boarding pass", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-2", english: "Delayed flight", match: "پرواز دارای تأخیر", audioText: "Delayed flight", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 1, powerUp: "bomb" },
  { id: "a2-g1-3", english: "Subway station", match: "ایستگاه مترو", audioText: "Subway station", category: "word", contextFa: "حمل و نقل شهری", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-4", english: "Luggage scale", match: "ترازوی وزن‌کشی بار", audioText: "Luggage scale", category: "word", contextFa: "فرودگاه", cefr: "A2", stageGroup: 1, powerUp: "freeze" },
  { id: "a2-g1-5", english: "Catch a flight", match: "رسیدن به پرواز", audioText: "Catch a flight", category: "word", contextFa: "سفر هوایی", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-6", english: "Carry-on bag", match: "ساک دستی داخل کابین", audioText: "Carry-on bag", category: "word", contextFa: "سفر", cefr: "A2", stageGroup: 1, powerUp: "star" },
  { id: "a2-g1-7", english: "Book in advance", match: "رزرو کردن از قبل", audioText: "Book in advance", category: "word", contextFa: "برنامه‌ریزی", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-8", english: "Public transit", match: "حمل‌ونقل عمومی", audioText: "Public transit", category: "word", contextFa: "شهر", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-9", english: "Traffic jam", match: "ترافیک سنگین و راهبندان", audioText: "Traffic jam", category: "word", contextFa: "خیابان", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-10", english: "Bus terminal", match: "پایانه و ترمینال اتوبوس", audioText: "Bus terminal", category: "word", contextFa: "حمل و نقل", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-11", english: "Platform", match: "سکوی حرکت قطار", audioText: "Platform", category: "word", contextFa: "ایستگاه قطار", cefr: "A2", stageGroup: 1 },
  { id: "a2-g1-12", english: "Pedestrian", match: "عابر پیاده در پیاده‌رو", audioText: "Pedestrian", category: "word", contextFa: "خیابان", cefr: "A2", stageGroup: 1 },
  { id: "a2-g2-1", english: "Fitting room", match: "اتاق پرو لباس", audioText: "Fitting room", category: "word", contextFa: "فروشگاه پوشاک", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-2", english: "Receipt", match: "رسید و فاکتور خرید", audioText: "Receipt", category: "word", contextFa: "خرید", cefr: "A2", stageGroup: 2, powerUp: "bomb" },
  { id: "a2-g2-3", english: "Credit card", match: "کارت اعتباری / بانکی", audioText: "Credit card", category: "word", contextFa: "پرداخت الکترونیک", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-4", english: "Refund", match: "استرداد و پس گرفتن پول", audioText: "Refund", category: "word", contextFa: "امور مالی", cefr: "A2", stageGroup: 2, powerUp: "freeze" },
  { id: "a2-g2-5", english: "Affordable", match: "دارای قیمت مناسب و معقول", audioText: "Affordable", category: "word", contextFa: "خرید", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-6", english: "Convenient", match: "راحت، آسان و دم‌دست", audioText: "Convenient", category: "word", contextFa: "توصیف خدمات", cefr: "A2", stageGroup: 2, powerUp: "star" },
  { id: "a2-g2-7", english: "Exchange rate", match: "نرخ برابری ارز", audioText: "Exchange rate", category: "word", contextFa: "صرافی", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-8", english: "Try on clothes", match: "پرو کردن لباس", audioText: "Try on clothes", category: "word", contextFa: "خرید لباس", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-9", english: "Discount", match: "تخفیف ویژه", audioText: "Discount", category: "word", contextFa: "قیمت کالا", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-10", english: "Cashier", match: "صندوق‌دار فروشگاه", audioText: "Cashier", category: "word", contextFa: "فروشگاه", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-11", english: "Customer", match: "مشتری و خریدار", audioText: "Customer", category: "word", contextFa: "کسب‌وکار", cefr: "A2", stageGroup: 2 },
  { id: "a2-g2-12", english: "Window shopping", match: "تماشا کردن ویترین مغازه‌ها", audioText: "Window shopping", category: "word", contextFa: "خرید و تفریح", cefr: "A2", stageGroup: 2 },
  { id: "a2-g3-1", english: "Appointment", match: "وقت ملاقات رسمی", audioText: "Appointment", category: "word", contextFa: "برنامه‌ریزی", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-2", english: "Prescription", match: "نسخه دارویی پزشک", audioText: "Prescription", category: "word", contextFa: "پزشکی و دارو", cefr: "A2", stageGroup: 3, powerUp: "bomb" },
  { id: "a2-g3-3", english: "Headache", match: "سردرد", audioText: "Headache", category: "word", contextFa: "سلامت", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-4", english: "Medicine", match: "دارو و درمان", audioText: "Medicine", category: "word", contextFa: "درمان", cefr: "A2", stageGroup: 3, powerUp: "freeze" },
  { id: "a2-g3-5", english: "Schedule", match: "برنامه زمانی منظم", audioText: "Schedule", category: "word", contextFa: "کار و زندگی", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-6", english: "Colleague", match: "همکار اداری و کاری", audioText: "Colleague", category: "word", contextFa: "محل کار", cefr: "A2", stageGroup: 3, powerUp: "star" },
  { id: "a2-g3-7", english: "Look forward to", match: "مشتاقانه چشم‌به‌راه بودن", audioText: "Look forward to", category: "word", contextFa: "اشتیاق", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-8", english: "Pick up", match: "دنبال کسی رفتن و سوار کردن", audioText: "Pick up", category: "word", contextFa: "رفت‌وآمد", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-9", english: "Drop off", match: "پیاده کردن در مقصد", audioText: "Drop off", category: "word", contextFa: "رفت‌وآمد", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-10", english: "Emergency", match: "شرایط اضطراری و اورژانس", audioText: "Emergency", category: "word", contextFa: "حوادث", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-11", english: "Symptoms", match: "علائم و نشانه‌های بیماری", audioText: "Symptoms", category: "word", contextFa: "پزشکی", cefr: "A2", stageGroup: 3 },
  { id: "a2-g3-12", english: "Rest and recover", match: "استراحت و بازیابی توان", audioText: "Rest and recover", category: "word", contextFa: "بهبودی", cefr: "A2", stageGroup: 3 },
  { id: "a2-g4-1", english: "Neighborhood", match: "محله و اطراف خانه", audioText: "Neighborhood", category: "word", contextFa: "محل سکونت", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-2", english: "Crowded", match: "شلوغ و پر ازدحام", audioText: "Crowded", category: "word", contextFa: "مکان‌ها", cefr: "A2", stageGroup: 4, powerUp: "bomb" },
  { id: "a2-g4-3", english: "Sightseeing tour", match: "تور گشت و گذار شهری", audioText: "Sightseeing tour", category: "word", contextFa: "گردشگری", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-4", english: "Tourist attraction", match: "جاذبه دیدنی و گردشگری", audioText: "Tourist attraction", category: "word", contextFa: "سفر", cefr: "A2", stageGroup: 4, powerUp: "freeze" },
  { id: "a2-g4-5", english: "Local specialty", match: "سوغات و غذای محلی", audioText: "Local specialty", category: "word", contextFa: "فرهنگ و غذا", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-6", english: "Dangerous", match: "خطرناک و پرریسک", audioText: "Dangerous", category: "word", contextFa: "توصیف شرایط", cefr: "A2", stageGroup: 4, powerUp: "star" },
  { id: "a2-g4-7", english: "Comfortable", match: "راحت و دلپذیر", audioText: "Comfortable", category: "word", contextFa: "توصیف محیط", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-8", english: "Pollution", match: "آلودگی هوا و محیط", audioText: "Pollution", category: "word", contextFa: "محیط زیست", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-9", english: "Forecast", match: "پیش‌بینی وضعیت آب‌وهوا", audioText: "Forecast", category: "word", contextFa: "آب‌وهوا", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-10", english: "Generous", match: "بخشنده و دست‌ودلباز", audioText: "Generous", category: "word", contextFa: "شخصیت", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-11", english: "Reliable", match: "قابل اعتماد و مطمئن", audioText: "Reliable", category: "word", contextFa: "شخصیت", cefr: "A2", stageGroup: 4 },
  { id: "a2-g4-12", english: "Impatient", match: "کم‌طاقت و بی‌صبر", audioText: "Impatient", category: "word", contextFa: "شخصیت", cefr: "A2", stageGroup: 4 },
  { id: "a2-g5-1", english: "Give up", match: "دست کشیدن و تسلیم شدن", audioText: "Give up", category: "word", contextFa: "افعال عبارتی", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-2", english: "Find out", match: "کشف کردن و پی بردن", audioText: "Find out", category: "word", contextFa: "دانستن", cefr: "A2", stageGroup: 5, powerUp: "bomb" },
  { id: "a2-g5-3", english: "Run out of", match: "ته کشیدن و تمام شدن", audioText: "Run out of", category: "word", contextFa: "موجودی", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-4", english: "Put off", match: "به تعویق انداختن امور", audioText: "Put off", category: "word", contextFa: "زمان‌بندی", cefr: "A2", stageGroup: 5, powerUp: "freeze" },
  { id: "a2-g5-5", english: "Turn up", match: "پیدا شدن و سر رسیدن", audioText: "Turn up", category: "word", contextFa: "رویداد", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-6", english: "Look after", match: "مراقبت و نگهداری کردن", audioText: "Look after", category: "word", contextFa: "مسئولیت", cefr: "A2", stageGroup: 5, powerUp: "star" },
  { id: "a2-g5-7", english: "By the way", match: "راستی / ضمناً", audioText: "By the way", category: "chunk", contextFa: "تغییر موضوع", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-8", english: "To be honest", match: "راستش را بخواهی / صادقانه", audioText: "To be honest", category: "chunk", contextFa: "صداقت", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-9", english: "As soon as possible", match: "در سریع‌ترین زمان ممکن", audioText: "As soon as possible", category: "chunk", contextFa: "سرعت عمل", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-10", english: "Keep in touch", match: "در ارتباط باشیم و بی‌خبر نگذار", audioText: "Keep in touch", category: "chunk", contextFa: "دوستانه", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-11", english: "It depends on", match: "بستگی داشتن به شرایط", audioText: "It depends on", category: "chunk", contextFa: "تصمیم", cefr: "A2", stageGroup: 5 },
  { id: "a2-g5-12", english: "Never mind", match: "اصلاً مهم نیست / بیخیال", audioText: "Never mind", category: "chunk", contextFa: "آرامش کلامی", cefr: "A2", stageGroup: 5 },

  // =========================================================================
  // CEFR B1: Books & CEFR Synonyms (5 Stage Groups for Stages 1 to 10)
  // =========================================================================
  { id: "b1-g1-1", english: "Accurate", match: "Precise", synonym: "Precise", audioText: "Accurate", category: "word", contextFa: "دقیق و بدون نقص", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-2", english: "Purchase", match: "Buy", synonym: "Buy", audioText: "Purchase", category: "word", contextFa: "خریداری کردن", cefr: "B1", stageGroup: 1, powerUp: "bomb" },
  { id: "b1-g1-3", english: "Enormous", match: "Huge", synonym: "Huge", audioText: "Enormous", category: "word", contextFa: "بسیار عظیم", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-4", english: "Exhausted", match: "Very tired", synonym: "Very tired", audioText: "Exhausted", category: "word", contextFa: "از پا افتاده", cefr: "B1", stageGroup: 1, powerUp: "freeze" },
  { id: "b1-g1-5", english: "Commence", match: "Begin", synonym: "Begin", audioText: "Commence", category: "word", contextFa: "شروع کردن", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-6", english: "Assist", match: "Help", synonym: "Help", audioText: "Assist", category: "word", contextFa: "یاری رساندن", cefr: "B1", stageGroup: 1, powerUp: "star" },
  { id: "b1-g1-7", english: "Difficult", match: "Challenging", synonym: "Challenging", audioText: "Difficult", category: "word", contextFa: "دشوار", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-8", english: "Occur", match: "Happen", synonym: "Happen", audioText: "Occur", category: "word", contextFa: "رخ دادن", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-9", english: "Ancient", match: "Very old", synonym: "Very old", audioText: "Ancient", category: "word", contextFa: "کهن و باستانی", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-10", english: "Tidy", match: "Neat", synonym: "Neat", audioText: "Tidy", category: "word", contextFa: "مرتب و منظم", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-11", english: "Select", match: "Choose", synonym: "Choose", audioText: "Select", category: "word", contextFa: "انتخاب کردن", cefr: "B1", stageGroup: 1 },
  { id: "b1-g1-12", english: "Spectacular", match: "Breathtaking", synonym: "Breathtaking", audioText: "Spectacular", category: "word", contextFa: "خیره کننده", cefr: "B1", stageGroup: 1 },
  { id: "b1-g2-1", english: "Figure out", match: "Understand", synonym: "Understand", audioText: "Figure out", category: "word", contextFa: "درک کردن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-2", english: "Put off", match: "Postpone", synonym: "Postpone", audioText: "Put off", category: "word", contextFa: "به تعویق انداختن", cefr: "B1", stageGroup: 2, powerUp: "bomb" },
  { id: "b1-g2-3", english: "Give up", match: "Surrender", synonym: "Surrender", audioText: "Give up", category: "word", contextFa: "تسلیم شدن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-4", english: "Run out of", match: "Deplete", synonym: "Deplete", audioText: "Run out of", category: "word", contextFa: "تمام شدن", cefr: "B1", stageGroup: 2, powerUp: "freeze" },
  { id: "b1-g2-5", english: "Carry on", match: "Continue", synonym: "Continue", audioText: "Carry on", category: "word", contextFa: "ادامه دادن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-6", english: "Look up to", match: "Admire", synonym: "Admire", audioText: "Look up to", category: "word", contextFa: "الگو گرفتن", cefr: "B1", stageGroup: 2, powerUp: "star" },
  { id: "b1-g2-7", english: "Turn down", match: "Refuse", synonym: "Refuse", audioText: "Turn down", category: "word", contextFa: "رد کردن پیشنهاد", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-8", english: "Call off", match: "Cancel", synonym: "Cancel", audioText: "Call off", category: "word", contextFa: "لغو کردن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-9", english: "Get by", match: "Survive", synonym: "Survive", audioText: "Get by", category: "word", contextFa: "گلیم خود را از آب کشیدن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-10", english: "Look into", match: "Investigate", synonym: "Investigate", audioText: "Look into", category: "word", contextFa: "تحقیق و بررسی", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-11", english: "Catch up", match: "Reach same level", synonym: "Reach same level", audioText: "Catch up", category: "word", contextFa: "رسیدن به بقیه", cefr: "B1", stageGroup: 2 },
  { id: "b1-g2-12", english: "Make up mind", match: "Decide", synonym: "Decide", audioText: "Make up your mind", category: "word", contextFa: "تصمیم قطعی گرفتن", cefr: "B1", stageGroup: 2 },
  { id: "b1-g3-1", english: "Delighted", match: "Thrilled", synonym: "Thrilled", audioText: "Delighted", category: "word", contextFa: "بسیار شادمان", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-2", english: "Terrified", match: "Frightened", synonym: "Frightened", audioText: "Terrified", category: "word", contextFa: "وحشت‌زده", cefr: "B1", stageGroup: 3, powerUp: "bomb" },
  { id: "b1-g3-3", english: "Furious", match: "Angry", synonym: "Angry", audioText: "Furious", category: "word", contextFa: "بسیار خشمگین", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-4", english: "Annoyed", match: "Irritated", synonym: "Irritated", audioText: "Annoyed", category: "word", contextFa: "کلافه و برآشفته", cefr: "B1", stageGroup: 3, powerUp: "freeze" },
  { id: "b1-g3-5", english: "Courageous", match: "Brave", synonym: "Brave", audioText: "Courageous", category: "word", contextFa: "شجاع و با دل‌وجرئت", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-6", english: "Astonishing", match: "Surprising", synonym: "Surprising", audioText: "Astonishing", category: "word", contextFa: "حیرت‌آور", cefr: "B1", stageGroup: 3, powerUp: "star" },
  { id: "b1-g3-7", english: "Essential", match: "Necessary", synonym: "Necessary", audioText: "Essential", category: "word", contextFa: "ضروری و بنیادی", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-8", english: "Wealthy", match: "Rich", synonym: "Rich", audioText: "Wealthy", category: "word", contextFa: "ثروتمند", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-9", english: "Tranquil", match: "Peaceful", synonym: "Peaceful", audioText: "Tranquil", category: "word", contextFa: "آرام و بی‌صدا", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-10", english: "Hazardous", match: "Dangerous", synonym: "Dangerous", audioText: "Hazardous", category: "word", contextFa: "پرخطر", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-11", english: "Grateful", match: "Thankful", synonym: "Thankful", audioText: "Grateful", category: "word", contextFa: "سپاسگزار", cefr: "B1", stageGroup: 3 },
  { id: "b1-g3-12", english: "Sincere", match: "Honest", synonym: "Honest", audioText: "Sincere", category: "word", contextFa: "صادق و یکرنگ", cefr: "B1", stageGroup: 3 },
  { id: "b1-g4-1", english: "Piece of cake", match: "Very easy", synonym: "Very easy", audioText: "Piece of cake", category: "chunk", contextFa: "مثل آب خوردن", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-2", english: "Under the weather", match: "Feeling sick", synonym: "Feeling sick", audioText: "Under the weather", category: "chunk", contextFa: "کسل و ناخوش", cefr: "B1", stageGroup: 4, powerUp: "bomb" },
  { id: "b1-g4-3", english: "Cost an arm and leg", match: "Very expensive", synonym: "Very expensive", audioText: "Cost an arm and a leg", category: "chunk", contextFa: "بسیار گران", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-4", english: "Once in a blue moon", match: "Very rarely", synonym: "Very rarely", audioText: "Once in a blue moon", category: "chunk", contextFa: "به ندرت", cefr: "B1", stageGroup: 4, powerUp: "freeze" },
  { id: "b1-g4-5", english: "Break the ice", match: "Ease tension", synonym: "Ease tension", audioText: "Break the ice", category: "chunk", contextFa: "شکستن یخ جمع", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-6", english: "Hit the books", match: "Study hard", synonym: "Study hard", audioText: "Hit the books", category: "chunk", contextFa: "درس خواندن جدی", cefr: "B1", stageGroup: 4, powerUp: "star" },
  { id: "b1-g4-7", english: "Call it a day", match: "Finish work", synonym: "Finish work", audioText: "Call it a day", category: "chunk", contextFa: "پایان دادن به کار", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-8", english: "See eye to eye", match: "Agree completely", synonym: "Agree completely", audioText: "See eye to eye", category: "chunk", contextFa: "هم‌عقیده بودن", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-9", english: "Spill the beans", match: "Reveal secret", synonym: "Reveal secret", audioText: "Spill the beans", category: "chunk", contextFa: "لو دادن راز", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-10", english: "Burn midnight oil", match: "Work late", synonym: "Work late", audioText: "Burn the midnight oil", category: "chunk", contextFa: "شب‌زنده‌داری کاری", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-11", english: "Bite the bullet", match: "Face hardship", synonym: "Face hardship", audioText: "Bite the bullet", category: "chunk", contextFa: "تحمل سختی", cefr: "B1", stageGroup: 4 },
  { id: "b1-g4-12", english: "Time flies", match: "Time passes fast", synonym: "Time passes fast", audioText: "Time flies", category: "chunk", contextFa: "گذر سریع زمان", cefr: "B1", stageGroup: 4 },
  { id: "b1-g5-1", english: "Substantial", match: "Significant", synonym: "Significant", audioText: "Substantial", category: "word", contextFa: "قابل توجه و چشمگیر", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-2", english: "Inevitable", match: "Unavoidable", synonym: "Unavoidable", audioText: "Inevitable", category: "word", contextFa: "اجتناب‌ناپذیر", cefr: "B1", stageGroup: 5, powerUp: "bomb" },
  { id: "b1-g5-3", english: "Crucial", match: "Vital", synonym: "Vital", audioText: "Crucial", category: "word", contextFa: "حیاتی و سرنوشت‌ساز", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-4", english: "Ambiguous", match: "Unclear", synonym: "Unclear", audioText: "Ambiguous", category: "word", contextFa: "مبهم و دوپهلو", cefr: "B1", stageGroup: 5, powerUp: "freeze" },
  { id: "b1-g5-5", english: "Feasible", match: "Achievable", synonym: "Achievable", audioText: "Feasible", category: "word", contextFa: "عملی و شدنی", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-6", english: "Reluctant", match: "Hesitant", synonym: "Hesitant", audioText: "Reluctant", category: "word", contextFa: "بی‌میل و مردد", cefr: "B1", stageGroup: 5, powerUp: "star" },
  { id: "b1-g5-7", english: "Abundant", match: "Plentiful", synonym: "Plentiful", audioText: "Abundant", category: "word", contextFa: "فراوان و سرشار", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-8", english: "Tedious", match: "Boring", synonym: "Boring", audioText: "Tedious", category: "word", contextFa: "کسالت‌بار و یکنواخت", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-9", english: "Considerable", match: "Substantial", synonym: "Substantial", audioText: "Considerable", category: "word", contextFa: "قابل ملاحظه", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-10", english: "Apparent", match: "Obvious", synonym: "Obvious", audioText: "Apparent", category: "word", contextFa: "آشکار و هویدا", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-11", english: "Genuine", match: "Authentic", synonym: "Authentic", audioText: "Genuine", category: "word", contextFa: "اصل و واقعی", cefr: "B1", stageGroup: 5 },
  { id: "b1-g5-12", english: "Prominent", match: "Famous", synonym: "Famous", audioText: "Prominent", category: "word", contextFa: "سرشناس و برجسته", cefr: "B1", stageGroup: 5 },

  // =========================================================================
  // CEFR B2: Books & CEFR Synonyms (5 Stage Groups for Stages 1 to 10)
  // =========================================================================
  { id: "b2-g1-1", english: "Compelling", match: "Convincing", synonym: "Convincing", audioText: "Compelling", category: "word", contextFa: "متقاعدکننده", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-2", english: "Profound", match: "Insightful", synonym: "Insightful", audioText: "Profound", category: "word", contextFa: "عمیق و خردمندانه", cefr: "B2", stageGroup: 1, powerUp: "bomb" },
  { id: "b2-g1-3", english: "Spontaneous", match: "Unplanned", synonym: "Unplanned", audioText: "Spontaneous", category: "word", contextFa: "فی‌البداهه", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-4", english: "Diligent", match: "Hardworking", synonym: "Hardworking", audioText: "Diligent", category: "word", contextFa: "کوشا و پیگیر", cefr: "B2", stageGroup: 1, powerUp: "freeze" },
  { id: "b2-g1-5", english: "Versatile", match: "Adaptable", synonym: "Adaptable", audioText: "Versatile", category: "word", contextFa: "همه‌فن‌حریف", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-6", english: "Meticulous", match: "Careful", synonym: "Careful", audioText: "Meticulous", category: "word", contextFa: "فوق‌العاده دقیق", cefr: "B2", stageGroup: 1, powerUp: "star" },
  { id: "b2-g1-7", english: "Perceptive", match: "Insightful", synonym: "Insightful", audioText: "Perceptive", category: "word", contextFa: "تیزهوش و باریک‌بین", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-8", english: "Pivotal", match: "Crucial", synonym: "Crucial", audioText: "Pivotal", category: "word", contextFa: "نقطه عطف و محوری", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-9", english: "Resilient", match: "Tough", synonym: "Tough", audioText: "Resilient", category: "word", contextFa: "انعطاف‌پذیر و سرسخت", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-10", english: "Plausible", match: "Believable", synonym: "Believable", audioText: "Plausible", category: "word", contextFa: "باورپذیر و موجه", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-11", english: "Intricate", match: "Complicated", synonym: "Complicated", audioText: "Intricate", category: "word", contextFa: "پیچیده و پر نقش‌ونگار", cefr: "B2", stageGroup: 1 },
  { id: "b2-g1-12", english: "Eloquent", match: "Articulate", synonym: "Articulate", audioText: "Eloquent", category: "word", contextFa: "خوش‌بیان و رسا", cefr: "B2", stageGroup: 1 },
  { id: "b2-g2-1", english: "Advocate", match: "Support publicly", synonym: "Support publicly", audioText: "Advocate", category: "word", contextFa: "طرفداری علنی", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-2", english: "Comprehend", match: "Grasp", synonym: "Grasp", audioText: "Comprehend", category: "word", contextFa: "درک همه‌جانبه", cefr: "B2", stageGroup: 2, powerUp: "bomb" },
  { id: "b2-g2-3", english: "Deteriorate", match: "Worsen", synonym: "Worsen", audioText: "Deteriorate", category: "word", contextFa: "رو به وخامت رفتن", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-4", english: "Enhance", match: "Improve", synonym: "Improve", audioText: "Enhance", category: "word", contextFa: "ارتقا دادن کیفیت", cefr: "B2", stageGroup: 2, powerUp: "freeze" },
  { id: "b2-g2-5", english: "Facilitate", match: "Make easier", synonym: "Make easier", audioText: "Facilitate", category: "word", contextFa: "تسهیل کردن", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-6", english: "Illustrate", match: "Demonstrate", synonym: "Demonstrate", audioText: "Illustrate", category: "word", contextFa: "تصویرسازی و نمایش", cefr: "B2", stageGroup: 2, powerUp: "star" },
  { id: "b2-g2-7", english: "Consolidate", match: "Strengthen", synonym: "Strengthen", audioText: "Consolidate", category: "word", contextFa: "تثبیت و تحکیم", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-8", english: "Scrutinize", match: "Examine closely", synonym: "Examine closely", audioText: "Scrutinize", category: "word", contextFa: "موشکافی کردن", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-9", english: "Mitigate", match: "Alleviate", synonym: "Alleviate", audioText: "Mitigate", category: "word", contextFa: "تسکین دادن و کاستن", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-10", english: "Underestimate", match: "Value too low", synonym: "Value too low", audioText: "Underestimate", category: "word", contextFa: "دست‌کم گرفتن", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-11", english: "Acknowledge", match: "Admit", synonym: "Admit", audioText: "Acknowledge", category: "word", contextFa: "اذعان و اعتراف", cefr: "B2", stageGroup: 2 },
  { id: "b2-g2-12", english: "Implement", match: "Execute", synonym: "Execute", audioText: "Implement", category: "word", contextFa: "اجرایی کردن طرح", cefr: "B2", stageGroup: 2 },
  { id: "b2-g3-1", english: "Think outside box", match: "Think creatively", synonym: "Think creatively", audioText: "Think outside the box", category: "chunk", contextFa: "تفکر نوآورانه", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-2", english: "Burn bridges", match: "Cut ties forever", synonym: "Cut ties forever", audioText: "Burn bridges", category: "chunk", contextFa: "پل‌های پشت سر را خراب کردن", cefr: "B2", stageGroup: 3, powerUp: "bomb" },
  { id: "b2-g3-3", english: "Face the music", match: "Accept consequences", synonym: "Accept consequences", audioText: "Face the music", category: "chunk", contextFa: "پذیرش عواقب", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-4", english: "Elephant in room", match: "Ignored obvious issue", synonym: "Ignored obvious issue", audioText: "Elephant in the room", category: "chunk", contextFa: "مشکل نادیده‌گرفته‌شده", cefr: "B2", stageGroup: 3, powerUp: "freeze" },
  { id: "b2-g3-5", english: "Barking up wrong tree", match: "Mistaken pursuit", synonym: "Mistaken pursuit", audioText: "Barking up the wrong tree", category: "chunk", contextFa: "سراغ نشانی غلط رفتن", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-6", english: "Devil's advocate", match: "Argue opposite side", synonym: "Argue opposite side", audioText: "Play devil's advocate", category: "chunk", contextFa: "ساز مخالف زدن در بحث", cefr: "B2", stageGroup: 3, powerUp: "star" },
  { id: "b2-g3-7", english: "At eleventh hour", match: "At the last minute", synonym: "At the last minute", audioText: "At the eleventh hour", category: "chunk", contextFa: "در دقیقه نود", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-8", english: "Grain of salt", match: "Be skeptical", synonym: "Be skeptical", audioText: "Take with a grain of salt", category: "chunk", contextFa: "با شک و تردید نگریستن", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-9", english: "Pave the way", match: "Facilitate progress", synonym: "Facilitate progress", audioText: "Pave the way", category: "chunk", contextFa: "هموار کردن مسیر", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-10", english: "Jump on bandwagon", match: "Follow trend", synonym: "Follow trend", audioText: "Jump on the bandwagon", category: "chunk", contextFa: "دنبال جو رفتن", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-11", english: "Cut corners", match: "Take shortcuts", synonym: "Take shortcuts", audioText: "Cut corners", category: "chunk", contextFa: "ماست‌مالی کردن", cefr: "B2", stageGroup: 3 },
  { id: "b2-g3-12", english: "Wrap head around", match: "Comprehend", synonym: "Comprehend", audioText: "Wrap one's head around", category: "chunk", contextFa: "سر درآوردن از موضوع", cefr: "B2", stageGroup: 3 },
  { id: "b2-g4-1", english: "Discrepancy", match: "Inconsistency", synonym: "Inconsistency", audioText: "Discrepancy", category: "word", contextFa: "ناهمخوانی و تناقض", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-2", english: "Prerequisite", match: "Requirement", synonym: "Requirement", audioText: "Prerequisite", category: "word", contextFa: "پیش‌نیاز ضروری", cefr: "B2", stageGroup: 4, powerUp: "bomb" },
  { id: "b2-g4-3", english: "Coherent", match: "Logically clear", synonym: "Logically clear", audioText: "Coherent", category: "word", contextFa: "منسجم و منطقی", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-4", english: "Ambiguous", match: "Vague", synonym: "Vague", audioText: "Ambiguous", category: "word", contextFa: "مبهم و تاریک", cefr: "B2", stageGroup: 4, powerUp: "freeze" },
  { id: "b2-g4-5", english: "Endeavor", match: "Effort", synonym: "Effort", audioText: "Endeavor", category: "word", contextFa: "سعی و تلاش پیگیر", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-6", english: "Constrain", match: "Restrict", synonym: "Restrict", audioText: "Constrain", category: "word", contextFa: "محدود کردن", cefr: "B2", stageGroup: 4, powerUp: "star" },
  { id: "b2-g4-7", english: "Substantiate", match: "Provide evidence", synonym: "Provide evidence", audioText: "Substantiate", category: "word", contextFa: "اثبات با مدرک", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-8", english: "Hypothesize", match: "Speculate", synonym: "Speculate", audioText: "Hypothesize", category: "word", contextFa: "فرضیه‌سازی کردن", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-9", english: "Paradoxical", match: "Contradictory", synonym: "Contradictory", audioText: "Paradoxical", category: "word", contextFa: "متناقض‌نما", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-10", english: "Prevalent", match: "Widespread", synonym: "Widespread", audioText: "Prevalent", category: "word", contextFa: "رایج و فراگیر", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-11", english: "Empirical", match: "Evidence-based", synonym: "Evidence-based", audioText: "Empirical", category: "word", contextFa: "تجربی و علمی", cefr: "B2", stageGroup: 4 },
  { id: "b2-g4-12", english: "Exemplary", match: "Outstanding", synonym: "Outstanding", audioText: "Exemplary", category: "word", contextFa: "نمونه و الگو", cefr: "B2", stageGroup: 4 },
  { id: "b2-g5-1", english: "Diligence", match: "Hard work", synonym: "Hard work", audioText: "Diligence", category: "word", contextFa: "سخت‌کوشی مداوم", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-2", english: "Pretentious", match: "Showy", synonym: "Showy", audioText: "Pretentious", category: "word", contextFa: "متظاهر و خودنما", cefr: "B2", stageGroup: 5, powerUp: "bomb" },
  { id: "b2-g5-3", english: "Unprecedented", match: "Never seen before", synonym: "Never seen before", audioText: "Unprecedented", category: "word", contextFa: "بی‌سابقه", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-4", english: "Vulnerable", match: "Easily harmed", synonym: "Easily harmed", audioText: "Vulnerable", category: "word", contextFa: "آسیب‌پذیر", cefr: "B2", stageGroup: 5, powerUp: "freeze" },
  { id: "b2-g5-5", english: "Formidable", match: "Awe-inspiring", synonym: "Awe-inspiring", audioText: "Formidable", category: "word", contextFa: "مهیب و تحسین‌برانگیز", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-6", english: "Inquisitive", match: "Curious", synonym: "Curious", audioText: "Inquisitive", category: "word", contextFa: "کنجکاو و پرسشگر", cefr: "B2", stageGroup: 5, powerUp: "star" },
  { id: "b2-g5-7", english: "Subtle", match: "Delicate", synonym: "Delicate", audioText: "Subtle", category: "word", contextFa: "ظریف و نامحسوس", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-8", english: "Tenacious", match: "Persistent", synonym: "Persistent", audioText: "Tenacious", category: "word", contextFa: "سرسخت و مصمم", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-9", english: "Volatile", match: "Unstable", synonym: "Unstable", audioText: "Volatile", category: "word", contextFa: "بی‌ثبات و ناپایدار", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-10", english: "Comprehensive", match: "All-inclusive", synonym: "All-inclusive", audioText: "Comprehensive", category: "word", contextFa: "جامع و کامل", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-11", english: "Conspicuous", match: "Noticeable", synonym: "Noticeable", audioText: "Conspicuous", category: "word", contextFa: "انگشت‌نما و آشکار", cefr: "B2", stageGroup: 5 },
  { id: "b2-g5-12", english: "Indispensable", match: "Essential", synonym: "Essential", audioText: "Indispensable", category: "word", contextFa: "حیاتی و ضروری", cefr: "B2", stageGroup: 5 },

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
