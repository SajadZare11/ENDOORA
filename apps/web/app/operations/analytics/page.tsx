import { Metadata } from "next";
import { ProductAnalyticsOperationsDashboard } from "../../../components/operations/ProductAnalyticsOperationsDashboard";

export const metadata: Metadata = {
  title: "تحلیل محصول و قیف‌های تبدیل (OPS-007) | عملیات اندورا",
  description: "داشبورد عملیاتی تحلیل رفتار کاربران، نرخ تبدیل فانل‌ها و پایش تلمتری رویدادهای پلتفرم اندورا",
};

export default function ProductAnalyticsOperationsPage() {
  return <ProductAnalyticsOperationsDashboard />;
}
