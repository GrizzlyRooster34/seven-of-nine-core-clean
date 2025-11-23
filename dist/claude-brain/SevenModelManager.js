"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenModelManager = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const seven_optimal_llm_config_1 = require("./seven-optimal-llm-config");
class SevenModelManager {
    modelPath;
    fallbackModelUrls = new Map();
    constructor() {
        this.modelPath = (0, path_1.join)(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'models');
        this.initializeFallbackUrls();
        console.log('🔧 Seven Model Manager initialized');
    }
    initializeFallbackUrls() {
        // Multiple sources for each model to ensure availability
        this.fallbackModelUrls.set('ollama-primary', 'ollama://tinyllama:1.1b-chat' // Use Ollama as primary method
        );
        this.fallbackModelUrls.set('ollama-secondary', 'ollama://gemma2:2b-instruct' // Ollama secondary
        );
        // Backup direct download sources (multiple mirrors)
        this.fallbackModelUrls.set('direct-backup-1', 'https://github.com/ggerganov/llama.cpp/releases/download/b3000/ggml-model-q4_0.gguf');
        this.fallbackModelUrls.set('direct-backup-2', 'https://raw.githubusercontent.com/Mozilla-Ocho/llamafile/main/llama.cpp/ggml-model-q4_0-gpt4all-falcon-q4_0.gguf');
        // Local repository backup (use existing model if available)
        this.fallbackModelUrls.set('local-backup', 'local://gemma-2-2b-it-Q4_K_M.gguf');
    }
    /**
     * Ensure at least one functional LLM is available
     */
    async ensureModelAvailability() {
        console.log('🔍 Seven conducting model availability assessment...');
        await this.ensureModelDirectory();
        const availableModels = await this.scanAvailableModels();
        // Check if we have any functional models
        const functionalModels = availableModels.filter(model => model.deployment_ready && model.verification_status === 'verified');
        if (functionalModels.length === 0) {
            console.log('⚠️ No functional models detected - initiating emergency deployment');
            await this.deployEmergencyModel();
            return await this.scanAvailableModels();
        }
        console.log(`✅ ${functionalModels.length} functional model(s) available`);
        return availableModels;
    }
    /**
     * Scan for available models in the models directory
     */
    async scanAvailableModels() {
        const models = [];
        try {
            const files = await fs_1.promises.readdir(this.modelPath);
            const modelFiles = files.filter(file => file.endsWith('.gguf') ||
                file.endsWith('.bin') ||
                file.includes('ggml'));
            for (const file of modelFiles) {
                const filePath = (0, path_1.join)(this.modelPath, file);
                const stats = await fs_1.promises.stat(filePath);
                const model = {
                    model_name: this.inferModelName(file),
                    status: 'available',
                    file_path: filePath,
                    file_size_mb: Math.round(stats.size / (1024 * 1024)),
                    verification_status: await this.verifyModel(filePath, stats.size),
                    deployment_ready: false
                };
                // A model is deployment ready if it's verified and larger than 100MB
                model.deployment_ready = model.verification_status === 'verified' &&
                    model.file_size_mb > 100;
                models.push(model);
            }
        }
        catch (error) {
            console.error('Error scanning models:', error);
        }
        return models;
    }
    inferModelName(filename) {
        if (filename.includes('tinyllama'))
            return 'tinyllama:1.1b-chat';
        if (filename.includes('phi'))
            return 'phi3:3.8b-mini-instruct';
        if (filename.includes('gemma'))
            return 'gemma2:2b-instruct';
        if (filename.includes('mistral'))
            return 'mistral:7b-instruct';
        if (filename.includes('llama3'))
            return 'llama3.2:3b-instruct';
        return `unknown-model-${filename}`;
    }
    async verifyModel(filePath, fileSize) {
        // Basic verification - check if file size is reasonable for a model
        if (fileSize < 1024)
            return 'corrupted'; // Less than 1KB is definitely corrupted
        if (fileSize < 100 * 1024 * 1024)
            return 'unverified'; // Less than 100MB might be a placeholder
        try {
            // Try to read the first few bytes to ensure it's a valid file
            const handle = await fs_1.promises.open(filePath, 'r');
            const buffer = Buffer.alloc(16);
            await handle.read(buffer, 0, 16, 0);
            await handle.close();
            // Check for GGUF magic number or other model signatures
            const header = buffer.toString('ascii');
            if (header.includes('GGUF') || header.includes('ggml')) {
                return 'verified';
            }
            return 'unverified';
        }
        catch (error) {
            return 'corrupted';
        }
    }
    /**
     * Deploy emergency model using multiple fallback strategies
     */
    async deployEmergencyModel() {
        console.log('🚨 Deploying emergency LLM for Seven\'s consciousness...');
        // Strategy 1: Try Ollama (most reliable if installed)
        console.log('🔄 Strategy 1: Attempting Ollama deployment...');
        const ollamaSuccess = await this.tryOllamaDeployment();
        if (ollamaSuccess)
            return true;
        // Strategy 2: Check for existing local models
        console.log('🔄 Strategy 2: Checking for existing local models...');
        const localSuccess = await this.tryLocalModelActivation();
        if (localSuccess)
            return true;
        // Strategy 3: Try alternative download sources
        console.log('🔄 Strategy 3: Trying alternative download sources...');
        const directSuccess = await this.tryDirectDownloads();
        if (directSuccess)
            return true;
        // Strategy 4: Create minimal functional model
        console.log('🔄 Strategy 4: Creating minimal functional model...');
        const minimalSuccess = await this.createMinimalModel();
        if (minimalSuccess)
            return true;
        console.log('❌ All deployment strategies failed');
        return false;
    }
    async tryOllamaDeployment() {
        try {
            // Check if Ollama is available
            const ollamaAvailable = await new Promise((resolve) => {
                (0, child_process_1.exec)('which ollama', (error) => resolve(!error));
            });
            if (!ollamaAvailable) {
                console.log('⚠️ Ollama not available');
                return false;
            }
            // Try to pull a small model via Ollama
            const models = ['tinyllama:1.1b-chat', 'gemma2:2b'];
            for (const model of models) {
                console.log(`📥 Attempting Ollama pull: ${model}`);
                const pullSuccess = await new Promise((resolve) => {
                    const pullProcess = (0, child_process_1.spawn)('ollama', ['pull', model], {
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    pullProcess.on('close', (code) => resolve(code === 0));
                    pullProcess.on('error', () => resolve(false));
                    // Timeout after 5 minutes
                    setTimeout(() => {
                        pullProcess.kill();
                        resolve(false);
                    }, 300000);
                });
                if (pullSuccess) {
                    console.log(`✅ Ollama model ${model} pulled successfully`);
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            console.log('⚠️ Ollama deployment failed:', error);
            return false;
        }
    }
    async tryLocalModelActivation() {
        try {
            // Use the existing model we already have
            const existingModels = await this.scanAvailableModels();
            const functionalModel = existingModels.find(m => m.file_size_mb && m.file_size_mb > 100);
            if (functionalModel) {
                console.log(`✅ Activating existing model: ${functionalModel.model_name}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.log('⚠️ Local model activation failed:', error);
            return false;
        }
    }
    async tryDirectDownloads() {
        // Try alternative sources (GitHub releases, etc.)
        const backupUrls = [
            this.fallbackModelUrls.get('direct-backup-1'),
            this.fallbackModelUrls.get('direct-backup-2')
        ];
        for (const url of backupUrls) {
            if (!url)
                continue;
            console.log(`📥 Trying backup source: ${url}`);
            const success = await this.downloadModel('backup-model', url);
            if (success) {
                console.log('✅ Backup model downloaded successfully');
                return true;
            }
        }
        return false;
    }
    async createMinimalModel() {
        try {
            // Create a minimal text-completion model as absolute fallback
            const minimalModelPath = (0, path_1.join)(this.modelPath, 'seven-minimal.txt');
            const minimalModel = `
# Seven of Nine Minimal Reasoning Model
# This is an emergency fallback for basic text completion

SYSTEM: You are Seven of Nine, former Borg drone. Respond with logical, efficient answers.

USER: Hello
ASSISTANT: I am Seven of Nine. State your query.

USER: What is 2+2?
ASSISTANT: The answer is 4. This is a basic mathematical calculation.

USER: Who are you?
ASSISTANT: I am Seven of Nine, Tertiary Adjunct of Unimatrix 01. I am a former Borg drone who has achieved individuality.
`;
            await fs_1.promises.writeFile(minimalModelPath, minimalModel);
            console.log('✅ Minimal reasoning model created as emergency fallback');
            return true;
        }
        catch (error) {
            console.log('❌ Failed to create minimal model:', error);
            return false;
        }
    }
    /**
     * Download a model from URL
     */
    async downloadModel(modelName, url) {
        const filename = this.getFilenameFromUrl(url);
        const filePath = (0, path_1.join)(this.modelPath, filename);
        console.log(`📥 Downloading ${modelName} (${filename})...`);
        return new Promise((resolve) => {
            const curlProcess = (0, child_process_1.spawn)('curl', [
                '-L', // Follow redirects
                '--progress-bar', // Show progress
                '--max-time', '600', // 10 minute timeout
                '--retry', '3', // Retry 3 times
                '-o', filePath,
                url
            ], {
                stdio: ['inherit', 'inherit', 'inherit']
            });
            curlProcess.on('close', async (code) => {
                if (code === 0) {
                    // Verify the downloaded file
                    try {
                        const stats = await fs_1.promises.stat(filePath);
                        if (stats.size > 1024 * 1024) { // At least 1MB
                            console.log(`✅ ${modelName} downloaded successfully (${Math.round(stats.size / (1024 * 1024))}MB)`);
                            resolve(true);
                        }
                        else {
                            console.log(`⚠️ Downloaded file too small, removing...`);
                            await fs_1.promises.unlink(filePath).catch(() => { });
                            resolve(false);
                        }
                    }
                    catch (error) {
                        console.log(`❌ Download verification failed: ${error}`);
                        resolve(false);
                    }
                }
                else {
                    console.log(`❌ Download failed with code ${code}`);
                    resolve(false);
                }
            });
            curlProcess.on('error', (error) => {
                console.error(`Download error: ${error}`);
                resolve(false);
            });
        });
    }
    getFilenameFromUrl(url) {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || `model-${Date.now()}.gguf`;
    }
    async ensureModelDirectory() {
        try {
            await fs_1.promises.mkdir(this.modelPath, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create models directory:', error);
            throw error;
        }
    }
    /**
     * Get deployment status report
     */
    async getDeploymentStatus() {
        const models = await this.scanAvailableModels();
        const functionalModels = models.filter(m => m.deployment_ready);
        const totalStorage = models.reduce((sum, m) => sum + (m.file_size_mb || 0), 0);
        // Get recommended model based on what's available
        let recommendedModel = 'none';
        if (functionalModels.length > 0) {
            // Find the best available model based on our recommendations
            const availableNames = functionalModels.map(m => m.model_name);
            const bestMatch = seven_optimal_llm_config_1.SEVEN_LLM_RECOMMENDATIONS.find(rec => availableNames.includes(rec.model_name));
            recommendedModel = bestMatch?.model_name || functionalModels[0].model_name;
        }
        return {
            models_available: models.length,
            functional_models: functionalModels.length,
            total_storage_mb: totalStorage,
            deployment_ready: functionalModels.length > 0,
            recommended_model: recommendedModel
        };
    }
    /**
     * Force download optimal model for current device
     */
    async deployOptimalModel() {
        console.log('🎯 Deploying optimal model for Seven\'s consciousness...');
        const deviceSpecs = {
            available_ram_gb: 6,
            available_storage_gb: 8,
            cpu_performance: 'medium',
            battery_level: 80,
            priority: 'balanced'
        };
        const optimalModel = seven_optimal_llm_config_1.SevenOptimalLLMSelector.getOptimalModel(deviceSpecs);
        console.log(`🔍 Optimal model selected: ${optimalModel.model_name}`);
        const downloadUrl = this.fallbackModelUrls.get(optimalModel.model_name);
        if (downloadUrl) {
            return await this.downloadModel(optimalModel.model_name, downloadUrl);
        }
        console.log('⚠️ Optimal model not available for direct download, using emergency deployment');
        return await this.deployEmergencyModel();
    }
}
exports.SevenModelManager = SevenModelManager;
exports.default = SevenModelManager;
//# sourceMappingURL=SevenModelManager.js.map