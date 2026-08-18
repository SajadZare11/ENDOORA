import type { Metadata } from "next";
import { HomePage } from "../../components/marketing/HomePage";
import { buildMetadata } from "../../lib/public-site";

export const metadata: Metadata = buildMetadata(
  "en",
  "/",
  "Endoora | A new door to your English",
  "A Persian-first English learning system for Iranian learners: assessment, personal path, practice, teachers, and progress in one connected loop.",
);

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
