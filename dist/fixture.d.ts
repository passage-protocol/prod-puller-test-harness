import { type APIRequestContext } from "@playwright/test";
/**
 * Shared Playwright fixture that creates an API request context
 * configured from standard E2E environment variables.
 *
 * Environment variables:
 * - E2E_SERVICE_URL: Base URL for the service (default: http://localhost:3000)
 * - E2E_API_KEY: Optional API key sent as X-API-Key header
 * - DEV_TOKEN: Optional Bearer token for Authorization header
 */
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & {
    api: APIRequestContext;
}, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
export { expect } from "@playwright/test";
//# sourceMappingURL=fixture.d.ts.map