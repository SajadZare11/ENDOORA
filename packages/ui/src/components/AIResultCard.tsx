import type { ReactNode } from "react";
import { Badge, Card } from "./Card";
import { Button } from "./Button";

export type AIResultCardProps = {
  title: string;
  confidence?: "low" | "medium" | "high";
  evidence: ReactNode;
  limitations: ReactNode;
  children: ReactNode;
  onRetry?: () => void;
  onReport?: () => void;
  onSave?: () => void;
  onHumanReview?: () => void;
};

export function AIResultCard({ title, confidence, evidence, limitations, children, onRetry, onReport, onSave, onHumanReview }: AIResultCardProps) {
  return (
    <Card className="endoora-ai-result" title={<span className="endoora-ai-result__title"><Badge tone="info">AI-generated</Badge>{title}</span>}>
      <div className="endoora-ai-result__content">{children}</div>
      <dl className="endoora-ai-result__meta">
        {confidence ? <div><dt>Confidence</dt><dd><Badge tone={confidence === "high" ? "success" : confidence === "medium" ? "warning" : "neutral"}>{confidence}</Badge></dd></div> : null}
        <div><dt>Evidence</dt><dd>{evidence}</dd></div>
        <div><dt>Limitations</dt><dd>{limitations}</dd></div>
      </dl>
      <div className="endoora-ai-result__actions" aria-label="AI result actions">
        {onRetry ? <Button variant="secondary" onClick={onRetry}>Retry</Button> : null}
        {onSave ? <Button variant="secondary" onClick={onSave}>Save</Button> : null}
        {onHumanReview ? <Button variant="tertiary" onClick={onHumanReview}>Human review</Button> : null}
        {onReport ? <Button variant="tertiary" onClick={onReport}>Report</Button> : null}
      </div>
    </Card>
  );
}
