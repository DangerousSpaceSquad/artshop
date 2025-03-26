# Client

## About This Document

This document describes the behavior and organization of the server-side code.

## How it Works

* The code is written with .NET Core.
* The entrypoint for the code is `artshop.Server/Program.cs`.
* The architecture of the project is [MVC](https://developer.mozilla.org/en-US/docs/Glossary/MVC). Within this framework, the Model and Controller are supplied by the `artshop.Server` directory.

### Controllers

A controller is a backend class designed to handle API requests of a certain type.  
Each controller is bound to a certain route (the end of a url). The controller is designed to handle all web requests to that route.  
Within the controller class, there are multiple functions, each bound to a sub-route, which is a combination of a path and an HTTP method, such as `GET {url}/api/forecast`.  
For an annotated example of a controller in action, check `artshop.Server/Controllers/DemoController.cs`.  

### How to modify an existing route

1. Check to see if a controller for that route already exists in the `artshop.Server/Controllers` directory.
2. If it does, look for the matching route within that file.
3. Make any edits you'd like to the file. Fundamentally, route definitions are just functions, so they're simple to edit.

### How to add a new route

1. Look for a matching controller to add the route to. If none exist, create a new one in `artshop.Server/Controllers`.
2. Add a new function for your route to that file. Consider what parameters it needs, and create matching a matching route attribute, like the [HttpGet] ones in the `DemoController.cs`. Pay close attention to make sure that the system can differentiate between requests to your route and all other routes, since each route needs to be uniquely identifiable: if route A and route B are both intended to respond to any requests to `api/{parameter}`, then undefined behavior can result. Check the swagger page to be sure that everything works.
3. Write the function to take in any necessary parameters and return appropriate return values. The task of sending the right parameters and using the return value is up to the frontend, so make sure to properly document your function in appropriate comments.
