#!/bin/bash
# Run the program using docker
# $1 is the name of the image to run
docker run -it --rm -p 8080:8080 $1