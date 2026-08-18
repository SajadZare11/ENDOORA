import { EndooraWordmark } from "@endoora/ui";

type HealthResponse = {
  status: "ok" | "degraded";
  service: string;
  environment: string;
  timezone: string;
  checks: {
    database: "ok" | "error";
    redis: "ok" | "error";
  };
};

async function getApiHealth(): Promise<HealthResponse | null> {
  const apiBase = process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${apiBase}/api/health/`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as HealthResponse;
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getApiHealth();

  return (
    <main className="local-home font-latin" dir="ltr" lang="en">
      <section className="card" aria-labelledby="page-title">
        <EndooraWordmark />
        <h1 id="page-title">Local development environment</h1>
        <p className="muted">Day 04 foundation: bilingual design tokens + accessible component library + web + API + PostgreSQL + Redis.</p>
        <p>
          Design-system previews: <a href="/design-system">tokens</a> · <a href="/design-system/components">components</a>.
        </p>

        <div className="status" role="status" aria-live="polite">
          <strong>{health ? "API connected" : "API unavailable"}</strong>
          {health ? (
            <>
              <div>Environment: <code>{health.environment}</code></div>
              <div>Timezone: <code>{health.timezone}</code></div>
              <ul className="status-list">
                <li>Database: {health.checks.database}</li>
                <li>Redis: {health.checks.redis}</li>
              </ul>
            </>
          ) : (
            <p className="muted">
              Start the Django API and local Docker services, then refresh this page.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
