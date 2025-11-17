# Seven of Nine Core - Deployment Quick Start

**Status:** Phase 1 Complete ✅ | Ready for Testing & Phase 2/3 Implementation

---

## Testing Checklist

### 1️⃣ Docker Testing (Windows 11 & Manjaro Linux)

**Prerequisites:**
- [ ] Docker Desktop (Windows) or Docker Engine (Linux) installed
- [ ] Docker Compose installed
- [ ] Git repository cloned

**Steps:**
```bash
# Navigate to project
cd seven-of-nine-core-clean

# Validate configuration
./scripts/validate-docker.sh

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f seven-core

# Test Ollama (optional)
docker exec -it seven-ollama ollama pull llama2
docker exec -it seven-ollama ollama list

# Stop services
docker-compose down
```

**Expected Results:**
- ✅ Build completes in 2-5 minutes
- ✅ Service starts successfully
- ✅ Database initializes in `./db`
- ✅ Logs show "Seven of Nine Core initialized"

---

### 2️⃣ GCP Testing (Cloud Run)

**Prerequisites:**
- [ ] Google Cloud account
- [ ] Billing enabled
- [ ] gcloud CLI installed

**Steps:**
```bash
# One-time setup
./scripts/setup-gcp.sh
# Follow interactive prompts

# Configure environment
cp .env.gcp.example .env.gcp
nano .env.gcp  # Edit with your project ID
source .env.gcp

# Deploy
./scripts/deploy-gcp.sh

# Monitor deployment
gcloud builds list --limit=5

# Get service URL
gcloud run services describe seven-of-nine-core \
  --region=$GCP_REGION \
  --format="value(status.url)"

# View logs
gcloud run services logs read seven-of-nine-core \
  --region=$GCP_REGION \
  --follow
```

**Expected Results:**
- ✅ Build completes in 5-10 minutes
- ✅ Service deploys successfully
- ✅ HTTPS URL provided
- ✅ Service responds to requests

---

## Phase 2: Native Desktop Deployment

### Windows (MSIX Package)

**To Implement:**
```bash
# Create Windows installer structure
mkdir -p installers/windows

# Required files:
# - appxmanifest.xml
# - PowerShell installer script
# - Desktop shortcuts
# - Start menu integration
```

**Tools Needed:**
- [ ] Windows 11 machine
- [ ] Visual Studio Build Tools (optional)
- [ ] Code signing certificate (for distribution)

**Key Tasks:**
- [ ] Create `installers/windows/appxmanifest.xml`
- [ ] Create `installers/windows/install-seven-windows.ps1`
- [ ] Package with `makeappx.exe`
- [ ] Sign with certificate
- [ ] Test installation

---

### Linux (AppImage)

**To Implement:**
```bash
# Create Linux installer structure
mkdir -p installers/linux

# Required files:
# - .desktop file
# - AppImage build script
# - systemd service file (server mode)
```

**Tools Needed:**
- [ ] Manjaro Linux machine
- [ ] appimage-builder
- [ ] Desktop environment for testing

**Key Tasks:**
- [ ] Create `installers/linux/seven-core.desktop`
- [ ] Create `installers/linux/seven-core.service`
- [ ] Build AppImage
- [ ] Test on Manjaro
- [ ] Test systemd service

---

## Phase 3: Android Deployment

### React Native App

**To Implement:**
```bash
# Android project already exists at:
cd seven-mobile-app

# Need to implement:
# - React Native UI
# - Node.js Mobile integration
# - Background service
# - Build configuration
```

**Tools Needed:**
- [ ] Android Studio
- [ ] Android SDK/NDK
- [ ] Node.js Mobile library
- [ ] Physical device (Motorola Android 11 / OnePlus)

**Key Tasks:**
- [ ] Set up React Native project structure
- [ ] Integrate Node.js Mobile
- [ ] Create UI components
- [ ] Configure AndroidManifest.xml permissions
- [ ] Build APK/AAB
- [ ] Test on target devices

---

### Termux (Developer Option)

**Already Exists:**
- Shell script installer in `installers/android/`

**To Validate:**
- [ ] Test on Android device
- [ ] Verify Ollama installation
- [ ] Test npm run commands
- [ ] Document for advanced users

---

## Order of Execution

**Recommended sequence:**

1. **Docker Testing** (30 min - 1 hour)
   - Test on Windows 11 first
   - Test on Manjaro Linux
   - Document any issues

2. **GCP Testing** (1 hour)
   - Run setup-gcp.sh
   - Deploy to Cloud Run
   - Test autoscaling
   - Monitor costs

3. **Phase 2: Desktop** (4-8 hours)
   - Windows MSIX (2-4 hours)
   - Linux AppImage (2-4 hours)
   - Can be done in parallel

4. **Phase 3: Android** (8-16 hours)
   - React Native setup (2-4 hours)
   - Node.js Mobile integration (4-8 hours)
   - UI development (2-4 hours)

**Total estimated time:** 13-26 hours

---

## Quick Commands Reference

### Docker
```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### GCP
```bash
# Setup (once)
./scripts/setup-gcp.sh

# Deploy
source .env.gcp
./scripts/deploy-gcp.sh

# Logs
gcloud run services logs read seven-of-nine-core --region=$GCP_REGION -f

# Update
gcloud run services update seven-of-nine-core --memory=4Gi

# Delete
gcloud run services delete seven-of-nine-core --region=$GCP_REGION
```

### Development
```bash
# Local development
npm install
npm run build
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

---

## Troubleshooting

### Docker Issues

**Build fails:**
```bash
# Check Docker running
docker info

# Clean build
docker system prune -a
docker-compose build --no-cache
```

**Service won't start:**
```bash
# Check logs
docker-compose logs seven-core

# Check ports
netstat -ano | grep 3000
```

### GCP Issues

**Build fails:**
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

**Permissions error:**
```bash
# Re-run setup
./scripts/setup-gcp.sh
```

**Service error:**
```bash
# Check service logs
gcloud run services logs read seven-of-nine-core --region=$GCP_REGION
```

---

## Documentation Links

- **Docker Guide:** [DOCKER.md](./DOCKER.md)
- **GCP Guide:** [GCP_DEPLOYMENT.md](./GCP_DEPLOYMENT.md)
- **Research:** [tasks/deployment-info-research/](./tasks/deployment-info-research/)
- **Phase 1 Summary:** [tasks/deployment-info-research/PHASE1_COMPLETE.md](./tasks/deployment-info-research/PHASE1_COMPLETE.md)

---

## Environment Setup

### Windows 11
```bash
# Set environment
$env:GCP_PROJECT_ID = "your-project-id"
$env:GCP_REGION = "us-central1"

# Or create .env.gcp and source it
```

### Linux (Manjaro)
```bash
# Add to ~/.bashrc or ~/.zshrc
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# Or create .env.gcp and source it
source .env.gcp
```

---

## Success Criteria

**Phase 1 (Testing):**
- ✅ Docker builds successfully
- ✅ Services start without errors
- ✅ Database persists across restarts
- ✅ GCP deployment completes
- ✅ Cloud Run service accessible
- ✅ Logs are readable

**Phase 2 (Desktop):**
- ✅ Windows installer works
- ✅ Linux AppImage runs
- ✅ Desktop shortcuts functional
- ✅ Services run on boot (optional)

**Phase 3 (Android):**
- ✅ APK installs on device
- ✅ App starts without crash
- ✅ Background service works
- ✅ Permissions granted correctly

---

**Ready to deploy! 🚀**
