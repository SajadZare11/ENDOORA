import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const publicUrl = new URL(process.env.ENDOORA_PUBLIC_URL ?? "https://endoora.ir");

export const metadata: Metadata = {
  metadataBase: publicUrl,
  title: {
    default: "Endoora | A new door to your English",
    template: "%s | Endoora",
  },
  description: "Endoora is a Persian-first English learning system for Iranian learners.",
  applicationName: "Endoora",
  category: "education",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
