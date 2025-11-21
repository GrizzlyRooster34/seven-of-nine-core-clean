# Deployment Plan for Android, Windows, and Linux

This plan outlines the steps to create deployment packages and installers for the application, tailored to the specific target environments.

## Phase 1: Cross-Platform Deployment (Docker & Google Cloud)

This phase focuses on the primary, cross-platform deployment strategies that leverage your existing Docker and Google Cloud infrastructure.

### 1.1. Docker Deployment
- **Task:** Create a `Dockerfile` that defines the application's environment, including the Node.js runtime and all dependencies.
- **Task:** Create a `docker-compose.yml` file to orchestrate the application for local development and testing on both Windows 11 and Manjaro Linux.
- **Task:** Test the Docker deployment on both Windows 11 and Manjaro Linux to ensure consistency.

### 1.2. Google Cloud Deployment
- **Task:** Create a `cloudbuild.yaml` file to define the continuous integration and deployment (CI/CD) pipeline for Google Cloud.
- **Task:** Configure Google Cloud Artifact Registry to store the application's Docker images.
- **Task:** Create a deployment script that uses `gcloud` to deploy the application to Google Cloud Run.
- **Task:** Test the Google Cloud deployment to ensure it is accessible and functional.

## Phase 2: Native Desktop Deployment (Windows & Linux)

This phase focuses on creating native desktop installers for a more traditional user experience.

### 2.1. Windows Deployment (MSIX)
- **Task:** Create an `appxmanifest.xml` file for the MSIX package, defining the application's identity, capabilities, and resources.
- **Task:** Use the `makeappx.exe` tool to package the application into an `.msix` file.
- **Task:** Sign the MSIX package with a code-signing certificate.
- **Task:** Test the MSIX installer on Windows 11.

### 2.2. Linux Deployment (AppImage)
- **Task:** Use a tool like `appimage-builder` to create an AppImage for the application, bundling the Node.js runtime and all dependencies.
- **Task:** Create a `.desktop` file to allow for easy launching from the Manjaro Linux desktop environment.
- **Task:** Test the AppImage on Manjaro Linux.

## Phase 3: Android Deployment

This phase focuses on creating a native Android application.

- **Task:** Set up the Android development environment, including the Android SDK, NDK, and necessary build tools.
- **Task:** Create a new Android project to serve as the native wrapper.
- **Task:** Integrate the `Node.js Mobile` library into the Android project.
- **Task:** Package the core Node.js application into a module that can be embedded.
- **Task:** Configure the `AndroidManifest.xml` with the required permissions.
- **Task:** Create a release build of the Android application, signed with a release key.
- **Task:** Test the application on the target devices: Motorola Android 11, OnePlus OxygenOS 12, and OnePlus OxygenOS 14.
