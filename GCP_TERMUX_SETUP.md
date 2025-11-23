# Google Cloud Platform Setup for Termux

**Environment:** Termux on Android
**Purpose:** Deploy Seven of Nine Core to Google Cloud Platform from mobile device
**Status:** Ready for setup

---

## Quick Start

### 1️⃣ Install Google Cloud SDK

Run the installation script:

```bash
cd ~/seven-of-nine-core-clean
bash scripts/install-gcloud-termux.sh
```

After installation completes, reload your shell:

```bash
source ~/.bashrc
# OR
exit  # and reopen Termux
```

Verify installation:

```bash
gcloud --version
```

**Expected output:**
```
Google Cloud SDK 465.0.0
...
```

---

### 2️⃣ Configure GCP Credentials

Initialize gcloud and authenticate:

```bash
gcloud init
```

This will:
1. Open a browser for authentication
2. Ask you to select or create a GCP project
3. Set default region/zone

**Alternative: Manual Configuration**

If `gcloud init` has issues in Termux:

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Set region
gcloud config set run/region us-central1
```

---

### 3️⃣ Edit Environment Configuration

Open the `.env.gcp` file:

```bash
nano .env.gcp
```

**Required changes:**

```bash
# Change this line:
export GCP_PROJECT_ID="YOUR_PROJECT_ID_HERE"

# To your actual project ID:
export GCP_PROJECT_ID="my-seven-project-12345"
```

**Optional changes:**
- Adjust `GCP_REGION` (default: us-central1)
- Adjust `MEMORY` (default: 2Gi)
- Adjust `CPU` (default: 2)
- Adjust `MAX_INSTANCES` (default: 10)

Save and exit (Ctrl+X, Y, Enter)

---

### 4️⃣ Load Environment Variables

```bash
source .env.gcp
```

Verify:

```bash
echo $GCP_PROJECT_ID
echo $GCP_REGION
```

---

### 5️⃣ Run One-Time Setup

This enables required APIs and sets up IAM permissions:

```bash
./scripts/setup-gcp.sh
```

**What it does:**
- ✅ Enables Cloud Run API
- ✅ Enables Cloud Build API
- ✅ Enables Container Registry API
- ✅ Enables Artifact Registry API
- ✅ Configures service account permissions
- ✅ Sets up billing (if needed)

**Expected duration:** 2-5 minutes

---

### 6️⃣ Deploy to Google Cloud

```bash
./scripts/deploy-gcp.sh
```

**What it does:**
1. Validates configuration
2. Shows deployment summary
3. Asks for confirmation
4. Builds container image
5. Deploys to Cloud Run
6. Outputs service URL

**Expected duration:** 5-10 minutes (first deployment)

---

## Verification

### Check Deployment Status

```bash
gcloud run services list --region=$GCP_REGION
```

### Get Service URL

```bash
gcloud run services describe seven-of-nine-core \
  --region=$GCP_REGION \
  --format="value(status.url)"
```

### View Logs

```bash
gcloud run services logs read seven-of-nine-core \
  --region=$GCP_REGION \
  --follow
```

### Check Build History

```bash
gcloud builds list --limit=5
```

---

## Troubleshooting

### Issue: gcloud command not found after installation

**Solution:**
```bash
# Add to PATH manually
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

# Or reload bashrc
source ~/.bashrc
```

---

### Issue: Authentication fails in Termux

**Symptoms:**
- Browser doesn't open
- Authentication timeout

**Solution 1: Use device code flow**
```bash
gcloud auth login --no-launch-browser
```
This will:
1. Show a URL
2. Show a device code
3. You manually open URL in browser
4. Enter the device code
5. Complete authentication

**Solution 2: Use service account**
```bash
# Create service account on GCP Console
# Download key JSON file
# Transfer to Termux
gcloud auth activate-service-account --key-file=service-account-key.json
```

---

### Issue: Permission denied errors

**Symptoms:**
```
ERROR: (gcloud.run.deploy) Permission denied
```

**Solution:**
```bash
# Re-run setup to fix permissions
./scripts/setup-gcp.sh

# Or manually grant permissions
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="user:YOUR_EMAIL@gmail.com" \
  --role="roles/run.admin"
```

---

### Issue: Build fails with memory/storage errors

**Symptoms:**
```
ERROR: failed to build: insufficient memory
```

**Solution:**
Cloud Build runs on GCP servers (not Termux), so this is a GCP resource issue:

```bash
# Use Cloud Build with more resources
gcloud builds submit --machine-type=e2-highcpu-8

