# CLAUDE.md

## モノレポ構成

```
packages/
  core/      # Firebase非依存の共通型・ユーティリティ（@hinagata-next/core）
  web/       # Next.js Webアプリ（@hinagata-next/web）
  functions/ # Firebase Cloud Functions（@hinagata-next/functions）
```

## Import

- `packages/web/` 内のパスエイリアスは `~/`（`packages/web/src/` へのマップ）
- `packages/functions/` 内のパスエイリアスは `~/`（`packages/functions/src/` へのマップ）
- core パッケージへのアクセスは `@hinagata-next/core/common/...` または `@hinagata-next/core/feature/...`
- 相対 import（`./`, `../`）は禁止

## Code style

- Prettier: trailingComma=none, arrowParens=avoid
- コンポーネントは arrow function のみ（`function Foo()` は使わない）

## Styling

- Emotion（`@emotion/styled`, `@emotion/react`）を使う
- Tailwind・CSS Modules は使わない

## Next.js

- `output: "export"`（静的エクスポート）のため SSR 系 API（`cookies()`, `headers()`, Server Actions など）は使えない
- バックエンド処理は Firebase Cloud Functions（`requestAppCallable` で呼ぶ）

## Firestore

- Firestore SDK を直接使わず、必ず `ClientDataStoreAgent`（`~/common/ClientDataStoreAgent`）経由でアクセスする
- スキーマ定義は `@hinagata-next/core/feature/app-data-store-scheme.ts` に `DataStoreScheme` として追加する
  - `parse` 関数を scheme に持たせる（`withConverter` は `DataStoreAgent` が内部的に使用）
  - 型定義ファイル（`@hinagata-next/core/feature/*.ts`）に対応する `parseXxx` 関数も合わせて定義する
  - サブコレクションは `parentCollection` で親 scheme を参照して階層を表現する
- `ClientDataStoreAgent` インスタンスはコンポーネントの外（モジュールレベル）で生成する
- React コンポーネントからのリアルタイム購読は `~/common/database-common-hooks` のフックを使う
  - 単一ドキュメント: `useDataStoreSingleItem`
  - コレクション: `useDataStoreList`（`QueryFormula<T>[]` でクエリを渡す）
  - コレクショングループ: `useDataStoreGroupList`
- エラーハンドリングは `extractFirebaseError`（`~/common/FirebaseErrorParameter`）で `FirebaseErrorParameter` に変換する

## Utilities

- 配列・文字列・日付などの操作は `@hinagata-next/core/common/*-util` に既存関数がないか先に確認する
