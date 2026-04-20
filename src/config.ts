import { defineConfig } from "@playwright/test";
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
export function createPlaywrightConfig(
  overrides: ConfigOverrides = {},
): PlaywrightTestConfig {
  const {
    testDir = "./tests",
    timeout = 30_000,
    expectTimeout = 10_000,
    retries = 2,
    workers = 4,
    extra = {},
  } = overrides;

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
