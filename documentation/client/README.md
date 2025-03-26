# Client

## About This Document

This document describes the behavior and organization of the client-side code.

## How it Works

* The code is primarily written using [React](https://react.dev/learn), which allows us to easily create dynamic HTML files which change in response to the data we supply them.
* The entrypoint of the code is `artshop.client/index.html`, which in turn calls `artshop.client/src/App.jsx`.
* The architecture of the project is [MVC](https://developer.mozilla.org/en-US/docs/Glossary/MVC). Within this framework, the `artshop.client` directory supplies the View.

### Components

Components in react are reusable sections of code for a webpage, like classes for HTML.  
The language used is JSX, which is a mix of JS and HTML.  
When writing frontend code, consider if it belongs in an existing component, or if it should be made into a new standalone component.  

### How to change the structure of an existing page

1. Find the source code of the page in question. If you don't know where the page is defined, start from the entrypoint (`artshop.client/index.html`) and follow the links between code files until you find the page in question. For example, to find the table in the template homepage, start from `index.html`, follow the link to `src/main.jsx`. This uses a custom component called "App", which is defined by `src/App.jsx`. In that file, the function returns the table in question at the end, which is defined in the middle of the file. *Note that this example may not remain accurate after extensive code rewrites, but the principle will stay the same.*
2. Add, remove, or manipulate the existing HTML elements, React components, and/or JS code as you see fit. As a rule of thumb, use HTML elements for static parts of the page, JS for dynamic parts of the page, and store reusable sections of code in React components.

### How to change the style of an existing page

1. At time of writing, the project uses plain CSS. As long as that's true, simply navigate to the relevant React file for the page/component in question and find the corresponding CSS file(s) defined in the header.
2. Edit these CSS files as you see fit, or add/remove more CSS files in the same way.

### How to create a new page

* This is a single page application (SPA), so don't make HTML pages from scratch. Instead, create the necessary components to achieve your goal, and swap out sections of the page with your component(s) as the user clicks on links. Single page applications use only one HTML page under the hood (for various reasons, mostly speed), but behave like multi-page applications to the user. For an example of how these work in practice, see [this guide](https://www.bairesdev.com/blog/react-spa-single-page-application/).
* Use [States](https://react.dev/learn/state-a-components-memory) to define persistent values. React components are frequently re-rendered to display changes, and this wipes the JS variables used within. States maintain information between these re-renders.
* Use [Effects](https://react.dev/reference/react/useEffect) to pull data from the backend. In React, an Effect is used to pull in data from any external source, especially when that data is subject to change depending on the information used in the page.
