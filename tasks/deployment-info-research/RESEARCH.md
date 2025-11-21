# Research: Deployment Information for Android, Windows, and Linux

This document summarizes the required aspects and information for proper deployment of the application to Android, Windows, and Linux environments.

## User-Specific Environment Requirements

Based on our previous conversation, the following specific environment requirements should be taken into account:

- **Android:** Minimal base requirement is Motorola Android 11, with primary targets being OxygenOS 12 & 14 (from OnePlus).
- **Windows:** The target operating system is Windows 11, running on an AMD-powered laptop.
- **Linux:** The primary target Linux distribution is Manjaro Linux, running on the same AMD-powered laptop.
- **Docker:** You have Docker available on both your Windows 11 and Manjaro (Linux) systems. This makes Docker a primary, cross-platform deployment strategy for local and desktop environments.
- **Google Cloud:** You have a Google Cloud account. This makes Google Cloud Run a primary target for cloud-based, serverless deployment.

This information will be used to prioritize and tailor the deployment strategies outlined below.


## 1. Android Deployment

### Packaging
- **Node.js Mobile:** A robust solution for embedding a Node.js runtime directly into a native Android application, allowing existing Node.js core logic to run with minimal modification.
- **Termux:** Provides a Linux environment on Android, suitable for advanced users or development, but less ideal for general distribution as a standalone app.
- **React Native:** Can be used for building the application's UI, with communication to the embedded Node.js backend (via Node.js Mobile) or a separate service.

### Dependencies
- **Node.js Runtime:** The primary dependency. Node.js Mobile handles embedding it; for Termux, it's installed via `pkg`.
- **Native Libraries:** Any native Node.js modules may require specific Android NDK (Native Development Kit) setup.

### Permissions
- **Internet Access:** `android.permission.INTERNET` for network communication.
- **Wake Lock:** `android.permission.WAKE_LOCK` if background execution is required.
- **File System Access:** `android.permission.READ_EXTERNAL_STORAGE`, `android.permission.WRITE_EXTERNAL_STORAGE` for user file interaction.

### Signing
- Android applications must be digitally signed with a release key (generated keystore) before installation or publication.

### Distribution
- **Google Play Store:** Primary channel, requires an `aab` (Android App Bundle) and adherence to policies.
- **Direct Download:** Distributing `.apk` files directly, requiring users to enable "Install unknown apps."

## 2. Windows Deployment

### Installer
- **MSIX:** Recommended modern Windows app packaging format. Offers reliable installation, uninstallation, and updates. Supports distribution via Microsoft Store or direct download.
- **Inno Setup / NSIS:** Traditional installer creators, offering flexibility but potentially more complex for updates and sandboxing.
- **PowerShell Script:** Simple for basic installations, but lacks advanced features like proper uninstallation, version management, and security.

### Dependencies
- **Node.js Runtime:** The installer should either bundle Node.js or check for its presence and guide the user to install it.
- **Build Tools:** Visual Studio Build Tools may be required for native Node.js modules during installation or pre-compilation.

### Configuration
- **Environment Variables:** Standard method for application configuration.
- **Configuration Files:** JSON, YAML, or INI files for app-specific settings.
- **Registry:** Less common for Node.js apps, but can be used for system-wide settings.

### Code Signing
- Windows applications and installers should be signed with a code-signing certificate to establish trust and avoid security warnings.

### Auto-updates
- **Squirrel.Windows:** Popular framework for auto-updating desktop applications.
- **MSIX:** Provides a built-in update mechanism.

## 3. Linux Deployment

### Packaging
- **`.deb` (Debian/Ubuntu):** Standard package format for Debian-based distributions.
- **`.rpm` (Fedora/CentOS/RHEL):** Standard package format for Red Hat-based distributions.
- **AppImage:** Universal Linux package format, bundling app and dependencies into a single executable. Runs on most distributions without installation.
- **Snap / Flatpak:** Universal Linux packaging systems offering sandboxing and easy distribution via app stores.

### Dependencies
- **Node.js Runtime:** The package should either declare a dependency on Node.js or bundle it.
- **System Libraries:** Native modules may require specific system libraries (e.g., `build-essential`, `libssl-dev`).

### Systemd Service
- **Service File:** Create a `.service` file (e.g., `/etc/systemd/system/seven-core.service`) to run the application as a background service.
- **User:** Run the service as a dedicated, non-root user for security.
- **Restart Policy:** Configure `Restart=on-failure` for automatic restarts.

### Desktop Entry
- **`.desktop` File:** Create a `.desktop` file (e.g., `~/.local/share/applications/seven-core.desktop`) for graphical launchers, specifying name, icon, and executable path.

### Permissions
- Ensure correct file permissions for the application directory and executable files.
- Manage user accounts and groups if specific privileges are required.
