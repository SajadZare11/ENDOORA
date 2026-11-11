export interface StudentAvatar {
  id: string;
  symbol: string;
  name_fa: string;
  name_en: string;
  title_fa: string;
  title_en: string;
  meaning_fa: string;
  meaning_en: string;
  gradient: string;
  glow: string;
  borderColor: string;
}

export const STUDENT_AVATARS: StudentAvatar[] = [
  {
    id: "owl",
    symbol: "🦉",
    name_fa: "جغد دانا",
    name_en: "Wise Owl",
    title_fa: "خرد و تسلط کامل",
    title_en: "Wisdom & Mastery",
    meaning_fa: "تمرکز عمیق روی تسلط دقیق بر گرامر و واژگان",
    meaning_en: "Deep focus on precise grammar and vocabulary mastery",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    glow: "rgba(59, 130, 246, 0.4)",
    borderColor: "#60a5fa",
  },
  {
    id: "rocket",
    symbol: "🚀",
    name_fa: "فضاپیمای پیشرفت",
    name_en: "Speed Rocket",
    title_fa: "سرعت و شتاب یادگیری",
    title_en: "Speed & Momentum",
    meaning_fa: "پیشرفت پرسرعت در مسیر یادگیری زبان انگلیسی",
    meaning_en: "Fast-track progress along your English learning path",
    gradient: "linear-gradient(135deg, #6b21a8 0%, #a855f7 50%, #ec4899 100%)",
    glow: "rgba(168, 85, 247, 0.4)",
    borderColor: "#c084fc",
  },
  {
    id: "trophy",
    symbol: "🏆",
    name_fa: "کاپ قهرمانی",
    name_en: "Champion Trophy",
    title_fa: "رتبه برتر امتحانات",
    title_en: "Top Performer",
    meaning_fa: "کسب بالاترین نمرات در امتحانات کلاسی و نهایی",
    meaning_en: "Aiming for 20/20 in school exams and finals",
    gradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    borderColor: "#fbbf24",
  },
  {
    id: "brain",
    symbol: "🧠",
    name_fa: "مغز متفکر",
    name_en: "Mastermind",
    title_fa: "هوش تحلیلی و حل مسئله",
    title_en: "Analytical Genius",
    meaning_fa: "درک عمیق ساختارهای زبان و تکنیک‌های تست‌زنی",
    meaning_en: "Deep understanding of language patterns and Cloze reading",
    gradient: "linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #67e8f9 100%)",
    glow: "rgba(6, 182, 212, 0.4)",
    borderColor: "#22d3ee",
  },
  {
    id: "book",
    symbol: "📖",
    name_fa: "کتاب طلایی",
    name_en: "Golden Book",
    title_fa: "مطالعه و نهایی ۲۰",
    title_en: "Academic Excellence",
    meaning_fa: "تعهد به مرور منظم جزوات، کتاب درسی و نمونه‌سوالات",
    meaning_en: "Commitment to studying textbooks, notes, and past exams",
    gradient: "linear-gradient(135deg, #047857 0%, #10b981 50%, #a7f3d0 100%)",
    glow: "rgba(16, 185, 129, 0.4)",
    borderColor: "#34d399",
  },
  {
    id: "star",
    symbol: "⭐",
    name_fa: "ستاره درخشان",
    name_en: "Shining Star",
    title_fa: "درخشش و پشتکار",
    title_en: "Perseverance & Glory",
    meaning_fa: "انجام بی‌وقفه تمرینات و درخشش در بین هم‌کلاسی‌ها",
    meaning_en: "Consistent daily effort and standing out among peers",
    gradient: "linear-gradient(135deg, #d97706 0%, #fbbf24 60%, #fffbeb 100%)",
    glow: "rgba(251, 191, 36, 0.5)",
    borderColor: "#fde047",
  },
  {
    id: "diamond",
    symbol: "💎",
    name_fa: "الماس پرمیوم",
    name_en: "VIP Diamond",
    title_fa: "یادگیرنده ممتاز VIP",
    title_en: "VIP Learner",
    meaning_fa: "دسترسی به بالاترین کیفیت آموزشی و منابع تخصصی",
    meaning_en: "Premium access to top-tier coaching and exclusive tests",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #38bdf8 50%, #e0f2fe 100%)",
    glow: "rgba(56, 189, 248, 0.45)",
    borderColor: "#7dd3fc",
  },
  {
    id: "flame",
    symbol: "🔥",
    name_fa: "شعله تمرکز",
    name_en: "Focus Flame",
    title_fa: "استریک و استمرار روزانه",
    title_en: "Daily Habit & Fire",
    meaning_fa: "حفظ زنجیره پیوسته مطالعه در هر روز بدون وقفه",
    meaning_en: "Unbroken daily streak and unstoppable learning momentum",
    gradient: "linear-gradient(135deg, #b91c1c 0%, #f97316 50%, #fde047 100%)",
    glow: "rgba(249, 115, 22, 0.5)",
    borderColor: "#fb923c",
  },
  {
    id: "robot",
    symbol: "🤖",
    name_fa: "روبات هوشمند",
    name_en: "Smart Bot",
    title_fa: "یادگیری با هوش مصنوعی",
    title_en: "AI-Powered Learning",
    meaning_fa: "استفاده از هوش مصنوعی برای تحلیل اسپیکینگ و رایتینگ",
    meaning_en: "Leveraging AI for instant speaking and writing diagnostics",
    gradient: "linear-gradient(135deg, #334155 0%, #64748b 50%, #94a3b8 100%)",
    glow: "rgba(100, 116, 139, 0.4)",
    borderColor: "#cbd5e1",
  },
  {
    id: "crown",
    symbol: "👑",
    name_fa: "تاج موفقیت",
    name_en: "Crown of Success",
    title_fa: "قهرمان زبان و آزمون‌ها",
    title_en: "Royal Achiever",
    meaning_fa: "رسیدن به اوج تسلط، اعتمادبه‌نفس در مکالمه و نمره عالی",
    meaning_en: "Reaching fluency, top confidence, and ultimate goal victory",
    gradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #fbcfe8 100%)",
    glow: "rgba(219, 39, 119, 0.45)",
    borderColor: "#f472b6",
  },
];

export const STORAGE_KEY_AVATAR = "endoora_student_avatar";
export const STORAGE_KEY_PROFILE = "endoora_student_profile";
export const AVATAR_CHANGE_EVENT = "endoora-avatar-change";

export function getStoredAvatarId(): string {
  if (typeof window === "undefined") return "owl";
  try {
    return localStorage.getItem(STORAGE_KEY_AVATAR) || "owl";
  } catch {
    return "owl";
  }
}

export function setStoredAvatarId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_AVATAR, id);
    window.dispatchEvent(new CustomEvent(AVATAR_CHANGE_EVENT, { detail: { avatarId: id } }));
  } catch {
    // ignore local storage restrictions
  }
}

export function getAvatarById(id: string): StudentAvatar {
  return STUDENT_AVATARS.find((a) => a.id === id) || STUDENT_AVATARS[0];
}
