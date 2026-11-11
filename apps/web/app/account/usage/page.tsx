import { redirect } from "next/navigation";

export default function UsagePage() {
  redirect("/account?tab=usage");
}
