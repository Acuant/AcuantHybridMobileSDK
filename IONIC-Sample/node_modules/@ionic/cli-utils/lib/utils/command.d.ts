import * as dargs from 'dargs';
import * as minimistType from 'minimist';
import { CommandData, CommandLineOptions, CommandOption } from '../../definitions';
export interface MinimistOptionsToArrayOptions extends dargs.Opts {
    useDoubleQuotes?: boolean;
}
export declare function minimistOptionsToArray(options: CommandLineOptions, fnOptions?: MinimistOptionsToArrayOptions): string[];
export declare function metadataToMinimistOptions(metadata: CommandData): minimistType.Opts;
export interface CmdOptsSchema {
    envvar: string;
    option: CommandOption;
}
export declare function metadataToEnvCmdOptsSchema(metadata: CommandData): CmdOptsSchema[];
/**
 * Filter command line options that match a given "intent", which are specified
 * in the command's metadata.
 *
 * To filter options that have no intent specified in the command's metadata,
 * exclude the intentName parameter.
 *
 * @param metadata
 * @param options The options to filter.
 * @param indentName
 *
 * @return The filtered options.
 */
export declare function filterOptionsByIntent(metadata: CommandData, options: CommandLineOptions, intentName?: string): CommandLineOptions;
