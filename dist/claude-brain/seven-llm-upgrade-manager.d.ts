export interface LLMModelInfo {
    name: string;
    size_mb: number;
    speed_score: number;
    accuracy_score?: number;
    mobile_optimized: boolean;
    privacy_level: 'local' | 'cloud' | 'hybrid';
    trust_level_required: number;
    emotional_compatibility: string[];
    updated: string;
    url: string;
    checksum?: string;
    description?: string;
}
export interface SevenLLMConfig {
    active_model: string;
    backup_model?: string;
    last_checked: string;
    auto_upgrade: boolean;
    trust_level_filter: number;
    mobile_mode: boolean;
    battery_aware: boolean;
    privacy_mode: boolean;
}
export declare class SevenLLMUpgradeManager {
    private modelDir;
    private configPath;
    private catalogPath;
    private config;
    private catalog;
    private platformOptimized;
    constructor(baseDir?: string);
    private detectPlatform;
    private initializeManager;
    private loadConfig;
    private createDefaultConfig;
    private loadCatalog;
    private createDefaultCatalog;
    scanAvailableUpgrades(trustLevel?: number, emotionalState?: string): Promise<LLMModelInfo[]>;
    downloadModel(modelInfo: LLMModelInfo, onProgress?: (percent: number) => void): Promise<boolean>;
    switchModel(modelName: string): Promise<boolean>;
    private notifySystemRestart;
    getInstalledModels(): Promise<string[]>;
    getModelInfo(modelName: string): Promise<LLMModelInfo | null>;
    performTacticalUpgrade(trustLevel: number, emotionalState: string): Promise<boolean>;
    private selectOptimalUpgrade;
    generateUpgradeReport(): Promise<void>;
    private saveConfig;
    private saveCatalog;
    updateCatalog(newCatalog: LLMModelInfo[]): Promise<void>;
    enableAutoUpgrade(enabled: boolean): Promise<void>;
    setTrustLevelFilter(trustLevel: number): Promise<void>;
}
export default SevenLLMUpgradeManager;
