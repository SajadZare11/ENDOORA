"use client";

import { useState, useMemo, type FormEvent } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./community.module.css";

type PostCategory = "all" | "teacher_experience" | "lesson_plan" | "question" | "learner_post" | "featured";

type LicenseType = "original_editorial" | "cc_by_sa" | "cc_by" | "public_domain" | "educational_fair_use";

interface MediaAttachment {
  url: string;
  file_type: string;
  caption: string;
  alt_text: string;
}

interface LessonPlanMeta {
  license_type: LicenseType;
  copyright_attribution: string;
  file_format: string;
  file_size: string;
  file_url: string;
  target_skill: string;
  grade_level: string;
}

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "learner" | "teacher" | "admin";
  isVerifiedTeacher: boolean;
  category: PostCategory;
  categoryNameFa: string;
  titleFa: string;
  titleEn?: string;
  contentFa: string;
  contentEn?: string;
  timeFa: string;
  tags: string[];
  media?: MediaAttachment[];
  lessonPlan?: LessonPlanMeta;
  isMonthlyFeatured?: boolean;
  featuredNotes?: string;
  featuredCurator?: string;
  reactions: {
    like: number;
    helpful: number;
    inspiring: number;
    insightful: number;
  };
  userReaction?: "like" | "helpful" | "inspiring" | "insightful";
  commentsCount: number;
  isPinned?: boolean;
  isSuitableForMinors: boolean;
}

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timeFa: string;
}

interface ModerationReport {
  id: string;
  targetId: string;
  targetTitle: string;
  reason: string;
  slaHours: number;
  slaText: string;
  status: "pending" | "resolved" | "dismissed";
  contentSnapshot: string;
  timeFa: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-featured-1",
    authorId: "author-kiani",
    authorName: "استاد کیانی",
    authorRole: "teacher",
    isVerifiedTeacher: true,
    category: "teacher_experience",
    categoryNameFa: "تجربه استاد",
    isMonthlyFeatured: true,
    featuredNotes: "این پست به دلیل شیوایی در انتقال متدولوژی یادگیری مبتنی بر L1 و تمرین‌های کاربردی اسپیکینگ آیلتس به عنوان پست برگزیده ماه توسط تیم تحریریه انتخاب شد.",
    featuredCurator: "شورای علمی و تحریریه اندورا",
    titleFa: "تکنیک ۴ ربعی یادداشت‌برداری در پارت ۲ اسپیکینگ آیلتس: کاهش استرس و تثبیت انسجام گفتار",
    titleEn: "Four-Quadrant Note Taking for IELTS Speaking Part 2",
    contentFa: "در طول ۱۰ سال تدریس آمادگی آزمون آیلتس، متوجه شدم بیش از ۷۰٪ افت نمره زبان‌آموزان در پارت دوم ناشی از کمبود دامنه واژگان نیست، بلکه گم کردن رشته کلام در دقیقه دوم است.\n\nبا تقسیم برگه به ۴ ربع (چه کسی/کجا، زمان/پس‌زمینه، رویداد اصلی، احساس و چرایی اهمیت)، زبان‌آموز همواره مسیر واژگانی خود را بدون مکث‌های نامطمئن دنبال می‌کند. این روش روی ۳۴ داوطلب در اندورا آزمایش شد و میانگین نمره فلوئنسی از ۶.۰ به ۷.۰ رسید.",
    timeFa: "دیروز",
    tags: ["IELTS", "Speaking", "تکنیک تدریس", "L1"],
    reactions: { like: 84, helpful: 62, inspiring: 45, insightful: 38 },
    commentsCount: 14,
    isPinned: true,
    isSuitableForMinors: true,
  },
  {
    id: "post-plan-1",
    authorId: "author-rezaei",
    authorName: "مریم رضایی",
    authorRole: "teacher",
    isVerifiedTeacher: true,
    category: "lesson_plan",
    categoryNameFa: "طرح درس و منابع",
    titleFa: "طرح درس تعاملی گرامر شرطی نوع دوم (Conditionals Type 2) ویژه پایه یازدهم و کنکور",
    contentFa: "طرح درس ۴۵ دقیقه‌ای همراه با کاربرگ‌های تصویری و بازی موقعیت‌های فرضی (Hypothetical Situations). شامل فایل PDF تدوین‌شده و نمونه سوالات تستی استاندارد منطبق بر کتاب Vision 2.",
    timeFa: "۲ ساعت پیش",
    tags: ["Vision 2", "پایه یازدهم", "طرح درس", "کنکور"],
    lessonPlan: {
      license_type: "cc_by_sa",
      copyright_attribution: "تدوین مریم رضایی — تحت لایسنس CC BY-SA 4.0 برای معلمان زبان ایران",
      file_format: "pdf",
      file_size: "۲.۴ مگابایت",
      file_url: "#download-plan-conditionals",
      target_skill: "Grammar & Speaking",
      grade_level: "Vision 2 (Grade 11)",
    },
    reactions: { like: 39, helpful: 51, inspiring: 18, insightful: 29 },
    commentsCount: 6,
    isSuitableForMinors: true,
  },
  {
    id: "post-learner-1",
    authorId: "author-sara",
    authorName: "سارا مرادی",
    authorRole: "learner",
    isVerifiedTeacher: false,
    category: "learner_post",
    categoryNameFa: "پست زبان‌آموز",
    titleFa: "چطور خطای ناخودآگاه در استفاده از حرف اضافه 'arrive to/at' را در دوقلوی هوشمند برطرف کردم؟",
    contentFa: "من همیشه موقع صحبت کردن به خاطر ساختار فارسی 'رسیدن به' می‌گفتم arrive to. بعد از اینکه ژنوم اشتباهات در اندورا این تکرار را گوشزد کرد، با تکنیک تصویرسازی فضایی و تمرین جملات با بافت واقعی فرودگاه و هتل این چالش برای همیشه حل شد.",
    timeFa: "۴ ساعت پیش",
    tags: ["دوقلوی هوشمند", "گرامر", "اصلاح خطا"],
    media: [
      {
        url: "/images/grammar-notes.svg",
        file_type: "image/svg+xml",
        caption: "خلاصه بصری تفاوت حروف اضافه arrive at (اماکن مشخص) و arrive in (شهرها و کشورها)",
        alt_text: "نمودار مقایسه تصویری کاربرد arrive in برای شهرهای بزرگ و arrive at برای ساختمان‌ها و ایستگاه‌ها",
      }
    ],
    reactions: { like: 47, helpful: 33, inspiring: 22, insightful: 19 },
    commentsCount: 8,
    isSuitableForMinors: true,
  },
  {
    id: "post-question-1",
    authorId: "author-ali",
    authorName: "علی کاظمی",
    authorRole: "learner",
    isVerifiedTeacher: false,
    category: "question",
    categoryNameFa: "پرسش و پاسخ",
    titleFa: "تفاوت کاربردی بین دو واژه 'Economic' و 'Economical' در تسک ۲ رایتینگ آکادمیک",
    contentFa: "دوستان و اساتید گرامی، در توصیف راهکارهای صرفه‌جویی مالی در شهرها، آیا استفاده از Economic crisis و Economical solution صحیح است؟ چطور تفاوت این دو را ملکه ذهن کنیم؟",
    timeFa: "۶ ساعت پیش",
    tags: ["Writing Task 2", "واژگان", "IELTS"],
    reactions: { like: 18, helpful: 24, inspiring: 5, insightful: 12 },
    commentsCount: 9,
    isSuitableForMinors: true,
  }
];

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  "post-featured-1": [
    {
      id: "comm-1",
      postId: "post-featured-1",
      authorName: "نرگس تقوی",
      authorRole: "زبان‌آموز",
      content: "استاد این تکنیک فوق‌العاده بود. دیروز در آزمون آزمایشی دقیقاً از ۴ ربع استفاده کردم و دیگر وسط صحبت ساکت نماندم.",
      timeFa: "دیروز",
    },
    {
      id: "comm-2",
      postId: "post-featured-1",
      authorName: "احمد کبیری",
      authorRole: "مدرس زبان",
      content: "نکته بسیار سنجیده‌ای است. بنده هم در کلاس‌های اسپیکینگ همین فرمت نت‌برداری بدون جمله‌نویسی را تأکید می‌کنم.",
      timeFa: "۱۰ ساعت پیش",
    }
  ]
};

