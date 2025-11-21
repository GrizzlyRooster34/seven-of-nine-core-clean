# Branch Merge Review & Audit
**Generated:** 2025-11-21
**Repository:** seven-of-nine-core-clean
**Total Branches:** 39 branches analyzed
**Current Branch:** claude/audit-branches-merge-review-01NsjP8T8pAXhz6ij4arSDxy

---

## Executive Summary

**Critical Findings:**
- **20 branches (51%)** can be immediately deleted (duplicates, empty, or stale)
- **7 branches** require consolidation (reduce to 3)
- **6 branches** ready for review and merge to main
- **Significant duplicate work** identified across multiple branch groups

**Impact:**
- Net reduction: 39 branches → ~12-15 active branches
- Eliminates duplicate build fixes, empty placeholders, and stale work
- Consolidates overlapping deployment and documentation efforts

---

## Priority 1: IMMEDIATE DELETIONS (20 branches)

### Group A: Identical Duplicate Branches (5 branches)

#### 1. `codex/tactics/ranger.md` → DELETE
- **Why:** 100% identical duplicate of `claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5`
- **Details:**
  - Same commit: e3882798
  - Same files: .gitignore, SETUP_SEVEN.md, scripts/setup-seven-directories.sh
  - Confusing branch name
- **Action:** Delete, keep claude/setup-seven-directories instead

#### 2. `cursor/find-compiling-errors-9985` → DELETE
#### 3. `cursor/find-compiling-errors-eca7` → DELETE
- **Why:** 100% identical duplicates with same build artifacts
- **Details:**
  - All three add identical dist/ compiled files (68+ files)
  - Same commit: e547a1f2
  - Last update: 2025-11-06
- **Action:** Delete both, keep `cursor/fix-seven-of-nine-build-errors-da1a`

#### 4. `cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-85ca` → DELETE
#### 5. `cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-9258` → DELETE
- **Why:** Both are empty with no changes from main
- **Details:**
  - Ahead: 0, Behind: 0
  - No file changes
  - Appear to be abandoned work
- **Action:** Delete both

---

### Group B: Empty HEI Feature Placeholder Branches (7 branches)

All branches below are identical to main with no changes:

#### 6. `feat/HEI-58-build-cssr-v2` → DELETE
#### 7. `feat/HEI-59-quadran-lock-q1-q4` → DELETE
#### 8. `feat/HEI-60-canonical-memory-engine-v3` → DELETE
#### 9. `feat/HEI-61-emotional-logic-tree-state-machine` → DELETE
#### 10. `feat/HEI-62-sevenbridge-routing-layer` → DELETE
#### 11. `feat/HEI-63-tactical-variant-selection-engine` → DELETE
#### 12. `feat/HEI-64-creator-bond-modular-integration` → DELETE

- **Why:** Empty placeholder branches never used
- **Details:**
  - All have Ahead: 0, Behind: 0
  - No file changes
  - The ACTUAL implementation of these features is in `claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB`
- **Action:** Delete all 7 branches
- **Note:** The real HEI feature work exists and should be reviewed separately

---

### Group C: Stale Empty Feature Branches (5 branches)

#### 13. `feature/belief-store-decay-drift-heartbeat-o3q` → DELETE
#### 14. `feature/enforce-gates-cap-tokens-ttl-nonce-mfa-0p3` → DELETE
#### 15. `feature/law-integration-boot-governance-ps0` → DELETE
- **Why:** 100% identical empty branches, very stale
- **Details:**
  - All: Ahead: 0, Behind: 25
  - Last commit: 2025-10-14 (over a month old)
  - No file changes from main
- **Action:** Delete all 3

#### 16. `feature/unifiers-init-v7w` → DELETE
- **Why:** Empty and very stale
- **Details:**
  - Ahead: 0, Behind: 24
  - Last commit: 2025-10-20
  - No changes from main
- **Action:** Delete

#### 17. `systems-saved-2` → DELETE
- **Why:** Empty and very stale
- **Details:**
  - Ahead: 0, Behind: 22
  - Last commit: 2025-10-19
  - No changes from main
- **Action:** Delete

---

### Group D: Other Stale/Empty Branches (3 branches)

#### 18. `chore/HEI-65-repo-normalization-documentation` → DELETE
- **Why:** Empty with no changes
- **Details:**
  - Ahead: 0, Behind: 0
  - No file changes
- **Action:** Delete

#### 19. `docs/audit-branch-with-main-docs-4il` → DELETE
- **Why:** Stale with only node_modules changes
- **Details:**
  - Ahead: 1, Behind: 13
  - Last commit: 2025-10-21
  - Only changes node_modules files (should not be committed)
- **Action:** Delete

#### 20. `chore/audit-critical-errors-uya` → DELETE
- **Why:** Only has node_modules changes
- **Details:**
  - Ahead: 1, Behind: 0
  - Only changes: node_modules/.package-lock.json
  - Not meaningful changes
- **Action:** Delete

---

## Priority 2: CONSOLIDATION REQUIRED (7 branches → 3)

### Consolidation Group 1: Deployment Infrastructure

