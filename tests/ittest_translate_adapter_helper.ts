import { expect } from "chai";
import * as dotenv from "dotenv";
import translateAdapterHelper from "../src/translate_adapter_helper";

// テスト環境変数をロード
dotenv.config({ path: ".env.test" });

// APIキーが設定されているか確認
function checkEnvVars(envVars: string[]) {
  const missingVars = envVars.filter((name) => !process.env[name]);
  if (missingVars.length > 0) {
    console.warn(`⚠️ 以下の環境変数が設定されていないため、一部のテストはスキップされます: ${missingVars.join(", ")}`);
    return false;
  }
  return true;
}

describe("TranslateAdapterHelper 統合テスト", function () {
  // API呼び出しを伴うため、タイムアウトを長めに設定
  this.timeout(10000);

  describe("DeepL アダプター経由のテスト", () => {
    const deeplVars = ["DEEPL_API_KEY"];
    const hasDeeplEnv = checkEnvVars(deeplVars);

    it("translateText が正しく実行されること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });
      const result = await helper.translateText({
        sourceText: "Hello, this is a test for the translate adapter helper.",
        targetLang: "JA",
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      console.log(`DeepL translateText 結果: ${result}`);
    });

    it("ソース言語を指定した翻訳が正しく実行されること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });
      const result = await helper.translateText({
        sourceText: "こんにちは、これは翻訳アダプターヘルパーのテストです。",
        sourceLang: "JA",
        targetLang: "EN-US",
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.toLowerCase()).to.satisfy((text: string) => {
        return text.includes("hello") || text.includes("hi");
      });
      console.log(`DeepL translateText (日本語→英語) 結果: ${result}`);
    });

    it("複数の段落を含む長文の翻訳が正しく実行されること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });
      const longText = `
        Machine translation has evolved significantly over the years.
        From rule-based systems to statistical methods, and now to neural machine translation.
        Modern translation services like DeepL use deep learning to understand context and nuance.
        This has greatly improved the quality of automated translations.
      `;
      const result = await helper.translateText({
        sourceText: longText,
        targetLang: "JA",
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      console.log(`DeepL 長文翻訳結果:\n${result}`);
    });

    it("異なる言語の組み合わせでの翻訳が正しく実行されること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });

      // 英語からドイツ語
      const germanResult = await helper.translateText({
        sourceText: "Artificial Intelligence is transforming the world.",
        targetLang: "DE",
      });

      expect(germanResult).to.be.a("string").and.to.not.be.empty;
      console.log(`英語→ドイツ語: ${germanResult}`);

      // ドイツ語からフランス語
      const frenchResult = await helper.translateText({
        sourceText: germanResult,
        sourceLang: "DE",
        targetLang: "FR",
      });

      expect(frenchResult).to.be.a("string").and.to.not.be.empty;
      console.log(`ドイツ語→フランス語: ${frenchResult}`);

      // フランス語から日本語
      const japaneseResult = await helper.translateText({
        sourceText: frenchResult,
        sourceLang: "FR",
        targetLang: "JA",
      });

      expect(japaneseResult).to.be.a("string").and.to.not.be.empty;
      console.log(`フランス語→日本語: ${japaneseResult}`);
    });

    it("区切り文字を指定した配列テキストの翻訳が正しく実行されること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });
      const result = await helper.translateText({
        sourceText: ["First sentence", "Second sentence", "Third sentence"],
        targetLang: "JA",
        delimiter: " | ",
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.split(" | ")).to.have.lengthOf(3);
      console.log(`DeepL 配列翻訳結果: ${result}`);
    });

    it("エラー処理: 無効なパラメータでエラーが発生すること", async function () {
      if (!hasDeeplEnv) this.skip();

      const helper = translateAdapterHelper({ translateId: "DeepL" });

      try {
        await helper.translateText({
          sourceText: "", // 空の文字列
          targetLang: "JA",
        });
        expect.fail("エラーが発生しませんでした");
      } catch (error: any) {
        expect(error).to.exist;
        console.log(`期待されたエラー: ${error.message}`);
      }
    });
  });
});
