/**
 * Assembles the full context payload for the testgen Lambda from:
 * - Git diff of the triggering commit
 * - Service manifest (e2e/testgen-manifest.json)
 * - Existing test files from the test harness
 * - Helper type signatures from src/
 *
 * Usage: npx tsx scripts/build-prompt.ts \
 *   --diff <path-to-diff-file> \
 *   --manifest <path-to-manifest-file> \
 *   --service <service-name> \
 *   --gateway-path <gateway-path> \
 *   --commit-message <message> \
 *   --commit-sha <sha> \
 *   --tests-dir <path-to-existing-tests> \
 *   --output <path-to-output-json>
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from "fs";
import { join, resolve } from "path";

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    args[key] = argv[i + 1] ?? "";
  }
  return args;
}

function readFileSafe(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

function collectTestFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];

  function walk(current: string) {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".spec.ts") || entry.endsWith(".test.ts")) {
        results.push(readFileSync(full, "utf-8"));
      }
    }
  }

  walk(dir);
  return results;
}

const HELPER_SIGNATURES = `
// @passage-protocol/e2e-helpers
export async function apiGet<T>(api: APIRequestContext, path: string): Promise<{ status: number; body: T }>;
export async function apiPost<T>(api: APIRequestContext, path: string, data?: unknown): Promise<{ status: number; body: T }>;
export async function apiPut<T>(api: APIRequestContext, path: string, data?: unknown): Promise<{ status: number; body: T }>;
export async function apiPatch<T>(api: APIRequestContext, path: string, data?: unknown): Promise<{ status: number; body: T }>;
export async function apiDelete(api: APIRequestContext, path: string): Promise<{ status: number }>;
export async function waitForHealthy(api: APIRequestContext, path?: string, opts?: { timeout?: number; interval?: number }): Promise<void>;
export function uniqueId(prefix?: string): string;

// @passage-protocol/e2e-helpers/fixture
export const test: PlaywrightTestType<{ api: APIRequestContext }>;
export { expect } from "@playwright/test";

// @passage-protocol/e2e-helpers/health
export function describeHealthSuite(serviceName: string, options?: {
  validateReadinessBody?: boolean;
  serviceName?: string;
  livenessPath?: string;
  readinessPath?: string;
  healthTimeout?: number;
}): void;

// @passage-protocol/e2e-helpers/crud
export function describeCrudSuite<TCreate>(resourceName: string, options: {
  basePath: string;
  createPayload: () => TCreate;
  idField?: string;
  listWrapper?: string;
  listStatuses?: number[];
  createStatuses?: number[];
  getStatuses?: number[];
  deleteStatuses?: number[];
  skip?: boolean;
}): void;
`.trim();

function main() {
  const args = parseArgs(process.argv);

  const diff = readFileSafe(args["diff"] ?? "");
  const manifestRaw = readFileSafe(args["manifest"] ?? "");
  const manifest = manifestRaw ? JSON.parse(manifestRaw) : {};
  const service = args["service"] ?? "";
  const gatewayPath = args["gateway-path"] ?? "";
  const commitMessage = args["commit-message"] ?? "";
  const commitSha = args["commit-sha"] ?? "";
  const testsDir = args["tests-dir"] ?? "";
  const output = args["output"] ?? "/dev/stdout";

  const serviceShortName = service.replace(/^prod-puller-/, "");
  const harnessTestsDir = resolve(
    __dirname,
    "..",
    "tests",
    serviceShortName,
  );

  const existingTests = [
    ...collectTestFiles(harnessTestsDir),
    ...(testsDir ? collectTestFiles(testsDir) : []),
  ];

  const payload = {
    service,
    gatewayPath,
    diff,
    commitMessage,
    commitSha,
    manifest,
    existingTests,
    helperSignatures: HELPER_SIGNATURES,
  };

  if (output === "/dev/stdout") {
    process.stdout.write(JSON.stringify(payload));
  } else {
    writeFileSync(output, JSON.stringify(payload, null, 2));
  }
}

main();
