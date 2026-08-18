import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "@endoora/ui/tokens.css";
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

export const metadata: Metadata = {
  title: "Endoora — Local Development",
  description: "Endoora local development environment",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
