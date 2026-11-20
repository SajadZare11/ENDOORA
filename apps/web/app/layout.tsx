import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";
import { vazirmatn, inter } from "./fonts";
import { NetworkBandwidthBanner } from "../components/pwa/NetworkBandwidthBanner";
import { PWARegistration } from "../components/pwa/PWARegistration";
import { LocaleProvider } from "../lib/locale-context";
import { LanguageSwitcher } from "../components/layout/LanguageSwitcher";
import { ImpersonationBanner } from "../components/admin/ImpersonationBanner";

const themeBootstrap = `
(function () {
  try {
    window.localStorage.removeItem("endoora-theme-v1");
  } catch (_) {}
  document.documentElement.dataset.theme = "light";
})();`;

const localeBootstrap = `
(function () {
  try {
    var savedLocale = window.localStorage.getItem("endoora_ui_locale");
    if (savedLocale === "en") {
      window.localStorage.removeItem("endoora_ui_locale");
    }
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    document.documentElement.setAttribute("data-locale", "fa");
    document.documentElement.style.setProperty("--font-family-body", "var(--font-family-persian)");
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
          <LanguageSwitcher pinned />
          {children}
          <PWARegistration />
        </LocaleProvider>
      </body>
    </html>
  );
}
