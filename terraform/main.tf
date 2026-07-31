resource "google_project_service" "required" {
  for_each = toset([
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "firebasehosting.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudbilling.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "eventarc.googleapis.com",
    "secretmanager.googleapis.com",
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_iam_workload_identity_pool" "github_actions" {
  project                   = var.project_id
  workload_identity_pool_id = var.workload_identity_pool_id
  display_name              = "GitHub Actions"
  description               = "OIDC federation pool for GitHub Actions workflows"

  depends_on = [google_project_service.required]
}

resource "google_iam_workload_identity_pool_provider" "github_actions" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions.workload_identity_pool_id
  workload_identity_pool_provider_id = var.workload_identity_pool_provider_id
  display_name                       = "GitHub Actions"

  # Only tokens asserting this exact repository may federate into this pool.
  attribute_condition = "assertion.repository == \"${var.github_repository}\""

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "github_actions_deploy" {
  project      = var.project_id
  account_id   = var.service_account_id
  display_name = "GitHub Actions - Firebase Hosting deploy (${var.github_repository})"
}

# Lets the federated identity from this repository impersonate the deploy service account.
resource "google_service_account_iam_member" "github_actions_wif_user" {
  service_account_id = google_service_account.github_actions_deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions.name}/attribute.repository/${var.github_repository}"
}

# Roles needed to deploy Hosting plus 2nd-gen Cloud Functions (which deploy as Cloud Run
# services via Cloud Build).
resource "google_project_iam_member" "github_actions_roles" {
  for_each = toset([
    "roles/firebasehosting.admin",
    "roles/cloudfunctions.admin",
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/artifactregistry.writer",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions_deploy.email}"
}

# Empty container for the Basic auth secret (the actual value/version is set manually,
# see terraform/README.md). Created here only so the IAM grant below can be scoped to
# this one secret instead of every secret in the project.
resource "google_secret_manager_secret" "basic_auth_credentials" {
  project   = var.project_id
  secret_id = "BASIC_AUTH_CREDENTIALS"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required]
}

# `firebase deploy --only functions` grants the function's runtime service account
# secretAccessor on this secret automatically, which requires the deploying identity
# to be able to set IAM policy on it. Scoped to this single secret rather than
# roles/secretmanager.admin at the project level.
resource "google_secret_manager_secret_iam_member" "github_actions_secret_admin" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.basic_auth_credentials.secret_id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:${google_service_account.github_actions_deploy.email}"
}
