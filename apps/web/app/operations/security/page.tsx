import { SecurityOperationsDashboard } from "@/components/security/SecurityOperationsDashboard";

export const metadata = {
  title: "عملیات امنیت | اندورا",
  description: "داشبورد عملیات امنیت پلتفرم اندورا",
};

export default function SecurityOperationsPage() {
  return <SecurityOperationsDashboard />;
}
