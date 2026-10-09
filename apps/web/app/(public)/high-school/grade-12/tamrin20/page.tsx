import type { Metadata } from "next";
import { Tamrin20HubView } from "@/components/highschool/tamrin20";

export const metadata: Metadata = {
  title: "تمرین تا ۲۰ (زبان انگلیسی دوازدهم) | ایندورا",
  description:
    "بانک جامع و تعاملی بیش از ۱۰۰۰ سوال امتحانات نهایی زبان دوازدهم (Vision 3) به تفکیک درس و مهارت با تصحیح آنی، توضیحات تکمیلی و ثبت کارنامه تحلیلی.",
};

export default function Tamrin20HubPage() {
  return <Tamrin20HubView />;
}
