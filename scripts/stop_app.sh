#!/bin/sh
LOG_FILE="$(dirname "$0")/logs"
DATE="date +%F/%R:%S"

{
  cd "$(dirname "$0")/.." || exit 1
  docker compose stop &&
    echo "[$($DATE)]" "App detenida." ||
    echo "[$($DATE)]" "Detención falló."
} 2>&1 | tee -a "$LOG_FILE"
