import type { ReactNode } from "react";
import { Badge, Card } from "../Card";

export type LearnerTwinCardProps = {
  summary?: ReactNode;
  evidenceLabel?: string;
};

export function LearnerTwinCard({
  summary = "Your learning profile evolves only from reviewed activity and explicit preferences.",
  evidenceLabel = "Evidence-aware",
}: LearnerTwinCardProps) {
  return (
    <Card title="Learner Twin" actions={<Badge tone="info">{evidenceLabel}</Badge>}>
      <p>{summary}</p>
    </Card>
  );
}
