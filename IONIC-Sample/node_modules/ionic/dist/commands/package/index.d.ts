import { CommandMap, Namespace } from '@ionic/cli-utils/lib/namespace';
export declare class PackageNamespace extends Namespace {
    name: string;
    description: string;
    deprecated: boolean;
    longDescription: string;
    commands: CommandMap;
}
