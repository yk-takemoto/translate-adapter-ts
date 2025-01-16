import * as deepl from 'deepl-node';

class DeeplAdapter {
    constructor(translateConfig = {
        apiKey: JSON.parse(process.env.APP_SECRETS || "{}").DEEPL_API_KEY || process.env.DEEPL_API_KEY || "",
    }) {
        this.translateConfig = translateConfig;
        this.initCheck(translateConfig);
        this.translator = new deepl.Translator(translateConfig.apiKey);
    }
    initCheck(translateConfig) {
        for (const key of Object.keys(this.translateConfig)) {
            if (!translateConfig[key]) {
                throw new Error(`translateConfig.${key} is required but not set.`);
            }
        }
    }
    async translateText(sourceText, targetLang, sourceLang, delimiter) {
        const transRes = await this.translator.translateText(sourceText, sourceLang ? sourceLang : null, targetLang);
        let resultText = "";
        if (Array.isArray(transRes)) {
            const resTextDelimiter = delimiter || " ";
            resultText = transRes.map((el) => el.text).join(resTextDelimiter);
        }
        else {
            resultText = transRes.text;
        }
        return resultText;
    }
}

const translateAdapterClasses = {
    DeepL: DeeplAdapter,
};
const translateAdapterBuilder = (translateId) => {
    const translateAdapterClass = translateAdapterClasses[translateId];
    return new translateAdapterClass();
};

export { translateAdapterBuilder };
//# sourceMappingURL=bundle.esm.js.map
