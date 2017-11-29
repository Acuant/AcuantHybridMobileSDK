/// <reference types="node" />
import * as superagentType from 'superagent';
import { APIResponse, APIResponseError, APIResponseSuccess, HttpMethod, IClient, IConfig, IPaginator, Response, SuperAgentError } from '../definitions';
import { FatalException } from './errors';
export declare const CONTENT_TYPE_JSON = "application/json";
export declare const ERROR_UNKNOWN_CONTENT_TYPE = "UNKNOWN_CONTENT_TYPE";
export declare const ERROR_UNKNOWN_RESPONSE_FORMAT = "UNKNOWN_RESPONSE_FORMAT";
export declare function createRawRequest(method: string, url: string): Promise<{
    req: superagentType.SuperAgentRequest;
}>;
export declare function createRequest(config: IConfig, method: string, url: string): Promise<{
    req: superagentType.SuperAgentRequest;
}>;
export declare function download(config: IConfig, url: string, ws: NodeJS.WritableStream, opts?: {
    progress?: (loaded: number, total: number) => void;
}): Promise<void>;
export declare class Client implements IClient {
    config: IConfig;
    constructor(config: IConfig);
    make(method: HttpMethod, path: string): Promise<{
        req: superagentType.SuperAgentRequest;
    }>;
    do(req: superagentType.SuperAgentRequest): Promise<APIResponseSuccess>;
    paginate<T extends Response<Object[]>>(reqgen: () => Promise<{
        req: superagentType.SuperAgentRequest;
    }>, guard: (res: APIResponseSuccess) => res is T): Promise<Paginator<T>>;
}
export declare class Paginator<T extends Response<Object[]>> implements IPaginator<T> {
    protected client: IClient;
    protected reqgen: () => Promise<{
        req: superagentType.SuperAgentRequest;
    }>;
    protected guard: (res: APIResponseSuccess) => res is T;
    protected state?: {
        page: number;
        pageSize: number;
    };
    protected done: boolean;
    constructor(client: IClient, reqgen: () => Promise<{
        req: superagentType.SuperAgentRequest;
    }>, guard: (res: APIResponseSuccess) => res is T);
    next(): IteratorResult<Promise<T>>;
    [Symbol.iterator](): this;
}
export declare function transformAPIResponse(r: superagentType.Response): APIResponse;
export declare function createFatalAPIFormat(req: superagentType.SuperAgentRequest, res: APIResponse): FatalException;
export declare function formatSuperAgentError(e: SuperAgentError): string;
export declare function formatAPIResponse(req: superagentType.SuperAgentRequest, r: APIResponse): string;
export declare function formatAPISuccess(req: superagentType.SuperAgentRequest, r: APIResponseSuccess): string;
export declare function formatAPIError(req: superagentType.SuperAgentRequest, r: APIResponseError): string;
