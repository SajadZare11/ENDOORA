"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./learn.module.css";

export interface HubDestination {
  title: string;
  desc: string;
  href: string;
  icon: string;
  action: string;
  badge?: string;
}

export interface HubCategory {
  id: "all" | "courses-paths" | "skills-practice" | "community-support";
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  items: HubDestination[];
}

const CATEGORIES: HubCategory[] = [
  {
    id: "courses-paths",
    title: "دوره‌ها و مسیرهای آموزشی",
    titleEn: "Courses & Curriculums",
    description: "برنامه‌ها و دوره‌های ساختاریافته از تعیین سطح تا تسلط کامل، ویژه زبان‌آموزان و داوطلبان آزمون‌ها",
    icon: "🎓",
    items: [
      {
        title: "دوره‌های آموزشی تعاملی",
        desc: "دوره‌های ویدئویی ساختاریافته از سطح A2 تا C1، کنکور سراسری، و آمادگی آیلتس همراه با آزمون‌های سنجشی.",
        href: "/courses",
        icon: "🎓",
        action: "ورود به دوره‌ها",
        badge: "ساختاریافته",
      },
      {
        title: "مسیر رشد شخصی (Learning Path)",
        desc: "برنامه آموزشی منطبق بر نتایج آزمون تعیین سطح شما و نقاط ضعف شناسایی‌شده در همزاد یادگیرنده.",
        href: "/path",
        icon: "🗺️",
        action: "مشاهده مسیر من",
        badge: "شخصی‌سازی‌شده",
      },
      {
        title: "یادگیری سریع با مدرس (Learn Now)",
        desc: "ثبت درخواست جلسه متمرکز رفع اشکال، اسپیکینگ یا رایتینگ و دریافت پیشنهاد از مدرسین تأییدشده.",
        href: "/learn/now",
        icon: "⚡",
        action: "شروع Learn Now",
        badge: "پاسخ سریع",
      },
      {
        title: "کتب دبیرستان و کنکور سراسری",
        desc: "تحلیل درس‌به‌درس کتاب‌های Vision 1, 2, 3 و تست‌های گرامر و واژگان کنکور سراسری با پاسخ تشریحی.",
        href: "/skills/school",
        icon: "📚",
        action: "ورود به بخش دبیرستان",
        badge: "محتوای درسی",
      },
    ],
  },
  {
    id: "skills-practice",
    title: "مهارت‌ها و تمرین هوشمند",
    titleEn: "Skills & Smart Practice",
    description: "تمرین‌های هدفمند برای تقویت ۶ مهارت اصلی، شبیه‌سازی مکالمه با هوش مصنوعی و تثبیت حافظه",
    icon: "🎯",
    items: [
      {
        title: "مرکز مهارت‌های شش‌گانه",
        desc: "پایگاه مقالات و تمرین‌های تخصصی لیسنینگ، ریدینگ، رایتینگ، اسپیکینگ، گرامر تحلیلی و واژگان.",
        href: "/skills",
        icon: "🎯",
        action: "مشاهده مهارت‌ها",
        badge: "۶ مهارت اصلی",
      },
      {
        title: "لابراتوار مکالمه و هوش مصنوعی",
        desc: "نقش‌آفرینی صوتی و متنی در ۱۰ سناریوی واقعی زندگی و کار، همراه با ارزیابی بازخوردی بدون سرزنش.",
        href: "/roleplay",
        icon: "🎙️",
        action: "ورود به نقش‌آفرینی",
        badge: "شبیه‌ساز صوتی",
      },
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "مرور کلمات فعال و تثبیت در حافظه بلندمدت با الگوریتم تکرار فاصله‌دار SM-2 بدون فراموشی.",
        href: "/vocabulary",
        icon: "💡",
        action: "شروع مرور واژگان",
        badge: "تکرار فاصله‌دار",
      },
      {
        title: "فرهنگ و ارتباطات بین‌المللی",
        desc: "یادگیری آداب گپ‌وگفت‌های خودمانی (Small Talk)، نکات بین‌فرهنگی و تعارف در ارتباطات انگلیسی.",
        href: "/skills/culture",
        icon: "🌐",
        action: "آشنایی با فرهنگ زبان",
        badge: "کاربردی و واقعی",
      },
    ],
  },
  {
    id: "community-support",
    title: "همراهی، دستاوردها و پشتیبانی",
    titleEn: "Community, Progress & Support",
    description: "ارتباط با سایر زبان‌آموزان و اساتید، پیگیری دستاوردها و دریافت راهنمایی مستقیم",
    icon: "👥",
    items: [
      {
        title: "جامعه یادگیری و هم‌افزایی",
        desc: "تبادل تجربیات واقعی با زبان‌آموزان و اساتید، طرح درس‌های معتبر، پرسش و پاسخ‌های زبانی در فضایی امن و منضبط.",
        href: "/community",
        icon: "👥",
        action: "ورود به جامعه ایندورا",
        badge: "هم‌آموزی",
      },
      {
        title: "افتخارات و نشان‌ها",
        desc: "مشاهده نشان‌های به‌دست‌آمده، مأموریت‌های ۷ روزه، کلوپ‌های هم‌آموزی و جدول رده‌بندی امن.",
        href: "/achievements",
        icon: "🏆",
        action: "مشاهده دستاوردها",
        badge: "انگیزش و رشد",
      },
      {
        title: "جستجوی یکپارچه منابع",
        desc: "جستجوی سریع در تمام دوره‌ها، منابع، اساتید، طرح درس‌ها و پرسش‌های متداول با نرمال‌سازی فارسی و انگلیسی.",
        href: "/search",
        icon: "🔍",
        action: "جستجو در پلتفرم",
        badge: "جستجوی سریع",
      },
      {
        title: "مرکز پشتیبانی و سوالات متداول",
        desc: "پاسخ سریع به پرسش‌ها، راهنمای امکانات، ثبت تیکت هوشمند و ارتباط مستقیم با کارشناسان ایندورا.",
        href: "/support",
        icon: "🎧",
        action: "ورود به پشتیبانی",
        badge: "پاسخگویی سریع",
      },
    ],
  },
];

