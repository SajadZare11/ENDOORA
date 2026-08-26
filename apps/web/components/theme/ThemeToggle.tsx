"use client";

import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "endoora-theme-v1";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 14.2A8.2 8.2 0 0 1 9.8 3.6 8.5 8.5 0 1 0 20.4 14.2Z" />
    </svg>
  );
}

export function ThemeToggle() {
  function toggleTheme() {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      className={`${styles.toggle} theme-toggle-global`}
      onClick={toggleTheme}
      aria-label="تغییر حالت رنگ · Switch color mode"
      title="تغییر حالت رنگ · Switch color mode"
    >
      <span className={`${styles.icon} ${styles.sun}`} aria-hidden="true"><SunIcon /></span>
      <span className={styles.label}><span className={styles.lightLabel}>حالت شب</span><span className={styles.darkLabel}>حالت روشن</span></span>
      <span className={`${styles.icon} ${styles.moon}`} aria-hidden="true"><MoonIcon /></span>
    </button>
  );
}
