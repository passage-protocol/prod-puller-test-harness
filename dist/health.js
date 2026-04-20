import { test, expect } from "./fixture.js";
import { apiGet, waitForHealthy } from "./index.js";
/**
 * Generates a standard health check test suite for a service.
 * Includes liveness, readiness, and startup health wait tests.
 */
export function describeHealthSuite(serviceName, options = {}) {
    const { validateReadinessBody = false, livenessPath = "/health", readinessPath = "/health/ready", healthTimeout = 30_000, } = options;
    test.describe(`${serviceName} - Health`, () => {
        test("liveness endpoint returns 200", async ({ api }) => {
            const { status, body } = await apiGet(api, livenessPath);
            expect(status).toBe(200);
            expect(body).toBeDefined();
        });
        test("readiness endpoint responds", async ({ api }) => {
            const { status, body } = await apiGet(api, readinessPath);
            expect([200, 503]).toContain(status);
            if (validateReadinessBody && status === 200 && body && typeof body === "object") {
                const b = body;
                if (options.serviceName) {
                    expect(b["service"]).toBe(options.serviceName);
                }
                expect(b["status"]).toBeDefined();
            }
        });
        test("service becomes healthy within timeout", async ({ api }) => {
            await waitForHealthy(api, livenessPath, { timeout: healthTimeout });
        });
    });
}
//# sourceMappingURL=health.js.map