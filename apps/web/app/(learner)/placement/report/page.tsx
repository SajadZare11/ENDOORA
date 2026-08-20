export default function PlacementReportPage() {
  return (
    <main dir="rtl" className="min-h-screen p-8 text-right">
      <h1 className="text-3xl font-bold">
        گزارش تعیین سطح Endoora
      </h1>

      <section className="mt-6 max-w-2xl rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          سطح تخمینی: در حال محاسبه
        </h2>

        <p className="mt-4">
          این نتیجه یک تخمین آموزشی بر اساس شواهد آزمون است و مدرک رسمی CEFR نیست.
        </p>

        <div className="mt-6">
          <h3 className="font-semibold">جزئیات مهارت‌ها</h3>
          <p className="mt-2">
            پس از تکمیل آزمون، عملکرد گرامر، واژگان، خواندن و شنیدن نمایش داده می‌شود.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">قدم بعدی</h3>
          <p className="mt-2">
            Endoora مسیر یادگیری پیشنهادی را بر اساس نقاط قوت و ضعف پیشنهاد می‌کند.
          </p>
        </div>
      </section>
    </main>
  );
}
