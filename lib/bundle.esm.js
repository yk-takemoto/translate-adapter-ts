import * as deepl from 'deepl-node';
import { z } from 'zod';

z.record(z.any());
z.union([z.record(z.any()), z.string(), z.number(), z.boolean(), z.array(z.any())]);
z.record(z.any());
const translateTextArgsSchema = z.object({
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
z.string();
z.enum(["DeepL"]);

const deeplClientBuilderArgsSchema = z.object({
    apiKey: z.string().min(1, "DEEPL_API_KEY is required"),
});
const deeplClientBuilder = {
    build: ({ args = {
        apiKey: JSON.parse(process.env.APP_SECRETS || "{}").DEEPL_API_KEY || process.env.DEEPL_API_KEY,
    }, argsSchema = deeplClientBuilderArgsSchema, } = {}) => {
        const { apiKey } = argsSchema.parse(args || {});
        return new deepl.Translator(apiKey);
    },
};
const deeplAdapterBuilder = {
    build: ({ buildClientInputParams } = {}) => ({
        translateText: async ({ args, argsSchema = translateTextArgsSchema } = {}) => {
            const { sourceText, targetLang, sourceLang, delimiter } = argsSchema.parse(args || {});
            const translator = deeplClientBuilder.build(buildClientInputParams || {});
            const transRes = await translator.translateText(sourceText, sourceLang ? sourceLang : null, targetLang);
            let resultText = "";
            if (Array.isArray(transRes)) {
                const resTextDelimiter = delimiter || " ";
                resultText = transRes.map((el) => el.text).join(resTextDelimiter);
            }
            else {
                resultText = transRes.text;
            }
            return resultText;
        },
    }),
};

const getAdapter = (translateId) => {
    const translateAdapterMap = {
        DeepL: deeplAdapterBuilder,
    };
    const adapter = "build" in translateAdapterMap[translateId] ? translateAdapterMap[translateId].build({ buildArgs: translateId }) : translateAdapterMap[translateId];
    if (!adapter) {
        throw new Error(`[translateAdapterHelper] Adapter for ${translateId} is not available.`);
    }
    return adapter;
};
const translateAdapterHelper = (params) => ({
    translateText: async (args) => {
        const adapter = getAdapter(params.translateId);
        if (!("translateText" in adapter) || !adapter.translateText) {
            throw new Error(`[translateAdapterHelper#translateText] Adapter for ${params.translateId} does not support translateText.`);
        }
        return await adapter.translateText({ args });
    },
});

export { translateAdapterHelper };
//# sourceMappingURL=bundle.esm.js.map
