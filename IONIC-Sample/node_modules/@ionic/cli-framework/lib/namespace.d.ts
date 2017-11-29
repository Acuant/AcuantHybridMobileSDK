import { CommandMapGetter, HydratedCommandData, ICommand, INamespace, NamespaceMapGetter } from '../definitions';
export declare class CommandMap<T extends ICommand> extends Map<string, string | CommandMapGetter<T>> {
    getAliases(): Map<string, string[]>;
    resolveAliases(cmdName: string): undefined | CommandMapGetter<T>;
}
export declare class NamespaceMap<T extends ICommand> extends Map<string, NamespaceMapGetter<T>> {
}
export declare class Namespace<T extends ICommand> implements INamespace<T> {
    root: boolean;
    name: string;
    description: string;
    longDescription: string;
    namespaces: NamespaceMap<T>;
    commands: CommandMap<T>;
    /**
     * Recursively inspect inputs supplied to walk down all the tree of
     * namespaces available to find the command that we will execute or the
     * right-most namespace matched if the command is not found.
     */
    locate(argv: string[]): Promise<[number, string[], T | INamespace<T>]>;
    /**
     * Get all command metadata in a flat structure.
     */
    getCommandMetadataList(): Promise<(T['metadata'] & HydratedCommandData<T>)[]>;
}
