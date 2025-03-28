FROM mcr.microsoft.com/dotnet/sdk:8.0  AS build

# Install NPM for building frontend
# From https://stackoverflow.com/questions/36399848/install-node-in-dockerfile
ENV NODE_VERSION=23.8.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

WORKDIR /App
COPY ./artshop.server/server ./artshop.server/server/
COPY ./artshop.client ./artshop.client/
WORKDIR artshop.server/server
RUN dotnet publish --configuration Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build /App/artshop.server/server/out .
ENTRYPOINT ["dotnet", "artshop.server.dll"]
