import localFont from "next/font/local";

/**
 * Global bilingual typography configuration:
 * Fully self-hosted local fonts for 100% resilience against national network
 * shutdowns, international internet routing blackouts, and CDN timeouts in Iran.
 *
 * - vazirmatn: Self-hosted Persian typography using IranYekan embedded woff assets.
 * - inter: Local system UI typography stack for Latin scripts (zero external fetch).
 */
export const vazirmatn = localFont({
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
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const inter = {
  variable: "--font-inter",
  className: "font-inter-resilient",
};


