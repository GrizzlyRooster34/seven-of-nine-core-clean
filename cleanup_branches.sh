#!/bin/bash

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

