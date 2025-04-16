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
    ./deployment/scripts/lint_frontend.sh
fi