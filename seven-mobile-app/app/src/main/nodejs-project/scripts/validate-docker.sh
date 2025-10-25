#!/bin/bash
# Docker Configuration Validation Script
# Validates Docker files before building

# Note: set -e disabled to allow script to continue even if some checks fail
# set -e

echo "🔍 Seven of Nine Core - Docker Configuration Validator"
echo "===================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation results
ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking required files..."
echo "--------------------------------"

# Check Dockerfile exists
if [ -f "Dockerfile" ]; then
    success "Dockerfile exists"
else
    error "Dockerfile not found"
fi

# Check docker-compose.yml exists
if [ -f "docker-compose.yml" ]; then
    success "docker-compose.yml exists"
else
    error "docker-compose.yml not found"
fi

# Check .dockerignore exists
if [ -f ".dockerignore" ]; then
    success ".dockerignore exists"
else
    warning ".dockerignore not found (optional but recommended)"
fi

echo ""
echo "2. Checking project structure..."
echo "--------------------------------"

# Check critical directories
REQUIRED_DIRS=("src" "db" "spark" "skills")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Directory '$dir' exists"
    else
        error "Required directory '$dir' not found"
    fi
done

# Check package.json
if [ -f "package.json" ]; then
    success "package.json exists"

    # Check for required scripts
    if grep -q '"build"' package.json; then
        success "Build script defined in package.json"
    else
        error "Build script not found in package.json"
    fi
else
    error "package.json not found"
fi

# Check tsconfig.json
if [ -f "tsconfig.json" ]; then
    success "tsconfig.json exists"
else
    error "tsconfig.json not found"
fi

echo ""
echo "3. Checking Dockerfile syntax..."
echo "--------------------------------"

if [ -f "Dockerfile" ]; then
    # Check for FROM statement
    if grep -q "^FROM" Dockerfile; then
        success "Dockerfile has FROM statement"
    else
        error "Dockerfile missing FROM statement"
    fi

    # Check for WORKDIR
    if grep -q "^WORKDIR" Dockerfile; then
        success "Dockerfile has WORKDIR statement"
    else
        warning "Dockerfile missing WORKDIR statement"
    fi

    # Check for non-root user
    if grep -q "^USER" Dockerfile; then
        success "Dockerfile runs as non-root user"
    else
        warning "Dockerfile does not specify USER (runs as root)"
    fi

    # Check for CMD or ENTRYPOINT
    if grep -q "^CMD\|^ENTRYPOINT" Dockerfile; then
        success "Dockerfile has CMD or ENTRYPOINT"
    else
        error "Dockerfile missing CMD or ENTRYPOINT"
    fi
fi

echo ""
echo "4. Checking docker-compose.yml syntax..."
echo "--------------------------------"

if [ -f "docker-compose.yml" ]; then
    # Check version
    if grep -q "^version:" docker-compose.yml; then
        success "docker-compose.yml has version specified"
    else
        warning "docker-compose.yml missing version (will use default)"
    fi

    # Check services
    if grep -q "^services:" docker-compose.yml; then
        success "docker-compose.yml has services defined"
    else
        error "docker-compose.yml missing services section"
    fi

    # Check for volumes
    if grep -q "volumes:" docker-compose.yml; then
        success "docker-compose.yml has volume configuration"
    else
        warning "docker-compose.yml has no volumes (data will not persist)"
    fi

    # Check for networks
    if grep -q "^networks:" docker-compose.yml; then
        success "docker-compose.yml has network configuration"
    else
        warning "docker-compose.yml has no custom networks (will use default)"
    fi
fi

echo ""
echo "5. Checking environment setup..."
echo "--------------------------------"

# Check if Docker is installed (for reference)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    success "Docker is installed: $DOCKER_VERSION"

    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        success "Docker daemon is running"
    else
        warning "Docker daemon is not running"
    fi
else
    warning "Docker is not installed (validation only mode)"
fi

# Check if docker-compose is installed
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    success "Docker Compose is installed: $COMPOSE_VERSION"
else
    # Try docker compose plugin (newer method)
    if command -v docker &> /dev/null; then
        if docker compose version &> /dev/null 2>&1; then
            COMPOSE_VERSION=$(docker compose version 2>/dev/null)
            success "Docker Compose (plugin) is installed: $COMPOSE_VERSION"
        else
            warning "Docker Compose is not installed"
        fi
    else
        warning "Docker Compose is not installed"
    fi
fi

echo ""
echo "6. Recommendations..."
echo "--------------------------------"

# Check for .env file
if [ -f ".env" ]; then
    warning ".env file found - ensure secrets are not committed to git"
else
    echo "• Consider creating a .env.example file for environment variable templates"
fi

# Check for README or DOCKER.md
if [ -f "DOCKER.md" ]; then
    success "Docker documentation found (DOCKER.md)"
elif [ -f "README.md" ] && grep -q -i "docker" README.md; then
    success "Docker instructions found in README.md"
else
    warning "No Docker documentation found"
fi

echo ""
echo "===================================================="
echo "📊 Validation Results"
echo "===================================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
else
    echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ Docker configuration is valid!"
    echo ""
    echo "Next steps:"
    echo "  1. Build the image:     docker-compose build"
    echo "  2. Start services:      docker-compose up -d"
    echo "  3. View logs:           docker-compose logs -f"
    echo "  4. See DOCKER.md for more details"
    exit 0
else
    echo "❌ Please fix the errors above before building"
    exit 1
fi
