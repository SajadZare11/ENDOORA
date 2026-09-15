import { Suspense } from "react";
import { FeatureFlagsOperations } from "../../../components/admin/FeatureFlagsOperations";

export const metadata = {
  title: "مدیریت کلیدهای ویژگی و کیل‌سوئیچ‌ها (Feature Flags) | Endoora Operations",
  description: "سامانه پایش و تنظیم کلیدهای ویژگی، کنترل دسترسی تدریجی و کیل‌سوئیچ‌های قطع اضطراری پلتفرم",
};

export default function OperationsFlagsPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense
        fallback={
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
            در حال بارگذاری سامانه کلیدهای ویژگی...
          </div>
        }
      >
        <FeatureFlagsOperations />
      </Suspense>
    </main>
  );
}
