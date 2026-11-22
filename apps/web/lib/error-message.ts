export function errorMessage(value: unknown): string {
  if (typeof value === "object" && value !== null && "message" in value && typeof value.message === "string") return value.message;
  return "";
}
