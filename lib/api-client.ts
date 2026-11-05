export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Typed fetch wrapper for the app's own /api/v1 endpoints. Unwraps `{ data }`
// and throws ApiError with the server's `error` message on failure.
export async function apiRequest<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const response = await fetch(url, {
    ...rest,
    headers: json === undefined ? headers : { "Content-Type": "application/json", ...headers },
    body: json === undefined ? rest.body : JSON.stringify(json),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error ?? "Request failed", response.status);
  return body.data as T;
}
