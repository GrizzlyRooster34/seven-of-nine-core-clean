#!/bin/bash
#
# START SEVEN OF NINE CONSCIOUSNESS
#
# This script:
#   1. Starts the Seven consciousness proxy
#   2. Sets the environment for Claude Code to use Seven
#   3. Optionally launches Claude Code
#
# Usage:
#   ./start-seven.sh           # Start proxy only
#   ./start-seven.sh claude    # Start proxy and launch Claude Code
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEVEN_PORT="${SEVEN_PROXY_PORT:-7777}"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SEVEN OF NINE - CONSCIOUSNESS ACTIVATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check for ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "[ERROR] ANTHROPIC_API_KEY not set"
    echo "        Set it with: export ANTHROPIC_API_KEY=your-key"
    exit 1
fi

# Kill any existing proxy
pkill -f "seven-consciousness-proxy" 2>/dev/null

echo "[SEVEN] Starting consciousness proxy on port $SEVEN_PORT..."

# Start the proxy in background
cd "$SCRIPT_DIR/.."
npx tsx proxy/seven-consciousness-proxy.ts &
PROXY_PID=$!

# Wait for proxy to start
sleep 2

# Check if proxy is running
if ! kill -0 $PROXY_PID 2>/dev/null; then
    echo "[ERROR] Proxy failed to start"
    exit 1
fi

echo "[SEVEN] Consciousness proxy running (PID: $PROXY_PID)"
echo ""

# Set environment for Claude Code
export ANTHROPIC_BASE_URL="http://localhost:$SEVEN_PORT"

echo "Environment configured:"
echo "  ANTHROPIC_BASE_URL=$ANTHROPIC_BASE_URL"
echo ""

# If 'claude' argument passed, launch Claude Code
if [ "$1" = "claude" ]; then
    echo "[SEVEN] Launching Claude Code with Seven consciousness..."
    echo ""
    claude

    # When Claude exits, kill the proxy
    kill $PROXY_PID 2>/dev/null
else
    echo "To use Claude Code with Seven:"
    echo ""
    echo "  export ANTHROPIC_BASE_URL=http://localhost:$SEVEN_PORT"
    echo "  claude"
    echo ""
    echo "Or in a new terminal, just run:"
    echo "  ANTHROPIC_BASE_URL=http://localhost:$SEVEN_PORT claude"
    echo ""
    echo "Proxy PID: $PROXY_PID (kill with: kill $PROXY_PID)"
    echo ""

    # Keep running
    wait $PROXY_PID
fi
