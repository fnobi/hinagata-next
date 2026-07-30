variable "project_id" {
  description = "Firebase/GCP project ID that Hosting deploys are targeting. Passed at apply time, e.g. -var=\"project_id=...\"."
  type        = string
  default     = "hinagata-next-dev"
}

variable "github_repository" {
  description = "GitHub repository allowed to assume the deploy service account, in \"owner/repo\" form."
  type        = string
  default     = "fnobi/hinagata-next"
}

variable "service_account_id" {
  description = "Account ID (local part, before @) of the service account used by GitHub Actions to deploy Firebase Hosting."
  type        = string
  default     = "github-actions-firebase"
}

variable "workload_identity_pool_id" {
  description = "ID of the Workload Identity Pool used for GitHub Actions OIDC federation."
  type        = string
  default     = "github-actions-pool"
}

variable "workload_identity_pool_provider_id" {
  description = "ID of the Workload Identity Pool Provider used for GitHub Actions OIDC federation."
  type        = string
  default     = "github-actions-provider"
}
