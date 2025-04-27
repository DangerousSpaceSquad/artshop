#!/bin/bash
# Publish the program to a docker image
# $1 is the tag to use for the image
docker build --rm -t $1 -f Dockerfile .
exit 0