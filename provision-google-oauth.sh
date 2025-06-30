#!/usr/bin/env bash
set -euo pipefail

# Ensure gcloud CLI is available
if ! command -v gcloud >/dev/null 2>&1; then
  echo "Error: gcloud CLI not found" >&2
  exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
if [[ -z "$PROJECT_ID" ]]; then
  echo "Error: no active gcloud project configured" >&2
  exit 1
fi

API="oauth2.googleapis.com"
if ! gcloud services list --enabled --format='value(config.name)' | grep -q "^$API$"; then
  gcloud services enable "$API" >/dev/null
fi

CLIENT_NAME="Desktop"
# Attempt to locate an existing OAuth client matching CLIENT_NAME
CLIENT_RESOURCE=$(gcloud alpha iam oauth-clients list \
  --format='value(name)' \
  --filter="displayName=$CLIENT_NAME" 2>/dev/null || true)

if [[ -z "$CLIENT_RESOURCE" ]]; then
  CLIENT_RESOURCE=$(gcloud alpha iam oauth-clients create \
    --display-name="$CLIENT_NAME" \
    --client-type=desktop \
    --allowed-redirect-uris=http://localhost:3000/api/auth/google/callback \
    --format='value(name)')
fi

# Reset credentials so the script is idempotent
CREDENTIALS=$(gcloud alpha iam oauth-clients credentials reset "$CLIENT_RESOURCE" --format=json)
CLIENT_ID=$(echo "$CREDENTIALS" | jq -r '.clientId')
CLIENT_SECRET=$(echo "$CREDENTIALS" | jq -r '.clientSecret')

if [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]]; then
  echo "Error: failed to obtain OAuth client credentials" >&2
  exit 1
fi

jq -n --arg client_id "$CLIENT_ID" --arg client_secret "$CLIENT_SECRET" \
  '{client_id:$client_id, client_secret:$client_secret}'

