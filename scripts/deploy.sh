#!/bin/sh

set -x

LOG_FILE="$(dirname "$0")/logs"
DATE="date +%F/%R:%S"

{
    cd "$(dirname "$0")/.." || exit 1
    echo "[$($DATE)]" "Iniciando despliegue..."
    git pull origin main # Se activará en la EC2
    docker compose down &&
        docker compose up --build -d &&
        echo "[$($DATE)]" "Despliegue finalizado con éxito" ||
        echo "[$($DATE)]" "Despliegue fallido."
} 2>&1 | tee -a "$LOG_FILE"
