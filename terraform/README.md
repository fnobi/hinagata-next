# terraform

GitHub Actions (`.github/workflows/sample_firebase.yml`) から Firebase Hosting + Cloud Functions (2nd gen) へデプロイするための GCP 側リソース（Workload Identity Federation + デプロイ用サービスアカウント）をセットアップします。

前提として、対象の Firebase プロジェクト自体（GCP プロジェクト作成 & Firebase 有効化）は既存のものを使用します。ここでは作成しません。また 2nd gen Cloud Functions のデプロイには Blaze（従量課金）プランが必要です。未設定の場合は先に Firebase Console から切り替えてください。

state はローカルファイル（`terraform.tfstate`）で管理します。リポジトリにコミットしないでください。

## 使い方

`project_id` のデフォルトは dev 環境の Firebase プロジェクト（`hinagata-next-dev`）になっているため、通常は変数指定なしで実行できます。

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

別プロジェクト（本番など）向けに実行する場合は `-var="project_id=<プロジェクトID>"` を指定してください。対象リポジトリが `fnobi/hinagata-next` 以外の場合は `-var="github_repository=owner/repo"` も指定してください。

## apply 後に GitHub 側へ設定するもの

`terraform apply` 完了後に出力される値を、対象リポジトリの Secrets に設定します。

| GitHub Secret        | 値                                  |
| --------------------- | ------------------------------------ |
| `WIF_PROVIDER`        | output `workload_identity_provider` |
| `WIF_SERVICE_ACCOUNT` | output `service_account_email`      |

```bash
terraform output -raw workload_identity_provider
terraform output -raw service_account_email
```

Firebase プロジェクト ID（`NEXT_PUBLIC_FIREBASE_PROJECT_ID` ほか `firebaseConfig.ts` が参照する値）は Secret ではなく、`.github/workflows/sample_firebase.yml` の `env` に直接書かれたダミー値です。実際にデプロイする対象のプロジェクトに合わせて、このファイルの値を書き換えてください。

## 作成されるリソース

- Workload Identity Pool / Provider（GitHub Actions OIDC、`assertion.repository` を対象リポジトリに限定）
- デプロイ用サービスアカウント（`roles/firebasehosting.admin`, `roles/cloudfunctions.admin`, `roles/run.admin`, `roles/iam.serviceAccountUser`, `roles/artifactregistry.writer`, `roles/secretmanager.secretAccessor` を付与）
- 上記サービスアカウントに対する、対象リポジトリからの Workload Identity 経由の権限借用（`roles/iam.workloadIdentityUser`）
- 必要な API の有効化（IAM, IAM Credentials, STS, Firebase Hosting, Cloud Functions, Cloud Run, Cloud Build, Artifact Registry, Eventarc, Secret Manager, Cloud Resource Manager）

`roles/secretmanager.secretAccessor` は読み取り専用（シークレットの作成や、他のサービスアカウントへのアクセス権付与はできない）で、通常デプロイ時に `defineSecret` が参照するシークレットの最新バージョンを解決するためだけに使う。シークレット自体の作成や、関数の実行サービスアカウントへのアクセス権付与（`roles/secretmanager.admin`相当の操作）は、Terraformでは管理せず、次項の通り開発者が手動で行う。

## functions の Basic 認証用シークレット（初回のみ・手動）

`packages/functions` は `**` にマッチする全リクエストを Basic 認証で保護する Cloud Function (`webApp`) です。シークレット自体の作成・値の設定は Firebase CLI から行います。

```bash
firebase functions:secrets:set BASIC_AUTH_CREDENTIALS --project <FirebaseプロジェクトID>
# プロンプトで "user:pass" 形式の値を入力（未作成なら secrets:set がシークレットも作成する）
```

続けて、`secretmanager.admin` 相当の権限を持つ開発者自身のアカウントで一度 `firebase deploy --only functions --project <FirebaseプロジェクトID>` を実行してください。関数が参照するシークレットに実行サービスアカウントがアクセスできない場合、Firebase CLI がこのタイミングで `roles/secretmanager.secretAccessor` を自動的に付与します。この付与さえ済んでいれば、以降の（GitHub Actions経由の）通常デプロイは読み取り権限だけで完結します。

値を変更した場合は関数の再デプロイが必要です（`firebase deploy --only functions`）。
