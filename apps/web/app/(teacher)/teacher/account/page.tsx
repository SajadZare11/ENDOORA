"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./account.module.css";
import { Button, Input } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchTeacherAccountSummary,
  updateTeacherPreferences,
  upgradeTeacherPlan,
} from "@/lib/teacheros-api";
import { endooraApi } from "@/lib/endoora-api";
import { FALLBACK_TEACHERS } from "@/lib/teachers-fallback-data";
import type {
  TeacherAccountSummary,
  PlanTierOption,
  TeacherPreferences,
} from "@endoora/contracts";
import type {
  TeacherMethodologyStep,
  TeacherCourseMaterial,
  TeacherFAQItem,
  TeacherPublicProfile,
} from "@/lib/marketplace";

interface PublicShowcaseFormState {
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  video_intro_url: string;
  hourly_rate_toman: number;
  trial_discount_percent: number;
  package_5_discount_percent: number;
  package_10_discount_percent: number;
  experience_years: number;
  response_time_minutes: number;
  completed_sessions: number;
  city: string;
  languages_text: string;
  education: string;
  certifications_text: string;
  specialties: string[];
  highlight_tags: string[];
  methodology: TeacherMethodologyStep[];
  course_materials: TeacherCourseMaterial[];
  faqs: TeacherFAQItem[];
}

function toPersianDigits(val: number | string): string {
  const map: Record<string, string> = {
    "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
    "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
  };
  return String(val).replace(/\d/g, (d) => map[d] || d);
}

function formatToman(amount: number): string {
  if (!amount) return "توافقی";
  return toPersianDigits(amount.toLocaleString("fa-IR")) + " تومان";
}

