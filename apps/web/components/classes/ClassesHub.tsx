"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./classes.module.css";
import {
  LiveClassCohort,
  CohortCategory,
  CohortFormat,
  getLiveCohorts,
} from "../../lib/classes-storage";
import { EnrollmentModal } from "./EnrollmentModal";
import { EnrolledCohortsBanner } from "./EnrolledCohortsBanner";

const CATEGORIES: { id: "all" | CohortCategory; label: string }[] = [
  { id: "all", label: "همه دوره‌ها" },
  { id: "ielts", label: "آمادگی آیلتس" },
  { id: "fluency", label: "مکالمه و روانی کلام" },
  { id: "starter", label: "پایه‌ای و استارتر" },
  { id: "business", label: "زبان تجاری و بیزینس" },
  { id: "highschool", label: "امتحان نهایی دوازدهم" },
  { id: "phonetics", label: "تلفظ و فونتیک" },
  { id: "debate", label: "مناظره و تفکر نقادانه" },
];

const HERO_FEATURES = [
  {
    title: "اتاق اختصاصی WebRTC",
    sub: "وایت‌بورد زنده و تعاملی",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
  },
  {
    title: "تعیین سطح پیش‌نیاز",
    sub: "تضمین هم‌سطحی تمام هم‌کلاسی‌ها",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"></path>
        <path d="M18 20V4"></path>
        <path d="M6 20v-4"></path>
      </svg>
    ),
  },
  {
    title: "تحلیل خطاهای صوتی",
    sub: "انتقال خودکار به لایتنر هوشمند",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
  },
  {
    title: "تضمین رضایت آموزشی",
    sub: "امکان لغو تا جلسه اول و عودت وجه",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
  },
];

