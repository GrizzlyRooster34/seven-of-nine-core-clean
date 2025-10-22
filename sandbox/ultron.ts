import { SandboxProcess } from './process';

export class UltronSandbox {
  public async execute(code: string, context: any = {}): Promise<any> {
    const sandboxProcess = new SandboxProcess(code, context);
    return sandboxProcess.run();
  }
}
