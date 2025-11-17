#!/bin/bash
# Google Cloud Platform Deployment Script
# Deploys Seven of Nine Core to Cloud Run

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="seven-of-nine-core"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Default resource configuration
MEMORY="${MEMORY:-2Gi}"
CPU="${CPU:-2}"
MAX_INSTANCES="${MAX_INSTANCES:-10}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"
TIMEOUT="${TIMEOUT:-300s}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Seven of Nine Core - GCP Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"

# Check if project ID is set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠ GCP_PROJECT_ID not set${NC}"
    echo ""
    echo "Available projects:"
    gcloud projects list --format="table(projectId,name)"
    echo ""
    read -p "Enter your GCP Project ID: " PROJECT_ID

    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}✗ Project ID is required${NC}"
        exit 1
    fi
fi

# Set the project
echo -e "${BLUE}→ Setting project: ${PROJECT_ID}${NC}"
gcloud config set project "$PROJECT_ID"

# Check authentication
echo -e "${BLUE}→ Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo -e "${YELLOW}⚠ Not authenticated${NC}"
    echo -e "${BLUE}→ Starting authentication...${NC}"
    gcloud auth login
fi

echo -e "${GREEN}✓ Authenticated${NC}"

# Enable required APIs
echo ""
echo -e "${BLUE}→ Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    --quiet

echo -e "${GREEN}✓ APIs enabled${NC}"

# Display configuration
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Deployment Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  Project:       $PROJECT_ID"
echo "  Region:        $REGION"
echo "  Service:       $SERVICE_NAME"
echo "  Memory:        $MEMORY"
echo "  CPU:           $CPU"
echo "  Max Instances: $MAX_INSTANCES"
echo "  Min Instances: $MIN_INSTANCES"
echo "  Timeout:       $TIMEOUT"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Ask for confirmation
read -p "Deploy with these settings? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

# Build and deploy using Cloud Build
echo ""
echo -e "${BLUE}→ Triggering Cloud Build...${NC}"
echo "This will:"
echo "  1. Build the Docker image"
echo "  2. Push to Container Registry"
echo "  3. Deploy to Cloud Run"
echo ""

gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_DEPLOY_REGION="$REGION",_MEMORY="$MEMORY",_CPU="$CPU",_MAX_INSTANCES="$MAX_INSTANCES",_MIN_INSTANCES="$MIN_INSTANCES",_TIMEOUT="$TIMEOUT" \
    .

# Check deployment status
echo ""
echo -e "${BLUE}→ Checking deployment status...${NC}"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --format="value(status.url)" 2>/dev/null || echo "")

if [ -n "$SERVICE_URL" ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ Deployment Successful!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "Service URL: ${BLUE}${SERVICE_URL}${NC}"
    echo ""
    echo "Next steps:"
    echo "  • View logs:     gcloud run services logs read $SERVICE_NAME --region=$REGION"
    echo "  • View metrics:  gcloud run services describe $SERVICE_NAME --region=$REGION"
    echo "  • Update config: Edit cloudbuild.yaml and re-run this script"
    echo ""
else
    echo -e "${RED}✗ Deployment may have failed${NC}"
    echo "Check Cloud Build logs:"
    echo "  gcloud builds list --limit=5"
    exit 1
fi
