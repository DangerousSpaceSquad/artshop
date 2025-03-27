#!/bin/bash
TAG=artshop:latest
MODE=$1
if [ -z "$MODE" ]
then
    echo "To only run some tests, enter 'BACKEND', 'FRONTEND', or 'ALL' as the first parameter for this script. Defaulting to 'ALL'."
    MODE=ALL
fi
if [[ "$MODE" =~ ^(BACKEND|ALL)$ ]];
then
    ./deployment/scripts/test_backend.sh
fi
if [[ "$MODE" =~ ^(FRONTEND|ALL)$ ]];
then
    ./deployment/scripts/test_frontend.sh
fi