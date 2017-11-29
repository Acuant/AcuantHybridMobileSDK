import { IonicEnvironment } from '../../definitions';
export interface TreatmentStep {
    name: string;
}
export interface AutomaticTreatmentStep extends TreatmentStep {
    treat(): Promise<void>;
}
export declare abstract class Ailment {
    requiresAuthentication: boolean;
    abstract id: string;
    abstract getMessage(env: IonicEnvironment): Promise<string>;
    abstract getTreatmentSteps(env: IonicEnvironment): Promise<TreatmentStep[]>;
    abstract detected(env: IonicEnvironment): Promise<boolean>;
}
export declare abstract class AutomaticallyTreatableAilment extends Ailment {
    abstract getTreatmentSteps(env: IonicEnvironment): Promise<AutomaticTreatmentStep[]>;
}
export declare namespace Ailments {
    class AutomaticUpdatesOff extends AutomaticallyTreatableAilment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class NpmInstalledLocally extends AutomaticallyTreatableAilment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class IonicCLIInstalledLocally extends AutomaticallyTreatableAilment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class GitNotUsed extends Ailment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class GitConfigInvalid extends AutomaticallyTreatableAilment {
        id: string;
        requiresAuthentication: boolean;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class IonicAngularUpdateAvailable extends Ailment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class IonicAngularMajorUpdateAvailable extends Ailment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class AppScriptsUpdateAvailable extends AutomaticallyTreatableAilment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class AppScriptsMajorUpdateAvailable extends Ailment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class IonicNativeUpdateAvailable extends AutomaticallyTreatableAilment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class IonicNativeMajorUpdateAvailable extends Ailment {
        id: string;
        currentVersion?: string;
        latestVersion?: string;
        getVersionPair(env: IonicEnvironment): Promise<[string, string]>;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class IonicNativeOldVersionInstalled extends Ailment {
        id: string;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class UnsavedCordovaPlatforms extends AutomaticallyTreatableAilment {
        id: string;
        getMessage(env: IonicEnvironment): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
            treat: () => Promise<void>;
        }[]>;
    }
    class DefaultCordovaBundleIdUsed extends Ailment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(): Promise<{
            name: string;
        }[]>;
    }
    class ViewportFitNotSet extends Ailment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<{
            name: string;
        }[]>;
    }
    class CordovaPlatformsCommitted extends Ailment {
        id: string;
        getMessage(): Promise<string>;
        detected(env: IonicEnvironment): Promise<boolean>;
        getTreatmentSteps(env: IonicEnvironment): Promise<never[]>;
    }
    const ALL: (typeof IonicNativeOldVersionInstalled)[];
}
