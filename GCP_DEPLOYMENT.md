# Google Cloud Platform Deployment Guide

Deploy Seven of Nine Core to Google Cloud Run for scalable, serverless hosting.

## Overview

This guide covers deploying the application to Google Cloud Run using Cloud Build for CI/CD. Cloud Run provides:

- **Serverless**: No infrastructure management
- **Autoscaling**: Scales to zero when not in use
- **Pay-per-use**: Only pay for actual usage
- **Global**: Deploy to regions worldwide
- **HTTPS**: Automatic SSL certificates

## Prerequisites

### 1. Google Cloud Account

- Active Google Cloud account
- Billing enabled (free tier available)
- Project with billing account linked

### 2. Local Tools

```bash
# Install Google Cloud SDK
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Download from: https://cloud.google.com/sdk/docs/install
```

### 3. Authentication

```bash
# Login to Google Cloud
gcloud auth login

# Set default project
gcloud config set project YOUR_PROJECT_ID
```

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Run setup script (one-time)
./scripts/setup-gcp.sh

# 2. Set environment variables
cp .env.gcp.example .env.gcp
# Edit .env.gcp with your project details
source .env.gcp

# 3. Deploy!
./scripts/deploy-gcp.sh
```

### Option 2: Manual Setup

See [Manual Setup](#manual-setup) section below.

## Configuration

### Environment Variables

Create `.env.gcp` from the template:

```bash
cp .env.gcp.example .env.gcp
```

Edit the file with your values:

```bash
# Required
export GCP_PROJECT_ID="my-seven-project"
export GCP_REGION="us-central1"

# Optional (defaults shown)
export MEMORY="2Gi"
export CPU="2"
export MAX_INSTANCES="10"
export MIN_INSTANCES="0"
export TIMEOUT="300s"
```

Load the configuration:

```bash
source .env.gcp
```

### Region Selection

Choose a region close to your users:

**Americas:**
- `us-central1` (Iowa) - Default
- `us-east1` (South Carolina)
- `us-west1` (Oregon)
- `southamerica-east1` (São Paulo)

**Europe:**
- `europe-west1` (Belgium)
- `europe-west2` (London)
- `europe-north1` (Finland)

**Asia:**
- `asia-east1` (Taiwan)
- `asia-northeast1` (Tokyo)
- `asia-south1` (Mumbai)

[Full list](https://cloud.google.com/run/docs/locations)

### Resource Configuration

Adjust based on your needs:

```yaml
# Light workload
MEMORY="512Mi"
CPU="1"
MAX_INSTANCES="5"

# Medium workload (default)
MEMORY="2Gi"
CPU="2"
MAX_INSTANCES="10"

# Heavy workload
MEMORY="4Gi"
CPU="4"
MAX_INSTANCES="20"
```

## Deployment Process

### Automated Deployment

```bash
# Deploy to Cloud Run
./scripts/deploy-gcp.sh
```

This will:
1. Authenticate with GCP
2. Enable required APIs
3. Build Docker image via Cloud Build
4. Push image to Container Registry
5. Deploy to Cloud Run
6. Display service URL

### Manual Deployment

```bash
# Build and deploy
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_DEPLOY_REGION="$GCP_REGION"

# Or build locally and push
docker build -t gcr.io/$GCP_PROJECT_ID/seven-of-nine-core .
docker push gcr.io/$GCP_PROJECT_ID/seven-of-nine-core

gcloud run deploy seven-of-nine-core \
  --image gcr.io/$GCP_PROJECT_ID/seven-of-nine-core \
  --region $GCP_REGION \
  --platform managed \
  --allow-unauthenticated
```

## Cloud Build Configuration

The `cloudbuild.yaml` file defines the build pipeline:

```yaml
steps:
  1. Build Docker image
  2. Push to Container Registry
  3. Deploy to Cloud Run
```

### Customization

Edit `cloudbuild.yaml` to:
- Change build options
- Add testing steps
- Configure secrets
- Add deployment hooks

### Substitution Variables

Override defaults during deployment:

```bash
gcloud builds submit \
  --substitutions=_MEMORY="4Gi",_CPU="4",_MAX_INSTANCES="20"
```

## Managing the Service

### View Service Info

```bash
# Get service URL
gcloud run services describe seven-of-nine-core \
  --region=$GCP_REGION \
  --format="value(status.url)"

# View full configuration
gcloud run services describe seven-of-nine-core \
  --region=$GCP_REGION
```

### View Logs

```bash
# Stream live logs
gcloud run services logs read seven-of-nine-core \
  --region=$GCP_REGION \
  --follow

# View recent logs
gcloud run services logs read seven-of-nine-core \
  --region=$GCP_REGION \
  --limit=50
```

### Update Service

```bash
# Update environment variables
gcloud run services update seven-of-nine-core \
  --region=$GCP_REGION \
  --update-env-vars="LOG_LEVEL=debug"

# Update resources
gcloud run services update seven-of-nine-core \
  --region=$GCP_REGION \
  --memory=4Gi \
  --cpu=4
