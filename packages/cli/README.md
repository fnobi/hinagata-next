# @hinagata-next/cli

開発者が手元で呼び出す運用スクリプト集。サービス運用時の集計や、特権管理者のみに許された操作をトリガーするためのスクリプトを置く。

`@hinagata-next/core` の Firestore 共通基盤（`DataStoreAgent` / スキーマ定義）をそのまま利用し、`packages/functions` と同様に `firebase-admin` を使ってサーバーサイドから直接アクセスする。Web アプリや Cloud Functions のようにデプロイされるものではなく、開発者がローカルから都度実行する想定。

## 事前準備

対象の Firebase プロジェクトに対する Application Default Credentials が必要。

```bash
gcloud auth application-default login
gcloud config set project <対象のプロジェクトID>
```

もしくは、サービスアカウントキーを使う場合は `GOOGLE_APPLICATION_CREDENTIALS` にキーファイルのパスを設定する。

## スクリプト

### profilePosts を CSV 出力する

`profilePosts` コレクションを全件取得し、CSV に出力するサンプルスクリプト。

```bash
pnpm --filter @hinagata-next/cli export:profile-posts [出力先パス]
```

出力先パスを省略した場合、カレントディレクトリの `profilePosts.csv` に出力される。

## スクリプトの追加

`src/scripts/` 以下に実行用スクリプトを追加し、`package.json` の `scripts` に `tsx src/scripts/xxx.ts` を実行するエントリを足す。Firestore アクセスは `src/lib/firebase-app.ts` の `firebaseFirestore` と `src/lib/ServerDataStoreAgent.ts` を経由する。
