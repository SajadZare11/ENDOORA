import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";
import { vazirmatn, inter } from "./fonts";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { NetworkBandwidthBanner } from "../components/pwa/NetworkBandwidthBanner";
import { PWARegistration } from "../components/pwa/PWARegistration";
import { LocaleProvider } from "../lib/locale-context";
import { LanguageSwitcher } from "../components/layout/LanguageSwitcher";

const themeBootstrap = `
(function () {
  try {
    var saved = window.localStorage.getItem("endoora-theme-v1");
    var theme = saved === "dark" || saved === "light"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = "light";
  }
})();`;

const localeBootstrap = `
(function () {
  try {
    var savedLocale = window.localStorage.getItem("endoora_ui_locale");
    if (savedLocale === "en") {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      document.documentElement.setAttribute("data-locale", "en");
      document.documentElement.style.setProperty("--font-family-body", "var(--font-family-latin)");
    } else {
      document.documentElement.lang = "fa";
      document.documentElement.dir = "rtl";
      document.documentElement.setAttribute("data-locale", "fa");
      document.documentElement.style.setProperty("--font-family-body", "var(--font-family-persian)");
    }
  } catch (_) {}
})();`;

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.ENDOORA_PUBLIC_URL ?? "https://endoora.ir"),
  title: "Endoora | A new door to your English",
  description: "A Persian-first English learning system for Iranian learners.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Endoora",
  },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="endoora-theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        <Script id="endoora-locale-bootstrap" strategy="beforeInteractive">
          {localeBootstrap}
        </Script>
      </head>
      <body>
        <LocaleProvider>
          <NetworkBandwidthBanner />
          <LanguageSwitcher pinned />
          {children}
          <ThemeToggle />
          <PWARegistration />
        </LocaleProvider>
      </body>
    </html>
  );
}
