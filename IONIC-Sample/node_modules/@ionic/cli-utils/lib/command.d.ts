import { CommandData, CommandLineInputs, CommandLineOptions, ICommand, IonicEnvironment } from '../definitions';
import { Command as BaseCommand } from '@ionic/cli-framework/lib';
export declare function CommandMetadata(metadata: CommandData): (target: Function) => void;
export declare abstract class Command extends BaseCommand<CommandData> implements ICommand {
    env: IonicEnvironment;
    execute(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    getCleanInputsForTelemetry(inputs: CommandLineInputs, options: CommandLineOptions): Promise<string[]>;
}
