import { Suspense } from "react";
import { CourseCMSOperations } from "../../../components/courses/CourseCMSOperations";

export const metadata = {
  title: "مدیریت دوره‌ها و سرفصل‌ها (Course CMS) | Endoora Operations",
  description: "سامانه مدیریت دوره‌های آموزشی، ساختار سرفصل‌ها و اعتبارسنجی سانسور سمت سرور محتوای ویژه در Endoora",
};

export default function OperationsCoursesPage() {
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
