import localFont from "next/font/local";
import { Vazirmatn, Inter } from "next/font/google";

/**
 * Global bilingual typography configuration:
 * - IRANYekan: Persian primary font (Zarfilm typography aesthetic) with full weight hierarchy (300-900).
 * - Vazirmatn: Persian secondary/fallback font self-hosted via Next.js Google Fonts.
 * - Inter: Latin primary font applied to English content, code, IPA transcriptions, and LTR layouts.
 */
export const iranyekan = localFont({
  src: [
    {
      path: "./fonts/iranyekan/iranyekan-light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/iranyekan/iranyekan-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/iranyekan/iranyekan-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/iranyekan/iranyekan-bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/iranyekan/iranyekan-extrabold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/iranyekan/iranyekan-black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
  display: "swap",
});

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

