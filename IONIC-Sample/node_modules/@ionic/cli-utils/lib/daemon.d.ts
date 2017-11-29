import * as expressType from 'express';
import { DaemonFile, DistTag, IonicEnvironment } from '../definitions';
import { BaseConfig } from './config';
export declare const DAEMON_PID_FILE = "daemon.pid";
export declare const DAEMON_PORT_FILE = "daemon.port";
export declare const DAEMON_JSON_FILE = "daemon.json";
export declare const DAEMON_LOG_FILE = "daemon.log";
export declare class Daemon extends BaseConfig<DaemonFile> {
    readonly pidFilePath: string;
    readonly portFilePath: string;
    readonly logFilePath: string;
    getPid(): Promise<number | undefined>;
    setPid(pid: number): Promise<void>;
    getPort(): Promise<number | undefined>;
    setPort(port: number): Promise<void>;
    provideDefaults(o: any): Promise<DaemonFile>;
    populateDistTag(distTag: DistTag): void;
    is(j: any): j is DaemonFile;
}
export declare function processRunning(pid: number): boolean;
export declare function checkForDaemon(env: IonicEnvironment): Promise<number>;
export declare function createCommServer(env: IonicEnvironment): Promise<expressType.Application>;
