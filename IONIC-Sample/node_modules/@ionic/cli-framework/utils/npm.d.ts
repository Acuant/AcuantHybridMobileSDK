import { BowerJson, PackageJson } from '../definitions';
export declare const ERROR_INVALID_PACKAGE_JSON = "INVALID_PACKAGE_JSON";
export declare const ERROR_INVALID_BOWER_JSON = "INVALID_BOWER_JSON";
/**
 * Lightweight version of https://github.com/npm/validate-npm-package-name
 */
export declare function isValidPackageName(name: string): boolean;
export declare function readPackageJsonFile(path: string): Promise<PackageJson>;
export declare function readBowerJsonFile(path: string): Promise<BowerJson>;
