import { z } from "zod";
import { TranslateAdapterBuilder } from "./translate_adapter_schemas";
declare const deeplClientBuilderArgsSchema: z.ZodObject<{
    apiKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
}, {
    apiKey: string;
}>;
export type DeeplClientBuilderArgs = z.infer<typeof deeplClientBuilderArgsSchema>;
export declare const deeplAdapterBuilder: TranslateAdapterBuilder<DeeplClientBuilderArgs>;
export {};
