"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicShell } from "../../components/marketing/PublicShell";
import {
  fetchPublicTeachers,
  type TeacherDirectoryItem,
} from "../../lib/marketplace";
import styles from "./teachers.module.css";

const SKILL_OPTIONS: { id: string; label: string; icon: string }[] = [
  { id: "", label: "همه تخصص‌ها", icon: "✨" },
  { id: "speaking", label: "مکالمه (Speaking)", icon: "🗣️" },
  { id: "ielts_prep", label: "آیلتس (IELTS)", icon: "🎯" },
  { id: "writing", label: "نگارش (Writing)", icon: "✍️" },
  { id: "listening", label: "شنیداری (Listening)", icon: "🎧" },
  { id: "pronunciation", label: "تلفظ و لهجه", icon: "🎙️" },
  { id: "grammar", label: "دستور زبان (Grammar)", icon: "📐" },
  { id: "vocabulary", label: "واژگان (Vocabulary)", icon: "📖" },
  { id: "business_english", label: "انگلیسی تجاری", icon: "💼" },
];

const RATING_OPTIONS = [
  { value: 0, label: "همه امتیازها" },
  { value: 4.5, label: "۴.۵ ستاره و بالاتر" },
  { value: 4.0, label: "۴.۰ ستاره و بالاتر" },
  { value: 3.5, label: "۳.۵ ستاره و بالاتر" },
];

