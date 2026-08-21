export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header dir="rtl">
      <h1>
        {title}
      </h1>

      {subtitle && (
        <p className="muted">
          {subtitle}
        </p>
      )}
    </header>
  );
}