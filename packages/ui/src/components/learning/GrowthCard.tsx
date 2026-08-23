import { Card } from "../Card";
import { ProgressBar } from "../Feedback";

export type GrowthCardProps = {
  evidenceCount?: number;
  evidenceGoal?: number;
};

export function GrowthCard({ evidenceCount = 6, evidenceGoal = 10 }: GrowthCardProps) {
  return (
    <Card title="Growth" description="A transparent evidence count—not a fabricated ability score.">
      <ProgressBar label="Recent practice evidence" value={evidenceCount} max={evidenceGoal} />
    </Card>
  );
}
