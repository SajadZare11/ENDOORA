import { Suspense } from "react";
import { AuditLogsOperations } from "../../../components/admin/AuditLogsOperations";

export const metadata = {
  title: "ردپای ممیزی و وقایع حساس پلتفرم (Audit Trail) | Endoora Operations",
  description: "سامانه بازرسی و پایش رخدادهای غیرقابل‌حذف ممیزی، تغییرات کلیدها و انتشارهای محتوایی در پلتفرم اندورا",
};

export default function OperationsAuditPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense
        fallback={
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
            در حال بارگذاری سامانه ردپای ممیزی...
          </div>
        }
      >
        <AuditLogsOperations />
      </Suspense>
    </main>
  );
}
