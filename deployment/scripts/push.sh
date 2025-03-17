#!/bin/bash
# Push the docker image to external repositories (i.e. ECR)
if [ -z "${AWS_ID}" ]
then
    echo "Please set the AWS_ID environment variable to the 12-digit AWS account ID, i.e. run 'export AWS_ID={12-digit ID}.'"
    exit 1
fi
TAG=artshop:prod
ECR_TAG=${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com/$TAG

echo "Pushing the container to ECR..."
aws ecr get-login-password \
    --region us-east-1 \
| docker login \
    --username AWS \
    --password-stdin ${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com
docker tag $TAG $ECR_TAG
docker push $ECR_TAG
echo "Successfully pushed the container to ECR."
exit 0