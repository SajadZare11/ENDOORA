import type { CSSProperties, ReactNode } from "react";

export function Skeleton({ width = "100%", height = "1rem", label = "Loading content" }: { width?: string; height?: string; label?: string }) {
  return (
    <span
      className="endoora-skeleton"
      role="status"
      aria-label={label}
      style={{ "--skeleton-width": width, "--skeleton-height": height } as CSSProperties}
    />
  );
}

export function ProgressBar({ value, max = 100, label, showValue = true }: { value: number; max?: number; label: string; showValue?: boolean }) {
  const boundedValue = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((boundedValue / max) * 100) : 0;
  return (
    <div className="endoora-progress">
      <div className="endoora-progress__label">
        <span>{label}</span>
        {showValue ? <span className="ltr-isolate">{percent}%</span> : null}
      </div>
      <progress value={boundedValue} max={max} aria-label={label}>{percent}%</progress>
    </div>
  );
}

export function StatusMessage({ tone = "info", title, children }: { tone?: "info" | "success" | "warning" | "error"; title: string; children?: ReactNode }) {
  const role = tone === "error" ? "alert" : "status";
  return (
    <section className={`endoora-status-message endoora-status-message--${tone}`} role={role}>
      <strong>{title}</strong>
      {children ? <div>{children}</div> : null}
    </section>
  );
}
