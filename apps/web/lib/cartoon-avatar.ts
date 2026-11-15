/**
 * Cartoon Avatar Configuration & Presets for Endoora
 */

export interface CartoonAvatarConfig {
  gender: "male" | "female";
  faceShape: "oval" | "round" | "square" | "heart";
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyes: "happy" | "focused" | "wink" | "sparkle" | "serious" | "angry";
  eyeColor: string;
  eyebrows: "natural" | "thick" | "arched" | "angry";
  expression: "smile" | "laugh" | "neutral" | "angry" | "smirk" | "surprised";
  facialHair: "none" | "stubble" | "mustache" | "goatee" | "full_beard";
  facialHairColor: string;
  glasses: "none" | "round" | "classic" | "cat_eye" | "sunglasses";
  headwear: "none" | "cap_forward" | "cap_backward" | "beanie" | "grad_cap" | "headband";
  accessories: "none" | "headphones" | "earring_gold" | "earring_silver";
  clothing: "hoodie" | "tshirt" | "school_uniform" | "jacket" | "suit";
  clothingColor: string;
  clothingAccent: string;
  background: "blue" | "purple" | "sunset" | "emerald" | "amber" | "dark" | "rose";
}

// ---------------------------------------------------------------------------
// Palettes & Constants
// ---------------------------------------------------------------------------

export const SKIN_TONES = [
  { id: "light", label: "خیلی روشن", hex: "#FFE0BD" },
  { id: "fair", label: "روشن", hex: "#FFD1AA" },
  { id: "wheat", label: "گندمی", hex: "#F5C396" },
  { id: "olive", label: "سبزه", hex: "#E0AC69" },
  { id: "bronze", label: "برنزه", hex: "#C68642" },
  { id: "warm_brown", label: "قهوه‌ای", hex: "#8D5524" },
  { id: "dark_brown", label: "تیره", hex: "#5C3818" },
];

export const HAIR_COLORS = [
  { id: "jet_black", label: "مشکی", hex: "#171717" },
  { id: "dark_brown", label: "قهوه‌ای تیره", hex: "#3B2219" },
  { id: "chestnut", label: "خرمایی", hex: "#5A3825" },
  { id: "caramel", label: "عسلی", hex: "#8D5B32" },
  { id: "golden_blonde", label: "بلوند", hex: "#E6BE8A" },
  { id: "auburn", label: "شرابی", hex: "#8A3324" },
  { id: "silver", label: "خاکستری", hex: "#94A3B8" },
  { id: "neon_blue", label: "آبی", hex: "#2563EB" },
  { id: "cyber_purple", label: "بنفش", hex: "#9333EA" },
];

export const EYE_COLORS = [
  { id: "dark", label: "مشکی", hex: "#1C1917" },
  { id: "brown", label: "قهوه‌ای", hex: "#523727" },
  { id: "hazel", label: "میشی", hex: "#635034" },
  { id: "green", label: "سبز", hex: "#166534" },
  { id: "blue", label: "آبی", hex: "#0284C7" },
  { id: "violet", label: "بنفش", hex: "#7E22CE" },
];

export const CLOTHING_COLORS = [
  { id: "navy", label: "سرمه‌ای", hex: "#1E3A8A", accent: "#60A5FA" },
  { id: "crimson", label: "قرمز", hex: "#991B1B", accent: "#F87171" },
  { id: "emerald", label: "سبز", hex: "#065F46", accent: "#34D399" },
  { id: "amber", label: "خردلی", hex: "#B45309", accent: "#FDE047" },
  { id: "purple", label: "بنفش", hex: "#581C87", accent: "#C084FC" },
  { id: "slate", label: "طوسی", hex: "#334155", accent: "#94A3B8" },
  { id: "teal", label: "فیروزه‌ای", hex: "#0F766E", accent: "#2DD4BF" },
  { id: "pink", label: "صورتی", hex: "#9D174D", accent: "#F472B6" },
];

export const BACKGROUNDS: Record<string, { label: string; gradient: string; glow: string }> = {
  blue: {
    label: "آبی",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  purple: {
    label: "بنفش",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #d8b4fe 100%)",
    glow: "rgba(139, 92, 246, 0.45)",
  },
  sunset: {
    label: "نارنجی",
    gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fde047 100%)",
    glow: "rgba(234, 88, 12, 0.4)",
  },
  emerald: {
    label: "سبز",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 50%, #6ee7b7 100%)",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  amber: {
    label: "طلایی",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #fef08a 100%)",
    glow: "rgba(217, 119, 6, 0.45)",
  },
  dark: {
    label: "دودی",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #475569 100%)",
    glow: "rgba(15, 23, 42, 0.5)",
  },
  rose: {
    label: "صورتی",
    gradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #fbcfe8 100%)",
    glow: "rgba(219, 39, 119, 0.4)",
  },
};

// ---------------------------------------------------------------------------
// Hair Styles (Available for all genders: Short & Long categories)
// ---------------------------------------------------------------------------

