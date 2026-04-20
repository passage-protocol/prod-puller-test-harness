import { test as base } from "@playwright/test";
/**
 * Shared Playwright fixture that creates an API request context
 * configured from standard E2E environment variables.
 *
 * Environment variables:
 * - E2E_SERVICE_URL: Base URL for the service (default: http://localhost:3000)
 *   If the URL has a path component (e.g. https://gateway/user), the path
 *   prefix is preserved and prepended to all request paths.
 * - E2E_API_KEY: Optional API key sent as X-API-Key header
 * - E2E_TENANT_NAME: Optional tenant name sent as X-Tenant header
 * - DEV_TOKEN: Optional Bearer token for Authorization header
 */
export const test = base.extend({
    api: async ({ playwright }, use) => {
        const raw = process.env.E2E_SERVICE_URL || "http://localhost:3000";
        const parsed = new URL(raw);
        const baseURL = parsed.origin;
        const pathPrefix = parsed.pathname.replace(/\/+$/, "");
        const headers = {
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
        const rawCtx = await playwright.request.newContext({
            baseURL,
            extraHTTPHeaders: headers,
        });
        // Wrap the context to prepend pathPrefix to all request paths
        const ctx = pathPrefix
            ? new Proxy(rawCtx, {
                get(target, prop, receiver) {
                    const val = Reflect.get(target, prop, receiver);
                    if (typeof val === "function" && ["get", "post", "put", "patch", "delete", "head", "fetch"].includes(prop)) {
                        return (url, ...args) => {
                            const prefixed = url.startsWith("http") ? url : `${pathPrefix}${url}`;
                            return val.call(target, prefixed, ...args);
                        };
                    }
                    return val;
                },
            })
            : rawCtx;
        await use(ctx);
        await rawCtx.dispose();
    },
});
export { expect } from "@playwright/test";
//# sourceMappingURL=fixture.js.map