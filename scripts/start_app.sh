#!/bin/sh

LOG_FILE="$(dirname "$0")/logs"
DATE="date +%F/%R:%S"

{
    docker compose start &&
        echo "[$($DATE)]" "App iniciada." ||
        echo "[$($DATE)]" "Inicio falló."
} 2>&1 | tee -a "$LOG_FILE"
