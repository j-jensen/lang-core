export declare const templateRe: RegExp;
export declare const templatePattern: string;
export declare const typedRe: RegExp;

interface JsonObject {
  [key: string]: string;
}
export declare function filenameToInterfaceName(filename: string): string;

export declare function getPropertyTypesignature(str: string): string;
export declare function getPropertyStringifiedValue(str: string, orig: string): string;

export declare function langModuleToTypescriptInterfaceProperties(mod: JsonObject, indent: string): string;

export declare function compileExport(module: JsonObject, ref: JsonObject): string;

export declare function filenameToTypingsFilename(filename: string): string;
export declare function filenameToLocalizedFilename(filename: string, lang: string): string;
export declare function generateGenericExportInterface(module: JsonObject, filename: string, indent: string): string;