type CategoryFilter = "all" | "courses-paths" | "skills-practice" | "community-support";

export function LearnHubView() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const visibleCategories =
    activeCategory === "all"
      ? CATEGORIES
      : CATEGORIES.filter((cat) => cat.id === activeCategory);

  return (
    <div className={styles.hubWrapper}>
      {/* Category Filter Tabs */}
      <nav className={styles.filterBar} aria-label="فیلتر دسته‌بندی‌های یادگیری">
        <button
          type="button"
          className={`${styles.filterTab} ${activeCategory === "all" ? styles.filterTabActive : ""}`}
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
        >
          <span className={styles.filterTabLabel}>همه بخش‌ها</span>
          <span className={styles.filterTabBadge}>۱۲</span>
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.filterTab} ${activeCategory === cat.id ? styles.filterTabActive : ""}`}
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
          >
            <span aria-hidden="true" className={styles.filterTabIcon}>{cat.icon}</span>
            <span className={styles.filterTabLabel}>{cat.title}</span>
            <span className={styles.filterTabBadge}>{cat.items.length}</span>
          </button>
        ))}
      </nav>

      {/* Categories Content */}
      <div className={styles.categoriesContainer}>
        {visibleCategories.map((category) => (
          <section key={category.id} className={styles.categorySection} aria-labelledby={`cat-title-${category.id}`}>
            <header className={styles.categoryHeader}>
              <div className={styles.categoryHeaderTitleRow}>
                <span className={styles.categoryIconBadge} aria-hidden="true">
                  {category.icon}
                </span>
                <div>
                  <h2 id={`cat-title-${category.id}`} className={styles.categoryTitle}>
                    {category.title}
                  </h2>
                  <p className={styles.categoryDesc}>{category.description}</p>
                </div>
              </div>
              <span className={styles.categoryCountBadge}>
                {category.items.length} بخش
              </span>
            </header>

            <div className={styles.hubGrid}>
              {category.items.map((item, idx) => (
                <Link key={idx} href={item.href} className={styles.hubCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.cardIcon} aria-hidden="true">{item.icon}</span>
                      {item.badge && (
                        <span className={styles.cardBadge}>{item.badge}</span>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDesc}>{item.desc}</p>
                  </div>
                  <div className={styles.cardAction}>
                    <span>{item.action}</span>
                    <span aria-hidden="true" className={styles.arrowIcon}>←</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
