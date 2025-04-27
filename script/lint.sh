#!/bin/bash
TAG=artshop:latest
MODE=$1
if [ -z "$MODE" ]
then
    # No other linting is necessary right now, so no need to specify.
    MODE=ALL
fi
if [[ "$MODE" =~ ^(FRONTEND|ALL)$ ]];
then
    ./script/helpers/lint_frontend.sh
fi