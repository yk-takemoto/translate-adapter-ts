import { z } from "zod";

export const GeneralArgumentsSchema = z.record(z.any());
type GeneralArguments = z.infer<typeof GeneralArgumentsSchema>;
export const GeneralResultSchema = z.union([z.record(z.any()), z.string(), z.number(), z.boolean(), z.array(z.any())]);
type GeneralResult = z.infer<typeof GeneralResultSchema>;
export const GeneralConfigSchema = z.record(z.any());
type GeneralConfig = z.infer<typeof GeneralConfigSchema>;

export type TranslateAdapterInputParams<ArgumentsType = GeneralArguments, ConfigType = GeneralConfig> = {
  args?: ArgumentsType;
  argsSchema?: z.ZodType<ArgumentsType>;
  config?: ConfigType;
  configSchema?: z.ZodType<ConfigType>;
};

export type TranslateAdapterBuilderInputParams<ClientBuildArgsType = GeneralArguments, AdapterBuildArgsType = GeneralArguments> = {
  buildArgs?: AdapterBuildArgsType;
  buildArgsSchema?: z.ZodType<AdapterBuildArgsType>;
  buildClientInputParams?: TranslateAdapterInputParams<ClientBuildArgsType>;
};

// type TranslateAdaterResult<ResultType = GeneralResult> = ResultType | undefined;
type TranslateAdapterResult<ResultType = GeneralResult> = ResultType;

export type TranslateAdapterFunction<InputParamsType = TranslateAdapterInputParams, ResultType = GeneralResult> = (
  params?: InputParamsType,
) => TranslateAdapterResult<ResultType>;

export type TranslateAdapterAsyncFunction<InputParamsType = TranslateAdapterInputParams, ResultType = GeneralResult> = (
  params?: InputParamsType,
) => Promise<TranslateAdapterResult<ResultType>>;

export const translateTextArgsSchema = z.object({
  sourceText: z.union([
    z.string().min(1, "Source text must not be empty"),
    z
      .array(z.string())
      .min(1, "Source text array must not be empty")
      .refine((arr) => arr.every((item) => item.length > 0), "All strings in source text array must not be empty"),
  ]),
  targetLang: z.string().min(1, "Target language must not be empty"),
  sourceLang: z.string().optional(),
  delimiter: z.string().optional(),
});
export type TranslateTextArgs = z.infer<typeof translateTextArgsSchema>;

export const translateTextResultSchema = z.string();
export type TranslateTextResult = z.infer<typeof translateTextResultSchema>;

export type TranslateTextAdapter = {
  translateText: TranslateAdapterAsyncFunction<TranslateAdapterInputParams<TranslateTextArgs>, TranslateTextResult>;
};

export type TranslateAdapter = TranslateTextAdapter;

export const translateIdSchema = z.enum(["DeepL"]);
export type TranslateId = z.infer<typeof translateIdSchema>;

export type TranslateAdapterBuilder<ClientBuildArgsType = GeneralArguments, AdapterBuildArgsType = TranslateId, ResultType = TranslateAdapter> = {
  build: TranslateAdapterFunction<TranslateAdapterBuilderInputParams<ClientBuildArgsType, AdapterBuildArgsType>, ResultType>;
};

export type TranslateClientBuilder<ClientBuildArgsType = GeneralArguments, ResultType = GeneralResult> = {
  build: TranslateAdapterFunction<TranslateAdapterInputParams<ClientBuildArgsType>, ResultType>;
};
