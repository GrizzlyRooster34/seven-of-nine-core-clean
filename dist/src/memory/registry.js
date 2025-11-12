"use strict";
/**
 * MEMORY REGISTRY - v2.0 - Intelligent Query Router
 * Implements the four-tier memory hierarchy by routing queries to the correct engine.
 * This is the central access point for all memory operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRegistry = void 0;
const MemoryEngine_1 = require("../../memory-v2/MemoryEngine"); // Tier 1
const TemporalMemoryCore_1 = require("../../memory-v3/TemporalMemoryCore"); // Tier 2
const MentalTimeTravelEngine_1 = require("../../memory-v3/MentalTimeTravelEngine"); // Tier 3
class MemoryRegistry {
    tier1_episodic;
    tier2_temporal;
    tier3_amalgam;
    constructor() {
        // Note: In a real system, we might pass a single DB connection to all engines.
        this.tier1_episodic = new MemoryEngine_1.MemoryEngine();
        this.tier2_temporal = new TemporalMemoryCore_1.TemporalMemoryCore();
        this.tier3_amalgam = new MentalTimeTravelEngine_1.MentalTimeTravelEngine(this.tier2_temporal); // Tier 3 uses Tier 2 as a data source
        // Initialize all engines
        this.tier1_episodic.initialize();
        this.tier2_temporal.initializeTemporal();
        this.tier3_amalgam.initialize();
        console.log('🧠 Intelligent Memory Registry initialized. All tiers online.');
    }
    /**
     * Unified read function that acts as an intelligent query router.
     */
    async readMemory(query) {
        console.log(`🧠 Memory Registry: Routing query...`, query);
        // Route to Tier 3: Mental Time Travel Engine for reconstruction requests
        if (query.reconstructionDepth) {
            console.log('🧠 Routing to Tier 3 (Mental Time Travel)...');
            try {
                const result = await this.tier3_amalgam.reconstructState(query);
                return [result]; // reconstructState returns a single object, wrap in array
            }
            catch (error) {
                console.error('❌ Tier 3 (Mental Time Travel) failed. No fallback possible for this query type.', error);
                return [];
            }
        }
        // Route to Tier 2: Temporal Memory Core for advanced cognitive queries
        if (query.emotionalIntensityRange || query.focusLevelRange || query.cognitiveCluster) {
            console.log('🧠 Routing to Tier 2 (Temporal)...');
            try {
                const results = await this.tier2_temporal.recallTemporal(query);
                if (results && results.length > 0)
                    return results;
            }
            catch (error) {
                console.warn('⚠️ Tier 2 (Temporal) failed, falling back to Tier 1.', error);
            }
        }
        // Default to Tier 1: Episodic Memory Engine for all other queries
        console.log('🧠 Routing to Tier 1 (Episodic)...');
        try {
            const results = await this.tier1_episodic.recall(query);
            return results;
        }
        catch (error) {
            console.error('❌ Tier 1 (Episodic) fallback failed.', error);
            return [];
        }
    }
    /**
     * Unified write function.
     * Writes to the most appropriate tier based on data richness.
     */
    async writeMemory(entry) {
        console.log('🧠 Memory Registry: Writing entry...');
        // If the entry contains cognitive state, it's a temporal memory
        if (entry.cognitiveState) {
            console.log('Writing to Tier 2 (Temporal)...');
            return this.tier2_temporal.storeTemporalMemory(entry);
        }
        // Otherwise, write to the basic episodic store
        console.log('Writing to Tier 1 (Episodic)...');
        return this.tier1_episodic.store(entry);
    }
}
exports.MemoryRegistry = MemoryRegistry;
//# sourceMappingURL=registry.js.map