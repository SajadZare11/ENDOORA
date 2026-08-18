import type { ReactNode } from "react";
import { Button } from "./Button";

export type StatePanelProps = {
  icon?: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "info" | "warning" | "error";
};

export function StatePanel({ icon, title, description, action, tone = "neutral" }: StatePanelProps) {
  return (
    <section className={`endoora-state-panel endoora-state-panel--${tone}`}>
      {icon ? <div className="endoora-state-panel__icon" aria-hidden="true">{icon}</div> : null}
      <h3 className="text-card-title">{title}</h3>
      <div className="endoora-state-panel__description">{description}</div>
      {action ? <div className="endoora-state-panel__action">{action}</div> : null}
    </section>
  );
}

export function EmptyState({ title = "Nothing here yet", description = "Your content will appear here when it is available.", action }: { title?: string; description?: ReactNode; action?: ReactNode }) {
  return <StatePanel title={title} description={description} action={action} icon="○" />;
}

export function PermissionDeniedState({ onBack }: { onBack?: () => void }) {
  return <StatePanel tone="warning" icon="!" title="You do not have access" description="This area is limited to the required role or relationship." action={onBack ? <Button variant="secondary" onClick={onBack}>Go back</Button> : undefined} />;
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return <StatePanel tone="warning" icon="↯" title="You are offline" description="Saved reading and drafts remain available where supported. Reconnect to sync new changes." action={onRetry ? <Button variant="secondary" onClick={onRetry}>Try again</Button> : undefined} />;
}

export function RetryState({ title = "Something went wrong", description = "The request did not finish. Your existing data has not been changed.", onRetry }: { title?: string; description?: ReactNode; onRetry: () => void }) {
  return <StatePanel tone="error" icon="×" title={title} description={description} action={<Button variant="secondary" onClick={onRetry}>Retry</Button>} />;
}
