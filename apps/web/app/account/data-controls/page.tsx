import { redirect } from "next/navigation";

export default function DataControlsPage() {
  redirect("/account?tab=data");
}
