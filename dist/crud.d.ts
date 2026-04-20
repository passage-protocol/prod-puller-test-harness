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
export declare function describeCrudSuite<TCreate = Record<string, unknown>>(resourceName: string, options: CrudSuiteOptions<TCreate>): void;
export {};
//# sourceMappingURL=crud.d.ts.map