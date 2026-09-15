import type { Metadata } from "next";
import { AIModelPromptRegistryOperations } from "@/components/operations/AIModelPromptRegistryOperations";

export const metadata: Metadata = {
  title: "راهبری مدل‌ها و رجیستری پرامپت هوش مصنوعی | عملیات اندورا",
  description: "کنسول مدیریت مسیربخش مدل‌های زبانی، رجیستری پرامپت‌های نسخه‌دار، بودجه خطا و سقف هزینه روزانه (OPS-005)",
};

export default function AIOperationsPage() {
  return <AIModelPromptRegistryOperations />;
}
