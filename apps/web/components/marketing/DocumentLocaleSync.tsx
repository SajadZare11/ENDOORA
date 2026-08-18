"use client";

import { useEffect } from "react";
import type { PublicLocale } from "../../lib/public-site";

export function DocumentLocaleSync({ locale }: { locale: PublicLocale }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
