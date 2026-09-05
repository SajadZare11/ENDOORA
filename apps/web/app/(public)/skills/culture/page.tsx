import type { Metadata } from "next";
import Link from "next/link";
import styles from "./culture.module.css";

export const metadata: Metadata = {
  title: "فرهنگ و ارتباطات بین‌المللی | اندورا",
  description: "راهنمای آشنایی با هنجارهای فرهنگی، تعارف در انگلیسی، گپ‌وگفت‌های خودمانی (Small Talk) و نکات ظریف بین‌فرهنگی.",
};

const CULTURE_TOPICS = [
  {
    titleFa: "آداب گپ‌وگفت‌های خودمانی (Small Talk)",
    titleEn: "The Art of Casual Small Talk",
    category: "ارتباطات اجتماعی",
    summaryFa: "چرا انگلیسی‌زبانان به گفتگو درباره آب‌وهوا علاقه دارند؟ شناخت موضوعات امن و تابوهای مکالمه در برخوردهای اول.",
    points: ["آب‌وهوا، ترافیک و ورزش موضوعات خنثی و مناسب هستند.", "از پرسیدن سن، حقوق و وضعیت تأهل در مکالمات غیررسمی خودداری کنید."],
  },
  {
    titleFa: "هنر درخواست محترمانه و غیرمستقیم (Hedging & Politeness)",
    titleEn: "Indirect Requests & Softening Language",
    category: "زبان محترمانه",
    summaryFa: "چگونه در زبان انگلیسی بدون امر و نهی مستقیم، درخواست‌های کاری و روزمره خود را مؤدبانه و حرفه‌ای مطرح کنیم.",
    points: ["استفاده از Could you possibly به جای Please do this.", "افزودن Would you mind if... برای احترام بیشتر."],
  },
  {
    titleFa: "تعارف در فرهنگ ایرانی و معادل‌های آن در انگلیسی",
    titleEn: "Taarof vs. Direct English Communication",
    category: "پل بین‌فرهنگی",
    summaryFa: "چرا تعارف‌های کلامی در انگلیسی سوءتفاهم ایجاد می‌کنند و چگونه صداقت و تعارف را به درستی در مراودات بین‌المللی تفکیک کنیم.",
    points: ["پذیرفتن تعارف در اولین پیشنهاد (First offer rule).", "تشکر روشن بدون عذرخواهی‌های مکرر غیرضروری."],
  },
  {
    titleFa: "رویدادها، اعیاد و تبریک‌های مناسبتی",
    titleEn: "Holidays, Seasons & Greeting Etiquette",
    category: "مناسبت‌های فرهنگی",
    summaryFa: "عبارات استاندارد و رسمی برای تبریک سال نو، کریسمس، روز شکرگزاری و هنجارهای ارسال پیام‌های کاری در تعطیلات.",
    points: ["تبریک‌های فراگیر مانند Happy Holidays در محیط‌های چندفرهنگی.", "رعایت زمان استراحت همکاران در تعطیلات رسمی."],
  },
];

export default function CultureHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <Link href="/skills" style={{ color: "var(--color-link)", fontWeight: 700, textDecoration: "none", display: "inline-block", marginBottom: "var(--space-4)" }}>
        ← بازگشت به مرکز مهارت‌ها
      </Link>

      <header className={styles.heroHeader}>
        <span className={styles.badge}>دانش بین‌فرهنگی</span>
        <h1 className={styles.title}>فرهنگ و ارتباطات بین‌المللی</h1>
        <p className={styles.description}>
          یادگیری زبان بدون درک بافت فرهنگی آن ناقص است. در این بخش با آداب معاشرت، گفتگوی طبیعی، و تفاوت‌های بنیادین ارتباطی در کشورهای انگلیسی‌زبان آشنا می‌شوید.
        </p>
      </header>

      <div className={styles.cardsGrid}>
        {CULTURE_TOPICS.map((topic, idx) => (
          <div key={idx} className={styles.card}>
            <div>
              <span className={styles.cardCategory}>{topic.category}</span>
              <h2 className={styles.cardTitleFa}>{topic.titleFa}</h2>
              <div className={styles.cardTitleEn}>{topic.titleEn}</div>
              <p className={styles.cardBody}>{topic.summaryFa}</p>
              <ul style={{ margin: 0, paddingInlineStart: "1.25rem", color: "var(--color-text)", fontSize: "var(--font-size-small)" }}>
                {topic.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: "0.25rem" }}>{pt}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                تألیف: دپارتمان مطالعات بین‌فرهنگی اندورا
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
