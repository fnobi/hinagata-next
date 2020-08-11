hinagata-next
====

## 使用言語 / フレームワーク / ライブラリ

- View: [React](https://ja.reactjs.org/)
- Framework: [Next.js](https://nextjs.org/)
- state management: [Recoil](https://recoiljs.org/)
- AltJS: [TypeScript](https://www.typescriptlang.org/)
- CSS-in-JS: [emotion](https://github.com/emotion-js/emotion)
- Linter: [ESLint](https://eslint.org/)

## 開発手順

開発に使うnpmパッケージをインストール。

```bash
$ npm install
```

以降、shellから以下のコマンドを呼び出しつつ、開発を行います。

- `npm run dev`
  - 開発用サーバーを立ち上げ、その後ソースコードに修正があれば自動ビルド・自動ブラウザ更新します。
  - `npm run dev -- -p XXXX` で、任意のポート番号XXXXで開発用サーバーを動かすことができます

  - 基本的には、このコマンドを実行しておくだけで開発が可能なはずです。
- `npm run build`
  - ソースをビルドし、静的アセットを `dist` 以下にexportします。
  - 単独でWebサイトとして動作するファイル一式を生成するにはこのコマンドを呼び出します。
