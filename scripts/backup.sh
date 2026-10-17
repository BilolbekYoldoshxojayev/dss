#!/bin/bash
# NamPS OS — Automated PostgreSQL Backup Routine
# Usage: ./scripts/backup.sh

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/namps_os_backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "=== [NamPS OS] Starting database backup at $(date) ==="

# Check if running in Docker or host
if docker ps --format '{{.Names}}' | grep -q "namps_postgres"; then
  echo "Backing up from Docker container: namps_postgres..."
  docker exec -t namps_postgres pg_dump -U "${POSTGRES_USER:-namps_user}" "${POSTGRES_DB:-namps_os}" | gzip > "$BACKUP_FILE"
else
  echo "Backing up from host PostgreSQL..."
  pg_dump -U "${POSTGRES_USER:-namps_user}" "${POSTGRES_DB:-namps_os}" | gzip > "$BACKUP_FILE"
fi

echo "=== [NamPS OS] Backup successfully saved to: ${BACKUP_FILE} ==="
ls -lh "$BACKUP_FILE"
