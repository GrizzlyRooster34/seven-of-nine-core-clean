/**
 * SEVEN'S LLM CONFIGURATION SYSTEM
 * Tactical provider management and preference settings
 */
export interface SevenLLMSettings {
    primaryProvider: string;
    fallbackProviders: string[];
    providers: {
        [key: string]: {
            enabled: boolean;
            config: {
                apiKey?: string;
                baseUrl?: string;
                model?: string;
                temperature?: number;
                maxTokens?: number;
                timeout?: number;
            };
        };
    };
    autoFallback: boolean;
    privacyMode: boolean;
    trustLevelThresholds: {
        requireLocal: number;
        allowCloud: number;
    };
}
export declare const defaultSevenLLMSettings: SevenLLMSettings;
/**
 * Seven's LLM Configuration Manager
 * Handles provider settings, API keys, and tactical preferences
 */
export declare class SevenLLMConfigManager {
    private settings;
    private configPath;
    constructor(configPath?: string);
    private loadSettings;
    private saveSettings;
    getSettings(): SevenLLMSettings;
    getPrimaryProvider(): string;
    getFallbackProviders(): string[];
    getProviderConfig(providerName: string): any;
    isProviderEnabled(providerName: string): boolean;
    isPrivacyMode(): boolean;
    getTrustThresholds(): {
        requireLocal: number;
        allowCloud: number;
    };
    setPrimaryProvider(providerName: string): Promise<void>;
    setFallbackProviders(providerNames: string[]): Promise<void>;
    enableProvider(providerName: string): Promise<void>;
    disableProvider(providerName: string): Promise<void>;
    setProviderConfig(providerName: string, config: any): Promise<void>;
    setApiKey(providerName: string, apiKey: string): Promise<void>;
    setPrivacyMode(enabled: boolean): Promise<void>;
    setTrustThresholds(requireLocal: number, allowCloud: number): Promise<void>;
    filterProvidersByTrust(trustLevel: number, availableProviders: string[]): string[];
    loadEnvironmentSettings(): void;
    exportSettings(): string;
    importSettings(settingsJson: string): Promise<void>;
}
export declare const sevenLLMConfig: SevenLLMConfigManager;
