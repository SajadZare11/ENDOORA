import { Metadata } from "next";
import { ProductionLaunchOperationsDashboard } from "../../../components/operations/ProductionLaunchOperationsDashboard";

export const metadata: Metadata = {
  title: "دروازه پروداکشن و مانور هفت مسیر طلایی | اندورا",
  description:
    "کنسول رسمی آمادگی پروداکشن (LAUNCH-001)، ارزیابی ۱۰ معیاری دروازه انتشار، مانور بدون تخریب مسیرهای هفت‌گانه طلایی و امضای دیجیتال گواهی بهره‌برداری پلتفرم اندورا",
};

export default function ProductionLaunchOperationsPage() {
  return <ProductionLaunchOperationsDashboard />;
}
