#!/bin/sh
docker compose stop &&
  echo "App detenida." || echo "Detención falló."
