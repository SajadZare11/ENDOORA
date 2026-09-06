"use client";

import { useState, useMemo, type FormEvent } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./search.module.css";

type CategoryFilter = "all" | "course" | "teacher" | "community_post" | "lesson_plan" | "faq" | "assignment";

interface SearchResultItem {
  id: string;
  title: string;
  content: string;
  contentType: CategoryFilter;
  contentTypeDisplay: string;
  visibility: "public" | "authenticated" | "private_owner";
  visibilityDisplay: string;
  targetUrl: string;
  tags: string[];
  popularityScore: number;
  updatedAt: string;
}

const SAMPLE_DOCUMENTS: SearchResultItem[] = [
  {
    id: "doc-1",
    title: "دوره جامع آمادگی آزمون آیلتس آکادمیک (IELTS Academic)",
    content: "مسیر گام‌به‌گام برای تقویت مهارت‌های اسپیکینگ، ریدینگ، رایتینگ و لیسنینگ آیلتس با تمرین‌های تعاملی و اصلاح خطای اختصاصی ژنوم.",
    contentType: "course",
    contentTypeDisplay: "دوره آموزشی",
    visibility: "public",
    visibilityDisplay: "عمومی",
    targetUrl: "/courses/ielts-academic-speaking-and-writing-mastery",
    tags: ["آیلتس", "آکادمیک", "تقویت نمره"],
    popularityScore: 98,
    updatedAt: "۱۴۰۳/۰۶/۱۵",
  },
  {
    id: "doc-2",
    title: "استاد سارا رادمنش — متخصص آیلتس و تصحیح رایتینگ",
    content: "مدرس ارشد زبان انگلیسی، دارای مدرک CELTA با بیش از ۱۰ سال سابقه آموزش داوطلبان آزمون‌های بین‌المللی و کارگاه‌های نگارش پیشرفته.",
    contentType: "teacher",
    contentTypeDisplay: "مدرس تایید شده",
    visibility: "public",
    visibilityDisplay: "عمومی",
    targetUrl: "/teachers",
    tags: ["مدرس برتر", "CELTA", "رایتینگ"],
    popularityScore: 86,
    updatedAt: "۱۴۰۳/۰۶/۱۲",
  },
  {
    id: "doc-3",
    title: "طرح درس جامع گرامر زمان‌های کامل (Present Perfect & Past Perfect)",
    content: "طرح درس استاندارد کلاسی مناسب دوره متوسطه و پیشرفته به همراه ورک‌شیت تمرین و فایل صوتی راهنما با مجوز CC-BY-SA.",
    contentType: "lesson_plan",
    contentTypeDisplay: "طرح درس",
    visibility: "public",
    visibilityDisplay: "عمومی",
    targetUrl: "/community",
    tags: ["طرح درس", "گرامر", "B2-C1"],
    popularityScore: 74,
    updatedAt: "۱۴۰۳/۰۶/۱۰",
  },
  {
    id: "doc-4",
    title: "آزمون تعیین سطح هوشمند اندورا چگونه کار می‌کند؟",
    content: "تعیین سطح اندورا با رویکرد تطبیقی سوالات را بر مبنای پاسخ‌های پیشین تنظیم کرده و کارنامه تفصیلی به همراه مسیر یادگیری صادر می‌کند.",
    contentType: "faq",
    contentTypeDisplay: "سوال متداول",
    visibility: "public",
    visibilityDisplay: "عمومی",
    targetUrl: "/support#faq-placement",
    tags: ["تعیین سطح", "راهنما", "کارنامه"],
    popularityScore: 92,
    updatedAt: "۱۴۰۳/۰۶/۰۱",
  },
  {
    id: "doc-5",
    title: "تجربه تدریس تلفظ صحیح اصوات دشوار /θ/ و /ð/ برای فارسی‌زبانان",
    content: "تکنیک‌های زبان‌شناختی کاربردی برای حل چالش تداخل واجی بین زبان فارسی و انگلیسی در کلاس‌های تعاملی با فیدبک هوش مصنوعی.",
    contentType: "community_post",
    contentTypeDisplay: "تجربه اساتید",
    visibility: "public",
    visibilityDisplay: "عمومی",
    targetUrl: "/community",
    tags: ["تلفظ", "واج‌شناسی", "تجربه"],
    popularityScore: 68,
    updatedAt: "۱۴۰۳/۰۶/۰۸",
  },
  {
    id: "doc-6",
    title: "تکلیف اختصاصی شما: نگارش پاراگراف مقدمه رایتینگ تسک ۲",
    content: "تمرین کلاسی ثبت شده در کلاس استاد رادمنش؛ مهلت تحویل تا پایان هفته جاری با سیستم بازخورد هوشمند منتور نگارش.",
    contentType: "assignment",
    contentTypeDisplay: "تکلیف کلاسی",
    visibility: "private_owner",
    visibilityDisplay: "اختصاصی شما",
    targetUrl: "/dashboard",
    tags: ["تکلیف کلاسی", "انحصاری"],
    popularityScore: 10,
    updatedAt: "۱۴۰۳/۰۶/۱۴",
  },
];

