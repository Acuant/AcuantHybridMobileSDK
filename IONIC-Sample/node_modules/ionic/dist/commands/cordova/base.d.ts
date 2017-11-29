import { CommandLineInputs, CommandLineOptions, CommandOption, CommandPreRun, IShellRunOptions } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare const CORDOVA_RUN_COMMAND_OPTIONS: CommandOption[];
export declare abstract class CordovaCommand extends Command {
    preRunChecks(): Promise<void>;
    runCordova(argList: string[], {fatalOnNotFound, truncateErrorOutput, ...options}?: IShellRunOptions): Promise<string>;
    checkForPlatformInstallation(runPlatform: string): Promise<void>;
}
export declare class CordovaRunCommand extends CordovaCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
