import type { ReactNode } from "react";
import { StatePanel } from "./States";

export function ErrorState({
  message = "Something went wrong",
  action,
}: {
  message?: ReactNode;
  action?: ReactNode;
}) {
  return <StatePanel tone="error" icon="×" title="Something went wrong" description={message} action={action} />;
}
