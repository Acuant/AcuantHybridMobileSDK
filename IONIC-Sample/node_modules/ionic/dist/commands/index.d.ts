import { IRootNamespace, IonicEnvironment } from '@ionic/cli-utils';
import { CommandMap, Namespace, NamespaceMap } from '@ionic/cli-utils/lib/namespace';
export declare class IonicNamespace extends Namespace implements IRootNamespace {
    readonly root: boolean;
    readonly name: string;
    readonly description: string;
    readonly longDescription: string;
    namespaces: NamespaceMap;
    commands: CommandMap;
    runCommand(env: IonicEnvironment, pargv: string[], opts?: {
        root?: boolean;
    }): Promise<void>;
}
