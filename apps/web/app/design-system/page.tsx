"use client";

import Link from "next/link";
import { useState } from "react";
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
  { name: "Learning Teal", token: "--color-learning-teal", use: "Learning progress and adaptation" },
  { name: "Intelligence Purple", token: "--color-intelligence-purple", use: "Transparent AI experiences" },
  { name: "Achievement Amber", token: "--color-achievement-amber", use: "Awards; never body text on white" },
  { name: "Canvas", token: "--color-canvas", use: "Page background" },
  { name: "Surface", token: "--color-surface", use: "Cards, forms and overlays" },
  { name: "Border", token: "--color-border", use: "Separators and control outlines" },
] as const;

const spacing = ["1", "2", "3", "4", "6", "8", "12", "16"] as const;

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<EndooraTheme>("light");
  const [direction, setDirection] = useState<TextDirection>("rtl");

  return (
    <div className={styles.preview} {...themeDataAttributes(theme, direction)} lang={direction === "rtl" ? "fa" : "en"}>
      <header className={styles.toolbar}>
        <div><span className={styles.eyebrow}>DAY 03 · DESIGN TOKENS</span><EndooraWordmark /></div>
        <div className={styles.toolbarActions}>
          <nav className={styles.pageLinks} aria-label="Design system pages"><Link href="/design-system" aria-current="page">Tokens</Link><Link href="/design-system/components">Components</Link></nav>
          <div className={styles.controlGroup} role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button>
          </div>
          <div className={styles.controlGroup} role="group" aria-label="Text direction">
            <button type="button" aria-pressed={direction === "rtl"} onClick={() => setDirection("rtl")}>RTL</button>
            <button type="button" aria-pressed={direction === "ltr"} onClick={() => setDirection("ltr")}>LTR</button>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero} aria-labelledby="design-system-title">
          <div>
            <p className={styles.eyebrow}>Endoora visual language</p>
            <h1 id="design-system-title" className="text-hero">طراحی آرام، دو‌زبانه و قابل‌دسترسی</h1>
            <p>یک مرجع واحد برای رنگ، تایپوگرافی، فاصله، جهت، فوکوس و حرکت.</p>
          </div>
          <aside className={styles.brandPanel}><EndooraWordmark compact /><p className="font-latin ltr-isolate">A new door to your English</p></aside>
        </section>

        <section className={styles.section} aria-labelledby="color-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 · COLOR</p><h2 id="color-title">رنگ‌های پایه</h2></div><p>Semantic text/background pairs meet WCAG AA.</p></div>
          <div className={styles.swatchGrid}>
            {palette.map((item) => (
              <article className={styles.swatchCard} key={item.token}>
                <div className={styles.swatch} style={{ background: `var(${item.token})` }} aria-label={`${item.name} sample`} />
                <div><strong>{item.name}</strong><code className="ltr-isolate">{item.token}</code><p>{item.use}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 · TYPE & DIRECTION</p><h2 id="type-title">فارسی و English</h2></div></div>
          <div className={styles.typeGrid}>
            <article className={styles.surfaceCard}><span className={styles.label}>Persian · RTL · 1.6 line height</span><p className="font-persian">متن فارسی در تمام اندازه‌ها خوانا و آرام باقی می‌ماند.</p></article>
            <article className={styles.surfaceCard} dir="ltr" lang="en"><span className={styles.label}>English · LTR · 1.5 line height</span><p className="font-latin">English learning content remains isolated from the Persian interface direction.</p></article>
          </div>
          <article className={styles.learningCard}>
            <h3>نمونهٔ محتوای ترکیبی</h3>
            <p>عبارت <strong className="ltr-isolate font-latin">make progress</strong> یعنی «پیشرفت کردن».</p>
            <dl className={styles.mixedList}><div><dt>Example</dt><dd className="ltr-isolate">I am making steady progress.</dd></div><div><dt>Email</dt><dd className="ltr-isolate">support@endoora.ir</dd></div></dl>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="spacing-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 · SPACING</p><h2 id="spacing-title">مقیاس هشت‌پیکسلی</h2></div></div>
          <div className={styles.spacingList}>
            {spacing.map((step) => <div className={styles.spacingRow} key={step}><code className="ltr-isolate">--space-{step}</code><span><i style={{ inlineSize: `var(--space-${step})` }} /></span></div>)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="state-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>04 · STATES</p><h2 id="state-title">حالت‌ها و فوکوس</h2></div><p>Use Tab to verify the visible focus ring.</p></div>
          <div className={styles.stateGrid}><div className={styles.successState}><strong>Success</strong><span>تمرین ذخیره شد.</span></div><div className={styles.warningState}><strong>Warning</strong><span>زمان رو به پایان است.</span></div><div className={styles.errorState}><strong>Error</strong><span>پاسخ را بررسی کنید.</span></div><div className={styles.infoState}><strong>Info</strong><span>این نتیجه تخمینی است.</span></div></div>
          <div className={styles.focusDemo}><button type="button">Primary action</button><Link href="#color-title">Jump to colors</Link></div>
        </section>
      </main>
    </div>
  );
}