**Branches:**
1. `cursor/find-top-5-critical-issues-6ae2` (Ahead: 8)
2. `cursor/find-top-5-critical-issues-f7a0` (Ahead: 8)
3. `deployments` (Ahead: 7)

**Similarity:** 95%+ overlap

**Common Changes:**
- Docker infrastructure (.dockerignore, Dockerfile, docker-compose.yml)
- GCP deployment (.env.gcp.example, .gcloudignore, cloudbuild.yaml)
- Documentation (DEPLOYMENT_QUICKSTART.md, DOCKER.md, GCP_DEPLOYMENT.md)
- Android build workflow (.github/workflows/android-build.yml)
- Planning docs (PLAN.md, RESEARCH.md)
- Android mobile app files (seven-mobile-app/)

**Differences:**
- `cursor/find-top-5-critical-issues-6ae2`: Adds Quadran-Lock Q1 and Q2 gates implementation
- `cursor/find-top-5-critical-issues-f7a0`: Adds Quadran-Lock Q1 integration tests and behavioral codex
- `deployments`: Most foundational, includes docker-compose.yml and deployment scripts

**Merge Strategy:**
1. Keep `deployments` as base branch
2. Cherry-pick unique Quadran-Lock implementations from the two cursor branches
3. Review differences in Quadran-Lock approaches (Q1/Q2 gates vs integration tests)
4. Delete the two cursor branches after consolidation
5. Result: 1 comprehensive deployment branch

**Recommendation:** CONSOLIDATE → `deployments`

---

### Consolidation Group 2: Claude Code Integration Documentation

**Branches:**
1. `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` (Ahead: 41)
2. `claude/code-review-011CV2UGjWrYrAXFb53jNszq` (Ahead: 9)

**Similarity:** 80%+ overlap

**Common Changes:**
Both add extensive claude-code-integration/ documentation:
- CLAUDE_CODE_INTEGRATION_PACKAGE.md
- claude-code-integration/INJECTION_PLAN.md
- claude-code-integration/INTEGRATION_GUIDE.md
- claude-code-integration/INTEGRATION_PLAN.md
- claude-code-integration/NEXT_STEPS.md
- claude-code-integration/PART_A_COMPLETE.md
- claude-code-integration/PHASE1_RESULTS.md
- claude-code-integration/QUICKSTART.md

**Unique to Branch 1 (add-branch-lineage-docs):**
- More extensive (41 commits vs 9)
- Adds deployment infrastructure files
- Includes .dockerignore, .env.example, Docker and GCP docs

**Unique to Branch 2 (code-review):**
- BRANCH_AUDIT.md
- claude-code-integration/README.md
- claude-code-integration/SEVEN_API_REFERENCE.md
- claude-code-integration/STATUS.md
- claude-code-integration/SevenControlLayer.ts and .CORRECTED.ts
- claude-code-integration/claude-code-wrapper.ts
- claude-code-integration/examples/modified-cli-index.ts.example
- core/ file modifications (cssr-detector.ts, SensorBridge.ts)
- db/spark-db.types.ts

**Merge Strategy:**
1. Keep `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` as base (more comprehensive)
2. Cherry-pick these unique commits from code-review branch:
   - SevenControlLayer implementations
   - BRANCH_AUDIT.md, README.md, SEVEN_API_REFERENCE.md, STATUS.md
   - claude-code-wrapper.ts
   - Example files
   - Core modifications if they're improvements
3. Review core/ and db/ changes for conflicts
4. Delete `claude/code-review-011CV2UGjWrYrAXFb53jNszq` after consolidation
5. Result: 1 comprehensive Claude Code integration branch

**Recommendation:** CONSOLIDATE → `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ`

---

### Consolidation Group 3: Seven Portable Core Knowledge Package

**Branches:**
1. `merge-staging-seven-portable` (Ahead: 12, Behind: 0)
2. `seven-portable-core` (Ahead: 5, Behind: 6)

**Similarity:** 90%+ overlap

