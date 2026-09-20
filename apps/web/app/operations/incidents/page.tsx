import { Metadata } from "next";
import { IncidentOperationsDashboard } from "../../../components/operations/IncidentOperationsDashboard";

export const metadata: Metadata = {
  title: "مدیریت بحران، راستی‌آزمایی بازیابی و دروازه پروداکشن | ایندورا",
  description: "کنسول پایش پایداری سیستم، مانورهای راستی‌آزمایی بازیابی دیتابیس، ران‌بوک‌های مهار بحران و ارزیابی دروازه لانچ پروداکشن ایندورا",
};

export default function IncidentOperationsPage() {
  return <IncidentOperationsDashboard />;
}
