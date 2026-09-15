import { Suspense } from "react";
import { ContentCMSOperations } from "../../../components/content/ContentCMSOperations";

export const metadata = {
  title: "مدیریت محتوا و فرهنگ (Content CMS) | Endoora Admin",
  description: "سامانه مدیریت محتوای آموزشی، دروس صوتی و تصویری و مقالات فرهنگی در پنل مدیریت اندورا",
};

export default function AdminContentPage() {
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
