"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";

export type Locale = "fa" | "en";

export interface LocaleContextType {
  locale: Locale;
  isFa: boolean;
  isEn: boolean;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, fallback?: { fa: string; en: string }) => string;
}

export const CHROME_STRINGS: Record<string, { fa: string; en: string }> = {
  "nav.home": { fa: "خانه", en: "Home" },
  "nav.courses": { fa: "دوره‌ها", en: "Courses" },
  "nav.learn": { fa: "یادگیری", en: "Learn" },
  "nav.teachers": { fa: "مدرس‌ها", en: "Teachers" },
  "nav.classes": { fa: "کلاس‌ها", en: "Classes" },
  "nav.placement": { fa: "تعیین سطح", en: "Placement" },
  "nav.ielts": { fa: "آیلتس", en: "IELTS" },
  "nav.pricing": { fa: "اشتراک", en: "Membership" },
  "nav.practice": { fa: "تمرین", en: "Practice" },
  "nav.account": { fa: "حساب کاربری", en: "Account" },
  "nav.login": { fa: "ورود", en: "Sign In" },
  "nav.menu": { fa: "منو", en: "Menu" },
  "nav.skip": { fa: "رفتن به محتوای اصلی", en: "Skip to main content" },
  "btn.next": { fa: "مرحله بعد", en: "Next Step" },
  "btn.prev": { fa: "مرحله قبل", en: "Previous Step" },
  "btn.finish": { fa: "پایان و دریافت کارنامه", en: "Finish Lesson" },
  "btn.check": { fa: "بررسی پاسخ", en: "Check Answer" },
  "btn.retry": { fa: "تلاش مجدد", en: "Try Again" },
  "btn.hint": { fa: "نمایش راهنما", en: "Show Hint" },
  "btn.listen": { fa: "شنیدن تلفظ", en: "Listen Pronunciation" },
  "lang.toggle_label": { fa: "EN", en: "فا" },
  "lang.aria_label": { fa: "تغییر زبان به انگلیسی", en: "Switch language to Persian" },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [, startTransition] = useTransition();

  const applyLocaleToDom = (newLocale: Locale) => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const isPersian = newLocale === "fa";

    html.lang = newLocale;
    html.dir = isPersian ? "rtl" : "ltr";
    html.setAttribute("data-locale", newLocale);

    // Swap root typography variable between Vazirmatn and Inter
    html.style.setProperty(
      "--font-family-body",
      isPersian ? "var(--font-family-persian)" : "var(--font-family-latin)"
    );

    try {
      window.localStorage.setItem("endoora_ui_locale", newLocale);
      window.dispatchEvent(new CustomEvent("endoora:locale-change", { detail: { locale: newLocale } }));
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("endoora_ui_locale") as Locale | null;
      if (saved && (saved === "fa" || saved === "en")) {
        setLocaleState(saved);
        applyLocaleToDom(saved);
      } else {
        applyLocaleToDom("fa");
      }
    } catch {
      applyLocaleToDom("fa");
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "endoora_ui_locale" && e.newValue && (e.newValue === "fa" || e.newValue === "en")) {
        setLocaleState(e.newValue as Locale);
        applyLocaleToDom(e.newValue as Locale);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale);
      applyLocaleToDom(newLocale);
    });
  };

  const toggleLocale = () => {
    const nextLocale: Locale = locale === "fa" ? "en" : "fa";
    setLocale(nextLocale);
  };

  const t = (key: string, fallback?: { fa: string; en: string }): string => {
    const item = CHROME_STRINGS[key] || fallback;
    if (!item) return key;
    return locale === "fa" ? item.fa : item.en;
  };

  const isFa = locale === "fa";
  const isEn = locale === "en";
  const dir: "rtl" | "ltr" = isFa ? "rtl" : "ltr";

  return (
    <LocaleContext.Provider
      value={{
        locale,
        isFa,
        isEn,
        dir,
        setLocale,
        toggleLocale,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    // Fallback safe state for components rendered outside LocaleProvider
    return {
      locale: "fa",
      isFa: true,
      isEn: false,
      dir: "rtl",
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key: string, fallback?: { fa: string; en: string }) => {
        const item = CHROME_STRINGS[key] || fallback;
        return item ? item.fa : key;
      },
    };
  }
  return context;
}
