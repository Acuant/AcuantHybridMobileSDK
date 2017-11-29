import { IonicEnvironment, NetworkInterface, ServeOptions } from '../definitions';
export declare const DEFAULT_DEV_LOGGER_PORT = 53703;
export declare const DEFAULT_LIVERELOAD_PORT = 35729;
export declare const DEFAULT_SERVER_PORT = 8100;
export declare const IONIC_LAB_URL = "/ionic-lab";
export declare const BIND_ALL_ADDRESS = "0.0.0.0";
export declare const LOCAL_ADDRESSES: string[];
export declare const BROWSERS: string[];
export declare function selectExternalIP(env: IonicEnvironment, options: ServeOptions): Promise<[string, NetworkInterface[]]>;
export interface DevAppDetails {
    channel?: string;
    port?: number;
    interfaces: {
        address: string;
        broadcast: string;
    }[];
}
export declare function gatherDevAppDetails(env: IonicEnvironment, options: ServeOptions): Promise<DevAppDetails | undefined>;
export declare function publishDevApp(env: IonicEnvironment, options: ServeOptions, details: DevAppDetails & {
    port: number;
}): Promise<string | undefined>;
