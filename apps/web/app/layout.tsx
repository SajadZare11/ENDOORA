import type { Metadata } from "next";
import "./globals.css";
import "@endoora/ui/tokens.css";
import "@endoora/ui/components.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.ENDOORA_PUBLIC_URL ?? "https://endoora.ir"),
  title: "Endoora | A new door to your English",
  description: "A Persian-first English learning system for Iranian learners.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
