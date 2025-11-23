#!/data/data/com.termux/files/usr/bin/bash
# Install Google Cloud SDK in Termux
# Run: bash scripts/install-gcloud-termux.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Google Cloud SDK Installation for Termux"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v python &>/dev/null; then
    echo "❌ Python not found. Installing..."
    pkg install python -y
fi

if ! command -v curl &>/dev/null; then
    echo "❌ curl not found. Installing..."
    pkg install curl -y
fi

echo "✓ Prerequisites satisfied"
echo ""

# Set installation directory
INSTALL_DIR="$HOME/google-cloud-sdk"
GCLOUD_VERSION="465.0.0"  # Latest stable version as of Oct 2024

echo "📦 Installing Google Cloud SDK..."
echo "   Version: $GCLOUD_VERSION"
echo "   Location: $INSTALL_DIR"
echo ""

# Download gcloud SDK
echo "⬇️  Downloading Google Cloud SDK..."
cd "$HOME"

# Use Linux x86_64 version (works on most ARM with compatibility)
GCLOUD_URL="https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-${GCLOUD_VERSION}-linux-x86_64.tar.gz"

if [ -f "google-cloud-cli.tar.gz" ]; then
    echo "   Removing old download..."
    rm -f google-cloud-cli.tar.gz
fi

curl -o google-cloud-cli.tar.gz "$GCLOUD_URL"

echo "✓ Download complete"
echo ""

# Extract
echo "📂 Extracting archive..."
if [ -d "$INSTALL_DIR" ]; then
    echo "   Removing existing installation..."
    rm -rf "$INSTALL_DIR"
fi

tar -xzf google-cloud-cli.tar.gz
rm google-cloud-cli.tar.gz

echo "✓ Extraction complete"
echo ""

# Run installer
echo "🔧 Running installation script..."
cd "$INSTALL_DIR"

# Install without modifying profile (we'll do it manually)
./install.sh \
    --usage-reporting=false \
    --command-completion=true \
    --path-update=false \
    --quiet

echo "✓ Installation complete"
echo ""

# Add to PATH
echo "🔗 Configuring PATH..."
SHELL_RC="$HOME/.bashrc"

# Check if gcloud is already in PATH config
if grep -q "google-cloud-sdk" "$SHELL_RC" 2>/dev/null; then
    echo "   gcloud already in PATH configuration"
else
    echo "" >> "$SHELL_RC"
    echo "# Google Cloud SDK" >> "$SHELL_RC"
    echo "export CLOUDSDK_PYTHON=$(which python)" >> "$SHELL_RC"
    echo "export PATH=\"\$HOME/google-cloud-sdk/bin:\$PATH\"" >> "$SHELL_RC"
    echo "✓ Added to $SHELL_RC"
fi

# Source immediately
export CLOUDSDK_PYTHON=$(which python)
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Installation location: $INSTALL_DIR"
echo ""
echo "🔄 Please run one of the following:"
echo ""
echo "   # Option 1: Source your bashrc"
echo "   source ~/.bashrc"
echo ""
echo "   # Option 2: Restart your shell"
echo "   exit  # then reopen Termux"
echo ""
echo "   # Option 3: Add to PATH manually for this session"
echo "   export PATH=\"\$HOME/google-cloud-sdk/bin:\$PATH\""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Next steps:"
echo ""
echo "   1. Verify installation:"
echo "      gcloud --version"
echo ""
echo "   2. Initialize and authenticate:"
echo "      gcloud init"
echo ""
echo "   3. Or run setup script:"
echo "      ./scripts/setup-gcp.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
