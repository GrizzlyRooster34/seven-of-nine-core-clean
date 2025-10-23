# Deployment Plan for Android, Windows, and Linux

This plan outlines the steps to create a dedicated Android application, and enhance the deployment process for Windows and Linux platforms.

## Phase 1: Android Application Development

### 1.1. Project Setup
- **Technology Choice:** Use React Native to leverage the existing TypeScript codebase.
- **Android Compatibility:** Target Android 11 (API level 30) as the minimum supported version, with primary focus on Android 12 (API level 31) and Android 14 (API level 34).
- **Scaffolding:** Initialize a new React Native project inside the `seven-mobile-app` directory.
- **Dependency Integration:**
    - Restructure the core `seven-of-nine-core-clean` logic to be importable as a library.
    - Add the core logic as a local dependency to the React Native project.

### 1.2. Core Logic Integration
- **Bridge:** Create a bridge to communicate between the React Native UI and the core TypeScript logic.
- **Background Service:** Implement a background service to run the `SparkEngine` and other core processes.
- **UI:** Develop a simple UI to interact with the AI, display its status, and manage settings.

### 1.3. Build and Packaging
- **Android Build:** Configure the project to build a release-ready `.apk` or `.aab` file.
- **CI/CD:** Create a GitHub Actions workflow to automate the Android build process.

## Phase 2: Desktop and Advanced Deployment

### 2.1. Linux Deployment
- **Validate:** Execute the `installers/linux/install-seven-linux.sh` script on a fresh Ubuntu LTS or Manjaro instance.
- **Enhance:**
    - Improve package manager detection to be more reliable across different distributions (e.g., check for `apt`, `dnf`, `pacman`).
    - Add an interactive prompt for "Server Mode" (systemd) or "Desktop Mode".
- **Test:**
    - Server Mode: Verify the `seven` service runs on boot.
    - Desktop Mode: Verify the application launches from the `.desktop` file.

### 2.2. Windows Deployment
- **Validate:** Execute the `installers/windows/install-seven-windows.bat` script on a Windows 11 machine.
- **Enhance:**
    - Convert the `.bat` script to a more robust PowerShell script (`.ps1`).
    - Add checks for Node.js and Ollama dependencies.
- **Test:** Verify desktop shortcuts are created and functional.

### 2.3. Android (Termux) Deployment - Secondary Option
- **Reposition:** Frame the Termux installation as an "advanced" or "developer" option.
- **Validate & Enhance:**
    - Add robust error handling to the `install-seven-termux.sh` script.
    - Add a post-install `npm run doctor` check.
- **Test:** Verify the `seven` and `seven-diag` aliases work correctly.

## Phase 3: Documentation

### 3.1. Update `DEPLOYMENT.md`
- Create a new top-level `DEPLOYMENT.md` file.
- **Primary Focus:** Add detailed instructions for installing and running the new Android app.
- **Secondary Sections:** Add instructions for the Linux, Windows, and advanced Termux installations.
- **Build Section:** Include a section on how to build the Android app and the other packages from source.
- **Troubleshooting:** Add a section for common installation issues for all platforms.

