#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Branded, stable subdomain for Expo/ngrok tunnel (avoid random exp.direct hosts).
export EXPO_TUNNEL_SUBDOMAIN="${EXPO_TUNNEL_SUBDOMAIN:-peacezense5841}"

mkdir -p "$ROOT_DIR/.expo"
LOG_FILE="$ROOT_DIR/.expo/preview.log"
STATUS_FILE="$ROOT_DIR/.expo/preview-status.json"
HEALTH_INTERVAL_SECONDS="${HEALTH_INTERVAL_SECONDS:-20}"

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
  local web="${2:-}"
  local exp="${3:-}"
  if [[ -z "$web" ]]; then
    web="https://${EXPO_TUNNEL_SUBDOMAIN}.ngrok.io"
    exp="exp://${EXPO_TUNNEL_SUBDOMAIN}.ngrok.io"
  fi
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

metro_healthy() {
  curl -fsS http://127.0.0.1:8081/status >/dev/null 2>&1
}

tunnel_healthy() {
  read_tunnel_urls || return 1
  curl -fsS "${WEB_URL}/status" >/dev/null 2>&1
}

stop_expo() {
  if [[ -n "${EXPO_PID:-}" ]] && kill -0 "$EXPO_PID" 2>/dev/null; then
    kill "$EXPO_PID" 2>/dev/null || true
    wait "$EXPO_PID" 2>/dev/null || true
  fi
  pkill -f "expo start --tunnel" 2>/dev/null || true
}

wait_for_tunnel() {
  for _ in $(seq 1 60); do
    if tunnel_healthy; then
      write_status "running" "$WEB_URL" "$EXP_URL"
      log "Tunnel live: web=$WEB_URL exp=$EXP_URL"
      return 0
    fi
    sleep 2
  done
  write_status "starting"
  return 1
}

monitor_until_unhealthy() {
  while kill -0 "$EXPO_PID" 2>/dev/null; do
    if ! metro_healthy; then
      log "Metro went offline"
      return 1
    fi
    if ! tunnel_healthy; then
      log "Public tunnel went offline"
      return 1
    fi
    write_status "running" "$WEB_URL" "$EXP_URL"
    sleep "$HEALTH_INTERVAL_SECONDS"
  done
  return 0
}

trap 'stop_expo' EXIT INT TERM

log "PeaceZense persistent preview (subdomain: ${EXPO_TUNNEL_SUBDOMAIN})"
write_status "watchdog"

while true; do
  stop_expo
  log "Starting Expo tunnel..."
  write_status "starting"

  set +e
  npm run start -- --tunnel 2>&1 | tee -a "$LOG_FILE" &
  EXPO_PID=$!
  set -e

  if ! wait_for_tunnel; then
    log "Tunnel did not become healthy in time"
    stop_expo
    sleep 5
    continue
  fi

  monitor_until_unhealthy || true
  log "Restarting preview after offline/disconnect..."
  stop_expo
  write_status "restarting"
  sleep 5
done
