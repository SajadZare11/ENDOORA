export type ServiceHealth = {
  status: "ok" | "degraded";
  service: string;
};
