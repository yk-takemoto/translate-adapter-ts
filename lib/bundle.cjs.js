"use strict";function e(e){var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var t=e(require("deepl-node"));const r={DeepL:class{constructor(e={apiKey:JSON.parse(process.env.APP_SECRETS||"{}").DEEPL_API_KEY||process.env.DEEPL_API_KEY||""}){this.translateConfig=e,this.initCheck(e),this.translator=new t.Translator(e.apiKey)}initCheck(e){for(const t of Object.keys(this.translateConfig))if(!e[t])throw new Error(`translateConfig.${t} is required but not set.`)}async translateText(e,t,r,n){const a=await this.translator.translateText(e,r||null,t);let s="";if(Array.isArray(a)){const e=n||" ";s=a.map((e=>e.text)).join(e)}else s=a.text;return s}}};exports.translateAdapterBuilder=e=>new(0,r[e]);
//# sourceMappingURL=bundle.cjs.js.map