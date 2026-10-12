// ============================================================================
// SKILL STAGE BRIEFINGS DATABASE (300 STAGES ACROSS 5 CORE SKILLS)
// Strictly adhering to:
// 1. Exactly 1 sentence Context (Friendly, super simple, adult vocabulary)
// 2. Exactly 1 sentence Mission (Direct instructions on what to do in the game)
// ============================================================================

import type { SkillKey, CefrLevel } from "./types.ts";
import { getSkillLevel } from "./game-data.ts";
import { getWritingStageCase } from "./writing-clue-curriculum.ts";
import { getOdysseyStage } from "./reading-odyssey-curriculum.ts";
import { getGrammarStageData } from "./grammar-aef-curriculum.ts";
import { getEscapeRoomStage } from "./escape-rooms-curriculum.ts";

export interface SkillStageBriefing {
  skill: SkillKey;
  cefr: CefrLevel;
  levelNumber: number;
  titleFa: string;
  titleEn: string;
  contextFa: string; // دقیقا یک جمله ساده و خودمانی
  missionFa: string; // دقیقا یک جمله کار کاربر در بازی
  themeLabelFa?: string;
  skillIcon: string;
  accentColor: string;
  badgeLabel: string;
}

export const SKILL_BRIEFING_METAS: Record<SkillKey, { icon: string; accentColor: string; nameFa: string }> = {
  writing: { icon: "✍️", accentColor: "#0284c7", nameFa: "نگارش و رایتینگ" },
  reading: { icon: "📖", accentColor: "#8b5cf6", nameFa: "خواندن و درک مطلب" },
  vocabulary: { icon: "📚", accentColor: "#10b981", nameFa: "واژگان و اصطلاحات" },
  grammar: { icon: "⚡", accentColor: "#f59e0b", nameFa: "گرامر و ساختار" },
  speaking: { icon: "🎙️", accentColor: "#ef4444", nameFa: "مکالمه و گفتار" },
  listening: { icon: "🎧", accentColor: "#06b6d4", nameFa: "شنیداری و صوت" },
};

