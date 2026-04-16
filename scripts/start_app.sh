#!/bin/sh

LOG_FILE="$(dirname "$0")/logs"
DATE="date +%F/%R:%S"

{
    cd "$(dirname "$0")/.." || exit 1
    docker compose start &&
        echo "[$($DATE)]" "App iniciada." ||
        echo "[$($DATE)]" "Inicio falló."
} 2>&1 | tee -a "$LOG_FILE"
