"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeCLIProvider = void 0;
const child_process_1 = require("child_process");
/**
 * CLAUDE CLI PROVIDER for Seven of Nine
 * Maintains compatibility with existing Claude CLI integration
 */
// import { invoke } from '@tauri-apps/api/tauri';
class ClaudeCLIProvider {
    name = 'claude-cli';
    displayName = 'Claude Code CLI';
    async isAvailable() {
        try {
            // In Tauri environment
            if (typeof window !== 'undefined' && window.__TAURI_API__) {
                const { invoke } = await import('@tauri-apps/api/tauri');
                const versionStatus = await invoke('check_claude_version');
                return versionStatus?.is_installed || false;
            }
            // In Node.js environment, check if claude command is available
            (0, child_process_1.execSync)('claude --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    }
    async getModels() {
        // Claude CLI doesn't expose model selection in the same way
        return ['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus'];
    }
    supports(feature) {
        switch (feature) {
            case 'streaming': return true;
            case 'context': return true;
            case 'functions': return true;
            case 'vision': return true;
            default: return false;
        }
    }
    async healthCheck() {
        const start = Date.now();
        try {
            const available = await this.isAvailable();
            const latency = Date.now() - start;
            return {
                status: available ? 'healthy' : 'unhealthy',
                latency
            };
        }
        catch {
            return { status: 'unhealthy', latency: Date.now() - start };
        }
    }
    async execute(prompt, config) {
        try {
            console.log('🧠 SEVEN: Engaging Claude CLI for reasoning assistance');
            // Use existing Claude CLI execution
            let response;
            if (typeof window !== 'undefined' && window.__TAURI_API__) {
                // Tauri environment
                const { invoke } = await import('@tauri-apps/api/tauri');
                response = await invoke('execute_claude_command', {
                    command: prompt,
                    config: {
                        streaming: config.streaming || false,
                        timeout: config.timeout || 120000
                    }
                });
            }
            else {
                // Node.js environment - execute claude CLI directly
                response = (0, child_process_1.execSync)(`claude "${prompt}"`, {
                    encoding: 'utf8',
                    timeout: config.timeout || 120000
                });
            }
            return {
                content: response,
                model: config.model || 'claude-cli',
                provider: this.name,
                finish_reason: 'completed'
            };
        }
        catch (error) {
            console.error('⚠️ SEVEN: Claude CLI execution failed:', error);
            throw error;
        }
    }
}
exports.ClaudeCLIProvider = ClaudeCLIProvider;
//# sourceMappingURL=claude-cli.js.map