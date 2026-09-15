import type { Metadata } from "next";
import { DisasterRecoveryOperationsDashboard } from "@/components/operations/DisasterRecoveryOperationsDashboard";

export const metadata: Metadata = {
  title: "بازیابی بحران و تکرار پایگاه داده | عملیات اندورا",
  description: "کنسول راهبری بازیابی بحران، وضعیت پایداری کلاستر پایگاه داده PostgreSQL 16 و مدیریت بکاپ‌های رمزنگاری شده (OPS-004)",
};

export default function DisasterRecoveryPage() {
  return <DisasterRecoveryOperationsDashboard />;
}
