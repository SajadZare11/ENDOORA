"use client";

import React from "react";
import { useLocale } from "../../lib/locale-context";
import styles from "./language-switcher.module.css";

export interface LanguageSwitcherProps {
  /**
   * If true, renders pinned in the top-right utility corner of the screen
   * consistently across both RTL and LTR viewports.
   */
  pinned?: boolean;
  className?: string;
  variant?: "toggle" | "badge";
}

/**
 * Global Header Language Switcher
 * - Toggle button (EN / فا) with consistent visual placement in top-right utility navigation.
 * - On toggle:
 *   1. Switches interface chrome strings between Persian and English.
 *   2. Toggles <html dir="rtl" lang="fa"> ↔ <html dir="ltr" lang="en">.
 *   3. Swaps root typography variables (--font-family-body) between Vazirmatn and Inter.
 *   4. Persists the user's choice in localStorage under key 'endoora_ui_locale'.
 * - Styled with font-weight 600, letter-spacing -0.01em, rounded corners (var(--radius-control)),
 *   and minimum touch target of 44px (var(--target-min)).
 */
export function LanguageSwitcher({ pinned = false, className = "", variant = "toggle" }: LanguageSwitcherProps) {
  const { locale, toggleLocale, isFa } = useLocale();

  const buttonContent =
    variant === "badge" ? (
      <>
        <span className={isFa ? styles.activeLang : styles.inactiveLang}>فا</span>
        <span className={styles.langDivider} aria-hidden="true">/</span>
        <span className={!isFa ? styles.activeLang : styles.inactiveLang}>EN</span>
      </>
    ) : (
      // Clean toggle showing the target language or label (EN when Persian, فا when English)
      <span>{isFa ? "EN" : "فا"}</span>
    );

  const button = (
    <button
      type="button"
      className={`${styles.switcherBtn} ${className}`.trim()}
      onClick={toggleLocale}
      aria-label={isFa ? "تغییر زبان به انگلیسی (Switch to English)" : "تغییر زبان به فارسی (Switch to Persian)"}
      title={isFa ? "تغییر زبان به انگلیسی (Switch to English)" : "تغییر زبان به فارسی (Switch to Persian)"}
    >
      {buttonContent}
    </button>
  );

  // When pinned is requested (top-right utility corner), return null as the global site header
  // already contains the prominent language toggle on the opposite side.
  if (pinned) {
    return null;
  }

  return button;
}
