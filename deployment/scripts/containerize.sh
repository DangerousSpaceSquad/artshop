#!/bin/bash
# Publish the program to a docker image
TAG=artshop:latest
echo "Building the container..."
docker build --rm -t $TAG -f Dockerfile .
exit 0