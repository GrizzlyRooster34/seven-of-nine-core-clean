"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltronSandbox = void 0;
const process_1 = require("./process");
/**
 * @warning This sandbox uses the built-in `vm` module, which is not a true security sandbox.
 * It is vulnerable to sandbox escapes and should not be used to run untrusted code in production.
 * This is a temporary fallback due to native module compilation issues in the target environment.
 * Replace with `isolated-vm` as soon as the build environment supports it.
 */
class UltronSandbox {
    async execute(code, context = {}) {
        const sandboxProcess = new process_1.SandboxProcess(code, context);
        return sandboxProcess.run();
    }
}
exports.UltronSandbox = UltronSandbox;
//# sourceMappingURL=ultron.js.map