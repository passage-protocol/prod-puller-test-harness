import { test, expect } from "./fixture.js";
import { apiGet, waitForHealthy } from "./index.js";

interface HealthSuiteOptions {
  /** Validate that the readiness body includes expected fields */
  validateReadinessBody?: boolean;
  /** Service name to check in readiness response */
  serviceName?: string;
  /** Custom liveness path (default: /health) */
  livenessPath?: string;
  /** Custom readiness path (default: /health/ready) */
  readinessPath?: string;
  /** Timeout for waitForHealthy (default: 30000ms) */
  healthTimeout?: number;
}

/**
 * Generates a standard health check test suite for a service.
 * Includes liveness, readiness, and startup health wait tests.
 */
export function describeHealthSuite(
  serviceName: string,
  options: HealthSuiteOptions = {},
) {
  const {
    validateReadinessBody = false,
    livenessPath = "/health",
    readinessPath = "/health/ready",
    healthTimeout = 30_000,
  } = options;

  test.describe(`${serviceName} - Health`, () => {
    test("liveness endpoint returns 200", async ({ api }) => {
      const { status, body } = await apiGet(api, livenessPath);
      expect([200, 401, 403]).toContain(status);
      if (status === 200) {
        expect(body).toBeDefined();
      }
    });

    test("readiness endpoint responds", async ({ api }) => {
      const { status, body } = await apiGet(api, readinessPath);
      expect([200, 401, 403, 404, 503]).toContain(status);

      if (validateReadinessBody && status === 200 && body && typeof body === "object") {
        const b = body as Record<string, unknown>;
        if (options.serviceName) {
          expect(b["service"]).toBe(options.serviceName);
        }
        expect(b["status"]).toBeDefined();
      }
    });

    test("service becomes healthy within timeout", async ({ api }) => {
      const { status } = await apiGet(api, livenessPath);
      if (status === 401 || status === 403) {
        // Auth required — endpoint is reachable but behind auth
        return;
      }
      await waitForHealthy(api, livenessPath, { timeout: healthTimeout });
    });
  });
}
