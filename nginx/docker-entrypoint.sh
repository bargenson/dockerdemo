#!/bin/bash

set -e

if [ "$1" = 'start' ]; then
  consul-template -consul $CONSUL_HOST:$CONSUL_PORT \
    -template "/tmp/nginx.conf.ctmpl:/etc/nginx/nginx.conf:service nginx reload" &
  exec nginx -g "daemon off;"
fi

exec "$@"
