import { CommandData, CommandLineInputs, CommandLineOptions, IonicEnvironment } from '../../definitions';
export declare const CORDOVA_INTENT = "cordova";
/**
 * Filter and gather arguments from command line to be passed to Cordova
 */
export declare function filterArgumentsForCordova(metadata: CommandData, inputs: CommandLineInputs, options: CommandLineOptions): string[];
/**
 * Start the app scripts server for emulator or device
 */
export declare function generateBuildOptions(metadata: CommandData, options: CommandLineOptions): CommandLineOptions;
export declare function getCordovaCLIVersion(env: IonicEnvironment): Promise<string | undefined>;
export declare function getCordovaPlatformVersions(env: IonicEnvironment): Promise<string | undefined>;
export declare function checkCordova(env: IonicEnvironment): Promise<void>;
