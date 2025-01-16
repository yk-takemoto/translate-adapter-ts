"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepl_adapter_1 = require("./deepl_adapter");
const translateAdapterClasses = {
    DeepL: deepl_adapter_1.DeeplAdapter,
};
const translateAdapterBuilder = (translateId) => {
    const translateAdapterClass = translateAdapterClasses[translateId];
    return new translateAdapterClass();
};
exports.default = translateAdapterBuilder;
