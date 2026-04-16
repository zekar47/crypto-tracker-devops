#!/bin/sh
# Obtener el Account ID dinámicamente para el nombre del bucket
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="crypto-tracker-logs-$ACCOUNT_ID"
LOG_SOURCE="/home/ubuntu/crypto-tracker-devops/backend/logs/app.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "--- Iniciando Backup de Logs: $(date) ---"

# Verificar si el archivo de logs existe
if [ -f "$LOG_SOURCE" ]; then
    # Subir a S3 con un timestamp para no sobrescribir
    aws s3 cp "$LOG_SOURCE" "s3://$BUCKET_NAME/backups/app_$TIMESTAMP.log"

    if [ $? -eq 0 ]; then
        echo "✅ Backup exitoso: app_$TIMESTAMP.log"
    else
        echo "❌ Error al subir a S3"
    fi
else
    echo "⚠️ Archivo de logs no encontrado en $LOG_SOURCE"
fi
