#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export EXPO_TUNNEL_SUBDOMAIN="${EXPO_TUNNEL_SUBDOMAIN:-peacezense5841}"
export METRO_PORT="${METRO_PORT:-8081}"

mkdir -p "$ROOT_DIR/.expo"
LOG_FILE="$ROOT_DIR/.expo/preview.log"

log() {
  echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"
}

metro_healthy() {
  curl -fsS "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1
}

stop_metro() {
  pkill -f "expo start" 2>/dev/null || true
  pkill -f "metro" 2>/dev/null || true
}

start_metro() {
  if metro_healthy; then
    log "Metro already running on :${METRO_PORT}"
    return 0
  fi

  log "Starting Metro (no tunnel) on :${METRO_PORT}..."
  npx expo start --port "$METRO_PORT" --localhost 2>&1 | tee -a "$LOG_FILE" &
  METRO_PID=$!

  for _ in $(seq 1 90); do
    if metro_healthy; then
      log "Metro ready (pid=$METRO_PID)"
      return 0
    fi
    sleep 2
  done

  log "Metro failed to start"
  return 1
}

monitor_metro() {
  while true; do
    sleep 15
    if ! metro_healthy; then
      log "Metro died — restarting Metro only"
      stop_metro
      sleep 2
      start_metro || true
    fi
  done
}

trap 'stop_metro; pkill -f ngrok-tunnel.mjs 2>/dev/null || true' EXIT INT TERM

log "PeaceZense split preview: Metro + independent ngrok tunnel"
stop_metro
start_metro
monitor_metro &
MONITOR_PID=$!

# Tunnel manager runs in foreground; auto-reconnects without killing Metro.
node "$ROOT_DIR/scripts/ngrok-tunnel.mjs" 2>&1 | tee -a "$LOG_FILE"

kill "$MONITOR_PID" 2>/dev/null || true
