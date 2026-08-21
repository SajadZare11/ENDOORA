export default function TodayPage() {
  return (
    <main dir="rtl" className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">ماموریت امروز</h1>

      <section className="rounded-xl border p-6">
        <h2 className="text-xl font-bold">سلام زبان‌آموز 👋</h2>
        <p className="mt-3">
          برنامه امروز بر اساس مسیر یادگیری، سطح فعلی و شواهد قبلی شما انتخاب شده است.
        </p>
      </section>

      <section className="rounded-xl border p-6">
        <h2 className="font-bold">🎯 هدف امروز</h2>
        <p>تقویت مهارتی که بیشترین نیاز به تمرین دارد.</p>
      </section>

      <section className="rounded-xl border p-6">
        <h2 className="font-bold">چرا این ماموریت انتخاب شد؟</h2>
        <ul className="mt-3 list-disc pr-5">
          <li>بر اساس مسیر شخصی یادگیری</li>
          <li>بر اساس فعالیت‌های قبلی</li>
        </ul>
      </section>

      <button className="rounded-lg bg-blue-600 px-5 py-3 text-white">
        شروع ماموریت امروز
      </button>
    </main>
  );
}
