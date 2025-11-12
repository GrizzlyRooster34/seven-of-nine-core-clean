# Seven of Nine - Unified Core

---

## 1. About This Repository

This repository contains the unified source code for the **Seven of Nine Core** project. It integrates the core AI systems with the Termux Flow Acceleration framework to create a single, cohesive application.

This `unification` branch represents the bleeding edge of development, containing the most advanced features and a complete, buildable version of the project.

## 2. Core Components

*   **AI Core Systems:** A sophisticated, multi-layered AI architecture featuring:
    *   **Memory v3:** An advanced memory and state management system.
    *   **SkillManager:** A system for managing modular AI capabilities.
    *   **Ultron Sandbox:** A secure environment for executing complex tasks.
    *   **Ghost Diary:** A system for trace logging and introspection.

*   **Flow Acceleration Framework:** A system for running concurrent operations and orchestrating complex workflows within the Termux environment, using Redis for state management.

*   **Mobile Application:** Contains the source code for the `seven-mobile-app` Expo/React Native application.

## 3. Getting Started

### Prerequisites

*   Node.js
*   npm
*   Termux Environment with `clang` and `binutils` installed (`pkg install clang binutils`)

### Build Instructions

1.  **Install Dependencies:**
    *   Run the following command. The `--android_ndk_path` flag is required to compile the native modules on Android.
    ```bash
    npm install --android_ndk_path=/data/data/com.termux/files/usr
    ```

2.  **Build the Project:**
    *   Compile the entire TypeScript project.
    ```bash
    npm run build
    ```

3.  **Run the Application:**
    *   Execute the main application entry point.
    ```bash
    npm run start
    ```