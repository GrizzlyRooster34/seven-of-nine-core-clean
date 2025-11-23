export declare class SandboxProcess {
    private code;
    private context;
    private process;
    constructor(code: string, context: any);
    run(): Promise<any>;
}
