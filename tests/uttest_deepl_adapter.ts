import { expect } from "chai";
import sinon from "sinon";
import * as deepl from "deepl-node";
import { deeplAdapterBuilder } from "../src/deepl_adapter";

describe("DeepL Adapter Tests", () => {
  let deeplAdapter: ReturnType<typeof deeplAdapterBuilder.build>;
  let translateTextStub: sinon.SinonStub;

  beforeEach(() => {
    // DeepL TranslatorのtranslateTextメソッドをスタブ化
    translateTextStub = sinon.stub(deepl.Translator.prototype, "translateText");

    // 単一テキストの翻訳結果のモック
    translateTextStub.withArgs("Hello world", sinon.match.any, "JA").resolves({ text: "こんにちは世界" });

    // 配列テキストの翻訳結果のモック
    translateTextStub.withArgs(["Hello", "World"], sinon.match.any, "JA").resolves([{ text: "こんにちは" }, { text: "世界" }]);

    // 特定の言語指定のテスト用
    translateTextStub.withArgs("Hello world", "EN", "DE").resolves({ text: "Hallo Welt" });

    // deeplAdapterインスタンスを作成
    deeplAdapter = deeplAdapterBuilder.build({
      buildClientInputParams: {
        args: {
          apiKey: "dummy-api-key",
        },
      },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("translateText", () => {
    it("単一テキストを正しく翻訳できること", async () => {
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: "Hello world",
          targetLang: "JA",
        },
      });

      expect(result).to.equal("こんにちは世界");
      expect(translateTextStub.calledOnce).to.be.true;
    });

    it("複数テキストを配列で渡して正しく翻訳できること", async () => {
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: ["Hello", "World"],
          targetLang: "JA",
          delimiter: " ",
        },
      });

      expect(result).to.equal("こんにちは 世界");
      expect(translateTextStub.calledOnce).to.be.true;
    });

    it("ソース言語を指定して翻訳できること", async () => {
      const result = await deeplAdapter.translateText({
        args: {
          sourceText: "Hello world",
          sourceLang: "EN",
          targetLang: "DE",
        },
      });

      expect(result).to.equal("Hallo Welt");
      expect(translateTextStub.calledWith("Hello world", "EN", "DE")).to.be.true;
    });

    it("区切り文字を指定して結合できること", async () => {
      translateTextStub.withArgs(["One", "Two", "Three"], sinon.match.any, "JA").resolves([{ text: "一" }, { text: "二" }, { text: "三" }]);

      const result = await deeplAdapter.translateText({
        args: {
          sourceText: ["One", "Two", "Three"],
          targetLang: "JA",
          delimiter: ", ",
        },
      });

      expect(result).to.equal("一, 二, 三");
    });

    it("入力パラメータのバリデーションが行われること", async () => {
      try {
        await deeplAdapter.translateText({
          args: {
            sourceText: "", // 空文字列は不可
            targetLang: "JA",
          },
        });
        // エラーが発生しなかった場合はテスト失敗
        expect.fail("バリデーションエラーが発生しませんでした");
      } catch (error: any) {
        expect(error.errors).to.exist;
      }
    });

    it("環境変数から読み込まれるAPIキーでインスタンスが作成できること", () => {
      // 環境変数のモック
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        DEEPL_API_KEY: "env-api-key",
      };

      // スタブを再設定
      sinon.restore();
      const translatorInstanceStub = sinon.stub(deepl, "Translator");

      try {
        // 環境変数からAPIキーを読み取るケース
        deeplAdapterBuilder.build().translateText({
          args: {
            sourceText: "Test",
            targetLang: "JA",
          },
        });

        // Translatorが正しいAPIキーで初期化されたか確認
        expect(translatorInstanceStub.calledWith("env-api-key")).to.be.true;
      } finally {
        process.env = originalEnv;
      }
    });
  });
});
