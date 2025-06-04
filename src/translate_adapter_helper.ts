import { DeeplClientBuilderArgs, deeplAdapterBuilder } from "@/deepl_adapter";
import { TranslateId, TranslateAdapterBuilder, TranslateAdapter, TranslateTextArgs } from "@/translate_adapter_schemas";

const getAdapter = (translateId: TranslateId): TranslateAdapter => {
  const translateAdapterMap: Record<TranslateId, TranslateAdapterBuilder<DeeplClientBuilderArgs> | TranslateAdapter> = {
    DeepL: deeplAdapterBuilder,
  };

  const adapter =
    "build" in translateAdapterMap[translateId] ? translateAdapterMap[translateId].build({ buildArgs: translateId }) : translateAdapterMap[translateId];
  if (!adapter) {
    throw new Error(`[translateAdapterHelper] Adapter for ${translateId} is not available.`);
  }

  return adapter;
};

const translateAdapterHelper = (params: { translateId: TranslateId }) => ({
  translateText: async (args: TranslateTextArgs) => {
    const adapter = getAdapter(params.translateId);
    if (!("translateText" in adapter) || !adapter.translateText) {
      throw new Error(`[translateAdapterHelper#translateText] Adapter for ${params.translateId} does not support translateText.`);
    }

    return await adapter.translateText({ args });
  },
});

export default translateAdapterHelper;
