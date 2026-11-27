import AdaptivePracticeHub from "@/components/practice/AdaptivePracticeHub";

export const metadata = {
  title: "تمرین هوشمند گرامر و ساختار زبانی | ایندورا",
  description: "تمرین تعاملی و انطباقی گرامر متصل به موتور شناختی LinUCB و مدل زوال حافظه DKT-Forget",
};

export default function PracticeAIPage() {
  return <AdaptivePracticeHub initialSection="grammar" aiFocused={true} />;
}
