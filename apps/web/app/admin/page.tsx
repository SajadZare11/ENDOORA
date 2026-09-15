import { Suspense } from "react";
import { AdminOperationsDashboard } from "../../components/admin/AdminOperationsDashboard";

export const metadata = {
  title: "میز مدیریت کل عملیات (Admin Operations Console) | Endoora",
  description: "مرکز فرماندهی و پایش بلادرنگ عملیات، صف‌های بازبینی، خزانه‌داری، احراز هویت اساتید و کلیدهای اضطراری",
};

export default function AdminPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense
        fallback={
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
            در حال بارگذاری مرکز فرماندهی عملیات...
          </div>
        }
      >
        <AdminOperationsDashboard />
      </Suspense>
    </main>
  );
}
