"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./community.module.css";

type TopicCategory = "all" | "speaking" | "ielts" | "grammar" | "writing" | "resources";

interface DiscussionThread {
  id: string;
  author: string;
  badge: string;
  topic: TopicCategory;
  topicNameFa: string;
  topicNameEn: string;
  title: string;
  snippet: string;
  timeFa: string;
  replies: number;
  likes: number;
}

const initialThreads: DiscussionThread[] = [
  {
    id: "thread-1",
    author: "سارا مرادی",
    badge: "B2 Learner",
    topic: "grammar",
    topicNameFa: "تله‌های گرامری و L1",
    topicNameEn: "Grammar & L1",
    title: "چطور خطای ناخودآگاه در استفاده از حرف اضافه 'arrive to/at' رو برای همیشه برطرف کنیم؟",
    snippet: "من همیشه موقع مکالمه ناخودآگاه به خاطر ساختار فارسی 'رسیدن به' می‌گفتم arrive to. در دوقلوی هوشمند اندورا این الگو کشف شد و با تمرین ساختارمند این روش خیلی کمک کرد...",
    timeFa: "۱ ساعت پیش",
    replies: 8,
    likes: 24,
  },
  {
    id: "thread-2",
    author: "علی رضایی",
    badge: "IELTS 7.5 Candidate",
    topic: "ielts",
    topicNameFa: "آزمون آیلتس",
    topicNameEn: "IELTS Prep",
    title: "پارت دوم آزمون اسپیکینگ آیلتس: قالب ۲ دقیقه‌ای برای یادداشت‌برداری سریع با کمترین استرس",
    snippet: "توی زمان ۱ دقیقه یادداشت‌برداری پارت دوم، به جای نوشتن کلمات کامل از سیستم ۴ ربعی (کی، کجا، چرا، چه احساسی) استفاده کنید. نمونه نت‌برداری از آخرین ماک را ضمیمه کردم.",
    timeFa: "۳ ساعت پیش",
    replies: 15,
    likes: 42,
  },
  {
    id: "thread-3",
    author: "نرگس تقوی",
    badge: "A2 Elementary",
    topic: "speaking",
    topicNameFa: "مکالمه و گفتگوی روزمره",
    topicNameEn: "Speaking",
    title: "تجربه تمرین مشترک رول‌پلی فرودگاه و رزرو هتل با دستیار هوش مصنوعی",
    snippet: "امروز سناریوی Airport Roleplay رو تست کردم. خیلی حس واقعی داشت وقتی مأمور فرودگاه لهجه بریتیش داشت و اشتباه زمان حال استمراری من رو بدون قضاوت گوشزد کرد!",
    timeFa: "۵ ساعت پیش",
    replies: 19,
    likes: 31,
  },
  {
    id: "thread-4",
    author: "استاد کیانی",
    badge: "Certified Teacher",
    topic: "writing",
    topicNameFa: "نگارش و رایتینگ",
    topicNameEn: "Writing",
    title: "تحلیل تسک ۱ رایتینگ آکادمیک: ۵ عبارت طلایی برای توصیف نوسانات و اوج نمودارها",
    snippet: "در توصیف روندهای غیریکنواخت، به جای تکرار 'fluctuated', از ترکیب‌های دقیق مثل 'witnessed a sharp dip followed by a steady rebound' استفاده کنید.",
    timeFa: "دیروز",
    replies: 11,
    likes: 56,
  },
];

