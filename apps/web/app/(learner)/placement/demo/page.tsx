import type { Metadata } from "next";

import { PlacementDemo } from "@/components/placement/PlacementDemo";

export const metadata: Metadata = {
  title: "پیش‌نمایش رابط تعیین سطح | Endoora",
  description: "نمونه غیرعملی رابط تعیین سطح Endoora؛ بدون تولید نتیجه یا برآورد آموزشی.",
  robots: { index: false, follow: false },
};

export default function PlacementDemoPage() {
  return <PlacementDemo />;
}
