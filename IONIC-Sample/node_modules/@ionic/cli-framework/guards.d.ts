import { BowerJson, PackageJson, ValidationError } from './definitions';
export declare function isPackageJson(o: Object): o is PackageJson;
export declare function isBowerJson(o: Object): o is BowerJson;
export declare function isValidationErrorArray(e: Object[]): e is ValidationError[];