export interface HairStyleOption {
  id: string;
  label: string;
  icon: string;
  category: "short" | "long";
}

export const ALL_HAIR_STYLES: HairStyleOption[] = [
  // Short styles (8 models)
  { id: "fade", label: "فید مدرن", icon: "💈", category: "short" },
  { id: "spiky", label: "اسپایک", icon: "⚡", category: "short" },
  { id: "pompadour", label: "پمپادور", icon: "🔥", category: "short" },
  { id: "curly_short", label: "فر کوتاه", icon: "🌀", category: "short" },
  { id: "classic_part", label: "کلاسیک", icon: "👔", category: "short" },
  { id: "buzz_cut", label: "بوکسوری", icon: "✂️", category: "short" },
  { id: "pixie", label: "کوتاه", icon: "✨", category: "short" },
  { id: "bald", label: "کچل", icon: "✨", category: "short" },

  // Medium & Long styles (8 models)
  { id: "wavy_long", label: "موج‌دار", icon: "🌊", category: "long" },
  { id: "straight_long", label: "صاف بلند", icon: "💇", category: "long" },
  { id: "ponytail", label: "دم‌اسبی", icon: "👱", category: "long" },
  { id: "bob", label: "چتری / باب", icon: "🎀", category: "long" },
  { id: "top_bun", label: "گوجه‌ای", icon: "🍩", category: "long" },
  { id: "braids", label: "بافت", icon: "🥨", category: "long" },
  { id: "curly_volume", label: "فر پرپشت", icon: "🌀", category: "long" },
  { id: "man_bun", label: "سامورایی", icon: "🥋", category: "long" },
];

// Maintained for backward compatibility: all 16 styles available to everyone
export const MALE_HAIR_STYLES: HairStyleOption[] = ALL_HAIR_STYLES;
export const FEMALE_HAIR_STYLES: HairStyleOption[] = ALL_HAIR_STYLES;

// Helper to normalize any legacy hair IDs across all available models
export function normalizeHairStyle(style: string, _gender?: "male" | "female"): string {
  if (ALL_HAIR_STYLES.some((h) => h.id === style)) return style;
  if (style === "short_fade") return "fade";
  if (style === "short_spiky") return "spiky";
  if (style === "curly") return "curly_short";
  return "fade";
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export interface AvatarPreset {
  id: string;
  name_fa: string;
  icon: string;
  config: CartoonAvatarConfig;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "top_student",
    name_fa: "شاگرد زرنگ",
    icon: "🤓",
    config: {
      gender: "male",
      faceShape: "oval",
      skinColor: "#FFD1AA",
      hairStyle: "fade",
      hairColor: "#171717",
      eyes: "sparkle",
      eyeColor: "#523727",
      eyebrows: "natural",
      expression: "smile",
      facialHair: "none",
      facialHairColor: "#171717",
      glasses: "round",
      headwear: "none",
      accessories: "none",
      clothing: "hoodie",
      clothingColor: "#1E3A8A",
      clothingAccent: "#60A5FA",
      background: "blue",
    },
  },
  {
    id: "gamer",
    name_fa: "گیمر",
    icon: "🎮",
    config: {
      gender: "male",
      faceShape: "square",
      skinColor: "#F5C396",
      hairStyle: "spiky",
      hairColor: "#3B2219",
      eyes: "focused",
      eyeColor: "#1C1917",
      eyebrows: "thick",
      expression: "smirk",
      facialHair: "stubble",
      facialHairColor: "#3B2219",
      glasses: "none",
      headwear: "beanie",
      accessories: "headphones",
      clothing: "jacket",
      clothingColor: "#581C87",
      clothingAccent: "#C084FC",
      background: "purple",
    },
  },
  {
    id: "sporty_girl",
    name_fa: "اسپرت",
    icon: "✨",
    config: {
      gender: "female",
      faceShape: "heart",
      skinColor: "#FFE0BD",
      hairStyle: "wavy_long",
      hairColor: "#5A3825",
      eyes: "happy",
      eyeColor: "#166534",
      eyebrows: "arched",
      expression: "laugh",
      facialHair: "none",
      facialHairColor: "#5A3825",
      glasses: "none",
      headwear: "headband",
      accessories: "earring_gold",
      clothing: "hoodie",
      clothingColor: "#B45309",
      clothingAccent: "#FDE047",
      background: "sunset",
    },
  },
  {
    id: "cool_headphones",
    name_fa: "هدفون‌دار",
    icon: "🎧",
    config: {
      gender: "male",
      faceShape: "round",
      skinColor: "#E0AC69",
      hairStyle: "pompadour",
      hairColor: "#2563EB",
      eyes: "wink",
      eyeColor: "#0284C7",
      eyebrows: "natural",
      expression: "smile",
      facialHair: "mustache",
      facialHairColor: "#171717",
      glasses: "sunglasses",
      headwear: "none",
      accessories: "headphones",
      clothing: "suit",
      clothingColor: "#0F766E",
      clothingAccent: "#2DD4BF",
      background: "emerald",
    },
  },
  {
    id: "simple_glasses",
    name_fa: "عینکی",
    icon: "👓",
    config: {
      gender: "female",
      faceShape: "oval",
      skinColor: "#FFD1AA",
      hairStyle: "bob",
      hairColor: "#171717",
      eyes: "focused",
      eyeColor: "#523727",
      eyebrows: "thick",
      expression: "neutral",
      facialHair: "none",
      facialHairColor: "#171717",
      glasses: "classic",
      headwear: "cap_backward",
      accessories: "earring_silver",
      clothing: "tshirt",
      clothingColor: "#991B1B",
      clothingAccent: "#F87171",
      background: "dark",
    },
  },
  {
    id: "classic_grad",
    name_fa: "کلاسیک",
    icon: "🎓",
    config: {
      gender: "female",
      faceShape: "heart",
      skinColor: "#FFE0BD",
      hairStyle: "ponytail",
      hairColor: "#8D5B32",
      eyes: "sparkle",
      eyeColor: "#635034",
      eyebrows: "arched",
      expression: "laugh",
      facialHair: "none",
      facialHairColor: "#8D5B32",
      glasses: "round",
      headwear: "grad_cap",
      accessories: "earring_gold",
      clothing: "school_uniform",
      clothingColor: "#1E3A8A",
      clothingAccent: "#FDE047",
      background: "amber",
    },
  },
];

