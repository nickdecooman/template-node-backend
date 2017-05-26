#! /bin/sh

. .env.system

# TODO: Change to docker-compose run in case container is not running

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
docker-compose -p ${NAME} -f ${DIR}/dc.dev.yml exec node yarn test
