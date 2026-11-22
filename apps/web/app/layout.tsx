import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";
import { vazirmatn, inter } from "./fonts";
import { NetworkBandwidthBanner } from "../components/pwa/NetworkBandwidthBanner";
import { PWARegistration } from "../components/pwa/PWARegistration";
import { LocaleProvider } from "../lib/locale-context";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { LanguageSwitcher } from "../components/layout/LanguageSwitcher";
import { ImpersonationBanner } from "../components/admin/ImpersonationBanner";

const themeBootstrap = `
(function () {
  try {
    document.documentElement.dataset.theme = window.localStorage.getItem("endoora-theme-v1") === "dark" ? "dark" : "light";
  } catch (_) {}

})();`;

const localeBootstrap = `
(function () {
  try {
    var locale = /^\\/en(?:\\/|$)/.test(location.pathname) ? "en" : "fa";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.locale = locale;
  } catch (_) {}
})();`;

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
        <script
          id="endoora-theme-bootstrap"
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
          suppressHydrationWarning
        />
        <script
          id="endoora-locale-bootstrap"
          dangerouslySetInnerHTML={{ __html: localeBootstrap }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <LocaleProvider>
          <ImpersonationBanner />
          <NetworkBandwidthBanner />
          <ThemeToggle />
          <LanguageSwitcher pinned />
          {children}
          <PWARegistration />
        </LocaleProvider>
      </body>
    </html>
  );
}
