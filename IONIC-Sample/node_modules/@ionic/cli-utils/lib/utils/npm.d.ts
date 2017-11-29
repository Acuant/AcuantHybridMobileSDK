import { DistTag, IShellRunOptions, IonicEnvironment } from '../../definitions';
import { PackageJson } from '@ionic/cli-framework';
/**
 * To be used with a module path resolved from require.resolve().
 */
export declare function readPackageJsonFileOfResolvedModule(resolvedModule: string): Promise<PackageJson>;
export interface PkgManagerOptions extends IShellRunOptions {
    command?: 'dedupe' | 'rebuild' | 'install' | 'uninstall';
    pkg?: string;
    global?: boolean;
    link?: boolean;
    save?: boolean;
    saveDev?: boolean;
    saveExact?: boolean;
}
/**
 * Resolves pkg manager intent with command args.
 *
 * @return Promise<args> If the args is an empty array, it means the pkg manager doesn't have that command.
 */
export declare function pkgManagerArgs(env: IonicEnvironment, options?: PkgManagerOptions): Promise<string[]>;
export declare function pkgLatestVersion(env: IonicEnvironment, pkg: string, distTag?: DistTag): Promise<string | undefined>;
