FROM mcr.microsoft.com/dotnet/sdk:8.0  AS build

# Install NPM for building frontend
# From https://stackoverflow.com/questions/36399848/install-node-in-dockerfile
ENV NODE_VERSION=24.14.1
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version
# TODO: Remove the EF lines; migrations should be done manually on a persistent volume in future.
# This is here temporarily to allow the dockerized version of the code to run as intended.
RUN dotnet tool install --global dotnet-ef 
ENV PATH="$PATH:/root/.dotnet/tools"

WORKDIR /App
COPY artshop.server/server artshop.server/server/
COPY artshop.client artshop.client/
WORKDIR artshop.server/server
RUN dotnet publish --configuration Release -o out
# TODO: Remove this line, see above todo.
RUN dotnet ef database update

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build /App/artshop.server/server/out .
# TODO: Remove this line, see above todo.
COPY --from=build /App/artshop.server/server/artshoptest.db .
ENTRYPOINT ["dotnet", "artshop.server.dll"]
