export default function LearningPathPage() {
  const items = [
    ["ساخت پایه", "Build foundations", "current"],
    ["تمرین تطبیقی", "Adaptive practice", "upcoming"],
    ["اتصال به مدرس", "Teacher support", "planned"],
  ];

  return (
    <main dir="rtl">
      <h1>مسیر یادگیری شخصی Endoora</h1>
      <p>این مسیر از تعیین سطح، دوقلوی یادگیری و شواهد آموزشی ساخته می‌شود.</p>
      {items.map(([fa, en, status]) => (
        <section key={en}>
          <h2>{fa}</h2>
          <p dir="ltr">{en} · {status}</p>
          <p>وضعیت مسیر بر اساس داده واقعی به‌روزرسانی می‌شود.</p>
        </section>
      ))}
    </main>
  );
}
