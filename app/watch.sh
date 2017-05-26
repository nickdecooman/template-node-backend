#! /bin/bash

while [[ $# -gt 1 ]]
do
  key="$1"
  case $key in
    --watch)
    WATCH="$2"
    shift
    ;;
    --node_entry)
    ENTRY="$2"
    shift
    ;;
    *)
    ;;
  esac
  shift
done

./node_modules/.bin/gulp --silent --watch="${WATCH}" --node_entry="${ENTRY}"
