# hinagata-next

## 使用言語 / フレームワーク / ライブラリ

- Framework: [Next.js](https://nextjs.org/) (App Router)
- View: [React](https://react.dev/) 19
- State Management: [Zustand](https://zustand-demo.pmnd.rs/)
- AltJS: [TypeScript](https://www.typescriptlang.org/) 6
- CSS-in-JS: [emotion](https://emotion.sh/)
- Linter: [ESLint](https://eslint.org/) 9 (flat config)
- Formatter: [Prettier](https://prettier.io/)
- Test: [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- Package Manager: [pnpm](https://pnpm.io/) (workspace)

## 構成

モノレポ構成。`packages/` 以下に以下のパッケージが存在します。

- `packages/web` — Next.js アプリ本体
- `packages/core` — 共有型・純粋ユーティリティ

## 開発手順

依存パッケージをインストール。

```bash
pnpm install
```

### 開発サーバー起動

```bash
pnpm dev
```

ポートを指定する場合:

```bash
pnpm dev -- -p 3001
```

### ビルド（静的 export）

```bash
pnpm build
```

`dist/` 以下に静的ファイル一式が生成されます。  
`NEXT_PUBLIC_BASE_PATH` を指定することで、サブディレクトリ配置に対応できます。

```bash
NEXT_PUBLIC_BASE_PATH=/myapp pnpm build
# → dist/myapp/ 以下に出力
```

### Lint / Test

```bash
pnpm lint
pnpm test
```
