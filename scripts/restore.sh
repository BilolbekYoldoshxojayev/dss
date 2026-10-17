#!/bin/bash
# NamPS OS — Database Restoration Routine
# Usage: ./scripts/restore.sh ./backups/namps_os_backup_YYYYMMDD_HHMMSS.sql.gz

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Error: Please specify the backup file to restore."
  echo "Usage: ./scripts/restore.sh <path-to-backup.sql.gz>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: File $BACKUP_FILE does not exist."
  exit 1
fi

echo "=== [NamPS OS] Warning: Restoring database will overwrite current data! ==="
read -p "Are you sure you want to proceed? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

echo "=== Restoring database from: $BACKUP_FILE ==="

if docker ps --format '{{.Names}}' | grep -q "namps_postgres"; then
  echo "Restoring into Docker container: namps_postgres..."
  gunzip -c "$BACKUP_FILE" | docker exec -i namps_postgres psql -U "${POSTGRES_USER:-namps_user}" -d "${POSTGRES_DB:-namps_os}"
else
  echo "Restoring into host PostgreSQL..."
  gunzip -c "$BACKUP_FILE" | psql -U "${POSTGRES_USER:-namps_user}" -d "${POSTGRES_DB:-namps_os}"
fi

echo "=== [NamPS OS] Database restored successfully! ==="
