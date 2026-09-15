import { NotificationCenter } from "@/components/account/NotificationCenter";

export const metadata = {
  title: "مرکز اعلان‌ها و پیام‌ها | اندورا",
  description: "مرکز اعلان‌ها، پیام‌های آموزشی، تراکنش‌های مالی، هشدارهای امنیتی و تنظیمات دریافت پیامک پلتفرم اندورا",
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}
