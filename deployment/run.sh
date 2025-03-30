#!/bin/bash
TAG=artshop:latest
MODE=$1
if [ -z "$MODE" ]
then
    echo "To set the build environment, run this script with \`DEBUG\` (faster, debugging tools), \`STAGE\` (slower, realistic enviroment), or \`PROD\` (deploy to production) as the first argument. Defaulting to \`STAGE\`."
    MODE=STAGE
fi
echo $MODE
if [ "$MODE" == "STAGE" ]
then
    ./deployment/scripts/containerize.sh $TAG && \
    ./deployment/scripts/run_docker.sh $TAG
elif [ "$MODE" == "DEBUG" ]
then
    ./deployment/scripts/run_no_docker.sh
else
    echo "Unrecognized parameter $MODE, exiting..."
    exit 1
fi