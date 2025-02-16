#!/bin/bash
# Publish the program to a docker image
# $1 is the name and/or tag of the image repository, i.e. "{name}:{tag}"
docker build -t $1 -f Dockerfile .