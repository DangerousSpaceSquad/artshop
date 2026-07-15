#!/bin/bash
# Run the program using docker
# $1 is the name of the image to run
if [ -z "${SQUARE_TOKEN}" ]
then
    echo "Square API key not set, some backend features may not work correctly. To fix this, ensure that the 'SQUARE_TOKEN' environment variable is set."
fi

PROD=$2
if [ -z "$PROD" ]
then
    docker run -it --rm -p 8080:8080 -e ASPNETCORE_HTTP_PORTS=8080 -e SQUARE_TOKEN=${SQUARE_TOKEN} -e ASPNETCORE_ENVIRONMENT=Development $1
else
    docker run --rm -p 8080:8080 -e ASPNETCORE_HTTP_PORTS=8080 -e SQUARE_TOKEN=${SQUARE_TOKEN} $1
fi
