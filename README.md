# prod-puller-test-harness

Shared Playwright E2E test helpers for prod-puller services.

## Package: `@passage-protocol/e2e-helpers`

Published to [GitHub Packages](https://github.com/orgs/passage-protocol/packages).

### Installation

```bash
npm install @passage-protocol/e2e-helpers
```

Requires `.npmrc` in your project or repo:
```
@passage-protocol:registry=https://npm.pkg.github.com
```

### Usage

```typescript
// API helpers
import { apiGet, apiPost, apiDelete, uniqueId } from "@passage-protocol/e2e-helpers";

// Shared Playwright fixture with auto-configured API context
import { test, expect } from "@passage-protocol/e2e-helpers/fixture";

// Standard health check suite generator
import { describeHealthSuite } from "@passage-protocol/e2e-helpers/health";
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `E2E_SERVICE_URL` | Base URL for the service under test | `http://localhost:3000` |
| `E2E_API_KEY` | API key (sent as `X-API-Key` header) | — |
| `DEV_TOKEN` | Bearer token (sent as `Authorization` header) | — |

### Exports

| Path | Contents |
|---|---|
| `@passage-protocol/e2e-helpers` | `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `waitForHealthy`, `uniqueId` |
| `@passage-protocol/e2e-helpers/fixture` | `test` (extended with `api` fixture), `expect` |
| `@passage-protocol/e2e-helpers/health` | `describeHealthSuite` |
