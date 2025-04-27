# Set up our VPC (the virtual networking environment)
resource "aws_vpc" "main" {
    cidr_block           = "10.0.0.0/16"
}

# Set up our subnet (a defined zone within the environment, where we can place our virtual machine(s))
resource "aws_subnet" "subnet" {
    vpc_id                  = aws_vpc.main.id
    cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 1)
    map_public_ip_on_launch = true
    availability_zone       = var.az

}

# Create a gateway between the VPC and the internet
resource "aws_internet_gateway" "internet_gateway" {
    vpc_id = aws_vpc.main.id
}

# Create a route table, which allows us to configure the connections between elements in our VPC
resource "aws_route_table" "route_table" {
    vpc_id = aws_vpc.main.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.internet_gateway.id
    }
}
# Associate said route table with our subnet
resource "aws_route_table_association" "subnet_route" {
    subnet_id      = aws_subnet.subnet.id
    route_table_id = aws_route_table.route_table.id
}

# Create a security group: a collection of rules to determine which connections are allowed within our VPC
resource "aws_security_group" "security_group" {
    name   = "ecs-security-group"
    vpc_id = aws_vpc.main.id
}
# Allow all incoming connections on port 80 over TCP, which covers incoming HTTP requests.
resource "aws_vpc_security_group_ingress_rule" "ingress_rule" {
    security_group_id = aws_security_group.security_group.id
    cidr_ipv4   = "10.0.0.0/16"
    from_port   = 80
    ip_protocol = "tcp"
    to_port     = 80
}
# Allow all outgoing connections on port 80 over TCP, which covers outgoing HTTP requests.
resource "aws_vpc_security_group_egress_rule" "egress_rule" {
    security_group_id = aws_security_group.security_group.id
    cidr_ipv4   = "10.0.0.0/16"
    from_port   = 80
    ip_protocol = "tcp"
    to_port     = 80
}
