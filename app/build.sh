#! /bin/sh

if [ "$NODE_ENV" == "production" ]; then
  echo "Building in production mode"
  NODE_ENV=development yarn install;
  ./node_modules/.bin/babel ./src -d build
  rm -rf src .babelrc .flowconfig .eslintrc .eslintignore __mocks__ __tests__ yarn.lock package.json
  rm -- "$0"
else
  echo "Building in development mode"
  yarn install
fi
