import Link from "next/link";

import { localizedPath, type PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

const faqItems = [
  {
    fa: {
      question: "الان می‌تونم از اندورا استفاده کنم؟",
      answer: "بله! تعیین سطح، دیدن نقشه راه، کتاب‌ها و ابزارهای تمرینی فعاله و می‌تونی همین الان رایگان امتحانشون کنی.",
    },
    en: {
      question: "Can I use Endoora today?",
      answer: "Endoora is under active rollout. Core learning components and previews are available, and broad public access opens as educational and quality milestones complete.",
    },
  },
  {
    fa: {
      question: "تعیین سطح چطوری کار می‌کنه؟",
      answer: "خیلی راحت و بدون استرس! توی چند دقیقه مهارت‌هات رو می‌سنجه و بهت میگه دقیقاً از چه سطحی و با چه کتابی شروع کنی.",
    },
    en: {
      question: "What will placement show?",
      answer: "An explainable estimate of skills, evidence coverage, and confidence—not an official certificate or permanent label.",
    },
  },
  {
    fa: {
      question: "آیا اندورا نمره IELTS رو تضمین می‌کنه؟",
      answer: "هیچ سیستمی نمی‌تونه تضمین قطعی بده، اما با تمرین روی سوالات استاندارد و فیدبک هوش مصنوعی، می‌تونی قدم‌به‌قدم به نمره هدفت برسی.",
    },
    en: {
      question: "Does Endoora guarantee an IELTS score?",
      answer: "No. IELTS practice uses original or licensed material, and AI feedback is a limited, reviewable estimate—not an official examiner score.",
    },
  },
  {
    fa: {
      question: "هوش مصنوعی جای استاد رو می‌گیره؟",
      answer: "نه اصلاً! هوش مصنوعی مثل یه پارتنر تمرینی ۲۴ ساعته‌ست تا هر چقدر دلت خواست تمرین کنی، اما برای تدریس اصلی و رفع اشکال استادهای با تجربه کنارتن.",
    },
    en: {
      question: "Does AI replace a teacher?",
      answer: "No. AI can personalize practice, but it can be wrong. Teachers and human feedback remain part of important learning decisions.",
    },
  },
  {
    fa: {
      question: "ایمیل من برای چی استفاده میشه؟",
      answer: "فقط برای ارسال اخبار، دعوت‌نامه‌ها و شروع دوره‌های جدید اندورا. خیالت راحت، هیچ ایمیل تبلیغاتی یا اسپمی برات فرستاده نمیشه.",
    },
    en: {
      question: "How is my waitlist email used?",
      answer: "Only for Endoora prelaunch updates and invitations. We load no third-party analytics scripts, and communication consent is recorded separately.",
    },
  },
] as const;

export function PublicFaq({ locale, compact = false }: { locale: PublicLocale; compact?: boolean }) {
  const isFa = locale === "fa";

  return (
    <div className={compact ? styles.faqCompact : styles.faqLayout}>
      {!compact ? (
        <div className={styles.faqIntro}>
          <span className={styles.sectionLabel}>{isFa ? "پاسخ به سوالاتت" : "Clear answers"}</span>
          <h2>{isFa ? "سوال‌های پرتکرار" : "Frequently asked questions"}</h2>
          <p>
            {isFa
              ? "اگه سوال دیگه‌ای داری، پشتیبانی ما همیشه حاضره تا راهنماییت کنه."
              : "If your answer is not here, the contact page explains the current support-channel status without invented contact details."}
          </p>
          <Link className={styles.textLink} href={localizedPath(locale, "/contact")}>
            {isFa ? "ارتباط با ما" : "See contact options"}
            <span aria-hidden="true">{isFa ? "←" : "→"}</span>
          </Link>
        </div>
      ) : null}

      <div className={styles.faqList}>
        {faqItems.map((item, index) => {
          const copy = item[locale];
          return (
            <details key={copy.question} open={compact && index === 0}>
              <summary>{copy.question}</summary>
              <p>{copy.answer}</p>
            </details>
          );
        })}
      </div>
    </div>
  );
}