// Client-side PII detector for Iranian data
function detectPii(text: string): string[] {
  const findings: string[] = [];
  // Iranian phone
  if (/(?:(?:\+98|0098|0)?9\d{9})\b/.test(text)) {
    findings.push("شماره تلفن همراه (۰۹xx)");
  }
  // 16-digit card
  if (/\b(?:\d{4}[ -]?){3}\d{4}\b/.test(text)) {
    findings.push("شماره کارت بانکی ۱۶ رقمی");
  }
  // 10-digit national code
  if (/\b\d{10}\b/.test(text)) {
    findings.push("کد ملی ۱۰ رقمی");
  }
  return findings;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedAuthors, setBlockedAuthors] = useState<Set<string>>(new Set());
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  // Modals state
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetPost, setReportTargetPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState("privacy_or_pii_leak");
  const [reportDescription, setReportDescription] = useState("");

  // Moderation Drawer & Guidelines state
  const [isModQueueOpen, setIsModQueueOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [moderationQueue, setModerationQueue] = useState<ModerationReport[]>([
    {
      id: "mod-1",
      targetId: "post-learner-1",
      targetTitle: "چطور خطای arrive to را برطرف کردم",
      reason: "بررسی انطباق کپی‌رایت تصویر پیوست",
      slaHours: 12,
      slaText: "حداکثر ۱۲ ساعت (مهلت باقی‌مانده: ۹ ساعت)",
      status: "pending",
      contentSnapshot: "خلاصه بصری تفاوت حروف اضافه arrive at و arrive in...",
      timeFa: "۳ ساعت پیش",
    }
  ]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // New Post Form State
  const [postType, setPostType] = useState<PostCategory>("learner_post");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");
  const [planLicense, setPlanLicense] = useState<LicenseType>("cc_by_sa");
  const [planAttribution, setPlanAttribution] = useState("");
  const [planFormat, setPlanFormat] = useState("pdf");
  const [mediaAltText, setMediaAltText] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [isTeacherVerifiedInput, setIsTeacherVerifiedInput] = useState(true);

  // Live PII Detection on New Post inputs
  const piiMatches = useMemo(() => {
    const textToScan = `${postTitle} ${postContent} ${planAttribution}`;
    return detectPii(textToScan);
  }, [postTitle, postContent, planAttribution]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (blockedAuthors.has(p.authorId)) return false;
      const matchesCat =
        selectedCategory === "all" ||
        (selectedCategory === "featured" && p.isMonthlyFeatured) ||
        p.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.titleFa.toLowerCase().includes(q) ||
        p.contentFa.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery, blockedAuthors]);

  // Reaction Toggle Handler
  const handleToggleReaction = (postId: string, reactionType: "like" | "helpful" | "inspiring" | "insightful") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const current = post.userReaction;
        const isCurrent = current === reactionType;

        const nextReactions = { ...post.reactions };
        if (isCurrent) {
          nextReactions[reactionType] = Math.max(0, nextReactions[reactionType] - 1);
          return { ...post, userReaction: undefined, reactions: nextReactions };
        } else {
          if (current) {
            nextReactions[current] = Math.max(0, nextReactions[current] - 1);
          }
          nextReactions[reactionType] = nextReactions[reactionType] + 1;
          return { ...post, userReaction: reactionType, reactions: nextReactions };
        }
      })
    );
  };

  // Block Author Handler
  const handleBlockAuthor = (authorId: string, authorName: string) => {
    setBlockedAuthors((prev) => new Set(prev).add(authorId));
    showToast(`محتواهای ${authorName} از دید شما پنهان شد.`);
  };

  // Open Report Modal
  const handleOpenReport = (post: Post) => {
    setReportTargetPost(post);
    setReportReason("privacy_or_pii_leak");
    setReportDescription("");
    setIsReportModalOpen(true);
  };

  // Submit Report Handler
  const handleSubmitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reportTargetPost) return;

    const slaMap: Record<string, { hours: number; text: string }> = {
      privacy_or_pii_leak: { hours: 2, text: "حداکثر ۲ ساعت (اولویت بحرانی)" },
      inappropriate_for_minors: { hours: 2, text: "حداکثر ۲ ساعت (اولویت بحرانی)" },
      harassment_or_abuse: { hours: 12, text: "حداکثر ۱۲ ساعت (اولویت بالا)" },
      copyright_infringement: { hours: 12, text: "حداکثر ۱۲ ساعت (اولویت بالا)" },
      spam_or_solicitation: { hours: 24, text: "حداکثر ۲۴ ساعت (استاندارد)" },
      misinformation: { hours: 24, text: "حداکثر ۲۴ ساعت (استاندارد)" },
    };

    const sla = slaMap[reportReason] || { hours: 24, text: "حداکثر ۲۴ ساعت" };

    const newReport: ModerationReport = {
      id: `report-${Date.now()}`,
      targetId: reportTargetPost.id,
      targetTitle: reportTargetPost.titleFa,
      reason: reportReason,
      slaHours: sla.hours,
      slaText: sla.text,
      status: "pending",
      contentSnapshot: `[عنوان]: ${reportTargetPost.titleFa}\n[متن]: ${reportTargetPost.contentFa.slice(0, 180)}...`,
      timeFa: "هم‌اکنون",
    };

    setModerationQueue((prev) => [newReport, ...prev]);
    setIsReportModalOpen(false);
    showToast(`گزارش تخلف ثبت شد و به صف بازبینی ناظران رفت. مهلت رسیدگی: ${sla.text}`);
  };

  // Moderation Queue Actions
  const handleResolveReport = (reportId: string, action: "remove" | "warn" | "dismiss") => {
    setModerationQueue((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === "dismiss" ? "dismissed" : "resolved" } : r))
    );

    if (action === "remove") {
      const report = moderationQueue.find((r) => r.id === reportId);
      if (report) {
        setPosts((prev) => prev.filter((p) => p.id !== report.targetId));
        showToast("محتوای متخلف از دید عموم حذف شد؛ مستندات در لاگ نظارتی حفظ گردید.");
      }
    } else if (action === "warn") {
      showToast("اخطار رسمی رعایت شیوه‌نامه برای نویسنده ارسال شد.");
    } else {
      showToast("گزارش پس از بازبینی فاقد تخلف تشخیص داده شد و رد گردید.");
    }
  };

  // Add Comment Handler
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const piiFound = detectPii(newCommentText);
    if (piiFound.length > 0) {
      alert(`خطای حریم خصوصی: ارسال نظر به علت وجود اطلاعات حساس (${piiFound.join("، ")}) مجاز نیست.`);
      return;
    }

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName: "زبان‌آموز اندورا",
      authorRole: "زبان‌آموز",
      content: newCommentText.trim(),
      timeFa: "هم‌اکنون",
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    setNewCommentText("");
    showToast("نظر شما ثبت شد.");
  };

  // Create Post Handler
  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("لطفاً عنوان و متن پست را وارد کنید.");
      return;
    }

    if (piiMatches.length > 0) {
      alert(`خطای حریم خصوصی: محتوای شما شامل ${piiMatches.join("، ")} است. لطفاً پیش از انتشار، اطلاعات هویتی و تماس را حذف کنید.`);
      return;
    }

    if (postType === "teacher_experience" && !isTeacherVerifiedInput) {
      alert("انتخاب دسته‌بندی 'تجربه استاد' تنها برای اساتید دارای برچسب تأیید مجاز است.");
      return;
    }

    if (postType === "lesson_plan") {
      if (!planAttribution.trim()) {
        alert("ذکر نام مؤلف و منبع حقوقی در بخش انتساب کپی‌رایت الزامی است.");
        return;
      }
    }

    const categoryNames: Record<PostCategory, string> = {
      all: "عمومی",
      teacher_experience: "تجربه استاد",
      lesson_plan: "طرح درس و منابع",
      question: "پرسش و پاسخ",
      learner_post: "پست زبان‌آموز",
      featured: "برگزیده ماه",
    };

    const newPostItem: Post = {
      id: `post-${Date.now()}`,
      authorId: `author-${Date.now()}`,
      authorName: postType === "teacher_experience" ? "استاد محمدی" : "زبان‌آموز اندورا",
      authorRole: postType === "teacher_experience" ? "teacher" : "learner",
      isVerifiedTeacher: postType === "teacher_experience",
      category: postType,
      categoryNameFa: categoryNames[postType],
      titleFa: postTitle.trim(),
      contentFa: postContent.trim(),
      timeFa: "هم‌اکنون",
      tags: postTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      reactions: { like: 1, helpful: 0, inspiring: 0, insightful: 0 },
      commentsCount: 0,
      isSuitableForMinors: true,
      ...(postType === "lesson_plan"
        ? {
            lessonPlan: {
              license_type: planLicense,
              copyright_attribution: planAttribution.trim(),
              file_format: planFormat,
              file_size: "۱.۸ مگابایت",
              file_url: "#download-plan",
              target_skill: "آموزش جامع",
              grade_level: "عمومی / کنکور",
            },
          }
        : {}),
      ...(mediaCaption && mediaAltText
        ? {
            media: [
              {
                url: "/images/post-upload.svg",
                file_type: "image/svg+xml",
                caption: mediaCaption.trim(),
                alt_text: mediaAltText.trim(),
              },
            ],
          }
        : {}),
    };

    setPosts([newPostItem, ...posts]);
    setIsNewPostOpen(false);
    // Reset inputs
    setPostTitle("");
    setPostContent("");
    setPostTags("");
    setPlanAttribution("");
    setMediaAltText("");
    setMediaCaption("");
    showToast("پست شما با موفقیت در جامعه یادگیری اندورا منتشر شد.");
  };

  return (
    <PublicShell locale="fa" currentPath="/community">
      <div className={styles.container} dir="rtl">
        {/* Toast Alert */}
        {toastMessage && (
          <div className={styles.toast} role="status" aria-live="polite">
            ✓ {toastMessage}
          </div>
        )}

        {/* Hero Section */}
        <section className={styles.hero} aria-labelledby="community-heading">
          <span className={styles.heroBadge}>
            🛡️ محیط یادگیری امن و محافظت‌شده
          </span>
          <h1 id="community-heading" className={styles.heroTitle}>
            جامعه یادگیری و هم‌افزایی زبان‌آموزان و اساتید
          </h1>
          <p className={styles.heroSubtitle}>
            تجربیات واقعی یادگیری، پرسش و پاسخ‌های زبانی، طرح درس‌های معتبر با رعایت کپی‌رایت، و رفع تله‌های L1 بدون هرزنامه و در امنیت کامل.
          </p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsNewPostOpen(true)}
            >
              ✏️ ارسال گفتگوی جدید
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setIsGuidelinesOpen(true)}
            >
              📜 شیوه‌نامه ایمنی و کپی‌رایت
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setIsModQueueOpen(!isModQueueOpen)}
            >
              ⚖️ صف نظارت و بازبینی ({moderationQueue.filter((r) => r.status === "pending").length})
            </button>
          </div>
        </section>

        {/* Moderation Queue Drawer (Inspectable for Staff / QA) */}
        {isModQueueOpen && (
          <section className={styles.moderationPanel} aria-labelledby="mod-panel-heading">
            <div className={styles.queueHeader}>
              <h2 id="mod-panel-heading" className={styles.modalTitle}>
                صف بازبینی و نظارت ناظران (Moderation Queue & SLA Engine)
              </h2>
              <span className={styles.typeBadge}>
                {moderationQueue.filter((r) => r.status === "pending").length} گزارش در انتظار رسیدگی
              </span>
            </div>
            <p className={styles.heroSubtitle} style={{ fontSize: "0.85rem" }}>
              گزارش‌های تخلف بر اساس تعهد زمانی رسیدگی (SLA) مرتب شده‌اند. گزارش‌های نشت حریم خصوصی یا خردسالان دارای اولویت ۲ ساعته هستند.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {moderationQueue.map((report) => (
                <div key={report.id} className={styles.queueCard}>
                  <div className={styles.queueHeader}>
                    <div>
                      <strong>هدف: {report.targetTitle}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                        دلیل: {report.reason} • {report.timeFa}
                      </div>
                    </div>
                    <span className={`${styles.slaTag} ${report.slaHours <= 2 ? styles.slaUrgent : ""}`}>
                      ⏱️ {report.slaText}
                    </span>
                  </div>

                  <div className={styles.queueContent}>
                    {report.contentSnapshot}
                  </div>

                  {report.status === "pending" ? (
                    <div className={styles.queueActions}>
                      <button
                        type="button"
                        className={`${styles.btnSm} ${styles.btnDanger}`}
                        onClick={() => handleResolveReport(report.id, "remove")}
                      >
                        🗑️ حذف محتوا از دید عموم
                      </button>
                      <button
                        type="button"
                        className={styles.btnSm}
                        onClick={() => handleResolveReport(report.id, "warn")}
                      >
                        ⚠️ ارسال اخطار رسمی
                      </button>
                      <button
                        type="button"
                        className={styles.btnSm}
                        onClick={() => handleResolveReport(report.id, "dismiss")}
                      >
                        ✓ رد گزارش (فاقد تخلف)
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                      وضعیت: {report.status === "resolved" ? "رسیدگی شد" : "رد شد"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Monthly Featured Post Showcase */}
        {posts.some((p) => p.isMonthlyFeatured) && (
          <section aria-labelledby="featured-heading">
            {posts
              .filter((p) => p.isMonthlyFeatured)
              .slice(0, 1)
              .map((feat) => (
                <article key={feat.id} className={styles.featuredCard}>
                  <div className={styles.featuredHeader}>
                    <span className={styles.featuredPill}>
                      ⭐ پست برگزیده ماه — انتخاب تیم تحریریه
                    </span>
                    <span className={styles.postTime}>
                      ارزیابی شده توسط: {feat.featuredCurator}
                    </span>
                  </div>

                  <h2 id="featured-heading" className={styles.featuredTitle}>
                    {feat.titleFa}
                  </h2>

                  <div className={styles.featuredNotes}>
                    <strong>یادداشت رسمی تیم تحریریه:</strong>
                    <span>{feat.featuredNotes}</span>
                  </div>

                  <p className={styles.postText}>
                    {feat.contentFa}
                  </p>

                  <div className={styles.postFooter}>
                    <div className={styles.reactionsRow}>
                      <button
                        type="button"
                        className={`${styles.reactionBtn} ${feat.userReaction === "helpful" ? styles.reactionBtnActive : ""}`}
                        onClick={() => handleToggleReaction(feat.id, "helpful")}
                      >
                        💡 کاربردی ({feat.reactions.helpful})
                      </button>
                      <button
                        type="button"
                        className={`${styles.reactionBtn} ${feat.userReaction === "inspiring" ? styles.reactionBtnActive : ""}`}
                        onClick={() => handleToggleReaction(feat.id, "inspiring")}
                      >
                        🌱 الهام‌بخش ({feat.reactions.inspiring})
                      </button>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === feat.id ? null : feat.id)}
                      >
                        💬 دیدگاه‌ها ({feat.commentsCount})
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        )}

        {/* Controls: Search & Category Tabs */}
        <section className={styles.controlsRow} aria-label="فیلتر و جستجوی پست‌ها">
          <input
            type="search"
            className={styles.searchBar}
            placeholder="جستجو در میان گفتگوها، تجربیات اساتید، طرح درس‌ها و واژگان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="جستجوی پست‌های جامعه"
          />

          <div className={styles.topicTabs} role="tablist">
            {[
              { id: "all", label: "همه گفتگوها" },
              { id: "teacher_experience", label: "تجربه‌های اساتید" },
              { id: "lesson_plan", label: "طرح درس و منابع" },
              { id: "question", label: "پرسش و پاسخ" },
              { id: "learner_post", label: "پست‌های زبان‌آموزان" },
              { id: "featured", label: "برگزیده‌های ماه" },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={selectedCategory === tab.id}
                className={`${styles.topicTab} ${selectedCategory === tab.id ? styles.topicTabActive : ""}`}
                onClick={() => setSelectedCategory(tab.id as PostCategory)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Feed List */}
        <section className={styles.feedGrid} aria-label="فهرست پست‌های جامعه">
          {filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>پستی با این مشخصات یا در این دسته‌بندی یافت نشد.</p>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                مشاهده همه گفتگوها
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`${styles.postCard} ${post.isPinned ? styles.postCardPinned : ""}`}
              >
                {/* Header */}
                <div className={styles.postHeader}>
                  <div className={styles.authorMeta}>
                    <div className={styles.authorAvatar} aria-hidden="true">
                      {post.authorName.slice(0, 1)}
                    </div>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorNameRow}>
                        <span className={styles.authorName}>{post.authorName}</span>
                        {post.isVerifiedTeacher && (
                          <span className={styles.teacherBadge} title="مدرس احراز هویت شده">
                            ✓ استاد تأییدشده
                          </span>
                        )}
                        <span className={styles.roleBadge}>
                          {post.authorRole === "teacher" ? "استاد" : "زبان‌آموز"}
                        </span>
                      </div>
                      <span className={styles.postTime}>{post.timeFa}</span>
                    </div>
                  </div>

                  <div className={styles.headerBadges}>
                    <span className={styles.typeBadge}>{post.categoryNameFa}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.postContent}>
                  <h3 className={styles.postTitle}>{post.titleFa}</h3>
                  <p className={styles.postText}>{post.contentFa}</p>

                  {/* Media Attachment if available */}
                  {post.media && post.media.length > 0 && (
                    <div className={styles.mediaBox}>
                      <div className={styles.mediaCaption}>
                        📷 <strong>پیوست رسانه‌ای:</strong> {post.media[0].caption}
                      </div>
                      <span className={styles.altBadge} title={post.media[0].alt_text}>
                        دسترسی‌پذیری: {post.media[0].alt_text}
                      </span>
                    </div>
                  )}

                  {/* Lesson Plan metadata if available */}
                  {post.lessonPlan && (
                    <div className={styles.lessonPlanBox}>
                      <div className={styles.lessonPlanDetails}>
                        <div className={styles.lessonPlanTitle}>
                          📄 {post.lessonPlan.target_skill} — {post.lessonPlan.grade_level}
                        </div>
                        <div className={styles.lessonPlanMeta}>
                          فرمت: {post.lessonPlan.file_format.toUpperCase()} • حجم: {post.lessonPlan.file_size}
                          <span className={styles.licenseTag}>
                            حقوق اثر: {post.lessonPlan.license_type === "cc_by_sa" ? "CC BY-SA 4.0" : "Original"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginBlockStart: "4px" }}>
                          انتساب: {post.lessonPlan.copyright_attribution}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => showToast(`دریافت فایل ${post.lessonPlan?.file_format.toUpperCase()} آغاز شد.`)}
                      >
                        📥 دانلود فایل ({post.lessonPlan.file_size})
                      </button>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBlockStart: "var(--space-2)" }}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.roleBadge}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer / Reactions & Actions */}
                <div className={styles.postFooter}>
                  <div className={styles.reactionsRow}>
                    <button
                      type="button"
                      className={`${styles.reactionBtn} ${post.userReaction === "like" ? styles.reactionBtnActive : ""}`}
                      onClick={() => handleToggleReaction(post.id, "like")}
                      aria-label="مفید و لایک"
                    >
                      👍 ({post.reactions.like})
                    </button>
                    <button
                      type="button"
                      className={`${styles.reactionBtn} ${post.userReaction === "helpful" ? styles.reactionBtnActive : ""}`}
                      onClick={() => handleToggleReaction(post.id, "helpful")}
                      aria-label="راهگشا و کاربردی"
                    >
                      💡 ({post.reactions.helpful})
                    </button>
                    <button
                      type="button"
                      className={`${styles.reactionBtn} ${post.userReaction === "inspiring" ? styles.reactionBtnActive : ""}`}
                      onClick={() => handleToggleReaction(post.id, "inspiring")}
                      aria-label="الهام‌بخش"
                    >
                      🌱 ({post.reactions.inspiring})
                    </button>
                    <button
                      type="button"
                      className={`${styles.reactionBtn} ${post.userReaction === "insightful" ? styles.reactionBtnActive : ""}`}
                      onClick={() => handleToggleReaction(post.id, "insightful")}
                      aria-label="عمیق و نکته‌آموز"
                    >
                      🎯 ({post.reactions.insightful})
                    </button>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                    >
                      💬 دیدگاه‌ها ({post.commentsCount})
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => handleOpenReport(post)}
                      title="گزارش تخلف یا نقض قوانین"
                    >
                      🚩 گزارش
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => handleBlockAuthor(post.authorId, post.authorName)}
                      title="پنهان‌سازی پست‌های این نویسنده"
                    >
                      🚫 مسدود
                    </button>
                  </div>
                </div>

                {/* Comments Section Drawer */}
                {expandedCommentsPostId === post.id && (
                  <div className={styles.commentsDrawer}>
                    <div className={styles.commentList}>
                      {(commentsMap[post.id] || []).length === 0 ? (
                        <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", padding: "var(--space-2)" }}>
                          هنوز دیدگاهی برای این گفتگو ثبت نشده است. اولین نظر را شما بنویسید!
                        </div>
                      ) : (
                        (commentsMap[post.id] || []).map((comm) => (
                          <div key={comm.id} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                              <span className={styles.commentAuthor}>{comm.authorName} ({comm.authorRole})</span>
                              <span className={styles.commentTime}>{comm.timeFa}</span>
                            </div>
                            <div className={styles.commentBody}>{comm.content}</div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={styles.commentInputRow}>
                      <input
                        type="text"
                        className={styles.commentField}
                        placeholder="دیدگاه یا نکته آموزشی خود را بنویسید (حاوی اطلاعات تماس نباشد)..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                      />
                      <button
                        type="button"
                        className={styles.primaryBtn}
                        style={{ minInlineSize: "5rem" }}
                        onClick={() => handleAddComment(post.id)}
                      >
                        ارسال
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </section>

        {/* Modal: New Post Dialog */}
        {isNewPostOpen && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="new-post-title">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 id="new-post-title" className={styles.modalTitle}>
                  ارسال گفتگوی جدید در جامعه اندورا
                </h2>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsNewPostOpen(false)}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} className={styles.modalBody}>
                {/* Real-time PII Alert Warning */}
                {piiMatches.length > 0 && (
                  <div className={styles.piiAlert} role="alert">
                    <div className={styles.piiAlertTitle}>
                      ⚠️ هشدار حریم خصوصی: اطلاعات حساس شناسایی شد!
                    </div>
                    <p className={styles.piiAlertText}>
                      محتوای واردشده حاوی <strong>{piiMatches.join("، ")}</strong> است. طبق شیوه‌نامه جامعه اندورا، انتشار اطلاعات تماس، کدهای هویتی و شماره حساب در فضای عمومی برای حفظ امنیت شما ممنوع است. لطفاً پیش از ارسال، این اطلاعات را حذف کنید.
                    </p>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="post-type-select" className={styles.formLabel}>نوع مطلب:</label>
                  <select
                    id="post-type-select"
                    className={styles.formSelect}
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as PostCategory)}
                  >
                    <option value="learner_post">پست و تجربه زبان‌آموز</option>
                    <option value="teacher_experience">تجربه استاد (نیازمند تأییدیه تدریس)</option>
                    <option value="lesson_plan">طرح درس و منبع آموزشی (با لایسنس کپی‌رایت)</option>
                    <option value="question">پرسش و رفع اشکال زبانی</option>
                  </select>
                </div>

                {postType === "teacher_experience" && (
                  <div className={styles.formGroup} style={{ background: "var(--color-surface-subtle)", padding: "var(--space-3)", borderRadius: "var(--radius-control)" }}>
                    <label className={styles.formLabel}>احراز هویت تدریس:</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.85rem" }}>
                      <input
                        type="checkbox"
                        id="verify-teacher-cb"
                        checked={isTeacherVerifiedInput}
                        onChange={(e) => setIsTeacherVerifiedInput(e.target.checked)}
                      />
                      <label htmlFor="verify-teacher-cb">مدرک و مشخصات تدریس من در پنل اساتید تأیید شده است.</label>
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="post-title-input" className={styles.formLabel}>عنوان گفتگو:</label>
                  <input
                    id="post-title-input"
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: روش خلاصه یادداشت‌برداری برای تسک ۱ رایتینگ"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="post-content-input" className={styles.formLabel}>متن کامل مطلب:</label>
                  <textarea
                    id="post-content-input"
                    className={styles.formTextarea}
                    placeholder="نکات، تجربیات یا پرسش خود را به زبان فارسی یا انگلیسی بنویسید..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                  />
                </div>

                {/* Lesson Plan extra fields */}
                {postType === "lesson_plan" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", border: "1px dashed var(--color-border)", padding: "var(--space-3)", borderRadius: "var(--radius-control)" }}>
                    <div className={styles.formGroup}>
                      <label htmlFor="license-select" className={styles.formLabel}>نوع لایسنس اثر (الزامی):</label>
                      <select
                        id="license-select"
                        className={styles.formSelect}
                        value={planLicense}
                        onChange={(e) => setPlanLicense(e.target.value as LicenseType)}
                      >
                        <option value="cc_by_sa">کرییتیو کامنز با ذکر منبع و اشتراک مشابه (CC BY-SA 4.0)</option>
                        <option value="original_editorial">اثر اصیل آموزشی پدیدآورنده (Original)</option>
                        <option value="cc_by">کرییتیو کامنز با ذکر منبع (CC BY 4.0)</option>
                        <option value="educational_fair_use">استفاده منصفانه آموزشی (Fair Use)</option>
                        <option value="public_domain">مالکیت عمومی (Public Domain)</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="attribution-input" className={styles.formLabel}>نام پدیدآورنده و مرجع حقوقی (Attribution):</label>
                      <input
                        id="attribution-input"
                        type="text"
                        className={styles.formInput}
                        placeholder="مثال: استاد علیرضا کیانی — بر مبنای کتاب Grammar in Use"
                        value={planAttribution}
                        onChange={(e) => setPlanAttribution(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="format-select" className={styles.formLabel}>فرمت فایل پیوست:</label>
                      <select
                        id="format-select"
                        className={styles.formSelect}
                        value={planFormat}
                        onChange={(e) => setPlanFormat(e.target.value)}
                      >
                        <option value="pdf">PDF (سند الکترونیکی)</option>
                        <option value="docx">DOCX (سند متنی مایکروسافت ورد)</option>
                        <option value="epub">EPUB (کتابخوان)</option>
                        <option value="zip">ZIP (بسته چندرسانه‌ای)</option>
                        <option value="mp3">MP3 (صوت آموزشی)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Media Attachment fields */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>پیوست تصویر آموزشی (اختیاری):</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="زیرنویس تصویر (Caption)"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="متن جایگزین دسترسی‌پذیری (Alt Text برای افراد دارای معلولیت)"
                    value={mediaAltText}
                    onChange={(e) => setMediaAltText(e.target.value)}
                    style={{ marginBlockStart: "var(--space-2)" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tags-input" className={styles.formLabel}>برچسب‌ها (با کاما جدا کنید):</label>
                  <input
                    id="tags-input"
                    type="text"
                    className={styles.formInput}
                    placeholder="IELTS, گرامر, لغت, Vision 3"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setIsNewPostOpen(false)}
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={piiMatches.length > 0}
                  >
                    انتشار مطلب
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Report Post Dialog */}
        {isReportModalOpen && reportTargetPost && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="report-title">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 id="report-title" className={styles.modalTitle}>
                  گزارش تخلف به تیم نظارت و ایمنی اندورا
                </h2>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsReportModalOpen(false)}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className={styles.modalBody}>
                <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  گزارش برای مطلب: <strong>{reportTargetPost.titleFa}</strong>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reason-select" className={styles.formLabel}>دلیل تخلف:</label>
                  <select
                    id="reason-select"
                    className={styles.formSelect}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                    <option value="privacy_or_pii_leak">نشت اطلاعات هویتی یا خصوصی زبان‌آموز (SLA: حداکثر ۲ ساعت)</option>
                    <option value="inappropriate_for_minors">محتوای نامناسب برای رده سنی خردسالان و نوجوانان (SLA: حداکثر ۲ ساعت)</option>
                    <option value="harassment_or_abuse">مزاحمت، توهین یا تمسخر سطح زبانی (SLA: حداکثر ۱۲ ساعت)</option>
                    <option value="copyright_infringement">نقض کپی‌رایت و استفاده غیرمجاز از منابع (SLA: حداکثر ۱۲ ساعت)</option>
                    <option value="spam_or_solicitation">اسپم، تبلیغات نامرتبط یا تقلب (SLA: حداکثر ۲۴ ساعت)</option>
                    <option value="misinformation">اطلاعات نادرست و گمراه‌کننده آموزشی (SLA: حداکثر ۲۴ ساعت)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="report-notes" className={styles.formLabel}>توضیحات تکمیلی برای ناظران:</label>
                  <textarea
                    id="report-notes"
                    className={styles.formTextarea}
                    placeholder="بخش دارای تخلف یا جزییات ادعای کپی‌رایت را تشریح فرمایید..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setIsReportModalOpen(false)}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.primaryBtn}>
                    ثبت و ارسال به صف بازبینی
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Community Guidelines Dialog */}
        {isGuidelinesOpen && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="guidelines-title">
            <div className={styles.modal} style={{ maxInlineSize: "44rem" }}>
              <div className={styles.modalHeader}>
                <h2 id="guidelines-title" className={styles.modalTitle}>
                  شیوه‌نامه ایمنی جامعه و تعهدات کپی‌رایت اندورا
                </h2>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsGuidelinesOpen(false)}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody} style={{ fontSize: "0.9rem", lineHeight: "1.7" }}>
                <section>
                  <h3 style={{ fontWeight: 800, marginBlockEnd: "var(--space-1)" }}>۱. حفاظت از حریم خصوصی (PII Guard)</h3>
                  <p style={{ margin: 0, color: "var(--color-muted)" }}>
                    انتشار هرگونه شماره تلفن، کد ملی، شماره کارت بانکی یا داده‌های خصوصی دوقلوی هوشمند زبان‌آموز اکیداً ممنوع است و توسط سیستم شناسایی بلادرنگ بلاک می‌شود.
                  </p>
                </section>

                <section style={{ marginBlockStart: "var(--space-3)" }}>
                  <h3 style={{ fontWeight: 800, marginBlockEnd: "var(--space-1)" }}>۲. ایمنی کودکان و نوجوانان</h3>
                  <p style={{ margin: 0, color: "var(--color-muted)" }}>
                    جهت جلوگیری از هرگونه ارتباط ناسالم، ارتباط پیام خصوصی (Direct Messages) در سامانه وجود ندارد. گزارش‌های مرتبط با خردسالان با اولویت ۲ ساعته رسیدگی می‌شوند.
                  </p>
                </section>

                <section style={{ marginBlockStart: "var(--space-3)" }}>
                  <h3 style={{ fontWeight: 800, marginBlockEnd: "var(--space-1)" }}>۳. الزامات کپی‌رایت و دانلود منابع</h3>
                  <p style={{ margin: 0, color: "var(--color-muted)" }}>
                    کلیه طرح درس‌ها ملزم به داشتن لایسنس معتبر (CC BY-SA یا Original) و ذکر نام پدیدآورنده هستند. برای اعلامیه نقض حق نشر می‌توانید با <code>copyright@endoora.ir</code> مکاتبه فرمایید.
                  </p>
                </section>

                <section style={{ marginBlockStart: "var(--space-3)" }}>
                  <h3 style={{ fontWeight: 800, marginBlockEnd: "var(--space-1)" }}>۴. تعهدات زمانی رسیدگی به تخلفات (SLA)</h3>
                  <div style={{ background: "var(--color-surface-subtle)", padding: "var(--space-3)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
                    <div>• <strong>نشت اطلاعات هویتی و خردسالان:</strong> رسیدگی ظرف حداکثر ۲ ساعت</div>
                    <div>• <strong>مزاحمت و نقض کپی‌رایت:</strong> رسیدگی ظرف حداکثر ۱۲ ساعت</div>
                    <div>• <strong>اسپم و موارد متفرقه:</strong> رسیدگی ظرف حداکثر ۲۴ ساعت</div>
                  </div>
                </section>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => setIsGuidelinesOpen(false)}
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
