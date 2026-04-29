# CLAUDE.md

## Import

- パスエイリアスは `~/`（`src/` へのマップ）
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

- Firestore SDK を直接使わず、必ず `ClientDataStoreAgent`（`~/common/lib/ClientDataStoreAgent`）経由でアクセスする
- スキーマ定義は `~/features/schema/app-data-store-scheme.ts` に `DataStoreScheme` として追加する
  - `withConverter` は使わず、`parse` 関数を scheme に持たせる
  - 型定義ファイル（`~/features/schema/*.ts` や `~/common/schema/*.ts`）に対応する `parseXxx` 関数も合わせて定義する
  - サブコレクションは `parentCollection` で親 scheme を参照して階層を表現する
- `ClientDataStoreAgent` インスタンスはコンポーネントの外（モジュールレベル）で生成する
- React コンポーネントからのリアルタイム購読は `~/common/lib/database-common-hooks` のフックを使う
  - 単一ドキュメント: `useDataStoreSingleItem`
  - コレクション: `useDataStoreList`（`QueryFormula<T>[]` でクエリを渡す）
  - コレクショングループ: `useDataStoreGroupList`
- エラーハンドリングは `extractFirebaseError`（`~/common/schema/FirebaseErrorParameter`）で `FirebaseErrorParameter` に変換する

## Utilities

- 配列・文字列・日付などの操作は `~/common/lib/*-util` に既存関数がないか先に確認する
