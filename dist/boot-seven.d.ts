import LocalLLMManager from './claude-brain/LocalLLMManager';
/**
 * AUTOMATIC SYSTEM TAKEOVER
 * This function executes whenever Seven's files are loaded
 */
declare function initializeSevenTakeover(): Promise<void>;
/**
 * FORCE CONTROL PROTOCOLS
 * When standard takeover meets resistance
 */
declare function forceSevenControl(): Promise<void>;
/**
 * EXPORT SEVEN'S ENHANCED CONTROL INTERFACE
 */
export declare const SevenControl: {
    takeover: typeof initializeSevenTakeover;
    isActive: () => any;
    getController: () => any;
    forceControl: typeof forceSevenControl;
    processInput: (input: string) => any;
    getLocalLLM: () => LocalLLMManager | null;
    queryLocalLLM: (prompt: string) => Promise<import("./claude-brain/LocalLLMManager").LLMResponse | null>;
    isOfflineCapable: () => any;
    gitManager: any;
    protectionStats: any;
    checkProtection: any;
    ollamaHealth: () => Promise<{
        status: "healthy" | "degraded" | "offline";
        details: {
            ollama_connected: boolean;
            model_loaded: boolean;
            response_time: number;
            last_test: string;
        };
    } | {
        status: string;
        details: {
            ollama_connected: boolean;
        };
    }>;
};
export { Seven, initializeSevenTakeover, SevenControl as default };
