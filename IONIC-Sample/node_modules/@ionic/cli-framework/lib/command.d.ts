import { CommandData, CommandLineInputs, CommandLineOptions } from '../definitions';
export declare abstract class Command<T extends CommandData> {
    readonly metadata: T;
    validate(inputs: CommandLineInputs): Promise<void>;
    abstract run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
export declare function validateInputs(argv: string[], metadata: CommandData): void;
