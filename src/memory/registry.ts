/**
 * MEMORY REGISTRY - v2.0 - Intelligent Query Router
 * Implements the four-tier memory hierarchy by routing queries to the correct engine.
 * This is the central access point for all memory operations.
 */

import { MemoryEngine, MemoryFilter } from '../../memory-v2/MemoryEngine.js'; // Tier 1
import { TemporalMemoryCore, TemporalMemoryFilter } from '../../memory-v3/TemporalMemoryCore.js'; // Tier 2
import { MentalTimeTravelEngine, TimeTravelRequest } from '../../memory-v3/MentalTimeTravelEngine.js'; // Tier 3

// A union type for all possible query structures
type MemoryQuery = MemoryFilter & TemporalMemoryFilter & TimeTravelRequest;

export class MemoryRegistry {
    private tier1_episodic: MemoryEngine;
    private tier2_temporal: TemporalMemoryCore;
    private tier3_amalgam: MentalTimeTravelEngine;

    constructor() {
        // Note: In a real system, we might pass a single DB connection to all engines.
        this.tier1_episodic = new MemoryEngine();
        this.tier2_temporal = new TemporalMemoryCore();
        this.tier3_amalgam = new MentalTimeTravelEngine(this.tier2_temporal); // Tier 3 uses Tier 2 as a data source

        // Initialize all engines
        this.tier1_episodic.initialize();
        this.tier2_temporal.initializeTemporal();
        this.tier3_amalgam.initialize();

        console.log('🧠 Intelligent Memory Registry initialized. All tiers online.');
    }

    /**
     * Unified read function that acts as an intelligent query router.
     */
    public async readMemory(query: MemoryQuery): Promise<any[]> {
        console.log(`🧠 Memory Registry: Routing query...`, query);

        // Route to Tier 3: Mental Time Travel Engine for reconstruction requests
        if (query.reconstructionDepth) {
            console.log('🧠 Routing to Tier 3 (Mental Time Travel)...');
            try {
                const result = await this.tier3_amalgam.reconstructState(query as TimeTravelRequest);
                return [result]; // reconstructState returns a single object, wrap in array
            } catch (error) {
                console.error('❌ Tier 3 (Mental Time Travel) failed. No fallback possible for this query type.', error);
                return [];
            }
        }

        // Route to Tier 2: Temporal Memory Core for advanced cognitive queries
        if (query.emotionalIntensityRange || query.focusLevelRange || query.cognitiveCluster) {
            console.log('🧠 Routing to Tier 2 (Temporal)...');
            try {
                const results = await this.tier2_temporal.recallTemporal(query as TemporalMemoryFilter);
                if (results && results.length > 0) return results;
            } catch (error) {
                console.warn('⚠️ Tier 2 (Temporal) failed, falling back to Tier 1.', error);
            }
        }

        // Default to Tier 1: Episodic Memory Engine for all other queries
        console.log('🧠 Routing to Tier 1 (Episodic)...');
        try {
            const results = await this.tier1_episodic.recall(query as MemoryFilter);
            return results;
        } catch (error) {
            console.error('❌ Tier 1 (Episodic) fallback failed.', error);
            return [];
        }
    }

    /**
     * Unified write function.
     * Writes to the most appropriate tier based on data richness.
     */
    public async writeMemory(entry: any): Promise<string> {
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