export default function CommunityPage() {
  const [threads, setThreads] = useState<DiscussionThread[]>(initialThreads);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TopicCategory>("speaking");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const filteredThreads = threads.filter((t) => {
    const matchesTopic = selectedTopic === "all" || t.topic === selectedTopic;
    const matchesSearch =
      searchQuery.trim() === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const topicLabels: Record<TopicCategory, { fa: string; en: string }> = {
      all: { fa: "عمومی", en: "General" },
      speaking: { fa: "مکالمه", en: "Speaking" },
      ielts: { fa: "آزمون آیلتس", en: "IELTS" },
      grammar: { fa: "گرامر و L1", en: "Grammar" },
      writing: { fa: "رایتینگ", en: "Writing" },
      resources: { fa: "منابع آموزشی", en: "Resources" },
    };

    const newThread: DiscussionThread = {
      id: `thread-${Date.now()}`,
      author: newAuthor.trim() || "زبان‌آموز اندورا",
      badge: "Learner",
      topic: newCategory,
      topicNameFa: topicLabels[newCategory].fa,
      topicNameEn: topicLabels[newCategory].en,
      title: newTitle.trim(),
      snippet: newContent.trim(),
      timeFa: "همین الان",
      replies: 0,
      likes: 1,
    };

    setThreads([newThread, ...threads]);
    setNewTitle("");
    setNewContent("");
    setNewAuthor("");
    setIsModalOpen(false);
  };

  const handleLike = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  return (
    <PublicShell locale="fa" currentPath="/community">
      <div className={styles.container} dir="rtl">
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>انجمن یادگیری و هم‌افزایی Endoora</h1>
          <p className={styles.heroSubtitle}>
            فضایی امن، دوستانه و مبتنی بر رشد زبانی برای تبادل نظر، رفع اشکالات رایتینگ و اسپیکینگ، و هم‌افزایی با مدرسان و همکلاسی‌های سراسر کشور.
          </p>
          <div className={styles.heroActions}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={styles.buttonPrimary}
            >
              + ایجاد گفتگوی جدید
            </button>
            <Link href="/practice-ai" className={styles.buttonSecondary}>
              تمرین با دستیار هوش مصنوعی
            </Link>
          </div>
        </section>

        {/* Controls: Search and Topic Filter Chips */}
        <section className={styles.controlsRow}>
          <input
            type="search"
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان گفتگوها، متن، یا نام نویسنده..."
            aria-label="جستجو در انجمن"
          />

          <div className={styles.topicTabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "all"}
              className={`${styles.topicTab} ${selectedTopic === "all" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("all")}
            >
              همه موضوعات ({threads.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "speaking"}
              className={`${styles.topicTab} ${selectedTopic === "speaking" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("speaking")}
            >
              مکالمه و اسپیکینگ
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "ielts"}
              className={`${styles.topicTab} ${selectedTopic === "ielts" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("ielts")}
            >
              آمادگی آزمون آیلتس
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "grammar"}
              className={`${styles.topicTab} ${selectedTopic === "grammar" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("grammar")}
            >
              تله‌های گرامری و L1
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "writing"}
              className={`${styles.topicTab} ${selectedTopic === "writing" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("writing")}
            >
              نگارش و رایتینگ
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedTopic === "resources"}
              className={`${styles.topicTab} ${selectedTopic === "resources" ? styles.topicTabActive : ""}`}
              onClick={() => setSelectedTopic("resources")}
            >
              منابع و تجربیات
            </button>
          </div>
        </section>

        {/* Layout Grid: Feed + Sidebar */}
        <div className={styles.layoutGrid}>
          {/* Main Feed Column */}
          <main className={styles.feedList}>
            {filteredThreads.length === 0 ? (
              <div className={styles.threadCard} style={{ textAlign: "center", padding: "var(--space-8)" }}>
                <p className={styles.threadSnippet}>گفتگویی مطابق با فیلتر یا جستجوی شما یافت نشد.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic("all");
                    setSearchQuery("");
                  }}
                  className={styles.buttonSecondary}
                  style={{ alignSelf: "center", marginBlockStart: "var(--space-3)" }}
                >
                  نمایش همه گفتگوها
                </button>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <article key={thread.id} className={styles.threadCard}>
                  <div className={styles.threadHeader}>
                    <div className={styles.authorContainer}>
                      <div className={styles.authorAvatar} aria-hidden="true">
                        {thread.author.slice(0, 1)}
                      </div>
                      <div className={styles.authorMeta}>
                        <span className={styles.authorName}>{thread.author}</span>
                        <span className={styles.postTime}>{thread.timeFa} • {thread.badge}</span>
                      </div>
                    </div>
                    <span className={styles.topicBadge}>{thread.topicNameFa}</span>
                  </div>

                  <h2 className={styles.threadTitle}>{thread.title}</h2>
                  <p className={styles.threadSnippet}>{thread.snippet}</p>

                  <div className={styles.threadFooter}>
                    <div className={styles.engagementGroup}>
                      <button
                        type="button"
                        onClick={() => handleLike(thread.id)}
                        className={styles.engagementItem}
                        title="پسندیدن گفتگو"
                        aria-label={`پسندیدن: ${thread.likes} پسند`}
                      >
                        ❤️ <span>{thread.likes}</span>
                      </button>
                      <span className={styles.engagementItem} title="تعداد پاسخ‌ها">
                        💬 <span>{thread.replies} پاسخ</span>
                      </span>
                    </div>

                    <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      گفتگوی فعال
                    </span>
                  </div>
                </article>
              ))
            )}
          </main>

          {/* Sidebar Column */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                📜 مرام‌نامه انجمن Endoora
              </h3>
              <p className={styles.sidebarText}>
                جامعه اندورا بر پایه اصل یادگیری بدون سرزنش، احترام متقابل و تصحیح محترمانه خطاهای زبانی شکل گرفته است. هدف ما پرورش اعتماد به نفس در کاربرد واقعی زبان انگلیسی است.
              </p>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                🤖 بازبینی پیش از ارسال
              </h3>
              <p className={styles.sidebarText}>
                می‌توانید متون، پرسش‌ها یا مقالات خود را پیش از انتشار عمومی، با ویرایشگر هوشمند اندورا بررسی کنید.
              </p>
              <Link href="/writing" className={styles.buttonSecondary} style={{ inlineSize: "100%" }}>
                ورود به ویرایشگر رایتینگ
              </Link>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                🎙️ کارگاه‌های زنده مکالمه
              </h3>
              <p className={styles.sidebarText}>
                هر هفته جلسات مکالمه گروهی با نظارت مدرسان تأییدشده برگزار می‌شود. برنامه هفتگی را بررسی کنید.
              </p>
              <Link href="/classes" className={styles.buttonSecondary} style={{ inlineSize: "100%" }}>
                مشاهده تقویم کلاس‌ها
              </Link>
            </div>
          </aside>
        </div>

        {/* New Discussion Modal Dialog */}
        {isModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={styles.modalDialog}>
              <div className={styles.modalHeader}>
                <h2 id="modal-title" className={styles.modalTitle}>ایجاد گفتگوی جدید</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.closeButton}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className={styles.formGroup}>
                  <label htmlFor="thread-author-input" className={styles.formLabel}>نام یا نام مستعار شما</label>
                  <input
                    id="thread-author-input"
                    className={styles.formInput}
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="مثال: پارسا اکبری"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="thread-category-select" className={styles.formLabel}>موضوع گفتگو *</label>
                  <select
                    id="thread-category-select"
                    className={styles.formSelect}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TopicCategory)}
                  >
                    <option value="speaking">مکالمه و اسپیکینگ</option>
                    <option value="ielts">آمادگی آزمون آیلتس</option>
                    <option value="grammar">تله‌های گرامری و L1</option>
                    <option value="writing">نگارش و رایتینگ</option>
                    <option value="resources">منابع و تجربیات</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="thread-title-input" className={styles.formLabel}>عنوان گفتگو *</label>
                  <input
                    id="thread-title-input"
                    className={styles.formInput}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="پرسش یا موضوع بحث را در یک جمله کوتاه و شفاف بیان کنید"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="thread-content-input" className={styles.formLabel}>شرح کامل موضوع یا سؤال *</label>
                  <textarea
                    id="thread-content-input"
                    className={styles.formTextarea}
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="جزئیات، مثال‌ها، متنی که می‌خواهید بررسی شود یا خطای زبانی مورد نظر را بنویسید..."
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.buttonSecondary}
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className={styles.buttonPrimary}
                  >
                    انتشار گفتگو
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
