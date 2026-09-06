import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "جستجوی یکپارچه | اندورا",
  description: "جستجوی سریع و هوشمند در میان دوره‌ها، مدرس‌ها، طرح درس‌ها، تجربیات جامعه و سوالات متداول آموزش زبان انگلیسی اندورا",
};

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children;
}
