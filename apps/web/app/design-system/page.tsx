"use client";

import { useMemo, useState } from "react";
import {
  EndooraWordmark,
  themeDataAttributes,
  type EndooraTheme,
  type TextDirection,
} from "@endoora/ui";
import styles from "./design-system.module.css";

const palette = [
  { name: "Deep Navy", token: "--color-deep-navy", use: "Headings and high-contrast text" },
  { name: "Endoora Blue", token: "--color-endoora-blue", use: "Primary actions and focus" },
  { name: "Learning Teal", token: "--color-learning-teal", use: "Adaptive learning and progress" },
  { name: "Achievement Amber", token: "--color-achievement-amber", use: "XP and badges; not body text on white" },
  { name: "Success Green", token: "--color-success-green", use: "Completion and verified states" },
  { name: "Warning Orange", token: "--color-warning-orange", use: "Warnings and expiring states" },
  { name: "Error Red", token: "--color-error-red", use: "Validation and destructive actions" },
  { name: "Canvas", token: "--color-canvas", use: "Page background" },
  { name: "Surface", token: "--color-surface", use: "Cards and forms" },
  { name: "Border", token: "--color-border", use: "Separators and outlines" },
] as const;

const spacing = ["1", "2", "3", "4", "6", "8", "12", "16"] as const;

