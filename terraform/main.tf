# TF scripts based partially on this guide: https://spacelift.io/blog/terraform-ecs
# Note that the guide is a bit out of date, and many modifications have been made in these scripts for various reasons.

# Generate the launch template for ec2, which defines exactly what our virtual machines should look like.
resource "aws_launch_template" "artshop_lt" {
    name_prefix   = "artshop_ecs"
    image_id      = var.ami
    instance_type = var.instance_type
    # TODO: Remove SSH key entirely
    key_name               = "login"
    vpc_security_group_ids = [aws_security_group.artshop_sg.id]
    # This role *should* exist on most AWS accounts.
    # TODO: Generate a valid role automatically, rather than relying on this one.
    iam_instance_profile {
        name = "ecsInstanceRole"
    }
    block_device_mappings {
        device_name = "/dev/xvda"
        ebs {
            # 30 is the minimum for ECS
            volume_size = var.volume_size
            volume_type = var.volume_type
        }
    }
    tag_specifications {
        resource_type = "instance"
        tags = {
            Name = "ecs-instance"
        }
    }
    # We have to create a specific file on the instance to allow ECS to detect it.
    user_data = base64encode(var.launch_data)
}

# Create the autoscaling group, which automatically provisions a certain number of EC2 instances based on our template as needed.
resource "aws_autoscaling_group" "artshop_ecs_asg" {
    vpc_zone_identifier = [aws_subnet.artshop_subnet1.id, aws_subnet.artshop_subnet2.id]
    desired_capacity    = 1
    max_size            = 1
    min_size            = 0
    launch_template {
        id      = aws_launch_template.artshop_lt.id
        version = "$Latest"
    }
    tag {
        key                 = "AmazonECSManaged"
        value               = true
        propagate_at_launch = true
    }
}

# Create an ECS cluster, which is a group of places where containers can run.
resource "aws_ecs_cluster" "artshop_ecs_cluster" {
    name = "artshop_ecs_cluster"
}

# Assign the autoscaling group as a valid place to run containers for ECS.
resource "aws_ecs_capacity_provider" "artshop_asg_capacity" {
    name = "artshop_ecs_asg_capacity"
    auto_scaling_group_provider {
        auto_scaling_group_arn = aws_autoscaling_group.artshop_ecs_asg.arn
        managed_scaling {
            maximum_scaling_step_size = 1000
            minimum_scaling_step_size = 1
            status                    = "ENABLED"
            target_capacity           = 1
        }
    }
}
# Link the ECS cluster to the autoscaling group we just made
resource "aws_ecs_cluster_capacity_providers" "artshop_capacity_providers" {
    cluster_name = aws_ecs_cluster.artshop_ecs_cluster.name
    capacity_providers = [aws_ecs_capacity_provider.artshop_asg_capacity.name]
    default_capacity_provider_strategy {
        base              = 1
        weight            = 100
        capacity_provider = aws_ecs_capacity_provider.artshop_asg_capacity.name
    }
}

# Create an ECS task for the web server, which defines which containers need to run for the web server to work.
resource "aws_ecs_task_definition" "artshop_ecs_task_def" {
    family             = "artshop_ecs_task"
    network_mode       = "awsvpc"
    execution_role_arn = "arn:aws:iam::677945130383:role/ecsTaskExecutionRole"
    # 0.5 vCPU
    cpu                = 512
    runtime_platform {
        operating_system_family = "LINUX"
        cpu_architecture        = "X86_64"
    }
    # Only one container for now; the web server.
    container_definitions = jsonencode([{
        name      = "artshop_webserver"
        image     = "677945130383.dkr.ecr.us-east-1.amazonaws.com/artshop"
        cpu       = 512
        memory    = 3072
        essential = true
        portMappings = [{
            containerPort = 80
            hostPort      = 80
            protocol      = "tcp"
        }]
    }])
}

# Create an ECS service for the web server, which assigns the task to the cluster
resource "aws_ecs_service" "ecs_service" {
    name            = "artshop_ecs_service"
    cluster         = aws_ecs_cluster.artshop_ecs_cluster.id
    task_definition = aws_ecs_task_definition.artshop_ecs_task_def.arn
    desired_count   = 2
    network_configuration {
        subnets         = [aws_subnet.artshop_subnet1.id, aws_subnet.artshop_subnet2.id]
        security_groups = [aws_security_group.artshop_sg.id]
    }
    force_new_deployment = true
    placement_constraints {
        type = "distinctInstance"
    }
    triggers = {
        redeployment = timestamp()
    }
    capacity_provider_strategy {
        capacity_provider = aws_ecs_capacity_provider.artshop_asg_capacity.name
        weight            = 100
    }
    depends_on = [aws_autoscaling_group.artshop_ecs_asg]
}