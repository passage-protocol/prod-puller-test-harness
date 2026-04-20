function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
export async function apiGet(api, path) {
    const resp = await api.get(path);
    const text = await resp.text();
    return {
        status: resp.status(),
        body: text ? safeJsonParse(text) : undefined,
    };
}
export async function apiPost(api, path, data) {
    const resp = await api.post(path, {
        data: data ? JSON.stringify(data) : undefined,
    });
    const text = await resp.text();
    return {
        status: resp.status(),
        body: text ? safeJsonParse(text) : undefined,
    };
}
export async function apiPut(api, path, data) {
    const resp = await api.put(path, {
        data: data ? JSON.stringify(data) : undefined,
    });
    const text = await resp.text();
    return {
        status: resp.status(),
        body: text ? safeJsonParse(text) : undefined,
    };
}
export async function apiPatch(api, path, data) {
    const resp = await api.patch(path, {
        data: data ? JSON.stringify(data) : undefined,
    });
    const text = await resp.text();
    return {
        status: resp.status(),
        body: text ? safeJsonParse(text) : undefined,
    };
}
export async function apiDelete(api, path) {
    const resp = await api.delete(path);
    return { status: resp.status() };
}
export async function waitForHealthy(api, path = "/health", { timeout = 30_000, interval = 1_000 } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        try {
            const resp = await api.get(path);
            if (resp.ok())
                return;
        }
        catch {
            // service not up yet
        }
        await new Promise((r) => setTimeout(r, interval));
    }
    throw new Error(`Service did not become healthy at ${path} within ${timeout}ms`);
}
export function uniqueId(prefix = "e2e") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
//# sourceMappingURL=index.js.map