"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicShell } from "../../components/marketing/PublicShell";
import {
  fetchPublicTeachers,
  type TeacherDirectoryItem,
} from "../../lib/marketplace";
import styles from "./teachers.module.css";

const SKILL_OPTIONS: { id: string; label: string }[] = [
  { id: "", label: "همه مهارت‌ها" },
  { id: "speaking", label: "مکالمه (Speaking)" },
  { id: "ielts_prep", label: "آیلتس (IELTS)" },
  { id: "writing", label: "نگارش (Writing)" },
  { id: "listening", label: "شنیداری (Listening)" },
  { id: "pronunciation", label: "تلفظ (Pronunciation)" },
  { id: "grammar", label: "گرامر (Grammar)" },
  { id: "vocabulary", label: "واژگان (Vocabulary)" },
  { id: "business_english", label: "انگلیسی تجاری" },
];

const RATING_OPTIONS = [
  { value: 0, label: "همه امتیازها" },
  { value: 4.5, label: "۴.۵ ستاره و بالاتر" },
  { value: 4.0, label: "۴.۰ ستاره و بالاتر" },
  { value: 3.5, label: "۳.۵ ستاره و بالاتر" },
];

const MAX_RATE_OPTIONS = [
  { value: 0, label: "همه مبالغ" },
  { value: 250000, label: "تا ۲۵۰,۰۰۰ تومان" },
  { value: 400000, label: "تا ۴۰۰,۰۰۰ تومان" },
  { value: 600000, label: "تا ۶۰۰,۰۰۰ تومان" },
  { value: 1000000, label: "تا ۱,۰۰۰,۰۰۰ تومان" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "بالاترین امتیاز" },
  { id: "reviews", label: "بیشترین تعداد نظر" },
  { id: "rate_asc", label: "کمترین هزینه ساعتی" },
  { id: "rate_desc", label: "بیشترین هزینه ساعتی" },
  { id: "experience", label: "بیشترین سابقه تدریس" },
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

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPublicTeachers({
        search: search.trim() || undefined,
        skill: selectedSkill || undefined,
        min_rating: minRating > 0 ? minRating : undefined,
        max_rate: maxRate > 0 ? maxRate : undefined,
        sort_by: sortBy,
      });
      setTeachers(res.teachers || []);
      setTotalCount(res.count || 0);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "خطا در بارگذاری فهرست مدرسین."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <h1 id="teachers-heading" className={styles.heroTitle}>
            مدرس‌های برتر زبان انگلیسی در اندورا
          </h1>
          <p className={styles.heroSubtitle}>
            اساتید ارزیابی‌شده و دارای گواهینامه‌های معتبر بین‌المللی (CELTA، TESOL، IELTS 8.5+).
            پروفایل و ویدیوی مدرسین را بررسی کنید، نظرات تاییدشده دانشجویان را بخوانید و جلسه خود را رزرو نمایید.
          </p>
          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">✓</span>
              احراز صلاحیت و مصاحبه تخصصی
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">★</span>
              ۱۰۰٪ نظرات بر اساس جلسات واقعی
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">🔒</span>
              ضمانت بازگشت وجه در صورت عدم رضایت
            </span>
          </div>
        </section>

        {/* Filters Card */}
        <section className={styles.filterCard} aria-label="فیلترها و جستجوی مدرسین">
          {/* Search Row */}
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrapper}>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="جستجوی نام مدرس، تخصص یا رزومه (مثال: آیلتس، CELTA، مکالمه)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="جستجوی مدرس"
              />
              <span className={styles.searchIcon} aria-hidden="true">🔍</span>
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
                  {skill.label}
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
                حداکثر شهریه:
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
                پاک کردن همه فیلترها
              </button>
            )}
          </div>
        </section>

        {/* Results Bar */}
        <div className={styles.resultsSummary}>
          <span>
            {loading ? (
              "در حال بارگذاری..."
            ) : (
              `نمایش ${toPersianDigits(teachers.length)} مدرس از ${toPersianDigits(totalCount)} مدرس منتخب`
            )}
          </span>
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>خطایی رخ داد</p>
            <p className={styles.emptySubtitle}>{error}</p>
            <button
              type="button"
              className={styles.viewProfileButton}
              onClick={handleRetry}
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && !error && (
          <div className={styles.teacherGrid}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className={styles.skeletonCard}>
                <div className={styles.skeletonLine} style={{ inlineSize: "60%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "80%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "40%" }} />
                <div className={styles.skeletonLine} style={{ inlineSize: "100%", blockSize: "60px" }} />
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
              const initial = (teacher.name || "م").charAt(0);

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
                          {teacher.headline || "مدرس تخصصی زبان انگلیسی در اندورا"}
                        </p>
                      </div>
                    </div>

                    {/* Social Proof & Metrics */}
                    <div className={styles.socialProofBar} style={{ marginBlock: "var(--space-3)" }}>
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
                      <div
                        className={styles.specialtiesList}
                        style={{ marginBlockStart: "var(--space-3)" }}
                      >
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
                          ⏱ پاسخ در کمتر از {toPersianDigits(teacher.response_time_minutes)} دقیقه
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/teachers/${teacher.id}`}
                      className={styles.viewProfileButton}
                    >
                      مشاهده پروفایل و رزرو
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
              پاک کردن همه فیلترها
            </button>
          </div>
        )}
      </main>
    </PublicShell>
  );
}
