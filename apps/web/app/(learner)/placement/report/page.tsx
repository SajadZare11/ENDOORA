export default function PlacementReportPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-5 md:p-10 text-right">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 p-8 text-white">
          <p className="opacity-90">Endoora Learning Profile</p>
          <h1 className="mt-3 text-4xl font-bold">گزارش تعیین سطح تو</h1>
          <p className="mt-4 leading-8">
            نتیجه، یک تخمین آموزشی بر اساس شواهد آزمون است و مدرک رسمی CEFR محسوب نمی‌شود.
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-white border p-8 shadow-sm">
          <h2 className="text-2xl font-bold">سطح تخمینی</h2>
          <div className="mt-5 rounded-2xl bg-blue-50 p-6 text-blue-800 text-xl font-semibold">
            در حال محاسبه مسیر شخصی...
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['گرامر','واژگان','خواندن','شنیدن'].map((item)=>(
              <div key={item} className="rounded-2xl border p-5">
                <h3 className="font-semibold">{item}</h3>
                <p className="mt-3 text-sm text-slate-500">پس از تکمیل آزمون نمایش داده می‌شود</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h3 className="font-bold text-xl">قدم بعدی</h3>
            <p className="mt-3 leading-8">
              Endoora بر اساس عملکرد تو، مسیر یادگیری، تمرین‌های روزانه و نقاط تمرکز را پیشنهاد می‌کند.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
