export type EndooraLocale = "fa" | "en";

type JsonObject = Record<string, unknown>;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
};

export class EndooraApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, data: unknown) {
    super(`Endoora API request failed with status ${status}.`);
    this.name = "EndooraApiError";
    this.status = status;
    this.data = data;
  }
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch("/backend/api/auth/csrf/", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await parseResponse(response);

  if (!response.ok || !isObject(data) || typeof data.csrf_token !== "string") {
    throw new EndooraApiError(response.status, data);
  }

  return data.csrf_token;
}

function isMutatingMethod(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method);
}

export async function endooraApi<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  }

  if (isMutatingMethod(method)) {
    const csrfToken = await getCsrfToken();
    headers.set("X-CSRFToken", csrfToken);
  }

  const response = await fetch(`/backend/api${path}`, {
    ...options,
    method,
    headers,
    body,
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new EndooraApiError(response.status, data);
  }

  return data as T;
}

export function apiErrorMessages(
  error: unknown,
  locale: EndooraLocale,
): string[] {
  if (!(error instanceof EndooraApiError)) {
    return [
      locale === "fa"
        ? "ارتباط با سرور انجام نشد. دوباره تلاش کنید."
        : "Could not reach the server. Please try again.",
    ];
  }

  if (!isObject(error.data)) {
    return [
      locale === "fa"
        ? "درخواست انجام نشد. دوباره تلاش کنید."
        : "The request could not be completed. Please try again.",
    ];
  }

  const bilingualKey = locale === "fa" ? "message_fa" : "message_en";
  const bilingualMessage = error.data[bilingualKey];

  if (typeof bilingualMessage === "string") {
    return [bilingualMessage];
  }

  const ignoredKeys = new Set([
    "code",
    "message_fa",
    "message_en",
  ]);

  const messages: string[] = [];

  for (const [field, value] of Object.entries(error.data)) {
    if (ignoredKeys.has(field)) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          messages.push(item);
        }
      }
      continue;
    }

    if (typeof value === "string") {
      messages.push(value);
    }
  }

  if (messages.length > 0) {
    return messages;
  }

  return [
    locale === "fa"
      ? "درخواست انجام نشد. اطلاعات واردشده را بررسی کنید."
      : "The request could not be completed. Check the information you entered.",
  ];
}
