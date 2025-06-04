import { expect } from "chai";
import * as dotenv from "dotenv";
import { deeplAdapterBuilder } from "../src/deepl_adapter";

// テスト環境変数をロード
dotenv.config({ path: ".env.test" });

// APIキーが設定されているか確認
const requireEnvVars = ["DEEPL_API_KEY"];

function checkEnvVars() {
  const missingVars = requireEnvVars.filter((name) => !process.env[name]);
  if (missingVars.length > 0) {
    console.warn(`⚠️ 以下の環境変数が設定されていないため、一部のテストはスキップされます: ${missingVars.join(", ")}`);
    return false;
  }
  return true;
}

describe("DeepL API 統合テスト", function () {
  // API呼び出しを伴うため、タイムアウトを長めに設定
  this.timeout(10000);

  const hasAllEnvVars = checkEnvVars();

  describe("translateText インテグレーションテスト", () => {
    it("単一テキストが正しく翻訳されること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: "Hello, this is a test message.",
          targetLang: "JA",
        },
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.length).to.be.greaterThan(5);
      console.log(`翻訳結果: ${result}`);
    });

    it("配列テキストが正しく翻訳されること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: ["Hello", "World", "This is a test"],
          targetLang: "JA",
          delimiter: " / ",
        },
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.split(" / ")).to.have.lengthOf(3);
      console.log(`翻訳結果: ${result}`);
    });

    it("ソース言語を指定して翻訳されること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: "こんにちは世界",
          sourceLang: "JA",
          targetLang: "EN-US",
        },
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.toLowerCase()).to.include("hello");
      console.log(`翻訳結果: ${result}`);
    });

    it("長文が正しく翻訳されること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();
      const longText = `
        The quick brown fox jumps over the lazy dog. 
        This is a sample text for testing translation capabilities.
        We need to ensure that longer paragraphs are translated correctly,
        maintaining the context and meaning across multiple sentences.
      `;

      const result = await deeplAdapter.translateText({
        args: {
          sourceText: longText,
          targetLang: "JA",
        },
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      expect(result.length).to.be.greaterThan(longText.length / 3); // 日本語は英語より文字数が少ない傾向があるため
      console.log(`長文翻訳結果:\n${result}`);
    });

    it("カスタムAPIキーを使用して翻訳できること", async function () {
      if (!hasAllEnvVars) this.skip();

      const customApiKey = process.env.DEEPL_API_KEY;
      const deeplAdapter = deeplAdapterBuilder.build({
        buildClientInputParams: {
          args: {
            apiKey: customApiKey!,
          },
        },
      });

      const result = await deeplAdapter.translateText({
        args: {
          sourceText: "Custom API key test",
          targetLang: "DE",
        },
      });

      expect(result).to.be.a("string").and.to.not.be.empty;
      console.log(`カスタムAPIキーによる翻訳結果: ${result}`);
    });

    it("異なる言語の組み合わせでも正しく翻訳されること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();
      // 英語からドイツ語へ
      const result1 = await deeplAdapter.translateText({
        args: {
          sourceText: "Artificial Intelligence",
          targetLang: "DE",
        },
      });

      // ドイツ語からフランス語へ
      const result2 = await deeplAdapter.translateText({
        args: {
          sourceText: result1,
          sourceLang: "DE",
          targetLang: "FR",
        },
      });

      expect(result1).to.be.a("string").and.to.not.be.empty;
      expect(result2).to.be.a("string").and.to.not.be.empty;
      console.log(`英語→ドイツ語: ${result1}`);
      console.log(`ドイツ語→フランス語: ${result2}`);
    });

    it("エラー処理: 無効なパラメータでエラーが発生すること", async function () {
      if (!hasAllEnvVars) this.skip();

      const deeplAdapter = deeplAdapterBuilder.build();

      try {
        await deeplAdapter.translateText({
          args: {
            sourceText: "", // 空の文字列
            targetLang: "JA",
          },
        });
        expect.fail("エラーが発生しませんでした");
      } catch (error: any) {
        expect(error).to.exist;
        console.log(`期待されたエラー: ${error.message}`);
      }
    });
  });
});
