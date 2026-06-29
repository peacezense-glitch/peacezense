#!/usr/bin/env bash
# External watchdog — run via cron every minute to recover preview if dead.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SUBDOMAIN="${EXPO_TUNNEL_SUBDOMAIN:-peacezense5841}"
WEB_URL="https://${SUBDOMAIN}.ngrok.io"
LOG_FILE="$ROOT_DIR/.expo/watchdog.log"

log() {
  echo "[$(date -Iseconds)] $*" >>"$LOG_FILE"
}

metro_ok() {
  curl -fsS http://127.0.0.1:8081/status >/dev/null 2>&1
}

tunnel_ok() {
  curl -fsS "${WEB_URL}/status" >/dev/null 2>&1
}

tmux_ok() {
  tmux -f /exec-daemon/tmux.portal.conf has-session -t =peacezense-preview 2>/dev/null
}

if metro_ok && tunnel_ok; then
  exit 0
fi

log "Preview unhealthy (metro=$([[ $(metro_ok && echo ok) || echo fail ]] tunnel=$([[ $(tunnel_ok && echo ok) || echo fail ]])) — ensuring tmux session"

if ! tmux_ok; then
  SESSION_NAME="peacezense-preview"
  tmux -f /exec-daemon/tmux.portal.conf new-session -d -s "$SESSION_NAME" -c "$ROOT_DIR" -- "${SHELL:-zsh}" -l
  tmux -f /exec-daemon/tmux.portal.conf send-keys -t "$SESSION_NAME:0.0" "cd $ROOT_DIR && npm run preview:persistent" C-m
  log "Started peacezense-preview tmux session"
else
  log "tmux session exists but unhealthy — restarting preview"
  tmux -f /exec-daemon/tmux.portal.conf send-keys -t peacezense-preview:0.0 C-c
  sleep 2
  tmux -f /exec-daemon/tmux.portal.conf send-keys -t peacezense-preview:0.0 "cd $ROOT_DIR && npm run preview:persistent" C-m
fi
