#!/bin/bash
set -e
TAG=artshop:latest
MODE=$1
if [ -z "$MODE" ]
then
    echo "To only run some tests, enter 'BACKEND', 'FRONTEND', or 'ALL' as the first parameter for this script. Defaulting to 'ALL'."
    MODE=ALL
fi
if [[ "$MODE" =~ ^(BACKEND|ALL)$ ]];
then
    ./script/helpers/test_backend.sh
fi
if [[ "$MODE" =~ ^(FRONTEND|ALL)$ ]];
then
    ./script/helpers/test_frontend.sh
fi