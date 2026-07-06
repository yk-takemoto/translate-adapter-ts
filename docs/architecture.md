# translate-adapter-ts アーキテクチャ・設計ドキュメント

> 対象バージョン: `@yk-takemoto/translate-adapter` 0.1.0（2026-07 時点の `org/translate-adapter-ts` ソース解析に基づく）

## 1. 概要

翻訳 API を抽象化する TypeScript アダプタライブラリ。現状の実装プロバイダは **DeepL のみ**。
利用元アプリは `translateAdapterHelper({ translateId }).translateText(...)` の形で呼び出し、
ユーザリクエスト（日本語）を英語へ翻訳して LLM プロンプトの精度を上げる用途に使われる。

- 利用元: `smarthome-agent-mcp/webui`（requestOperation）、`kakeibo-agent/receipts_api`（PromptUsecase）
- 配布形態: GitHub リポジトリ直参照（`github:yk-takemoto/translate-adapter-ts#0.0.3`）

## 2. 全体アーキテクチャ

```text
translateAdapterHelper({ translateId })      ← ファサード（プロバイダ選択）
        │
        ▼
TranslateAdapterBuilder（プロバイダ別）       ← deeplAdapterBuilder
        │  build()
        ▼
TranslateAdapter { translateText() }         ← 機能インターフェース
        │
        ▼
TranslateClientBuilder                       ← SDK クライアント生成（envから認証情報）
        │
        ▼
deepl-node SDK
```

### レイヤの役割

| 要素 | 役割 |
| --- | --- |
| `translate_adapter_schemas.ts` | 全 zod スキーマ・ジェネリック型定義（`TranslateAdapterInputParams` 等） |
| `translate_adapter_helper.ts` | `translateId` → builder のマップ、機能サポートチェック |
| `deepl_adapter.ts` | DeepL 実装。`ClientBuilder`（認証）と `AdapterBuilder`（機能）の2段構成 |

## 3. 設計思想・ポリシー

- **llm-adapter-ts と同一のビルダーパターン**を採用（姉妹ライブラリ）。
  - `build({ buildArgs, buildClientInputParams })` でアダプタ生成
  - 各機能関数は `{ args, argsSchema, config, configSchema }` を受け取り、**デフォルト値として env 由来の設定と zod スキーマが注入**され、呼び出し時に `parse()` される
- **シークレット解決規約**: `JSON.parse(process.env.APP_SECRETS || "{}").DEEPL_API_KEY || process.env.DEEPL_API_KEY`
  （コンテナ環境では APP_SECRETS に JSON でまとめ、ローカルでは個別 env）
- 配列入力の場合は `delimiter`（既定 " "）で連結して単一文字列を返す。

## 4. 公開 API

| エクスポート | 内容 |
| --- | --- |
| `translateAdapterHelper({ translateId })` | `{ translateText({ args: { sourceText, targetLang, sourceLang?, delimiter? } }) }` |
| `TranslateAdapterSchemas` | 型・スキーマ群（`TranslateId` = `"DeepL"` のみ） |

## 5. テスト

mocha + chai + sinon。`uttest_*`（単体）/ `ittest_*`（実 API 結合）の2系統。

## 6. 既知の課題(リアーキ観点)

- **過剰な抽象化**: プロバイダ1つに対し、ジェネリクス4段（`TranslateAdapterFunction<InputParamsType, ResultType>` 等）+ スキーマ注入可能な引数設計は複雑すぎる。呼び出し側がスキーマを差し替える実運用は無い。
- llm-adapter-ts とほぼ同じ型枠組み（`GeneralArguments`/`GeneralResult`/builder 型）が**コピー実装**されており、共通化されていない。
- 毎回の `translateText` 呼び出しで `getAdapter()` → クライアント生成が走る（キャッシュなし）。
- LLM 自体の多言語性能が向上した現在、「翻訳してから LLM に渡す」構成自体の要否を再検討する余地がある（リアーキ時の論点）。
- zod v3 系。モノレポ化時は zod v4 / 共通スキーマ基盤への統一が候補。
