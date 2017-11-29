/// <reference types="node" />
import { IConfig } from '../../definitions';
export declare function s3SignedUpload(config: IConfig, presignedPostParams: {
    url: string;
    fields: Object;
}, zip: NodeJS.ReadableStream, {progress}: {
    progress?: (loaded: number, total: number) => void;
}): Promise<void>;
