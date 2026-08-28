output "workload_identity_provider" {
  description = "Set as the GitHub Actions secret WIF_PROVIDER."
  value       = google_iam_workload_identity_pool_provider.github_actions.name
}

output "service_account_email" {
  description = "Set as the GitHub Actions secret WIF_SERVICE_ACCOUNT."
  value       = google_service_account.github_actions_deploy.email
}
