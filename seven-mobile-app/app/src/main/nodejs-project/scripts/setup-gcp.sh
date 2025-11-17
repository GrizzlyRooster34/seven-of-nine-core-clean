#!/bin/bash
# Google Cloud Platform Setup Script
# Initializes GCP project for Seven of Nine Core deployment

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Seven of Nine Core - GCP Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "This script will help you set up Google Cloud Platform for deploying Seven of Nine Core."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ gcloud CLI is not installed${NC}"
    echo ""
    echo "Please install the Google Cloud SDK:"
    echo "  https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"
echo ""

# Step 1: Authentication
echo -e "${BLUE}Step 1: Authentication${NC}"
echo "──────────────────────────────────────────"
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✓ Already authenticated as: ${CURRENT_ACCOUNT}${NC}"
    read -p "Re-authenticate? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gcloud auth login
    fi
else
    echo "Authenticating with Google Cloud..."
    gcloud auth login
fi
echo ""

# Step 2: Project Selection/Creation
echo -e "${BLUE}Step 2: Project Setup${NC}"
echo "──────────────────────────────────────────"
echo "Available projects:"
gcloud projects list --format="table(projectId,name,projectNumber)" 2>/dev/null || echo "No projects found"
echo ""

read -p "Enter existing project ID (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo ""
    echo "Creating a new project..."
    read -p "Enter new project ID (lowercase, hyphens ok): " NEW_PROJECT_ID
    read -p "Enter project name: " PROJECT_NAME

    if [ -z "$NEW_PROJECT_ID" ]; then
        echo -e "${RED}✗ Project ID is required${NC}"
        exit 1
    fi

    gcloud projects create "$NEW_PROJECT_ID" --name="$PROJECT_NAME"
    PROJECT_ID="$NEW_PROJECT_ID"
    echo -e "${GREEN}✓ Project created: ${PROJECT_ID}${NC}"
fi

# Set the project
echo -e "${BLUE}→ Setting active project: ${PROJECT_ID}${NC}"
gcloud config set project "$PROJECT_ID"
echo -e "${GREEN}✓ Project set${NC}"
echo ""

# Step 3: Billing Check
echo -e "${BLUE}Step 3: Billing${NC}"
echo "──────────────────────────────────────────"
BILLING_ENABLED=$(gcloud beta billing projects describe "$PROJECT_ID" --format="value(billingEnabled)" 2>/dev/null || echo "false")

if [ "$BILLING_ENABLED" != "True" ]; then
    echo -e "${YELLOW}⚠ Billing is not enabled for this project${NC}"
    echo ""
    echo "To enable billing:"
    echo "  1. Visit: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    echo "  2. Link a billing account"
    echo ""
    read -p "Press Enter once billing is enabled..."
else
    echo -e "${GREEN}✓ Billing enabled${NC}"
fi
echo ""

# Step 4: Enable APIs
echo -e "${BLUE}Step 4: Enabling Required APIs${NC}"
echo "──────────────────────────────────────────"
echo "Enabling:"
echo "  • Cloud Build API"
echo "  • Cloud Run API"
echo "  • Container Registry API"
echo "  • Artifact Registry API"
echo ""

gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com \
    --project="$PROJECT_ID"

echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Step 5: Set Default Region
echo -e "${BLUE}Step 5: Default Region${NC}"
echo "──────────────────────────────────────────"
echo "Common regions:"
echo "  • us-central1    (Iowa)"
echo "  • us-east1       (South Carolina)"
echo "  • us-west1       (Oregon)"
echo "  • europe-west1   (Belgium)"
echo "  • asia-east1     (Taiwan)"
echo ""
read -p "Enter your preferred region [us-central1]: " REGION
REGION=${REGION:-us-central1}

gcloud config set run/region "$REGION"
echo -e "${GREEN}✓ Default region set: ${REGION}${NC}"
echo ""

# Step 6: Service Account Permissions
echo -e "${BLUE}Step 6: Service Account Setup${NC}"
echo "──────────────────────────────────────────"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")

echo "Granting Cloud Build permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin" \
    --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo -e "${GREEN}✓ Service account configured${NC}"
echo ""

# Step 7: Create Artifact Registry Repository (optional, for future use)
echo -e "${BLUE}Step 7: Artifact Registry (Optional)${NC}"
echo "──────────────────────────────────────────"
read -p "Create Artifact Registry repository? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    REPO_NAME="seven-of-nine"
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Seven of Nine Core container images" \
        --quiet || echo "Repository may already exist"

    echo -e "${GREEN}✓ Artifact Registry repository created${NC}"
fi
echo ""

# Step 8: Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✓ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Configuration Summary:"
echo "  Project ID:    $PROJECT_ID"
echo "  Project #:     $PROJECT_NUMBER"
echo "  Region:        $REGION"
echo ""
echo "Environment variables to set:"
echo "  export GCP_PROJECT_ID=\"$PROJECT_ID\""
echo "  export GCP_REGION=\"$REGION\""
echo ""
echo "Add these to your ~/.bashrc or ~/.zshrc to persist them."
echo ""
echo "Next steps:"
echo "  1. Set environment variables (see above)"
echo "  2. Run: ./scripts/deploy-gcp.sh"
echo "  3. Your app will be deployed to Cloud Run!"
echo ""
echo "Useful commands:"
echo "  • Deploy:        ./scripts/deploy-gcp.sh"
echo "  • View logs:     gcloud run services logs read seven-of-nine-core --region=$REGION"
echo "  • List builds:   gcloud builds list --limit=5"
echo "  • Cloud Console: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo ""
