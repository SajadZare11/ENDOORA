import { Metadata } from "next";
import { AccountDraftsHub } from "../../../components/drafts/AccountDraftsHub";

export const metadata: Metadata = {
  title: "پیش‌نویس‌های آفلاین و همگام‌سازی | ایندورا",
  description: "مدیریت پیش‌نویس‌های ذخیره‌شده محلی، صف ارسال آفلاین و حل تداخل نسخه‌ها",
};

export default function AccountDraftsPage() {
  return <AccountDraftsHub />;
}
