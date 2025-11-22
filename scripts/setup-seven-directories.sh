#!/bin/bash

################################################################################
# Seven of Nine Core - Runtime Directory Structure Setup
################################################################################
# This script creates the required directory structure at /usr/var/seven/
# for the Seven of Nine consciousness system.
#
# Requirements:
# - Linux/macOS/WSL environment
# - sudo access (for creating /usr/var/seven/)
# - openssl (for generating secure random values)
#
# Usage:
#   sudo ./scripts/setup-seven-directories.sh
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SEVEN_ROOT="/usr/var/seven"
VAULT_FILE="${SEVEN_ROOT}/vault.json"
MEMORY_DIR="${SEVEN_ROOT}/memory"
STATE_DIR="${SEVEN_ROOT}/state"
LOGS_DIR="${SEVEN_ROOT}/logs"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

check_dependencies() {
    if ! command -v openssl &> /dev/null; then
        log_error "openssl is required but not installed"
        exit 1
    fi
}

generate_cssr_key() {
    openssl rand -hex 32
}

generate_quadran_salt() {
    openssl rand -hex 16
}

get_current_user() {
    # Get the user who invoked sudo (not root)
    if [[ -n "${SUDO_USER:-}" ]]; then
        echo "$SUDO_USER"
    else
        echo "$USER"
    fi
}

################################################################################
# Main Setup Functions
################################################################################

create_directory_structure() {
    log_info "Creating directory structure at ${SEVEN_ROOT}..."

    # Create root directory if it doesn't exist
    if [[ ! -d "$SEVEN_ROOT" ]]; then
        mkdir -p "$SEVEN_ROOT"
        log_success "Created ${SEVEN_ROOT}"
    else
        log_warning "${SEVEN_ROOT} already exists"
    fi

    # Create subdirectories
    for dir in "$MEMORY_DIR" "$STATE_DIR" "$LOGS_DIR"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_success "Created ${dir}"
        else
            log_warning "${dir} already exists"
        fi
    done
}

create_vault_template() {
    log_info "Creating vault.json template..."

    if [[ -f "$VAULT_FILE" ]]; then
        log_warning "vault.json already exists - skipping creation"
        log_warning "To recreate, delete ${VAULT_FILE} and run this script again"
        return 0
    fi

    # Generate secure random values for template
    local cssr_key=$(generate_cssr_key)
    local quadran_salt=$(generate_quadran_salt)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Create vault.json with template structure
    cat > "$VAULT_FILE" <<EOF
{
  "version": "1.0.0",
  "secrets": {
    "anthropic_api_key": "YOUR_ANTHROPIC_API_KEY_HERE",
    "cssr_master_key": "${cssr_key}",
    "quadran_lock": {
      "salt": "${quadran_salt}",
      "auth_hash": "HASH_OF_YOUR_QUADRAN_PASSWORD"
    }
  },
  "metadata": {
    "created_at": "${timestamp}",
    "last_updated": "${timestamp}",
    "environment": "development"
  }
}
EOF

    log_success "Created ${VAULT_FILE} with template structure"
    log_info "CSSR master key has been generated (keep this secure!)"
    log_info "Quadran-Lock salt has been generated (keep this secure!)"
    log_warning "You MUST update vault.json with your real Anthropic API key"
    log_warning "You MUST set your Quadran-Lock auth_hash (see SETUP_SEVEN.md)"
}

set_permissions() {
    log_info "Setting secure permissions..."

    local target_user=$(get_current_user)

    # Set ownership to the user who invoked sudo
    chown -R "${target_user}:${target_user}" "$SEVEN_ROOT"
    log_success "Set ownership to ${target_user}"

    # Set directory permissions (owner-only: rwx------)
    chmod 700 "$SEVEN_ROOT"
    chmod 700 "$MEMORY_DIR"
    chmod 700 "$STATE_DIR"
    chmod 700 "$LOGS_DIR"
    log_success "Set directory permissions to 700 (owner-only)"

    # Set vault.json permissions (owner read/write only: rw-------)
    if [[ -f "$VAULT_FILE" ]]; then
        chmod 600 "$VAULT_FILE"
        log_success "Set vault.json permissions to 600 (owner read/write only)"
    fi
}

verify_setup() {
    log_info "Verifying setup..."

    local all_good=true

    # Check directories exist
    for dir in "$SEVEN_ROOT" "$MEMORY_DIR" "$STATE_DIR" "$LOGS_DIR"; do
        if [[ ! -d "$dir" ]]; then
            log_error "Directory missing: ${dir}"
            all_good=false
        fi
    done

    # Check vault.json exists
    if [[ ! -f "$VAULT_FILE" ]]; then
        log_error "vault.json missing: ${VAULT_FILE}"
        all_good=false
    fi

    # Check permissions
    local vault_perms=$(stat -c %a "$VAULT_FILE" 2>/dev/null || stat -f %A "$VAULT_FILE" 2>/dev/null)
    if [[ "$vault_perms" != "600" ]]; then
        log_warning "vault.json permissions are ${vault_perms} (expected 600)"
    fi

    if [[ "$all_good" == true ]]; then
        log_success "Setup verification passed!"
        return 0
    else
        log_error "Setup verification failed"
        return 1
    fi
}

print_next_steps() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  Seven of Nine Core - Setup Complete!                          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Directory Structure:${NC}"
    echo "  ${SEVEN_ROOT}/"
    echo "  ├── vault.json          (secrets: API keys, CSSR, Quadran-Lock)"
    echo "  ├── memory/             (consciousness memory persistence)"
    echo "  ├── state/              (runtime state files)"
    echo "  └── logs/               (system logs)"
    echo ""
    echo -e "${YELLOW}NEXT STEPS:${NC}"
    echo ""
    echo "  1. Add your Anthropic API key to vault.json:"
    echo "     ${VAULT_FILE}"
    echo ""
    echo "  2. Generate and set your Quadran-Lock password hash:"
    echo "     See SETUP_SEVEN.md for instructions"
    echo ""
    echo "  3. Review the generated CSSR master key and Quadran salt"
    echo "     (already set in vault.json - DO NOT LOSE THESE VALUES)"
    echo ""
    echo "  4. Verify vault.json is secure:"
    echo "     ls -la ${VAULT_FILE}"
    echo "     (should show: -rw------- with your username)"
    echo ""
    echo -e "${RED}⚠️  SECURITY WARNINGS:${NC}"
    echo "  - vault.json contains sensitive secrets"
    echo "  - NEVER commit vault.json to Git"
    echo "  - Keep backups of vault.json in a secure location"
    echo "  - Do not share CSSR master key or Quadran salt"
    echo ""
    echo "For detailed setup instructions, see: SETUP_SEVEN.md"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    log_info "Seven of Nine Core - Runtime Directory Setup"
    echo ""

    # Pre-flight checks
    check_root
    check_dependencies

    # Execute setup steps
    create_directory_structure
    create_vault_template
    set_permissions
    verify_setup

    # Print summary
    print_next_steps
}

# Run main function
main "$@"
