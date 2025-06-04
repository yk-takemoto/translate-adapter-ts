"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateIdSchema = exports.translateTextResultSchema = exports.translateTextArgsSchema = exports.GeneralConfigSchema = exports.GeneralResultSchema = exports.GeneralArgumentsSchema = void 0;
const zod_1 = require("zod");
exports.GeneralArgumentsSchema = zod_1.z.record(zod_1.z.any());
exports.GeneralResultSchema = zod_1.z.union([zod_1.z.record(zod_1.z.any()), zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.array(zod_1.z.any())]);
exports.GeneralConfigSchema = zod_1.z.record(zod_1.z.any());
exports.translateTextArgsSchema = zod_1.z.object({
    sourceText: zod_1.z.union([
        zod_1.z.string().min(1, "Source text must not be empty"),
        zod_1.z
            .array(zod_1.z.string())
            .min(1, "Source text array must not be empty")
            .refine((arr) => arr.every((item) => item.length > 0), "All strings in source text array must not be empty"),
    ]),
    targetLang: zod_1.z.string().min(1, "Target language must not be empty"),
    sourceLang: zod_1.z.string().optional(),
    delimiter: zod_1.z.string().optional(),
});
exports.translateTextResultSchema = zod_1.z.string();
exports.translateIdSchema = zod_1.z.enum(["DeepL"]);
