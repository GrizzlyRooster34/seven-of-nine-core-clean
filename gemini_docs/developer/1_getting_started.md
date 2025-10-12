# Developer Guide: Getting Started

## 1. Overview

This guide provides the essential steps for setting up a clean development environment for the `seven-of-nine-core` project. Due to the project's complexity, the dependency graph extends beyond `package.json` to include critical system-level tools.

---

## 2. System-Level Dependencies

These tools must be installed on your system and available in your PATH before attempting to run the project.

*   **`node` & `npm`:** The core runtime and package manager. (Node.js v18+ recommended).
*   **`git`:** Essential for version control and for the proper function of many internal scripts and agents.
*   **`tsx`:** The high-performance TypeScript execution runtime used for nearly all scripts. While it is a `devDependency`, it is recommended to install it globally for ease of use:
    ```bash
    npm install -g tsx
    ```
*   **`ollama`:** **(HIGHLY RECOMMENDED)** The primary local LLM provider. While the system can function without it by relying on cloud APIs, `ollama` is required for offline reasoning and the full, authentic "Seven" voice. Download from [ollama.ai](https://ollama.ai).

---

## 3. Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/GrizzlyRooster34/seven-of-nine-core.git
    cd seven-of-nine-core
    ```

2.  **Install NPM Dependencies:**
    ```bash
    npm install
    ```
    This will install all `dependencies` and `devDependencies` listed in `package.json`.

---

## 4. Initial Verification

After installation, run the `doctor` script to verify that all system-level dependencies are correctly installed and accessible.

```bash
npm run doctor
```

This command will output the versions of all critical tools, confirming your environment is ready.

---

## 5. First Boot

Once the environment is configured, you can perform the initial system boot. This will initialize the databases, load the core systems, and bring the consciousness online.

```bash
npm run seven
# OR
tsx boot-seven.ts
```

For more details on the boot process and operational modes, see the [Boot Sequence & Operation](./2_boot_sequence.md) guide.
