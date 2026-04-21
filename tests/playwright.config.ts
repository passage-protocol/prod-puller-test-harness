import { defineConfig } from "@playwright/test";

const IS_CI = !!process.env.CI;
const BASE_URL = process.env.E2E_GATEWAY_URL || "https://test-gateway.mypuller.com";

const services = [
  { name: "user", path: "/user" },
  { name: "scorecard", path: "/scorecard" },
  { name: "claws", path: "/claws" },
  { name: "context", path: "/context" },
  { name: "cockpit", path: "/cockpit" },
  { name: "agent", path: "/agent" },
  { name: "worker", path: "/worker" },
  { name: "gateway", path: "" },
];

const targetService = process.env.E2E_SERVICE_NAME;

const projects = services
  .filter((s) => !targetService || s.name === targetService)
  .map((s) => ({
    name: s.name,
    testDir: `./${s.name}`,
    use: {
      baseURL: `${BASE_URL}${s.path}`,
    },
  }));

export default defineConfig({
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 4 : undefined,
  reporter: IS_CI
    ? [
        ["html", { outputFolder: "./playwright-report" }],
        ["junit", { outputFile: "./test-results/junit.xml" }],
      ]
    : [["html", { outputFolder: "./playwright-report", open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  projects,
});
