import { AppDetails, IApp, IClient, IPaginator, Response } from '../definitions';
export declare class App implements IApp {
    token: string;
    protected client: IClient;
    constructor(token: string, client: IClient);
    load(app_id: string): Promise<AppDetails>;
    paginate(): Promise<IPaginator<Response<AppDetails[]>>>;
    create({name}: {
        name: string;
    }): Promise<AppDetails>;
}
