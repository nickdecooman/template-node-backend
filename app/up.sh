#! /bin/sh

if [ "$NODE_ENV" == "production" ]; then
  echo "Running in production mode on port $PORT"
  node dist/index.js
else
  ./watch.sh
fi