// Static bespoke briefs for all Writing levels
export const WRITING_BRIEFINGS_DATA: Record<CefrLevel, Record<number, { titleFa: string; titleEn: string; contextFa: string; missionFa: string }>> = {
  "A1": {
    "1": {
      "titleFa": "روشن شدن ربات: حرف بزرگ و نقطه پایان",
      "titleEn": "Power On: Capital Letters & Full Stops",
      "contextFa": "اینجا قراره یاد بگیریم چطور با حروف بزرگ و نقطه، یک جمله انگلیسی رو درست و تمیز شروع کنیم و ببندیم.",
      "missionFa": "کارت اینه که کلمه‌های به هم ریخته رو سر جای درست بذاری و حواست به کلمه اضافه هم باشه."
    },
    "2": {
      "titleFa": "تطابق فاعل و فعل To Be",
      "titleEn": "Subject & Verb To Be Harmony",
      "contextFa": "اینجا می‌خوایم ببینیم چطور فاعل‌های مفرد و جمع با am و is و are جفت می‌شن تا جمله‌مون اشتباه نوشته نشه.",
      "missionFa": "کارت اینه که قطعات فاعل و فعل رو درست پشت سر هم بچینی و کارت اشتباهی رو حذف کنی."
    },
    "3": {
      "titleFa": "ساخت جمله منفی با Not",
      "titleEn": "Negative Sentence Assembly",
      "contextFa": "اینجا یاد می‌گیریم چطور با گذاشتن not بعد از فعل، یک جمله مثبت رو خیلی راحت به حالت منفی دربیاریم.",
      "missionFa": "کارت اینه که کلمه منفی‌ساز رو دقیقاً بعد از فعل کمکی قرار بدی و جمله کامل رو بسازی."
    },
    "4": {
      "titleFa": "پرسش‌های ساده و جابجایی کلمات",
      "titleEn": "Yes/No Question Inversion",
      "contextFa": "اینجا قراره ببینیم وقتی می‌خوایم یک سوال ساده بپرسیم، چطور جای فاعل و فعل کمکی با هم عوض میشه.",
      "missionFa": "کارت اینه که فعل کمکی رو بیاری اول جمله و در آخر علامت سوال بذاری تا روبات سوالت رو بفهمه."
    },
    "5": {
      "titleFa": "صفت‌ها قبل از اسم",
      "titleEn": "Adjectives Before Nouns Order",
      "contextFa": "برعکس زبان فارسی، در انگلیسی صفت‌ها مثل رنگ و اندازه همیشه قبل از اسم میان تا اون رو توصیف کنند.",
      "missionFa": "کارت اینه که صفت رو جلوتر از اسم بذاری و قطعه توصیفی درست رو انتخاب کنی."
    },
    "6": {
      "titleFa": "کلمات ربط ساده: And و But",
      "titleEn": "Basic Linking Words: And & But",
      "contextFa": "اینجا یاد می‌گیریم چطور دو تا فکر شبیه هم رو با and و دو تا فکر متفاوت رو با but به هم وصل کنیم.",
      "missionFa": "کارت اینه که کلمه ربط دقیق بین دو جمله رو انتخاب کنی و متن کوتاه‌ت رو روان‌تر بنویسی."
    },
    "7": {
      "titleFa": "جمع بستن اسم‌ها و s جمع",
      "titleEn": "Plural Noun Formation & Spelling",
      "contextFa": "اینجا می‌خوایم یاد بگیریم وقتی بیشتر از یک چیز داریم، چطور با اضافه کردن s یا es اسم رو به حالت جمع دربیاریم.",
      "missionFa": "کارت اینه که املای درست اسم جمع رو انتخاب کنی و جمله رو بدون غلط دیکته‌ای کامل کنی."
    },
    "8": {
      "titleFa": "نشانه‌گذاری کاما در لیست‌ها",
      "titleEn": "Listing Comma Punctuation",
      "contextFa": "وقتی چند تا چیز رو پشت سر هم نام می‌بریم، باید بین کلمه‌ها ویرگول بذاریم تا خواننده گیج نشه.",
      "missionFa": "کارت اینه که ویرگول‌ها و کلمه and آخر لیست رو دقیقاً سر جای خودشون مرتب کنی."
    },
    "9": {
      "titleFa": "ضمایر مالکیت: My و Your و Our",
      "titleEn": "Possessive Adjectives in Action",
      "contextFa": "اینجا یاد می‌گیریم چطور با کلمه‌هایی مثل my و your نشون بدیم هر وسیله مال چه کسی هست.",
      "missionFa": "کارت اینه که ضمیر مالکیت مناسب رو اول اسم بذاری و جمله مرتب‌شده رو به ربات تحویل بدی."
    },
    "10": {
      "titleFa": "نگارش ایمیل کوتاه به یک دوست",
      "titleEn": "Micro-Email to a Friend",
      "contextFa": "اینجا قراره یاد بگیریم چطور یک پیام کوتاه و صمیمی به دوستمون بنویسیم و احوالش رو جویا بشیم.",
      "missionFa": "کارت اینه که سلام و احوال‌پرسی خودمانی رو مرتب بچینی و جمله خداحافظی رو درست تایپ کنی."
    }
  },
  "A2": {
    "1": {
      "titleFa": "زمان گذشته ساده با افعال باقاعده",
      "titleEn": "Past Simple Regular Verbs (-ed)",
      "contextFa": "اینجا قراره یاد بگیریم چطور درباره اتفاقاتی که دیروز افتاده بنویسیم و به آخر فعل‌ها ed اضافه کنیم.",
      "missionFa": "کارت اینه که جمله زمان گذشته رو به ترتیب زمان وقوع بچینی و فعل گذشته درست رو انتخاب کنی."
    },
    "2": {
      "titleFa": "افعال بی‌قاعده در گذشته: Went و Saw",
      "titleEn": "Irregular Past Action Verbs",
      "contextFa": "خیلی از فعل‌های پرکاربرد انگلیسی در گذشته شکلشون عوض میشه و باید شکل درستشون رو توی نگارش بیاریم.",
      "missionFa": "کارت اینه که کلمه‌های گذشته بی‌قاعده رو پیدا کنی و گزارش رخدادهای گذشته رو تکمیل کنی."
    },
    "3": {
      "titleFa": "کلمات ربط زمانی: Because و So",
      "titleEn": "Reason & Result Linkers",
      "contextFa": "اینجا یاد می‌گیریم چطور دلیل یک اتفاق رو با because و نتیجه‌اش رو با so خیلی شفاف بیان کنیم.",
      "missionFa": "کارت اینه که کلمه علت یا نتیجه مناسب رو بین دو بند قرار بدی تا داستان منطقی بشه."
    },
    "4": {
      "titleFa": "مقایسه دو چیز با صفات برتر",
      "titleEn": "Comparative Sentences with Than",
      "contextFa": "وقتی می‌خوایم دو تا چیز رو با هم مقایسه کنیم، به صفت کوتاه er اضافه می‌کنیم و بعدش than میاریم.",
      "missionFa": "کارت اینه که ساختار مقایسه‌ای جمله رو دقیق بچینی و کلمه than رو سر جاش بنشونی."
    },
    "5": {
      "titleFa": "برترین‌ها با صفات عالی (The Best)",
      "titleEn": "Superlative Sentence Mastery",
      "contextFa": "وقتی یک چیز در بین همه بهترین یا سریع‌ترینه، قبل از صفت the میاریم و به آخرش est اضافه می‌کنیم.",
      "missionFa": "کارت اینه که صفت عالی رو با نشانه‌های درستش مرتب کنی و جمله برتری مطلق رو بنویسی."
    },
    "6": {
      "titleFa": "برنامه‌های آینده با Be Going To",
      "titleEn": "Future Intentions with Going To",
      "contextFa": "اینجا یاد می‌گیریم چطور درباره تصمیم‌ها و برنامه‌هایی که برای فردا یا آخر هفته داریم بنویسیم.",
      "missionFa": "کارت اینه که ترکیب فاعل، فعل کمکی و going to رو منظم کنی و برنامه آینده رو بسازی."
    },
    "7": {
      "titleFa": "قیدهای حالت: Quick و Quickly",
      "titleEn": "Adverbs of Manner (-ly)",
      "contextFa": "صفت برای توصیف اسم به کار میره، اما قید نشون میده یک کار با چه کیفیتی و چطور انجام شده.",
      "missionFa": "کارت اینه که قید حالت ly دار رو در جای طبیعی بعد از فعل قرار بدی و تله صفت رو رد کنی."
    },
    "8": {
      "titleFa": "پیش‌نویس دعوت‌نامه مهمانی",
      "titleEn": "Friendly Party Invitation Note",
      "contextFa": "اینجا یاد می‌گیریم چطور یک یادداشت دعوت خودمانی بنویسیم و زمان و مکان مهمانی رو دقیق بگیم.",
      "missionFa": "کارت اینه که اجزای دعوت‌نامه رو به ترتیب خوش‌آمد، ساعت و نشانی مرتب کنی و سند رو ببندی."
    },
    "9": {
      "titleFa": "شروع پاراگراف با حروف ربط زمانی",
      "titleEn": "Sequence Markers: First & Next",
      "contextFa": "برای اینکه مراحل یک کار مثل آشپزی یا آدرس دادن مرتب باشه، از کلماتی مثل First و Then استفاده می‌کنیم.",
      "missionFa": "کارت اینه که مراحل رو بر اساس توالی زمانی بچینی و دستورالعمل شفاف بسازی."
    },
    "10": {
      "titleFa": "نگارش پیام کوتاه معذرت‌خواهی",
      "titleEn": "Short Apology & Explanation",
      "contextFa": "اینجا یاد می‌گیریم چطور مودبانه عذرخواهی کنیم و دلیل دیر رسیدن یا غیبتمون رو خیلی ساده بنویسیم.",
      "missionFa": "کارت اینه که عبارت پوزش و توضیح منطقی رو به هم گره بزنی و پیام نهایی رو تایپ کنی."
    }
  },
  "B1": {
    "1": {
      "titleFa": "تضاد و تقابل با However و Although",
      "titleEn": "Contrasting Ideas: However & Although",
      "contextFa": "اینجا می‌خوایم ببینیم چطور وقتی دو تا ایده مخالف هم داریم، با However و Although اون‌ها رو حرفه‌ای به هم وصل کنیم.",
      "missionFa": "کارت اینه که کلمه تضاد مناسب رو با نشانه‌گذاری ویرگول سر جاش بذاری و تفاوت دو نظر رو نشون بدی."
    },
    "2": {
      "titleFa": "جملات مجهول در گزارش‌های روزمره",
      "titleEn": "Passive Voice in Everyday Reports",
      "contextFa": "وقتی خود کار از انجام‌دهنده‌اش مهم‌تره یا فاعل رو نمی‌شناسیم، جمله رو به صورت مجهول می‌نویسیم.",
      "missionFa": "کارت اینه که ساختار مجهول رو با فعل to be و شکل سوم فعل بچینی و گزارش رسمی رو تنظیم کنی."
    },
    "3": {
      "titleFa": "جملات شرطی نوع اول: رخدادهای محتمل",
      "titleEn": "First Conditional for Real Plans",
      "contextFa": "اینجا یاد می‌گیریم چطور بگیم اگر فلان اتفاق بیفته، در آینده چه نتیجه‌ای به همراه خواهد داشت.",
      "missionFa": "کارت اینه که بند if رو در زمان حال ساده نگه داری و بخش نتیجه رو با will کامل کنی."
    },
    "4": {
      "titleFa": "جملات شرطی نوع دوم: فرضیه‌ها و آرزوها",
      "titleEn": "Second Conditional for Hypothetical Cases",
      "contextFa": "وقتی درباره موقعیت‌های خیالی یا آرزوهای دور از ذهن می‌نویسیم، از گذشته در شرط و would در جواب استفاده می‌کنیم.",
      "missionFa": "کارت اینه که ساختار فرضی رو بدون اشتباه زمان‌ها به هم وصل کنی و نتیجه تخیلی رو بنویسی."
    },
    "5": {
      "titleFa": "ضمایر موصولی: Who و Which و Where",
      "titleEn": "Relative Clauses for Adding Detail",
      "contextFa": "برای اینکه جملاتمون کوتاه و تکراری نباشه، با کلمه‌هایی مثل who و which توضیحات اضافه به اسم می‌چسبونیم.",
      "missionFa": "کارت اینه که ضمیر موصولی مناسب شخص یا شیء رو سر جای خودش قرار بدی و دو جمله رو یکی کنی."
    },
    "6": {
      "titleFa": "نقل قول غیرمستقیم در نگارش",
      "titleEn": "Reported Speech in Written Contexts",
      "contextFa": "اینجا یاد می‌گیریم چطور حرف‌های دیگران رو بدون علامت نقل‌قول و با عقب بردن زمان فعل گزارش کنیم.",
      "missionFa": "کارت اینه که تغییرات فاعل و زمان فعل رو در نقل قول اعمال کنی و گزارش صحبت‌ها رو بسازی."
    },
    "7": {
      "titleFa": "پاراگراف‌نویسی: جمله موضوع (Topic Sentence)",
      "titleEn": "Crafting a Clear Topic Sentence",
      "contextFa": "اولین جمله هر پاراگراف باید ایده اصلی رو مثل یک تابلوی راهنما به خواننده نشون بده.",
      "missionFa": "کارت اینه که جامع‌ترین جمله معرف پاراگراف رو پیدا کنی و جزییات پشتیبان رو پشت سرش بچینی."
    },
    "8": {
      "titleFa": "حروف ربط نتیجه: Therefore و As a Result",
      "titleEn": "Cause & Effect Linkers in Paragraphs",
      "contextFa": "برای ارتباط منطقی بین علت یک اتفاق و نتیجه قطعی اون در متن‌های جدی‌تر، از Therefore استفاده می‌کنیم.",
      "missionFa": "کارت اینه که نشانه‌های ویرگول و پیوند علت و معلول رو دقیق بذاری و استدلال رو محکم کنی."
    },
    "9": {
      "titleFa": "نگارش ایمیل رسمی درخواست اطلاعات",
      "titleEn": "Formal Inquiry Email Template",
      "contextFa": "در نامه‌های رسمی لحن محترمانه است و به جای کلمات عامیانه از عباراتی مثل I would like to inquire استفاده می‌کنیم.",
      "missionFa": "کارت اینه که لحن اداری رو حفظ کنی و درخواستت رو واضح و مودبانه تایپ کنی."
    },
    "10": {
      "titleFa": "نگارش انشای بیان نظر: موافق یا مخالف",
      "titleEn": "Opinion Essay Paragraph: Agree or Disagree",
      "contextFa": "اینجا قراره یاد بگیریم چطور نظرمون رو با دلایل محکم بنویسیم و با مثال از ادعامون دفاع کنیم.",
      "missionFa": "کارت اینه که عبارت بیان دیدگاه رو با دو تا دلیل منطقی گره بزنی و نتیجه‌گیری رو تایپ کنی."
    }
  },
  "B2": {
    "1": {
      "titleFa": "تضاد پیشرفته با Despite و In Spite Of",
      "titleEn": "Advanced Concession with Despite",
      "contextFa": "کلماتی مثل Despite برعکس Although نیاز به اسم یا فعل ing دار دارند و لحن نگارش رو بسیار پخته‌تر می‌کنند.",
      "missionFa": "کارت اینه که ساختار اسمی بعد از Despite رو درست بچینی و دام‌های گرامری رو دور بزنی."
    },
    "2": {
      "titleFa": "افعال کمکی برای حدس گذشته (Must have been)",
      "titleEn": "Modal Verbs for Past Deductions",
      "contextFa": "وقتی بر اساس مدارک موجود تقریباً مطمئنیم در گذشته چه اتفاقی افتاده، از ترکیب must have با شکل سوم فعل استفاده می‌کنیم.",
      "missionFa": "کارت اینه که تحلیل سرنخ‌ها رو با فعل حدس در گذشته سرهم کنی و نتیجه بازرسی رو بنویسی."
    },
    "3": {
      "titleFa": "حالت‌های مجهول پیشرفته در اخبار",
      "titleEn": "Advanced Passive Voice in Media Reports",
      "contextFa": "در گزارش‌های خبری از ساختارهایی مثل It is believed that برای بیان باورهای عمومی استفاده میشه.",
      "missionFa": "کارت اینه که بند مجهول رسمی رو مرتب کنی و گزاره خبری معتبر رو ثبت کنی."
    },
    "4": {
      "titleFa": "جملات شرطی نوع سوم: حسرت‌های گذشته",
      "titleEn": "Third Conditional for Regrets & Past Reflections",
      "contextFa": "وقتی درباره گذشته صحبت می‌کنیم که اگر فلان کار رو می‌کردیم الان نتیجه فرق داشت، از شرطی نوع سوم استفاده می‌کنیم.",
      "missionFa": "کارت اینه که ساختار had done رو با would have done ترکیب کنی و فرضیه گذشته رو شکل بدی."
    },
    "5": {
      "titleFa": "ضمایر موصولی غیرتعریفی با ویرگول",
      "titleEn": "Non-defining Relative Clauses with Commas",
      "contextFa": "اطلاعات فرعی که اگر از جمله حذف بشن معنای اصلی آسیب نمی‌بینه، باید حتماً بین دو تا ویرگول قرار بگیرند.",
      "missionFa": "کارت اینه که ویرگول‌های دو طرف توضیح اضافه رو دقیق تنظیم کنی تا ساختار به هم نریزه."
    },
    "6": {
      "titleFa": "کالوکیشن‌های آکادمیک و ترکیب واژگان",
      "titleEn": "Academic Collocations & Register",
      "contextFa": "برای اینکه نوشته‌مون طبیعی باشه، باید کلماتی که معمولاً با هم میان مثل conduct research رو درست کنار هم بذاریم.",
      "missionFa": "کارت اینه که همایندهای دقیق رو به جای کلمات ضعیف جایگزین کنی و متن رو ارتقا بدی."
    },
    "7": {
      "titleFa": "بندهای اسمی متمم با That و Whether",
      "titleEn": "Noun Clauses as Sentential Complements",
      "contextFa": "اینجا یاد می‌گیریم چطور یک جمله کامل رو به عنوان فاعل یا مفعول یک جمله دیگه بنشونیم.",
      "missionFa": "کارت اینه که بند اسمی رو در موقعیت درست ساختاری هدایت کنی و گزاره غنی بسازی."
    },
    "8": {
      "titleFa": "نگارش گزارش تحلیلی: مزایا و معایب",
      "titleEn": "Balanced For & Against Essay Introduction",
      "contextFa": "در مقالات تحلیلی باید بی‌طرفی رو حفظ کنیم و هر دو روی سکه رو منصفانه در مقدمه مطرح کنیم.",
      "missionFa": "کارت اینه که پاراگراف معرفی رو با طرح هر دو دیدگاه سازمان‌دهی کنی و پایان‌بندی رو بزنی."
    },
    "9": {
      "titleFa": "اصلاح ابهام در پیوندهای ضمیری",
      "titleEn": "Pronoun Reference Clarity & Cohesion",
      "contextFa": "خواننده نباید حدس بزنه ضمیر it یا they به کدوم کلمه برمی‌گرده؛ مرجع هر ضمیر باید کاملاً شفاف باشه.",
      "missionFa": "کارت اینه که مراجع ضمایر مبهم رو شفاف کنی و یک متن بدون سردرگمی تحویل بدی."
    },
    "10": {
      "titleFa": "نگارش نامه اعتراض رسمی و پیگیری",
      "titleEn": "Formal Letter of Complaint & Redress",
      "contextFa": "در نامه شکایت جدی، عصبانیت فایده نداره؛ باید با خونسردی و کلمات رسمی حق خودمون رو مطالبه کنیم.",
      "missionFa": "کارت اینه که شرح مشکل رو بدون لحن توهین‌آمیز اما قاطعانه بنویسی و درخواست جبران خسارت کنی."
    }
  },
  "C1": {
    "1": {
      "titleFa": "وارونگی نحوی با قیود منفی (Not Only)",
      "titleEn": "Syntactic Inversion with Negative Adverbials",
      "contextFa": "وقتی کلماتی مثل Not only یا Seldom اول جمله میان، جای فاعل و فعل کمکی برعکس میشه تا لحن پرقدرت بشه.",
      "missionFa": "کارت اینه که ترتیب کلمات رو بعد از قید منفی جابه‌جا کنی و جمله خطابی سنگین بسازی."
    },
    "2": {
      "titleFa": "وارونگی در جملات شرطی (Had I known)",
      "titleEn": "Conditional Inversion without If",
      "contextFa": "در متون بسیار رسمی کلمه If رو حذف می‌کنیم و با آوردن Had یا Should به اول جمله، شرط رو بیان می‌کنیم.",
      "missionFa": "کارت اینه که شرط بدون If رو با تعادل کامل بندها پیاده کنی و گزارش رسمی رو کامل کنی."
    },
    "3": {
      "titleFa": "جملات انشعابی تاکیدی (It is ... that)",
      "titleEn": "Cleft Sentences for Laser Focus",
      "contextFa": "وقتی می‌خوایم روی بخش خاصی از جمله مثل عامل اصلی اتفاق دست بذاریم، از ساختار It is ... who/that استفاده می‌کنیم.",
      "missionFa": "کارت اینه که نقطه تمرکز اصلی رو به ساختار انشعابی هدایت کنی و پیام محوری رو برجسته کنی."
    },
    "4": {
      "titleFa": "بندهای وجهی و متمم‌های مصدری (Gerund/Participle)",
      "titleEn": "Participle Clauses for Sentence Economy",
      "contextFa": "برای خلاصه کردن متن و نگارش حرفه‌ای، جملات طولانی رو با عبارات ing دار مثل Having arrived فشرده می‌کنیم.",
      "missionFa": "کارت اینه که بند وصفی کوتاه‌شده رو درست به فاعل اصلی وصل کنی و از خطای معلق بودن جلوگیری کنی."
    },
    "5": {
      "titleFa": "واژه‌بندی محتاطانه علمی (Hedging in Academic Writing)",
      "titleEn": "Epistemic Hedging & Cautious Claims",
      "contextFa": "در مقالات علمی نباید ادعای ۱۰۰ درصدی قطعی کرد؛ باید از کلماتی مثل suggests و tends to برای احتیاط استفاده کنیم.",
      "missionFa": "کارت اینه که کلمات قطعی و اغراق‌آمیز رو با واژه‌های سنجیده دانشگاهی جایگزین کنی."
    },
    "6": {
      "titleFa": "انسجام متن و پیوندهای فرامتنی",
      "titleEn": "Lexical Cohesion & Advanced Signposting",
      "contextFa": "ارتباط بین پاراگراف‌ها با کلماتی مثل Furthermore و Conversely مثل نخ تسبیح ایده‌ها رو به هم وصل می‌کنه.",
      "missionFa": "کارت اینه که ترانزیشن‌های غنی رو در مفصل پاراگراف‌ها بنشونی و روانی متن رو تضمین کنی."
    },
    "7": {
      "titleFa": "نشانه‌گذاری پیشرفته: سمی‌کالن و دش",
      "titleEn": "Punctuation Precision: Semicolons & Em-dashes",
      "contextFa": "نقطه‌ویرگول (;) دو جمله کامل اما به شدت مرتبط رو بدون کلمه ربط به هم گره می‌زنه و وقار متن رو بالا می‌بره.",
      "missionFa": "کارت اینه که کاربرد دقیق سمی‌کالن رو از کاما تشخیص بدی و ساختار مقتدر بسازی."
    },
    "8": {
      "titleFa": "نگارش بیانیه مسئله در پروپوزال",
      "titleEn": "Research Problem Statement Formulation",
      "contextFa": "یک پژوهشگر باید مشکل موجود، خلاء پژوهشی و اهمیت حل اون رو در چند خط شفاف توضیح بده.",
      "missionFa": "کارت اینه که گزاره شکاف دانش رو دقیق صورت‌بندی کنی و طرح پیشنهادی رو تایپ کنی."
    },
    "9": {
      "titleFa": "استدلال نقض و پاسخ به دیدگاه مخالف",
      "titleEn": "Counter-argument Rebuttal Structure",
      "contextFa": "در متون آکادمیک ابتدا نظر مخالف رو محترمانه مطرح می‌کنیم و بلافاصله با مدرک محکم اون رو رد می‌کنیم.",
      "missionFa": "کارت اینه که بند تصدیق و بند رد قاطع رو پشت سر هم بچینی و برهان رو اثبات کنی."
    },
    "10": {
      "titleFa": "نگارش چکیده آکادمیک استاندارد",
      "titleEn": "Executive Abstract & Synthesis",
      "contextFa": "چکیده مقاله باید هدف، روش، نتیجه و دستاورد کلیدی رو در خلاصه‌ترین کلمات ممکن منتقل کنه.",
      "missionFa": "کارت اینه که فشرده‌ترین جملات بازتاب‌دهنده تحقیق رو سرهم کنی و چکیده نهایی رو ثبت کنی."
    }
  },
  "C2": {
    "1": {
      "titleFa": "فشردگی مفهومی و اسم‌سازی (Nominalization)",
      "titleEn": "Heavy Nominalization & Concept Density",
      "contextFa": "در مقالات فوق‌پیشرفته به جای فعل از اسم‌های ساخته‌شده استفاده میشه تا حجم عظیمی از معنا در یک خط بنشینه.",
      "missionFa": "کارت اینه که بندهای فعلی رو به عبارات اسمی متراکم تبدیل کنی و سند بین‌المللی بسازی."
    },
    "2": {
      "titleFa": "ساختارهای التزامی حقوقی (Subjunctive Mood)",
      "titleEn": "Subjunctive Mood in Legal & Formal Charters",
      "contextFa": "در مصوبات و اسناد قانونی برای تاکید بر ضرورت، از فعل ساده بعد از کلماتی مثل demand that استفاده میشه.",
      "missionFa": "کارت اینه که ساختار التزامی بدون s سوم شخص رو انتخاب کنی و متن بیانیه رو رسمی کنی."
    },
    "3": {
      "titleFa": "آهنگ و تقارن نحوی در متن (Parallelism)",
      "titleEn": "Rhetorical Parallelism & Balance",
      "contextFa": "وقتی چند تا عبارت کنار هم میان، باید ساختار گرامری کاملاً یکدست داشته باشند تا نوشته خوش‌آهنگ و ماندگار بشه.",
      "missionFa": "کارت اینه که ناهماهنگی دستوری بین بندها رو برطرف کنی و تقارن کلامی بی‌نقص بسازی."
    },
    "4": {
      "titleFa": "وارونگی با ساختارهای باستانی و ادبی",
      "titleEn": "Locative & Archaic Literary Inversions",
      "contextFa": "ساختارهایی مثل Little did they realize یا Under no circumstances اوج تسلط به ادبیات فاخر انگلیسی هستند.",
      "missionFa": "کارت اینه که قطعات ادبی وارونه رو بدون کوچک‌ترین خطای توالی بچینی و متن ممتاز بسازی."
    },
    "5": {
      "titleFa": "وارونگی مجهول با ساختارهای سببی",
      "titleEn": "Complex Causative Passives with Have/Get",
      "contextFa": "اینجا با پیچیده‌ترین حالت‌های مجهول غیرمستقیم که نقش واسطه در وقوع یک رویداد رو دارند کار می‌کنیم.",
      "missionFa": "کارت اینه که فاعل سببی و شکل درست فعل رو تنظیم کنی و سند حقوقی رو امضا کنی."
    },
    "6": {
      "titleFa": "استعاره‌های مفهومی و متون دیپلماتیک",
      "titleEn": "Conceptual Metaphors in Diplomatic Prose",
      "contextFa": "در بیانیه‌های بین‌المللی پیام‌ها با استعاره‌های ظریف و دیپلماتیک بیان میشن تا سوءبرداشت ایجاد نشه.",
      "missionFa": "کارت اینه که گزاره‌های چندلایه دیپلماتیک رو تحلیل کنی و دقیق‌ترین اصطلاح رو بنشانی."
    },
    "7": {
      "titleFa": "تعادل نقطه‌گذاری در متون چندبندی",
      "titleEn": "Nuanced Polysyndeton & Asyndeton Control",
      "contextFa": "کنترل آگاهانه حذف یا تکرار کلمات ربط به متن ریتم تند یا دراماتیک میده که نشانه قلم نویسندگان بزرگ است.",
      "missionFa": "کارت اینه که جریان نشانه‌گذاری متراکم رو هدایت کنی و لحن استادانه بسازی."
    },
    "8": {
      "titleFa": "نگارش معاهده و موافقت‌نامه رسمی",
      "titleEn": "International Treaty Provision Drafting",
      "contextFa": "در متن معاهدات هر کلمه بار حقوقی سنگین داره و هیچ جای ابهام یا تفسیر دوگانه نباید باقی بمونه.",
      "missionFa": "کارت اینه که قیود الزام‌آور قانونی رو درست در کنار شروط بچینی و متن پیمان رو کامل کنی."
    },
    "9": {
      "titleFa": "نگارش یادداشت موضع‌گیری سیاستی (Policy Brief)",
      "titleEn": "High-Stakes Policy Memo Synthesis",
      "contextFa": "این سند برای تصمیم‌گیرندگان ارشد نوشته میشه و باید راهکار عملی رو با نهایت اختصار و دقت ارائه بده.",
      "missionFa": "کارت اینه که شواهد بحران و پیشنهاد سیاستی رو به هم متصل کنی و گزارش رو نهایی کنی."
    },
    "10": {
      "titleFa": "منشور بیانیه نهایی و میثاق ماندگار",
      "titleEn": "The Grand Sovereign Charter Synthesis",
      "contextFa": "این آخرین و والاترین مرحله نگارش است که تمام مهارت‌های زبان رو در قالب یک مانیفست تاریخی به چالش می‌کشه.",
      "missionFa": "کارت اینه که کلمات کلیدی میثاق جاودان رو با نهایت دقت تایپ کنی و پرونده رو جاودانه ببندی."
    }
  }
};