```

### Delete Service

```bash
gcloud run services delete seven-of-nine-core \
  --region=$GCP_REGION
```

## Cost Management

### Pricing

Cloud Run pricing (as of 2024):
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests
- **Free tier**: 2 million requests/month

### Cost Optimization

1. **Scale to Zero**: Set `MIN_INSTANCES=0`
2. **Right-size Resources**: Start small, monitor, adjust
3. **Request Timeout**: Set appropriate timeout to avoid long-running requests
4. **Regional Pricing**: Some regions cost less

### Monitor Costs

```bash
# View billing
gcloud billing accounts list

# Check project billing
gcloud beta billing projects describe $GCP_PROJECT_ID
```

## Continuous Deployment

### GitHub Integration

Connect Cloud Build to GitHub:

```bash
# Create trigger
gcloud beta builds triggers create github \
  --repo-name=seven-of-nine-core \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

Now pushing to `main` branch automatically deploys!

### GitLab/Bitbucket

Use webhook triggers:

```bash
gcloud beta builds triggers create webhook \
  --name="seven-deploy" \
  --inline-config=cloudbuild.yaml \
  --secret=YOUR_SECRET_TOKEN
```

## Advanced Configuration

### Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=seven-of-nine-core \
  --domain=seven.yourdomain.com \
  --region=$GCP_REGION
```

### VPC Connector

Connect to VPC resources:

```bash
# Create connector
gcloud compute networks vpc-access connectors create seven-connector \
  --region=$GCP_REGION \
  --range=10.8.0.0/28

# Update service
gcloud run services update seven-of-nine-core \
  --vpc-connector=seven-connector \
  --region=$GCP_REGION
```

### Cloud SQL

Connect to managed database:

```bash
# Update cloudbuild.yaml
--add-cloudsql-instances=PROJECT:REGION:INSTANCE

# Set environment
gcloud run services update seven-of-nine-core \
  --add-cloudsql-instances=my-project:us-central1:seven-db \
  --region=$GCP_REGION
```

### Secrets Management

Use Secret Manager for sensitive data:

```bash
# Create secret
echo -n "my-secret-value" | gcloud secrets create seven-api-key \
  --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding seven-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Mount in Cloud Run
gcloud run services update seven-of-nine-core \
  --update-secrets=/secrets/api-key=seven-api-key:latest \
  --region=$GCP_REGION
```

## Monitoring & Observability

### Cloud Monitoring

View metrics in Cloud Console:
- Request count
- Request latency
- Container CPU/memory usage
- Instance count

### Alerts

Create alerts for:
- High error rate
- Increased latency
- Resource limits

```bash
# Create alert policy (via console)
https://console.cloud.google.com/monitoring/alerting
```

### Tracing

Cloud Trace is automatically enabled for:
- HTTP requests
- Cloud SQL queries
- External API calls

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check build logs
gcloud builds list --limit=1
gcloud builds log BUILD_ID
```

**Service Won't Start:**
```bash
# Check service logs
gcloud run services logs read seven-of-nine-core --region=$GCP_REGION
```

**Permission Denied:**
```bash
# Verify service account permissions
gcloud projects get-iam-policy $GCP_PROJECT_ID
```

**Memory Issues:**
```bash
# Increase memory
gcloud run services update seven-of-nine-core \
  --memory=4Gi \
  --region=$GCP_REGION
```

### Debug Mode

Enable verbose logging:

```bash
gcloud run services update seven-of-nine-core \
  --update-env-vars="LOG_LEVEL=debug" \
  --region=$GCP_REGION
```

## Manual Setup

If not using automation scripts:

### 1. Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com
```

### 2. Set IAM Permissions

```bash
PROJECT_NUMBER=$(gcloud projects describe $GCP_PROJECT_ID --format="value(projectNumber)")

gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### 3. Deploy

```bash
gcloud builds submit --config=cloudbuild.yaml
```

## Best Practices

1. **Security**
   - Use Secret Manager for credentials
   - Enable VPC for private resources
   - Require authentication if not public API
   - Keep base images updated

2. **Performance**
   - Set appropriate CPU/memory
   - Use connection pooling for databases
   - Implement caching
   - Monitor cold start times

3. **Reliability**
   - Set health checks
   - Configure retry policies
   - Use Cloud SQL for persistence
   - Backup data regularly

4. **Cost**
   - Scale to zero when idle
   - Right-size resources
   - Use regional endpoints
   - Monitor usage

## Next Steps

- [ ] Set up monitoring alerts
- [ ] Configure custom domain
- [ ] Enable Cloud SQL if needed
- [ ] Set up CI/CD triggers
- [ ] Review security settings

## Support

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
- [GCP Free Tier](https://cloud.google.com/free)

## Related Documentation

- [DOCKER.md](./DOCKER.md) - Local Docker deployment
- [README.md](./README.md) - Project overview
- [tasks/deployment-info-research/](./tasks/deployment-info-research/) - Deployment research
