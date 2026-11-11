import { redirect } from "next/navigation";

export default function SessionsPage() {
  redirect("/account?tab=security");
}
