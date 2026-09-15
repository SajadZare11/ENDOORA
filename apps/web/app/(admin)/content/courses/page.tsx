import { Suspense } from "react";
import { CourseCMSOperations } from "../../../../components/courses/CourseCMSOperations";

export const metadata = {
  title: "مدیریت دوره‌های آموزشی (Course CMS) | Endoora Admin",
  description: "سامانه مدیریت دوره‌های آموزشی، ساختار سرفصل‌ها و اعتبارسنجی سانسور سمت سرور در پنل مدیریت",
};

export default function AdminContentCoursesPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense
        fallback={
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
            در حال بارگذاری سامانه دوره‌ها...
          </div>
        }
      >
        <CourseCMSOperations initialLocale="fa" />
      </Suspense>
    </main>
  );
}
