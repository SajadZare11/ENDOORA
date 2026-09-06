import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "جامعه یادگیری و تبادل تجربه | اندورا",
  description: "جامعه تعاملی یادگیرندگان و مدرسان زبان انگلیسی اندورا - تبادل تجربیات تدریس، دانلود طرح درس‌های استاندارد، و پرسش و پاسخ تخصصی",
};

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return children;
}