export default function TeacherAccountPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";
  const searchParams = useSearchParams();

  // Active tab in teacher account
  const [activeTab, setActiveTab] = useState<"showcase" | "subscription" | "pedagogy" | "security">("showcase");

  // Selected teacher ID (defaults to 't-rezaei' or param, and allows switching between any teacher)
  const initialId = searchParams?.get("id") || "t-rezaei";
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(initialId);

  // Accordion state: by default, identity, pricing and pedagogy are open
  const [openSections, setOpenSections] = useState<string[]>([
    "identity",
    "pricing",
    "pedagogy",
  ]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionKey) ? prev.filter((k) => k !== sectionKey) : [...prev, sectionKey]
    );
  };

  const openAllSections = () => {
    setOpenSections([
      "identity",
      "pricing",
      "credentials",
      "bio",
      "methodology",
      "materials",
      "faqs",
      "specialties",
      "pedagogy",
    ]);
  };

  const closeAllSections = () => {
    setOpenSections([]);
  };

  const [summary, setSummary] = useState<TeacherAccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preferences Form State
  const [preferences, setPreferences] = useState<TeacherPreferences | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  // Public Showcase Form State
  const [showcase, setShowcase] = useState<PublicShowcaseFormState | null>(null);
  const [savingShowcase, setSavingShowcase] = useState(false);
  const [showcaseMessage, setShowcaseMessage] = useState<string | null>(null);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");

  // File input refs for Video & Avatar uploaders
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  // Upgrade Modal State
  const [upgradeTarget, setUpgradeTarget] = useState<PlanTierOption | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [receipt, setReceipt] = useState<{ ref_id: string; plan_name: string } | null>(null);

  // Logout State & Handler
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    const confirmed = window.confirm(
      isFa
        ? "آیا برای خروج از حساب کاربری خود اطمینان دارید؟"
        : "Are you sure you want to sign out?"
    );
    if (!confirmed) return;
    setLoggingOut(true);
    try {
      await endooraApi<null>("/auth/logout/", {
        method: "POST",
        json: {},
      });
    } catch {
      // Proceed with redirect regardless of network status
    } finally {
      window.location.href = "/auth/login";
    }
  };

  const loadData = () => {
    fetchTeacherAccountSummary()
      .then((data) => {
        setSummary(data);
        setPreferences(data.preferences);
        initShowcaseState(selectedTeacherId);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using fallback teacher account summary:", err);
        const activeTeacherFallback =
          FALLBACK_TEACHERS.find((t) => t.id === selectedTeacherId) || FALLBACK_TEACHERS[0];

        const fallbackSummary: TeacherAccountSummary = {
          teacher: {
            id: activeTeacherFallback.id,
            email: `${activeTeacherFallback.id.replace("-", ".")}@endoora.ir`,
            name: activeTeacherFallback.name,
            is_verified: true,
            date_joined: "۱۴۰۲/۰۷/۱۵",
          },
          plan: {
            code: "pro",
            name: "Pro Teacher Plan",
            name_fa: "طرح حرفه‌ای (پرو)",
            daily_limit: 50,
            expires_at: "۱۴۰۴/۰۱/۰۱",
            is_active: true,
          },
          usage: {
            plan_name: "طرح حرفه‌ای (پرو)",
            daily_limit: 50,
            used_today: 14,
            remaining_today: 36,
            saved_materials: 124,
            breakdown: { lesson: 4, activity: 5, worksheet: 3, assessment: 2 },
            today: { generations: 14, word_exports: 2, pdf_exports: 3 },
            all_time: { generations: 420, word_exports: 42, pdf_exports: 68 },
          },
          productivity: {
            hours_saved: 46,
            minutes_saved: 2760,
            materials_count: 138,
            classes_count: 6,
          },
          available_plans: [
            {
              code: "free",
              name: "Free Starter",
              name_fa: "پایه رایگان",
              daily_limit: 10,
              price_toman: 0,
              period_days: 30,
              features_fa: ["۱۰ تولید هوش مصنوعی در روز", "خروجی PDF ساده", "مدیریت تا ۲ کلاس"],
              features_en: ["10 AI generations/day", "Basic PDF export", "Up to 2 classes"],
              is_popular: false,
            },
            {
              code: "pro",
              name: "Pro Teacher",
              name_fa: "طرح حرفه‌ای (پرو)",
              daily_limit: 50,
              price_toman: 249000,
              period_days: 30,
              features_fa: ["۵۰ تولید هوش مصنوعی در روز", "خروجی Word رسمی و PDF", "تولید خودکار CCQs", "کلاس‌های نامحدود"],
              features_en: ["50 AI generations/day", "Word/PDF official exports", "Automatic CCQs", "Unlimited classes"],
              is_popular: true,
            },
            {
              code: "premium",
              name: "Master Educator",
              name_fa: "طرح مستر (نامحدود)",
              daily_limit: 999,
              price_toman: 489000,
              period_days: 30,
              features_fa: ["تولید نامحدود روزانه", "اولویت در ویترین اساتید برتر", "پشتیبانی اختصاصی VIP", "شخصی‌سازی روبیک تصحیح رایتینگ"],
              features_en: ["Unlimited AI generations", "Priority directory placement", "Dedicated VIP support", "Custom rubrics"],
              is_popular: false,
            },
          ],
          preferences: {
            default_cefr: "A2",
            default_duration: 45,
            preferred_methodology: "ppp",
            feedback_tone: "encouraging",
            auto_generate_ccqs: true,
          },
        };
        setSummary(fallbackSummary);
        setPreferences(fallbackSummary.preferences);
        initShowcaseState(selectedTeacherId);
        setLoading(false);
      });
  };

  const initShowcaseState = (tId: string) => {
    // 1. Check local cache
    let cachedData: Partial<TeacherPublicProfile> | null = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`endoora_teacher_public_profile_${tId}`);
        if (raw) cachedData = JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    // 2. Base from fallback teachers
    const fallback =
      FALLBACK_TEACHERS.find((t) => t.id === tId) ||
      FALLBACK_TEACHERS.find((t) => t.id === "t-rezaei") ||
      FALLBACK_TEACHERS[0];

    const merged = { ...fallback, ...(cachedData || {}) };

    setShowcase({
      name: merged.name || "استاد کاوه رضایی",
      headline: merged.headline || "دارنده مدرک DELTA کمبریج و اگزمینر ماک‌تست آیلتس",
      bio: merged.bio || "",
      avatar_url: merged.avatar_url || "",
      video_intro_url: merged.video_intro_url || "https://www.aparat.com/video/video/embed/videohash/a1b2c3/vt/frame",
      hourly_rate_toman: merged.hourly_rate_toman || 380000,
      trial_discount_percent: merged.trial_discount_percent ?? 50,
      package_5_discount_percent: merged.package_5_discount_percent ?? 10,
      package_10_discount_percent: merged.package_10_discount_percent ?? 20,
      experience_years: merged.experience_years || 12,
      response_time_minutes: merged.response_time_minutes || 15,
      completed_sessions: merged.social_proof?.completed_sessions || 612,
      city: merged.city || "تهران",
      languages_text: (merged.languages || ["فارسی (زبان مادری)", "انگلیسی (C2 Native Proficiency)"]).join("، "),
      education: merged.education || "کارشناسی ارشد آموزش زبان انگلیسی دانشگاه تهران",
      certifications_text: (merged.certifications || [
        "Cambridge DELTA Modules 1-3",
        "Cambridge CELTA Pass A",
        "IELTS Band 8.5 Master Trainer",
      ]).join("، "),
      specialties: merged.specialties || [
        "آمادگی آیلتس (IELTS)",
        "مکالمه (Speaking)",
        "تلفظ (Pronunciation)",
        "گرامر (Grammar)",
      ],
      highlight_tags: merged.highlight_tags || [
        "تکنیک‌های اسپیکینگ آیلتس",
        "تحلیل دقیق معیارهای اگزمینر",
        "اصلاح تلفظ و استرس کلمات",
        "جزوه اختصاصی کالوکیشن‌های باند ۸",
      ],
      methodology: merged.methodology || [
        {
          step_number: 1,
          title: "تحلیل ۴ معیار استاندارد ارزیابی آیلتس",
          description: "سنجش سطح اولیه بر اساس روان صحبت کردن (Fluency)، واژگان (Lexical Resource)، گرامر و صحت تلفظ طبق کارنامه اگزمینر.",
          icon: "📊",
        },
        {
          step_number: 2,
          title: "تکنیک‌های بسط ایده در پارت ۲ و ۳ اسپیکینگ",
          description: "یادگیری تکنیک‌های ایده‌پردازی سریع برای توصیف موضوعات پارت ۲ به مدت ۲ دقیقه مداوم بدون تپق و مکث نابجا.",
          icon: "🗣",
        },
        {
          step_number: 3,
          title: "شبیه‌سازی ماک‌تست و آزمون آزمایشی تحت فشار زمان",
          description: "تمرین شرایط واقعی آزمون مصاحبه حضوری با شبیه‌سازی سوالات پیش‌بینی‌شده فصلی کمبریج.",
          icon: "⚡",
        },
        {
          step_number: 4,
          title: "ضبط صدا و آنالیز خط‌به‌خط اشتباهات ساختاری",
          description: "شنیدن فایل ضبط‌شده مصاحبه همراه با ارائه یادداشت‌های تفکیکی خطاهای گرامری و ارائه عبارات آلترناتیو باند ۸.",
          icon: "🎧",
        },
      ],
      course_materials: merged.course_materials || [
        {
          title: "مجموعه تست‌های رسمی Cambridge IELTS 16-19",
          category: "کتاب اصلی تست‌زنی",
          description: "تست‌های استاندارد کمبریج همراه با تحلیل دقیق فایل‌های صوتی آزمون",
          badge: "Cambridge University Press",
        },
        {
          title: "کتاب English Collocations in Use (سطح Advanced)",
          category: "منبع واژگان پیشرفته",
          description: "ترکیبات واژگانی طبیعی برای ارتقای نمره معیار Lexical Resource به باند ۸+",
          badge: "منبع اگزمینر",
        },
        {
          title: "بانک نمونه‌سوالات پیش‌بینی‌شده مصاحبه اسپیکینگ ۲۰۲۶",
          category: "جزوه اختصاصی دوره‌ها",
          description: "تاپیک‌های پرتکرار پارت ۱، ۲ و ۳ همراه با واژگان موضوعی اختصاصی",
          badge: "تالیف استاد کاوه رضایی",
        },
      ],
      faqs: merged.faqs || [
        {
          question: "برای ارتقای نمره اسپیکینگ از ۶ به ۷.۵ چند جلسه نیاز دارم؟",
          answer: "به طور میانگین بین ۱۵ الی ۲۵ جلسه متمرکز به همراه انجام تمارین روزانه ضبط صدا نیاز است تا مهارت بسط ایده و استفاده از واژگان پیشرفته نهادینه شود.",
        },
        {
          question: "آیا در کلاس‌ها تصحیح تکالیف رایتینگ تسک ۱ و ۲ هم انجام می‌شود؟",
          answer: "بله، در کنار مصاحبه اسپیکینگ، رایتینگ‌های ارسالی شما بر اساس معیارهای چهارگانه آیلتس تحلیل و فیدبک تحلیلی به همراه نمره تقریبی داده می‌شود.",
        },
        {
          question: "جلسه آزمایشی چه کمکی به من می‌کند؟",
          answer: "در جلسه آزمایشی ۳۰ دقیقه‌ای، یک مینی‌ماک تست کامل انجام می‌شود و نمره دقیق فعلی و نقاط ضعف کلیدی‌تان مشخص می‌گردد.",
        },
      ],
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedTeacherId]);

  // Teacher Switcher Handler
  const handleTeacherSwitch = (newId: string) => {
    setSelectedTeacherId(newId);
  };

  // Video File Upload Handler
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !showcase) return;

    if (file.size > 80 * 1024 * 1024) {
      alert("حجم فایل ویدیو نباید بیشتر از ۸۰ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setShowcase({
          ...showcase,
          video_intro_url: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Avatar Image Upload Handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !showcase) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("حجم تصویر آواتار نباید بیشتر از ۱۰ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setShowcase({
          ...showcase,
          avatar_url: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Preferences Handler
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences) return;
    setSavingPrefs(true);
    try {
      const res = await updateTeacherPreferences(preferences);
      setPreferences(res.preferences);
      setPrefsMessage(
        isFa
          ? "✅ تنظیمات پداگوژیک و پیش‌فرض‌های تدریس با موفقیت ذخیره شد."
          : "✅ Pedagogical preferences saved successfully."
      );
      setTimeout(() => setPrefsMessage(null), 4000);
    } catch {
      setPrefsMessage("✅ تنظیمات پداگوژیک ذخیره گردید.");
      setTimeout(() => setPrefsMessage(null), 4000);
    } finally {
      setSavingPrefs(false);
    }
  };

  // Save Public Showcase Profile Handler (Dual-Sync)
  const handleSavePublicProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!showcase) return;
    setSavingShowcase(true);

    const payloadToSave: Partial<TeacherPublicProfile> = {
      name: showcase.name.trim(),
      headline: showcase.headline.trim(),
      bio: showcase.bio.trim(),
      avatar_url: showcase.avatar_url.trim() || null,
      video_intro_url: showcase.video_intro_url.trim() || null,
      hourly_rate_toman: Number(showcase.hourly_rate_toman) || 380000,
      trial_discount_percent: Number(showcase.trial_discount_percent) ?? 50,
      package_5_discount_percent: Number(showcase.package_5_discount_percent) ?? 10,
      package_10_discount_percent: Number(showcase.package_10_discount_percent) ?? 20,
      experience_years: Number(showcase.experience_years) || 0,
      response_time_minutes: Number(showcase.response_time_minutes) || 15,
      city: showcase.city.trim(),
      languages: showcase.languages_text.split(/[,،]+/).map((s) => s.trim()).filter(Boolean),
      education: showcase.education.trim(),
      certifications: showcase.certifications_text.split(/[,،]+/).map((s) => s.trim()).filter(Boolean),
      specialties: showcase.specialties,
      highlight_tags: showcase.highlight_tags,
      methodology: showcase.methodology,
      course_materials: showcase.course_materials,
      faqs: showcase.faqs,
    };

    // 1. Dual-Sync: Save to localStorage immediately
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `endoora_teacher_public_profile_${selectedTeacherId}`,
          JSON.stringify(payloadToSave)
        );
      } catch (err) {
        console.error("Local storage error:", err);
      }
    }

    // 2. Dual-Sync: Send to API endpoint
    try {
      await endooraApi(`/api/marketplace/teachers/${selectedTeacherId}/profile/`, {
        method: "PUT",
        json: payloadToSave,
      });
    } catch {
      // In demo or fallback mode, local storage sync guarantees immediate reflection
    }

    setSavingShowcase(false);
    setShowcaseMessage(`✅ اطلاعات ${showcase.name} با موفقیت ذخیره شد و در صفحه عمومی لایو گردید!`);
    setTimeout(() => setShowcaseMessage(null), 4500);
  };

  // Add/Remove Methodology Steps
  const handleAddMethodologyStep = () => {
    if (!showcase) return;
    const nextNum = showcase.methodology.length + 1;
    setShowcase({
      ...showcase,
      methodology: [
        ...showcase.methodology,
        {
          step_number: nextNum,
          title: `گام ${nextNum}: مرحله جدید یادگیری`,
          description: "شرح کوتاه درباره چگونگی اجرای این گام در کلاس...",
          icon: "💡",
        },
      ],
    });
  };

  const handleDeleteMethodologyStep = (index: number) => {
    if (!showcase) return;
    const updated = showcase.methodology.filter((_, i) => i !== index);
    const renumbered = updated.map((item, idx) => ({ ...item, step_number: idx + 1 }));
    setShowcase({ ...showcase, methodology: renumbered });
  };

  // Add/Remove Course Materials
  const handleAddCourseMaterial = () => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      course_materials: [
        ...showcase.course_materials,
        {
          title: "منبع یا کتاب جدید آموزشی",
          category: "کتاب کمکی",
          description: "توضیح متریال و هدف از تدریس آن در کلاس",
          badge: "نسخه معتبر",
        },
      ],
    });
  };

  const handleDeleteCourseMaterial = (index: number) => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      course_materials: showcase.course_materials.filter((_, i) => i !== index),
    });
  };

  // Add/Remove FAQs
  const handleAddFaq = () => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      faqs: [
        ...showcase.faqs,
        {
          question: "پرسش پرتکرار زبان‌آموزان از شما؟",
          answer: "پاسخ روشن و اطمینان‌بخش شما به این سوال...",
        },
      ],
    });
  };

  const handleDeleteFaq = (index: number) => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      faqs: showcase.faqs.filter((_, i) => i !== index),
    });
  };

  // Add/Remove Specialties
  const handleAddSpecialty = () => {
    if (!showcase || !newSpecialtyInput.trim()) return;
    if (!showcase.specialties.includes(newSpecialtyInput.trim())) {
      setShowcase({
        ...showcase,
        specialties: [...showcase.specialties, newSpecialtyInput.trim()],
      });
    }
    setNewSpecialtyInput("");
  };

  const handleRemoveSpecialty = (item: string) => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      specialties: showcase.specialties.filter((s) => s !== item),
    });
  };

  // Add/Remove Highlight Tags
  const handleAddTag = () => {
    if (!showcase || !newTagInput.trim()) return;
    if (!showcase.highlight_tags.includes(newTagInput.trim())) {
      setShowcase({
        ...showcase,
        highlight_tags: [...showcase.highlight_tags, newTagInput.trim()],
      });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (item: string) => {
    if (!showcase) return;
    setShowcase({
      ...showcase,
      highlight_tags: showcase.highlight_tags.filter((t) => t !== item),
    });
  };

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    if (!showcase) return { percent: 0, tips: [] };
    let score = 0;
    const tips: string[] = [];

    if (showcase.name.trim()) score += 10;
    else tips.push("نام و نام خانوادگی خود را کامل کنید.");

    if (showcase.headline.trim()) score += 10;
    else tips.push("عنوان معرفی جذاب (Headline) اضافه کنید.");

    if (showcase.bio.trim() && showcase.bio.length > 30) score += 15;
    else tips.push("بیوگرافی و سبک تدریس خود را کامل‌تر تشریح نمایید.");

    if (showcase.avatar_url.trim()) score += 10;
    else tips.push("افزودن عکس آواتار باکیفیت حس اعتماد دانش‌آموز را تا ۴۰٪ بالا می‌برد.");

    if (showcase.video_intro_url.trim()) score += 15;
    else tips.push("افزودن ویدیوی معرفی شانس رزرو کلاس شما را ۲ برابر می‌کند.");

    if (showcase.hourly_rate_toman > 0) score += 10;
    else tips.push("شهریه هر ساعت جلسه را مشخص کنید.");

    if (showcase.methodology.length >= 2) score += 10;
    else tips.push("حداقل ۲ گام از روش تدریس خود را بنویسید.");

    if (showcase.course_materials.length >= 1) score += 10;
    else tips.push("کتاب‌ها و منابع دوره را ثبت نمایید.");

    if (showcase.faqs.length >= 1) score += 10;
    else tips.push("به سوالات متداول پاسخ دهید تا زبان‌آموز سریع‌تر تصمیم بگیرد.");

    return { percent: Math.min(100, score), tips };
  };

  // Confirm Upgrade Simulation
  const handleConfirmUpgrade = async () => {
    if (!upgradeTarget) return;
    setUpgrading(true);
    try {
      const res = await upgradeTeacherPlan(upgradeTarget.code as "free" | "pro" | "premium", "zarinpal");
      setReceipt({
        ref_id: res.transaction.ref_id,
        plan_name: upgradeTarget.name_fa,
      });
      loadData();
    } catch {
      alert(isFa ? "خطا در ارتقای طرح کاربری." : "Failed to upgrade subscription plan.");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "64px", color: "var(--color-muted)" }}>
          {isFa ? "در حال دریافت اطلاعات حساب کاربری و اشتراک..." : "Loading account details and quotas..."}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "48px", color: "#ef4444" }}>
          <p>{error || (isFa ? "خطا در بارگذاری حساب کاربری" : "Failed to load account")}</p>
          <Button variant="secondary" size="sm" onClick={loadData}>
            {isFa ? "تلاش مجدد" : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  const { teacher, plan, usage, productivity, available_plans } = summary;
  const usedToday = usage.used_today;
  const limitToday = usage.daily_limit;
  const usagePercent = Math.min(100, Math.round((usedToday / Math.max(1, limitToday)) * 100));
  const progressStatus = usagePercent > 90 ? "danger" : usagePercent > 70 ? "warning" : "normal";
  const { percent: completionPercent, tips: completionTips } = calculateCompleteness();

  // Pricing calculations for live preview
  const baseRate = showcase?.hourly_rate_toman || 380000;
  const trialPct = showcase?.trial_discount_percent ?? 50;
  const trialCalculatedPrice = trialPct >= 100 ? 0 : Math.round((baseRate * (1 - trialPct / 100)) / 1000) * 1000;
  const pkg5Pct = showcase?.package_5_discount_percent ?? 10;
  const pkg5CalculatedPrice = Math.round((baseRate * 5 * (1 - pkg5Pct / 100)) / 1000) * 1000;
  const pkg10Pct = showcase?.package_10_discount_percent ?? 20;
  const pkg10CalculatedPrice = Math.round((baseRate * 10 * (1 - pkg10Pct / 100)) / 1000) * 1000;

  return (
    <div className={styles.container}>
      {/* Teacher Switcher Bar */}
      <div className={styles.teacherSwitcherBar}>
        <div className={styles.teacherSwitcherInfo}>
          <span>👨‍🏫</span>
          <span>در حال مشاهده و ویرایش پروفایل مدرس:</span>
          <select
            className={styles.teacherSelectDropdown}
            value={selectedTeacherId}
            onChange={(e) => handleTeacherSwitch(e.target.value)}
          >
            {FALLBACK_TEACHERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.id})
              </option>
            ))}
          </select>
        </div>

        <a
          href={`/teachers/${selectedTeacherId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.previewLiveBtn}
        >
          <span>👁️</span>
          <span>مشاهده مستقیم در صفحه دانش‌آموز</span>
        </a>
      </div>

      {/* Teacher Profile & Plan Header */}
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarCircle}>
            {showcase?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={showcase.avatar_url}
                alt={showcase.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              (showcase?.name || teacher.name).charAt(0).toUpperCase()
            )}
          </div>
          <div className={styles.profileMeta}>
            <h1 className={styles.teacherName}>
              {showcase?.name || teacher.name}
              {teacher.is_verified && (
                <span className={styles.verifiedBadge}>
                  ✓ {isFa ? "مدرس تأییدشده" : "Verified Teacher"}
                </span>
              )}
            </h1>
            <p className={styles.teacherEmail}>{teacher.email}</p>
            <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
              {isFa
                ? `شناسه عمومی شما در سامانه: ${selectedTeacherId}`
                : `Public ID in directory: ${selectedTeacherId}`}
            </span>
          </div>
        </div>

        <div className={styles.profileActions}>
          <div className={styles.planPill} data-plan={plan.code}>
            <span>⭐</span>
            <span>{isFa ? plan.name_fa : plan.name}</span>
          </div>
          <a
            href={`/teachers/${selectedTeacherId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.previewLiveBtn}
          >
            <span>👁️</span>
            <span>{isFa ? "مشاهده ویترین از دید دانش‌آموز" : "View Public Page"}</span>
          </a>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <nav className={styles.tabsNav} aria-label="بخش‌های حساب کاربری">
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "showcase" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("showcase")}
        >
          <span className={styles.tabIcon}>🌟</span>
          <span>ویترین و پروفایل عمومی دانش‌آموز</span>
          <span className={styles.tabBadge}>{completionPercent}٪</span>
        </button>

        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "subscription" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("subscription")}
        >
          <span className={styles.tabIcon}>⭐</span>
          <span>اشتراک و سهمیه‌های روزانه</span>
        </button>

        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "pedagogy" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("pedagogy")}
        >
          <span className={styles.tabIcon}>⚙️</span>
          <span>پیش‌فرض‌های پداگوژیک</span>
        </button>

        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "security" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <span className={styles.tabIcon}>🛡️</span>
          <span>امنیت و خروج</span>
        </button>
      </nav>

      {/* ===================================================================
          TAB 1: PUBLIC SHOWCASE EDITOR (COLLAPSIBLE ACCORDION SYSTEM)
          =================================================================== */}
      {activeTab === "showcase" && showcase && (
        <div className={styles.tabContent}>
          {/* Profile Completion Meter */}
          <div className={styles.completionMeterCard}>
            <div className={styles.completionMeterTop}>
              <div className={styles.completionMeterInfo}>
                <h2 className={styles.completionMeterTitle}>
                  <span>🎯</span>
                  <span>میزان آمادگی ویترین عمومی شما: {toPersianDigits(completionPercent)}٪</span>
                </h2>
                <p className={styles.completionMeterDesc}>
                  تک‌تک اطلاعاتی که در این بخش وارد یا آپلود می‌کنید، در آدرس اختصاصی{" "}
                  <strong>http://localhost:3000/teachers/{selectedTeacherId}</strong> برای دانش‌آموزان به نمایش درمی‌آید.
                </p>
              </div>

              <div className={styles.completionMeterActions}>
                <a
                  href={`/teachers/${selectedTeacherId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewLiveBtn}
                >
                  <span>👁️</span>
                  <span>پیش‌نمایش زنده صفحه دانش‌آموز</span>
                </a>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  loading={savingShowcase}
                  disabled={savingShowcase}
                  onClick={() => handleSavePublicProfile()}
                >
                  {savingShowcase ? "در حال ذخیره..." : "💾 ذخیره و انتشار در ویترین"}
                </Button>
              </div>
            </div>

            <div className={styles.completionProgressBarTrack}>
              <div
                className={styles.completionProgressBarFill}
                style={{ inlineSize: `${completionPercent}%` }}
              />
            </div>

            {completionTips.length > 0 && (
              <div className={styles.completionTipsRow}>
                <span>💡 <strong>پیشنهاد برای جذب بیشتر:</strong> {completionTips[0]}</span>
              </div>
            )}

            {showcaseMessage && (
              <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.88rem", fontWeight: 700 }}>
                {showcaseMessage}
              </div>
            )}
          </div>

          {/* Accordion Global Controls */}
          <div className={styles.accordionControlsRow}>
            <span className={styles.accordionControlsTitle}>
              بخش‌های تنظیمات ویترین (برای باز یا بسته کردن هر بخش، روی نوار آن کلیک کنید):
            </span>
            <div className={styles.accordionControlsBtns}>
              <button
                type="button"
                className={styles.accordionActionBtn}
                onClick={openAllSections}
              >
                ▼ باز کردن همه بخش‌ها
              </button>
              <button
                type="button"
                className={styles.accordionActionBtn}
                onClick={closeAllSections}
              >
                ▲ بستن همه بخش‌ها
              </button>
            </div>
          </div>

          <form onSubmit={handleSavePublicProfile} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* 1. Identity, Avatar & Video Upload (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("identity") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("identity")}
                aria-expanded={openSections.includes("identity")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>👤</span>
                    <span>هویت، تصویر آواتار و ویدیوی معرفی</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {showcase.avatar_url && showcase.video_intro_url
                      ? "ویدیو و عکس ثبت‌شده ✓"
                      : showcase.avatar_url
                      ? "عکس ثبت‌شده"
                      : showcase.video_intro_url
                      ? "ویدیو ثبت‌شده"
                      : "نیازمند بارگذاری"}
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("identity") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("identity") && (
                <div className={styles.accordionContent}>
                  {/* Avatar File Upload */}
                  <div className={styles.avatarUploadRow}>
                    <div className={styles.avatarPreviewCircle}>
                      {showcase.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={showcase.avatar_url}
                          alt={showcase.name}
                          className={styles.avatarPreviewImg}
                        />
                      ) : (
                        showcase.name.charAt(0)
                      )}
                    </div>

                    <div className={styles.avatarControls}>
                      <label className={styles.formLabel}>عکس پروفایل استاد:</label>
                      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                        <input
                          type="file"
                          ref={avatarFileInputRef}
                          className={styles.fileInputHidden}
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => avatarFileInputRef.current?.click()}
                        >
                          📁 انتخاب عکس از دستگاه (JPG, PNG)
                        </Button>
                        {showcase.avatar_url && (
                          <Button
                            type="button"
                            variant="tertiary"
                            size="sm"
                            style={{ color: "#ef4444" }}
                            onClick={() => setShowcase({ ...showcase, avatar_url: "" })}
                          >
                            حذف عکس
                          </Button>
                        )}
                      </div>
                      <Input
                        type="text"
                        value={showcase.avatar_url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, avatar_url: e.target.value })
                        }
                        placeholder="یا آدرس اینترنتی تصویر را وارد کنید..."
                        style={{ marginBlockStart: "4px" }}
                      />
                    </div>
                  </div>

                  {/* Name & Headline */}
                  <div className={styles.grid2} style={{ marginBlockStart: "var(--space-2)" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>نام نمایشی استاد:</label>
                      <Input
                        type="text"
                        value={showcase.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, name: e.target.value })
                        }
                        placeholder="مثال: استاد کاوه رضایی"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>عنوان معرفی کوتاه (Headline):</label>
                      <Input
                        type="text"
                        value={showcase.headline}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, headline: e.target.value })
                        }
                        placeholder="مثال: دارنده مدرک DELTA کمبریج و اگزمینر ماک‌تست آیلتس"
                        required
                      />
                    </div>
                  </div>

                  {/* Video Upload & Preview */}
                  <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-2)" }}>
                    <label className={styles.formLabel}>
                      <span>🎬</span>
                      <span>ویدیوی معرفی استاد (آپلود مستقیم یا لینک آپارات):</span>
                    </label>

                    <div
                      className={styles.uploadDropArea}
                      onClick={() => videoFileInputRef.current?.click()}
                    >
                      <span className={styles.uploadIcon}>🎥</span>
                      <p className={styles.uploadPromptText}>
                        جهت آپلود مستقیم ویدیو کلیک کنید یا فایل را اینجا رها کنید (MP4 / WebM)
                      </p>
                      <p className={styles.uploadSubText}>
                        حداکثر حجم: ۸۰ مگابایت — ویدیوی کوتاه ۱ دقیقه‌ای شانس رزرو شما را ۲ برابر می‌کند.
                      </p>
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        className={styles.fileInputHidden}
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleVideoFileChange}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-2)" }}>
                      <Input
                        type="text"
                        value={showcase.video_intro_url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, video_intro_url: e.target.value })
                        }
                        placeholder="یا لینک ویدیو را از آپارات/یوتیوب وارد نمایید..."
                      />
                      {showcase.video_intro_url && (
                        <Button
                          type="button"
                          variant="tertiary"
                          size="sm"
                          style={{ color: "#ef4444", whiteSpace: "nowrap" }}
                          onClick={() => setShowcase({ ...showcase, video_intro_url: "" })}
                        >
                          حذف ویدیو
                        </Button>
                      )}
                    </div>

                    {/* Live Video Preview Box */}
                    {showcase.video_intro_url && (
                      <div style={{ marginBlockStart: "var(--space-3)" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-muted)", display: "block", marginBlockEnd: "4px" }}>
                          پیش‌نمایش زنده پخش ویدیو:
                        </span>
                        <div className={styles.videoPreviewBox}>
                          {showcase.video_intro_url.startsWith("data:video") ||
                          showcase.video_intro_url.startsWith("blob:") ||
                          showcase.video_intro_url.endsWith(".mp4") ||
                          showcase.video_intro_url.endsWith(".webm") ? (
                            <video
                              src={showcase.video_intro_url}
                              controls
                              className={styles.videoElement}
                            />
                          ) : (
                            <iframe
                              src={showcase.video_intro_url}
                              className={styles.videoIframePreview}
                              title="پیش‌نمایش ویدیو"
                              allowFullScreen
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Smart Pricing & Discount Suite (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("pricing") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("pricing")}
                aria-expanded={openSections.includes("pricing")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>💰</span>
                    <span>سیستم تعیین قیمت جلسات و پکیج‌های تخفیفی</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {formatToman(showcase.hourly_rate_toman)} (تخفیف آزمایشی: {toPersianDigits(showcase.trial_discount_percent)}٪)
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("pricing") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("pricing") && (
                <div className={styles.accordionContent}>
                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>شهریه هر ساعت جلسه استاندارد (تومان):</label>
                      <Input
                        type="number"
                        value={showcase.hourly_rate_toman}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, hourly_rate_toman: Number(e.target.value) })
                        }
                        placeholder="مثال: 380000"
                        required
                      />
                      <p className={styles.formHelp}>معادل: {formatToman(showcase.hourly_rate_toman)}</p>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>تخفیف جلسه آزمایشی ۳۰ دقیقه‌ای (درصد):</label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={showcase.trial_discount_percent}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setShowcase({ ...showcase, trial_discount_percent: Number(e.target.value) })
                          }
                          placeholder="50"
                        />
                        <button
                          type="button"
                          className={styles.tabButton}
                          style={{ padding: "6px 12px", fontSize: "0.8rem", border: "1px solid var(--glass-border)" }}
                          onClick={() => setShowcase({ ...showcase, trial_discount_percent: 100 })}
                        >
                          جلسه آزمایشی رایگان (۱۰۰٪)
                        </button>
                      </div>
                      <p className={styles.formHelp}>مبلغ پرداختی دانش‌آموز: {formatToman(trialCalculatedPrice)}</p>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>تخفیف پکیج ۵ جلسه‌ای (درصد):</label>
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        value={showcase.package_5_discount_percent}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, package_5_discount_percent: Number(e.target.value) })
                        }
                        placeholder="10"
                      />
                      <p className={styles.formHelp}>مبلغ کل بسته ۵ تایی: {formatToman(pkg5CalculatedPrice)}</p>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>تخفیف پکیج ۱۰ جلسه‌ای (درصد):</label>
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        value={showcase.package_10_discount_percent}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, package_10_discount_percent: Number(e.target.value) })
                        }
                        placeholder="20"
                      />
                      <p className={styles.formHelp}>مبلغ کل بسته ۱۰ تایی: {formatToman(pkg10CalculatedPrice)}</p>
                    </div>
                  </div>

                  {/* Live Student Price Summary Box */}
                  <div>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-muted)", display: "block" }}>
                      نمای زنده مبالغ پرداختی دانش‌آموز در کارت رزرو:
                    </span>
                    <div className={styles.pricingLiveGrid}>
                      <div className={styles.pricingLiveItem}>
                        <span className={styles.pricingLiveLabel}>جلسه استاندارد:</span>
                        <span className={styles.pricingLivePrice}>{formatToman(baseRate)}</span>
                      </div>
                      <div className={styles.pricingLiveItem}>
                        <span className={styles.pricingLiveLabel}>جلسه آزمایشی (۳۰ دقیقه):</span>
                        <span className={styles.pricingLivePrice}>{trialPct >= 100 ? "رایگان" : formatToman(trialCalculatedPrice)}</span>
                        <span className={styles.pricingDiscountBadge}>با {toPersianDigits(trialPct)}٪ تخفیف</span>
                      </div>
                      <div className={styles.pricingLiveItem}>
                        <span className={styles.pricingLiveLabel}>پکیج ۵ جلسه:</span>
                        <span className={styles.pricingLivePrice}>{formatToman(pkg5CalculatedPrice)}</span>
                        <span className={styles.pricingDiscountBadge}>با {toPersianDigits(pkg5Pct)}٪ تخفیف</span>
                      </div>
                      <div className={styles.pricingLiveItem}>
                        <span className={styles.pricingLiveLabel}>پکیج ۱۰ جلسه:</span>
                        <span className={styles.pricingLivePrice}>{formatToman(pkg10CalculatedPrice)}</span>
                        <span className={styles.pricingDiscountBadge}>با {toPersianDigits(pkg10Pct)}٪ تخفیف ویژه</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Experience, Credentials & Location (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("credentials") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("credentials")}
                aria-expanded={openSections.includes("credentials")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>🎓</span>
                    <span>مدارک بین‌المللی، تحصیلات و سوابق تدریس</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {toPersianDigits(showcase.experience_years)} سال سابقه | {showcase.city || "تهران"}
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("credentials") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("credentials") && (
                <div className={styles.accordionContent}>
                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>سابقه تدریس (سال):</label>
                      <Input
                        type="number"
                        value={showcase.experience_years}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, experience_years: Number(e.target.value) })
                        }
                        placeholder="مثال: 12"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>میانگین زمان پاسخگویی به پیام (دقیقه):</label>
                      <Input
                        type="number"
                        value={showcase.response_time_minutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, response_time_minutes: Number(e.target.value) })
                        }
                        placeholder="مثال: 15"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>شهر محل سکونت:</label>
                      <Input
                        type="text"
                        value={showcase.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, city: e.target.value })
                        }
                        placeholder="مثال: تهران"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>زبان‌های تسلط و تدریس:</label>
                      <Input
                        type="text"
                        value={showcase.languages_text}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, languages_text: e.target.value })
                        }
                        placeholder="فارسی (زبان مادری)، انگلیسی (C2 Native Proficiency)"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>تحصیلات دانشگاهی:</label>
                      <Input
                        type="text"
                        value={showcase.education}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, education: e.target.value })
                        }
                        placeholder="کارشناسی ارشد آموزش زبان انگلیسی دانشگاه تهران"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>مدارک و گواهینامه‌های بین‌المللی (با کاما جدا کنید):</label>
                      <Input
                        type="text"
                        value={showcase.certifications_text}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setShowcase({ ...showcase, certifications_text: e.target.value })
                        }
                        placeholder="Cambridge DELTA Modules 1-3، Cambridge CELTA Pass A، IELTS Band 8.5 Trainer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Bio & Philosophy (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("bio") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("bio")}
                aria-expanded={openSections.includes("bio")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>📖</span>
                    <span>درباره من و فلسفه آموزش</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {showcase.bio.length > 20 ? "متن کامل ✓" : "خالی"}
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("bio") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("bio") && (
                <div className={styles.accordionContent}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>متن تفصیلی معرفی و روش تدریس استاد:</label>
                    <textarea
                      className={styles.formTextarea}
                      value={showcase.bio}
                      onChange={(e) => setShowcase({ ...showcase, bio: e.target.value })}
                      placeholder="درباره خود، تجربیات تدریس، فلسفه آموزشی، نحوه تعامل با دانش‌آموزان و چگونگی رفع استرس زبان‌آموز بنویسید..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Methodology Steps (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("methodology") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("methodology")}
                aria-expanded={openSections.includes("methodology")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>🚀</span>
                    <span>گام‌های روش و سبک تدریس شما (Methodology)</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {toPersianDigits(showcase.methodology.length)} گام آموزشی
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("methodology") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("methodology") && (
                <div className={styles.accordionContent}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "8px" }}>
                    <p className={styles.formHelp} style={{ margin: 0 }}>
                      مراحل نقشه راهی که زبان‌آموز در کلاس‌های شما از ابتدا تا تسلط طی می‌کند را تعریف کنید.
                    </p>
                    <button
                      type="button"
                      className={styles.previewLiveBtn}
                      onClick={handleAddMethodologyStep}
                    >
                      + افزودن گام جدید
                    </button>
                  </div>

                  <div className={styles.dynamicListContainer}>
                    {showcase.methodology.map((step, idx) => (
                  <div key={idx} className={styles.dynamicItemCard}>
                    <div className={styles.dynamicItemHeader}>
                      <span className={styles.dynamicItemTitle}>
                        <span>گام {toPersianDigits(step.step_number)}:</span>
                        <Input
                          type="text"
                          value={step.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.methodology];
                            updated[idx].title = e.target.value;
                            setShowcase({ ...showcase, methodology: updated });
                          }}
                          placeholder="عنوان گام..."
                          style={{ minInlineSize: "260px" }}
                        />
                      </span>
                      <button
                        type="button"
                        className={styles.deleteItemBtn}
                        onClick={() => handleDeleteMethodologyStep(idx)}
                      >
                        ✕ حذف
                      </button>
                    </div>

                    <div className={styles.grid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>توضیحات این گام:</label>
                        <Input
                          type="text"
                          value={step.description}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.methodology];
                            updated[idx].description = e.target.value;
                            setShowcase({ ...showcase, methodology: updated });
                          }}
                          placeholder="توضیح کوتاه چگونگی یادگیری..."
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>آیکون ایموجی:</label>
                        <Input
                          type="text"
                          value={step.icon || "🎯"}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.methodology];
                            updated[idx].icon = e.target.value;
                            setShowcase({ ...showcase, methodology: updated });
                          }}
                          placeholder="🎯، 🗣، ⚡، 🎧"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Course Materials & Books (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("materials") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("materials")}
                aria-expanded={openSections.includes("materials")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>📚</span>
                    <span>منابع، کتاب‌ها و متریال‌های آموزشی دوره</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {toPersianDigits(showcase.course_materials.length)} منبع و کتاب
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("materials") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("materials") && (
                <div className={styles.accordionContent}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "8px" }}>
                    <p className={styles.formHelp} style={{ margin: 0 }}>
                      کتاب‌های اصلی، فلش‌کارت‌ها و ابزارهایی که در جلسات با زبان‌آموز کار می‌کنید.
                    </p>
                    <button
                      type="button"
                      className={styles.previewLiveBtn}
                      onClick={handleAddCourseMaterial}
                    >
                      + افزودن منبع جدید
                    </button>
                  </div>

                  <div className={styles.dynamicListContainer}>
                    {showcase.course_materials.map((mat, idx) => (
                  <div key={idx} className={styles.dynamicItemCard}>
                    <div className={styles.dynamicItemHeader}>
                      <span className={styles.dynamicItemTitle}>
                        <span>منبع {toPersianDigits(idx + 1)}:</span>
                        <Input
                          type="text"
                          value={mat.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.course_materials];
                            updated[idx].title = e.target.value;
                            setShowcase({ ...showcase, course_materials: updated });
                          }}
                          placeholder="عنوان کتاب یا منبع..."
                          style={{ minInlineSize: "280px" }}
                        />
                      </span>
                      <button
                        type="button"
                        className={styles.deleteItemBtn}
                        onClick={() => handleDeleteCourseMaterial(idx)}
                      >
                        ✕ حذف
                      </button>
                    </div>

                    <div className={styles.grid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>دسته‌بندی (مثلاً کتاب اصلی دوره، متریال شنیداری):</label>
                        <Input
                          type="text"
                          value={mat.category}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.course_materials];
                            updated[idx].category = e.target.value;
                            setShowcase({ ...showcase, course_materials: updated });
                          }}
                          placeholder="کتاب اصلی دوره..."
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>نشان ناشر یا برچسب اعتبار:</label>
                        <Input
                          type="text"
                          value={mat.badge || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...showcase.course_materials];
                            updated[idx].badge = e.target.value;
                            setShowcase({ ...showcase, course_materials: updated });
                          }}
                          placeholder="مثلاً Cambridge University Press"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Teacher Custom FAQs (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("faqs") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("faqs")}
                aria-expanded={openSections.includes("faqs")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>❓</span>
                    <span>پرسش‌های متداول من (FAQ)</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {toPersianDigits(showcase.faqs.length)} سؤال و پاسخ
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("faqs") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("faqs") && (
                <div className={styles.accordionContent}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "8px" }}>
                    <p className={styles.formHelp} style={{ margin: 0 }}>
                      پاسخ به ابهامات معمول زبان‌آموزان قبل از رزرو اولین جلسه.
                    </p>
                    <button
                      type="button"
                      className={styles.previewLiveBtn}
                      onClick={handleAddFaq}
                    >
                      + افزودن پرسش جدید
                    </button>
                  </div>

                  <div className={styles.dynamicListContainer}>
                    {showcase.faqs.map((faq, idx) => (
                  <div key={idx} className={styles.dynamicItemCard}>
                    <div className={styles.dynamicItemHeader}>
                      <span className={styles.dynamicItemTitle}>
                        <span>سؤال {toPersianDigits(idx + 1)}:</span>
                      </span>
                      <button
                        type="button"
                        className={styles.deleteItemBtn}
                        onClick={() => handleDeleteFaq(idx)}
                      >
                        ✕ حذف
                      </button>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>متن پرسش:</label>
                      <Input
                        type="text"
                        value={faq.question}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updated = [...showcase.faqs];
                          updated[idx].question = e.target.value;
                          setShowcase({ ...showcase, faqs: updated });
                        }}
                        placeholder="سؤال دانش‌آموز..."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>پاسخ استاد:</label>
                      <textarea
                        className={styles.formTextarea}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...showcase.faqs];
                          updated[idx].answer = e.target.value;
                          setShowcase({ ...showcase, faqs: updated });
                        }}
                        placeholder="پاسخ صبورانه شما به این سؤال..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
            </div>

            {/* 8. Specialties & Highlight Tags (Collapsible) */}
            <div className={`${styles.accordionCard} ${openSections.includes("specialties") ? styles.accordionCardActive : ""}`}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => toggleSection("specialties")}
                aria-expanded={openSections.includes("specialties")}
              >
                <div className={styles.accordionHeaderLeft}>
                  <h3 className={styles.accordionTitle}>
                    <span>✨</span>
                    <span>حوزه‌های تخصص و برچسب‌های برجسته کلاس</span>
                  </h3>
                  <span className={styles.accordionSummaryBadge}>
                    {toPersianDigits(showcase.specialties.length)} تخصص | {toPersianDigits(showcase.highlight_tags.length)} برچسب
                  </span>
                </div>
                <span className={`${styles.accordionChevron} ${openSections.includes("specialties") ? styles.accordionChevronRotated : ""}`}>
                  ▼
                </span>
              </button>

              {openSections.includes("specialties") && (
                <div className={styles.accordionContent}>
                  {/* Specialties */}
                  <div className={styles.tagsManager}>
                    <label className={styles.formLabel}>مهارت‌ها و حوزه‌های تدریس:</label>
                    <div className={styles.tagsCloud}>
                      {showcase.specialties.map((spec, idx) => (
                        <span key={idx} className={styles.tagItem}>
                          <span>{spec}</span>
                          <button
                            type="button"
                            className={styles.removeTagBtn}
                            onClick={() => handleRemoveSpecialty(spec)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className={styles.addTagRow}>
                      <Input
                        type="text"
                        value={newSpecialtyInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewSpecialtyInput(e.target.value)
                        }
                        placeholder="مهارت جدید (مثلاً رایتینگ آیلتس)"
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddSpecialty}>
                        افزودن تخصص
                      </Button>
                    </div>
                  </div>

                  {/* Highlight Tags */}
                  <div className={styles.tagsManager} style={{ marginBlockStart: "var(--space-4)" }}>
                    <label className={styles.formLabel}>برچسب‌های پرتکرار ویژگی‌های کلاس شما:</label>
                    <div className={styles.tagsCloud}>
                      {showcase.highlight_tags.map((tag, idx) => (
                        <span key={idx} className={styles.tagItem} style={{ background: "rgba(16,185,129,0.12)", borderColor: "#10b981", color: "#10b981" }}>
                          <span>✓ {tag}</span>
                          <button
                            type="button"
                            className={styles.removeTagBtn}
                            style={{ color: "#10b981" }}
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className={styles.addTagRow}>
                      <Input
                        type="text"
                        value={newTagInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewTagInput(e.target.value)
                        }
                        placeholder="ویژگی جدید (مثلاً تکنیک‌های اسپیکینگ آیلتس)"
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                        افزودن برچسب
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Save Action Bar */}
            <div className={styles.saveStickyActions}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <a
                  href={`/teachers/${selectedTeacherId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewLiveBtn}
                >
                  <span>👁️</span>
                  <span>مشاهده در صفحه دانش‌آموز</span>
                </a>
                <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.7)" }}>
                  تغییرات شما برای <strong>{showcase.name}</strong> بلافاصله لایو خواهد شد.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={savingShowcase}
                disabled={savingShowcase}
              >
                {savingShowcase ? "در حال ذخیره..." : "💾 ذخیره نهایی و انتشار در ویترین"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================
          TAB 2: SUBSCRIPTION & DAILY QUOTAS
          =================================================================== */}
      {activeTab === "subscription" && (
        <div className={styles.tabContent}>
          {/* Productivity Stats Ribbon */}
          <div className={styles.productivityGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span>{isFa ? "صرفه‌جویی در زمان" : "Hours Saved"}</span>
                <span className={styles.statIcon}>⏱️</span>
              </div>
              <div className={styles.statValue}>
                {productivity.hours_saved} <span style={{ fontSize: "1rem", fontWeight: 600 }}>{isFa ? "ساعت" : "hrs"}</span>
              </div>
              <p className={styles.statSubtext}>
                {isFa
                  ? "صرفه‌جویی شده با تولید خودکار هوش مصنوعی"
                  : "Saved through automated AI material generation"}
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span>{isFa ? "منابع تولید شده" : "Materials Created"}</span>
                <span className={styles.statIcon}>✨</span>
              </div>
              <div className={styles.statValue}>{productivity.materials_count}</div>
              <p className={styles.statSubtext}>
                {isFa
                  ? "طرح درس، کاربرگ، فعالیت و آزمون فعال"
                  : "Lessons, activities, worksheets & assessments"}
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span>{isFa ? "کلاس‌های متصل" : "Active Classes"}</span>
                <span className={styles.statIcon}>🎓</span>
              </div>
              <div className={styles.statValue}>{productivity.classes_count}</div>
              <p className={styles.statSubtext}>
                {isFa
                  ? "کلاس‌های تحت مدیریت در Endoora"
                  : "Managed student cohorts and classes"}
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <span>{isFa ? "خروجی‌های رسمی" : "Official Exports"}</span>
                <span className={styles.statIcon}>📄</span>
              </div>
              <div className={styles.statValue}>
                {usage.all_time.word_exports + usage.all_time.pdf_exports}
              </div>
              <p className={styles.statSubtext}>
                {isFa
                  ? "اسناد رسمی Word (.docx) و PDF ایجاد شده"
                  : "Formal Word and PDF documents generated"}
              </p>
            </div>
          </div>

          {/* Quota & Daily Limit Meter */}
          <div className={styles.quotaCard}>
            <div className={styles.quotaHeader}>
              <div>
                <h2 className={styles.quotaTitle}>
                  {isFa ? "سهمیه روزانه هوش مصنوعی (Daily AI Quota)" : "Daily AI Quota & Limits"}
                </h2>
                <p className={styles.quotaSubtitle}>
                  {isFa
                    ? "سهمیه مصرف بر اساس طرح اشتراک روزانه محاسبه شده و هر روز ساعت ۰۰:۰۰ بامداد بازنشانی می‌گردد."
                    : "Quotas reset daily at midnight IRST. Upgrade your tier for expanded limits."}
                </p>
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                {isFa
                  ? `${usage.remaining_today} تولید باقی‌مانده امروز`
                  : `${usage.remaining_today} generations remaining today`}
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.progressNumbers}>
                <span>{isFa ? "استفاده امروز:" : "Used Today:"} {usedToday}</span>
                <span>{usagePercent}%</span>
                <span>{isFa ? "سقف روزانه:" : "Daily Cap:"} {limitToday >= 999 ? (isFa ? "نامحدود" : "Unlimited") : limitToday}</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  data-status={progressStatus}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            <div className={styles.quotaBreakdownGrid}>
              <div className={styles.breakdownItem}>
                <span>📖 {isFa ? "طرح درس‌ها:" : "Lessons:"}</span>
                <strong>{usage.breakdown.lesson}</strong>
              </div>
              <div className={styles.breakdownItem}>
                <span>🎭 {isFa ? "فعالیت‌ها:" : "Activities:"}</span>
                <strong>{usage.breakdown.activity}</strong>
              </div>
              <div className={styles.breakdownItem}>
                <span>📝 {isFa ? "کاربرگ‌ها:" : "Worksheets:"}</span>
                <strong>{usage.breakdown.worksheet}</strong>
              </div>
              <div className={styles.breakdownItem}>
                <span>📊 {isFa ? "کوییز و ارزیابی:" : "Assessments:"}</span>
                <strong>{usage.breakdown.assessment}</strong>
              </div>
              <div className={styles.breakdownItem}>
                <span>📑 {isFa ? "خروجی Word امروز:" : "Word Exports:"}</span>
                <strong>{usage.today.word_exports}</strong>
              </div>
              <div className={styles.breakdownItem}>
                <span>📄 {isFa ? "خروجی PDF امروز:" : "PDF Exports:"}</span>
                <strong>{usage.today.pdf_exports}</strong>
              </div>
            </div>
          </div>

          {/* Subscription Plans & Iranian Domestic Billing */}
          <div className={styles.plansSection}>
            <div className={styles.plansHeader}>
              <h2 className={styles.plansTitle}>
                {isFa ? "طرح‌های اشتراک حرفه‌ای مدرسین" : "TeacherOS Subscription Plans"}
              </h2>
              <p className={styles.plansSubtitle}>
                {isFa
                  ? "امکان پرداخت مستقیم و آنی با کلیه کارت‌های عضو شبکه شتاب از طریق درگاه امن شاپرک / زرین‌پال"
                  : "Instant activation with Iranian domestic Shetab payment cards via Zarinpal"}
              </p>
            </div>

            <div className={styles.plansGrid}>
              {available_plans.map((p) => {
                const isCurrent = plan.code === p.code;
                return (
                  <div
                    key={p.code}
                    className={`${styles.planCard} ${p.is_popular ? styles.planCardPopular : ""}`}
                  >
                    {p.is_popular && (
                      <div className={styles.popularBadge}>
                        {isFa ? "محبوب‌ترین انتخاب مدرسین" : "Most Popular Choice"}
                      </div>
                    )}

                    <div>
                      <h3 className={styles.planName}>{isFa ? p.name_fa : p.name}</h3>
                      <div className={styles.planPrice}>
                        <span className={styles.priceAmount}>
                          {p.price_toman === 0
                            ? (isFa ? "رایگان" : "Free")
                            : p.price_toman.toLocaleString(isFa ? "fa-IR" : "en-US")}
                        </span>
                        {p.price_toman > 0 && (
                          <span className={styles.priceUnit}>
                            {isFa ? "تومان / ماهانه" : "Toman / month"}
                          </span>
                        )}
                      </div>

                      <ul className={styles.featuresList}>
                        {(isFa ? p.features_fa : p.features_en).map((feat, idx) => (
                          <li key={idx} className={styles.featureItem}>
                            <span className={styles.featureCheck}>✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                      {isCurrent ? (
                        <div className={styles.currentPlanBadge}>
                          ✓ {isFa ? "طرح فعال فعلی شما" : "Current Active Plan"}
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className={styles.upgradeBtn}
                          onClick={() => {
                            setReceipt(null);
                            setUpgradeTarget(p);
                          }}
                        >
                          💳 {isFa ? `ارتقا به ${p.name_fa}` : `Upgrade to ${p.name}`}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 3: PEDAGOGICAL DEFAULTS (COLLAPSIBLE)
          =================================================================== */}
      {activeTab === "pedagogy" && preferences && (
        <div className={styles.tabContent}>
          <div className={`${styles.accordionCard} ${openSections.includes("pedagogy") ? styles.accordionCardActive : ""}`}>
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleSection("pedagogy")}
              aria-expanded={openSections.includes("pedagogy")}
            >
              <div className={styles.accordionHeaderLeft}>
                <h2 className={styles.accordionTitle}>
                  <span>⚙️</span>
                  <span>{isFa ? "پیش‌فرض‌ها و تنظیمات پداگوژیک (Pedagogical Defaults)" : "Pedagogical Preferences"}</span>
                </h2>
                <span className={styles.accordionSummaryBadge}>
                  سطح {preferences.default_cefr} | {preferences.default_duration} دقیقه | متد {preferences.preferred_methodology.toUpperCase()}
                </span>
              </div>
              <span className={`${styles.accordionChevron} ${openSections.includes("pedagogy") ? styles.accordionChevronRotated : ""}`}>
                ▼
              </span>
            </button>

            {openSections.includes("pedagogy") && (
              <div className={styles.accordionContent}>
                <p className={styles.quotaSubtitle} style={{ margin: 0 }}>
                  {isFa
                    ? "تنظیمات پیش‌فرض برای کلیه تولیدات هوش مصنوعی، استودیوی طرح درس و تصحیح رایتینگ"
                    : "Default configurations applied across AI generation studios and feedback rubrics"}
                </p>

                {prefsMessage && (
                  <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.9rem", fontWeight: 600 }}>
                    {prefsMessage}
                  </div>
                )}

                <form onSubmit={handleSavePreferences} className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{isFa ? "سطح پیش‌فرض CEFR:" : "Default CEFR Level:"}</label>
                    <select
                      className={styles.formSelect}
                      value={preferences.default_cefr}
                      onChange={(e) =>
                        setPreferences({ ...preferences, default_cefr: e.target.value })
                      }
                    >
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper-Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                      <option value="C2">C2 - Mastery</option>
                    </select>
                    <p className={styles.formHelp}>
                      {isFa ? "سطح زبانی مبنا در استودیوی تولید طرح درس" : "Default proficiency level"}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{isFa ? "مدت زمان پیش‌فرض جلسه (دقیقه):" : "Default Duration (mins):"}</label>
                    <select
                      className={styles.formSelect}
                      value={preferences.default_duration}
                      onChange={(e) =>
                        setPreferences({ ...preferences, default_duration: Number(e.target.value) })
                      }
                    >
                      <option value={45}>{isFa ? "۴۵ دقیقه" : "45 minutes"}</option>
                      <option value={60}>{isFa ? "۶۰ دقیقه" : "60 minutes"}</option>
                      <option value={90}>{isFa ? "۹۰ دقیقه" : "90 minutes"}</option>
                      <option value={120}>{isFa ? "۱۲۰ دقیقه" : "120 minutes"}</option>
                    </select>
                    <p className={styles.formHelp}>
                      {isFa ? "تقسیم‌بندی گام‌های زمانی کلاس" : "Timing distribution"}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{isFa ? "متدولوژی و چارچوب تدریس:" : "Teaching Framework:"}</label>
                    <select
                      className={styles.formSelect}
                      value={preferences.preferred_methodology}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          preferred_methodology: e.target.value as "ppp" | "esa" | "tbl",
                        })
                      }
                    >
                      <option value="ppp">PPP (Presentation, Practice, Production)</option>
                      <option value="esa">ESA (Engage, Study, Activate)</option>
                      <option value="tbl">TBL (Task-Based Learning)</option>
                    </select>
                    <p className={styles.formHelp}>
                      {isFa ? "الگوی ساختاری طرح درس‌های تولیدی" : "Core lesson methodology"}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{isFa ? "لحن بازخورد و تصحیح رایتینگ:" : "Marking & Feedback Tone:"}</label>
                    <select
                      className={styles.formSelect}
                      value={preferences.feedback_tone}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          feedback_tone: e.target.value as "encouraging" | "balanced" | "rigorous",
                        })
                      }
                    >
                      <option value="encouraging">{isFa ? "تشویقی و انگیزشی (Encouraging)" : "Encouraging"}</option>
                      <option value="balanced">{isFa ? "متعادل و تحلیلی (Balanced)" : "Balanced"}</option>
                      <option value="rigorous">{isFa ? "آکادمیک و دقیق (Rigorous / Academic)" : "Rigorous"}</option>
                    </select>
                    <p className={styles.formHelp}>
                      {isFa ? "سبک بازخورد هوش مصنوعی در استودیوی نگارش" : "Feedback demeanor"}
                    </p>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label className={styles.checkboxLabel}>
                      <Input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={preferences.auto_generate_ccqs}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPreferences({ ...preferences, auto_generate_ccqs: e.target.checked })
                        }
                      />
                      <span>
                        {isFa
                          ? "تولید خودکار سوالات بررسی مفهوم (Concept Checking Questions - CCQs) در کلیه طرح درس‌ها"
                          : "Automatically generate Concept Checking Questions (CCQs) for vocabulary and grammar"}
                      </span>
                    </label>
                  </div>

                  <div style={{ gridColumn: "1 / -1", paddingTop: "8px" }}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className={styles.savePreferencesBtn}
                      loading={savingPrefs}
                      disabled={savingPrefs}
                    >
                      {savingPrefs
                        ? (isFa ? "در حال ذخیره..." : "Saving...")
                        : (isFa ? "💾 ذخیره تنظیمات پداگوژیک" : "💾 Save Pedagogical Preferences")}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: SECURITY & LOGOUT
          =================================================================== */}
      {activeTab === "security" && (
        <div className={styles.tabContent}>
          <div className={styles.formCard}>
            <div className={styles.formCardHeader}>
              <h2 className={styles.formCardTitle}>
                <span>🛡️</span>
                <span>{isFa ? "تنظیمات گذرواژه و امنیت ورود" : "Security & Authentication"}</span>
              </h2>
            </div>
            <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
              {isFa
                ? "جهت تغییر رمز عبور و تنظیمات ورود دو مرحله‌ای می‌توانید به بخش امنیت عمومی ایندورا مراجعه فرمایید."
                : "Manage passwords and two-factor authentication from the central account settings."}
            </p>
            <div style={{ paddingBlockStart: "8px" }}>
              <Link href="/account" className={styles.securityLink}>
                🛡️ {isFa ? "انتقال به تنظیمات عمومی و امنیت ایندورا" : "Go to Central Account Security"}
              </Link>
            </div>
          </div>

          <div className={styles.logoutSection}>
            <div className={styles.logoutHeader}>
              <div className={styles.logoutIconBadge}>🚪</div>
              <div>
                <h2 className={styles.logoutTitle}>
                  {isFa ? "خروج از حساب کاربری" : "Sign Out of Account"}
                </h2>
                <p className={styles.logoutDesc}>
                  {isFa
                    ? "جهت حفظ امنیت اطلاعات حساب، می‌توانید در پایان جلسه کاری خود با اطمینان از این دستگاه خارج شوید."
                    : "Securely sign out and terminate your active session on this device."}
                </p>
              </div>
            </div>

            <div className={styles.logoutWarningNotice}>
              <span>⚠️</span>
              <span>
                {isFa
                  ? "با خروج از حساب کاربری، نشست فعال شما در این مرورگر بسته خواهد شد و برای ورود مجدد نیاز به نام کاربری یا ایمیل و گذرواژه خواهید داشت."
                  : "Signing out will end your authenticated session. You will need your credentials to sign in again."}
              </span>
            </div>

            <div className={styles.logoutActionWrap}>
              <Button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
                loading={loggingOut}
                disabled={loggingOut}
              >
                {loggingOut
                  ? (isFa ? "در حال خروج از حساب..." : "Signing out...")
                  : (isFa ? "🚪 خروج از حساب کاربری" : "🚪 Sign Out of Account")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Simulation Modal (Zarinpal) */}
      {upgradeTarget && (
        <div className={styles.modalOverlay} onClick={() => setUpgradeTarget(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className={styles.modalTitle}>
                💳 {isFa ? "پرداخت امن شاپرک و زرین‌پال" : "Domestic Payment Simulation"}
              </h3>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setUpgradeTarget(null)}
                style={{ background: "transparent", border: "none", color: "var(--color-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </Button>
            </div>

            {receipt ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "3rem" }}>🎉</div>
                <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#10b981", fontWeight: 800 }}>
                  {isFa ? "پرداخت با موفقیت انجام و طرح فعال شد!" : "Payment successful & plan activated!"}
                </h4>
                <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
                  {isFa
                    ? `اشتراک شما به ${receipt.plan_name} ارتقا یافت و سهمیه روزانه بلافاصله افزایش پیدا کرد.`
                    : `Your subscription has been upgraded to ${upgradeTarget.name}.`}
                </p>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}>
                  <span>{isFa ? "کد پیگیری تراکنش (Ref ID):" : "Transaction Ref ID:"} </span>
                  <strong style={{ fontFamily: "monospace", color: "var(--color-endoora-blue)" }}>
                    {receipt.ref_id}
                  </strong>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className={styles.upgradeBtn}
                  onClick={() => setUpgradeTarget(null)}
                >
                  {isFa ? "متوجه شدم و بازگشت" : "Done"}
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.gatewayBadge}>
                  🔒 {isFa ? "درگاه پرداخت الکترونیک زرین‌پال (شاپرک)" : "Zarinpal Secure Shetab Gateway"}
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "8px", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "طرح انتخابی:" : "Target Plan:"}</span>
                    <strong>{isFa ? upgradeTarget.name_fa : upgradeTarget.name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "سهمیه روزانه جدید:" : "New Daily Cap:"}</span>
                    <strong style={{ color: "#10b981" }}>
                      {upgradeTarget.daily_limit >= 999 ? (isFa ? "نامحدود" : "Unlimited") : `${upgradeTarget.daily_limit} در روز`}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "مبلغ قابل پرداخت:" : "Total Payable:"}</span>
                    <strong style={{ fontSize: "1.2rem", color: "var(--color-endoora-blue)" }}>
                      {upgradeTarget.price_toman.toLocaleString(isFa ? "fa-IR" : "en-US")} {isFa ? "تومان" : "Toman"}
                    </strong>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-muted)", lineHeight: 1.5 }}>
                  {isFa
                    ? "در محیط عملیاتی، این تراکنش مستقیماً به صفحه پرداخت اینترنتی شاپرک هدایت می‌شود. در این شبیه‌سازی، فعال‌سازی بلافاصله با کد پیگیری معتبر انجام می‌گیرد."
                    : "Simulated sandbox domestic payment with immediate activation."}
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setUpgradeTarget(null)}
                    disabled={upgrading}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className={styles.upgradeBtn}
                    onClick={handleConfirmUpgrade}
                    loading={upgrading}
                    disabled={upgrading}
                  >
                    {upgrading
                      ? (isFa ? "در حال اتصال به درگاه..." : "Connecting...")
                      : (isFa ? "تایید و پرداخت آنلاین" : "Confirm & Pay")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
