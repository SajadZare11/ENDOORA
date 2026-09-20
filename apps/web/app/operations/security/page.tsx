import { SecurityOperationsDashboard } from "@/components/security/SecurityOperationsDashboard";

export const metadata = {
  title: "عملیات امنیت | ایندورا",
  description: "داشبورد عملیات امنیت پلتفرم ایندورا",
};

export default function SecurityOperationsPage() {
  return <SecurityOperationsDashboard />;
}
