# Set up our VPC (the virtual networking environment)
resource "aws_vpc" "artshop_vpc" {
    # The range of local IP addresses to assign to entities within our VPC
    cidr_block = var.cidr_range
    enable_dns_hostnames = true
    tags = {
        name = "main"
    }
}

# Set up our subnet (a defined zone within the environment, where we can place our virtual machine(s))
resource "aws_subnet" "artshop_subnet1" {
    vpc_id                  = aws_vpc.artshop_vpc.id
    # This subnet covers all local IPs in the range 10.0.1.X
    # For more info on this function, see https://developer.hashicorp.com/terraform/language/functions/cidrsubnet
    cidr_block              = cidrsubnet(aws_vpc.artshop_vpc.cidr_block, 8, 1)
    availability_zone       = "us-east-1a"
}
# Second subnet in a different AZ for reliability
resource "aws_subnet" "artshop_subnet2" {
    vpc_id                  = aws_vpc.artshop_vpc.id
    # This subnet covers all local IPs in the range 10.0.1.X
    # For more info on this function, see https://developer.hashicorp.com/terraform/language/functions/cidrsubnet
    cidr_block              = cidrsubnet(aws_vpc.artshop_vpc.cidr_block, 8, 2)
    availability_zone       = "us-east-1b"
}

# Create a gateway between the VPC and the internet
resource "aws_internet_gateway" "artshop_ig" {
    vpc_id = aws_vpc.artshop_vpc.id
}

# Create a route table, which allows us to configure the connections between elements in our VPC
resource "aws_route_table" "artshop_rt" {
    vpc_id = aws_vpc.artshop_vpc.id
    route {
        # The range of internet IPs to apply our connections to (all of them)
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.artshop_ig.id
    }
}
# Associate said route table with our subnets
resource "aws_route_table_association" "artshop_subnet_rt1" {
    subnet_id      = aws_subnet.artshop_subnet1.id
    route_table_id = aws_route_table.artshop_rt.id
}
resource "aws_route_table_association" "artshop_subnet_rt2" {
    subnet_id      = aws_subnet.artshop_subnet2.id
    route_table_id = aws_route_table.artshop_rt.id
}

# Create a security group: a collection of rules to determine which connections are allowed within our VPC
resource "aws_security_group" "artshop_sg" {
    name        = "artshop_sg"
    description = "Networking rules for the artshop web server"
    vpc_id      = aws_vpc.artshop_vpc.id
}
# TODO: Replace these with the intended port coverages, after proving concept.
# Allow all incoming connections on port 80 over TCP, which covers incoming HTTP requests.
resource "aws_vpc_security_group_ingress_rule" "ingress_rule" {
    security_group_id = aws_security_group.artshop_sg.id
    cidr_ipv4   = "0.0.0.0/0"
    from_port   = 0
    ip_protocol = -1
    to_port     = 0
}
# Allow all outgoing connections on port 80 over TCP, which covers outgoing HTTP requests.
resource "aws_vpc_security_group_egress_rule" "egress_rule" {
    security_group_id   = aws_security_group.artshop_sg.id
    cidr_ipv4           = "0.0.0.0/0"
    from_port           = 0
    ip_protocol         = -1
    to_port             = 0
}
