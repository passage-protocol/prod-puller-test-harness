import type { PlaywrightTestConfig } from "@playwright/test";
interface ConfigOverrides {
    /** Test directory relative to config file (default: "./tests") */
    testDir?: string;
    /** Timeout per test in ms (default: 30000) */
    timeout?: number;
    /** Expect assertion timeout in ms (default: 10000) */
    expectTimeout?: number;
    /** Number of retries in CI (default: 2) */
    retries?: number;
    /** Number of parallel workers in CI (default: 4) */
    workers?: number;
    /** Job timeout in minutes (default: 15) */
    timeoutMinutes?: number;
    /** Additional Playwright config overrides */
    extra?: Partial<PlaywrightTestConfig>;
}
/**
 * Creates a standardized Playwright config for E2E API testing.
 * All prod-puller services share the same base configuration:
 * - fullyParallel execution
 * - CI-aware retries and workers
 * - HTML + JUnit reporters
 * - dotenv loading from E2E_SERVICE_URL
 */
export declare function createPlaywrightConfig(overrides?: ConfigOverrides): PlaywrightTestConfig;
export {};
//# sourceMappingURL=config.d.ts.map