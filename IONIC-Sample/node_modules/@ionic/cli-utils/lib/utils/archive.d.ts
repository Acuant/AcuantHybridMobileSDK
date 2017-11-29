/// <reference types="node" />
import * as archiverType from 'archiver';
import * as tarType from 'tar';
export declare type TarExtractOptions = tarType.ExtractOptions & tarType.FileOptions;
export declare function createArchive(format: 'zip' | 'tar'): Promise<archiverType.Archiver>;
export declare function createTarExtraction(opts?: TarExtractOptions): Promise<NodeJS.WritableStream>;
