import { z } from "zod";
export declare const GeneralArgumentsSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
type GeneralArguments = z.infer<typeof GeneralArgumentsSchema>;
export declare const GeneralResultSchema: z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodAny>, z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodAny, "many">]>;
type GeneralResult = z.infer<typeof GeneralResultSchema>;
export declare const GeneralConfigSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
type GeneralConfig = z.infer<typeof GeneralConfigSchema>;
type TranslateAdapterInputParams<ArgumentsType = GeneralArguments, ConfigType = GeneralConfig> = {
    args?: ArgumentsType;
    argsSchema?: z.ZodType<ArgumentsType>;
    config?: ConfigType;
    configSchema?: z.ZodType<ConfigType>;
};
type TranslateAdapterBuilderInputParams<ClientBuildArgsType = GeneralArguments, AdapterBuildArgsType = GeneralArguments> = {
    buildArgs?: AdapterBuildArgsType;
    buildArgsSchema?: z.ZodType<AdapterBuildArgsType>;
    buildClientInputParams?: TranslateAdapterInputParams<ClientBuildArgsType>;
};
type TranslateAdapterResult<ResultType = GeneralResult> = ResultType;
export type TranslateAdapterFunction<InputParamsType = TranslateAdapterInputParams, ResultType = GeneralResult> = (params?: InputParamsType) => TranslateAdapterResult<ResultType>;
export type TranslateAdapterAsyncFunction<InputParamsType = TranslateAdapterInputParams, ResultType = GeneralResult> = (params?: InputParamsType) => Promise<TranslateAdapterResult<ResultType>>;
export declare const translateTextArgsSchema: z.ZodObject<{
    sourceText: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>]>;
    targetLang: z.ZodString;
    sourceLang: z.ZodOptional<z.ZodString>;
    delimiter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceText: string | string[];
    targetLang: string;
    sourceLang?: string | undefined;
    delimiter?: string | undefined;
}, {
    sourceText: string | string[];
    targetLang: string;
    sourceLang?: string | undefined;
    delimiter?: string | undefined;
}>;
export type TranslateTextArgs = z.infer<typeof translateTextArgsSchema>;
export declare const translateTextResultSchema: z.ZodString;
export type TranslateTextResult = z.infer<typeof translateTextResultSchema>;
export type TranslateTextAdapter = {
    translateText: TranslateAdapterAsyncFunction<TranslateAdapterInputParams<TranslateTextArgs>, TranslateTextResult>;
};
export type TranslateAdapter = TranslateTextAdapter;
export declare const translateIdSchema: z.ZodEnum<["DeepL"]>;
export type TranslateId = z.infer<typeof translateIdSchema>;
export type TranslateAdapterBuilder<ClientBuildArgsType = GeneralArguments, AdapterBuildArgsType = TranslateId, ResultType = TranslateAdapter> = {
    build: TranslateAdapterFunction<TranslateAdapterBuilderInputParams<ClientBuildArgsType, AdapterBuildArgsType>, ResultType>;
};
export type TranslateClientBuilder<ClientBuildArgsType = GeneralArguments, ResultType = GeneralResult> = {
    build: TranslateAdapterFunction<TranslateAdapterInputParams<ClientBuildArgsType>, ResultType>;
};
export {};
