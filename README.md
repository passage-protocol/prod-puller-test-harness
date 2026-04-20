# prod-puller-test-harness

Shared Playwright E2E test helpers for prod-puller services.

## Package: `@passage-protocol/e2e-helpers`

Published to [GitHub Packages](https://github.com/orgs/passage-protocol/packages).

### Installation

Add to your `e2e/package.json`:

```json
{
  "dependencies": {
    "@passage-protocol/e2e-helpers": "git+https://github.com/passage-protocol/prod-puller-test-harness.git"
  }
}
```

Ensure your CI configures git auth for private packages:

```yaml
- name: Configure git auth for private packages
  run: git config --global url."https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/".insteadOf "https://github.com/"
```

### Usage

```typescript
// API helpers (GET, POST, PUT, PATCH, DELETE, health polling, unique IDs)
import { apiGet, apiPost, apiDelete, uniqueId, waitForHealthy } from "@passage-protocol/e2e-helpers";

// Shared Playwright fixture with auto-configured API context
import { test, expect } from "@passage-protocol/e2e-helpers/fixture";

// Standard health check suite generator
import { describeHealthSuite } from "@passage-protocol/e2e-helpers/health";

// Standard CRUD test suite generator
import { describeCrudSuite } from "@passage-protocol/e2e-helpers/crud";

// Shared Playwright config factory
import { createPlaywrightConfig } from "@passage-protocol/e2e-helpers/config";
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `E2E_SERVICE_URL` | Base URL for the service under test | `http://localhost:3000` |
| `E2E_API_KEY` | API key (sent as `X-API-Key` header) | — |
| `E2E_TENANT_NAME` | Tenant name (sent as `X-Tenant` header) | — |
| `DEV_TOKEN` | Bearer token (sent as `Authorization` header) | — |

The fixture automatically parses `E2E_SERVICE_URL` path prefixes. For example, `https://gateway.example.com/user` sets `baseURL` to `https://gateway.example.com` and prepends `/user` to all request paths.

### Exports

| Path | Contents |
|---|---|
| `@passage-protocol/e2e-helpers` | `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `waitForHealthy`, `uniqueId` |
| `@passage-protocol/e2e-helpers/fixture` | `test` (extended with `api` fixture), `expect` |
| `@passage-protocol/e2e-helpers/health` | `describeHealthSuite(serviceName, options?)` |
| `@passage-protocol/e2e-helpers/crud` | `describeCrudSuite(resourceName, options)` |
| `@passage-protocol/e2e-helpers/config` | `createPlaywrightConfig(overrides?)` |

### `describeHealthSuite(serviceName, options?)`

Generates a standard health check test suite:

```typescript
import { describeHealthSuite } from "@passage-protocol/e2e-helpers/health";

describeHealthSuite("UserService", {
  readinessPath: "/health",        // default: "/health/ready"
  livenessPath: "/health",         // default: "/health"
  validateReadinessBody: true,     // check service name + status fields
  serviceName: "user",             // expected "service" field in response
  healthTimeout: 30_000,           // default: 30000ms
});
```

### `describeCrudSuite(resourceName, options)`

Generates a standard CRUD test suite with tolerant assertions:

```typescript
import { describeCrudSuite } from "@passage-protocol/e2e-helpers/crud";
import { uniqueId } from "@passage-protocol/e2e-helpers";

describeCrudSuite("Bot", {
  basePath: "/api/v1/bots",
  createPayload: () => ({
    name: uniqueId("bot"),
    description: "E2E test bot",
  }),
  idField: "id",                   // default: "id"
  listWrapper: "bots",             // if list response is { bots: [...] }
  listStatuses: [200, 500],        // acceptable status codes
  createStatuses: [200, 201, 422], // acceptable status codes
});
```

### `createPlaywrightConfig(overrides?)`

Returns a standard Playwright config suitable for API E2E testing:

```typescript
// playwright.config.ts
import { createPlaywrightConfig } from "@passage-protocol/e2e-helpers/config";

export default createPlaywrightConfig();
```

Override defaults when needed:

```typescript
export default createPlaywrightConfig({
  testDir: "./tests",       // default: "./tests"
  timeout: 60_000,          // default: 30000
  retries: 3,               // default: 2 (CI only)
  workers: 2,               // default: 4 (CI only)
});
```

### Reusable Workflow

Instead of duplicating CI configuration, call the reusable workflow:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:
    inputs:
      service_url:
        description: "Service URL to test against"
        required: false
        type: string

jobs:
  e2e:
    uses: passage-protocol/prod-puller-test-harness/.github/workflows/e2e-reusable.yml@main
    with:
      service_url: ${{ inputs.service_url || '' }}
    secrets: inherit
```

### Orchestrator

Trigger E2E tests across all repos from this repository:

```bash
gh workflow run run-all.yml -f environment=test
gh workflow run run-all.yml -f environment=staging
```

### Migration Guide (from local fixtures to shared package)

1. Add dependency to `e2e/package.json`:
   ```json
   "@passage-protocol/e2e-helpers": "git+https://github.com/passage-protocol/prod-puller-test-harness.git"
   ```

2. Delete local files:
   - `e2e/fixtures/api.fixture.ts`
   - `e2e/helpers/api-helpers.ts`

3. Update imports in test files:
   ```typescript
   // Before
   import { test, expect } from "../fixtures/api.fixture";
   import { apiGet, apiPost } from "../helpers/api-helpers";

   // After
   import { test, expect } from "@passage-protocol/e2e-helpers/fixture";
   import { apiGet, apiPost } from "@passage-protocol/e2e-helpers";
   ```

4. Replace `playwright.config.ts`:
   ```typescript
   import { createPlaywrightConfig } from "@passage-protocol/e2e-helpers/config";
   export default createPlaywrightConfig();
   ```

5. Replace health tests with `describeHealthSuite()`:
   ```typescript
   import { describeHealthSuite } from "@passage-protocol/e2e-helpers/health";
   describeHealthSuite("MyService", { readinessPath: "/health" });
   ```
