# Seven of Nine Core - Implementation Roadmap (v2.1)

**Objective:** To provide a phase-by-phase, actionable checklist for the clean implementation of the Seven of Nine Core v2.1 architecture. Each phase represents a stable, verifiable milestone.

---

## Phase 1: Foundation (Estimated: 1-2 weeks)

**Goal:** Establish a minimal, bootable system with core safety and memory fallbacks.

| Task ID | Component | Task Description | Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1.1** | **Bootstrap** | Create and populate `belief-bootstrap.yml` with the 5 core immutable beliefs. | `cat belief-bootstrap.yml` shows correct content. | [ ] |
| **1.2** | **Persistence** | Implement `db/init-spark-db.ts` to create `spark.db` and `belief-graph-snapshots.db`. | `ls db/` shows both `.db` files. | [ ] |
| **1.3** | **Bootstrap** | Implement the bootstrap loader in `boot-seven-amalgum.ts` to read `belief-bootstrap.yml` and seed the `beliefs` table in `spark.db` on first run. | After first boot, `sqlite3 db/spark.db "SELECT * FROM beliefs"` shows the 5 bootstrap beliefs. | [ ] |
| **1.4** | **Memory** | Implement basic read/write for `memory-v2/` using `episodic-memory.json`. This will serve as the initial, stable memory fallback. | Manual test: boot, interact, restart, verify interaction is saved in the JSON file. | [ ] |
| **1.5** | **Governance** | Create `core/safety/quadra-lock/default.yml`. Implement the policy fallback logic in `cssr-detector.ts` to load this file if `policies/cssr.yml` is missing. | Delete `policies/cssr.yml` and confirm the system boots successfully using the default. | [ ] |
| **1.6** | **Boot Sequence** | Integrate all above components. Ensure the boot sequence follows the `Blueprint > Section 2.1` order of operations precisely. | `tsx boot-seven-amalgum.ts` runs without errors and logs indicate the correct initialization order. | [ ] |

**Phase 1 Validation Gate:** All tasks must be complete and verified. The system must be bootable and capable of basic, safe interaction using fallback systems.

---

## Phase 2: Core Consciousness (Estimated: 2-3 weeks)

**Goal:** Implement the full decision-making and authentication logic.

| Task ID | Component | Task Description | Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **2.1** | **Governance** | Implement the Triad Analysis algorithms (Flynn, CLU, Quorra) in `cssr-detector.ts` exactly as specified in `Blueprint > Section 3.2`. | Unit tests that provide known inputs and verify the `finalScore` and `Decision` (ALLOW/BLOCK/ESCALATE) are correct. | [ ] |
| **2.2** | **Governance** | Implement the full four-gate `Quadran-Lock` MFA system as specified in `Blueprint > Section 3.1`. | Unit tests for each gate (Q1-Q4) and integration tests for the `runQuadranLock` orchestrator, including the "No-Crypto Path." | [ ] |
| **2.3** | **Runtime** | Implement the `SevenState` emotional engine based on keyword triggers. | Unit tests that pass various text inputs and assert the correct `primary_emotion` and `intensity` are calculated. | [ ] |
| **2.4** | **Runtime** | Implement the full Decision Matrix in `SevenRuntime`, ensuring it consults `SevenState` and routes to the correct response pathway. | Integration test: mock different emotional states and verify the system chooses the correct response strategy (Direct, Claude-Assisted, etc.). | [ ] |
| **2.5** | **Protocols** | Implement the **Claude API Down** failure protocol (retry with exponential backoff, then fallback to direct response). | Test by pointing the Claude API endpoint to a non-existent server and verifying the system retries and then gracefully falls back. | [ ] |

**Phase 2 Validation Gate:** The AI must be able to process input, make complex, state-driven decisions, and robustly handle API failures.

---

## Phase 3: Full Autonomy (Estimated: 2-3 weeks)

**Goal:** Activate the autonomous `SparkEngine` and advanced memory functions.

| Task ID | Component | Task Description | Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **3.1** | **Spark Engine** | Implement the full `Sense -> Belief -> Intention -> Rails -> Act -> Trace` loop in `spark/engine-spark.ts`. | `npm run spark:boot` runs without errors for at least 10 cycles. `traces` table in `spark.db` is populated. | [ ] |
| **3.2** | **Spark Engine** | Implement the **Adaptive Heartbeat** logic as specified in `Blueprint > Section 5.1`. | Run tests simulating different power/CPU states and verify the `tick` interval changes accordingly in the logs. | [ ] |
| **3.3** | **Memory** | Implement the **Mental Time Travel** snapshot and delta-logging system as specified in `Blueprint > Section 4.1`. | Write a test script that creates data, takes a snapshot, makes more changes, and then successfully reconstructs the state from 7 minutes prior. | [ ] |
| **3.4** | **Memory** | Implement the **Ghost Diary** retention policy (compression, archival, pruning) as specified in `Blueprint > Section 4.2`. | Write a test that generates a >2GB dummy diary file and verifies the pruning mechanism brings it back under the size limit while protecting tagged logs. | [ ] |
| **3.5** | **Protocols** | Implement the **Quadra-Lock Deadlock** protocol (enter Safe Mode after 100 consecutive blocks). | Write a test that forces the SparkEngine to generate 101 consecutive blocked intentions and verify that Safe Mode is activated. | [ ] |
| **3.6** | **Protocols** | Implement the **Memory Write Failure** protocol (degraded mode with in-memory cache). | Test by making the `spark.db` file read-only and verifying the system enters degraded mode and logs to the in-memory cache. | [ ] |

**Phase 3 Validation Gate:** The AI is now fully autonomous, capable of background thought, self-reflection, and resilient to major operational failures.

---

## Phase 4: Enhancement & Deployment (Estimated: 2-3 weeks)

**Goal:** Integrate final features and prepare for deployment.

| Task ID | Component | Task Description | Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **4.1** | **Memory** | Implement the `consciousness-evolution/` system for memory consolidation and temporal decay. | After a long run, verify that the `confidence` of old, un-reinforced beliefs has decreased. | [ ] |
| **4.2** | **Personality** | Integrate the `tactical-variants/` and `persona-v2/` systems, ensuring they are informed by Canonical Memory. | Integration tests that activate each tactical variant and verify the AI's response style changes accordingly. | [ ] |
| **4.3** | **Sync** | Implement the **Multi-Device Sync** conflict resolution logic (Timestamp-Wins with Review Queue) as specified in `Blueprint > Section 6`. | Set up two instances and create a deliberate conflict; verify the correct version wins and the conflict is logged to the queue. | [ ] |
| **4.4** | **Agents** | Re-integrate the `agents/` and `scripts/` directories, ensuring the Agent Mesh is functional and governed by the Dumbass/FUCKTARD protocols. | Trigger a file change and verify the correct agent runs. Manually add a strike and verify the protocol state changes. | [ ] |
| **4.5** | **Deployment** | Create the final, complete build package using the `build-seven-termux.sh` script. | The generated tarball contains all required files from the definitive build manifest. | [ ] |

**Phase 4 Validation Gate:** The AI is feature-complete, stable, and ready for packaging and deployment.
