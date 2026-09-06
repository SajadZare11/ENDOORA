import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "پشتیبانی و سوالات متداول | اندورا",
  description: "مرکز پشتیبانی، پایگاه دانش رسمی، سوالات متداول و سامانه ثبت تیکت هوشمند با ارجاع مستقیم به کارشناسان اندورا",
};

export default function SupportLayout({ children }: { children: ReactNode }) {
  return children;
}
