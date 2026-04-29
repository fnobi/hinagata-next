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

## Utilities

- 配列・文字列・日付などの操作は `~/common/lib/*-util` に既存関数がないか先に確認する
