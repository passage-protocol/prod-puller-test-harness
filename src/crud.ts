import { test, expect } from "./fixture.js";
import { apiGet, apiPost, apiDelete, uniqueId } from "./index.js";

interface CrudSuiteOptions<TCreate = Record<string, unknown>> {
  /** Base API path for the resource (e.g. "/api/v1/bots") */
  basePath: string;
  /** Factory that returns a fresh create payload each invocation */
  createPayload: () => TCreate;
  /** Field name containing the resource ID in the create response (default: "id") */
  idField?: string;
  /** Field name wrapping the list response array (e.g. "bots" for { bots: [...] }) */
  listWrapper?: string;
  /** Acceptable status codes for list operation */
  listStatuses?: number[];
  /** Acceptable status codes for create operation */
  createStatuses?: number[];
  /** Acceptable status codes for get-by-id operation */
  getStatuses?: number[];
  /** Acceptable status codes for delete operation */
  deleteStatuses?: number[];
  /** Skip the entire suite (useful for conditionally disabling) */
  skip?: boolean;
}

/**
 * Generates a standard CRUD test suite for a REST resource.
 * Covers: list, create, get-by-id, delete, with automatic cleanup.
 */
export function describeCrudSuite<TCreate = Record<string, unknown>>(
  resourceName: string,
  options: CrudSuiteOptions<TCreate>,
) {
  const {
    basePath,
    createPayload,
    idField = "id",
    listWrapper,
    listStatuses = [200, 401, 403, 500, 503],
    createStatuses = [200, 201, 400, 401, 403, 422, 424, 500, 503],
    getStatuses = [200, 401, 403, 404, 500, 503],
    deleteStatuses = [200, 204, 401, 403, 404, 500, 503],
    skip = false,
  } = options;

  test.describe(`${resourceName} - CRUD`, () => {
    if (skip) {
      test.skip();
    }

    const createdIds: string[] = [];

    test.afterAll(async ({ api }) => {
      for (const id of createdIds) {
        try {
          await apiDelete(api, `${basePath}/${id}`);
        } catch {
          // best-effort cleanup
        }
      }
    });

    test(`list ${resourceName}`, async ({ api }) => {
      const { status, body } = await apiGet(api, basePath);
      expect(listStatuses).toContain(status);
      if (status === 200) {
        const items = listWrapper
          ? (body as Record<string, unknown>)[listWrapper]
          : body;
        expect(Array.isArray(items)).toBe(true);
      }
    });

    test(`create ${resourceName}`, async ({ api }) => {
      const payload = createPayload();
      const { status, body } = await apiPost<Record<string, unknown>>(
        api,
        basePath,
        payload,
      );
      expect(createStatuses).toContain(status);
      if (body && typeof body === "object" && idField in body) {
        createdIds.push(String(body[idField]));
      }
    });

    test(`get ${resourceName} by id`, async ({ api }) => {
      const payload = createPayload();
      const createResp = await apiPost<Record<string, unknown>>(
        api,
        basePath,
        payload,
      );
      if (
        !createResp.body ||
        typeof createResp.body !== "object" ||
        !(idField in createResp.body)
      ) {
        test.skip();
        return;
      }
      const id = String(createResp.body[idField]);
      createdIds.push(id);

      const { status } = await apiGet(api, `${basePath}/${id}`);
      expect(getStatuses).toContain(status);
    });

    test(`delete ${resourceName}`, async ({ api }) => {
      const payload = createPayload();
      const createResp = await apiPost<Record<string, unknown>>(
        api,
        basePath,
        payload,
      );
      if (
        !createResp.body ||
        typeof createResp.body !== "object" ||
        !(idField in createResp.body)
      ) {
        test.skip();
        return;
      }
      const id = String(createResp.body[idField]);

      const { status } = await apiDelete(api, `${basePath}/${id}`);
      expect(deleteStatuses).toContain(status);
    });
  });
}
