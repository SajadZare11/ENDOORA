import Link from "next/link";

import { localizedPath, type PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

const faqItems = [
  {
    fa: {
      question: "Endoora الان آماده استفاده است؟",
      answer: "نه. Endoora در حال ساخت است. صفحه‌های عمومی Day 06 مسیر محصول را توضیح می‌دهند و دسترسی اولیه بعد از گذر از آزمون‌های فنی و آموزشی باز می‌شود.",
    },
    en: {
      question: "Can I use Endoora today?",
      answer: "Not yet. Endoora is under active development. The Day 06 public site explains the product direction, and early access opens only after technical and educational checks pass.",
    },
  },
  {
    fa: {
      question: "تعیین سطح چه چیزی را نشان می‌دهد؟",
      answer: "یک برآورد توضیح‌پذیر از مهارت‌ها، پوشش شواهد و میزان اطمینان؛ نه مدرک رسمی یا برچسب دائمی.",
    },
    en: {
      question: "What will placement show?",
      answer: "An explainable estimate of skills, evidence coverage, and confidence—not an official certificate or permanent label.",
    },
  },
  {
    fa: {
      question: "آیا Endoora نمره IELTS را تضمین می‌کند؟",
      answer: "خیر. تمرین IELTS با محتوای اصل یا مجاز ارائه می‌شود و بازخورد AI فقط یک برآورد محدود و قابل بررسی است، نه نمره رسمی ممتحن.",
    },
    en: {
      question: "Does Endoora guarantee an IELTS score?",
      answer: "No. IELTS practice uses original or licensed material, and AI feedback is a limited, reviewable estimate—not an official examiner score.",
    },
  },
  {
    fa: {
      question: "هوش مصنوعی جای مدرس را می‌گیرد؟",
      answer: "خیر. AI می‌تواند تمرین را شخصی‌تر کند، اما احتمال خطا دارد. مدرس و بازخورد انسانی برای تصمیم‌های مهم آموزشی در چرخه باقی می‌مانند.",
    },
    en: {
      question: "Does AI replace a teacher?",
      answer: "No. AI can personalize practice, but it can be wrong. Teachers and human feedback remain part of important learning decisions.",
    },
  },
  {
    fa: {
      question: "ایمیل فهرست انتظار چطور استفاده می‌شود؟",
      answer: "فقط برای اطلاع‌رسانی پیش‌راه‌اندازی Endoora. در Day 06 هیچ اسکریپت تحلیل شخص ثالثی بارگذاری نمی‌شود و رضایت ایمیل جداگانه ثبت می‌شود.",
    },
    en: {
      question: "How is my waitlist email used?",
      answer: "Only for Endoora prelaunch updates. Day 06 loads no third-party analytics scripts, and email consent is recorded separately.",
    },
  },
] as const;

export function PublicFaq({ locale, compact = false }: { locale: PublicLocale; compact?: boolean }) {
  const isFa = locale === "fa";

  return (
    <div className={compact ? styles.faqCompact : styles.faqLayout}>
      {!compact ? (
        <div className={styles.faqIntro}>
          <span className={styles.sectionLabel}>{isFa ? "پاسخ‌های روشن" : "Clear answers"}</span>
          <h2>{isFa ? "پرسش‌های متداول" : "Frequently asked questions"}</h2>
          <p>
            {isFa
              ? "اگر پاسخ مورد نیازتان اینجا نیست، صفحه تماس وضعیت فعلی کانال‌های پشتیبانی را بدون اطلاعات ساختگی توضیح می‌دهد."
              : "If your answer is not here, the contact page explains the current support-channel status without invented contact details."}
          </p>
          <Link className={styles.textLink} href={localizedPath(locale, "/contact")}>
            {isFa ? "مشاهده مسیر تماس" : "See contact options"}
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
