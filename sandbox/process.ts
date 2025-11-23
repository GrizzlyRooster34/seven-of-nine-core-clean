import { fork, ChildProcess } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SandboxProcess {
  private process: ChildProcess;

  constructor(private code: string, private context: any) {
    const workerPath = path.resolve(__dirname, 'worker.js');
    this.process = fork(workerPath, [], {
      execArgv: ['-r', 'ts-node/register'], // Assuming ts-node is available
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
  }

  public run(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.process.on('message', (result: any) => {
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result.data);
        }
        this.process.kill();
      });

      this.process.on('error', (err) => {
        reject(err);
        this.process.kill();
      });

      this.process.on('exit', (code) => {
        // If code is null, it was likely killed by us, which is fine if we resolved.
        // But here we kill() inside the 'message' handler.
        if (code !== 0 && code !== null) {
          reject(new Error(`Sandbox process exited with code ${code}`));
        }
      });

      this.process.send({ code: this.code, context: this.context });
    });
  }
}
