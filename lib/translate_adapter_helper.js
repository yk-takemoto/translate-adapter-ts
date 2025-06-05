"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepl_adapter_1 = require("./deepl_adapter");
const getAdapter = (params) => {
    const translateAdapterMap = {
        DeepL: deepl_adapter_1.deeplAdapterBuilder,
    };
    const adapter = translateAdapterMap[params.translateId].build({ buildArgs: params.translateId, buildClientInputParams: params.buildClientInputParams });
    if (!adapter) {
        throw new Error(`[translateAdapterHelper] Adapter for ${params.translateId} is not available.`);
    }
    return adapter;
};
const translateAdapterHelper = (helperParams) => ({
    translateText: async (params) => {
        const adapter = getAdapter(helperParams);
        if (!("translateText" in adapter) || !adapter.translateText) {
            throw new Error(`[translateAdapterHelper#translateText] Adapter for ${helperParams.translateId} does not support translateText.`);
        }
        return await adapter.translateText(params);
    },
});
exports.default = translateAdapterHelper;
