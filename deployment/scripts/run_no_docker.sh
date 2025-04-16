#!/bin/bash
# Run the program without docker
cd artshop.Server/server
dotnet publish -c Release
dotnet run