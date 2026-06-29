#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Fixed subdomain keeps the same ngrok host across restarts when possible.
export EXPO_TUNNEL_SUBDOMAIN="${EXPO_TUNNEL_SUBDOMAIN:-t3xue48}"

mkdir -p "$ROOT_DIR/.expo"
LOG_FILE="$ROOT_DIR/.expo/preview.log"
STATUS_FILE="$ROOT_DIR/.expo/preview-status.json"

log() {
  echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"
}

read_tunnel_urls() {
  local json
  json="$(curl -fsS http://127.0.0.1:4040/api/tunnels 2>/dev/null || true)"
  if [[ -z "$json" ]]; then
    return 1
  fi

  WEB_URL="$(node -e "
    const data = JSON.parse(process.argv[1]);
    const https = (data.tunnels || []).find((t) => t.proto === 'https');
    if (https?.public_url) console.log(https.public_url);
  " "$json")"

  if [[ -n "${WEB_URL:-}" ]]; then
    local host="${WEB_URL#https://}"
    host="${host#http://}"
    EXP_URL="exp://${host}"
    return 0
  fi
  return 1
}

write_status() {
  local state="$1"
  local web="${2:-https://${EXPO_TUNNEL_SUBDOMAIN}.ngrok.io}"
  local exp="${3:-exp://${EXPO_TUNNEL_SUBDOMAIN}.ngrok.io}"
  cat >"$STATUS_FILE" <<EOF
{
  "state": "$state",
  "webUrl": "$web",
  "expUrl": "$exp",
  "subdomain": "${EXPO_TUNNEL_SUBDOMAIN}",
  "persistent": true,
  "updatedAt": "$(date -Iseconds)"
}
EOF
}

wait_for_tunnel() {
  for _ in $(seq 1 60); do
    if read_tunnel_urls; then
      write_status "running" "$WEB_URL" "$EXP_URL"
      log "Tunnel live: web=$WEB_URL exp=$EXP_URL"
      return 0
    fi
    sleep 2
  done
  write_status "starting"
  return 1
}

log "PeaceZense persistent preview watchdog (subdomain: ${EXPO_TUNNEL_SUBDOMAIN})"
write_status "watchdog"

while true; do
  log "Starting Expo tunnel..."
  write_status "starting"

  set +e
  npm run start -- --tunnel 2>&1 | tee -a "$LOG_FILE" &
  EXPO_PID=$!
  set -e

  wait_for_tunnel || log "Tunnel URL not detected yet; Expo still starting"

  set +e
  wait "$EXPO_PID"
  code=$?
  set -e

  log "Expo exited (code=$code). Restarting in 5 seconds..."
  write_status "restarting"
  sleep 5
done
