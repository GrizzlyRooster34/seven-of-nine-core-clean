# GitHub Actions Android Build Setup

**Date:** 2025-10-25
**Branch:** deployments
**Status:** ✅ Configured and Ready

## Overview

Since Termux cannot build Android APKs locally (missing Android SDK), we use GitHub Actions to automatically build APKs in the cloud whenever you push code.

## What Was Set Up

### 1. GitHub Actions Workflow ✅

**File:** `.github/workflows/android-build.yml`

**Triggers:**
- Push to `deployments` or `main` branch (when seven-mobile-app/ changes)
- Pull requests to those branches
- Manual workflow dispatch (run anytime from GitHub UI)

**What it does:**
1. Sets up Ubuntu runner with JDK 17
2. Installs Android SDK
3. Generates Gradle wrapper (if missing)
4. Builds debug APK
5. Uploads APK as artifact (available for 30 days)
6. On failure: uploads build reports for debugging

### 2. Gradle Wrapper ✅

**Files Added:**
- `seven-mobile-app/gradlew` - Gradle wrapper script (executable)
- `seven-mobile-app/gradle/wrapper/gradle-wrapper.jar` - Wrapper JAR
- `seven-mobile-app/gradle/wrapper/gradle-wrapper.properties` - Configuration

**Version:** Gradle 8.0

### 3. Build Configuration

**Android SDK Levels:**
- Min SDK: 30 (Android 11)
- Target SDK: 34 (Android 14)
- Compile SDK: 34

**Build Types:**
- Debug APK: Builds automatically, ready to install
- Release APK: Requires signing keys (optional)

## How to Use

### From OnePlus 7T (Termux)

#### 1. Make Code Changes
```bash
cd ~/seven-of-nine-core-clean
# Edit files in seven-mobile-app/app/src/main/nodejs-project/
# Or modify Java/Kotlin in seven-mobile-app/app/src/main/java/
```

#### 2. Commit and Push
```bash
git add .
git commit -m "feat: your changes here"
git push origin deployments
```

#### 3. Monitor Build
- Go to: https://github.com/YOUR_USERNAME/seven-of-nine-core-clean/actions
- Click on the latest workflow run
- Watch build progress in real-time

#### 4. Download APK
Once build completes (2-5 minutes):
- Scroll to "Artifacts" section at bottom of workflow run
- Click "seven-mobile-debug-apk" to download
- Downloads as ZIP file

#### 5. Install on Device

**Option A: Direct from OnePlus 7T**
```bash
# If you have the APK on device
pkg install android-tools  # Install ADB if not already
adb install app-debug.apk

# Or just open file manager and tap the APK
```

**Option B: From Another Device**
```bash
# Download from GitHub on computer
# Transfer to phone via USB/cloud
# Install by tapping APK file
```

### Manual Trigger

You can trigger a build without pushing code:

1. Go to GitHub Actions tab
2. Select "Android Build" workflow
3. Click "Run workflow"
4. Select branch (deployments)
5. Click green "Run workflow" button

## Build Output

### Debug APK Location
```
seven-mobile-app/app/build/outputs/apk/debug/app-debug.apk
```

### Expected Size
- APK: ~25-30MB
- Installed: ~40-50MB

### What's Included
- Node.js Mobile runtime (~15-20MB)
- Seven Core codebase (~5MB)
- All consciousness, memory, and LLM systems
- Full TypeScript source compiled to JavaScript

## Troubleshooting

### Build Fails: nodejs-mobile-gradle 401 Error

If you see `401 Unauthorized` from JitPack:

**Problem:** nodejs-mobile Gradle plugin may be deprecated/unavailable

**Solutions:**
1. Update `seven-mobile-app/build.gradle` to use newer plugin version
2. Switch to alternative React Native integration
3. Build manually with different approach

**Fix in workflow:**
```yaml
# Workflow already handles this by retrying with newer Gradle
```

### Build Fails: Missing Dependencies

Check build reports:
- Workflow uploads build reports on failure
- Download "build-reports" artifact
- Check logs for missing dependencies

### APK Won't Install

**Enable Unknown Sources:**
1. Settings → Security → Unknown Sources (enable)
2. Or Settings → Apps → Special Access → Install Unknown Apps → Files (allow)

**Check Minimum SDK:**
- APK requires Android 11+ (OnePlus 7T ✅, Motorola ✅)

## Development Workflow

### Recommended Flow

```
Termux (OnePlus 7T)
  ↓ Code changes
  ↓ git push
GitHub Actions (Cloud)
  ↓ Build APK
  ↓ Upload artifact
Download APK
  ↓ Transfer to device
Install & Test
  ↓ Iterate
```

### Fast Iteration

For Node.js-only changes (no Java/Android changes):
```bash
# Test Node.js code locally in Termux first
cd seven-mobile-app/app/src/main/nodejs-project
node boot-seven.ts  # or tsx boot-seven.ts

# Once working, push and build APK
```

## Advanced: Adding Signing Keys

To build release APKs (optional):

### 1. Generate Keystore
```bash
keytool -genkey -v -keystore seven-release.keystore \
  -alias seven-key -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Add to GitHub Secrets
1. Go to repo Settings → Secrets and variables → Actions
2. Add secrets:
   - `KEYSTORE_FILE` (base64 encoded keystore)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`

### 3. Update Workflow
Add signing configuration to workflow (not included yet)

## Build Times

**Typical build time:** 2-5 minutes

**Breakdown:**
- Checkout: 10-20s
- Setup JDK/SDK: 30-60s
- Gradle build: 1-3 minutes
- Upload artifact: 10-30s

**First build:** May take longer (5-7 minutes) while caching dependencies

## Cost

**GitHub Actions free tier:**
- 2,000 minutes/month for public repos
- Unlimited for public repos (if repo is public)
- Each build: ~3-5 minutes

**Your usage:**
- ~10 builds/day = 30-50 minutes/day
- Well within free tier limits

## Next Steps

### Immediate
1. ✅ Workflow configured
2. ✅ Gradle wrapper added
3. ⏸️ Push code to trigger first build
4. ⏸️ Download and test APK

### Future Enhancements
- [ ] Add release APK signing
- [ ] Add automated testing before build
- [ ] Create build badges for README
- [ ] Set up build notifications
- [ ] Add versioning automation

## Files Added

```
.github/workflows/android-build.yml          (47 lines)
seven-mobile-app/gradlew                      (executable)
seven-mobile-app/gradle/wrapper/gradle-wrapper.jar
seven-mobile-app/gradle/wrapper/gradle-wrapper.properties
tasks/deployment-info-research/GITHUB_ACTIONS_ANDROID.md  (this file)
```

## Summary

You can now develop Android app code on your OnePlus 7T in Termux, push to GitHub, and get APKs built automatically in the cloud. No Android SDK needed on your device - just Node.js, git, and a text editor.

**Workflow:**
Code → Push → Build → Download → Install → Test → Repeat
