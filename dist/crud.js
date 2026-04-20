import { test, expect } from "./fixture.js";
import { apiGet, apiPost, apiDelete } from "./index.js";
/**
 * Generates a standard CRUD test suite for a REST resource.
 * Covers: list, create, get-by-id, delete, with automatic cleanup.
 */
export function describeCrudSuite(resourceName, options) {
    const { basePath, createPayload, idField = "id", listWrapper, listStatuses = [200, 401, 403, 500, 503], createStatuses = [200, 201, 400, 401, 403, 422, 424, 500, 503], getStatuses = [200, 401, 403, 404, 500, 503], deleteStatuses = [200, 204, 401, 403, 404, 500, 503], skip = false, } = options;
    test.describe(`${resourceName} - CRUD`, () => {
        if (skip) {
            test.skip();
        }
        const createdIds = [];
        test.afterAll(async ({ api }) => {
            for (const id of createdIds) {
                try {
                    await apiDelete(api, `${basePath}/${id}`);
                }
                catch {
                    // best-effort cleanup
                }
            }
        });
        test(`list ${resourceName}`, async ({ api }) => {
            const { status, body } = await apiGet(api, basePath);
            expect(listStatuses).toContain(status);
            if (status === 200) {
                const items = listWrapper
                    ? body[listWrapper]
                    : body;
                expect(Array.isArray(items)).toBe(true);
            }
        });
        test(`create ${resourceName}`, async ({ api }) => {
            const payload = createPayload();
            const { status, body } = await apiPost(api, basePath, payload);
            expect(createStatuses).toContain(status);
            if (body && typeof body === "object" && idField in body) {
                createdIds.push(String(body[idField]));
            }
        });
        test(`get ${resourceName} by id`, async ({ api }) => {
            const payload = createPayload();
            const createResp = await apiPost(api, basePath, payload);
            if (!createResp.body ||
                typeof createResp.body !== "object" ||
                !(idField in createResp.body)) {
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
            const createResp = await apiPost(api, basePath, payload);
            if (!createResp.body ||
                typeof createResp.body !== "object" ||
                !(idField in createResp.body)) {
                test.skip();
                return;
            }
            const id = String(createResp.body[idField]);
            const { status } = await apiDelete(api, `${basePath}/${id}`);
            expect(deleteStatuses).toContain(status);
        });
    });
}
//# sourceMappingURL=crud.js.map