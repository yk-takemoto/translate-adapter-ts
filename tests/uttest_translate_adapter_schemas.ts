import { expect } from "chai";
import { translateTextArgsSchema, translateIdSchema, GeneralArgumentsSchema, GeneralResultSchema, GeneralConfigSchema } from "../src/translate_adapter_schemas";

describe("Translate Adapter Schemas Tests", () => {
  describe("translateTextArgsSchema", () => {
    it("有効な文字列sourceTextを許可すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: "Hello world",
        targetLang: "JA",
      });

      expect(result.success).to.be.true;
    });

    it("有効な配列sourceTextを許可すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: ["Hello", "World"],
        targetLang: "JA",
      });

      expect(result.success).to.be.true;
    });

    it("空の文字列sourceTextを拒否すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: "",
        targetLang: "JA",
      });

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.errors[0].message).to.equal("Source text must not be empty");
      }
    });

    it("空の配列sourceTextを拒否すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: [],
        targetLang: "JA",
      });

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.errors[0].message).to.equal("Source text array must not be empty");
      }
    });

    it("空文字列を含む配列sourceTextを拒否すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: ["Hello", ""],
        targetLang: "JA",
      });

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.errors[0].message).to.equal("All strings in source text array must not be empty");
      }
    });

    it("targetLangが必須であること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: "Hello",
      });

      expect(result.success).to.be.false;
    });

    it("空のtargetLangを拒否すること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: "Hello",
        targetLang: "",
      });

      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.errors[0].message).to.equal("Target language must not be empty");
      }
    });

    it("sourceLangはオプションであること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: "Hello",
        targetLang: "JA",
        sourceLang: "EN",
      });

      expect(result.success).to.be.true;
    });

    it("delimiterはオプションであること", () => {
      const result = translateTextArgsSchema.safeParse({
        sourceText: ["Hello", "World"],
        targetLang: "JA",
        delimiter: " ",
      });

      expect(result.success).to.be.true;
    });
  });

  describe("translateIdSchema", () => {
    it("有効な翻訳IDを許可すること", () => {
      const result = translateIdSchema.safeParse("DeepL");
      expect(result.success).to.be.true;
    });

    it("無効な翻訳IDを拒否すること", () => {
      const result = translateIdSchema.safeParse("InvalidTranslator");
      expect(result.success).to.be.false;
    });
  });

  describe("GeneralSchemas", () => {
    it("GeneralArgumentsSchemaは任意のレコードを許可すること", () => {
      const result = GeneralArgumentsSchema.safeParse({
        key1: "value1",
        key2: 123,
        key3: true,
      });

      expect(result.success).to.be.true;
    });

    it("GeneralResultSchemaは様々な型を許可すること", () => {
      // レコード
      expect(GeneralResultSchema.safeParse({ key: "value" }).success).to.be.true;
      // 文字列
      expect(GeneralResultSchema.safeParse("test").success).to.be.true;
      // 数値
      expect(GeneralResultSchema.safeParse(123).success).to.be.true;
      // 真偽値
      expect(GeneralResultSchema.safeParse(true).success).to.be.true;
      // 配列
      expect(GeneralResultSchema.safeParse([1, 2, 3]).success).to.be.true;
    });

    it("GeneralConfigSchemaは任意のレコードを許可すること", () => {
      const result = GeneralConfigSchema.safeParse({
        setting1: "value1",
        setting2: 123,
      });

      expect(result.success).to.be.true;
    });
  });
});
