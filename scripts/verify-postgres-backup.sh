#!/usr/bin/env bash
# Create a custom-format dump and restore it into a fresh, socket-only PostgreSQL instance.
set -Eeuo pipefail
umask 077
if [[ $# != 4 ]]; then
  echo "Usage: $0 POSTGRES_CONTAINER DATABASE DB_USER EXISTING_PRIVATE_OUTPUT_DIRECTORY" >&2
  exit 2
fi
source_container=$1
database=$2
database_user=$3
output_dir=$(cd "$4" && pwd)
work_dir=$(mktemp -d "$output_dir/.endoora-restore.XXXXXXXX")
scratch=""
cleanup() {
  if [[ -n "$scratch" ]]; then
    docker exec --user postgres "$source_container" sh -c '
      if test -s "$1/data/postmaster.pid"; then pg_ctl -D "$1/data" -m fast -w stop >/dev/null || exit 1; fi
      rm -rf -- "$1"
    ' sh "$scratch" || echo "Check scratch cluster $scratch in $source_container" >&2
  fi
  rm -rf -- "$work_dir"
}
trap cleanup EXIT
docker exec "$source_container" pg_dump -Fc --no-owner --no-acl -U "$database_user" -d "$database" > "$work_dir/database.dump"
test -s "$work_dir/database.dump"
# Separate data directory, private Unix socket and explicitly empty TCP listen addresses.
scratch=$(docker exec --user postgres "$source_container" mktemp -d /tmp/endoora-drill.XXXXXXXX)
[[ "$scratch" =~ ^/tmp/endoora-drill\.[[:alnum:]]+$ ]]
docker exec --user postgres "$source_container" initdb -D "$scratch/data" -U postgres --auth-local=trust > /dev/null
docker exec --user postgres "$source_container" pg_ctl -D "$scratch/data" -l "$scratch/server.log" \
  -o "-k $scratch -p 55431 -c listen_addresses=''" -w start > /dev/null
target=(docker exec --user postgres "$source_container")
connection=(-h "$scratch" -p 55431 -U postgres)
"${target[@]}" createdb "${connection[@]}" restorecheck
docker exec -i --user postgres "$source_container" pg_restore "${connection[@]}" --exit-on-error --no-owner --no-acl -d restorecheck < "$work_dir/database.dump"
rows=$("${target[@]}" psql "${connection[@]}" -XAt -v ON_ERROR_STOP=1 -d restorecheck -c 'SELECT count(*) FROM django_migrations')
[[ "$rows" =~ ^[1-9][0-9]*$ ]]
"${target[@]}" psql "${connection[@]}" -XAt -v ON_ERROR_STOP=1 -d restorecheck -c 'SELECT count(*) FROM accounts_user' > /dev/null
stamp=$(date -u +%Y%m%dT%H%M%SZ)
dest=$(mktemp -d "$output_dir/verified-$stamp-XXXXXXXX")
# Move as a set so a consumer never mistakes a partial dump for a receipt.
(cd "$work_dir" && sha256sum database.dump > SHA256SUMS)
printf 'restored_migrations=%s\nverified_utc=%s\n' "$rows" "$stamp" > "$work_dir/restore.txt"
mv -T "$work_dir" "$dest"
echo "$dest"