function Swatch({ name, token, use }: (typeof palette)[number]) {
  return (
    <article className={styles.swatchCard}>
      <div
        className={styles.swatch}
        style={{ background: `var(${token})` }}
        aria-label={`${name} color sample`}
      />
      <div>
        <strong>{name}</strong>
        <code className="ltr-isolate">{token}</code>
        <p>{use}</p>
      </div>
    </article>
  );
}

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<EndooraTheme>("light");
  const [direction, setDirection] = useState<TextDirection>("rtl");
  const attrs = useMemo(() => themeDataAttributes(theme, direction), [theme, direction]);

  return (
    <div className={styles.preview} {...attrs} lang={direction === "rtl" ? "fa" : "en"}>
      <header className={styles.toolbar}>
        <div>
          <span className={styles.eyebrow}>Day 03 · Design system preview</span>
          <EndooraWordmark />
        </div>

        <div className={styles.controls} aria-label="Design system preview controls">
          <div className={styles.controlGroup} role="group" aria-label="Theme">
            <button
              type="button"
              className={theme === "light" ? styles.activeControl : styles.control}
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? styles.activeControl : styles.control}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>

          <div className={styles.controlGroup} role="group" aria-label="Text direction">
            <button
              type="button"
              className={direction === "rtl" ? styles.activeControl : styles.control}
              aria-pressed={direction === "rtl"}
              onClick={() => setDirection("rtl")}
            >
              RTL
            </button>
            <button
              type="button"
              className={direction === "ltr" ? styles.activeControl : styles.control}
              aria-pressed={direction === "ltr"}
              onClick={() => setDirection("ltr")}
            >
              LTR
            </button>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero} aria-labelledby="design-system-title">
          <div>
            <p className={styles.eyebrow}>Endoora visual language</p>
            <h1 id="design-system-title" className="text-hero">
              طراحی آرام، دو‌زبانه و قابل‌دسترسی
            </h1>
            <p className="text-body">
              این صفحه مرجع توکن‌های رنگ، تایپوگرافی، فاصله، حالت تاریک، فوکوس و محتوای ترکیبی فارسی/انگلیسی است.
            </p>
          </div>
          <aside className={styles.brandLockup} aria-label="Compact brand treatment">
            <EndooraWordmark compact />
            <p className="font-latin ltr-isolate">A new door to your English</p>
          </aside>
        </section>

        <section className={styles.section} aria-labelledby="color-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>01 · Color</p>
              <h2 id="color-title" className="text-section-title">رنگ‌های پایه و معنایی</h2>
            </div>
            <p>
              رنگ‌های وضعیت برای آیکن، مرز و پس‌زمینه استفاده می‌شوند؛ متن معمولی همیشه از جفت‌های دارای کنتراست AA استفاده می‌کند.
            </p>
          </div>
          <div className={styles.swatchGrid}>
            {palette.map((item) => <Swatch key={item.token} {...item} />)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>02 · Typography</p>
              <h2 id="type-title" className="text-section-title">تایپوگرافی فارسی و انگلیسی</h2>
            </div>
          </div>
          <div className={styles.typeGrid}>
            <article className={styles.surfaceCard}>
              <span className={styles.label}>Hero · 40/48 desktop</span>
              <p className="text-hero">مسیر یادگیری شما</p>
            </article>
            <article className={styles.surfaceCard}>
              <span className={styles.label}>Page title · 32/40</span>
              <p className="text-page-title">تمرین امروز</p>
            </article>
            <article className={styles.surfaceCard}>
              <span className={styles.label}>Body · Persian 1.6 line height</span>
              <p className="text-body font-persian">
                متن فارسی برای خوانایی بهتر از فاصلهٔ خطوط بیشتر استفاده می‌کند و در عرض‌های کوچک نیز فشرده نمی‌شود.
              </p>
            </article>
            <article className={styles.surfaceCard} dir="ltr" lang="en">
              <span className={styles.label}>Body · English 1.5 line height</span>
              <p className="text-body font-latin">
                English learning content stays isolated in an LTR reading context.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="mixed-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>03 · Mixed language</p>
              <h2 id="mixed-title" className="text-section-title">نمونه کارت آموزشی ترکیبی</h2>
            </div>
          </div>
          <article className={styles.learningCard}>
            <div className={styles.learningBadge}>Learning Teal</div>
            <h3 className="text-card-title">واژهٔ امروز</h3>
            <p>
              عبارت <strong className="ltr-isolate font-latin">make progress</strong> یعنی «پیشرفت کردن».
            </p>
            <dl className={styles.mixedList}>
              <div>
                <dt>Example</dt>
                <dd className="ltr-isolate font-latin">I am making steady progress in English.</dd>
              </div>
              <div>
                <dt>IPA</dt>
                <dd className="ltr-isolate font-latin">/meɪk ˈprɑːɡres/</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd className="ltr-isolate font-latin">support@endoora.ir</dd>
              </div>
              <div>
                <dt>URL</dt>
                <dd className="ltr-isolate font-latin">https://endoora.ir</dd>
              </div>
              <div>
                <dt>Score sample</dt>
                <dd className="ltr-isolate font-latin">17 / 20</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="space-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>04 · Spacing & shape</p>
              <h2 id="space-title" className="text-section-title">مقیاس فاصله و شعاع‌ها</h2>
            </div>
          </div>
          <div className={styles.spacingList}>
            {spacing.map((step) => (
              <div key={step} className={styles.spacingRow}>
                <code className="ltr-isolate">--space-{step}</code>
                <span className={styles.spacingTrack}>
                  <span style={{ inlineSize: `var(--space-${step})` }} />
                </span>
              </div>
            ))}
          </div>
          <div className={styles.shapeGrid}>
            <div className={styles.controlShape}>Control · 12px</div>
            <div className={styles.cardShape}>Card · 16px</div>
            <div className={styles.pillShape}>Badge · pill</div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="state-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>05 · States & focus</p>
              <h2 id="state-title" className="text-section-title">حالت‌ها، فوکوس و حرکت</h2>
            </div>
            <p>با کلید Tab روی دکمه‌ها حرکت کنید؛ حلقهٔ فوکوس باید همیشه واضح باشد.</p>
          </div>
          <div className={styles.stateGrid}>
            <div className={`${styles.stateCard} ${styles.successState}`}>
              <strong>Success</strong><span>تمرین با موفقیت ذخیره شد.</span>
            </div>
            <div className={`${styles.stateCard} ${styles.warningState}`}>
              <strong>Warning</strong><span>زمان برنامه رو به پایان است.</span>
            </div>
            <div className={`${styles.stateCard} ${styles.errorState}`}>
              <strong>Error</strong><span>لطفاً پاسخ را دوباره بررسی کنید.</span>
            </div>
            <div className={`${styles.stateCard} ${styles.infoState}`}>
              <strong>Info</strong><span>این نتیجه یک تخمین آموزشی است.</span>
            </div>
          </div>
          <div className={styles.focusDemo}>
            <button type="button" className={styles.primaryButton}>Primary action</button>
            <button type="button" className={styles.secondaryButton}>Secondary action</button>
            <a href="#color-title" className={styles.linkButton}>Jump to colors</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <EndooraWordmark compact />
        <span className="font-latin ltr-isolate">A new door to your English</span>
      </footer>
    </div>
  );
}
