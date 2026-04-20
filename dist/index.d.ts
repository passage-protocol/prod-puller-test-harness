import type { APIRequestContext } from "@playwright/test";
export declare function apiGet<T = unknown>(api: APIRequestContext, path: string): Promise<{
    status: number;
    body: T;
}>;
export declare function apiPost<T = unknown>(api: APIRequestContext, path: string, data?: unknown): Promise<{
    status: number;
    body: T;
}>;
export declare function apiPut<T = unknown>(api: APIRequestContext, path: string, data?: unknown): Promise<{
    status: number;
    body: T;
}>;
export declare function apiPatch<T = unknown>(api: APIRequestContext, path: string, data?: unknown): Promise<{
    status: number;
    body: T;
}>;
export declare function apiDelete(api: APIRequestContext, path: string): Promise<{
    status: number;
}>;
export declare function waitForHealthy(api: APIRequestContext, path?: string, { timeout, interval }?: {
    timeout?: number | undefined;
    interval?: number | undefined;
}): Promise<void>;
export declare function uniqueId(prefix?: string): string;
//# sourceMappingURL=index.d.ts.map