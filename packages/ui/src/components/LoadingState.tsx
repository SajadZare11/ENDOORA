import { Skeleton, StatusMessage } from "./Feedback";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <StatusMessage title={label}>
      <Skeleton label={label} />
    </StatusMessage>
  );
}