const MAX_RATE_OPTIONS = [
  { value: 0, label: "همه مبالغ شهریه" },
  { value: 250000, label: "تا ۲۵۰,۰۰۰ تومان" },
  { value: 350000, label: "تا ۳۵۰,۰۰۰ تومان" },
  { value: 500000, label: "تا ۵۰۰,۰۰۰ تومان" },
  { value: 1000000, label: "تا ۱,۰۰۰,۰۰۰ تومان" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "بالاترین امتیاز رضایت" },
  { id: "reviews", label: "بیشترین تعداد نظرات" },
  { id: "experience", label: "بیشترین سابقه تدریس" },
  { id: "rate_asc", label: "مناسب‌ترین شهریه ساعتی" },
  { id: "rate_desc", label: "بیشترین شهریه ساعتی" },
];

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

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<TeacherDirectoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRate, setMaxRate] = useState(0);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetchPublicTeachers({
          search: search.trim() || undefined,
          skill: selectedSkill || undefined,
          min_rating: minRating > 0 ? minRating : undefined,
          max_rate: maxRate > 0 ? maxRate : undefined,
          sort_by: sortBy,
        });
        if (!cancelled) {
          setTeachers(res.teachers || []);
          setTotalCount(res.count || 0);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "خطا در بارگذاری فهرست مدرسین. لطفاً دوباره تلاش کنید."
          );
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [search, selectedSkill, minRating, maxRate, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSkill("");
    setMinRating(0);
    setMaxRate(0);
    setSortBy("rating");
  };

  const hasActiveFilters = Boolean(
    search.trim() || selectedSkill || minRating > 0 || maxRate > 0 || sortBy !== "rating"
  );

  return (
    <PublicShell locale="fa" currentPath="/teachers">
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero} aria-labelledby="teachers-heading">
          <div className={styles.heroContent}>
            <div className={styles.heroBadgeRow}>
              <span className={styles.heroBadgePrimary}>
                <span>⭐</span>
                <span>اساتید تاییدشده و ارزیابی‌شده ایندورا</span>
              </span>
            </div>

            <h1 id="teachers-heading" className={styles.heroTitle}>
              مدرس‌های برتر زبان انگلیسی در ایندورا
            </h1>

            <p className={styles.heroSubtitle}>
              اساتید برجسته دارای گواهینامه‌های بین‌المللی کمبریج (DELTA، CELTA، TESOL، IELTS 8.5+).
              رزومه و تخصص هر استاد را بررسی کنید و زمان جلسه اختصاصی خود را در تقویم زنده رزرو نمایید.
            </p>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">✓</span>
                احراز صلاحیت و آزمون ارزیابی تدریس
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">★</span>
                ۱۰۰٪ نظرات مبتنی بر جلسات واقعی برگزارشده
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">🔒</span>
                ضمانت کامل بازگشت وجه در صورت عدم رضایت
              </span>
            </div>
          </div>
        </section>

        {/* Filters Card */}
        <section className={styles.filterCard} aria-label="فیلترها و جستجوی مدرسین">
          {/* Search and Sort Row */}
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon} aria-hidden="true">🔍</span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="جستجوی نام استاد، تخصص، مدرک (مثال: آیلتس، DELTA، مکالمه)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="جستجوی مدرس"
              />
            </div>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="مرتب‌سازی نتایج"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  مرتب‌سازی: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter Pills */}
          <div className={styles.skillPillsRow} role="group" aria-label="فیلتر مهارت">
            {SKILL_OPTIONS.map((skill) => {
              const active = selectedSkill === skill.id;
              return (
                <button
                  key={skill.id}
                  type="button"
                  className={`${styles.skillPill} ${active ? styles.skillPillActive : ""}`}
                  onClick={() => setSelectedSkill(skill.id)}
                  aria-pressed={active}
                >
                  <span>{skill.icon}</span>
                  <span>{skill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Control Dropdowns Row */}
          <div className={styles.filterControlsRow}>
            <div className={styles.controlGroup}>
              <label htmlFor="rating-filter" className={styles.controlLabel}>
                حداقل امتیاز:
              </label>
              <select
                id="rating-filter"
                className={styles.selectInput}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label htmlFor="rate-filter" className={styles.controlLabel}>
                حداکثر شهریه ساعتی:
              </label>
              <select
                id="rate-filter"
                className={styles.selectInput}
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
              >
                {MAX_RATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleResetFilters}
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </section>

        {/* Results Bar */}
        <div className={styles.resultsSummary}>
          <span>
            {loading ? (
              "در حال بارگذاری اساتید..."
            ) : (
              `نمایش ${toPersianDigits(teachers.length)} مدرس از ${toPersianDigits(totalCount)} مدرس منتخب`
            )}
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && !error && (
          <div className={styles.teacherGrid}>
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className={styles.skeletonCard}>
                <div className={styles.skeletonLine} style={{ inlineSize: "50%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "80%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "40%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "100%", blockSize: "50px" }} />
              </div>
            ))}
          </div>
        )}

        {/* Teacher Cards Grid */}
        {!loading && !error && teachers.length > 0 && (
          <section className={styles.teacherGrid} aria-label="لیست مدرسین">
            {teachers.map((teacher) => {
              const rating = teacher.social_proof?.average_rating || 5.0;
              const reviewCount = teacher.social_proof?.review_count || 0;
              const completedCount = teacher.social_proof?.completed_sessions || 0;
              const initial = (teacher.name || "اس").slice(5, 7) || "اس";

              return (
                <article key={teacher.id} className={styles.card}>
                  <div>
                    {/* Header */}
                    <div className={styles.cardHeader}>
                      <div className={styles.avatarWrapper}>
                        {teacher.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={teacher.avatar_url}
                            alt={teacher.name}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <span>{initial}</span>
                        )}
                      </div>

                      <div className={styles.teacherMeta}>
                        <div className={styles.nameRow}>
                          <Link
                            href={`/teachers/${teacher.id}`}
                            className={styles.teacherName}
                          >
                            {teacher.name}
                          </Link>
                          {teacher.is_teacher_verified && (
                            <span className={styles.verifiedBadge} title="مدرس ارزیابی و تایید شده">
                              ✓ تاییدشده
                            </span>
                          )}
                        </div>
                        <p className={styles.teacherHeadline}>
                          {teacher.headline || "مدرس تخصصی زبان انگلیسی در ایندورا"}
                        </p>
                      </div>
                    </div>

                    {/* Social Proof & Metrics */}
                    <div className={styles.socialProofBar}>
                      <span className={styles.ratingBadge}>
                        <span className={styles.ratingStar} aria-hidden="true">★</span>
                        {toPersianDigits(rating.toFixed(1))}
                        <span className={styles.reviewCount}>
                          ({toPersianDigits(reviewCount)} نظر)
                        </span>
                      </span>

                      <span className={styles.sessionCount}>
                        <span aria-hidden="true">👥</span>
                        {toPersianDigits(completedCount)} جلسه برگزارشده
                      </span>
                    </div>

                    {/* Bio snippet */}
                    {teacher.bio && (
                      <p className={styles.bioSnippet}>
                        {teacher.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    {teacher.specialties && teacher.specialties.length > 0 && (
                      <div className={styles.specialtiesList}>
                        {teacher.specialties.slice(0, 4).map((spec, i) => (
                          <span key={i} className={styles.specialtyBadge}>
                            {spec}
                          </span>
                        ))}
                        {teacher.specialties.length > 4 && (
                          <span className={styles.specialtyBadge}>
                            +{toPersianDigits(teacher.specialties.length - 4)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer & CTA */}
                  <div className={styles.cardFooter}>
                    <div className={styles.priceArea}>
                      <span className={styles.priceLabel}>شهریه هر ساعت جلسه:</span>
                      <span className={styles.priceValue}>
                        {formatToman(teacher.hourly_rate_toman)}
                      </span>
                      {teacher.response_time_minutes && (
                        <span className={styles.responseTimeTag}>
                          ⏱ پاسخگویی میانگین: کمتر از {toPersianDigits(teacher.response_time_minutes)} دقیقه
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/teachers/${teacher.id}`}
                      className={styles.viewProfileButton}
                    >
                      <span>مشاهده پروفایل و تقویم</span>
                      <span>&larr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && teachers.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>مدرسی با این مشخصات یافت نشد</p>
            <p className={styles.emptySubtitle}>
              لطفاً فیلترهای اعمال‌شده را تغییر دهید یا واژه جستجوی دیگری را امتحان نمایید.
            </p>
            <button
              type="button"
              className={styles.viewProfileButton}
              onClick={handleResetFilters}
            >
              نمایش همه مدرسین
            </button>
          </div>
        )}
      </main>
    </PublicShell>
  );
}