const POPULAR_SEARCH_TERMS = [
    "تعیین سطح",
    "آیلتس آکادمیک",
    "گرامر زمان‌ها",
    "طرح درس",
    "مکالمه روزمره",
    "واژگان کنکور",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "آزمون تعیین سطح",
    "گرامر پیشرفته",
    "استاد رادمنش",
  ]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    setActiveQuery(clean);
    if (clean && !recentSearches.includes(clean)) {
      setRecentSearches((prev) => [clean, ...prev.slice(0, 4)]);
    }
  };

  const handleTagClick = (term: string) => {
    setQuery(term);
    setActiveQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  // Filtered and normalized search results
  const filteredResults = useMemo(() => {
    const q = activeQuery.toLowerCase().trim();
    return SAMPLE_DOCUMENTS.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.contentType !== selectedCategory) {
        return false;
      }
      // Text query match
      if (!q) return true;
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTags;
    });
  }, [activeQuery, selectedCategory]);

  return (
    <PublicShell locale="fa" currentPath="/search">
      <div className={styles.container}>
        {/* Search Hero Header */}
        <section className={styles.searchHeader}>
          <h1 className={styles.title}>جستجوی یکپارچه اندورا</h1>
          <p className={styles.subtitle}>
            دسترسی سریع به دوره‌های آموزشی، اساتید تایید شده، طرح درس‌ها، تجربیات جامعه یادگیری و راهنمای سیستم
          </p>

          <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="عنوان دوره، موضوع گرامر، نام مدرس یا سوال خود را بنویسید..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="عبارت جستجو"
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => {
                    setQuery("");
                    setActiveQuery("");
                  }}
                  aria-label="پاک کردن متن"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className={styles.searchSubmitBtn}>
              جستجو
            </button>
          </form>

          {/* Quick Tags: Popular & Recent */}
          <div className={styles.quickTagsRow}>
            {recentSearches.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <span className={styles.tagsLabel}>جستجوهای اخیر شما:</span>
                <div className={styles.tagChips}>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={styles.tagChip}
                      onClick={() => handleTagClick(term)}
                    >
                      🕒 {term}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={styles.clearHistoryBtn}
                    onClick={handleClearHistory}
                  >
                    پاک کردن تاریخچه
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <span className={styles.tagsLabel}>بیشترین جستجوها:</span>
              <div className={styles.tagChips}>
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={styles.tagChip}
                    onClick={() => handleTagClick(term)}
                  >
                    🔍 {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <nav className={styles.tabsContainer} aria-label="فیلتر دسته‌بندی نتایج">
          <button
            className={`${styles.tabBtn} ${selectedCategory === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            همه منابع ({activeQuery ? filteredResults.length : SAMPLE_DOCUMENTS.length})
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "course" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("course")}
          >
            دوره‌های آموزشی
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "teacher" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("teacher")}
          >
            مدرسان
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "lesson_plan" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("lesson_plan")}
          >
            طرح درس و منابع
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "community_post" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("community_post")}
          >
            جامعه و تجربیات
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "faq" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("faq")}
          >
            سوالات متداول
          </button>
          <button
            className={`${styles.tabBtn} ${selectedCategory === "assignment" ? styles.tabBtnActive : ""}`}
            onClick={() => setSelectedCategory("assignment")}
          >
            تکالیف اختصاصی
          </button>
        </nav>

        {/* Results List */}
        <section aria-label="نتایج جستجو">
          <div className={styles.resultsHeader}>
            <span>
              {activeQuery
                ? `نمایش ${filteredResults.length} نتیجه برای «${activeQuery}»`
                : `پیشنهادهای برگزیده برای شروع جستجو (${filteredResults.length} مورد)`}
            </span>
          </div>

          {filteredResults.length > 0 ? (
            <div className={styles.resultsList}>
              {filteredResults.map((item) => (
                <article key={item.id} className={styles.resultCard}>
                  <div className={styles.resultTopRow}>
                    <div className={styles.resultBadgeGroup}>
                      <span className={styles.typeBadge}>{item.contentTypeDisplay}</span>
                      {item.visibility === "private_owner" && (
                        <span className={styles.privateBadge}>🔒 {item.visibilityDisplay}</span>
                      )}
                    </div>
                    <span className={styles.resultDate}>{item.updatedAt}</span>
                  </div>

                  <Link href={item.targetUrl} className={styles.resultTitle}>
                    {item.title}
                  </Link>

                  <p className={styles.resultSnippet}>{item.content}</p>

                  <div className={styles.resultFooter}>
                    <div className={styles.resultTags}>
                      {item.tags.map((tag) => (
                        <span key={tag} className={styles.resultTag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link href={item.targetUrl} className={styles.resultLink}>
                      مشاهده منبع ←
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.zeroResults}>
              <span className={styles.zeroIcon} aria-hidden="true">🔎</span>
              <h2 className={styles.zeroTitle}>نتیجه‌ای برای «{activeQuery}» یافت نشد</h2>
              <p className={styles.zeroText}>
                ممکن است عبارت خود را با املای دیگری جستجو کنید یا از موضوعات پربازدید زیر استفاده نمایید.
              </p>
              <div className={styles.zeroSuggestions}>
                <span className={styles.tagsLabel}>پیشنهادهای مرتبط:</span>
                <div className={styles.tagChips}>
                  {POPULAR_SEARCH_TERMS.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={styles.tagChip}
                      onClick={() => handleTagClick(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/support" className={styles.zeroCtaLink}>
                مراجعه به مرکز پشتیبانی و سوالات متداول ←
              </Link>
            </div>
          )}
        </section>
      </div>
    </PublicShell>
  );
}
