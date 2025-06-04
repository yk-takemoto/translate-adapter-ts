import { TranslateId, TranslateTextArgs } from "./translate_adapter_schemas";
declare const translateAdapterHelper: (params: {
    translateId: TranslateId;
}) => {
    translateText: (args: TranslateTextArgs) => Promise<string>;
};
export default translateAdapterHelper;
