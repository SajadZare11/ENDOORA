import Link from "next/link";

import { WaitlistForm } from "./WaitlistForm";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { localizedPath, type PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

const loop = [
  ["01", "تعیین سطح", "شناخت نقطه شروع واقعی"],
  ["02", "Learner Twin", "ساخت تصویر شخصی از مهارت‌ها"],
  ["03", "مسیر شخصی", "انتخاب قدم بعدی مناسب"],
  ["04", "Daily Mission", "تمرین کوتاه و هدفمند روزانه"],
  ["05", "سازگاری هوشمند", "تشخیص الگوهای اشتباه"],
];

const features = [
  [
    "Learner Twin",
    "مدل شخصی یادگیری که مسیر تو را بهتر می‌شناسد.",
    "/features/learner-twin",
  ],
  [
    "Daily Mission",
    "هر روز فقط یک قدم درست برای پیشرفت.",
    "/features/daily-mission",
  ],
  [
    "Mistake Genome",
    "شناخت الگوی اشتباهات، نه فقط اصلاح یک جواب.",
    "/features/mistake-genome",
  ],
  [
    "Writing Mentor",
    "بازخورد ساختاری برای بهتر نوشتن.",
    "/features/writing-mentor",
  ],
];


export function HomePage({ locale }: { locale: PublicLocale }) {
  const fa = locale === "fa";

  return (
    <>
      <AnalyticsConsent />

      {/* HERO */}
      <section className={styles.heroNext}>
        <div>
          <span className={styles.kicker} dir="ltr">
            Endoora · A new door to your English
          </span>

          <h1>
            {fa
              ? "یادگیری انگلیسی که مسیر مخصوص تو را می‌سازد."
              : "An English learning journey built around you."}
          </h1>

          <p>
            {fa
              ? "Endoora سطح تو، هدف تو و اشتباهات تو را می‌شناسد و با تمرین‌های هوشمند یک مسیر شخصی برای بهتر شدن می‌سازد."
              : "Endoora understands your level, goals and mistakes to create a personalized path."}
          </p>

          <div className={styles.heroActions}>
            <Link
              className={styles.primaryButton}
              href={localizedPath(locale, "/placement")}
            >
              {fa
                ? "شروع تعیین سطح رایگان"
                : "Start free assessment"}
            </Link>

            <Link
              className={styles.secondaryButton}
              href="#how"
            >
              {fa
                ? "چطور کار می‌کند؟"
                : "How it works"}
            </Link>
          </div>
        </div>


        <div className={styles.twinCard}>
          <div className={styles.orb}>
            E
          </div>

          <h2 dir="ltr">
            Your Learner Twin
          </h2>

          <p>
            {fa
              ? "یک تصویر زنده از مسیر یادگیری تو"
              : "A living picture of your learning journey"}
          </p>


          <div className={styles.progress}>
            <span style={{ width: "72%" }} />
            Vocabulary 72%
          </div>


          <div className={styles.progress}>
            <span style={{ width: "58%" }} />
            Grammar 58%
          </div>


          <div className={styles.progress}>
            <span style={{ width: "81%" }} />
            Listening 81%
          </div>
        </div>
      </section>



      {/* LEARNING LOOP */}
      <section
        id="how"
        className={styles.section}
      >
        <h2>
          {fa
            ? "چرخه یادگیری Endoora"
            : "The Endoora learning loop"}
        </h2>


        <div className={styles.loopGrid}>
          {loop.map(([n, t, b]) => (
            <article key={n}>
              <strong>{n}</strong>

              <h3>
                {t}
              </h3>

              <p>
                {b}
              </p>
            </article>
          ))}
        </div>
      </section>




      {/* FEATURES */}
      <section className={styles.section}>
        <h2>
          {fa
            ? "قابلیت‌هایی که برای تو کار می‌کنند"
            : "Features built around your progress"}
        </h2>


        <div className={styles.featureGrid}>
          {features.map(([title, text, url]) => (
            <article
              className={styles.card}
              key={title}
            >
              <h3>
                {title}
              </h3>

              <p>
                {text}
              </p>

              <Link href={localizedPath(locale, url)}>
                {fa
                  ? "بیشتر بدانید"
                  : "Learn more"}
              </Link>
            </article>
          ))}
        </div>
      </section>




      {/* DAILY MISSION */}
      <section className={styles.mission}>
        <h2>
          {fa
            ? "هر روز فقط یک قدم درست."
            : "One right step every day."}
        </h2>

        <p>
          {fa
            ? "به جای سردرگمی بین هزاران درس، Endoora پیشنهاد می‌دهد امروز چه چیزی بیشترین تاثیر را دارد."
            : "Instead of searching through endless lessons, Endoora guides your next best action."}
        </p>
      </section>




      {/* AI + HUMAN */}
      <section className={styles.trust}>
        <h2>
          {fa
            ? "هوش مصنوعی + انسان"
            : "AI + Human guidance"}
        </h2>


        <p>
          {fa
            ? "هوش مصنوعی مسیر را شخصی می‌کند؛ مدرس و بازخورد انسانی یادگیری را کامل می‌کنند."
            : "AI personalizes the path while teachers add human guidance."}
        </p>
      </section>




      {/* CTA */}
      <section className={styles.waitlist}>
        <h2>
          {fa
            ? "اولین قدم را شروع کن"
            : "Take your first step"}
        </h2>

        <WaitlistForm locale={locale} />
      </section>
    </>
  );
}
