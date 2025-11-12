export interface SandboxContext {
    [key: string]: any;
}
/**
 * @warning This sandbox uses the built-in `vm` module, which is not a true security sandbox.
 * It is vulnerable to sandbox escapes and should not be used to run untrusted code in production.
 * This is a temporary fallback due to native module compilation issues in the target environment.
 * Replace with `isolated-vm` as soon as the build environment supports it.
 */
export declare class UltronSandbox {
    execute(code: string, context?: SandboxContext): Promise<any>;
}
