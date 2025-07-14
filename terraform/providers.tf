terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~>3.4.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.96.0"
    }
  }
}

provider "docker" {}

provider "aws" {
    region = var.region
    default_tags {
        tags = {
            project = "artshop"
        }
    }
}