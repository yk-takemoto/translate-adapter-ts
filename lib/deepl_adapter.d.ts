import { TranslateAdapter } from "./translate_adapter";
export declare class DeeplAdapter implements TranslateAdapter {
    private translateConfig;
    private translator;
    constructor(translateConfig?: {
        apiKey: any;
    });
    private initCheck;
    translateText(sourceText: string, targetLang: string, sourceLang?: string, delimiter?: string): Promise<string>;
}
