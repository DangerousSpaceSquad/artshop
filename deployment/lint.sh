#!/bin/bash
TAG=artshop:latest
MODE=$1
if [ -z "$MODE" ]
then
    echo "To only lint some code, enter 'BACKEND', 'FRONTEND', or 'ALL' as the first parameter for this script. Defaulting to 'ALL'."
    MODE=ALL
fi
if [[ "$MODE" =~ ^(BACKEND|ALL)$ ]];
then
    ./deployment/scripts/lint_frontend.sh
fi
if [[ "$MODE" =~ ^(FRONTEND|ALL)$ ]];
then
    ./deployment/scripts/lint_backend.sh
fi