// ---------------------------------------------------------------------------
// Defaults & Storage Utilities
// ---------------------------------------------------------------------------

export const STORAGE_KEY_CARTOON_AVATAR = "endoora_student_cartoon_avatar";
export const CARTOON_AVATAR_CHANGE_EVENT = "endoora-cartoon-avatar-change";

export function getDefaultAvatarConfig(): CartoonAvatarConfig {
  return { ...AVATAR_PRESETS[0].config };
}

export function getRandomAvatarConfig(): CartoonAvatarConfig {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const gender: "male" | "female" = Math.random() > 0.5 ? "male" : "female";
  const skin = pick(SKIN_TONES).hex;
  const hairCol = pick(HAIR_COLORS).hex;
  const eyeCol = pick(EYE_COLORS).hex;
  const cloth = pick(CLOTHING_COLORS);

  const hair = pick(ALL_HAIR_STYLES).id;

  const expressions: CartoonAvatarConfig["expression"][] = [
    "smile",
    "laugh",
    "smirk",
    "surprised",
    "neutral",
    "angry",
  ];
  const eyesList: CartoonAvatarConfig["eyes"][] = [
    "happy",
    "focused",
    "wink",
    "sparkle",
    "serious",
  ];
  const glassesList: CartoonAvatarConfig["glasses"][] = [
    "none",
    "none",
    "round",
    "classic",
    "cat_eye",
    "sunglasses",
  ];
  const headwearList: CartoonAvatarConfig["headwear"][] = [
    "none",
    "none",
    "cap_forward",
    "cap_backward",
    "beanie",
    "grad_cap",
    "headband",
  ];
  const accessoriesList: CartoonAvatarConfig["accessories"][] = [
    "none",
    "none",
    "headphones",
    "earring_gold",
    "earring_silver",
  ];
  const facialHairList: CartoonAvatarConfig["facialHair"][] =
    gender === "male"
      ? ["none", "none", "stubble", "mustache", "goatee", "full_beard"]
      : ["none"];
  const bgKeys = Object.keys(BACKGROUNDS) as (keyof typeof BACKGROUNDS)[];

  return {
    gender,
    faceShape: pick(["oval", "round", "square", "heart"]),
    skinColor: skin,
    hairStyle: hair,
    hairColor: hairCol,
    eyes: pick(eyesList),
    eyeColor: eyeCol,
    eyebrows: pick(["natural", "thick", "arched"]),
    expression: pick(expressions),
    facialHair: pick(facialHairList),
    facialHairColor: hairCol,
    glasses: pick(glassesList),
    headwear: pick(headwearList),
    accessories: pick(accessoriesList),
    clothing: pick(["hoodie", "tshirt", "school_uniform", "jacket", "suit"]),
    clothingColor: cloth.hex,
    clothingAccent: cloth.accent,
    background: pick(bgKeys) as CartoonAvatarConfig["background"],
  };
}

export function getStoredCartoonAvatar(): CartoonAvatarConfig {
  if (typeof window === "undefined") return getDefaultAvatarConfig();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CARTOON_AVATAR);
    if (!raw) return getDefaultAvatarConfig();
    const parsed = JSON.parse(raw);
    const config = { ...getDefaultAvatarConfig(), ...parsed };
    config.hairStyle = normalizeHairStyle(config.hairStyle, config.gender);
    return config;
  } catch {
    return getDefaultAvatarConfig();
  }
}

export function setStoredCartoonAvatar(config: CartoonAvatarConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CARTOON_AVATAR, JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent(CARTOON_AVATAR_CHANGE_EVENT, { detail: { config } })
    );
  } catch {
    // ignore storage restrictions
  }
}
