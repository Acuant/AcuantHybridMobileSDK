import { ILogger, IProject, IShell, IShellRunOptions, ITaskChain } from '../definitions';
export declare const ERROR_SHELL_COMMAND_NOT_FOUND = "SHELL_COMMAND_NOT_FOUND";
export declare class Shell implements IShell {
    protected tasks: ITaskChain;
    protected log: ILogger;
    protected project: IProject;
    constructor({tasks, log, project}: {
        tasks: ITaskChain;
        log: ILogger;
        project: IProject;
    });
    run(command: string, args: string[], {showCommand, showError, fatalOnNotFound, fatalOnError, showExecution, showSpinner, truncateErrorOutput, ...crossSpawnOptions}: IShellRunOptions): Promise<string>;
    cmdinfo(cmd: string, args?: string[]): Promise<string | undefined>;
    protected supplementPATH(p: string): string;
}
