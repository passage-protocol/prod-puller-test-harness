import { test as base, type APIRequestContext } from "@playwright/test";

/**
 * Shared Playwright fixture that creates an API request context
 * configured from standard E2E environment variables.
 *
 * Environment variables:
 * - E2E_SERVICE_URL: Base URL for the service (default: http://localhost:3000)
 * - E2E_API_KEY: Optional API key sent as X-API-Key header
 * - E2E_TENANT_NAME: Optional tenant name sent as X-Tenant header
 * - DEV_TOKEN: Optional Bearer token for Authorization header
 */
export const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright }, use) => {
    const baseURL =
      process.env.E2E_SERVICE_URL || "http://localhost:3000";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (process.env.E2E_API_KEY) {
      headers["X-API-Key"] = process.env.E2E_API_KEY;
    }
    if (process.env.E2E_TENANT_NAME) {
      headers["X-Tenant"] = process.env.E2E_TENANT_NAME;
    }
    if (process.env.DEV_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.DEV_TOKEN}`;
    }

    const ctx = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: headers,
    });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect } from "@playwright/test";
