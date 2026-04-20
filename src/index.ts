import type { APIRequestContext } from "@playwright/test";

function safeJsonParse<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiGet<T = unknown>(
  api: APIRequestContext,
  path: string,
): Promise<{ status: number; body: T }> {
  const resp = await api.get(path);
  const text = await resp.text();
  return {
    status: resp.status(),
    body: text ? safeJsonParse<T>(text) : (undefined as unknown as T),
  };
}

export async function apiPost<T = unknown>(
  api: APIRequestContext,
  path: string,
  data?: unknown,
): Promise<{ status: number; body: T }> {
  const resp = await api.post(path, {
    data: data ? JSON.stringify(data) : undefined,
  });
  const text = await resp.text();
  return {
    status: resp.status(),
    body: text ? safeJsonParse<T>(text) : (undefined as unknown as T),
  };
}

export async function apiPut<T = unknown>(
  api: APIRequestContext,
  path: string,
  data?: unknown,
): Promise<{ status: number; body: T }> {
  const resp = await api.put(path, {
    data: data ? JSON.stringify(data) : undefined,
  });
  const text = await resp.text();
  return {
    status: resp.status(),
    body: text ? safeJsonParse<T>(text) : (undefined as unknown as T),
  };
}

export async function apiPatch<T = unknown>(
  api: APIRequestContext,
  path: string,
  data?: unknown,
): Promise<{ status: number; body: T }> {
  const resp = await api.patch(path, {
    data: data ? JSON.stringify(data) : undefined,
  });
  const text = await resp.text();
  return {
    status: resp.status(),
    body: text ? safeJsonParse<T>(text) : (undefined as unknown as T),
  };
}

export async function apiDelete(
  api: APIRequestContext,
  path: string,
): Promise<{ status: number }> {
  const resp = await api.delete(path);
  return { status: resp.status() };
}

export async function waitForHealthy(
  api: APIRequestContext,
  path = "/health",
  { timeout = 30_000, interval = 1_000 } = {},
): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const resp = await api.get(path);
      if (resp.ok()) return;
    } catch {
      // service not up yet
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(
    `Service did not become healthy at ${path} within ${timeout}ms`,
  );
}

export function uniqueId(prefix = "e2e") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
