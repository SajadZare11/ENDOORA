import { Badge } from "./Card";

export type ProviderState = "operational" | "degraded" | "unavailable";

export type ProviderStatusItem = {
  id: string;
  label: string;
  state: ProviderState;
  message: string;
};

export function ProviderStatus({ items, title = "Service status" }: { items: ProviderStatusItem[]; title?: string }) {
  return (
    <section className="endoora-provider-status" aria-label={title}>
      <h3 className="text-card-title">{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div className="endoora-provider-status__heading">
              <strong>{item.label}</strong>
              <Badge tone={item.state === "operational" ? "success" : item.state === "degraded" ? "warning" : "error"}>{item.state}</Badge>
            </div>
            <p>{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
