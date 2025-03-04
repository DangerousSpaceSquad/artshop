# Structure

## About This Document

This document is **authoritative** — if it disagrees with any code, the discrepancy is a bug in the code.  
This document describes the design of the infrastructure of the project. This means the various services and flows used to get the website running and keep it running.

## How it Works

The full deployment process should look like this:

1. After passing all tests locally, your code is updated and is ready for deployment.
2. An image for a container is created using [Docker](https://www.docker.com/get-started/).
    * More specifically, the code is first placed into a temporary container, where it code is *published*, i.e. compiled into an executable file. This is done to guarantee that the building process works the same on any system.
    * This executable file is then made into an image, and the temporary container is discarded. This new image is as small as possible, which means instantiating it will be faster and storing it will be cheaper.
3. This image is uploaded to [ECR](https://aws.amazon.com/ecr/), which stores it until it is needed. **<-- We are here**.
4. [Terraform](https://www.terraform.io/) is used to keep one or more virtual machines running using [EC2](https://aws.amazon.com/ec2/). Each virtual machine runs one or more containers within it.
5. When the ECR image updates, Terraform will gradually stop the existing containers and start new ones running the new version of the program.
6. After a few minutes, all clients will see the updated version of the website.

* When testing locally, the process stops after step 1. This only takes a few seconds to run, but is the least similar to a real deployment environment. For these tests, you can expect a fair number of false positives and negatives in testing from OS issues, conflicting libraries, and many other sources.
* When testing using Docker, the process stops after step 2. The environment will be nearly identical to the real thing, but it can take a few minutes to set up. For these tests, you can expect that almost every test will pass or fail just as it would on the live server. The exceptions will be things like race conditions, latency, and other rare issues.
* After pushing code to github, the CI pipeline will perform the entire deployment process, including putting the code on a real server and testing it there. You can expect this process to take up to 30 minutes. Within a rounding error, you can expect that every test here will behave the same as it will in the real enviroment. Only persistent data will be different, such as database or disk contents.
* Once all tests pass in the CI pipeline, the code will be greenlit to go through the CD pipeline, which performs the deployment in full to prod.
