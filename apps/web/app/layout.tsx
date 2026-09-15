import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { NetworkBandwidthBanner } from "../components/pwa/NetworkBandwidthBanner";
import { PWARegistration } from "../components/pwa/PWARegistration";

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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <Script id="endoora-theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
      </head>
      <body>
        <NetworkBandwidthBanner />
        {children}
        <ThemeToggle />
        <PWARegistration />
      </body>
    </html>
  );
}
