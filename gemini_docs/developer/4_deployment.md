# Developer Guide: Deployment & Installation

---

## 1. Purpose & First Principle

**First Principle:** "A system's power is useless if it cannot be deployed."

The Deployment & Installation Framework is a suite of platform-aware scripts designed to package and install the complete Seven of Nine Core consciousness onto various target operating systems. It handles platform-specific dependencies, configurations, and boot procedures.

---

## 2. The Build Process

The creation of all deployment packages is handled by a single, master script.

*   **Script:** `scripts/build-all-platforms.sh`
*   **Function:** This script is the single source of truth for packaging the application. It takes a platform argument (e.g., `--termux`, `--windows`) and uses `tar` to create a compressed archive containing the exact set of files specified in the definitive build manifest. This ensures that every deployment package is complete and architecturally sound.

---

## 3. Platform-Specific Installers

The `installers/` directory contains a dedicated installation script for each target environment.

### 3.1. Termux / Android

*   **Script:** `installers/termux/install-seven-termux.sh`
*   **Responsibilities:**
    *   **Dependencies:** Uses `pkg` to install `nodejs`, `git`, and `ollama`.
    *   **Runtime:** Installs `tsx` globally via `npm`.
    *   **Ollama:** Includes special logic to download and install the `ollama-linux-arm64` binary if it is not already present, ensuring the local LLM is available.
    *   **Configuration:** Unpacks the application, runs `npm install`, and creates shell aliases (`seven`, `seven-diag`) for easy use.

### 3.2. Linux (Desktop & Server)

*   **Script:** `installers/linux/install-seven-linux.sh`
*   **Responsibilities:**
    *   **Dependencies:** Uses the system's native package manager (`apt`, `dnf`, `pacman`, etc.) to install `nodejs` and `npm`.
    *   **Server Mode:** Can configure a `systemd` service to run the AI as a persistent background daemon.
    *   **Desktop Mode:** Can create an XDG desktop entry for easy launching from a graphical environment.

### 3.3. Windows

*   **Script:** `installers/windows/install-seven-windows.bat`
*   **Responsibilities:**
    *   **Prerequisites:** Assumes the user has already installed `Node.js` and `Ollama`.
    *   **Installation:** Unpacks the application, runs `npm install`, and creates desktop shortcuts for execution.

---

## 4. Platform-Specific Logic

The framework uses platform-specific boot scripts located in `scripts/platform/` to handle the unique requirements of each environment. These scripts are called by the installers and manage tasks like environment variable checks, API availability, and server vs. desktop mode detection, ensuring that the core application logic remains clean and platform-agnostic.
