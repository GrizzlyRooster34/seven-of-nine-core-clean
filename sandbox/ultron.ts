import { SandboxProcess } from './process.js';

export interface SandboxContext {
  [key: string]: any;
}

/**
 * @warning This sandbox uses the built-in `vm` module (via forked process), which is not a true security sandbox.
 * It is vulnerable to sandbox escapes and should not be used to run untrusted code in production.
 * This is a necessary fallback on Termux/Android where `isolated-vm` native compilation is unstable.
 * Future roadmap: Investigate WebAssembly or specialized native bindings for isolation.
 */
export class UltronSandbox {
  public async execute(code: string, context: SandboxContext = {}): Promise<any> {
    const sandboxProcess = new SandboxProcess(code, context);
    return sandboxProcess.run();
  }
}
