import { defineConfig } from "@playwright/test";
/**
 * Creates a standardized Playwright config for E2E API testing.
 * All prod-puller services share the same base configuration:
 * - fullyParallel execution
 * - CI-aware retries and workers
 * - HTML + JUnit reporters
 * - dotenv loading from E2E_SERVICE_URL
 */
export function createPlaywrightConfig(overrides = {}) {
    const { testDir = "./tests", timeout = 30_000, expectTimeout = 10_000, retries = 2, workers = 4, extra = {}, } = overrides;
    const IS_CI = !!process.env.CI;
    return defineConfig({
        testDir,
        outputDir: "./test-results",
        fullyParallel: true,
        forbidOnly: IS_CI,
        retries: IS_CI ? retries : 0,
        workers: IS_CI ? workers : undefined,
        reporter: IS_CI
            ? [
                ["html", { outputFolder: "./playwright-report" }],
                ["junit", { outputFile: "./test-results/junit.xml" }],
            ]
            : [["html", { outputFolder: "./playwright-report", open: "never" }]],
        timeout,
        expect: { timeout: expectTimeout },
        ...extra,
    });
}
//# sourceMappingURL=config.js.map