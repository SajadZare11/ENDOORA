export default function ReviewPage() {
  return (
    <main dir="rtl" className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">مرور هوشمند واژگان</h1>

      <section className="rounded-xl border p-6">
        <p>واژه‌های نیازمند مرور امروز بر اساس سیستم تکرار فاصله‌دار انتخاب می‌شوند.</p>
      </section>

      <section className="rounded-xl border p-8 text-center">
        <h2 className="text-4xl font-bold">travel</h2>
        <p className="mt-4">سفر</p>

        <div className="mt-6 flex gap-3 justify-center">
          <button className="rounded-lg border px-4 py-2">سخت بود</button>
          <button className="rounded-lg border px-4 py-2">خوب بود</button>
          <button className="rounded-lg border px-4 py-2">آسان بود</button>
        </div>
      </section>
    </main>
  );
}
