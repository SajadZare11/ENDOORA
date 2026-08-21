import type { ReactNode } from "react";

export default function EndooraCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="card">
      {children}
    </section>
  );
}