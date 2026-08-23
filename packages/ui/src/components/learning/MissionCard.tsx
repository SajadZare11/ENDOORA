import type { ReactNode } from "react";
import { Badge, Card } from "../Card";

export type MissionCardProps = {
  title?: string;
  description?: ReactNode;
  status?: "ready" | "in-progress" | "complete";
  action?: ReactNode;
};

export function MissionCard({
  title = "Daily mission",
  description = "Complete one meaningful English growth activity.",
  status = "ready",
  action,
}: MissionCardProps) {
  const tone = status === "complete" ? "success" : status === "in-progress" ? "warning" : "info";
  const label = status === "in-progress" ? "In progress" : status === "complete" ? "Complete" : "Ready";

  return (
    <Card title={title} description={description} actions={<Badge tone={tone}>{label}</Badge>}>
      {action ?? <p>Your next activity stays focused and achievable.</p>}
    </Card>
  );
}
