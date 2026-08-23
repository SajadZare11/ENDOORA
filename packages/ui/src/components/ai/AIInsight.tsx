import type { ReactNode } from "react";
import { Badge, Card } from "../Card";

export type AIInsightProps = {
  children?: ReactNode;
  evidence?: ReactNode;
};

export function AIInsight({
  children = "Your recent practice uses more active vocabulary.",
  evidence = "Based on three reviewed writing samples.",
}: AIInsightProps) {
  return (
    <Card className="endoora-ai-result" title="AI insight" actions={<Badge tone="info">AI-generated</Badge>}>
      <p dir="ltr">{children}</p>
      <p><strong>Evidence:</strong> {evidence}</p>
    </Card>
  );
}
