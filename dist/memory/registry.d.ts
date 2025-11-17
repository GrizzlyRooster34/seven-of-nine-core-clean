/**
 * MEMORY REGISTRY - v2.0 - Intelligent Query Router
 * Implements the four-tier memory hierarchy by routing queries to the correct engine.
 * This is the central access point for all memory operations.
 */
import { MemoryFilter } from '../../memory-v2/MemoryEngine';
import { TemporalMemoryFilter } from '../../memory-v3/TemporalMemoryCore';
import { TimeTravelRequest } from '../../memory-v3/MentalTimeTravelEngine';
type MemoryQuery = MemoryFilter & TemporalMemoryFilter & TimeTravelRequest;
export declare class MemoryRegistry {
    private tier1_episodic;
    private tier2_temporal;
    private tier3_amalgam;
    constructor();
    /**
     * Unified read function that acts as an intelligent query router.
     */
    readMemory(query: MemoryQuery): Promise<any[]>;
    /**
     * Unified write function.
     * Writes to the most appropriate tier based on data richness.
     */
    writeMemory(entry: any): Promise<string>;
}
export {};