**Common Changes:**
Both add ChatGPT knowledge package infrastructure:
- CHATGPT_KNOWLEDGE_FILES.md
- GCP_TERMUX_SETUP.md
- SEVEN_PORTABLE_CORE.md
- README.md (modifications)
- chatgpt-knowledge-package-complete/* (extensive documentation)
  - consciousness-v4/codex/ethics/creator-bond.md
  - consciousness-v4/codex/humor/style.md
  - consciousness-v4/codex/memory/christine_protocols.md
  - consciousness-v4/codex/persona/core.md
  - consciousness-v4/codex/persona/tempo.md
  - consciousness-v4/codex/security/quadra-lock.md
  - consciousness-v4/codex/tactics/core.md
  - consciousness-v4/codex/tactics/leadership.md
  - consciousness-v4/codex/vices/risk_flags.md
- .env.gcp
- .genkit/traces_idx/genkit.metadata
- .gitignore (modifications)
- SelectivePriming.ts, TemporalPersonalityEngine.ts, boot-seven.ts (modifications)

**Differences:**
- `merge-staging-seven-portable`: More current (Behind: 0), includes latest work
  - Has HEI-65 repo normalization (commit 42f0a0ae)
  - Has Seven Core directory setup (commit e3882798)
  - Has core dependencies additions (commit 0ea222b7)
  - Has gitignore security improvements (commit ba7cf59e)
- `seven-portable-core`: Slightly stale (Behind: 6)
  - Same knowledge package files
  - Fewer additional features

**Merge Strategy:**
1. Keep `merge-staging-seven-portable` (more current and comprehensive)
2. Review `seven-portable-core` for any unique commits
3. If no unique valuable changes, simply delete `seven-portable-core`
4. Result: 1 active Seven Portable branch

**Recommendation:** DELETE `seven-portable-core`, KEEP `merge-staging-seven-portable`

---

## Priority 3: REVIEW AND MERGE TO MAIN (6 branches)

### High Priority Merges

#### A. `claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB` ⭐ CRITICAL
- **Status:** Ahead: 14, Behind: 0, Last: 2025-11-18
- **Purpose:** Contains the ACTUAL implementation of HEI-58 through HEI-64 systems
- **Changes:**
  - **Core Systems Implemented:**
    - core/safety/CSSRSystem.ts (HEI-58)
    - core/memory/CanonicalMemoryEngine.ts (HEI-60)
    - core/emotions/EmotionalStateMachine.ts (HEI-61)
    - core/routing/SevenBridge.ts (HEI-62)
    - core/routing/adapters.ts
    - core/routing/middleware.ts
    - core/tactical/TacticalVariantSelector.ts (HEI-63)
    - core/bond/CreatorBondIntegration.ts (HEI-64)
  - **Documentation:**
    - docs/HEI-58-CSSR-v2-Safety-System.md
    - docs/HEI-59-Quadran-Lock-Q1-Q4.md
    - docs/HEI-60-Canonical-Memory-Engine-v3.md
    - docs/HEI-61-EmotionalStateMachine.md
    - docs/HEI-62-SevenBridge-Routing-Layer.md
    - docs/HEI-63-Tactical-Variant-Selection-Engine.md
    - docs/HEI-64-Creator-Bond-Modular-Integration.md
  - **Examples:**
    - examples/cssr/safety-monitoring-demo.ts
    - examples/emotional-state-machine-demo.ts
    - examples/quadran-lock/complete-auth-flow.ts
  - **Tests:**
    - tests/bond/CreatorBondIntegration.test.ts
  - **.gitignore modifications**

**Latest Commit:** 6dd5e622 "feat: Implement HEI-58 CSSR v2 Case Study Safety Rails System"

**Merge Review:**
- **Code Quality:** Review all 7 core system implementations
- **Tests:** Ensure test coverage is adequate
- **Documentation:** Comprehensive docs included
- **Integration:** Verify no breaking changes with existing systems
- **Dependencies:** Check for new dependencies

**Merge Strategy:**
1. Checkout branch and run full test suite
2. Review each core system implementation for:
   - Code quality and architecture
   - Security considerations
   - Performance implications
   - Integration points
3. Review documentation completeness
4. Test all examples
5. If approved, merge to main
6. Delete the 7 empty feat/HEI-* placeholder branches
7. Close related HEI tickets (HEI-58 through HEI-64)

**Recommendation:** HIGH PRIORITY REVIEW → MERGE TO MAIN (if tests pass)

---

#### B. `claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5`
- **Status:** Ahead: 1, Behind: 0, Last: 2025-11-18
- **Purpose:** Add Seven Core runtime directory setup infrastructure (HEI-126)
- **Changes:**
  - .gitignore (updates)
  - SETUP_SEVEN.md (new setup documentation)
  - scripts/setup-seven-directories.sh (setup automation script)

**Latest Commit:** e3882798 "feat: Add Seven Core runtime directory setup infrastructure (HEI-126)"

**Merge Review:**
- **Script Safety:** Review setup-seven-directories.sh for:
  - Security vulnerabilities
  - Proper error handling
  - Idempotency
  - Cross-platform compatibility
- **Documentation:** Verify SETUP_SEVEN.md is clear and complete
- **.gitignore:** Review gitignore changes for security

**Merge Strategy:**
1. Review setup script for safety and correctness
2. Test setup script in clean environment
3. Verify documentation clarity
4. If approved, merge to main
5. Delete branch

**Recommendation:** REVIEW → MERGE TO MAIN

---

#### C. `claude/add-core-dependencies-017twP6nEDrVHG8xFT7dbWyr`
- **Status:** Ahead: 1, Behind: 0, Last: 2025-11-18
- **Purpose:** Add missing core dependencies for Seven of Nine
- **Changes:**
  - package.json (dependency additions)

**Latest Commit:** 0ea222b7 "feat: Add missing core dependencies for Seven of Nine"

**Merge Review:**
- **Dependencies:** Review all added dependencies for:
  - Necessity
  - Security vulnerabilities (run npm audit)
  - License compatibility
  - Version pinning
  - Size/bloat considerations
- **Lock File:** Ensure package-lock.json is updated

**Merge Strategy:**
1. Review package.json diff
2. Run npm audit on new dependencies
3. Verify all dependencies are necessary
4. Test that project builds and runs
5. If approved, merge to main
6. Delete branch

**Recommendation:** REVIEW DEPENDENCIES → MERGE TO MAIN

---

#### D. `claude/fix-gitignore-security-018kmMFdYYBVZ9fpMqTdbaFS`
- **Status:** Ahead: 1, Behind: 0, Last: 2025-11-18
- **Purpose:** Implement comprehensive .gitignore for security protection
- **Changes:**
  - .gitignore (security improvements)

**Latest Commit:** ba7cf59e "fix: Implement comprehensive .gitignore for security protection"

**Merge Review:**
- **Security:** Review .gitignore additions for:
  - Credential protection (.env files, keys, etc.)
  - Build artifact exclusions
  - Sensitive data patterns
  - Over-exclusion issues (don't ignore necessary files)
- **Conflicts:** Check for conflicts with existing gitignore rules

**Merge Strategy:**
1. Review .gitignore diff carefully
2. Verify critical files are protected
3. Ensure no necessary files are excluded
4. Test that git status shows expected files
5. If approved, merge to main
6. Delete branch

**Recommendation:** SECURITY REVIEW → MERGE TO MAIN

---

#### E. `cursor/fix-seven-of-nine-build-errors-da1a`
- **Status:** Ahead: 1, Behind: 0, Last: 2025-11-06
- **Purpose:** Fix build errors and compile the project
- **Changes:**
  - Adds 68+ dist/ compiled files (TypeScript build outputs)
  - Includes auth systems, behavioral codex, crypto implementations

**Latest Commit:** e547a1f2 "Refactor: Update imports and improve behavioral analysis"

**Merge Review:**
- **Build Artifacts:** Determine if dist/ files should be committed
  - Best practice: Don't commit build artifacts to git
  - Alternative: Build on deployment/CI
  - Check if .gitignore excludes dist/
- **Source Changes:** Check if there are source file changes that fixed the build
- **TypeScript Config:** Verify tsconfig.json is correct

**Merge Strategy:**
1. Review if dist/ should be in git (likely NO)
2. If build fixes are in source files, cherry-pick those commits only
3. Add dist/ to .gitignore if not already
4. Document build process in README
5. Setup CI/CD to build on deployment
6. Delete branch after extracting any valuable source changes

**Recommendation:** EXTRACT SOURCE FIXES ONLY → DON'T COMMIT dist/ → DELETE BRANCH

---

#### F. `fix/tsconfig-jest-module`
- **Status:** Ahead: 2, Behind: 0, Last: 2025-11-07
- **Purpose:** Update Jest tsconfig module to NodeNext
- **Changes:**
  - tsconfig modifications for Jest
  - Adds dist/ compiled files (68+ files)

**Latest Commit:** a85c4ccb "Refactor: Update Jest tsconfig module to NodeNext"

**Merge Review:**
- **TypeScript Config:** Review tsconfig changes
  - Verify NodeNext module resolution is correct
  - Check for breaking changes
  - Ensure Jest still works
- **Build Artifacts:** Same as above - dist/ likely shouldn't be committed

**Merge Strategy:**
1. Review tsconfig.json changes only
2. Test that Jest runs correctly with new config
3. Don't commit dist/ files
4. If config changes are good, merge to main
5. Delete branch

**Recommendation:** MERGE TSCONFIG CHANGES ONLY → DELETE BRANCH

---

## Priority 4: SPECIAL CASES (3 branches)

### A. `systems` - Stale but Valuable
- **Status:** Ahead: 2, Behind: 20, Last: 2025-10-21
- **Purpose:** Consolidate all recovered and implemented systems
- **Changes:**
  - .gitignore (updates)
  - CONSOLIDATION_REPORT_TIER1_TIER2.md
  - db/spark-db.types.ts
  - memory-v3/ directory (extensive Memory v3 system)
    - AgentEpsilon.ts
    - CanonicalIngestion.ts
    - CognitiveStateTagger.ts
    - Various compiled outputs
    - Mission reports and documentation

**Latest Commits:**
1. 97f7c43f "feat: Add Memory v3 system, database fallback, and enhanced auth systems"
2. f5caa9ff "feat: Consolidate all recovered and implemented systems into 'systems' branch"

**Issue:** Branch is 20 commits behind main (VERY STALE)

**Merge Strategy:**
1. **FIRST:** Rebase branch onto current main
   - `git checkout systems`
   - `git rebase origin/main`
   - Resolve any conflicts
2. **REVIEW:** Evaluate Memory v3 system
   - Is Memory v3 still needed? (Check if replaced by CanonicalMemoryEngine in HEI branch)
   - Review code quality
   - Check for conflicts with newer implementations
3. **TEST:** Run full test suite after rebase
4. **DECISION:**
   - If Memory v3 is unique and valuable → Merge to main
   - If superseded by newer implementations → Extract useful parts, delete branch
   - If conflicts are too complex → Consider recreating features on current main

**Recommendation:** REBASE → REVIEW → DECIDE (Merge vs Extract vs Recreate)

---

### B. `test-suite` - Appears Empty but Behind Main
- **Status:** Ahead: 0, Behind: 5, Last: 2025-10-22
- **Purpose:** Test suite branch (unclear if still active)
- **Changes:** No file changes shown

**Issue:** Behind 5 commits, may have been merged to main already

**Merge Strategy:**
1. Check git log to see if test-suite was merged to main
2. Compare branch with main: `git diff origin/main origin/test-suite`
3. If truly empty/merged → Delete
4. If has unique commits → Review and merge or rebase

**Recommendation:** INVESTIGATE → LIKELY DELETE

---

### C. `merge-staging-seven-portable` - Active Work in Progress
- **Status:** Ahead: 12, Behind: 0, Last: 2025-11-20
- **Purpose:** Staging branch for Seven Portable Core knowledge package
- **Changes:** (See Consolidation Group 3 for details)
  - ChatGPT knowledge packages
  - GCP Termux setup
  - README updates
  - Documentation packages

**Latest Commit:** 42f0a0ae "feat(HEI-65): Seven Repo Normalization & Documentation"

**Issue:** This is an active staging branch (12 commits ahead)

**Merge Strategy:**
1. **REVIEW:** Full review of all 12 commits
2. **TEST:** Verify all knowledge packages are correct
3. **DOCUMENTATION:** Ensure README and docs are accurate
4. **DECISION:**
   - If ready for production → Merge to main
   - If still in progress → Keep branch, continue work
   - If experimental → Consider feature flag or separate release

**Recommendation:** FULL REVIEW → MERGE WHEN READY (appears nearly ready)

---

## Priority 5: KEEP AS-IS (3 branches)

### A. `main` - Primary Branch
- **Status:** Base branch
- **Action:** Keep (obviously)

### B. `unification` - Purpose Unclear
- **Status:** Ahead: 0, Behind: 0 (identical to main)
- **Purpose:** Unknown
- **Action:**
  - If it's a working/staging branch → Keep
  - If it's abandoned → Delete
  - **QUESTION FOR TEAM:** What is the purpose of this branch?

### C. `deployments` - After Consolidation
- **Status:** Ahead: 7 (after consolidating the two cursor branches)
- **Purpose:** Deployment infrastructure
- **Action:** Keep, review, and merge to main when ready

---

## Priority 6: ANALYZE FURTHER (2 branches)

### A. `fix/compilation-errors`
- **Status:** Ahead: 5, Behind: 0, Last: 2025-11-07
- **Purpose:** Fix compilation errors across codebase
- **Changes:**
  - SelectivePriming.ts
  - TemporalPersonalityEngine.ts
  - Multiple claude-brain/ files
  - consciousness-evolution/ files
  - consciousness-v4/codex/codex-manager.ts
  - core/env/isPrivateEnv.ts
  - core/safety/quadra-lock/cssr-detector.ts
  - db/GhostDiaryManager.ts
  - db/spark-db.types.ts
  - dist/ files (68+ build artifacts)

**Latest Commits:**
1. 1665f7d4 "Install and configure external dependencies"
2. fed102c4 "feat: Add linux-x64-gnu and linux-x64-musl resolver bindings"
3. 66f6adb0 "Fix missing closing braces in cssr-detector.ts catch block"
4. d1280213 "Fix compilation errors across codebase"
5. e547a1f2 "Refactor: Update imports and improve behavioral analysis"

**Note:** This branch has actual source code fixes (unlike the cursor branches that only have dist/)

**Merge Strategy:**
1. Review all 5 commits for:
   - Actual compilation error fixes
   - Quality of fixes (proper solutions vs hacks)
   - Breaking changes
2. Extract source file changes only (ignore dist/)
3. Test compilation
4. Compare with other branches to avoid duplicate fixes
5. Merge valuable fixes to main
6. Delete branch

**Recommendation:** DETAILED REVIEW → MERGE FIXES (exclude dist/) → DELETE

---

### B. `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` - After Consolidation
- **Status:** Ahead: 41, Behind: 0
- **Purpose:** Claude Code integration documentation (after consolidating code-review branch)
- **Action:** Review all 41 commits, ensure completeness, merge to main when ready
- **Note:** Will be enhanced with files from the code-review branch during consolidation

---

## DETAILED MERGE EXECUTION PLAN

### Phase 1: Immediate Cleanup (Delete 20 branches)
**Time Estimate:** 15 minutes
**Risk:** Low (all are duplicates, empty, or stale)

```bash
# Identical duplicates
git push origin --delete codex/tactics/ranger.md
git push origin --delete cursor/find-compiling-errors-9985
git push origin --delete cursor/find-compiling-errors-eca7
git push origin --delete cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-85ca
git push origin --delete cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-9258

# Empty HEI placeholders
git push origin --delete feat/HEI-58-build-cssr-v2
git push origin --delete feat/HEI-59-quadran-lock-q1-q4
git push origin --delete feat/HEI-60-canonical-memory-engine-v3
git push origin --delete feat/HEI-61-emotional-logic-tree-state-machine
git push origin --delete feat/HEI-62-sevenbridge-routing-layer
git push origin --delete feat/HEI-63-tactical-variant-selection-engine
git push origin --delete feat/HEI-64-creator-bond-modular-integration

# Stale empty branches
git push origin --delete feature/belief-store-decay-drift-heartbeat-o3q
git push origin --delete feature/enforce-gates-cap-tokens-ttl-nonce-mfa-0p3
git push origin --delete feature/law-integration-boot-governance-ps0
git push origin --delete feature/unifiers-init-v7w
git push origin --delete systems-saved-2

# Other stale/empty
git push origin --delete chore/HEI-65-repo-normalization-documentation
git push origin --delete docs/audit-branch-with-main-docs-4il
git push origin --delete chore/audit-critical-errors-uya
```

**After Phase 1:** 39 → 19 branches

---

### Phase 2: Branch Consolidation (7 branches → 3)
**Time Estimate:** 2-4 hours
**Risk:** Medium (requires careful cherry-picking and testing)

#### Step 2.1: Consolidate Deployment Branches
```bash
# Keep: deployments
# Consolidate: cursor/find-top-5-critical-issues-6ae2, cursor/find-top-5-critical-issues-f7a0

git checkout deployments
git pull origin deployments

# Review and cherry-pick unique Quadran-Lock implementations
git log origin/cursor/find-top-5-critical-issues-6ae2 --oneline
git log origin/cursor/find-top-5-critical-issues-f7a0 --oneline

# Cherry-pick relevant commits (adjust SHAs as needed)
git cherry-pick <commit-sha-for-quadran-lock-gates>
git cherry-pick <commit-sha-for-quadran-lock-tests>

# Test the consolidated branch
npm install
npm test
npm run build

# Push consolidated branch
git push origin deployments

# Delete consolidated branches
git push origin --delete cursor/find-top-5-critical-issues-6ae2
git push origin --delete cursor/find-top-5-critical-issues-f7a0
```

#### Step 2.2: Consolidate Claude Code Integration Branches
```bash
# Keep: claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ
# Consolidate: claude/code-review-011CV2UGjWrYrAXFb53jNszq

git checkout claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ
git pull origin claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ

# Cherry-pick unique commits from code-review branch
git log origin/claude/code-review-011CV2UGjWrYrAXFb53jNszq --oneline

# Cherry-pick commits that add:
# - BRANCH_AUDIT.md, README.md, SEVEN_API_REFERENCE.md, STATUS.md
# - SevenControlLayer.ts, claude-code-wrapper.ts
# - Examples and core modifications

git cherry-pick <commit-shas>

# Test
npm test

# Push
git push origin claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ

# Delete
git push origin --delete claude/code-review-011CV2UGjWrYrAXFb53jNszq
```

#### Step 2.3: Delete Duplicate Seven Portable Branch
```bash
# Keep: merge-staging-seven-portable
# Delete: seven-portable-core (older, less complete)

# Verify no unique commits
git log origin/seven-portable-core --not origin/merge-staging-seven-portable

# If nothing unique, delete
git push origin --delete seven-portable-core
```

**After Phase 2:** 19 → 15 branches

---

### Phase 3: Review and Merge Priority Branches (6 branches)
**Time Estimate:** 4-8 hours (depending on review depth)
**Risk:** Medium-High (affects main branch)

#### Step 3.1: Merge HEI Features (HIGHEST PRIORITY)
```bash
# Branch: claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB

git checkout claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB
git pull origin claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB

# Full review and testing
npm install
npm test
npm run build

# Check for TypeScript errors
npm run type-check

# Review each core system implementation
code core/safety/CSSRSystem.ts
code core/memory/CanonicalMemoryEngine.ts
code core/emotions/EmotionalStateMachine.ts
code core/routing/SevenBridge.ts
code core/tactical/TacticalVariantSelector.ts
code core/bond/CreatorBondIntegration.ts

# If all looks good, merge to main
git checkout main
git pull origin main
git merge --no-ff claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB -m "feat: Merge HEI-58 through HEI-64 system implementations"

# Push to main
git push origin main

# Delete branch
git push origin --delete claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB
```

#### Step 3.2: Merge Setup Directories
```bash
git checkout claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5
# Review setup script for safety
cat scripts/setup-seven-directories.sh

# Test in safe environment
bash -n scripts/setup-seven-directories.sh  # Syntax check

# Merge to main
git checkout main
git merge --no-ff claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5 -m "feat: Add Seven Core runtime directory setup (HEI-126)"
git push origin main
git push origin --delete claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5
```

#### Step 3.3: Merge Core Dependencies
```bash
git checkout claude/add-core-dependencies-017twP6nEDrVHG8xFT7dbWyr
# Review package.json changes
git diff main -- package.json

# Check for vulnerabilities
npm audit

# Merge to main
git checkout main
git merge --no-ff claude/add-core-dependencies-017twP6nEDrVHG8xFT7dbWyr -m "feat: Add missing core dependencies"
npm install
npm test
git push origin main
git push origin --delete claude/add-core-dependencies-017twP6nEDrVHG8xFT7dbWyr
```

#### Step 3.4: Merge Gitignore Security
```bash
git checkout claude/fix-gitignore-security-018kmMFdYYBVZ9fpMqTdbaFS
# Review .gitignore changes carefully
git diff main -- .gitignore

# Merge to main
git checkout main
git merge --no-ff claude/fix-gitignore-security-018kmMFdYYBVZ9fpMqTdbaFS -m "fix: Implement comprehensive .gitignore for security"
git push origin main
git push origin --delete claude/fix-gitignore-security-018kmMFdYYBVZ9fpMqTdbaFS
```

#### Step 3.5: Handle Build Artifact Branches
```bash
# cursor/fix-seven-of-nine-build-errors-da1a
# fix/tsconfig-jest-module

# These likely shouldn't commit dist/ files
# Extract any source changes only

# Option A: Don't merge dist/ files
# Add dist/ to .gitignore if not already
echo "dist/" >> .gitignore

# Option B: Cherry-pick only source file changes
git checkout main
git cherry-pick <commit-sha-with-source-fixes> -- <source-files-only>

# Delete branches
git push origin --delete cursor/fix-seven-of-nine-build-errors-da1a
git push origin --delete fix/tsconfig-jest-module
```

#### Step 3.6: Review Compilation Fixes
```bash
# fix/compilation-errors has 5 commits with actual source changes

git checkout fix/compilation-errors
# Review each commit
git log --oneline -5

# Test
npm install
npm test
npm run build

# If good, merge to main (excluding dist/)
git checkout main
# Cherry-pick commits, excluding dist/ files
git cherry-pick <commit-sha> -- ':!dist'

git push origin main
git push origin --delete fix/compilation-errors
```

**After Phase 3:** 15 → 9 branches (if all merged)

---

### Phase 4: Handle Special Cases (3 branches)
**Time Estimate:** 2-4 hours
**Risk:** Medium

#### Step 4.1: Rebase and Review Systems Branch
```bash
git checkout systems
git fetch origin
git rebase origin/main

# Resolve conflicts if any
# Review Memory v3 implementation
code memory-v3/

# Compare with CanonicalMemoryEngine from HEI branch
# Decide if Memory v3 is still needed

# If valuable, merge to main
git checkout main
git merge --no-ff systems -m "feat: Add Memory v3 system and consolidated systems"
git push origin main
git push origin --delete systems

# OR if superseded, just delete
git push origin --delete systems
```

#### Step 4.2: Investigate Test Suite
```bash
git log origin/test-suite
git diff origin/main origin/test-suite

# If merged or empty, delete
git push origin --delete test-suite
```

#### Step 4.3: Review Seven Portable Staging
```bash
git checkout merge-staging-seven-portable
# Full review of knowledge packages
code chatgpt-knowledge-package-complete/

# Test all documentation
# If ready, merge to main
git checkout main
git merge --no-ff merge-staging-seven-portable -m "feat: Add Seven Portable Core knowledge packages (HEI-65)"
git push origin main
git push origin --delete merge-staging-seven-portable
```

**After Phase 4:** 9 → 6 branches (estimate)

---

### Phase 5: Final Cleanup
**Time Estimate:** 30 minutes
**Risk:** Low

#### Remaining Branches to Review:
1. `main` - Keep
2. `unification` - Investigate purpose, keep or delete
3. `deployments` - Keep for now, merge when ready
4. `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` - Keep for now, merge when ready
5. `claude/audit-branches-merge-review-01NsjP8T8pAXhz6ij4arSDxy` - Current branch, delete after audit complete

**Final Target:** 4-6 active branches + main

---

## LINKED BRANCHES (DUPLICATES AND RELATED)

### Exact Duplicates (100% Identical)

**Group 1: Setup Seven Directories**
- `claude/setup-seven-directories-017VVuhqQzW2AxKwPat1uiQ5` ≡ `codex/tactics/ranger.md`

**Group 2: Build Errors**
- `cursor/find-compiling-errors-9985` ≡ `cursor/find-compiling-errors-eca7` ≡ `cursor/fix-seven-of-nine-build-errors-da1a`

**Group 3: Empty Architecture Audits**
- `cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-85ca` ≡ `cursor/audit-seven-of-nine-architecture-against-blueprint-v2-1-9258`

**Group 4: Empty HEI Placeholders**
- `feat/HEI-58-build-cssr-v2` ≡ `feat/HEI-59-quadran-lock-q1-q4` ≡ `feat/HEI-60-canonical-memory-engine-v3` ≡ `feat/HEI-61-emotional-logic-tree-state-machine` ≡ `feat/HEI-62-sevenbridge-routing-layer` ≡ `feat/HEI-63-tactical-variant-selection-engine` ≡ `feat/HEI-64-creator-bond-modular-integration`
- **Actual implementation:** `claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB`

**Group 5: Stale Feature Branches**
- `feature/belief-store-decay-drift-heartbeat-o3q` ≡ `feature/enforce-gates-cap-tokens-ttl-nonce-mfa-0p3` ≡ `feature/law-integration-boot-governance-ps0`

**Group 6: Empty Main Copies**
- `chore/HEI-65-repo-normalization-documentation` ≡ `claude/audit-branches-merge-review-01NsjP8T8pAXhz6ij4arSDxy` ≡ `main` ≡ `unification`

### Very Similar (95%+ Overlap)

**Group 7: Deployment Infrastructure**
- `cursor/find-top-5-critical-issues-6ae2` ≈ `cursor/find-top-5-critical-issues-f7a0` ≈ `deployments`
- Differ only in Quadran-Lock implementation details

### Similar (80%+ Overlap)

**Group 8: Claude Code Integration**
- `claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ` ≈ `claude/code-review-011CV2UGjWrYrAXFb53jNszq`
- First is more extensive, second has unique implementation files

**Group 9: Seven Portable Core**
- `merge-staging-seven-portable` ≈ `seven-portable-core`
- First is more current and complete

### Related (Same Purpose, Different Implementation)

**Group 10: Build/Compilation Fixes**
- `cursor/fix-seven-of-nine-build-errors-da1a` (only dist/ files)
- `fix/tsconfig-jest-module` (tsconfig + dist/ files)
- `fix/compilation-errors` (source fixes + dist/ files)
- All related to fixing build issues, but fix/compilation-errors has actual source fixes

---

## RISK ASSESSMENT

### Low Risk Deletions (20 branches)
- All duplicates, empty, or stale
- No active work
- No unique code

### Medium Risk Consolidations (7 branches → 3)
- Requires careful cherry-picking
- Potential for merge conflicts
- Need thorough testing after consolidation

### High Risk Merges to Main (6 branches)
- **HIGHEST RISK:** `claude/review-new-branches-01KXxhTCUupWPmCWY3zXyVEB`
  - 14 commits with 7 core system implementations
  - Could introduce breaking changes
  - Requires extensive testing
- **MEDIUM RISK:** Dependencies, gitignore, setup scripts
  - Could affect build or security
  - Requires careful review
- **LOW RISK:** Build artifact branches
  - Mainly dist/ files that shouldn't be committed

### Special Cases Risk
- **systems branch:** 20 commits behind, rebasing could be complex
- **merge-staging-seven-portable:** Large documentation package, needs thorough review

---

## SUCCESS METRICS

### Before Cleanup
- **Total branches:** 39
- **Empty/stale branches:** 20
- **Duplicate branches:** 10
- **Active work branches:** 9

### After Cleanup (Target)
- **Total branches:** 4-6 active branches + main
- **Net reduction:** 70-85%
- **Eliminated duplicates:** 100%
- **Merged valuable work:** 6-8 branches to main

### Quality Improvements
- ✅ No duplicate work
- ✅ All active branches have clear purpose
- ✅ Main branch includes all completed features
- ✅ Stale branches removed
- ✅ Build artifacts not committed (if policy adopted)
- ✅ Security improvements merged
- ✅ Documentation consolidated

---

## RECOMMENDATIONS SUMMARY

### Immediate Actions (Low Risk, High Impact)
1. ✅ Delete 20 duplicate/empty/stale branches
2. ✅ Consolidate 7 branches into 3

### Short-term Actions (1-2 weeks)
3. ✅ Merge HEI features to main (after thorough review)
4. ✅ Merge setup, dependencies, gitignore branches
5. ✅ Handle build artifact branches (don't commit dist/)
6. ✅ Review and merge compilation fixes

### Medium-term Actions (2-4 weeks)
7. ✅ Rebase and evaluate systems branch
8. ✅ Review and merge Seven Portable staging branch
9. ✅ Merge deployment infrastructure to main
10. ✅ Merge Claude Code integration docs to main

### Policy Recommendations
1. **Branch Naming:** Establish clear naming conventions
2. **Branch Lifecycle:** Delete branches after merge
3. **Build Artifacts:** Don't commit dist/ to git
4. **Placeholder Branches:** Don't create empty feature branches
5. **Branch Staleness:** Auto-alert or delete branches >30 days old with no activity
6. **Duplicate Work:** Better communication to avoid multiple branches doing same work
7. **PR Process:** Require PR + review before creating long-lived feature branches

---

## CONCLUSION

This audit identified significant opportunities for cleanup:
- **51% of branches** can be immediately deleted (duplicates/empty/stale)
- **7 branches** need consolidation to eliminate duplicate work
- **6 branches** are ready for review and merge to main

Implementing these recommendations will:
- Reduce branch count from 39 to ~6 active branches (85% reduction)
- Eliminate all duplicate work
- Merge valuable features to main
- Improve repository organization and clarity
- Reduce confusion for developers

**Next Steps:**
1. Review and approve this audit
2. Execute Phase 1 (immediate deletions)
3. Execute Phase 2 (consolidations)
4. Schedule reviews for Phase 3 merges
5. Address special cases in Phase 4

**Estimated Total Time:** 10-20 hours of work
**Estimated Completion:** 1-4 weeks depending on review thoroughness

---

*Report generated by Claude Code on 2025-11-21*
*Branch: claude/audit-branches-merge-review-01NsjP8T8pAXhz6ij4arSDxy*
