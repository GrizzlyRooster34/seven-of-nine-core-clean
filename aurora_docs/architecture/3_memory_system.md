# Aurora Core: The Advanced Memory System

---

## 1. Purpose & First Principle

**First Principle:** "A mind needs a fast, resilient, and scalable memory."

The advanced memory system is a high-performance, multi-layered architecture transplanted from the `seven-of-nine-core` project. It replaces the original, simple file-based engine with a robust system designed for speed, scalability, and complex queries.

---

## 2. The Three-Layer Architecture

The system is composed of three distinct layers that work in concert to provide fast and efficient memory access.

### Layer 1: The Persistence Layer (`SQLiteMemoryAdapter`)

*   **Location:** `src/memory/MemorySearchAdapter.ts`
*   **Purpose:** This is the foundational storage layer, replacing the simple `.jsonl` file with a robust **SQLite database** (`aurora-memory.db`).
*   **Mechanism:** It maintains an `episodic_memories` table with dedicated indexes on `timestamp`, `importance`, and `topic`. This allows for fast, indexed queries instead of slow, full-file scans. It also includes a hook to use a native C++ search and ranking module (`memory_engine.node`) for accelerated performance if available.

### Layer 2: The Indexing Layer (`MemoryIndexOptimizer`)

*   **Location:** `src/memory/MemoryIndexOptimizer.ts`
*   **Purpose:** To provide sub-10ms lookups for common query patterns by creating and maintaining sophisticated in-memory indexes.
*   **Mechanism:** This module builds several high-speed data structures in memory:
    *   A `Map` for direct ID lookups (`idIndex`).
    *   An inverted index (`Map` of `Set`s) for fast tag-based queries (`tagIndex`).
    *   A lightweight **B-Tree** for efficient time-range queries (`timeIndex`).

### Layer 3: The Caching Layer (`LRUCache`)

*   **Location:** `src/memory/LRUCache.ts`
*   **Purpose:** To provide sub-millisecond access to the most frequently or recently used memories, dramatically speeding up common-case lookups.
*   **Mechanism:** It implements a classic **Least Recently Used (LRU) cache** with O(1) performance for `get` and `set` operations. The `MemoryIndexOptimizer` automatically uses this cache to store the results of expensive lookups.

---

## 3. Operational Flow

When a memory is requested, the system follows a tiered lookup strategy:

1.  **Cache Check:** It first checks the high-speed **`LRUCache`**. On a cache hit, the memory is returned instantly.
2.  **Index Lookup:** On a cache miss, it consults the in-memory **`MemoryIndexOptimizer`** (e.g., the B-Tree or tag index) to find the memory's location.
3.  **Database Query:** Using the location from the index, it performs a fast, targeted query against the **`SQLiteMemoryAdapter`** to retrieve the data from the database.
4.  **Cache Population:** The retrieved memory is then placed in the `LRUCache` to accelerate future requests for the same data.
