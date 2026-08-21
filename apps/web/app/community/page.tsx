import EndooraCard from "@/components/ui/EndooraCard";
import SectionTitle from "@/components/ui/SectionTitle";

export default function CommunityPage() {
  return (
    <main className="local-home" dir="rtl">

      <SectionTitle
        title="انجمن Endoora"
        subtitle="یادگیری، گفتگو و تمرین زبان با جامعه زبان‌آموزان"
      />

      <div className="card">
        <h2>
          جستجوی موضوعات
        </h2>

        <p>
          Speaking، IELTS، Grammar، Writing، Listening
        </p>
      </div>


      <EndooraCard>
        <h2>
          تمرین Speaking
        </h2>

        <p>
          گفتگو درباره موضوعات روز و آزمون‌ها
        </p>
      </EndooraCard>


      <EndooraCard>
        <h2>
          گرامر و واژگان
        </h2>

        <p>
          پرسش و پاسخ بین زبان‌آموزان
        </p>
      </EndooraCard>


      <EndooraCard>
        <h2>
          آخرین گفتگوها
        </h2>

        <p className="muted">
          هنوز گفتگویی ایجاد نشده است.
        </p>

        <button>
          ایجاد پست جدید
        </button>

      </EndooraCard>

    </main>
  );
}
