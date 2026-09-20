import type { Metadata } from "next";

import { PlacementDemo } from "@/components/placement/PlacementDemo";
import { PublicShell } from "@/components/marketing/PublicShell";

export const metadata: Metadata = {
  title: "آزمون جامع تعیین سطح | ایندورا",
  description: "آزمون تعیین سطح جامع زبان انگلیسی در ۶ مهارت با تحلیل زنده و ارزیابی انطباقی در پلتفرم ایندورا.",
  robots: { index: false, follow: false },
};

export default function PlacementDemoPage() {
  return (
    <PublicShell locale="fa" currentPath="/placement/demo">
      <PlacementDemo />
    </PublicShell>
  );
}
