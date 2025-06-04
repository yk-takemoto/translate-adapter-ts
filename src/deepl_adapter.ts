import * as deepl from "deepl-node";
import { z } from "zod";
import { TranslateClientBuilder, TranslateAdapterBuilder, translateTextArgsSchema } from "@/translate_adapter_schemas";

const deeplClientBuilderArgsSchema = z.object({
  apiKey: z.string().min(1, "DEEPL_API_KEY is required"),
});
export type DeeplClientBuilderArgs = z.infer<typeof deeplClientBuilderArgsSchema>;

const deeplClientBuilder: TranslateClientBuilder<DeeplClientBuilderArgs, deepl.Translator> = {
  build: ({
    args = {
      apiKey: JSON.parse(process.env.APP_SECRETS || "{}").DEEPL_API_KEY || process.env.DEEPL_API_KEY,
    },
    argsSchema = deeplClientBuilderArgsSchema,
  } = {}) => {
    const { apiKey } = argsSchema.parse(args || {});
    return new deepl.Translator(apiKey);
  },
};

export const deeplAdapterBuilder: TranslateAdapterBuilder<DeeplClientBuilderArgs> = {
  build: ({ buildClientInputParams } = {}) => ({
    translateText: async ({ args, argsSchema = translateTextArgsSchema } = {}) => {
      const { sourceText, targetLang, sourceLang, delimiter } = argsSchema.parse(args || {});
      const translator = deeplClientBuilder.build(buildClientInputParams || {});
      const transRes = await translator.translateText(
        sourceText,
        sourceLang ? (sourceLang as deepl.SourceLanguageCode) : null,
        targetLang as deepl.TargetLanguageCode,
      );

      let resultText: string = "";
      if (Array.isArray(transRes)) {
        const resTextDelimiter = delimiter || " ";
        resultText = transRes.map((el) => el.text).join(resTextDelimiter);
      } else {
        resultText = transRes.text;
      }
      return resultText;
    },
  }),
};
