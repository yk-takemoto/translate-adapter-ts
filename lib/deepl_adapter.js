"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deeplAdapterBuilder = void 0;
const deepl = __importStar(require("deepl-node"));
const zod_1 = require("zod");
const translate_adapter_schemas_1 = require("./translate_adapter_schemas");
const deeplClientBuilderArgsSchema = zod_1.z.object({
    apiKey: zod_1.z.string().min(1, "DEEPL_API_KEY is required"),
});
const deeplClientBuilder = {
    build: ({ args = {
        apiKey: JSON.parse(process.env.APP_SECRETS || "{}").DEEPL_API_KEY || process.env.DEEPL_API_KEY,
    }, argsSchema = deeplClientBuilderArgsSchema, } = {}) => {
        const { apiKey } = argsSchema.parse(args || {});
        return new deepl.Translator(apiKey);
    },
};
exports.deeplAdapterBuilder = {
    build: ({ buildClientInputParams } = {}) => ({
        translateText: async ({ args, argsSchema = translate_adapter_schemas_1.translateTextArgsSchema } = {}) => {
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
