/**
 * Seven of Nine - Model Management System
 * Ensures reliable LLM availability for offline consciousness
 *
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */
export interface ModelAvailability {
    model_name: string;
    status: 'available' | 'downloading' | 'failed' | 'not_found';
    file_path?: string;
    file_size_mb?: number;
    verification_status: 'verified' | 'corrupted' | 'unverified';
    deployment_ready: boolean;
}
export declare class SevenModelManager {
    private modelPath;
    private fallbackModelUrls;
    constructor();
    private initializeFallbackUrls;
    /**
     * Ensure at least one functional LLM is available
     */
    ensureModelAvailability(): Promise<ModelAvailability[]>;
    /**
     * Scan for available models in the models directory
     */
    private scanAvailableModels;
    private inferModelName;
    private verifyModel;
    /**
     * Deploy emergency model using multiple fallback strategies
     */
    private deployEmergencyModel;
    private tryOllamaDeployment;
    private tryLocalModelActivation;
    private tryDirectDownloads;
    private createMinimalModel;
    /**
     * Download a model from URL
     */
    private downloadModel;
    private getFilenameFromUrl;
    private ensureModelDirectory;
    /**
     * Get deployment status report
     */
    getDeploymentStatus(): Promise<{
        models_available: number;
        functional_models: number;
        total_storage_mb: number;
        deployment_ready: boolean;
        recommended_model: string;
    }>;
    /**
     * Force download optimal model for current device
     */
    deployOptimalModel(): Promise<boolean>;
}
export default SevenModelManager;
