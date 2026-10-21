# Floating tag on purpose: every `make docker` (builds with --pull) picks up the newest PHP 8 release.
FROM php:8-apache

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

COPY .htaccess index.php ./
COPY ajax/  ./ajax/
COPY data/  ./data/
COPY model/ ./model/
COPY sql/   ./sql/
COPY config.production.php ./config.php
COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/abwp-entrypoint

ARG COMMIT_ID=""
ENV COMMIT_ID=$COMMIT_ID

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS -o /dev/null http://localhost/data/icon_audio.png || exit 1
ENTRYPOINT ["abwp-entrypoint"]
CMD ["apache2-foreground"]
