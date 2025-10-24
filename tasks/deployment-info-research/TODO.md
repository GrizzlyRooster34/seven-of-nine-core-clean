# TODO: Deployment for Android, Windows, and Linux

## Phase 1: Cross-Platform Deployment (Docker & Google Cloud)

- [ ] `[docker]` `[setup]` Create a `Dockerfile` for the application.
- [ ] `[docker]` `[setup]` Create a `docker-compose.yml` for local development.
- [ ] `[docker]` `[test]` [PARALLEL] Test Docker deployment on Windows 11.
- [ ] `[docker]` `[test]` [PARALLEL] Test Docker deployment on Manjaro Linux.
- [ ] `[gcp]` `[setup]` Create a `cloudbuild.yaml` for CI/CD.
- [ ] `[gcp]` `[setup]` Configure Google Cloud Artifact Registry.
- [ ] `[gcp]` `[script]` Create a `gcloud` deployment script for Cloud Run.
- [ ] `[gcp]` `[test]` Test the Google Cloud deployment.

## Phase 2: Native Desktop Deployment (Windows & Linux)

- [ ] `[windows]` `[setup]` Create an `appxmanifest.xml` for the MSIX package.
- [ ] `[windows]` `[build]` Use `makeappx.exe` to create the `.msix` package.
- [ ] `[windows]` `[build]` Sign the MSIX package.
- [ ] `[windows]` `[test]` Test the MSIX installer on Windows 11.
- [ ] `[linux]` `[build]` [PARALLEL] Use `appimage-builder` to create an AppImage.
- [ ] `[linux]` `[setup]` [PARALLEL] Create a `.desktop` file for the AppImage.
- [ ] `[linux]` `[test]` Test the AppImage on Manjaro Linux.

## Phase 3: Android Deployment

- [ ] `[android]` `[setup]` Set up the Android development environment (SDK, NDK).
- [ ] `[android]` `[setup]` Create a new native Android project.
- [ ] `[android]` `[dependency]` Integrate the `Node.js Mobile` library.
- [ ] `[android]` `[build]` Package the core Node.js application as a module.
- [ ] `[android]` `[config]` Configure `AndroidManifest.xml` with necessary permissions.
- [ ] `[android]` `[build]` Create and sign a release build (`.aab` or `.apk`).
- [ ] `[android]` `[test]` [PARALLEL] Test the application on Motorola Android 11.
- [ ] `[android]` `[test]` [PARALLEL] Test the application on OnePlus OxygenOS 12.
- [ ] `[android]` `[test]` [PARALLEL] Test the application on OnePlus OxygenOS 14.