export function ClassesHub() {
  const [mounted, setMounted] = useState(false);
  const [cohorts, setCohorts] = useState<LiveClassCohort[]>(getLiveCohorts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<"all" | CohortFormat>("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CohortCategory>("all");
  const [activeModalCohort, setActiveModalCohort] = useState<LiveClassCohort | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    setMounted(true);
    setCohorts(getLiveCohorts());
  }, [refreshCounter]);

  const filteredCohorts = useMemo(() => {
    return cohorts.filter((cohort) => {
      // Format Filter
      if (selectedFormat !== "all" && cohort.format !== selectedFormat) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== "all" && cohort.category !== selectedCategory) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inTitleFa = cohort.titleFa.toLowerCase().includes(query);
        const inTitleEn = cohort.titleEn.toLowerCase().includes(query);
        const inDesc = cohort.descriptionFa.toLowerCase().includes(query);
        const inTeacher = cohort.teacher.nameFa.toLowerCase().includes(query);
        const inCategory = cohort.categoryLabelFa.toLowerCase().includes(query);
        if (!inTitleFa && !inTitleEn && !inDesc && !inTeacher && !inCategory) {
          return false;
        }
      }

      return true;
    });
  }, [cohorts, selectedFormat, selectedCategory, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Active Enrolled Cohorts Banner */}
      <EnrolledCohortsBanner refreshTrigger={refreshCounter} />

      {/* Hero Section (Light, Academic & Sleek) */}
      <header className={styles.heroSection} aria-labelledby="classes-hero-heading">
        <div className={styles.heroAccentBar} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadgePrimary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              استودیوی زنده تعاملی ایندورا
            </span>
            <span className={styles.heroBadgeSecondary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              کوهورت‌های کم‌جمعیت (حداکثر ۴ نفر)
            </span>
          </div>

          <h1 id="classes-hero-heading" className={styles.heroTitle}>
            کلاس‌های آنلاین زنده و <span className={styles.titleAccent}>گروه‌های فشرده یادگیری</span>
          </h1>

          <p className={styles.heroSubtitle}>
            تجربه کلاس‌های تعاملی با برترین اساتید زبان، وایت‌بورد چندکاربره بلادرنگ، پادکست اختصاصی خلاصه هر جلسه، و استخراج هوشمند خطاهای کلامی شما برای مرور روزانه.
          </p>

          {/* 4-Item Quick Stats / Features Bar */}
          <div className={styles.heroFeaturesGrid}>
            {HERO_FEATURES.map((item, idx) => (
              <div key={idx} className={styles.heroFeatureCard}>
                <div className={styles.featureIconBox}>{item.icon}</div>
                <div>
                  <div className={styles.featureTitle}>{item.title}</div>
                  <div className={styles.featureSub}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Filter and Search Section */}
      <section className={styles.filterSection} aria-label="فیلتر و جستجوی کلاس‌ها">
        <div className={styles.searchBarWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="جستجو در عنوان دوره، نام استاد، مهارت یا هدف آموزشی..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={() => setSearchQuery("")}
              aria-label="پاک کردن جستجو"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterRowsContainer}>
          {/* Format Toggle Group */}
          <div className={styles.formatToggleGroup} role="group" aria-label="انتخاب نوع کلاس">
            <button
              type="button"
              className={`${styles.formatBtn} ${selectedFormat === "all" ? styles.formatBtnActive : ""}`}
              onClick={() => setSelectedFormat("all")}
            >
              همه فرمت‌ها
            </button>
            <button
              type="button"
              className={`${styles.formatBtn} ${selectedFormat === "group" ? styles.formatBtnActive : ""}`}
              onClick={() => setSelectedFormat("group")}
            >
              گروهی (۴ نفره)
            </button>
            <button
              type="button"
              className={`${styles.formatBtn} ${selectedFormat === "solo" ? styles.formatBtnActive : ""}`}
              onClick={() => setSelectedFormat("solo")}
            >
              خصوصی (۱ به ۱)
            </button>
          </div>

          {/* Categories Horizontal Group */}
          <div className={styles.categoriesScrollGroup} role="group" aria-label="انتخاب دسته‌بندی موضوعی">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryPill} ${selectedCategory === cat.id ? styles.categoryPillActive : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cohorts Catalog Grid */}
      <section aria-label="فهرست کلاس‌های زنده">
        {filteredCohorts.length === 0 ? (
          <div className={styles.emptyStateBox}>
            <div className={styles.emptyIconCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>کلاسی با مشخصات انتخابی شما پیدا نشد!</h3>
            <p className={styles.emptyDesc}>
              می‌توانید عبارت جستجو را تغییر دهید یا فیلتر دسته‌بندی و فرمت را پاک کنید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFormat("all");
              }}
              className={styles.enrollBtn}
            >
              نمایش همه کلاس‌ها
            </button>
          </div>
        ) : (
          <div className={styles.cohortsGrid}>
            {filteredCohorts.map((cohort) => {
              const remainingSeats = cohort.maxCapacity - cohort.enrolledCount;
              const isFull = remainingSeats <= 0;
              const isUrgent = !isFull && remainingSeats === 1;
              const capacityPercent = Math.min(
                100,
                Math.round((cohort.enrolledCount / cohort.maxCapacity) * 100)
              );

              return (
                <article key={cohort.id} className={styles.cohortCard}>
                  <div>
                    {/* Header Badges */}
                    <div className={styles.cardTopHeader}>
                      <div className={styles.categoryBadgeGroup}>
                        <span className={styles.badgeCategory}>{cohort.categoryLabelFa}</span>
                        <span className={styles.badgeLevel}>{cohort.levelBadgeFa}</span>
                      </div>
                      <div>
                        {isFull ? (
                          <span className={styles.badgeStatusFull}>
                            <span className={styles.statusDotRed} />
                            ظرفیت تکمیل
                          </span>
                        ) : isUrgent ? (
                          <span className={styles.badgeStatusUrgent}>
                            <span className={styles.statusDotAmber} />
                            تنها ۱ صندلی باقی‌مانده!
                          </span>
                        ) : (
                          <span className={styles.badgeStatusOpen}>
                            <span className={styles.statusDotGreen} />
                            {remainingSeats} صندلی خالی از {cohort.maxCapacity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className={styles.cohortTitle}>{cohort.titleFa}</h2>
                    <p className={styles.cohortDesc}>{cohort.descriptionFa}</p>

                    {/* Teacher Row */}
                    <div className={styles.teacherRow}>
                      <div className={styles.teacherAvatar} aria-hidden="true">
                        {cohort.teacher.nameFa.slice(5, 7) || "اس"}
                      </div>
                      <div className={styles.teacherInfoBox}>
                        <div className={styles.teacherNameRow}>
                          <span className={styles.teacherName}>{cohort.teacher.nameFa}</span>
                          {cohort.teacher.verified && (
                            <span className={styles.verifiedCheck} title="استاد تایید شده ایندورا">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                              </svg>
                            </span>
                          )}
                          <span className={styles.ratingBadge}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            {cohort.teacher.rating}
                          </span>
                        </div>
                        <p className={styles.teacherTitleText}>
                          {cohort.teacher.titleFa} &bull; {cohort.teacher.experienceYears} سال سابقه تدریس
                        </p>
                      </div>
                    </div>

                    {/* Schedule Specs 2x2 Grid with Vector SVG Icons */}
                    <div className={styles.scheduleSpecsBox}>
                      <div className={styles.scheduleSpecItem}>
                        <span className={styles.specIcon}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </span>
                        <span>{cohort.scheduleDays.join(" و ")}</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span className={styles.specIcon}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                        <span>{cohort.scheduleTime}</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span className={styles.specIcon}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </span>
                        <span>{cohort.totalSessions} جلسه ({cohort.sessionDurationMinutes} دقیقه)</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span className={styles.specIcon}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                            <line x1="4" y1="22" x2="4" y2="15"></line>
                          </svg>
                        </span>
                        <span>شروع دوره: {cohort.startDateFa}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Track */}
                    <div className={styles.capacityBox}>
                      <div className={styles.capacityHeaderRow}>
                        <span className={styles.capacityLabel}>
                          ظرفیت کلاس ({cohort.formatLabelFa})
                        </span>
                        <span
                          className={styles.capacityValue}
                          style={{
                            color: isFull ? "#dc2626" : isUrgent ? "#d97706" : "#059669",
                          }}
                        >
                          {cohort.enrolledCount} از {cohort.maxCapacity} دانشجو ({capacityPercent}٪)
                        </span>
                      </div>
                      <div className={styles.capacityTrack}>
                        <div
                          className={styles.capacityFill}
                          style={{
                            width: `${capacityPercent}%`,
                            background: isFull
                              ? "linear-gradient(90deg, #ef4444, #dc2626)"
                              : isUrgent
                              ? "linear-gradient(90deg, #f59e0b, #d97706)"
                              : "linear-gradient(90deg, #10b981, #059669)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price & Action */}
                  <div className={styles.cardFooterRow}>
                    <div className={styles.priceCol}>
                      <span className={styles.priceLabel}>شهریه کل دوره:</span>
                      <span className={styles.priceValue}>
                        {cohort.priceToman.toLocaleString("fa-IR")}{" "}
                        <span className={styles.tomanUnit}>تومان</span>
                      </span>
                    </div>
                    <div>
                      {isFull ? (
                        <button
                          type="button"
                          className={styles.waitlistBtn}
                          onClick={() => setActiveModalCohort(cohort)}
                        >
                          ثبت‌نام لیست انتظار
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={styles.enrollBtn}
                          onClick={() => setActiveModalCohort(cohort)}
                        >
                          <span>رزرو صندلی</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Enrollment & Placement Modal */}
      {activeModalCohort && (
        <EnrollmentModal
          cohort={activeModalCohort}
          onClose={() => setActiveModalCohort(null)}
          onSuccess={() => {
            setRefreshCounter((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
