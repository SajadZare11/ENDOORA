"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PublicShell } from "../../../components/marketing/PublicShell";
import {
  fetchTeacherPublicProfile,
  fetchTeacherReviews,
  flagTeacherReview,
  formatTehranDateTime,
  type TeacherPublicProfile,
  type TeacherReview,
} from "../../../lib/marketplace";
import styles from "./teacher-profile.module.css";

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

export default function TeacherPublicProfilePage() {
  const params = useParams();
  const teacherId = params?.id as string;

  const [profile, setProfile] = useState<TeacherPublicProfile | null>(null);
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!teacherId) return;
      try {
        const [profData, reviewsData] = await Promise.all([
          fetchTeacherPublicProfile(teacherId),
          fetchTeacherReviews(teacherId),
        ]);
        if (!cancelled) {
          setProfile(profData);
          setReviews(reviewsData.reviews || profData.reviews || []);
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
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  const handleFlagReview = async (reviewId: string) => {
    const reason = window.prompt(
      "علت گزارش تخلف این نظر را وارد نمایید (حداقل ۵ کاراکتر):"
    );
    if (!reason || reason.trim().length < 5) return;

    try {
      await flagTeacherReview(reviewId, reason.trim());
      alert("گزارش شما ثبت شد و توسط تیم نظارت اندورا بررسی خواهد شد.");
    } catch {
      alert("خطا در ثبت گزارش. لطفاً دوباره تلاش کنید.");
    }
  };

  if (loading) {
    return (
      <PublicShell locale="fa" currentPath="/teachers">
        <main className={styles.container}>
          <div style={{ textAlign: "center", paddingBlock: "var(--space-12)" }}>
            <p>در حال بارگذاری اطلاعات مدرس...</p>
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
            <p style={{ color: "var(--color-text-secondary)" }}>
              {error || "پروفایل مدرس در دسترس نیست یا حذف شده است."}
            </p>
            <div style={{ marginBlockStart: "var(--space-4)" }}>
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
    average_rating: 5.0,
    review_count: 0,
    completed_sessions: 0,
    rating_breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    dimension_averages: { teaching_quality: 5.0, punctuality: 5.0, communication: 5.0 },
  };

  const initial = (profile.name || "م").charAt(0);

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

        {/* Hero Header Card */}
        <section className={styles.headerCard} aria-labelledby="teacher-name">
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

          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 id="teacher-name" className={styles.teacherName}>
                {profile.name}
              </h1>
              {profile.is_teacher_verified && (
                <span className={styles.verifiedBadge}>
                  ✓ مدرس رسمی و تاییدشده اندورا
                </span>
              )}
            </div>

            <p className={styles.headline}>
              {profile.headline || "مدرس تخصصی زبان انگلیسی"}
            </p>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <span aria-hidden="true">★</span>
                امتیاز میانگین: {toPersianDigits(proof.average_rating.toFixed(1))} از ۵
                ({toPersianDigits(proof.review_count)} نظر تاییدشده)
              </span>
              <span className={styles.metaItem}>
                <span aria-hidden="true">👥</span>
                {toPersianDigits(proof.completed_sessions)} جلسه موفق
              </span>
              {profile.experience_years ? (
                <span className={styles.metaItem}>
                  <span aria-hidden="true">🎓</span>
                  {toPersianDigits(profile.experience_years)} سال سابقه تدریس
                </span>
              ) : null}
              {profile.response_time_minutes ? (
                <span className={styles.metaItem}>
                  <span aria-hidden="true">⏱</span>
                  پاسخگویی سریع: معمولاً زیر {toPersianDigits(profile.response_time_minutes)} دقیقه
                </span>
              ) : null}
            </div>
          </div>
        </section>

        {/* 2-Column Layout */}
        <div className={styles.layout}>
          {/* Main Column */}
          <div className={styles.mainColumn}>
            {/* Bio Section */}
            {profile.bio && (
              <section className={styles.sectionCard} aria-labelledby="bio-heading">
                <h2 id="bio-heading" className={styles.sectionTitle}>
                  درباره مدرس
                </h2>
                <p className={styles.sectionBody}>
                  {profile.bio}
                </p>
              </section>
            )}

            {/* Video Intro */}
            {profile.video_intro_url && (
              <section className={styles.sectionCard} aria-labelledby="video-heading">
                <h2 id="video-heading" className={styles.sectionTitle}>
                  ویدیو معرفی مدرس
                </h2>
                <div className={styles.videoContainer}>
                  {profile.video_intro_url.includes("aparat.com") ||
                  profile.video_intro_url.includes("youtube.com") ? (
                    <iframe
                      src={profile.video_intro_url}
                      className={styles.videoIframe}
                      title="ویدیو معرفی مدرس"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={profile.video_intro_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoFallbackLink}
                    >
                      ▶ مشاهده ویدیو معرفی در پنجره جدید
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Specialties & Teaching Focus */}
            {profile.specialties && profile.specialties.length > 0 && (
              <section className={styles.sectionCard} aria-labelledby="specialties-heading">
                <h2 id="specialties-heading" className={styles.sectionTitle}>
                  مهارت‌ها و حوزه‌های تدریس
                </h2>
                <div className={styles.tagsList}>
                  {profile.specialties.map((item, idx) => (
                    <span key={idx} className={styles.tagPill}>
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Education */}
            {((profile.certifications && profile.certifications.length > 0) || profile.education) && (
              <section className={styles.sectionCard} aria-labelledby="certs-heading">
                <h2 id="certs-heading" className={styles.sectionTitle}>
                  مدارک و گواهینامه‌های بین‌المللی
                </h2>
                {profile.education && (
                  <p className={styles.sectionBody} style={{ marginBlockEnd: "var(--space-3)" }}>
                    <strong>تحصیلات آکادمیک:</strong> {profile.education}
                  </p>
                )}
                {profile.certifications && profile.certifications.length > 0 && (
                  <div className={styles.tagsList}>
                    {profile.certifications.map((cert, idx) => (
                      <span key={idx} className={styles.certBadge}>
                        🎖 {cert}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Social Proof & Verified Reviews */}
            <section className={styles.sectionCard} aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className={styles.sectionTitle}>
                نظرات و ارزیابی زبان‌آموزان ({toPersianDigits(proof.review_count)})
              </h2>

              {/* Social Proof Overview Breakdown */}
              <div className={styles.socialProofGrid}>
                {/* Big Star Box */}
                <div className={styles.ratingBigBox}>
                  <span className={styles.ratingBigNumber}>
                    {toPersianDigits(proof.average_rating.toFixed(1))}
                  </span>
                  <div className={styles.ratingStarsRow} aria-hidden="true">
                    ★★★★★
                  </div>
                  <span className={styles.ratingCountText}>
                    بر اساس {toPersianDigits(proof.review_count)} جلسه برگزارشده
                  </span>
                </div>

                {/* Dimension Averages */}
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

              {/* Histogram Breakdown */}
              <div className={styles.histogramContainer}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = proof.rating_breakdown?.[String(stars)] || 0;
                  const pct = proof.review_count > 0 ? (count / proof.review_count) * 100 : 0;
                  return (
                    <div key={stars} className={styles.histogramRow}>
                      <span className={styles.histogramStarLabel}>
                        {toPersianDigits(stars)} ستاره
                      </span>
                      <div className={styles.histogramTrack}>
                        <div
                          className={styles.histogramFill}
                          style={{ inlineSize: `${pct}%` }}
                        />
                      </div>
                      <span className={styles.histogramCount}>
                        ({toPersianDigits(count)})
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reviews List */}
              <div className={styles.reviewsList} style={{ marginBlockStart: "var(--space-4)" }}>
                {reviews.length === 0 ? (
                  <p style={{ color: "var(--color-text-secondary)", textAlign: "center", paddingBlock: "var(--space-4)" }}>
                    هنوز نظری برای این مدرس ثبت نشده است. پس از اتمام اولین جلسه، زبان‌آموزان می‌توانند دیدگاه خود را به اشتراک بگذارند.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <article key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerMeta}>
                          <span className={styles.reviewerName}>
                            {rev.learner_display_name || "زبان‌آموز اندورا"}
                          </span>
                          <span className={styles.sessionVerifiedTag}>
                            ✓ جلسه تاییدشده
                          </span>
                        </div>
                        <span className={styles.reviewDate}>
                          {formatTehranDateTime(rev.created_at)}
                        </span>
                      </div>

                      {/* Dimension scores */}
                      <div className={styles.reviewRatingPills}>
                        <span className={styles.scorePill}>
                          ★ کلی: {toPersianDigits(rev.overall_rating)} از ۵
                        </span>
                        <span className={styles.scorePill}>
                          تدریس: {toPersianDigits(rev.teaching_quality)}
                        </span>
                        <span className={styles.scorePill}>
                          وقت‌شناسی: {toPersianDigits(rev.punctuality)}
                        </span>
                        <span className={styles.scorePill}>
                          تعامل: {toPersianDigits(rev.communication)}
                        </span>
                      </div>

                      {/* Comment text */}
                      <p className={styles.reviewComment}>
                        {rev.comment}
                      </p>

                      {/* Official Teacher Reply */}
                      {rev.teacher_reply && (
                        <div className={styles.replyCard}>
                          <span className={styles.replyTitle}>
                            پاسخ مدرس ({profile.name}):
                          </span>
                          <p className={styles.replyContent}>
                            {rev.teacher_reply}
                          </p>
                        </div>
                      )}

                      {/* Flag button */}
                      <button
                        type="button"
                        className={styles.flagButton}
                        onClick={() => handleFlagReview(rev.id)}
                      >
                        گزارش این نظر
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar (Booking Card) */}
          <aside className={styles.sidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.rateHeader}>
                <span className={styles.rateLabel}>شهریه هر ساعت جلسه آموزشی:</span>
                <span className={styles.rateValue}>
                  {formatToman(profile.hourly_rate_toman)}
                </span>
              </div>

              <Link
                href={`/learn/now`}
                className={styles.bookButton}
              >
                درخواست کلاس با این مدرس
              </Link>

              <div className={styles.guaranteeList}>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">🛡</span>
                  <span>پرداخت امن پس از پایان رضایت‌بخش جلسه</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">🔄</span>
                  <span>امکان لغو یا تغییر ساعت تا ۱۲ ساعت قبل جلسه</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <span className={styles.guaranteeIcon} aria-hidden="true">💬</span>
                  <span>پشتیبانی زنده و آنلاین در اتاق گفت‌وگو</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </PublicShell>
  );
}
