hinagata-next
====

## 事前に用意するもの
- node.js (version 12以上)

## 環境構築

開発に使うnpmパッケージをインストール
```bash
$ npm install
```

## 開発手順

shellから以下のコマンドを実行することで、各種ビルド・タスク実行が可能です。

- `npm run dev`
  - 開発用ブラウザを立ち上げ、その後ソースコードに修正があれば自動ビルド・自動ブラウザ更新します
  - 基本的には、このコマンドを実行しておくだけで開発が可能なはずです。
- `npm run build`
  - ファイルをビルドします。

## 使用言語

- HTMLテンプレート: [pug](https://pugjs.org/api/getting-started.html)
- CSSメタ言語: [Sass(scss)](http://sass-lang.com/)
- Javascript: [TypeScript](https://www.typescriptlang.org/)

## 依存ライブラリ

`npm install`でインストールされるライブラリ（一部）です。
全てを理解していなくても、開発は問題なく行えますが、挙動に問題がある場合・カスタマイズしたい場合などに参照してみてください。
