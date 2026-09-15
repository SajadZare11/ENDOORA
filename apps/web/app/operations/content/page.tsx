import { Suspense } from "react";
import { ContentCMSOperations } from "../../../components/content/ContentCMSOperations";

export const metadata = {
  title: "مدیریت محتوا، مهارت‌ها و فرهنگ (Content CMS) | Endoora Operations",
  description: "سامانه مدیریت محتوای آموزشی، دروس صوتی و تصویری، مهارت‌های هشت‌گانه، مقالات فرهنگی و راهنماهای کنکور",
};

export default function OperationsContentPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense
        fallback={
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
            در حال بارگذاری سامانه مدیریت محتوا...
          </div>
        }
      >
        <ContentCMSOperations />
      </Suspense>
    </main>
  );
}
