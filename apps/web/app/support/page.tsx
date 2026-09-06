"use client";

import { useState, useMemo, type FormEvent } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./support.module.css";

type TicketCategory = "payments" | "account" | "security" | "courses" | "technical" | "community" | "other";
type TicketStatus = "new" | "ai_answered" | "escalated" | "resolved" | "closed";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpfulCount: number;
  userVoted?: boolean;
}

interface TicketMessage {
  id: string;
  senderType: "user" | "ai_agent" | "staff";
  senderName: string;
  body: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  category: TicketCategory;
  categoryDisplay: string;
  title: string;
  description: string;
  status: TicketStatus;
  statusDisplay: string;
  escalatedToHuman: boolean;
  citedFaq?: {
    question: string;
    answer: string;
  };
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "placement",
    question: "آزمون تعیین سطح هوشمند اندورا چگونه کار می‌کند؟",
    answer: "آزمون تعیین سطح اندورا یک سیستم چندمرحله‌ای و تطبیقی است که مهارت‌های شنیداری، خواندن و ساختارهای دستوری شما را ارزیابی کرده و کارنامه تفصیلی به همراه نقشه یادگیری اختصاصی صادر می‌کند.",
    helpfulCount: 142,
  },
  {
    id: "faq-2",
    category: "courses",
    question: "چگونه می‌توانم در دوره‌های آمادگی آزمون آیلتس شرکت کنم؟",
    answer: "پس از ورود به حساب کاربری، به بخش «دوره‌ها» بروید. دوره آیلتس آکادمیک یا جنرال را متناسب با سطح خود انتخاب نمایید. دسترسی به دروس تعاملی، تمرین‌های تصحیح رایتینگ و فیدبک هوشمند بلافاصله فعال می‌شود.",
    helpfulCount: 98,
  },
  {
    id: "faq-3",
    category: "teachers",
    question: "چگونه مدرسان در اندورا اعتبارسنجی می‌شوند؟",
    answer: "تمام مدرسان اندورا مدارک بین‌المللی تدریس (نظیر CELTA/DELTA/TTC)، پیشینه تحصیلی و سوابق کلاسی را بارگذاری نموده و پس از ارزیابی مصاحبه و احراز هویت، نشان تایید شده (Verified Teacher) دریافت می‌کنند.",
    helpfulCount: 76,
  },
  {
    id: "faq-4",
    category: "billing",
    question: "آیا اشتراک پس از اتمام دوره تمدید خودکار می‌شود؟",
    answer: "خیر، جهت احترام به حقوق کاربران هیچ‌گونه تمدید خودکار پنهان وجود ندارد. پیش از اتمام دوره، یادآور پیامکی و ایمیلی ارسال شده و تمدید صرفاً با تایید مستقیم و پرداخت مجدد شما انجام می‌پذیرد.",
    helpfulCount: 114,
  },
  {
    id: "faq-5",
    category: "security",
    question: "چگونه می‌توانم نشست‌های فعال و امنیت حساب کاربری خود را مدیریت کنم؟",
    answer: "در بخش «حساب کاربری > امنیت و نشست‌ها» می‌توانید تمام دستگاه‌های متصل، آدرس‌های IP و تاریخچه ورود خود را مشاهده نموده و با یک کلیک نشست‌های مشکوک یا ناشناس را خاتمه دهید.",
    helpfulCount: 88,
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tick-101",
    category: "courses",
    categoryDisplay: "دوره‌ها و یادگیری",
    title: "سوال در مورد نحوه شروع دوره آیلتس",
    description: "من در آزمون تعیین سطح نمره B2 گرفتم؛ برای ورود به دوره آیلتس باید چه کار کنم؟",
    status: "ai_answered",
    statusDisplay: "پاسخ هوشمند با استناد به راهنما",
    escalatedToHuman: false,
    citedFaq: {
      question: "چگونه می‌توانم در دوره‌های آمادگی آزمون آیلتس شرکت کنم؟",
      answer: "پس از ورود به حساب کاربری، به بخش «دوره‌ها» بروید. دوره آیلتس آکادمیک یا جنرال را انتخاب نمایید. دسترسی به دروس تعاملی، تمرین‌های تصحیح رایتینگ و فیدبک هوشمند بلافاصله فعال می‌شود.",
    },
    messages: [
      {
        id: "m-1",
        senderType: "user",
        senderName: "شما",
        body: "من در آزمون تعیین سطح نمره B2 گرفتم؛ برای ورود به دوره آیلتس باید چه کار کنم؟",
        createdAt: "۱۰:۱۵ - امروز",
      },
      {
        id: "m-2",
        senderType: "ai_agent",
        senderName: "دستیار هوشمند اندورا",
        body: "با سلام. بر اساس پایگاه دانش اندورا، راهنمای مرتبط با سوال شما به شرح زیر است:\n\nبرای ثبت‌نام دوره آیلتس پس از ورود به سامانه به تب دوره‌ها بروید و سطح مناسب را انتخاب فرمایید.",
        createdAt: "۱۰:۱۶ - امروز",
      },
    ],
    createdAt: "۱۴۰۳/۰۶/۱۶ - ۱۰:۱۵",
    updatedAt: "۱۴۰۳/۰۶/۱۶ - ۱۰:۱۶",
  },
  {
    id: "tick-102",
    category: "payments",
    categoryDisplay: "پرداخت و امور مالی",
    title: "عدم فعال‌سازی اشتراک پس از تراکنش بانکی",
    description: "مبلغ دوره از حساب کسر شد اما وضعیت اشتراک در پروفایل به روز نشده است.",
    status: "escalated",
    statusDisplay: "ارجاع به کارشناس پشتیبانی",
    escalatedToHuman: true,
    messages: [
      {
        id: "m-3",
        senderType: "user",
        senderName: "شما",
        body: "مبلغ دوره از حساب کسر شد اما وضعیت اشتراک در پروفایل به روز نشده است.",
        createdAt: "دیروز - ۱۸:۳۰",
      },
      {
        id: "m-4",
        senderType: "ai_agent",
        senderName: "دستیار هوشمند اندورا",
        body: "درخواست شما مربوط به امور مالی و تراکنش بانکی است و بر اساس پروتکل‌های ایمنی، مستقیماً جهت بررسی به کارشناس ارشد پشتیبانی ارجاع داده شد.",
        createdAt: "دیروز - ۱۸:۳۰",
      },
      {
        id: "m-5",
        senderType: "staff",
        senderName: "کارشناس پشتیبانی (فرهادی)",
        body: "سلام و احترام. شماره پیگیری تراکنش شما از درگاه بررسی شد؛ اشتراک فعال گردید و صورتحساب به ایمیل شما ارسال شد.",
        createdAt: "دیروز - ۱۹:۱۰",
      },
    ],
    createdAt: "۱۴۰۳/۰۶/۱۵ - ۱۸:۳۰",
    updatedAt: "۱۴۰۳/۰۶/۱۵ - ۱۹:۱۰",
  },
];

