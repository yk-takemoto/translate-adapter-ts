import { TranslateId, TranslateAdapterInputParams, TranslateTextArgs } from "./translate_adapter_schemas";
type TranslateAdapterHelperParams = {
    translateId: TranslateId;
    buildClientInputParams?: TranslateAdapterInputParams<any, Record<string, any>>;
};
declare const translateAdapterHelper: (helperParams: TranslateAdapterHelperParams) => {
    translateText: (params: TranslateAdapterInputParams<TranslateTextArgs>) => Promise<string>;
};
export default translateAdapterHelper;
