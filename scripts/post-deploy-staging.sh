#!/usr/bin/env bash
# Run on the host after staging containers are up (e.g. self-hosted CI or manual).
# 1) Waits for API health
# 2) Runs scripts/post-deploy-data.mjs — edit scripts/post-deploy-data.config.json for paths
# 3) Runs optional POST_DEPLOY_EXTRA_COMMANDS (newline-separated; use with care)

set -euo pipefail

BASE_URL="${POST_DEPLOY_BASE_URL:-http://127.0.0.1:3000}"
export POST_DEPLOY_CONFIG="${POST_DEPLOY_CONFIG:-}"

echo "Waiting for API at ${BASE_URL}/api/health ..."
for _ in $(seq 1 45); do
  if curl -fsS "${BASE_URL}/api/health" >/dev/null 2>&1; then
    echo "API is up."
    break
  fi
  sleep 2
done

if ! curl -fsS "${BASE_URL}/api/health" >/dev/null 2>&1; then
  echo "ERROR: API did not become healthy in time." >&2
  exit 1
fi

echo "Importing data (policies via upload-from-path, catalogues via config)..."
export POST_DEPLOY_BASE_URL="${BASE_URL}"
node scripts/post-deploy-data.mjs
echo ""

if [[ -n "${POST_DEPLOY_EXTRA_COMMANDS:-}" ]]; then
  echo "Running POST_DEPLOY_EXTRA_COMMANDS ..."
  # shellcheck disable=SC2001
  while IFS= read -r line || [[ -n "${line}" ]]; do
    [[ -z "${line// }" ]] && continue
    [[ "${line}" =~ ^# ]] && continue
    echo "+ $line"
    bash -c "$line"
  done <<< "$(printf '%s\n' "${POST_DEPLOY_EXTRA_COMMANDS}")"
fi

echo "Post-deploy finished."
