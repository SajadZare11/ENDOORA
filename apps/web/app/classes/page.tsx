import type { Metadata } from "next";
import { PublicShell } from "../../components/marketing/PublicShell";
import { ClassesHub } from "../../components/classes";
import { buildMetadata, publicPages } from "../../lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/classes",
  publicPages.classes.fa.title,
  publicPages.classes.fa.summary,
);

export default function ClassesPage() {
  return (
    <PublicShell locale="fa" currentPath="/classes">
      <ClassesHub />
    </PublicShell>
  );
}
