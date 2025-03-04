#!/bin/bash
TAG=artshop:latest
./deployment/scripts/containerize.sh $TAG && \
./deployment/scripts/push $TAG && \
./deployment/scripts/run_docker.sh $TAG