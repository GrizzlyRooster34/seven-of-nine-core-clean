"use strict";
/**
 * SEVEN'S LLM PROVIDER BOOTSTRAP
 * Exports all available LLM providers for easy registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProvider = exports.AnthropicAPIProvider = exports.OpenAIProvider = exports.ClaudeCLIProvider = void 0;
exports.createProvider = createProvider;
var claude_cli_1 = require("./claude-cli");
Object.defineProperty(exports, "ClaudeCLIProvider", { enumerable: true, get: function () { return claude_cli_1.ClaudeCLIProvider; } });
var openai_1 = require("./openai");
Object.defineProperty(exports, "OpenAIProvider", { enumerable: true, get: function () { return openai_1.OpenAIProvider; } });
var anthropic_api_1 = require("./anthropic-api");
Object.defineProperty(exports, "AnthropicAPIProvider", { enumerable: true, get: function () { return anthropic_api_1.AnthropicAPIProvider; } });
var ollama_1 = require("./ollama");
Object.defineProperty(exports, "OllamaProvider", { enumerable: true, get: function () { return ollama_1.OllamaProvider; } });
// Provider factory for dynamic loading
function createProvider(name, config) {
    // switch (name.toLowerCase()) {
    //   case 'claude-cli':
    //     return new ClaudeCLIProvider();
    //   case 'openai':
    //     return new OpenAIProvider(config?.apiKey);
    //   case 'anthropic-api':
    //     return new AnthropicAPIProvider(config?.apiKey);
    //   case 'ollama':
    //     return new OllamaProvider(config?.baseUrl);
    //   default:
    //     throw new Error(`Unknown provider: ${name}`);
    // }
}
//# sourceMappingURL=index.js.map