/// <reference types="node" />
import * as dgram from 'dgram';
import * as events from 'events';
export interface Interface {
    address: string;
    broadcast: string;
}
export interface IPublisher {
    emit(event: "error", err: Error): boolean;
    on(event: "error", listener: (err: Error) => void): this;
}
export declare class Publisher extends events.EventEmitter implements IPublisher {
    namespace: string;
    name: string;
    port: number;
    id: string;
    path: string;
    running: boolean;
    interval: number;
    timer?: number;
    client?: dgram.Socket;
    interfaces?: Interface[];
    constructor(namespace: string, name: string, port: number);
    start(): Promise<void>;
    stop(): void;
    buildMessage(ip: string): string;
    getInterfaces(): Interface[];
    private sayHello();
}
export declare function prepareInterfaces(interfaces: any): Interface[];
export declare function newSilentPublisher(namespace: string, name: string, port: number): Publisher;
export declare function computeBroadcastAddress(address: string, netmask: string): string;