export default function SupportPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // New ticket form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TicketCategory>("courses");
  const [newDesc, setNewDesc] = useState("");
  const [ticketReply, setTicketReply] = useState("");

  const isFinancialOrSecurity = newCategory === "payments" || newCategory === "security" || newCategory === "account";

  // Filtered FAQ
  const filteredFaqs = useMemo(() => {
    const q = faqSearch.toLowerCase().trim();
    return faqs.filter((f) => {
      if (activeFaqCategory !== "all" && f.category !== activeFaqCategory) {
        return false;
      }
      if (!q) return true;
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    });
  }, [faqs, faqSearch, activeFaqCategory]);

  const handleVoteHelpful = (id: string) => {
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === id && !f.userVoted) {
          return { ...f, helpfulCount: f.helpfulCount + 1, userVoted: true };
        }
        return f;
      })
    );
  };

  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    let initialStatus: TicketStatus = "new";
    let statusDisplay = "در انتظار بررسی";
    let escalatedToHuman = false;
    let citedFaq: { question: string; answer: string } | undefined = undefined;

    const initialMessages: TicketMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        senderType: "user",
        senderName: "شما",
        body: newDesc.trim(),
        createdAt: "هم‌اکنون",
      },
    ];

    if (isFinancialOrSecurity) {
      // Mandatory escalation to human staff
      initialStatus = "escalated";
      statusDisplay = "ارجاع به کارشناس پشتیبانی";
      escalatedToHuman = true;
      initialMessages.push({
        id: `msg-${Date.now()}-2`,
        senderType: "ai_agent",
        senderName: "دستیار هوشمند اندورا",
        body: "درخواست شما مربوط به موضوعات حساس مالی یا امنیتی است. جهت حفظ حریم خصوصی، سیستم هوش مصنوعی از مداخله خودداری کرده و تیکت مستقیماً به کارشناس ارشد ارجاع داده شد.",
        createdAt: "هم‌اکنون",
      });
    } else {
      // Check if matches an existing published FAQ
      const matched = faqs.find(
        (f) =>
          f.question.includes(newTitle) ||
          newTitle.includes("آیلتس") && f.question.includes("آیلتس") ||
          newTitle.includes("تعیین سطح") && f.question.includes("تعیین سطح")
      );

      if (matched) {
        initialStatus = "ai_answered";
        statusDisplay = "پاسخ هوشمند با استناد به راهنما";
        citedFaq = { question: matched.question, answer: matched.answer };
        initialMessages.push({
          id: `msg-${Date.now()}-2`,
          senderType: "ai_agent",
          senderName: "دستیار هوشمند اندورا",
          body: `با سلام. بر اساس بررسی خودکار، راهنمای زیر ممکن است پاسخ شما باشد:\n\n📌 **${matched.question}**\n${matched.answer}\n\nدر صورتی که نیاز به راهنمایی بیشتری دارید، می‌توانید با زدن دکمه «ارجاع به پشتیبان انسانی» تیکت را به کارشناس منتقل فرمایید.`,
          createdAt: "هم‌اکنون",
        });
      } else {
        initialStatus = "escalated";
        statusDisplay = "ارجاع به کارشناس پشتیبانی";
        escalatedToHuman = true;
        initialMessages.push({
          id: `msg-${Date.now()}-2`,
          senderType: "ai_agent",
          senderName: "دستیار هوشمند اندورا",
          body: "درخواست شما ثبت شد و جهت پاسخگویی در صف بررسی کارشناسان قرار گرفت.",
          createdAt: "هم‌اکنون",
        });
      }
    }

    const categoryNames: Record<TicketCategory, string> = {
      payments: "پرداخت و امور مالی",
      account: "حساب کاربری",
      security: "امنیت و دسترسی",
      courses: "دوره‌ها و یادگیری",
      technical: "مشکلات فنی پلتفرم",
      community: "جامعه و گزارش‌ها",
      other: "سایر موارد",
    };

    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      category: newCategory,
      categoryDisplay: categoryNames[newCategory],
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: initialStatus,
      statusDisplay,
      escalatedToHuman,
      citedFaq,
      messages: initialMessages,
      createdAt: "هم‌اکنون",
      updatedAt: "هم‌اکنون",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setIsTicketModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleEscalateToHuman = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages: TicketMessage[] = [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              senderType: "user",
              senderName: "شما",
              body: "درخواست ارجاع تیکت به پشتیبان انسانی ثبت شد.",
              createdAt: "هم‌اکنون",
            },
          ];
          return {
            ...t,
            status: "escalated",
            statusDisplay: "ارجاع به کارشناس پشتیبانی",
            escalatedToHuman: true,
            messages: updatedMessages,
            updatedAt: "هم‌اکنون",
          };
        }
        return t;
      })
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: "escalated",
              statusDisplay: "ارجاع به کارشناس پشتیبانی",
              escalatedToHuman: true,
            }
          : null
      );
    }
  };

  const handleSendReply = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !selectedTicket) return;

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderType: "user",
      senderName: "شما",
      body: ticketReply.trim(),
      createdAt: "هم‌اکنون",
    };

    const updated = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
      updatedAt: "هم‌اکنون",
    };

    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setTicketReply("");
  };

  return (
    <PublicShell locale="fa" currentPath="/support">
      <div className={styles.container}>
        {/* Support Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>مرکز پشتیبانی و پایگاه دانش اندورا</h1>
          <p className={styles.heroSubtitle}>
            پاسخ سریع به پرسش‌های متداول، راهنمای استفاده از امکانات پلتفرم و ثبت تیکت‌های پشتیبانی با تریاژ هوشمند و ارجاع تضمینی به انسان
          </p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsTicketModalOpen(true)}
            >
              ✉️ ثبت درخواست پشتیبانی جدید
            </button>
            <a href="#faqs" className={styles.secondaryBtn}>
              📖 جستجو در سوالات متداول
            </a>
          </div>
        </section>

        {/* SLA Commitments Banner */}
        <section className={styles.slaBanner} aria-label="تعهدات زمان پاسخگویی">
          <div className={styles.slaCard}>
            <span className={styles.slaTitle}>امور مالی و تراکنش‌ها</span>
            <span className={styles.slaTime}>حداکثر ۲ ساعت کاری</span>
            <span className={styles.slaDesc}>رسیدگی فوری کارشناسان مالی بدون دخالت ربات</span>
          </div>
          <div className={styles.slaCard}>
            <span className={styles.slaTitle}>امنیت و دسترسی به حساب</span>
            <span className={styles.slaTime}>حداکثر ۲ ساعت</span>
            <span className={styles.slaDesc}>بررسی نشست‌ها و مسائل امنیتی توسط تیم فنی</span>
          </div>
          <div className={styles.slaCard}>
            <span className={styles.slaTitle}>مشاوره دوره‌ها و یادگیری</span>
            <span className={styles.slaTime}>پاسخ آنی / ۱۲ ساعت</span>
            <span className={styles.slaDesc}>تریاژ لحظه‌ای بر اساس راهنما یا پاسخ منتور</span>
          </div>
        </section>

        {/* My Support Tickets Section */}
        <section className={styles.ticketsSection} aria-label="درخواست‌های پشتیبانی من">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>درخواست‌های پشتیبانی شما ({tickets.length})</h2>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsTicketModalOpen(true)}
            >
              + ثبت تیکت جدید
            </button>
          </div>

          <div className={styles.ticketCardsGrid}>
            {tickets.map((t) => (
              <div
                key={t.id}
                className={styles.ticketCard}
                onClick={() => setSelectedTicket(t)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedTicket(t);
                }}
              >
                <div className={styles.ticketTop}>
                  <span
                    className={`${styles.ticketStatusBadge} ${
                      t.status === "new"
                        ? styles.statusNew
                        : t.status === "ai_answered"
                        ? styles.statusAiAnswered
                        : t.status === "escalated"
                        ? styles.statusEscalated
                        : styles.statusResolved
                    }`}
                  >
                    {t.statusDisplay}
                  </span>
                  <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    {t.createdAt}
                  </span>
                </div>
                <h3 className={styles.ticketTitle}>{t.title}</h3>
                <p className={styles.ticketSnippet}>{t.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "var(--font-size-meta)", color: "var(--color-action)", fontWeight: 600 }}>
                  <span>دسته‌بندی: {t.categoryDisplay}</span>
                  <span>مشاهده گفتگو ({t.messages.length}) ←</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className={styles.faqSection} aria-label="سوالات متداول">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>پایگاه دانش و سوالات متداول</h2>
            <input
              type="search"
              className={styles.faqSearchInput}
              placeholder="جستجو در سوالات متداول..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              aria-label="جستجو در پایگاه دانش"
            />
          </div>

          <nav className={styles.faqTabs} aria-label="دسته‌بندی سوالات متداول">
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "all" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("all")}
            >
              همه موضوعات
            </button>
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "placement" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("placement")}
            >
              تعیین سطح
            </button>
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "courses" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("courses")}
            >
              دوره‌ها و آموزش
            </button>
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "teachers" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("teachers")}
            >
              مدرسان و کلاس‌ها
            </button>
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "billing" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("billing")}
            >
              اشتراک و امور مالی
            </button>
            <button
              className={`${styles.faqTab} ${activeFaqCategory === "security" ? styles.faqTabActive : ""}`}
              onClick={() => setActiveFaqCategory("security")}
            >
              امنیت و حساب کاربری
            </button>
          </nav>

          <div className={styles.faqList}>
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <span className={styles.faqToggleIcon} aria-hidden="true">
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                      <div className={styles.faqFeedbackRow}>
                        <span>آیا این پاسخ برای شما مفید بود؟</span>
                        <button
                          type="button"
                          className={styles.helpfulBtn}
                          onClick={() => handleVoteHelpful(faq.id)}
                          disabled={faq.userVoted}
                        >
                          👍 بله ({faq.helpfulCount})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* New Ticket Modal */}
        {isTicketModalOpen && (
          <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>ثبت درخواست پشتیبانی جدید</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsTicketModalOpen(false)}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>موضوع و عنوان درخواست</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: سوال در مورد نحوه ورود به دوره یا تراکنش بانکی"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دسته‌بندی موضوع</label>
                  <select
                    className={styles.formSelect}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                  >
                    <option value="courses">دوره‌ها و محتوای آموزشی</option>
                    <option value="payments">پرداخت و امور مالی</option>
                    <option value="account">حساب کاربری</option>
                    <option value="security">امنیت و دسترسی به حساب</option>
                    <option value="technical">مشکلات فنی پلتفرم</option>
                    <option value="community">جامعه و گزارش‌ها</option>
                    <option value="other">سایر موارد</option>
                  </select>
                </div>

                {isFinancialOrSecurity && (
                  <div className={styles.policyWarningAlert}>
                    <span style={{ fontSize: "1.2rem" }}>🛡️</span>
                    <div>
                      <strong>سیاست ایمنی و رازداری اندورا:</strong>
                      <br />
                      درخواست‌های مربوط به امور مالی و امنیت مستقیماً به کارشناس ارشد انسانی ارجاع داده می‌شوند و سیستم هوش مصنوعی از مداخله یا تولید پاسخ در این حوزه‌ها اکیداً منع شده است.
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>شرح کامل درخواست یا مشکل</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="جزییات مشکل یا سوال خود را با دقت بنویسید..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginBlockStart: "0.5rem" }}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setIsTicketModalOpen(false)}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.primaryBtn}>
                    ثبت و ارسال تیکت
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ticket Detail Drawer Modal */}
        {selectedTicket && (
          <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <div>
                  <span
                    className={`${styles.ticketStatusBadge} ${
                      selectedTicket.status === "ai_answered"
                        ? styles.statusAiAnswered
                        : selectedTicket.status === "escalated"
                        ? styles.statusEscalated
                        : styles.statusNew
                    }`}
                  >
                    {selectedTicket.statusDisplay}
                  </span>
                  <h3 style={{ margin: "0.5rem 0 0 0", fontSize: "1.2rem", fontWeight: 800 }}>
                    {selectedTicket.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedTicket(null)}
                  aria-label="بستن پنجره"
                >
                  ✕
                </button>
              </div>

              {/* AI Cited FAQ Box */}
              {selectedTicket.citedFaq && (
                <div className={styles.aiCitationBox}>
                  <span>💡 منبع رسمی استناد شده: </span>
                  <strong>{selectedTicket.citedFaq.question}</strong>
                </div>
              )}

              {/* Chat Thread */}
              <div className={styles.chatBox}>
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.chatMessage} ${
                      m.senderType === "user"
                        ? styles.msgUser
                        : m.senderType === "ai_agent"
                        ? styles.msgAi
                        : styles.msgStaff
                    }`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", opacity: 0.85, marginBlockEnd: "4px" }}>
                      <strong>{m.senderName}</strong>
                      <span>{m.createdAt}</span>
                    </div>
                    <div style={{ whiteSpace: "pre-line" }}>{m.body}</div>
                  </div>
                ))}
              </div>

              {/* Guaranteed Human Escalation Action */}
              {!selectedTicket.escalatedToHuman && (
                <div className={styles.escalateActionRow}>
                  <div>
                    <strong style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)" }}>
                      آیا پاسخ خودکار نیاز شما را برطرف نکرد؟
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      با زدن دکمه روبرو، تیکت بدون معطلی به صف بررسی کارشناسان انسانی منتقل می‌شود.
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.escalateBtn}
                    onClick={() => handleEscalateToHuman(selectedTicket.id)}
                  >
                    ارجاع به پشتیبان انسانی
                  </button>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="پاسخ یا توضیح تکمیلی خود را بنویسید..."
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className={styles.primaryBtn}>
                  ارسال پیام
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
