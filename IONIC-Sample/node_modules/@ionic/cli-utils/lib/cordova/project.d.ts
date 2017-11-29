import { IonicEnvironment } from '../../definitions';
export declare function getPlatforms(projectDir: string): Promise<string[]>;
export declare function installPlatform(env: IonicEnvironment, platform: string): Promise<void>;
