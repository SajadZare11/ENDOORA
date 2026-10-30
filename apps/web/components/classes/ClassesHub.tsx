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

const CATEGORIES: { id: "all" | CohortCategory; label: string; icon: string }[] = [
  { id: "all", label: "همه دوره‌ها", icon: "✨" },
  { id: "ielts", label: "آمادگی آیلتس", icon: "🎯" },
  { id: "fluency", label: "مکالمه و روانی کلام", icon: "🗣️" },
  { id: "starter", label: "پایه‌ای و استارتر", icon: "🌱" },
  { id: "business", label: "زبان تجاری و بیزینس", icon: "💼" },
  { id: "highschool", label: "امتحان نهایی دوازدهم", icon: "📚" },
  { id: "phonetics", label: "تلفظ و فونتیک", icon: "🎙️" },
  { id: "debate", label: "مناظره و تفکر نقادانه", icon: "⚖️" },
];

export function ClassesHub() {
  const [mounted, setMounted] = useState(false);
  const [cohorts, setCohorts] = useState<LiveClassCohort[]>([]);
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

      {/* Hero Section */}
      <section className={styles.heroSection} aria-labelledby="classes-hero-heading">
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadgePrimary}>
              <span>⚡</span>
              <span>استودیوی زنده تعاملی ایندورا</span>
            </span>
            <span className={styles.heroBadgeSecondary}>
              <span>👥</span>
              <span>کوهورت‌های کم‌جمعیت (حداکثر ۴ نفر)</span>
            </span>
          </div>

          <h1 id="classes-hero-heading" className={styles.heroTitle}>
            کلاس‌های آنلاین زنده و گروه‌های فشرده یادگیری
          </h1>

          <p className={styles.heroSubtitle}>
            تجربه کلاس پویا با بهترین اساتید، وایت‌بورد چندکاربره بلادرنگ، پادکست اختصاصی خلاصه هر جلسه،
            و ثبت مستقیم تمام خطاهای کلامی شما در جعبه لایتنر هوشمند.
          </p>

          <div className={styles.heroChipsRow}>
            <div className={styles.heroStatChip}>
              <span>🎥</span>
              <span>اتاق جلسه WebRTC اختصاصی</span>
            </div>
            <div className={styles.heroStatChip}>
              <span>📊</span>
              <span>تعیین سطح پیش‌نیاز الزامی</span>
            </div>
            <div className={styles.heroStatChip}>
              <span>💡</span>
              <span>تحلیل خطاهای صوتی کلاسی</span>
            </div>
            <div className={styles.heroStatChip}>
              <span>⭐</span>
              <span>تضمین رضایت و عودت شهریه</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className={styles.filterSection} aria-label="فیلتر و جستجوی کلاس‌ها">
        <div className={styles.searchBarWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="جستجو در عنوان کلاس، استاد، هدف آموزشی یا مهارت..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cohorts Catalog Grid */}
      <section aria-label="فهرست کلاس‌های زنده">
        {filteredCohorts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "var(--color-surface, #ffffff)",
              borderRadius: "16px",
              border: "1px dashed var(--color-border, #cbd5e1)",
            }}
          >
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.5rem" }}>🔎</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>کلاسی با مشخصات انتخابی شما پیدا نشد!</h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              می‌توانید عبارت جستجو را پاک کنید یا فیلتر دسته‌بندی دیگری را امتحان نمایید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFormat("all");
              }}
              className={styles.enrollBtn}
              style={{ marginTop: "1rem" }}
            >
              نمایش همه کلاس‌ها
            </button>
          </div>
        ) : (
          <div className={styles.cohortsGrid}>
            {filteredCohorts.map((cohort) => {
              const remainingSeats = cohort.maxCapacity - cohort.enrolledCount;
              const isFull = remainingSeats <= 0;
              const capacityPercent = Math.min(
                100,
                Math.round((cohort.enrolledCount / cohort.maxCapacity) * 100)
              );

              return (
                <article key={cohort.id} className={styles.cohortCard}>
                  <div>
                    {/* Header Badges */}
                    <div className={styles.cardTopHeader}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span className={styles.badgeCategory}>{cohort.categoryLabelFa}</span>
                        <span className={styles.badgeLevel}>{cohort.levelBadgeFa}</span>
                      </div>
                      <div>
                        {isFull ? (
                          <span className={styles.badgeStatusFull}>ظرفیت تکمیل</span>
                        ) : (
                          <span className={styles.badgeStatusOpen}>
                            {remainingSeats === 1
                              ? "تنها ۱ صندلی باقی‌مانده!"
                              : `${remainingSeats} صندلی خالی از ${cohort.maxCapacity}`}
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
                          <span>{cohort.teacher.nameFa}</span>
                          {cohort.teacher.verified && (
                            <span className={styles.verifiedCheck} title="استاد تایید شده ایندورا">
                              ✓
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#f59e0b",
                              marginRight: "auto",
                              fontWeight: 800,
                            }}
                          >
                            ⭐ {cohort.teacher.rating}
                          </span>
                        </div>
                        <p className={styles.teacherTitleText}>
                          {cohort.teacher.titleFa} &bull; {cohort.teacher.experienceYears} سال سابقه
                        </p>
                      </div>
                    </div>

                    {/* Schedule Specs Box */}
                    <div className={styles.scheduleSpecsBox}>
                      <div className={styles.scheduleSpecItem}>
                        <span>📅</span>
                        <span>{cohort.scheduleDays.join(" و ")}</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span>⏰</span>
                        <span>{cohort.scheduleTime}</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span>⏳</span>
                        <span>{cohort.totalSessions} جلسه ({cohort.sessionDurationMinutes} د)</span>
                      </div>
                      <div className={styles.scheduleSpecItem}>
                        <span>🚀</span>
                        <span>شروع: {cohort.startDateFa}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Track */}
                    <div className={styles.capacityBox}>
                      <div className={styles.capacityHeaderRow}>
                        <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                          وضعیت صندلی‌های دوره ({cohort.formatLabelFa})
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: isFull ? "#dc2626" : remainingSeats <= 1 ? "#d97706" : "#059669",
                          }}
                        >
                          {cohort.enrolledCount} از {cohort.maxCapacity} دانشجو
                        </span>
                      </div>
                      <div className={styles.capacityTrack}>
                        <div
                          className={styles.capacityFill}
                          style={{
                            width: `${capacityPercent}%`,
                            background: isFull
                              ? "#ef4444"
                              : remainingSeats <= 1
                              ? "#f59e0b"
                              : "#10b981",
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
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>تومان</span>
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
                          <span>&larr;</span>
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
