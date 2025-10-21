/**
 * ULTRON SANDBOX
 * 
 * A high-security containment environment for testing and executing
 * potentially unsafe code or AI-generated behaviors.
 */

import { EgressFirewall } from './EgressFirewall';

interface SandboxOptions {
  cpuLimit: number; // as a percentage
  memoryLimit: number; // in MB
  timeout: number; // in ms
  allowNetwork: string[] | boolean; // Array of allowed domains or boolean
  allowFileSystem: string[] | boolean; // Array of allowed paths or boolean
}

export class UltronSandbox {
  private firewall: EgressFirewall;

  constructor(private options: SandboxOptions) {
    this.firewall = new EgressFirewall(this.options.allowNetwork);
    console.log('🛡️ Ultron Sandbox Initialized');
  }

  async run(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(`
        const { parentPort } = require('worker_threads');
        const vm = require('vm');

        parentPort.on('message', (task) => {
          const { code, options } = task;

          const sandbox = {
            console: {
              log: (...args) => parentPort.postMessage({ type: 'log', payload: args }),
              error: (...args) => parentPort.postMessage({ type: 'error', payload: args }),
            },
            // TODO: Sandboxed fetch and fs
          };

          const context = vm.createContext(sandbox);

          try {
            const result = vm.runInContext(code, context, { timeout: options.timeout });
            parentPort.postMessage({ type: 'result', payload: result });
          } catch (e) {
            parentPort.postMessage({ type: 'error', payload: e.message });
          }
        });
      `, { eval: true, resourceLimits: { maxOldGenerationSizeMb: this.options.memoryLimit, maxYoungGenerationSizeMb: this.options.memoryLimit } });

      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Sandbox execution timed out'));
      }, this.options.timeout);

      worker.on('message', (message) => {
        if (message.type === 'result') {
          clearTimeout(timeout);

          worker.terminate();
          resolve(message.payload);
        } else if (message.type === 'log') {
          console.log('[Sandbox Log]', ...message.payload);
        } else if (message.type === 'error') {
          clearTimeout(timeout);
          worker.terminate();
          reject(new Error(message.payload));
        }
      });

      worker.on('error', (err) => {
        clearTimeout(timeout);
        worker.terminate();
        reject(err);
      });

      worker.on('exit', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          // reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      worker.postMessage({ code, options: this.options });
    });
  }

  public getStatus() {
    return {
      options: this.options,
      firewallRules: this.firewall.getRules(),
    };
  }
}
