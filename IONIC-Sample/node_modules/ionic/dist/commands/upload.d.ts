import { CommandLineInput, CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare class UploadCommand extends Command implements CommandPreRun {
    resolveNote(input: CommandLineInput): string | undefined;
    resolveMetaData(input: CommandLineInput): any;
    resolveChannelTag(input: CommandLineInput): string | undefined;
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
