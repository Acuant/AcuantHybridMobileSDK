import { IProject, ITelemetry, IonicEnvironment } from '../definitions';
export declare class Telemetry implements ITelemetry {
    env: IonicEnvironment;
    resetToken(): Promise<void>;
    sendCommand(command: string, args: string[]): Promise<void>;
}
export declare function sendCommand(env: IonicEnvironment, project: IProject, command: string, args: string[]): Promise<void>;
