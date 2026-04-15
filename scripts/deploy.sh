#!/bin/sh
echo "Iniciando despliegue..."
git pull origin main # Se activará en la EC2
docker compose down &&
  docker compose up --build -d &&
  echo "Despliegue finalizado con éxito" ||
  echo "Despliegue fallido."
