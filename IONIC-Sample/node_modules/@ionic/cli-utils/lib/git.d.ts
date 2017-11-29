import { IonicEnvironment } from '../definitions';
export declare function isRepoInitialized(env: IonicEnvironment): Promise<boolean>;
export declare function initializeRepo(env: IonicEnvironment): Promise<void>;
export declare function getIonicRemote(env: IonicEnvironment): Promise<string | undefined>;
export declare function addIonicRemote(env: IonicEnvironment, url: string): Promise<void>;
export declare function setIonicRemote(env: IonicEnvironment, url: string): Promise<void>;
