#!/bin/bash

set -e

if [ "$1" = 'start' ]; then
  exec node bin/www
fi

exec "$@"
