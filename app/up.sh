#! /bin/sh

if [ "$NODE_ENV" == "production" ]; then
  echo "Running in production mode on port $PORT"
  node dist/index.js
else
  echo "Running in development mode on port $PORT"
  ./node_modules/.bin/babel-watch src/index.js
fi
