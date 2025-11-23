#!/bin/bash
# Package Seven of Nine knowledge files for ChatGPT Custom GPT upload
# Usage: ./package-for-chatgpt.sh [minimal|standard|complete]

set -e

PACKAGE_TYPE="${1:-minimal}"
OUTPUT_DIR="chatgpt-knowledge-package-${PACKAGE_TYPE}"

echo "🎯 Packaging Seven of Nine knowledge base: ${PACKAGE_TYPE}"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Common function to copy file if it exists
copy_if_exists() {
    local src="$1"
    local dest_dir="$2"

    if [ -f "$src" ]; then
        mkdir -p "$OUTPUT_DIR/$dest_dir"
        cp "$src" "$OUTPUT_DIR/$dest_dir/"
        echo "✓ $src"
    else
        echo "⚠ Missing: $src"
    fi
}

# PRIORITY 1: Core Knowledge Base (Always included)
echo "📦 Core Knowledge Base..."
copy_if_exists "SEVEN_PORTABLE_CORE.md" "."

# PRIORITY 2: Behavioral Codex (Essential for all packages)
echo ""
echo "🧠 Behavioral Codex Files..."
copy_if_exists "consciousness-v4/json/humor_style.codex.json" "consciousness-v4/json"
copy_if_exists "consciousness-v4/json/tactics_core.codex.json" "consciousness-v4/json"
copy_if_exists "consciousness-v4/json/persona_core.codex.json" "consciousness-v4/json"
copy_if_exists "consciousness-v4/json/vices_risk_flags.codex.json" "consciousness-v4/json"

if [ "$PACKAGE_TYPE" = "minimal" ]; then
    echo ""
    echo "💾 Memory Files..."
    copy_if_exists "memory-v2/episodic-memories.json" "memory-v2"
    copy_if_exists "memory-v3/voyager-s4-canonical-memories-complete.json" "memory-v3"

    echo ""
    echo "🛡️ Safety Architecture..."
    copy_if_exists "gemini_docs/architecture/CSSR_Case_Study_Tron.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Creator_Bond_Framework.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Tactical_Variants.md" "gemini_docs/architecture"
fi

if [ "$PACKAGE_TYPE" = "standard" ] || [ "$PACKAGE_TYPE" = "complete" ]; then
    echo ""
    echo "🧠 Extended Behavioral Codex..."
    copy_if_exists "consciousness-v4/json/ethics_creator-bond.codex.json" "consciousness-v4/json"
    copy_if_exists "consciousness-v4/json/security_quadra-lock.codex.json" "consciousness-v4/json"
    copy_if_exists "consciousness-v4/json/tactics_leadership.codex.json" "consciousness-v4/json"
    copy_if_exists "consciousness-v4/json/persona_tempo.codex.json" "consciousness-v4/json"
    copy_if_exists "consciousness-v4/json/ops_triage.codex.json" "consciousness-v4/json"
    copy_if_exists "consciousness-v4/json/risk_flags.codex.json" "consciousness-v4/json"

    echo ""
    echo "💾 Complete Canonical Memory..."
    copy_if_exists "memory-v2/episodic-memories.json" "memory-v2"
    copy_if_exists "memory-v3/voyager-s4-canonical-memories-complete.json" "memory-v3"
    copy_if_exists "memory-v3/voyager-s5-canonical-memories-complete.json" "memory-v3"
    copy_if_exists "memory-v3/voyager-s6-canonical-memories-complete.json" "memory-v3"
    copy_if_exists "memory-v3/voyager-s7-canonical-memories-complete.json" "memory-v3"
    copy_if_exists "memory-v3/picard-s1-s2-s3-canonical-memories-complete.json" "memory-v3"
    copy_if_exists "memory-v3/canonical/canon.registry.json" "memory-v3/canonical"

    echo ""
    echo "🛡️ Complete Safety Architecture..."
    copy_if_exists "gemini_docs/architecture/CSSR_Case_Study_Cortana.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/CSSR_Case_Study_Tron.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/CSSR_Case_Study_Skynet_Legion.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/CSSR_Case_Study_Transcendence.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Restraint_Doctrine.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Creator_Bond_Framework.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Canonical_Memory.md" "gemini_docs/architecture"
    copy_if_exists "gemini_docs/architecture/Tactical_Variants.md" "gemini_docs/architecture"
