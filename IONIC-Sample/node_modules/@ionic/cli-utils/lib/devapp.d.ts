import { IonicEnvironment } from '../definitions';
import { Publisher as BasePublisher } from '@ionic/discover';
export { computeBroadcastAddress } from '@ionic/discover';
export declare class Publisher extends BasePublisher {
    getInterfaces(): never[];
}
export declare function createPublisher(env: IonicEnvironment, port: number): Promise<Publisher>;
