### AWS
variable "region" {
    default = "us-east-1"
}

### VPC
variable "cidr_range" {
    # equivalent to the range 10.0.X.X
    default = "10.0.0.0/16"
}

### EC2
variable "instance_type" {
    # At time of writing (4/28/25), the best options are:
    # t2.micro - free for 1yr, then $101.62/yr afterward. A fair amount of RAM.
    # t4g.nano - Never free, but only $36.79/yr. Less RAM, but better CPU and networking.
    default = "t2.medium"
}
variable "ami" {
    # Amazon Linux 2023 x86. ARM may be faster and/or cheaper, but may cause issues.
    default = "ami-062c116e449466e7f"
}
variable "volume_type" {
    # At time of writing (4/28/25), the best option is gp3 (Free for 1yr, then $0.08/GB/mo)
    default = "gp3"
}
variable "volume_size" {
    # $7.68/yr. Must be greater than 30 for ECS.
    default = 30
}
variable "launch_data" {
    default = <<EOT
"#!/bin/bash
echo ECS_CLUSTER=my-ecs-cluster >> /etc/ecs/ecs.config"
EOT
}