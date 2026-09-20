import { Vazirmatn, Inter } from "next/font/google";

/**
 * Global bilingual typography configuration:
 * - Vazirmatn: Persian primary font applied to Persian prose, RTL layouts, and Arabic-script numerals.
 * - Inter: Latin primary font applied to English content, code, IPA transcriptions, and LTR layouts.
 * Both fonts are self-hosted by Next.js at build time to prevent network failures in Iran.
 */
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
