#!/bin/bash
# Run the program without docker
cd artshop.Server/server
# Migrate the database schema.
dotnet ef database update
dotnet publish -c Release
dotnet run