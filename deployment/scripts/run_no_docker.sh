#!/bin/bash
# Run the program without docker
cd artshop.Server
dotnet publish -c Release
dotnet run