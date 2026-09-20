import { Metadata } from "next";
import { PWAOperationsDashboard } from "../../../components/operations/PWAOperationsDashboard";

export const metadata: Metadata = {
  title: "عملیات PWA و تاب‌آوری آفلاین | ایندورا",
  description: "کنسول پایش وب‌اپلیکیشن پیش‌رونده، بهینه‌سازی پهنای باند و همگام‌سازی پیش‌نویس‌های آفلاین پلتفرم ایندورا",
};

export default function PWAOperationsPage() {
  return <PWAOperationsDashboard />;
}
