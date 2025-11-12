#!/data/data/com.termux/files/usr/bin/bash
# S o N Core - GCP Environment Setup for Termux
# Configures service account authentication and environment variables
# Run: bash scripts/setup-gcp-env-termux.sh

set -e

# ===== S o N core canonical settings =====
PROJECT_ID="s-o-n-core"
REGION="us-central1"
KEY="$HOME/vertex-key.json"   # put your JSON key here first

# ===== sanity: key exists & perms =====
[ -f "$KEY" ] || { echo "Missing $KEY – move your JSON here first."; exit 1; }
chmod 600 "$KEY"

# ===== idempotent block writer =====
add_line() { grep -qF "$1" "$2" 2>/dev/null || echo "$1" >> "$2"; }

# Write to bash startup files (interactive + login shells)
add_line 'export GOOGLE_CLOUD_PROJECT="s-o-n-core"'        "$HOME/.bashrc"
add_line 'export GOOGLE_CLOUD_LOCATION="us-central1"'      "$HOME/.bashrc"
add_line 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/vertex-key.json"' "$HOME/.bashrc"

add_line 'export GOOGLE_CLOUD_PROJECT="s-o-n-core"'        "$HOME/.profile"
add_line 'export GOOGLE_CLOUD_LOCATION="us-central1"'      "$HOME/.profile"
add_line 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/vertex-key.json"' "$HOME/.profile"

# If you use zsh in Termux, persist there too
[ -f "$HOME/.zshrc" ] && {
  add_line 'export GOOGLE_CLOUD_PROJECT="s-o-n-core"'          "$HOME/.zshrc"
  add_line 'export GOOGLE_CLOUD_LOCATION="us-central1"'        "$HOME/.zshrc"
  add_line 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/vertex-key.json"' "$HOME/.zshrc"
}

# Helpful aliases (optional)
add_line 'alias son="echo $GOOGLE_CLOUD_PROJECT @ $GOOGLE_CLOUD_LOCATION"' "$HOME/.bashrc"
add_line 'alias gemstatus="gemini models list 2>/dev/null || echo Gemini CLI not installed"' "$HOME/.bashrc"

# Load into current shell
. "$HOME/.profile" 2>/dev/null || true
. "$HOME/.bashrc"  2>/dev/null || true

# ===== verify =====
echo "[env] GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT"
echo "[env] GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION"
[ -f "$GOOGLE_APPLICATION_CREDENTIALS" ] && echo "[env] key ok: $GOOGLE_APPLICATION_CREDENTIALS"

# Minimal runtime deps for token test
pkg install -y python jq >/dev/null 2>&1 || true
pip install --upgrade google-auth requests --break-system-packages >/dev/null 2>&1 || true

# Get an access token to confirm ADC works
ACCESS_TOKEN="$(python - <<'PY'
import os
from google.oauth2 import service_account
from google.auth.transport.requests import Request
scopes=["https://www.googleapis.com/auth/cloud-platform"]
creds=service_account.Credentials.from_service_account_file(
  os.environ["GOOGLE_APPLICATION_CREDENTIALS"], scopes=scopes)
creds.refresh(Request()); print(creds.token)
PY
)"
[ -n "$ACCESS_TOKEN" ] && echo "[auth] token minted ✓" || echo "[auth] token FAILED"

# Optional: quick Vertex ping (no gcloud needed)
curl -sS -X POST \
  "https://${GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT}/locations/${GOOGLE_CLOUD_LOCATION}/publishers/google/models/gemini-1.5-pro:generateContent" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Respond with exactly: Seven online."}]}]}' \
| jq -r '..|.text? // empty' | head -n1
