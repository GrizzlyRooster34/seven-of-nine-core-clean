# Research: Effective Deployment Strategies

This document summarizes the research findings for the most effective deployment strategies for the Seven of Nine Core project on Android, Linux, and Windows.

## 1. Android Deployment

### Primary Strategy: Dedicated React Native App with Headless Node.js Service

- **Core Technology:** The most effective and robust method to run the Node.js-based core logic on Android is to use the **Node.js Mobile** library. This allows for the embedding of a full Node.js runtime within a native Android application, enabling the core logic to run as a true headless background service.
- **Architecture:**
    1.  The core `seven-of-nine-core-clean` logic will be packaged as a Node.js module.
    2.  A native Android application will be created (likely within the existing `seven-mobile-app` directory).
    3.  The Node.js Mobile library will be used to create a background service that runs the core logic.
    4.  A React Native application will be built for the user interface.
    5.  A bridge (e.g., using `react-native-nodemed` or a custom event bridge) will be created to facilitate communication between the React Native UI and the Node.js background service.
- **Benefits:**
    - **Full Node.js Compatibility:** Allows the core logic to run without modification.
    - **Background Persistence:** The service can run even when the app is closed.
    - **Performance:** Offloads heavy processing from the UI thread.
- **Considerations:**
    - Increased app size and complexity due to the embedded Node.js runtime.
    - Requires native Android development knowledge to set up the background service.

### Secondary Strategy: Termux Installer for Advanced Users

- **Approach:** The existing plan to use a shell script installer for Termux is a viable option for developers and advanced users.
- **Best Practices:**
    - The script should be idempotent (i.e., it can be run multiple times without causing issues).
    - It should perform robust checks for all dependencies (`git`, `nodejs`, `ollama`).
    - It should provide clear error messages and instructions.

## 2. Linux Deployment

### Server Mode

- **Core Technology:** Use **systemd** to manage the application as a persistent background service.
- **Best Practices:**
    - **Service File:** Create a `seven-of-nine.service` file in `/etc/systemd/system/`.
    - **User:** Run the service as a dedicated, non-root user for security.
    - **Restart Policy:** Use `Restart=on-failure` to ensure the service automatically restarts if it crashes.
    - **Working Directory:** Set the `WorkingDirectory` to the application's root directory.
    - **Logging:** Use `journalctl -u seven-of-nine.service` for centralized logging.

### Desktop Mode

- **Core Technology:** Use a `.desktop` file for integration with desktop environments.
- **Best Practices:**
    - **File Location:** Place the `.desktop` file in `/usr/share/applications/` for system-wide access or `~/.local/share/applications/` for user-specific access.
    - **Icon:** Specify an icon path for better visual integration.
    - **Exec:** Ensure the `Exec` field correctly calls the application's start script.

## 3. Windows Deployment

- **Core Technology:** Use a **PowerShell script (`.ps1`)** for the installer.
- **Best Practices:**
    - **Prerequisite Checks:** Use `Get-Command` to verify that `git`, `node`, and `npm` are installed and in the system's PATH.
    - **Installation:**
        - Use `git clone` to download the application.
        - Use `npm install` to install dependencies.
    - **Shortcut Creation:** Use the `WScript.Shell` COM object to create a desktop shortcut. The shortcut should target `powershell.exe` and use the `-Command` argument to launch the Node.js application in the correct directory.
    - **Error Handling:** Use `try...catch` blocks for robust error handling during the installation process.
