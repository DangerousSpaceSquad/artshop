# Client

## About This Document

This document describes the behavior and organization of the server-side code.

## How it Works

* The code is written with .NET Core.
* The entrypoint for the code is `artshop.Server/Program.cs`.
* The architecture of the project is [MVC](https://developer.mozilla.org/en-US/docs/Glossary/MVC). Within this framework, the Model and Controller are supplied by the `artshop.Server` directory.

### Debugging Tools

* Use [Swagger](https://swagger.io/) to debug API calls. To see the swagger page, launch the server in DEBUG mode and connect to `http://localhost:5185/swagger/index.html`. **Ensure you use the correct port, and use HTTP instead of HTTPS.**
* For reference for building controllers, check `artshop.Server/Controllers/DemoController.cs`.
