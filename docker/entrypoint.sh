#!/bin/sh
set -e

DIST_DIR="/usr/share/nginx/html"
ENV_FILE="$DIST_DIR/env-config.js"

sed -i "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL:-}|g" "$ENV_FILE"

exec nginx -g "daemon off;"