export function getSkillStageBriefing(
  skill: SkillKey,
  cefr: CefrLevel,
  levelNumber: number,
  fallbackTitleFa?: string,
  fallbackTitleEn?: string
): SkillStageBriefing {
  const meta = SKILL_BRIEFING_METAS[skill] || { icon: "🎮", accentColor: "#3b82f6", nameFa: skill };
  const badgeLabel = `مرحله ${levelNumber} • ${cefr}`;

  // 1. WRITING BRIEFING (From bespoke 60-stage curriculum)
  if (skill === "writing") {
    const bespoke = WRITING_BRIEFINGS_DATA[cefr]?.[levelNumber];
    const caseData = getWritingStageCase(cefr, levelNumber);
    const titleFa = bespoke?.titleFa || caseData?.stageTitleFa || fallbackTitleFa || `پرونده مرحله ${levelNumber}`;
    const titleEn = bespoke?.titleEn || caseData?.stageTitleEn || fallbackTitleEn || `Case ${levelNumber}`;
    const contextFa = bespoke?.contextFa || (caseData ? `در این پرونده ماجرای «${caseData.scenarioFa}» رو بررسی می‌کنیم تا اصول نگارش رو یاد بگیریم.` : "اینجا قراره یاد بگیریم چطور جملات انگلیسی رو با اصول درست نگارشی مرتب و کامل کنیم.");
    const missionFa = bespoke?.missionFa || "کارت اینه که قطعات سرنخ رو مرتب بچینی، شواهد رو با کلمات ربط وصل کنی و سند نهایی رو تایپ کنی.";

    return {
      skill,
      cefr,
      levelNumber,
      titleFa,
      titleEn,
      contextFa,
      missionFa,
      themeLabelFa: caseData?.themeTitleFa || "کارآگاهان کلمه",
      skillIcon: meta.icon,
      accentColor: meta.accentColor,
      badgeLabel,
    };
  }

  // 2. READING BRIEFING (From 60-story narrative odyssey)
  if (skill === "reading") {
    const stage = getOdysseyStage(cefr, levelNumber);
    const primaryStory = stage?.stories?.[0];
    const titleFa = primaryStory?.titleFa || stage?.stageTitleFa || fallbackTitleFa || `ماجرای مرحله ${levelNumber}`;
    const titleEn = primaryStory?.titleEn || stage?.stageTitleEn || fallbackTitleEn || `Odyssey Stage ${levelNumber}`;
    const contextFa = primaryStory
      ? `توی این مرحله ماجرای جذاب «${primaryStory.titleFa}» رو با هم می‌خونیم تا بفهمیم داستان چطور پیش میره.`
      : "توی این مرحله یک متن داستانی جذاب انگلیسی رو با هم می‌خونیم تا مفهوم اصلی و جزییات مهمش رو متوجه بشیم.";
    const missionFa = "کارت اینه که متن انگلیسی رو سریع بخونی و به معمای درک مطلب جواب درست بدی تا مسیرهای جدید قصه برات باز بشه.";

    return {
      skill,
      cefr,
      levelNumber,
      titleFa,
      titleEn,
      contextFa,
      missionFa,
      themeLabelFa: stage?.themeTitleFa || "ماجراهای سرنوشت‌ساز",
      skillIcon: meta.icon,
      accentColor: meta.accentColor,
      badgeLabel,
    };
  }

  // 3. GRAMMAR BRIEFING (From 60-stage AEF wire-routing curriculum)
  if (skill === "grammar") {
    const stageData = getGrammarStageData(cefr, levelNumber);
    const titleFa = stageData?.titleFa || fallbackTitleFa || `مدار نحو مرحله ${levelNumber}`;
    const titleEn = stageData?.titleEn || fallbackTitleEn || `Grammar Stage ${levelNumber}`;
    const contextFa = stageData
      ? `اینجا می‌خوایم ببینیم گرامر «${stageData.titleFa}» چطور کار می‌کنه و چطور جملاتمون رو از پایه بدون غلط بسازیم.`
      : "اینجا قراره یاد بگیریم چطور اجزای جمله رو بر اساس قوانین گرامری درست کنار هم قرار بدیم.";
    const missionFa = "کارت اینه که کلمه درست رو از اضلاع شش‌ضلعی انتخاب کنی و سیم‌کشی سبز برق رو بدون اتصال کوتاه به خط پایان برسونی.";

    return {
      skill,
      cefr,
      levelNumber,
      titleFa,
      titleEn,
      contextFa,
      missionFa,
      themeLabelFa: stageData?.aefUnit || "سیم‌کشی شش‌ضلعی نحو",
      skillIcon: meta.icon,
      accentColor: meta.accentColor,
      badgeLabel,
    };
  }

  // 4. SPEAKING BRIEFING (From 60 escape-room missions)
  if (skill === "speaking") {
    const stage = getEscapeRoomStage(cefr, levelNumber);
    const titleFa = stage?.titleFa || fallbackTitleFa || `اتاق فرار مرحله ${levelNumber}`;
    const titleEn = stage?.titleEn || fallbackTitleEn || `Escape Room ${levelNumber}`;
    const contextFa = stage
      ? `تصور کن در این موقعیت گیر افتادی: «${stage.storyIntroFa}» و باید با حرف زدن خودت رو نجات بدی.`
      : "توی این موقعیت فرضی قفل شدی و باید با مکالمه درست انگلیسی قفل‌ها رو یکی‌یکی باز کنی.";
    const missionFa = "کارت اینه که اشیای اتاق رو لمس کنی، با صدای خودت جمله انگلیسی رو بگی و قبل از تموم شدن وقت فرار کنی.";

    return {
      skill,
      cefr,
      levelNumber,
      titleFa,
      titleEn,
      contextFa,
      missionFa,
      themeLabelFa: stage?.aefBookAndUnit || "اتاق فرار صوتی",
      skillIcon: meta.icon,
      accentColor: meta.accentColor,
      badgeLabel,
    };
  }

  // 5. VOCABULARY BRIEFING (From Word Cascade & Continuous Dialogues)
  const lvl = getSkillLevel("vocabulary", cefr, levelNumber);
  const titleFa = lvl?.titleFa || fallbackTitleFa || `واژگان مرحله ${levelNumber}`;
  const titleEn = lvl?.titleEn || fallbackTitleEn || `Vocabulary Stage ${levelNumber}`;
  const isAdvancedDialogue = cefr === "C1" || cefr === "C2";

  const contextFa = isAdvancedDialogue
    ? `توی این مرحله می‌خوایم اصطلاحات طبیعی و پرکاربرد موضوع «${titleFa}» رو در دل یک چت واقعی یاد بگیریم.`
    : `اینجا با مهم‌ترین کلمات و هم‌آیندهای موضوع «${titleFa}» آشنا می‌شیم تا دایره لغاتمون قوی‌تر بشه.`;

  const missionFa = isAdvancedDialogue
    ? "کارت اینه که اصطلاح دقیق متناسب با مکالمه رقیب رو سریع انتخاب کنی و رکورد زمان بزنی."
    : "کارت اینه که هر کلمه انگلیسی رو با معادل یا هم‌معنی درستش جفت کنی تا منفجر بشن و امتیاز جمع کنی.";

  return {
    skill,
    cefr,
    levelNumber,
    titleFa,
    titleEn,
    contextFa,
    missionFa,
    themeLabelFa: isAdvancedDialogue ? "مکالمه پیوسته واژگان" : "آبشار کلمات",
    skillIcon: meta.icon,
    accentColor: meta.accentColor,
    badgeLabel,
  };
}
