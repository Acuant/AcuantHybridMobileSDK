import { IonicEnvironment } from '../../definitions';
import { Ailment } from './ailments';
export declare class AilmentRegistry {
    protected _ailments: Ailment[];
    register(ailment: Ailment): void;
    readonly ailments: Ailment[];
    get(id: string): Ailment | undefined;
}
export declare const registry: AilmentRegistry;
export declare function treatAilments(env: IonicEnvironment): Promise<void>;
export declare function detectAndTreatAilment(env: IonicEnvironment, ailment: Ailment): Promise<void>;
