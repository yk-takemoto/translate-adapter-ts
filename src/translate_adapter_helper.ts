import { deeplAdapterBuilder } from "@/deepl_adapter";
import { TranslateId, TranslateAdapterInputParams, TranslateAdapterBuilder, TranslateAdapter, TranslateTextArgs } from "@/translate_adapter_schemas";

type TranslateAdapterHelperParams = {
  translateId: TranslateId;
  buildClientInputParams?: TranslateAdapterInputParams<any, Record<string, any>>;
};

const getAdapter = (params: TranslateAdapterHelperParams): TranslateAdapter => {
  const translateAdapterMap: Record<TranslateId, TranslateAdapterBuilder<any>> = {
    DeepL: deeplAdapterBuilder,
  };

  const adapter = translateAdapterMap[params.translateId].build({ buildArgs: params.translateId, buildClientInputParams: params.buildClientInputParams });
  if (!adapter) {
    throw new Error(`[translateAdapterHelper] Adapter for ${params.translateId} is not available.`);
  }

  return adapter;
};

const translateAdapterHelper = (helperParams: TranslateAdapterHelperParams) => ({
  translateText: async (params: TranslateAdapterInputParams<TranslateTextArgs>) => {
    const adapter = getAdapter(helperParams);
    if (!("translateText" in adapter) || !adapter.translateText) {
      throw new Error(`[translateAdapterHelper#translateText] Adapter for ${helperParams.translateId} does not support translateText.`);
    }

    return await adapter.translateText(params);
  },
});

export default translateAdapterHelper;
