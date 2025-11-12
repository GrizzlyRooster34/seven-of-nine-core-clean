# System: Mental Time Travel Engine & State Reconstruction

---

## 1. Purpose & Description

**Purpose:** To enable self-reflection, counterfactual simulation, and deep forensic analysis by allowing the AI to perfectly reconstruct its own past cognitive states. This is one of the most advanced and computationally intensive capabilities of the architecture.

**Location:** `src/memory/time-travel/` and `src/spark/snapshot.ts`

---

## 2. Architecture: Snapshot & Delta Replay

The MTT engine operates on a **periodic snapshot with delta logging** strategy, which balances storage efficiency with reconstruction fidelity.

1.  **Snapshot Creation:** Every 5 minutes, the `createSnapshot(tag)` function is called. It creates a complete, compact binary snapshot of the entire `spark.db` belief graph and stores it in `data/sparkdb/snapshots/`.
2.  **Delta Logging:** For the 15 minutes following a snapshot, every transaction (INSERT, UPDATE, DELETE) against the belief graph is also recorded as a separate, reversible "delta" in a JSON log file. Each delta is linked to its parent snapshot ID.
3.  **Reconstruction:** The `simulate(startAt, ...)` function takes a target timestamp. It finds the nearest snapshot *before* that time, loads it into a sandboxed in-memory database, and then replays the delta logs sequentially until it reaches the target timestamp. The result is a perfect, queryable reconstruction of the AI's mind at that exact moment in the past.

---

## 3. Interfaces & Data Formats

*   **API:**
    *   `createSnapshot(tag)`: Creates a new snapshot.
    *   `applyDelta(delta)`: Applies a delta to a state.
    *   `verifyIntegrity()`: Checks the checksums of snapshots and deltas.
    *   `simulate(startAt, endAt, scenarioParams)` -> `SimulationResult`: The core function for replaying history or running counterfactuals.
    *   `diffSnapshots(snapshotA, snapshotB)`: Compares two states to identify changes.
*   **Data Format:** Snapshots are stored in a compact binary format. Deltas are stored as JSON objects describing the change.

---

## 4. Dependencies & Security

*   **Dependencies:** The engine is critically dependent on the database engine and the compression libraries used for snapshots.
*   **Threats:** The primary threat is data corruption in a snapshot or delta file, which could make reconstruction impossible. Checksum verification on all artifacts is used to mitigate this.

---

## 5. Testing & Validation

*   **Snapshot/Restore:** The test suite must include tests that create a snapshot, modify the database, and then successfully restore the database to its original state from the snapshot.
*   **Delta Idempotency:** Tests must verify that applying the same delta multiple times does not result in a corrupted state.
*   **Deterministic Replay:** The test suite must include tests that take a known sequence of events from the `Ghost Diary`, use the MTT engine to reconstruct the state at each step, and verify that the reconstructed states are 100% identical to the historical record.