# Or use larger disk
gcloud builds submit --disk-size=100
```

---

### Issue: Deployment succeeds but service crashes

**Check logs:**
```bash
gcloud run services logs read seven-of-nine-core \
  --region=$GCP_REGION \
  --limit=50
```

**Common causes:**
1. Missing environment variables
2. Port not set to 3000
3. Health check timeout
4. Missing dependencies

**Fix:**
Edit `.env.gcp` and redeploy:
```bash
source .env.gcp
./scripts/deploy-gcp.sh
```

---

## Termux-Specific Notes

### Storage Limitations

Termux runs on Android with limited storage:

```bash
# Check available space
df -h $HOME

# Clean up build artifacts
npm run clean
docker system prune -a  # if using Docker
```

### Network Considerations

Termux uses mobile network:
- Large uploads (container images) may take time
- Consider using Wi-Fi for deployments
- Monitor data usage

### Performance

gcloud operations are remote:
- Build happens on GCP servers (not on device)
- Deployment is managed by Cloud Run
- Your device just sends commands

---

## Environment File Quick Reference

**Location:** `.env.gcp`

**Essential variables:**
```bash
GCP_PROJECT_ID="your-project-id"      # REQUIRED
GCP_REGION="us-central1"              # Deployment region
MEMORY="2Gi"                          # Service memory
CPU="2"                               # Service CPU
MAX_INSTANCES="10"                    # Autoscale limit
```

**Load environment:**
```bash
source .env.gcp
```

---

## Cost Estimation

**Cloud Run Pricing (as of 2024):**

Free tier (per month):
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

**Estimated costs for Seven of Nine:**

**Low usage** (scale to zero, occasional use):
- $0 - $5/month

**Medium usage** (some traffic, auto-scaling):
- $10 - $30/month

**High usage** (constant traffic, min instances > 0):
- $50 - $150/month

**Monitor costs:**
```bash
# View current billing
gcloud billing projects describe $GCP_PROJECT_ID
```

---

## Security Best Practices

### 1. Protect .env.gcp

Already in `.gitignore`:
```bash
# Verify
cat .gitignore | grep .env.gcp
```

### 2. Use Secret Manager for Production

Don't put API keys in environment variables:

```bash
# Create secret
echo -n "your-api-key" | gcloud secrets create anthropic-api-key \
  --data-file=-

# Grant access to Cloud Run
gcloud secrets add-iam-policy-binding anthropic-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Rotate Credentials

```bash
# Revoke old credentials
gcloud auth revoke

# Re-authenticate
gcloud auth login
```

---

## Useful Commands

### Project Management

```bash
# List projects
gcloud projects list

# Switch project
gcloud config set project PROJECT_ID

# Get current project
gcloud config get-value project
```

### Service Management

```bash
# List services
gcloud run services list

# Describe service
gcloud run services describe seven-of-nine-core --region=$GCP_REGION

# Update service
gcloud run services update seven-of-nine-core \
  --memory=4Gi \
  --region=$GCP_REGION

# Delete service
gcloud run services delete seven-of-nine-core --region=$GCP_REGION
```

### Build Management

```bash
# List builds
gcloud builds list

# View build logs
gcloud builds log BUILD_ID

# Cancel build
gcloud builds cancel BUILD_ID
```

---

## Next Steps

After successful deployment:

1. **Test the service:**
   ```bash
   SERVICE_URL=$(gcloud run services describe seven-of-nine-core \
     --region=$GCP_REGION \
     --format="value(status.url)")

   curl $SERVICE_URL/health
   ```

2. **Set up monitoring:**
   - View in Cloud Console: https://console.cloud.google.com/run
   - Set up alerts for errors/latency
   - Configure log-based metrics

3. **Configure custom domain** (optional):
   ```bash
   gcloud run domain-mappings create \
     --service=seven-of-nine-core \
     --domain=seven.yourdomain.com \
     --region=$GCP_REGION
   ```

4. **Set up CI/CD** (optional):
   - Connect GitHub repository
   - Auto-deploy on push
   - See GCP_DEPLOYMENT.md for details

---

## Resources

**Official Documentation:**
- Cloud Run: https://cloud.google.com/run/docs
- gcloud CLI: https://cloud.google.com/sdk/gcloud
- Cloud Build: https://cloud.google.com/build/docs

**Project Documentation:**
- Full GCP guide: [GCP_DEPLOYMENT.md](./GCP_DEPLOYMENT.md)
- Docker guide: [DOCKER.md](./DOCKER.md)
- Quick start: [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)

---

**Ready to deploy from Termux! 🚀📱**
