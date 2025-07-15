# Artshop

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About the Project

The Artshop project is an online storefront designed to sell artwork products, such as prints and posters.

The project uses a microservice architecture, with the frontend written with React, the backend with ASP.NET Core, and the database with PostgreSQL. The project also has a CI/CD pipeline made with Terraform, Bash, and Docker, which deploys the server to a scalable cluster of virtual machines in AWS EC2. This project was created by Kyle Reto (@KyleReto), who created the backend, CI/CD, and backend; and Christopher Dean (@ChristopherADean), who created the frontend.

### Built With

* [![Dotnet][Dotnet-shield]][Dotnet-url]
* [![React][React-shield]][React-url]
* [![Docker][Docker-shield]][Docker-url]
* [![Terraform][Terraform-shield]][Terraform-url]

## Getting Started

To run the website locally, follow these steps. These steps describe running the website with Docker; running on bare metal is not supported at this time.

### Prerequisites

* Ensure that you have [Docker](https://docs.docker.com/desktop/setup/install/) installed.
* Ensure that you've cloned the repo. If you don't know how, use [this guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

### Installation

1. Ensure that you have Docker running.
2. Run `./deployment/run.sh` from the `artshop` directory, in Bash.
3. Connect to <http://localhost:8080> in your web browser of choice.

## Contributing

If you've been invited to collaborate, check the GitHub Project to see what features need to be added. To add a feature, take the following steps:

1. [Create a new branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository). There are lots of ways to do this, but if you've already downloaded/cloned the project, the easiest is:  
    * With the project open in VSCode,  
    * Click the branch symbol at the bottom left.  
    * Click "Create new branch..."  
    * Name the branch after the feature you want to add, e.g. `ImageCarousel`.
2. Make any changes you'd like. Remember that we follow test driven development, so design your tests *before* your code if at all possible.
    * Check the `/documentation/` directory for any relevant documentation.
3. Run the tests and ensure your code passes.
    * Use `./deployment/lint.sh` to lint (style check) your code.
    * Use `./deployment/test.sh` to test your code.
4. Push your changes.  
    * In VSCode, go to the Source Control tab by clicking the branching symbol on the left pane.
    * Commit your changes to your branch.
    * Click the push arrow at the bottom left to upload your changes to the github repo.
    * Repeat steps 2 though 4 as many times as you like while you develop parts of your new feature.
5. Once the feature is done, submit a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) in github.
    * Once reviewed and tested, your changes will automatically appear on the live version of the site.

## License

WIP

## Contact

WIP

## Acknowledgements

This Readme is based on the [Best README Template](https://github.com/othneildrew/Best-README-Template).

[Dotnet-shield]: https://img.shields.io/badge/ASP.NET%20Core-1f1f1f?style=for-the-badge&logo=.net&logoColor=ac99ea
[Dotnet-url]: https://dotnet.microsoft.com/en-us/
[React-shield]: https://img.shields.io/badge/React-22262e?style=for-the-badge&logo=React&logoColor=58c4dc
[React-url]: https://react.dev/
[Docker-shield]: https://img.shields.io/badge/Docker-225dfd?style=for-the-badge&logo=Docker&logoColor=ffffff
[Docker-url]: https://www.docker.com/
[Terraform-shield]: https://img.shields.io/badge/Terraform-15181e?style=for-the-badge&logo=Terraform&logoColor=7b42bc
[Terraform-url]: https://developer.hashicorp.com/terraform
