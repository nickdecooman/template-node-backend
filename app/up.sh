#! /bin/sh

if [ "$NODE_ENV" == "production" ]; then
  echo "Running in production mode on port $PORT"
  node build/index.js
else
  ./node_modules/.bin/watch
fi