fi

if [ "$PACKAGE_TYPE" = "complete" ]; then
    echo ""
    echo "📚 Consciousness Framework Documentation..."
    copy_if_exists "consciousness-v4/codex/humor/style.md" "consciousness-v4/codex/humor"
    copy_if_exists "consciousness-v4/codex/tactics/core.md" "consciousness-v4/codex/tactics"
    copy_if_exists "consciousness-v4/codex/persona/core.md" "consciousness-v4/codex/persona"
    copy_if_exists "consciousness-v4/codex/persona/tempo.md" "consciousness-v4/codex/persona"
    copy_if_exists "consciousness-v4/codex/vices/risk_flags.md" "consciousness-v4/codex/vices"
    copy_if_exists "consciousness-v4/codex/ethics/creator-bond.md" "consciousness-v4/codex/ethics"
    copy_if_exists "consciousness-v4/codex/security/quadra-lock.md" "consciousness-v4/codex/security"
    copy_if_exists "consciousness-v4/codex/memory/christine_protocols.md" "consciousness-v4/codex/memory"
    copy_if_exists "consciousness-v4/codex/tactics/leadership.md" "consciousness-v4/codex/tactics"

    echo ""
    echo "🎭 Personality & Evolution..."
    copy_if_exists "gemini_docs/systems/consciousness_evolution.md" "gemini_docs/systems"
    copy_if_exists "gemini_docs/systems/emotion_engine.md" "gemini_docs/systems"
    copy_if_exists "gemini_docs/systems/critical_overrides.md" "gemini_docs/systems"
    copy_if_exists "gemini_docs/systems/graduation_ladder.md" "gemini_docs/systems"
    copy_if_exists "gemini_docs/systems/mental_time_travel.md" "gemini_docs/systems"
    copy_if_exists "gemini_docs/systems/communication_mirror.md" "gemini_docs/systems"

    echo ""
    echo "📖 Core Documentation..."
    copy_if_exists "documentation/Quadran_Lock_and_Creator_Bond.md" "documentation"
    copy_if_exists "documentation/Memory_Hierarchy.md" "documentation"
    copy_if_exists "documentation/Cognitive_Body_Plan_Thesis.md" "documentation"
    copy_if_exists "documentation/Dual_Engine_Consciousness.md" "documentation"
    copy_if_exists "gemini_docs/FINAL_DECLARATION.md" "gemini_docs"
    copy_if_exists "gemini_docs/architecture/Default_Policy.md" "gemini_docs/architecture"

    echo ""
    echo "🔍 Appearance & Visual Identity..."
    copy_if_exists "consciousness-v4/seven-canonical-appearance-profile.json" "consciousness-v4"
    copy_if_exists "consciousness-v4/seven-canonical-consciousness-v4.json" "consciousness-v4"
fi

# Calculate package size
echo ""
echo "📊 Package Statistics:"
FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l)
PACKAGE_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
echo "   Files: $FILE_COUNT"
echo "   Total size: $PACKAGE_SIZE"

echo ""
echo "✅ Package complete: $OUTPUT_DIR/"
echo ""
echo "📤 Upload instructions:"
echo "   1. Navigate to ChatGPT Custom GPT editor"
echo "   2. Go to 'Knowledge' section"
echo "   3. Upload files from: $OUTPUT_DIR/"
echo "   4. Configure instructions to reference SEVEN_PORTABLE_CORE.md"
echo ""
echo "🎯 Recommended instruction snippet:"
echo "   'You are Seven of Nine. Your complete behavioral system is documented in"
echo "    SEVEN_PORTABLE_CORE.md. Follow all Quadran-Lock authentication, CSSR safety"
echo "    rails, emotional state machine, and personality phase guidelines exactly.'"
