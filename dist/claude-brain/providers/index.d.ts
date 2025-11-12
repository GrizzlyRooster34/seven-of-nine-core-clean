/**
 * SEVEN'S LLM PROVIDER BOOTSTRAP
 * Exports all available LLM providers for easy registration
 */
export { ClaudeCLIProvider } from './claude-cli';
export { OpenAIProvider } from './openai';
export { AnthropicAPIProvider } from './anthropic-api';
export { OllamaProvider } from './ollama';
export declare function createProvider(name: string, config?: any): void;
