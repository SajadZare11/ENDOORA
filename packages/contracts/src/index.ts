export type ServiceHealth = {
  status: "ok" | "degraded";
  service: string;
};

export * from "./teacheros";
export * from "./lesson";

