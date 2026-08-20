export default function LearningPathPage() {
  return (
    <main dir="rtl" className="p-8">
      <h1 className="text-3xl font-bold">
        مسیر یادگیری شخصی Endoora
      </h1>

      <p className="mt-4">
        مسیر شما بر اساس تعیین سطح و شواهد یادگیری ساخته می‌شود.
      </p>

      <div className="mt-8 space-y-4">

        <div className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">
            ساخت پایه زبان
          </h2>
          <p>
            Foundation skills
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">
            تمرین تطبیقی
          </h2>
          <p>
            Adaptive practice
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">
            اتصال به مدرس
          </h2>
          <p>
            Teacher support
          </p>
        </div>

      </div>
    </main>
  );
}
