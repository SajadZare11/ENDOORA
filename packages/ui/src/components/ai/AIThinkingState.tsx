import { Skeleton, StatusMessage } from "../Feedback";

export function AIThinkingState({ label = "AI is reviewing the available learning evidence…" }: { label?: string }) {
  return (
    <StatusMessage tone="info" title="AI analysis in progress">
      <p>{label}</p>
      <Skeleton width="70%" label={label} />
    </StatusMessage>
  );
}
