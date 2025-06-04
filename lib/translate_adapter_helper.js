"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepl_adapter_1 = require("./deepl_adapter");
const getAdapter = (translateId) => {
    const translateAdapterMap = {
        DeepL: deepl_adapter_1.deeplAdapterBuilder,
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
exports.default = translateAdapterHelper;
