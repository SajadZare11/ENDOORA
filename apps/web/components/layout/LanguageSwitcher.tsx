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
  // Website language is strictly Persian; language switcher toggleLocale is disabled and removed.
  // Preserved for endoora_ui_locale compatibility.
  return null;
}
