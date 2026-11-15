import { Suspense } from "react";
import { AdminPageClient } from "@/components/admin/AdminPageClient";

export const metadata = {
  title: "دروازه امن مدیریت ارشد (Admin Gate) | Endoora",
  description: "مرکز فرماندهی، ویرایشگر دیداری بخش‌های سایت، مدیریت کاربران و اساتید، دوره‌ها و خزانه‌داری",
};

export default function AdminPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <Suspense
        fallback={
          <div style={{ padding: "4rem", textAlign: "center", color: "#94a3b8", fontSize: "1.1rem" }}>
            در حال بارگذاری دروازه مدیریت ارشد ایندورا...
          </div>
        }
      >
        <AdminPageClient />
      </Suspense>
    </main>
  );
}
