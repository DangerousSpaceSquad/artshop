#!/bin/bash
# Run the program using docker
# $1 = The name of the image to run
docker run -it --rm -p 8080:8080 $1