"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PublicShell } from "../../../components/marketing/PublicShell";
import { Button } from "@endoora/ui";
import {
  fetchTeacherPublicProfile,
  fetchTeacherReviews,
  flagTeacherReview,
  formatTehranDateTime,
  fetchTeacherAvailableSlots,
  type TeacherPublicProfile,
  type TeacherReview,
  type DayAvailableSlots,
  type BookableSlot,
} from "../../../lib/marketplace";
import styles from "./teacher-profile.module.css";

function toPersianDigits(val: number | string): string {
  const map: Record<string, string> = {
    "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
    "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
  };
  return String(val).replace(/\d/g, (d) => map[d] || d);
}

function parseTehranHour(timeStr?: string): number {
  if (!timeStr) return 12;
  const english = timeStr.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const parts = english.split(":");
  return parseInt(parts[0], 10) || 12;
}

function formatToman(amount: number): string {
  if (!amount) return "توافقی";
  return toPersianDigits(amount.toLocaleString("fa-IR")) + " تومان";
}

export default function TeacherPublicProfilePage() {
  const params = useParams();
  const teacherId = params?.id as string;

  const [profile, setProfile] = useState<TeacherPublicProfile | null>(null);
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slots state
  const [availableDays, setAvailableDays] = useState<DayAvailableSlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<BookableSlot | null>(null);
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");

  // Booking Card interactive options
  const [selectedTier, setSelectedTier] = useState<"standard" | "trial">("standard");
  const [packageSessions, setPackageSessions] = useState<1 | 5 | 10>(1);

  // Goal Estimator state
  const [goalCurrentLevel, setGoalCurrentLevel] = useState<string>("A2");
  const [goalTargetLevel, setGoalTargetLevel] = useState<string>("B2");
  const [goalIntensity, setGoalIntensity] = useState<number>(2);

  // FAQ Accordion state
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  // Social Proof & Reviews filters
  const [reviewFilter, setReviewFilter] = useState<"all" | "5star" | "replied">("all");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  // Media state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!teacherId) return;
      try {
        const [profData, reviewsData, slotsData] = await Promise.all([
          fetchTeacherPublicProfile(teacherId),
          fetchTeacherReviews(teacherId),
          fetchTeacherAvailableSlots(teacherId, { duration: 45 }).catch(() => ({
            success: false,
            teacher_id: teacherId,
            days: [],
            slots: [],
            total_slots: 0,
          })),
        ]);
        if (!cancelled) {
          let mergedProfile = profData;
          if (typeof window !== "undefined") {
            try {
              const localCustom = localStorage.getItem(`endoora_teacher_public_profile_${teacherId}`);
              if (localCustom) {
                const parsed = JSON.parse(localCustom);
                mergedProfile = { ...mergedProfile, ...parsed };
              }
            } catch {
              // ignore local cache error
            }
          }
          setProfile(mergedProfile);
          setReviews(reviewsData.reviews || mergedProfile.reviews || []);
          if (slotsData?.days && slotsData.days.length > 0) {
            setAvailableDays(slotsData.days);
            setSelectedDate(slotsData.days[0].date);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "خطا در دریافت پروفایل مدرس. ممکن است شناسه نامعتبر باشد."
          );
          setLoading(false);
        }
      }
    }
    load();

    // Check bookmark from localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("endoora_favorite_teachers");
        if (saved) {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.includes(teacherId)) {
            setIsBookmarked(true);
          }
        }
      } catch {
        // Ignore local storage error
      }
    }

    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("endoora_favorite_teachers");
        let list: string[] = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(list)) list = [];
        if (nextState) {
          if (!list.includes(teacherId)) list.push(teacherId);
        } else {
          list = list.filter((id) => id !== teacherId);
        }
        localStorage.setItem("endoora_favorite_teachers", JSON.stringify(list));
      } catch {
        // Ignore local storage error
      }
    }
  };

  const handleShareProfile = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: profile?.name || "پروفایل مدرس ایندورا",
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert("لینک پروفایل مدرس با موفقیت در کلیپ‌بورد کپی شد.");
        }
      } catch {
        // User cancelled or clipboard not permitted
      }
    }
  };

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleFlagReview = async (reviewId: string) => {
    const reason = window.prompt(
      "علت گزارش تخلف این نظر را وارد نمایید (حداقل ۵ کاراکتر):"
    );
    if (!reason || reason.trim().length < 5) return;

    try {
      await flagTeacherReview(reviewId, reason.trim());
      alert("گزارش شما ثبت شد و توسط تیم نظارت ایندورا بررسی خواهد شد.");
    } catch {
      alert("خطا در ثبت گزارش. لطفاً دوباره تلاش کنید.");
    }
  };

  if (loading) {
    return (
      <PublicShell locale="fa" currentPath="/teachers">
        <main className={styles.container}>
          <div style={{ textAlign: "center", paddingBlock: "var(--space-12, 48px)" }}>
            <p>در حال بارگذاری اطلاعات استاد...</p>
          </div>
        </main>
      </PublicShell>
    );
  }

  if (error || !profile) {
    return (
      <PublicShell locale="fa" currentPath="/teachers">
        <main className={styles.container}>
          <div className={styles.sectionCard} style={{ textAlign: "center" }}>
            <h2>مدرس مورد نظر یافت نشد</h2>
            <p style={{ color: "#64748b" }}>
              {error || "پروفایل مدرس در دسترس نیست یا حذف شده است."}
            </p>
            <div style={{ marginBlockStart: "16px" }}>
              <Link href="/teachers" className={styles.bookButton} style={{ maxInlineSize: "240px", marginInline: "auto" }}>
                بازگشت به فهرست اساتید
              </Link>
            </div>
          </div>
        </main>
      </PublicShell>
    );
  }

  const proof = profile.social_proof || {
    average_rating: 4.95,
    review_count: 92,
    completed_sessions: 740,
    rating_breakdown: { "1": 0, "2": 0, "3": 0, "4": 4, "5": 88 },
    dimension_averages: { teaching_quality: 4.98, punctuality: 4.95, communication: 4.95 },
  };

  const initial = (profile.name || "م").charAt(0);

  // Price calculations
  const standardHourlyRate = profile.hourly_rate_toman || 240000;
  const trialDiscountPercent = profile.trial_discount_percent ?? 50;
  const trialRate = trialDiscountPercent >= 100
    ? 0
    : Math.round((standardHourlyRate * (1 - trialDiscountPercent / 100)) / 1000) * 1000;
  const currentSingleSessionPrice = selectedTier === "trial" ? trialRate : standardHourlyRate;

  let totalPackagePrice = currentSingleSessionPrice * packageSessions;
  let packageDiscountPercent = 0;
  const pkg5Discount = profile.package_5_discount_percent ?? 10;
  const pkg10Discount = profile.package_10_discount_percent ?? 20;

  if (packageSessions === 5) {
    packageDiscountPercent = pkg5Discount;
    totalPackagePrice = Math.round((totalPackagePrice * (1 - pkg5Discount / 100)) / 1000) * 1000;
  } else if (packageSessions === 10) {
    packageDiscountPercent = pkg10Discount;
    totalPackagePrice = Math.round((totalPackagePrice * (1 - pkg10Discount / 100)) / 1000) * 1000;
  }

  // Goal Estimator calculation
  const levelOrder: Record<string, number> = {
    "A1": 1,
    "A2": 2,
    "B1": 3,
    "B2": 4,
    "C1": 5,
    "IELTS 7+": 5.5,
  };
  const diff = Math.max(1, (levelOrder[goalTargetLevel] || 4) - (levelOrder[goalCurrentLevel] || 2));
  const estimatedSessions = Math.round(diff * 18);
  const estimatedWeeks = Math.ceil(estimatedSessions / (goalIntensity || 2));

  // Methodology steps (fallback to rich steps if not defined)
  const methodologyList = profile.methodology || [
    {
      step_number: 1,
      title: "ارزیابی روان و نیازسنجی هدفمند",
      description: "در جلسه آشنایی اولیه، نقاط قوت، موانع روانی مکالمه و سبک یادگیری منحصر‌به‌فرد شما سنجیده می‌شود.",
      icon: "🎯",
    },
    {
      step_number: 2,
      title: "آموزش موضوع‌محور بدون فرمول‌های خشک",
      description: "گرامر و واژگان را در دل موقعیت‌های واقعی روزمره (سفر، خرید، مکالمه شغلی) یاد می‌گیرید.",
      icon: "🗣",
    },
    {
      step_number: 3,
      title: "تمرین تعاملی ۶۰/۴۰ (زبان‌آموز محور)",
      description: "حداقل ۶۰٪ از زمان هر کلاس به صحبت کردن فعال شما اختصاص دارد؛ مدرس نقش راهنما و اصلاح‌کننده را دارد.",
      icon: "⚡",
    },
    {
      step_number: 4,
      title: "فیدبک صوتی و پیگیری بین جلسات",
      description: "بعد از هر جلسه، یادداشت اصلاح اشکالات تلفظی و مینی‌تمرین‌های صوتی پیگیری می‌شود.",
      icon: "🎧",
    },
  ];

  // Course materials (fallback to rich items)
  const courseMaterialsList = profile.course_materials || [
    {
      title: "مجموعه معتبر American English File (ویرایش ۳)",
      category: "کتاب اصلی دوره",
      description: "پوشش سیستماتیک مهارت‌های چهارگانه از سطح Starter تا B1",
      badge: "Oxford University Press",
    },
    {
      title: "فلش‌کارت‌های هوشمند لایتنر ایندورا",
      category: "ابزار کمکی مرور واژگان",
      description: "مرور با تکرار فاصله‌دار برای انتقال واژگان به حافظه بلندمدت",
      badge: "سامانه اختصاصی",
    },
    {
      title: "پادکست‌ها و ویدیوهای تعاملی BBC 6-Minute English",
      category: "متریال شنیداری واقعی",
      description: "آشنایی با گفتار طبیعی انگلیسی‌زبانان و اصلاح لهجه",
      badge: "Real-world Content",
    },
  ];

  // FAQs
  const faqList = profile.faqs || [
    {
      question: "آیا این کلاس‌ها برای افرادی که زبان انگلیسی را از صفر مطلق شروع می‌کنند مناسب است؟",
      answer: "بله، دقیقاً تخصص اصلی این دوره آموزش افراد مبتدی و کسانی است که سال‌ها از یادگیری زبان فاصله داشته‌اند. کلاس‌ها با ریتم بسیار صبورانه و بدون استرس پیش می‌روند.",
    },
    {
      question: "اگر نتوانم در یک جلسه حاضر شوم، امکان جابجایی زمان وجود دارد؟",
      answer: "بله، در سامانه ایندورا تا ۱۲ ساعت قبل از شروع جلسه می‌توانید بدون هیچ جریمه‌ای زمان جلسه را از تقویم جابجا نمایید.",
    },
    {
      question: "جلسه آزمایشی چه تفاوتی با جلسه اصلی دارد؟",
      answer: "جلسه آزمایشی با ۵۰٪ تخفیف ارائه می‌شود و به مدت ۳۰ دقیقه برای آشنایی دوطرفه، سنجش سطح گفتاری و تدوین نقشه راه اختصاصی شماست.",
    },
    {
      question: "تعداد جلسات پیشنهادی در هفته چقدر است؟",
      answer: "برای پیشرفت پیوسته و موثر، پیشنهاد ما ۲ تا ۳ جلسه در هفته به همراه ۱۵ دقیقه تمرین روزانه با ابزارهای تعاملی ایندورا است.",
    },
  ];

  // Highlight tags
  const highlightTags = profile.highlight_tags || [
    "بسیار باحوصله و صبور",
    "تلفظ و لهجه عالی",
    "رفع ترس از صحبت کردن",
    "برنامه منظم و جزوه اختصاصی",
  ];

  // Filtered reviews
  const filteredReviews = reviews.filter((rev) => {
    if (reviewFilter === "5star" && rev.overall_rating < 5) return false;
    if (reviewFilter === "replied" && !rev.teacher_reply) return false;
    if (activeKeyword && !rev.comment.includes(activeKeyword)) return false;
    return true;
  });

  // Filtered slots for selected date
  const activeDay = availableDays.find((d) => d.date === selectedDate);
  const rawSlots = activeDay?.slots || [];
  const filteredSlots = rawSlots.filter((slot) => {
    if (timeOfDayFilter === "all") return true;
    const hour = parseTehranHour(slot.start_time_tehran || slot.start_tehran);
    if (timeOfDayFilter === "morning") return hour < 12;
    if (timeOfDayFilter === "afternoon") return hour >= 12 && hour < 18;
    if (timeOfDayFilter === "evening") return hour >= 18;
    return true;
  });

  return (
    <PublicShell locale="fa" currentPath="/teachers">
      <main className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs} aria-label="مسیر صفحه">
          <Link href="/" className={styles.breadcrumbLink}>خانه</Link>
          <span aria-hidden="true">/</span>
          <Link href="/teachers" className={styles.breadcrumbLink}>مدرس‌ها</Link>
          <span aria-hidden="true">/</span>
          <span>{profile.name}</span>
        </nav>

        {/* 1. HERO SPOTLIGHT CARD */}
        <section className={styles.heroSpotlight} aria-labelledby="teacher-name">
          <div className={styles.heroMainInfo}>
            <div className={styles.heroHeaderTop}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarWrapper}>
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                {profile.is_teacher_verified && (
                  <span className={styles.verifiedCheckBadge} title="مدرس رسمی و تاییدشده ایندورا">
                    ✓
                  </span>
                )}
              </div>

              <div className={styles.heroTitles}>
                <div className={styles.teacherNameRow}>
                  <h1 id="teacher-name" className={styles.teacherName}>
                    {profile.name}
                  </h1>
                  {profile.is_teacher_verified && (
                    <span className={styles.officialBadge}>
                      ✓ مدرس تاییدشده ایندورا
                    </span>
                  )}
                </div>
                <p className={styles.headline}>
                  {profile.headline || "مدرس تخصصی زبان انگلیسی با متدولوژی مدرن"}
                </p>
                <div className={styles.heroActionsRow}>
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`${styles.actionButton} ${isBookmarked ? styles.actionButtonActive : ""}`}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                  >
                    <span>{isBookmarked ? "♥" : "♡"}</span>
                    <span>{isBookmarked ? "نشان شده" : "نشان کردن"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className={styles.actionButton}
                    aria-label="اشتراک‌گذاری پروفایل مدرس"
                  >
                    <span>🔗</span>
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics Glass Row */}
            <div className={styles.metricsRow}>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon} aria-hidden="true">⭐</span>
                <div className={styles.metricContent}>
                  <span className={styles.metricValue}>
                    {toPersianDigits(proof.average_rating.toFixed(2))} از ۵
                  </span>
                  <span className={styles.metricLabel}>
                    ({toPersianDigits(proof.review_count)} نظر تاییدشده)
                  </span>
                </div>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricIcon} aria-hidden="true">👥</span>
                <div className={styles.metricContent}>
                  <span className={styles.metricValue}>
                    {toPersianDigits(proof.completed_sessions)} جلسه
                  </span>
                  <span className={styles.metricLabel}>برگزارشده در سامانه</span>
                </div>
              </div>

              {profile.experience_years ? (
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon} aria-hidden="true">🎓</span>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>
                      {toPersianDigits(profile.experience_years)} سال
                    </span>
                    <span className={styles.metricLabel}>سابقه تدریس تخصصی</span>
                  </div>
                </div>
              ) : null}

              {profile.response_time_minutes ? (
                <div className={styles.metricCard}>
                  <span className={styles.metricIcon} aria-hidden="true">⚡</span>
                  <div className={styles.metricContent}>
                    <span className={styles.metricValue}>
                      زیر {toPersianDigits(profile.response_time_minutes)} دقیقه
                    </span>
                    <span className={styles.metricLabel}>میانگین پاسخگویی</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Hero Media Video Showcase */}
          <div className={styles.heroMediaShowcase}>
            <div className={styles.videoSpotlightWrapper}>
              {isPlayingVideo ? (
                <>
                  {profile.video_intro_url?.startsWith("data:video") ||
                  profile.video_intro_url?.startsWith("blob:") ||
                  profile.video_intro_url?.endsWith(".mp4") ||
                  profile.video_intro_url?.endsWith(".webm") ? (
                    <video
                      src={profile.video_intro_url}
                      controls
                      autoPlay
                      className={styles.videoIframe}
                    />
                  ) : (
                    <iframe
                      src={profile.video_intro_url || "https://www.aparat.com/video/video/embed/videohash/a1b2c3/vt/frame"}
                      className={styles.videoIframe}
                      title="ویدیو معرفی مدرس"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  <button
                    type="button"
                    className={styles.videoModalClose}
                    onClick={() => setIsPlayingVideo(false)}
                    title="بستن ویدیو"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.videoThumbnailCover}
                  onClick={() => setIsPlayingVideo(true)}
                  aria-label="پخش ویدیوی معرفی استاد"
                >
                  <div className={styles.playPulseBtn} aria-hidden="true">
                    ▶
                  </div>
                  <span className={styles.videoOverlayLabel}>
                    مشاهده ویدیوی معرفی و لهجه استاد (۱ دقیقه)
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 2-COLUMN LAYOUT */}
        <div className={styles.layout}>
          {/* MAIN COLUMN */}
          <div className={styles.mainColumn}>
            {/* 1. About / Bio */}
            {profile.bio && (
              <section className={styles.sectionCard} aria-labelledby="bio-heading">
                <div className={styles.sectionHeader}>
                  <h2 id="bio-heading" className={styles.sectionTitle}>
                    <span className={styles.titleIcon} aria-hidden="true">📖</span>
                    درباره و فلسفه تدریس
                  </h2>
                  <span className={styles.sectionSubtitle}>
                    {profile.languages?.length ? `زبان‌های تدریس: ${profile.languages.join("، ")}` : "زبان انگلیسی"}
                  </span>
                </div>
                <p className={styles.sectionBody}>{profile.bio}</p>
              </section>
            )}

            {/* 2. Teaching Methodology (Step by Step) */}
            <section className={styles.sectionCard} aria-labelledby="method-heading">
              <div className={styles.sectionHeader}>
                <h2 id="method-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">🚀</span>
                  روش و سبک تدریس استاد
                </h2>
                <span className={styles.sectionSubtitle}>نقشه راه پیشرفت قدم‌به‌قدم شما در کلاس‌ها</span>
              </div>

              <div className={styles.methodologyTimeline}>
                {methodologyList.map((step) => (
                  <div key={step.step_number} className={styles.methodologyCard}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepBadge}>{toPersianDigits(step.step_number)}</span>
                      {step.icon && <span className={styles.stepIcon}>{step.icon}</span>}
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                    </div>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Course Materials & Tools */}
            <section className={styles.sectionCard} aria-labelledby="materials-heading">
              <div className={styles.sectionHeader}>
                <h2 id="materials-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">📚</span>
                  منابع، کتاب‌ها و متریال‌های آموزشی
                </h2>
                <span className={styles.sectionSubtitle}>محتوای اختصاصی تدریس شده در جلسات</span>
              </div>

              <div className={styles.materialsGrid}>
                {courseMaterialsList.map((mat, idx) => (
                  <div key={idx} className={styles.materialCard}>
                    <span className={styles.materialCategory}>{mat.category}</span>
                    <h3 className={styles.materialTitle}>{mat.title}</h3>
                    {mat.description && <p className={styles.materialDesc}>{mat.description}</p>}
                    {mat.badge && <span className={styles.materialBadge}>{mat.badge}</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Specialties & Certifications */}
            <section className={styles.sectionCard} aria-labelledby="skills-heading">
              <div className={styles.sectionHeader}>
                <h2 id="skills-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">🎖</span>
                  تخصص‌ها، مدارک بین‌المللی و تحصیلات
                </h2>
              </div>

              {profile.education && (
                <p className={styles.sectionBody} style={{ marginBlockEnd: "8px" }}>
                  <strong>تحصیلات آکادمیک:</strong> {profile.education}
                </p>
              )}

              {profile.certifications && profile.certifications.length > 0 && (
                <div style={{ marginBlockEnd: "16px" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: "bold", color: "#64748b", display: "block", marginBlockEnd: "8px" }}>
                    گواهینامه‌های رسمی تدریس:
                  </span>
                  <div className={styles.tagsList}>
                    {profile.certifications.map((cert, idx) => (
                      <span key={idx} className={styles.certBadge}>
                        🎖 {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.specialties && profile.specialties.length > 0 && (
                <div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: "bold", color: "#64748b", display: "block", marginBlockEnd: "8px" }}>
                    حوزه‌های تخصصی تدریس:
                  </span>
                  <div className={styles.tagsList}>
                    {profile.specialties.map((item, idx) => (
                      <span key={idx} className={styles.tagPill}>
                        ✨ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 5. Interactive Goal & Session Estimator */}
            <section className={styles.sectionCard} aria-labelledby="goal-heading">
              <div className={styles.sectionHeader}>
                <h2 id="goal-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">⏱</span>
                  تخمین‌گر هوشمند هدف و زمان‌بندی یادگیری
                </h2>
                <span className={styles.sectionSubtitle}>برآورد جلسات مورد نیاز بر اساس سطح شما</span>
              </div>

              <div className={styles.goalEstimatorCard}>
                <div className={styles.goalEstimatorHeader}>
                  <span className={styles.goalIcon} aria-hidden="true">💡</span>
                  <div>
                    <h3 className={styles.goalTitle}>چند جلسه برای رسیدن به هدفتان نیاز دارید؟</h3>
                    <p className={styles.goalDesc}>
                      سطح فعلی و مقصد یادگیری خود را مشخص کنید تا برنامه زمان‌بندی دقیق به شما پیشنهاد شود.
                    </p>
                  </div>
                </div>

                <div className={styles.goalInputsGrid}>
                  <div className={styles.goalSelectGroup}>
                    <label htmlFor="goal-current" className={styles.goalLabel}>سطح فعلی من:</label>
                    <select
                      id="goal-current"
                      className={styles.goalSelect}
                      value={goalCurrentLevel}
                      onChange={(e) => setGoalCurrentLevel(e.target.value)}
                    >
                      <option value="A1">مبتدی کامل (A1 - تازه شروع کردم)</option>
                      <option value="A2">مقدماتی (A2 - لغات اولیه را می‌دانم)</option>
                      <option value="B1">متوسط پایین (B1 - دست‌وپاشکسته صحبت می‌کنم)</option>
                      <option value="B2">متوسط رو به بالا (B2 - مکالمه نسبتاً روان)</option>
                    </select>
                  </div>

                  <div className={styles.goalSelectGroup}>
                    <label htmlFor="goal-target" className={styles.goalLabel}>هدف آموزشی من:</label>
                    <select
                      id="goal-target"
                      className={styles.goalSelect}
                      value={goalTargetLevel}
                      onChange={(e) => setGoalTargetLevel(e.target.value)}
                    >
                      <option value="B1">رسیدن به مکالمه روزمره (B1)</option>
                      <option value="B2">مکالمه روان و مصاحبه کاری (B2)</option>
                      <option value="C1">تسلط کامل و سخنرانی شغلی (C1)</option>
                      <option value="IELTS 7+">کسب نمره آیلتس ۷+ یا تافل</option>
                    </select>
                  </div>
                </div>

                <div className={styles.goalSelectGroup}>
                  <label htmlFor="goal-intensity" className={styles.goalLabel}>شدت جلسات هفتگی:</label>
                  <select
                    id="goal-intensity"
                    className={styles.goalSelect}
                    value={goalIntensity}
                    onChange={(e) => setGoalIntensity(Number(e.target.value))}
                  >
                    <option value={2}>۲ جلسه در هفته (پیشنهاد استاندارد)</option>
                    <option value={3}>۳ جلسه در هفته (فشرده و پرسرعت)</option>
                  </select>
                </div>

                <div className={styles.goalResultBanner}>
                  <div className={styles.goalResultTitle}>
                    <span>برآورد تخمینی: </span>
                    <strong>حدود {toPersianDigits(estimatedSessions)} جلسه آموزشی (~{toPersianDigits(estimatedWeeks)} هفته)</strong>
                  </div>
                  <span className={styles.goalResultBadge}>
                    پیشنهاد: بسته ۱۰ جلسه‌ای با ۲۰٪ تخفیف
                  </span>
                </div>
              </div>
            </section>

            {/* 6. FAQ Accordion */}
            <section className={styles.sectionCard} aria-labelledby="faq-heading">
              <div className={styles.sectionHeader}>
                <h2 id="faq-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">❓</span>
                  پرسش‌های متداول دانش‌آموزان
                </h2>
                <span className={styles.sectionSubtitle}>پاسخ به سوالات متداول درباره کلاس‌های این استاد</span>
              </div>

              <div className={styles.faqList}>
                {faqList.map((faq, idx) => {
                  const isOpen = openFaqIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ""}`}
                    >
                      <button
                        type="button"
                        className={styles.faqQuestionBtn}
                        onClick={() => handleToggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className={styles.faqIcon} aria-hidden="true">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && <p className={styles.faqAnswer}>{faq.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 7. Social Proof & Verified Reviews */}
            <section className={styles.sectionCard} aria-labelledby="reviews-heading">
              <div className={styles.sectionHeader}>
                <h2 id="reviews-heading" className={styles.sectionTitle}>
                  <span className={styles.titleIcon} aria-hidden="true">💬</span>
                  نظرات و ارزیابی زبان‌آموزان ({toPersianDigits(proof.review_count)})
                </h2>
                <span className={styles.sectionSubtitle}>تمام نظرات پس از اتمام جلسه واقعی ثبت شده‌اند</span>
              </div>

              {/* Keyword Highlight Chips */}
              <div className={styles.highlightTagsRow}>
                <span className={styles.highlightTagTitle}>برچسب‌های پرتکرار:</span>
                {highlightTags.map((tag, idx) => {
                  const isSelected = activeKeyword === tag;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={styles.highlightTagChip}
                      style={{
                        backgroundColor: isSelected ? "#15803d" : undefined,
                        color: isSelected ? "#ffffff" : undefined,
                        cursor: "pointer",
                      }}
                      onClick={() => setActiveKeyword(isSelected ? null : tag)}
                    >
                      <span>✓</span>
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Social Proof Overview Breakdown */}
              <div className={styles.socialProofGrid}>
                <div className={styles.ratingBigBox}>
                  <span className={styles.ratingBigNumber}>
                    {toPersianDigits(proof.average_rating.toFixed(2))}
                  </span>
                  <div className={styles.ratingStarsRow} aria-hidden="true">
                    ★★★★★
                  </div>
                  <span className={styles.ratingCountText}>
                    بر اساس {toPersianDigits(proof.review_count)} جلسه برگزارشده
                  </span>
                </div>

                <div className={styles.dimensionRatings}>
                  <div className={styles.dimensionRow}>
                    <div className={styles.dimensionHeader}>
                      <span>کیفیت و تسلط در تدریس</span>
                      <span>{toPersianDigits((proof.dimension_averages?.teaching_quality || 5.0).toFixed(1))} از ۵</span>
                    </div>
                    <div className={styles.dimensionTrack}>
                      <div
                        className={styles.dimensionFill}
                        style={{
                          inlineSize: `${((proof.dimension_averages?.teaching_quality || 5.0) / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.dimensionRow}>
                    <div className={styles.dimensionHeader}>
                      <span>وقت‌شناسی و انضباط کلاس</span>
                      <span>{toPersianDigits((proof.dimension_averages?.punctuality || 5.0).toFixed(1))} از ۵</span>
                    </div>
                    <div className={styles.dimensionTrack}>
                      <div
                        className={styles.dimensionFill}
                        style={{
                          inlineSize: `${((proof.dimension_averages?.punctuality || 5.0) / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.dimensionRow}>
                    <div className={styles.dimensionHeader}>
                      <span>تعامل و برقراری ارتباط مؤثر</span>
                      <span>{toPersianDigits((proof.dimension_averages?.communication || 5.0).toFixed(1))} از ۵</span>
                    </div>
                    <div className={styles.dimensionTrack}>
                      <div
                        className={styles.dimensionFill}
                        style={{
                          inlineSize: `${((proof.dimension_averages?.communication || 5.0) / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Filter Bar */}
              <div className={styles.reviewsFilterBar}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${reviewFilter === "all" ? styles.filterBtnActive : ""}`}
                  onClick={() => setReviewFilter("all")}
                >
                  همه نظرات ({toPersianDigits(reviews.length)})
                </button>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${reviewFilter === "5star" ? styles.filterBtnActive : ""}`}
                  onClick={() => setReviewFilter("5star")}
                >
                  ★ فقط ۵ ستاره
                </button>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${reviewFilter === "replied" ? styles.filterBtnActive : ""}`}
                  onClick={() => setReviewFilter("replied")}
                >
                  دارای پاسخ مدرس
                </button>
                {activeKeyword && (
                  <button
                    type="button"
                    className={styles.filterBtn}
                    style={{ color: "#ea580c" }}
                    onClick={() => setActiveKeyword(null)}
                  >
                    حذف فیلتر «{activeKeyword}» ✕
                  </button>
                )}
              </div>

              {/* Reviews List */}
              <div className={styles.reviewsList}>
                {filteredReviews.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", paddingBlock: "16px" }}>
                    نظری با فیلتر انتخابی شما یافت نشد.
                  </p>
                ) : (
                  filteredReviews.map((rev) => (
                    <article key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerMeta}>
                          <div className={styles.reviewerAvatar}>
                            {(rev.learner_display_name || "ز").charAt(0)}
                          </div>
                          <div className={styles.reviewerNameBlock}>
                            <span className={styles.reviewerName}>
                              {rev.learner_display_name || "زبان‌آموز ایندورا"}
                            </span>
                            <span className={styles.sessionVerifiedTag}>
                              ✓ جلسه تاییدشده
                            </span>
                          </div>
                        </div>
                        <span className={styles.reviewDate}>
                          {formatTehranDateTime(rev.created_at)}
                        </span>
                      </div>

                      <div className={styles.reviewRatingPills}>
                        <span className={styles.scorePill}>
                          ★ کلی: {toPersianDigits(rev.overall_rating)} از ۵
                        </span>
                        <span className={styles.scorePill}>
                          تسلط: {toPersianDigits(rev.teaching_quality)}
                        </span>
                        <span className={styles.scorePill}>
                          نظم: {toPersianDigits(rev.punctuality)}
                        </span>
                        <span className={styles.scorePill}>
                          تعامل: {toPersianDigits(rev.communication)}
                        </span>
                      </div>

                      <p className={styles.reviewComment}>{rev.comment}</p>

                      {rev.teacher_reply && (
                        <div className={styles.replyCard}>
                          <span className={styles.replyTitle}>
                            پاسخ رسمی استاد ({profile.name}):
                          </span>
                          <p className={styles.replyContent}>{rev.teacher_reply}</p>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="tertiary"
                        size="compact"
                        className={styles.flagButton}
                        onClick={() => handleFlagReview(rev.id)}
                      >
                        گزارش این نظر
                      </Button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* STICKY SIDEBAR (SMART BOOKING CARD) */}
          <aside className={styles.sidebar} id="booking-section">
            <div className={styles.bookingCard}>
              {/* Tier Selector */}
              <div className={styles.tierSelector}>
                <button
                  type="button"
                  className={`${styles.tierBtn} ${selectedTier === "standard" ? styles.tierBtnActive : ""}`}
                  onClick={() => setSelectedTier("standard")}
                >
                  <span className={styles.tierTitle}>جلسه استاندارد</span>
                  <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>۴۵ دقیقه کامل</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tierBtn} ${selectedTier === "trial" ? styles.tierBtnActive : ""}`}
                  onClick={() => setSelectedTier("trial")}
                >
                  <span className={styles.tierTitle}>جلسه آزمایشی</span>
                  <span className={styles.tierBadge}>۵۰٪ تخفیف آشنایی</span>
                </button>
              </div>

              {/* Rate Header Display */}
              <div className={styles.rateDisplayBox}>
                <span className={styles.rateLabel}>
                  {selectedTier === "trial" ? "شهریه جلسه آزمایشی (۳۰ دقیقه):" : "شهریه هر ساعت جلسه:"}
                </span>
                <div className={styles.rateValueRow}>
                  {selectedTier === "trial" && (
                    <span className={styles.rateOriginal}>
                      {formatToman(standardHourlyRate)}
                    </span>
                  )}
                  <span className={styles.rateValue}>
                    {formatToman(currentSingleSessionPrice)}
                  </span>
                </div>
              </div>

              {/* Package Selector (Discounts for 5 or 10 sessions) */}
              {selectedTier === "standard" && (
                <div className={styles.packageSelector}>
                  <span className={styles.packageLabel}>صرفه‌جویی با پکیج جلسات:</span>
                  <div className={styles.packageChips}>
                    <button
                      type="button"
                      className={`${styles.packageChip} ${packageSessions === 1 ? styles.packageChipActive : ""}`}
                      onClick={() => setPackageSessions(1)}
                    >
                      <span className={styles.packageChipTitle}>تک‌جلسه</span>
                      <span className={styles.packageChipDiscount}>بدون تخفیف</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.packageChip} ${packageSessions === 5 ? styles.packageChipActive : ""}`}
                      onClick={() => setPackageSessions(5)}
                    >
                      <span className={styles.packageChipTitle}>۵ جلسه</span>
                      <span className={styles.packageChipDiscount}>۱۰٪ تخفیف</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.packageChip} ${packageSessions === 10 ? styles.packageChipActive : ""}`}
                      onClick={() => setPackageSessions(10)}
                    >
                      <span className={styles.packageChipTitle}>۱۰ جلسه</span>
                      <span className={styles.packageChipDiscount}>۲۰٪ تخفیف ویژه</span>
                    </button>
                  </div>
                  {packageDiscountPercent > 0 && (
                    <div style={{ fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", padding: "6px", borderRadius: "6px" }}>
                      ✓ مبلغ کل: <strong>{formatToman(totalPackagePrice)}</strong> (با {toPersianDigits(packageDiscountPercent)}٪ تخفیف)
                    </div>
                  )}
                </div>
              )}

              {/* Slot Booking Section */}
              <div className={styles.slotSection}>
                <div className={styles.slotSectionHeader}>
                  <span className={styles.slotSectionTitle}>
                    <span aria-hidden="true">📅</span>
                    انتخاب روز و ساعت جلسه
                  </span>
                </div>

                {availableDays.length > 0 ? (
                  <>
                    {/* Horizontal Date Picker */}
                    <div className={styles.datePickerScroll} role="tablist" aria-label="انتخاب تاریخ جلسه">
                      {availableDays.map((d) => (
                        <button
                          key={d.date}
                          type="button"
                          className={`${styles.dateChip} ${selectedDate === d.date ? styles.dateChipActive : ""}`}
                          onClick={() => {
                            setSelectedDate(d.date);
                            setSelectedSlot(null);
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>{d.day_name || d.day_name_fa}</span>
                          <span>{d.jalali_date || d.date.slice(5)}</span>
                        </button>
                      ))}
                    </div>

                    {/* Time of Day Filter Chips */}
                    <div className={styles.timeOfDayRow}>
                      <button
                        type="button"
                        className={`${styles.todChip} ${timeOfDayFilter === "all" ? styles.todChipActive : ""}`}
                        onClick={() => setTimeOfDayFilter("all")}
                      >
                        همه زمان‌ها
                      </button>
                      <button
                        type="button"
                        className={`${styles.todChip} ${timeOfDayFilter === "morning" ? styles.todChipActive : ""}`}
                        onClick={() => setTimeOfDayFilter("morning")}
                      >
                        🌅 صبح
                      </button>
                      <button
                        type="button"
                        className={`${styles.todChip} ${timeOfDayFilter === "afternoon" ? styles.todChipActive : ""}`}
                        onClick={() => setTimeOfDayFilter("afternoon")}
                      >
                        ☀️ بعد از ظهر
                      </button>
                      <button
                        type="button"
                        className={`${styles.todChip} ${timeOfDayFilter === "evening" ? styles.todChipActive : ""}`}
                        onClick={() => setTimeOfDayFilter("evening")}
                      >
                        🌙 عصر و شب
                      </button>
                    </div>

                    {/* Time Slots Grid */}
                    {filteredSlots.length === 0 ? (
                      <p className={styles.emptySlotsText}>
                        اسلاتی در این بازه زمانی موجود نیست. زمان دیگری را انتخاب فرمایید.
                      </p>
                    ) : (
                      <div className={styles.slotsGrid}>
                        {filteredSlots.map((s, idx) => {
                          const isSelected = selectedSlot?.start_utc === s.start_utc;
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`${styles.slotChip} ${isSelected ? styles.slotChipSelected : ""}`}
                              onClick={() => setSelectedSlot(s)}
                            >
                              {s.start_time_tehran || s.start_tehran} - {s.end_time_tehran || s.end_tehran}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Selected Slot Banner */}
                    {selectedSlot && (
                      <div className={styles.selectedSlotBanner}>
                        <strong>✓ زمان انتخابی شما:</strong>
                        <span>
                          روز {selectedSlot.day_name_fa || "انتخابی"} ساعت {selectedSlot.start_time_tehran || selectedSlot.start_tehran}
                          {selectedTier === "trial" ? " (جلسه آزمایشی ۳۰ دقیقه‌ای)" : " (جلسه استاندارد ۴۵ دقیقه‌ای)"}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className={styles.emptySlotsText}>
                    در حال حاضر زمان‌بندی آنلاینی برای این مدرس تنظیم نشده است. می‌توانید درخواست جلسه خصوصی ثبت نمایید.
                  </p>
                )}
              </div>

              {/* CTA Booking Button */}
              <Link
                href={
                  selectedSlot
                    ? `/learn/now?teacher_id=${teacherId}&start_utc=${encodeURIComponent(selectedSlot.start_utc)}&duration=${selectedTier === "trial" ? 30 : selectedSlot.duration_minutes}&tier=${selectedTier}&package=${packageSessions}`
                    : `/learn/now?teacher_id=${teacherId}&tier=${selectedTier}&package=${packageSessions}`
                }
                className={styles.bookButton}
              >
                {selectedSlot
                  ? selectedTier === "trial"
                    ? "رزرو جلسه آزمایشی (۵۰٪ تخفیف)"
                    : `رزرو این زمان (${formatToman(totalPackagePrice)})`
                  : "رزرو و هماهنگی جلسه"}
              </Link>

              {/* Trust Guarantees */}
              <div className={styles.guaranteeList}>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">🛡</span>
                  <span>پرداخت امن و تسویه پس از رضایت کامل شما از جلسه</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">🔄</span>
                  <span>امکان لغو یا تغییر رایگان زمان تا ۱۲ ساعت قبل جلسه</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">💬</span>
                  <span>پشتیبانی و همراهی مستقیم تیم آموزش ایندورا</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* STICKY BOTTOM MOBILE ACTION BAR */}
        <aside className={styles.mobileStickyBar} aria-label="رزرو سریع در موبایل">
          <div className={styles.mobileBarInfo}>
            <span className={styles.mobileBarPrice}>
              {formatToman(currentSingleSessionPrice)}
            </span>
            <span className={styles.mobileBarSub}>
              {selectedTier === "trial" ? "جلسه آزمایشی ۳۰ دقیقه‌ای" : "هر ساعت جلسه استاندارد"}
            </span>
          </div>
          <a
            href="#booking-section"
            className={styles.mobileBarBtn}
          >
            انتخاب زمان و رزرو
          </a>
        </aside>
      </main>
    </PublicShell>
  );
}
