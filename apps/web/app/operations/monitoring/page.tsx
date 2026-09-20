import { MonitoringOperationsDashboard } from "@/components/operations/MonitoringOperationsDashboard";

export const metadata = {
  title: "پایش و لاگ‌های ساختاریافته (OPS-006) | عملیات ایندورا",
  description: "داشبورد عملیات نظارت بر عملکرد، تاخیرها، لاگ‌های ساختاریافته و ردیابی توزیع‌شده پلتفرم ایندورا",
};

export default function MonitoringOperationsPage() {
  return <MonitoringOperationsDashboard />;
}
