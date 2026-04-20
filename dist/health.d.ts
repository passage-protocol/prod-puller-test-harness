interface HealthSuiteOptions {
    /** Validate that the readiness body includes expected fields */
    validateReadinessBody?: boolean;
    /** Service name to check in readiness response */
    serviceName?: string;
    /** Custom liveness path (default: /health) */
    livenessPath?: string;
    /** Custom readiness path (default: /health/ready) */
    readinessPath?: string;
    /** Timeout for waitForHealthy (default: 30000ms) */
    healthTimeout?: number;
}
/**
 * Generates a standard health check test suite for a service.
 * Includes liveness, readiness, and startup health wait tests.
 */
export declare function describeHealthSuite(serviceName: string, options?: HealthSuiteOptions): void;
export {};
//# sourceMappingURL=health.d.ts.map