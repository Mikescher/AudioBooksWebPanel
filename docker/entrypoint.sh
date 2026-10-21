#!/bin/sh
set -e

# Apache workers run as www-data and write the cache and the request log.
cachedir=$(php -r 'echo (require "/var/www/html/config.php")["datacache"];')
logfile=$(php -r 'echo (require "/var/www/html/config.php")["requestlog_path"];')

mkdir -p "$cachedir" "$(dirname "$logfile")"
touch "$logfile"
chown www-data:www-data "$cachedir" "$logfile"

exec docker-php-entrypoint "$@"
