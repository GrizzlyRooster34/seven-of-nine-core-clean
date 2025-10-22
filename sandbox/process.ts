import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

export class SandboxProcess {
  private process: ChildProcess;

  constructor(private code: string, private context: any) {
    const workerPath = path.resolve(__dirname, 'worker.js');
    this.process = fork(workerPath, [], {
      execArgv: ['-r', 'ts-node/register'],
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
  }

  public run(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.process.on('message', (result) => {
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
        if (code !== 0) {
          reject(new Error(`Sandbox process exited with code ${code}`));
        }
      });

      this.process.send({ code: this.code, context: this.context });
    });
  }
}
