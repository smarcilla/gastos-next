$ErrorActionPreference = 'Stop'

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  Write-Error "gcloud CLI not found"
  exit 1
}

$projectId = (gcloud config get-value project --quiet 2>$null | Out-String).Trim()
if (-not $projectId) {
  Write-Error "no active gcloud project configured"
  exit 1
}

$api = "oauth2.googleapis.com"
$enabled = (gcloud services list --enabled --format="value(config.name)" 2>$null | Select-String -SimpleMatch $api)
if (-not $enabled) {
  gcloud services enable $api | Out-Null
}

$clientName = "Desktop"
$clientResource = (gcloud alpha iam oauth-clients list --format="value(name)" --filter "displayName=$clientName" 2>$null | Out-String).Trim()
if (-not $clientResource) {
  $clientResource = (gcloud alpha iam oauth-clients create --display-name "$clientName" --client-type desktop --allowed-redirect-uris http://localhost:3000/api/auth/google/callback --format "value(name)" | Out-String).Trim()
}

$credentialsJson = (gcloud alpha iam oauth-clients credentials reset $clientResource --format json | Out-String)
$credentials = $credentialsJson | ConvertFrom-Json
$clientId = $credentials.clientId
$clientSecret = $credentials.clientSecret

if (-not $clientId -or -not $clientSecret) {
  Write-Error "failed to obtain OAuth client credentials"
  exit 1
}

@{client_id=$clientId;client_secret=$clientSecret} | ConvertTo-Json -Compress
